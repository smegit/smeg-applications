/**
 * Class to initiate Valence Portal security, UI, and all related Portal tasks.
 */
Ext.define('Valence.login.Processor', {
    singleton : true,
    requires  : [
        'Valence.util.Helper',
        'Valence.common.util.Helper',
        'Valence.locale.en',
        'Valence.login.AppUmbrella',
        'Valence.login.config.Runtime',
        'Valence.login.config.Settings',
        'Valence.login.store.Languages',
        'Valence.login.util.Helper',
        'Valence.login.store.Connections',
        'Valence.login.store.Login_Environments',
        'Valence.login.view.login.Login',
        //'Valence.login.view.phone.login.Login',
        //'Valence.login.view.phone.connection.Connection',
        //'Valence.login.view.tablet.login.Login',
        //'Valence.login.view.tablet.connection.Connection'

    ],
    config    : {
        appId             : null,
        appUmbrella       : null,
        autoLogout        : null,
        bypassLogin       : false,
        bypassReuseSid    : false,
        callback          : null,
        connectionName    : null,
        customSid         : '',
        featureCode       : null,
        forcePrompt       : false,
        forgotPassword    : true,
        hook              : '',
        hostUrl           : '',
        image             : null,
        isLicensedProduct : false,
        isRunningInPortal : false,
        language          : '',
        namespace         : '',
        mode              : 'desktop',
        options           : {},
        password          : null,
        productGroup      : 0,
        renderTo          : null,
        scope             : null,
        sid               : null,
        theme             : '',
        themePath         : null,
        username          : '',
        version           : null
    },
    scripts   : [],

    applyMode : function (mode) {
        Valence.login.config.Runtime.setIsDesktop(mode === 'desktop');
        Valence.login.config.Runtime.setIsMobile(mode !== 'desktop');
        return mode;
    },

    applyNamespace : function (ns) {
        Valence.login.config.Runtime.setNamespace(ns);
        return ns;
    },

    applyOptions : function (o) {
        var me = this;

        // reset any necessary configs...
        //
        me.setBypassLogin(false);

        if (!Ext.isEmpty(o.appId)){
            me.setAppId(o.appId);
        }

        if (o.callback) {
            me.setCallback(o.callback);
        }
        if (!Ext.isEmpty(o.forgotPassword)) {
            me.setForgotPassword(o.forgotPassword);
        }
        if (o.hook) {
            me.setHook(o.hook);
        }
        me.setImage(o.image || '/resources/images/valence_logo.png');
        if (o.mode) {
            me.setMode(o.mode);
        }
        if (o.namespace) {
            me.setNamespace(o.namespace);
        }
        if (o.scope) {
            me.setScope(o.scope);
        }
        if (o.username) {
            me.setUsername(o.username);
        } else if (Ext.isEmpty(me.getUsername())){
            //check last login user via local storage
            //
            var lastLoginUser = localStorage.getItem('lastLoginUser');
            if (!Ext.isEmpty(lastLoginUser)){
                me.setUsername(lastLoginUser);
            }
        }

        if (Ext.isEmpty(o.hostUrl)) {
            o.hostUrl = window.location.origin ||
                window.location.protocol +
                "//" +
                window.location.hostname +
                (window.location.port ? ':' + window.location.port : '');
        }
        me.setHostUrl(o.hostUrl);

        if (o.version) {
            me.setVersion(o.version);
        }

        if (o.connectionName) {
            me.setConnectionName(o.connectionName);
        }

        if (o.renderTo) {
            me.setRenderTo(o.renderTo);
        } else {
            me.setRenderTo((Ext.isModern) ? Ext.Viewport.el : Ext.getBody())
        }

        if (o.themePath) {
            me.setThemePath(o.themePath);
        }

        if (!Ext.isEmpty(o.isLicensedProduct)){
            me.setIsLicensedProduct(o.isLicensedProduct);
        }

        if (!Ext.isEmpty(o.productGroup)){
            me.setProductGroup(o.productGroup);
        }

        if (!Ext.isEmpty(o.featureCode)){
            me.setFeatureCode(o.featureCode);
        }

        return o;
    },

    checkHookForImage : function () {
        var me   = this,
            hook = (!Ext.isEmpty(Valence) && !Ext.isEmpty(Valence.Hook)) ? Valence.Hook : null,
            value;

        if (!Ext.isEmpty(hook) && !Ext.isEmpty(hook.ui) && !Ext.isEmpty(hook.ui.loginLogoUrl)) {
            var theme = me.getTheme(),
                value = hook.ui.loginLogoUrl;

            if (value) {
                // check for theme...
                //
                if (!Ext.isEmpty(value[theme])) {
                    value = value[theme];
                } else {
                    // override to default theme...
                    //
                    value = value['default'];
                }
            }
        }

        if (!Ext.isEmpty(value)) {
            me.setImage(value);
        }
    },

    createUUID : function () {
        var s         = [],
            hexDigits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 62), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

        return s.join("");
    },

    /**
     * Initiate the process.  This MUST be called by any application using this package and will initate the following processes:
     * - Create or reuse "sid" (session identifier)
     * - Create security token
     * - Load optional "Hook" js file to override functionality
     * - Retrieve Valence Portal settings
     * - Load the locales file based on the language selected
     * - Load optional "theme" file based on the url (theme=XXXX)
     * - Change the favicon based on Portal settings (may be overriden by the Hook)
     * - Instantiate an app controller (AppUmbrella) to control Portal tasks such as polling, locking, etc..
     * - If necessary, render a login screen
     * - Upon successful authentication, create a "loginData" object available through Valence.login.config.Runtime.getLoginData()
     * - If applicable, setup onunload routines to logout of the session upon closing the browser tab
     * - Process the callback passed to the "init" function. This should contain the creation of the application.
     * - Startup the necessary tasks for Portal security.
     *
     * ## Example usage
     *      Valence.login.Processor.init({
     *          namespace     : 'OrderEntry',
     *          callback      : function () {
     *              Ext.create('OrderEntry.view.main.Main');
     *          }
     *       }
     *   });
     *
     * @param {Object} config The following config values are supported:
     * @param {Function} [config.callback] The function to execute after the user has been successfully logged in.
     * @param {Object} [config.scope=this] The scope to execute the callback in.
     * @param {String} config.namespace The namespace of the application using this package. For example: Portal, CustomerInquiry, MyApp, etc...
     * @param {String} [config.hook] The URL of a "hook" file to load. NOTE: if "hook" is specified on the url this will be overriden.
     * @param {String} [config.mode=desktop] "desktop" or "mobile"
     * @param {Boolean} [config.poll=true] Enable polling.
     * @param {Object} [config.autoLock=true] Enable auto-lock of the session.
     * @param {Object} [config.autoLogout=true] Enable auto-logout of the session.
     * @param {Object} [config.forgotPassword=true] Enable forgot password functionality.
     * @param {Boolean} [config.manageIframes=false] Enable timer and 5250 cleanup for iframes. This is likely only necessary for the Valence Portal.
     * @param {String} [config.hostUrl] For mobile. Provide the host url/connection.
     * @param {String} [config.connectionName] The name of the connection.
     * @param {String} [config.version] Version number of the application.
     * @param {String} [config.username] Default the username.
     * @param {Object} [config.renderTo=Ext.getBody()] The element to render the login form to.
     */
    init : function (o) {
        var me = this;
        Ext.applyIf(o, {
            scope         : me,
            mode          : 'desktop',
            poll          : true,
            autoLock      : true,
            autoLogout    : true,
            manageIframes : false
        });

        //setup history
        //
        Ext.util.History.add('login');

        //if the user is hitting the back button and is logged in then just go forward back to main
        //
        window.onpopstate = function (event) {
            if (document.location.hash === '#login') {
                if (Valence.login.config.Runtime.getIsConnected()) {
                    setTimeout(function () {
                        Ext.util.History.forward();
                    }, 0);
                }
                return false;
            }
        };

        me.setOptions(o);
        me.processUrl()
            .then(me.processConnections)
            .then(me.processHook)
            .then(me.processSid)
            .then(Ext.bind(me.processAutoLogin, me))
            .then(me.processToken)
            .then(me.processSettings)
            .then(me.processStandaloneV03)
            .then(me.processLanguage)
            .then(me.processLocale)
            .then(me.processTheme)
            .then(me.processFavicon)
            .then(me.processAppUmbrella)
            .then(me.processView)
            .then(me.processLoginData)
            .then(me.processUnload)
            .then(me.processCallback)
            .then(me.processAppTasks)
            .then(function () {
                Ext.util.History.add('main');
            }, me.processFailure);
    },

    isPortal : function () {
        return Valence.login.config.Runtime.getNamespace() === 'Portal';
    },

    processAppTasks : function (content) {
        var me       = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            ctl      = me.getAppUmbrella();

        ctl.initTasks();
        deferred.resolve(content);
        return deferred.promise;
    },

    processAppUmbrella : function (content) {
        var me       = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            options  = me.getOptions();

        me.setAppUmbrella(Ext.create('Valence.login.AppUmbrella'));

        me.getAppUmbrella().init(options);
        deferred.resolve(content);
        return deferred.promise;
    },

    processCallback : function (content) {
        var me       = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            cb       = me.getCallback(),
            scope    = me.getScope() || content.scope;

        if (cb && !content.stopCallback) {
            if (Ext.isModern) {
                Ext.Viewport.unmask();
            }
            Ext.callback(cb, scope);
        }
        deferred.resolve(content);
        return deferred.promise;
    },

    processConnections : function (content) {
        var me       = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            cfg, rec, store, cmp, hostUrl, url, port, desc, updateUrl;

        if (me.getNamespace() == 'Portal' && Ext.isModern && (Ext.os.name == 'iOS' || Ext.os.name == 'Android')) {
            updateUrl = function (recs, ops, success) {
                if (!success || store.getCount() == 0) {
                    // todo -- uncomment and remove if for production
                    //
                    //if (me.getHostUrl() != 'http://192.168.75.14:6050') {
                    //    me.setHostUrl('');
                    //}

                    Ext.Viewport.unmask();
                    cfg = {
                        xtype      : 'connection',
                        fullScreen : true,
                        viewModel  : {
                            data : {
                                // needs to be set to hide the remove button
                                //
                                inConnectionEditMode : false
                            }
                        },
                        listeners  : {
                            connectionadded    : function (cmp, vals) {
                                hostUrl = vals.url + ':' + vals.port;
                                Ext.Ajax.request({
                                    url     : hostUrl + '/valence/vvlogin.pgm',
                                    params  : {
                                        action : 'getSettings'
                                    },
                                    success : function () {
                                        cmp.destroy();
                                        store.add(vals);
                                        store.sync();
                                        Ext.Viewport.mask({
                                            indicator : true,
                                            xtype     : 'loadmask',
                                            message   : Valence.lang.lit.loading
                                        });
                                        deferred.resolve(content);
                                        me.setOptions(Ext.apply(me.getOptions(), {hostUrl : hostUrl}));
                                        me.setHostUrl(hostUrl);
                                    },
                                    failure : function () {
                                        Valence.common.util.Dialog.show({
                                            title   : Valence.lang.lit.invalidConnection,
                                            msg     : 'Cannot connect to ' + vals.desc,
                                            buttons : ['->', {
                                                text : Valence.lang.lit.ok
                                            }]
                                        });
                                    }
                                });
                            },
                            connectionfromlink : function () {
                                rec = store.findRecord('selected', true);
                                if (Ext.isEmpty(rec) && store.getCount() > 0) {
                                    rec = store.getAt(0);
                                    rec.set('selected', true);
                                    rec.commit();
                                    store.sync();
                                }
                                hostUrl = rec.get('url') + ":" + rec.get('port');

                                me.setOptions(Ext.apply(me.getOptions(), {hostUrl : hostUrl}));
                                me.setHostUrl(hostUrl);
                                cmp.destroy();
                                Ext.Viewport.mask({
                                    indicator : true,
                                    xtype     : 'loadmask',
                                    message   : Valence.lang.lit.loading
                                });
                                deferred.resolve(content);
                            },
                            scope              : me
                        }
                    };
                    cmp = Ext.Viewport.add(cfg);
                } else {
                    rec = store.findRecord('selected', true);
                    if (Ext.isEmpty(rec)) {
                        rec = store.getAt(0);
                        rec.set('selected', true);
                        rec.commit();
                        store.sync();
                    }
                    desc = rec.get('desc');
                    Ext.Viewport.mask({
                        indicator : true,
                        xtype     : 'loadmask',
                        message   : 'Checking ' + desc
                    });
                    hostUrl = rec.get('url') + ':' + rec.get('port');
                    me.setHostUrl(hostUrl);
                    me.setOptions(Ext.apply(me.getOptions(), {hostUrl : hostUrl}));
                    Ext.Ajax.request({
                        url     : hostUrl + '/valence/vvlogin.pgm',
                        params  : {
                            action : 'getSettings'
                        },
                        success : function () {
                            rec.set('invalid', false);
                            store.sync();
                            Ext.Viewport.mask({
                                indicator : true,
                                xtype     : 'loadmask',
                                message   : Valence.lang.lit.loading
                            });
                            deferred.resolve(content);
                        },
                        failure : function () {
                            me.setHostUrl('');
                            rec.set('invalid', true);
                            store.sync();
                            Ext.Viewport.mask({
                                indicator : true,
                                xtype     : 'loadmask',
                                message   : Valence.lang.lit.loading
                            });
                            deferred.resolve(content);
                        }
                    });
                }
            };
            Valence.login.config.Settings.setLockConnections(localStorage.getItem('vvlocked') == 'true');
            Ext.Viewport.mask({
                indicator : true,
                xtype     : 'loadmask',
                message   : Valence.lang.lit.loading
            });
            store = Ext.getStore('Connections');
            if (Ext.isEmpty(store)) {
                store = Ext.create('Valence.login.store.Connections');
            }
            if (!store.isLoaded()) {
                store.load({
                    callback : function (recs, operation, success) {
                        updateUrl(recs, operation, success);
                    }
                });
            } else {
                updateUrl(null, null, true);
            }

        } else {
            deferred.resolve(content);
        }

        return deferred.promise;
    },

    processFailure : function (content) {
        var me    = content.scope,
            cb    = me.getCallback(),
            scope = me.getScope() || content.scope;

        if (content.processLocale) {
            me.processLocale(content);
        }
        if (content.processTheme) {
            me.processTheme(content);
        }
        if (content.processSettings){
            me.processSettings(content)
                .then(function(content){
                    if (content.executeCallback){
                        me.processCallback(content);
                    }
                });
        } else {
            if (content.executeCallback){
                me.processCallback(content);
            }
        }
        if (!content.controlledError) {
            Ext.log({
                msg : 'Error occurred during login "Processor"'
            });
        }
    },

    processFavicon : function (content) {
        var me       = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            link     = document.createElement('link');

        link.type = 'image/x-icon';
        link.rel  = 'shortcut icon';
        link.href = Valence.login.config.Settings.getFavicon();
        document.getElementsByTagName('head')[0].appendChild(link);

        deferred.resolve(content);
        return deferred.promise;
    },

    processHook : function (content) {
        var me        = content.scope,
            deferred  = Ext.create('Ext.Deferred'),
            cacheBust = new Date().getTime(),
            hook      = me.getHook();

        if (hook) {
            if (hook.search('?') === -1) {
                hook += '?';
            } else {
                hook += '&';
            }
            hook += '_vc=' + cacheBust;
            hook = me.getHostUrl() + hook;
            me.scripts.push(hook);
        } else if (Valence.login.config.Runtime.getIsDesktop()) {
            hook = me.getHostUrl() + '/resources/desktop/Hook.js?_vc=' + cacheBust;
            me.scripts.push(hook);
        }

        if (me.scripts.length > 0) {
            Valence.util.Helper.execScriptFiles({
                urls     : me.scripts,
                callback : function () {
                    deferred.resolve(content);
                }
            });
        } else {
            deferred.resolve(content);
        }

        return deferred.promise;
    },

    processLanguage : function (content) {
        var me           = content.scope,
            deferred     = Ext.create('Ext.Deferred'),
            multiLingual = Valence.login.config.Settings.getMultiLingual(),
            str;

        if (multiLingual) {
            str = Ext.create('Valence.login.store.Languages');

            str.getProxy().setUrl(me.getHostUrl() + '/valence/vvlogin.pgm');
            str.load();
        }
        deferred.resolve(content);
        return deferred.promise;
    },


    processLocale : function (content) {
        var me       = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            lang     = me.getLanguage();

        // if no language was specified on the url...set to default...
        //
        if (Ext.isEmpty(lang)) {
            lang = Valence.login.config.Settings.getDefaultLanguage();
        }

        me.setLanguage(lang);
        Valence.login.config.Runtime.setLanguage(lang);
        if (!Ext.isEmpty(lang) && lang !== 'en') {
            Valence.lang.loadLanguage(lang);
            me.scripts.push(me.getHostUrl() + '/extjs/build/classic/locale/locale-' + lang + '.js');
            Valence.util.Helper.execScriptFiles({
                urls     : me.scripts,
                callback : function () {
                    me.scripts.length = 0;
                    deferred.resolve(content);
                }
            });
        } else {
            deferred.resolve(content);
        }

        return deferred.promise;
    },

    /**
     * processAutoLogin - will attempt a login if reuse sid is false and we have a user/password
     *  that is either passed in the query params or manually set on the Processor. This was added
     *  for customer that wants the automatically login until the user actually performs a logout
     */
    processAutoLogin : function (content) {
        var me       = this,
            deferred = Ext.create('Ext.Deferred'),
            user     = me.getUsername(),
            pwd      = me.getPassword();

        if ((Ext.isEmpty(content.reuseSid) || !content.reuseSid) && !Ext.isEmpty(user) && !Ext.isEmpty(pwd) && !me.getForcePrompt()) {
            //since we have a user/password attempt to login without showing the login view
            //
            var me           = this,
                appId        = me.getAppId(),
                app          = Valence.login.config.Runtime.getApplication(),
                hostUrl      = me.getHostUrl(),
                mobilePortal = me.getNamespace() == 'Portal' && Ext.isModern && (Ext.os.name == 'iOS' || Ext.os.name == 'Android'),
                url,
                parms        = {
                    action   : 'login',
                    lng      : me.getLanguage(),
                    display  : me.getMode(),
                    version  : me.getVersion(),
                    forceEnv : Valence.login.config.Runtime.getUrlParms().environment
                };

            // encode the user/password values...
            //
            Ext.apply(parms, {
                user     : Valence.util.Helper.encodeUTF16(user),
                password : Valence.util.Helper.encodeUTF16(pwd)
            });

            //if appId exists then pass it to validate authorization
            //
            if (!Ext.isEmpty(appId)) {
                Ext.apply(parms, {
                    validateAppId : appId
                });
            }

            if (mobilePortal) {
                Valence.login.Processor.setHostUrl(hostUrl);
            }

            if (!app || app.fireEvent('beforelogin', parms) !== false) {
                url = hostUrl + '/valence/vvlogin.pgm';

                Ext.Ajax.request({
                    url     : url,
                    params  : parms,
                    scope   : me,
                    success : function (r) {
                        var d = Ext.decode(r.responseText);
                        if (d.success) {
                            // login was successful...
                            //   - set the sid in localStorage
                            //   - set the env in sessionStorage (if desktop)
                            //   - create and load the "Environments" store
                            //   - set the user runtime value
                            //   - decode applicable fields
                            //   - fire off an application and view level event
                            //
                            localStorage.setItem('sid', d.sid);

                            // for backward compatibility (pre Valence 5) set the sessionStorage as well...
                            //
                            sessionStorage.setItem('sid', d.sid);

                            if (Valence.login.config.Runtime.getIsDesktop()) {
                                sessionStorage.setItem('env', d.env);
                            }
                            Ext.create('Valence.login.store.Login_Environments', {
                                data : d.envs
                            });
                            Valence.login.config.Runtime.setUser(user);

                            me.setBypassLogin(d.success);
                            me.setLanguage(d.defaultLanguage);
                            me.setVersion(d.version);

                            // set the IBM i user....
                            //
                            if (d.ibmiUser) {
                                Valence.login.config.Runtime.setIbmiUser(d.ibmiUser);
                            }

                            if (app) {
                                app.fireEvent('login', user, d.sid);
                                app.fireEvent('environmentset', user, d.env);
                            }

                            d.firstname = Valence.util.Helper.decodeUTF16(d.firstname);
                            d.lastname  = Valence.util.Helper.decodeUTF16(d.lastname);

                            deferred.resolve(Ext.apply(content, d, {
                                reuseSid : true,
                                sid      : d.sid
                            }));
                        } else {
                            deferred.resolve(content);
                        }
                    },
                    failure : function () {
                        deferred.resolve(content);
                    }
                });
            }
        } else {
            deferred.resolve(content);
        }

        return deferred.promise;
    },

    processLock : function () {
        var me = this,
            cfg, cmp;

        Ext.suspendLayouts();

        cfg = {
            xtype      : 'lock',
            fullScreen : true,
            viewModel  : {
                data : {
                    connectionName : me.getConnectionName(),
                    hostUrl        : me.getHostUrl(),
                    lockText       : {
                        text : Valence.lang.lit.sessionLockedForUser + ' ' + Valence.login.config.Runtime.getUser()
                    },
                    namespace      : me.getNamespace(),
                    mode           : me.getMode(),
                    version        : me.getVersion()
                }
            },
            listeners  : {
                unlocked : function () {
                    cmp.destroy();
                }
            }
        };

        if (!Ext.isModern) {
            cfg.renderTo = me.getRenderTo();
            cmp          = Ext.widget('lock', cfg);
        } else {
            cmp = Ext.Viewport.add(cfg);
        }

        setTimeout(function () {
            Ext.resumeLayouts(true);
        }, 200);
    },

    processLoginData : function (content) {
        var me       = content.scope,
            deferred = Ext.create('Ext.Deferred');

        Valence.login.config.Runtime.setLoginData(content);
        deferred.resolve(content);
        return deferred.promise;
    },

    processSettings : function (content) {
        var me          = content.scope,
            deferred    = Ext.create('Ext.Deferred'),
            app         = Valence.login.config.Runtime.getApplication(),
            featureCode = me.getFeatureCode(),
            params      = {
                action       : 'getSettings',
                mode         : me.getMode(),
                customSid    : me.getCustomSid(),
                forcePrompt  : me.getForcePrompt(),
                productGroup : me.getProductGroup()
            };

        if (!Ext.isEmpty(featureCode)){
            Ext.apply(params,{
                featureCode : featureCode
            });
        }

        Ext.Ajax.request({
            url     : me.getHostUrl() + '/valence/vvlogin.pgm',
            params  : params,
            scope   : me,
            success : function (r) {
                var d        = Ext.decode(r.responseText),
                    settings = Valence.login.config.Settings;
                settings.setDatabase(d.database);
                settings.setBrowserTitle(Valence.util.Helper.decodeUTF16(d.browserTitle));
                settings.setDateFormat(d.dateFormat);
                settings.setDefaultLanguage(d.defaultLanguage);
                settings.setIconOnTab(d.iconOnTab);
                settings.setLockTimeout(d.lockTimeout);
                settings.setLogoutOnUnload(d.logoutOnUnload);
                settings.setSessionTimeout(d.sessTimeout);
                settings.setMaxAppsOpen(d.maxAppsOpen);
                settings.setMaxAutoStartApps(d.maxAutoStart);
                settings.setMenuTextMode(d.usrEnvMode);
                settings.setMultiLingual(d.multilingual);
                settings.setShowChangePassword(d.pwdChangeAllowed);
                settings.setShowForgotPassword(d.pwdResetAllowed);
                settings.setPathVariables(d.pathVar);
                settings.setPollInterval(d.pollInterval);
                settings.setSetUserCookie(d.usrCookie);
                settings.setWelcomePage(d.welcomePage);
                settings.setVersion(d.version);
                settings.setTourDisabled(d.tourDisabled);
                settings.setStandaloneV03(d.standaloneV03);
                Valence.login.config.Runtime.setSerialNumber(d.serialNbr);
                Valence.login.config.Runtime.setPartition(d.partition);
                if (!me.getVersion()) {
                    me.setVersion(d.version);
                }

                // set title...
                //
                if (!Ext.isEmpty(d.browserTitle)) {
                    document.title = Valence.util.Helper.decodeUTF16(d.browserTitle);
                }

                if (app) {
                    app.fireEvent('settingsapplied', d);
                }

                // if a customSid was passed, check
                //
                if (d.sid) {
                    me.setBypassLogin(true);

                    sessionStorage.setItem('sid',d.sid);

                    // set the user...
                    //
                    if (d.loginId) {
                        d.loginId = Valence.util.Helper.decodeUTF16(d.loginId);
                        Valence.login.config.Runtime.setUser(d.loginId);

                        d.firstname = Valence.util.Helper.decodeUTF16(d.firstname);
                        d.lastname  = Valence.util.Helper.decodeUTF16(d.lastname);
                    }

                    // set the IBM i user....
                    //
                    if (d.ibmiUser) {
                        Valence.login.config.Runtime.setIbmiUser(d.ibmiUser);
                    }

                    //  create the environments store...
                    //
                    if (d.envs) {
                        Ext.create('Valence.login.store.Login_Environments', {
                            data : d.envs
                        });
                    }

                    // set the environment...
                    //
                    if (d.env) {
                        sessionStorage.setItem('env', d.env);
                        if (app) {
                            app.fireEvent('environmentset', d.loginId, d.env);
                        }
                    }

                    // check for the vvRmtCall object...this should exist anytime a "customSid" is used...
                    //
                    if (d.vvRmtCall) {
                        var urlParms = Valence.login.config.Runtime.getUrlParms();
                        Ext.apply(urlParms, d.vvRmtCall);
                    }

                    // apply response properties to the "content" object so that they
                    // are available for subsequent processes...notably processLoginData...
                    //
                    Ext.apply(content, d);
                }

                // alert user if this is a licensed product and 30 or less days of functionality are remaining...
                //
                if (me.getIsLicensedProduct()){
                    if (d.isLicensed){
                        if (!Ext.isEmpty(d.daysRemaining) && d.daysRemaining <= 30){
                            Valence.common.util.Snackbar.show({
                                duration : 7500,
                                text     : (d.isTrial) ? Valence.lang.lit.keyTrial.replace('VAR1',d.daysRemaining) : Valence.lang.lit.keyLicensedTemp.replace('VAR1',d.daysRemaining)
                            });
                        }
                    } else {
                        Ext.apply(content,{
                            controlledError : true
                        });
                        Valence.common.util.Dialog.show({
                            title     : Valence.lang.lit.enterpriseLicenseKeyRequiredTitle,
                            msg       : Valence.lang.lit.enterpriseLicenseKeyRequiredBody,
                            noButtons : true,
                            minWidth  : 350
                        });
                        deferred.reject(content);
                        return;
                    }
                }
                deferred.resolve(content);
            },
            failure : function () {
                Ext.log({
                    msg : 'Valence login processor: call to getSettings failure'
                });
                if (Ext.os.name == 'iOS' || Ext.os.name == 'Android') {
                    deferred.resolve(content);
                } else {
                    deferred.reject();
                }
            }
        });

        return deferred.promise;
    },

    processSid : function (content) {
        var me       = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            sid      = me.getSid(),
            app      = Valence.login.config.Runtime.getApplication(),
            appId    = me.getAppId();

        //if not the portal check for app id in url and set it for passing
        // to login / is valid session for validation
        //
        if (!me.isPortal()) {
            if (Ext.isEmpty(appId)){
                appId = Ext.getUrlParam('app');
                if (!Ext.isEmpty(appId)) {
                    me.setAppId(appId);
                }
            }
        }

        // if there is no sid or set to bypass...
        //    resolve - continue the login process
        //  else
        //    verify that the sid is valid
        //
        if (Ext.isEmpty(sid) || me.getBypassReuseSid() || me.getForcePrompt()) {
            deferred.resolve(content);
        } else {
            var params = {
                action : 'isValidSession'
            };

            if (!Ext.isEmpty(appId)) {
                Ext.apply(params, {
                    validateAppId : appId
                });
            }

            Ext.Ajax.request({
                url     : me.getHostUrl() + '/valence/vvlogin.pgm',
                params  : params,
                scope   : me,
                success : function (r) {
                    var d = Ext.decode(r.responseText);
                    if (d.success) {
                        d.loginId = Valence.util.Helper.decodeUTF16(d.loginId);
                        Ext.create('Valence.login.store.Login_Environments', {
                            data : d.envs
                        });

                        // if an environment was passed back...
                        //  - update sessionStorage (if desktop)
                        //  - set it as the "current" environment on the store
                        //  - decode applicable fields
                        //  - fire application level event
                        //
                        if (!Ext.isEmpty(d.env)) {
                            if (Valence.login.config.Runtime.getIsDesktop()) {
                                sessionStorage.setItem('env', d.env);
                            }
                            if (app) {
                                app.fireEvent('environmentset', d.loginId, d.env);
                            }
                            var rec = Ext.getStore('Login_Environments').findRecord('envId', d.env, 0, false, true, true);
                            if (rec) {
                                rec.set('current', true);
                                rec.commit();
                            }
                        }
                        me.setBypassLogin(d.success);
                        Valence.login.config.Runtime.setUser(d.loginId);
                        d.firstname = Valence.util.Helper.decodeUTF16(d.firstname);
                        d.lastname  = Valence.util.Helper.decodeUTF16(d.lastname);

                        // set the IBM i user....
                        //
                        if (d.ibmiUser) {
                            Valence.login.config.Runtime.setIbmiUser(d.ibmiUser);
                        }

                        // for backward compatibility (pre Valence 5) set the sessionStorage as well...
                        //
                        sessionStorage.setItem('sid', d.sid);

                        deferred.resolve(Ext.apply(content, d, {
                            reuseSid : true,
                            sid      : sid
                        }));

                        //fire the login event
                        //
                        var app = Valence.login.config.Runtime.getApplication();
                        if (app) {
                            app.fireEvent('login');
                        }
                    } else {
                        if (!Ext.isEmpty(d.lit)) {
                            Valence.login.util.Helper.showImageDialog(Valence.common.util.Helper.getLit(d), me.getImage());
                            deferred.reject();
                        } else {
                            deferred.resolve(Ext.apply(content, d, {
                                reuseSid : false,
                                sid      : null
                            }));
                            localStorage.removeItem('sid');
                            sessionStorage.removeItem('sid');
                        }
                    }
                },
                failure : function () {
                    Ext.log({
                        msg : 'Valence login processor: call to isValidSession failure'
                    });
                    if (me.getNamespace() == 'Portal' && Ext.isModern && (Ext.os.name == 'iOS' || Ext.os.name == 'Android')) {
                        localStorage.removeItem('sid');
                        sessionStorage.removeItem('sid');
                        deferred.resolve(content);
                    } else {
                        Valence.login.util.Helper.showImageDialog(Valence.lang.lit.noResponseFromServer, me.getImage());
                    }
                }
            });
        }

        return deferred.promise;
    },

    processStandaloneV03 : function (content) {
        var me        = content.scope,
            deferred  = Ext.create('Ext.Deferred'),
            cacheBust = new Date().getTime(),
            hook      = me.getHostUrl() + '/resources/desktop/HookV03.js?_vc=' + cacheBust,
            scripts   = [hook];

        if (Valence.login.config.Settings.getStandaloneV03()) {
            Valence.util.Helper.execScriptFiles({
                urls     : scripts,
                callback : function () {
                    deferred.resolve(content);
                }
            });
        } else {
            deferred.resolve(content);
        }

        return deferred.promise;
    },

    processTasks : function () {
        var me = this;
    },

    processTheme : function (content) {
        var me        = content.scope,
            deferred  = Ext.create('Ext.Deferred'),
            theme     = me.getTheme() || localStorage.getItem('valence-theme') || 'default',
            mode      = me.getMode(),
            cacheBust = new Date().getTime(),
            path;

        if (theme) {
            if (me.isPortal()) {
                path = '/resources/' + mode + '/themes/css/Portal/' + theme + '.css';
            } else if (me.getThemePath()) {
                path = me.getThemePath() + theme + '.css';
            } else {
                // resolve the path automatically assuming it will live under resources for classic or modern...
                //
                path = (!Ext.isEmpty(Ext.isClassic) && Ext.isClassic) ? 'resources/themes/classic/' : 'resources/themes/modern/';
                path += theme + '.css';
            }

            if (!Valence.login.config.Runtime.getIsDesktop()) {
                theme = me.getHostUrl() + theme;
            }

            var head = document.head,
                link = document.createElement('link');

            link.id   = 'portaltheme';
            link.type = 'text/css';
            link.rel  = 'stylesheet';
            link.href = path;
            head.appendChild(link);

            me.setTheme(theme);

            // load the Portal overrides.css file...
            //
            localStorage.setItem('valence-theme', theme);
            link      = document.createElement('link');
            link.id   = 'portaloverrides';
            link.type = 'text/css';
            link.rel  = 'stylesheet';
            link.href = '/resources/' + mode + '/themes/css/Portal/overrides.css?_vc=' + cacheBust;
            head.appendChild(link);

            if (!me.isPortal() && !Ext.isEmpty(Ext.isClassic) && Ext.isClassic) {
                // setup an event listener so this app will know when the Portal theme has been changed...
                //
                Valence.util.Helper.addEventListener('themechanged', Valence.util.Helper.swapTheme);
            }
        }

        deferred.resolve(content);

        return deferred.promise;
    },

    processToken : function (content) {
        var me       = content.scope,
            deferred = Ext.create('Ext.Deferred');

        if (!Ext.isModern) {
            if (Ext.util.Cookies.get('vvtoken') === null) {
                var uuid   = me.createUUID(),
                    secure = location.protocol === 'https:' ? true : false; // set secure to false if not running https (last parm)

                Ext.util.Cookies.set('vvtoken', uuid, null, '/', null, secure);
            }
        }
        deferred.resolve(content);
        return deferred.promise;
    },

    processUnload : function (content) {
        var me       = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            execute  = (!Ext.isEmpty(me.getAutoLogout())) ? me.getAutoLogout() : Valence.login.config.Settings.getLogoutOnUnload();

        if (execute) {

            // call logout routine if user closes tab or browser before logging out...
            // also destroy all iframes to initiate any other cleanup...
            //
            window.onunload = function () {
                var app = Valence.login.config.Runtime.getApplication();

                if (app) {
                    me.getAppUmbrella().onLogout(false);

                    app.fireEvent('logout');
                } else {
                    //todo what is this for since it should just fire the event logout and app umbrella takes care of it
                    //
                    var frames = Ext.ComponentQuery.query('uxiframe[app]');
                    for (var ii = 0; ii < frames.length; ii++) {
                        frames[ii].destroy();
                    }

                    if (!Ext.isEmpty(Valence.login.config.Runtime.getUser()) && !Valence.login.config.Runtime.getIsLoggingOut()) {
                        //stop the polling
                        //
                        var app = Valence.login.config.Runtime.getApplication();
                        if (app) {
                            app.fireEvent('suspendpolling');
                        }

                        Ext.Ajax.request({
                            url    : me.getHostUrl() + '/valence/vvvport.pgm',
                            params : {
                                action : 'logout'
                            },
                            async  : false
                        });
                    }
                }
            };

            window.onbeforeunload = function (evt) {
                var rt = Valence.login.config.Runtime;

                if (!rt.getIsLoggingOut() && rt.getUser() && rt.getUrlParms().portal !== 'false' && rt.getIsConnected() && !rt.getIsPending569Logout()) {
                    return Valence.lang.lit.valencePortal;
                }
            };
        }

        deferred.resolve(content);
        return deferred.promise;
    },

    processUrl : function () {
        var me       = this,
            deferred = Ext.create('Ext.Deferred'),
            parms    = Valence.login.config.Runtime.getUrlParms(),
            sid      = (!Ext.isEmpty(parms.sid)) ? parms.sid : localStorage.getItem('sid');

        me.setCustomSid(!Ext.isEmpty(parms.customSid) ? parms.customSid : '');
        me.setForcePrompt(!Ext.isEmpty(parms.forcePrompt) ? (parms.forcePrompt === 'true') : false);
        me.setLanguage(!Ext.isEmpty(parms.lang) ? parms.lang : '');
        me.setIsRunningInPortal(!Ext.isEmpty(parms.sid) ? true : false);
        me.setSid(sid);

        if (parms.hook) {
            me.setHook(parms.hook);
        }

        if (parms.theme) {
            me.setTheme(parms.theme);
        }

        if (parms.user) {
            me.setUsername(parms.user);
        }

        if (parms.password) {
            me.setPassword(parms.password);
        }

        if (parms.autoLogout) {
            me.setAutoLogout((parms.autoLogout === 'true'));
        }

        // if this app is running in the Portal...skip all subsequent processes and go straight to callback...
        //
        if (me.getIsRunningInPortal()) {
            deferred.reject({
                scope           : me,
                executeCallback : true,
                processLocale   : true,
                processTheme    : true,
                processSettings : me.getIsLicensedProduct(),
                controlledError : true
            });
        } else {
            // if a customSid was passed...bypass the processSid check...
            //
            if (!Ext.isEmpty(me.getCustomSid())) {
                me.setBypassReuseSid(true);
            }
            deferred.resolve({
                scope : me,
                theme : parms.theme || null
            });
        }

        return deferred.promise;
    },

    processView : function (content) {
        var me       = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            cfg, cmp, cmpName;

        // during the login flow, the bypasslogin config may have been set true...
        //
        if (me.getBypassLogin()) {
            deferred.resolve(content);
        } else {
            me.checkHookForImage();

            // output a loadmask if the a username and password have been provided as this will
            // attempt a login automatically and we want to hide the screen from flashing...
            //
            if (!Ext.isEmpty(me.getUsername()) && !Ext.isEmpty(me.getPassword())) {
                Valence.common.util.Helper.loadMask();
            }
            Ext.suspendLayouts();

            cfg = {
                xtype      : 'login',
                fullScreen : true,
                viewModel  : {
                    data : {
                        connectionName : me.getConnectionName(),
                        hostUrl        : me.getHostUrl(),
                        image          : me.getImage(),
                        forgotPassword : me.getForgotPassword(),
                        language       : me.getLanguage(),
                        namespace      : me.getNamespace(),
                        password       : me.getPassword(),
                        mode           : me.getMode(),
                        mobilePortal   : me.getNamespace() == 'Portal' && Ext.isModern && (Ext.os.name == 'iOS' || Ext.os.name == 'Android'),
                        username       : me.getUsername(),
                        version        : me.getVersion()
                    }
                },
                listeners  : {
                    loggedin : function (cmp, o) {
                        cmp.destroy();
                        if (Valence.login.config.Settings.getSetUserCookie()) {
                            localStorage.setItem('lastLoginUser', o.loginId || '');
                        }

                        // if an environment was passed back...set it as the "current" environment on the store...
                        //
                        if (!Ext.isEmpty(o.env)) {
                            var rec = Ext.getStore('Login_Environments').findRecord('envId', o.env, 0, false, true, true);
                            if (rec) {
                                rec.set('current', true);
                                rec.commit();
                            }
                        }

                        if (Ext.isModern) {
                            if (me.isPortal()) {
                                // To handle switching connections
                                //
                                me.setOptions(Ext.apply(me.getOptions(), {hostUrl : me.getHostUrl()}));
                            }
                            Ext.Viewport.mask({
                                indicator : true,
                                xtype     : 'loadmask',
                                message   : Valence.lang.lit.loading
                            });
                        }
                        deferred.resolve(Ext.apply(content, o));
                    }
                }
            };

            if (!Ext.isModern) {
                cfg.renderTo = me.getRenderTo();
                cmp          = Ext.widget('login', cfg);
            } else {
                cmp = Ext.Viewport.add(cfg);
                setTimeout(function () {
                    Ext.Viewport.unmask();
                    if (!Ext.isEmpty(navigator.splashscreen)) {
                        navigator.splashscreen.hide();
                    }
                }, 300);
            }

            setTimeout(function () {
                Ext.resumeLayouts(true);
            }, 500);
        }
        return deferred.promise;
    }
});