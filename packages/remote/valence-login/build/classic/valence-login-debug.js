Ext.define('Valence.login.AppUmbrella', {
    extend: 'Ext.app.Controller',
    requires: [
        'Valence.common.util.Snackbar'
    ],
    init: function(options) {
        var me = this;
        Ext.apply(me, options);
        if (me.manageIframes) {
            me.control({
                'uxiframe': {
                    load: me.onIframeLoad,
                    beforedestroy: me.onIframeBeforeDestroy
                }
            });
        }
        me.listen({
            controller: {
                '*': {
                    changeenvironment: me.onChangeEnvironment,
                    changepassword: me.onChangePassword,
                    lock: me.onLock,
                    logout: me.onLogout,
                    resumelock: me.onResumeLock,
                    resumepolling: me.onResumePolling,
                    suspendlock: me.onSuspendLock,
                    suspendpolling: me.onSuspendPolling
                }
            },
            component: {
                'component[basePortal]': {
                    render: me.onRenderBasePortalComponent
                }
            }
        });
        me.settings = Valence.login.config.Settings;
        me.runtime = Valence.login.config.Runtime;
    },
    initTasks: function() {
        var me = this;
        // polling...
        //
        if (me.poll) {
            me.pollRunner = Ext.TaskManager.start({
                scope: me,
                run: me.pollServer,
                interval: me.settings.getPollInterval()
            });
        }
        // automatic inactivity lock...
        //
        if (me.autoLock) {
            if (me.settings.getLockTimeout() !== 0) {
                me.lockTask = new Ext.util.DelayedTask(me.onLock, me);
                me.lockTask.delay(me.settings.getLockTimeout());
            }
        }
        // automatic inactivity logout...
        //
        if (me.autoLogout) {
            if (me.settings.getSessionTimeout() !== 0) {
                me.logoutTask = new Ext.util.DelayedTask(me.sessionTimeout, me);
                me.logoutTask.delay(me.settings.getSessionTimeout());
            }
        }
    },
    onAttemptUnlockSuccess: function(r) {
        var me = this,
            lock = Ext.ComponentQuery.query('lock')[0],
            d = Ext.decode(r.responseText);
        if (d.success) {
            lock.destroy();
            me.runtime.setIsLocked(false);
            if (!Ext.isEmpty(me.lockTask)) {
                me.lockTask.delay(me.settings.getLockTimeout());
            }
        } else {
            pw.markInvalid(eval(d.lit).replace('VAR1', d.var1));
        }
    },
    onChangeEnvironment: function() {
        var me = this,
            app = Valence.login.config.Runtime.getApplication();
        if (Valence.login.config.Runtime.getIsDesktop()) {
            Ext.widget('changeenvironment', {
                closeAppsMsg: me.settings.getCloseAppsOnEnvironmentChange(),
                listeners: {
                    scope: me,
                    destroy: me.onDestroyChangeEnvironment,
                    itemclick: me.onItemclickEnvironment
                }
            }).show();
            if (app) {
                app.fireEvent('showchangeenvironment');
            }
        }
    },
    onChangePassword: function(target) {
        var me = this,
            app = Valence.login.config.Runtime.getApplication();
        if (app && app.fireEvent('beforeshowchangepassword') !== false) {
            Ext.widget('changepassword', {
                animateTarget: target || null,
                viewModel: {
                    data: {
                        user: me.runtime.getUser()
                    }
                }
            });
        }
    },
    //onClickSendPassword : function(user){
    //    var me = this;
    //    if (Ext.isEmpty(user)){
    //        return;
    //    }
    //    Ext.ComponentQuery.query('login')[0].el.mask();
    //    Ext.Ajax.request({
    //        url     : me.hostUrl + '/valence/vvlogin.pgm',
    //        params  : {
    //            action : 'sendPassword',
    //            user   : user,
    //            text0  : Valence.util.Helper.encodeUTF16(Valence.lang.lit.tempPassword),
    //            text1  : Valence.util.Helper.encodeUTF16(Valence.lang.msg.tempPasswordEmail1),
    //            text2  : Valence.util.Helper.encodeUTF16(Valence.lang.msg.tempPasswordEmail2),
    //            text3  : Valence.util.Helper.encodeUTF16(Valence.lang.msg.tempPasswordEmail3)
    //        },
    //        scope   : me,
    //        success : me.onSendPasswordSuccess
    //    });
    //},
    onDestroyChangeEnvironment: function() {
        var me = this,
            app = Valence.login.config.Runtime.getApplication();
        if (app) {
            app.fireEvent('hidechangeenvironment');
        }
    },
    onIframeBeforeDestroy: function(frame) {
        // if the frame has a "session" value then it was a 5250 web session...do some cleanup...
        //
        var doc = frame.getDoc(),
            session = (doc) ? doc.getElementsByName('session')[0] : null;
        if (!Ext.isEmpty(session)) {
            Ext.Ajax.request({
                url: '/webaccess/iWAActiveSessions?action=stop&session=' + session.getAttribute('value')
            });
        }
    },
    onIframeLoad: function(frame) {
        var me = this,
            d = frame.getDoc();
        if (d) {
            if (Ext.isIE8) {
                d.attachEvent('click', Ext.bind(me.resetTimers, me));
            } else {
                d.addEventListener('click', Ext.bind(me.resetTimers, me));
            }
        }
    },
    onItemclickEnvironment: function(view, rec) {
        var me = this,
            closeApps = me.settings.getCloseAppsOnEnvironmentChange(),
            current = rec.get('current'),
            str = view.getStore(),
            app = Valence.login.config.Runtime.getApplication(),
            snackbarCfg = {
                text: Valence.lang.lit.yourEnvChanged
            },
            appIds;
        if (!current && app && app.fireEvent('beforeenvironmentset', me.runtime.getUser(), rec.get('envId')) !== false) {
            Ext.ComponentQuery.query('changeenvironment')[0].el.mask(Valence.lang.lit.settingEnvironment);
            Ext.Ajax.request({
                omitPortalCredentials: true,
                url: '/valence/vvlogin.pgm',
                params: {
                    action: 'setEnvironment',
                    sid: Valence.util.Helper.getSid(),
                    env: rec.get('envId')
                },
                scope: me,
                success: function(r) {
                    var d = Ext.decode(r.responseText);
                    Ext.ComponentQuery.query('changeenvironment')[0].el.unmask();
                    if (d.success) {
                        // environment has been succesfully changed...
                        //
                        //    update sessionStorage (if desktop)
                        //    swap the "current" record on the Environments store
                        //    update the "loginData" object in the Runtime class
                        //    close any running apps if applicable
                        //    destroy the changeenvironment component
                        //    output a message to the user
                        //    fire application level event of "environmentset"
                        //
                        if (Valence.login.config.Runtime.getIsDesktop()) {
                            sessionStorage.setItem('env', rec.get('envId'));
                        }
                        str.findRecord('current', true).set('current', false);
                        rec.set('current', true);
                        str.commitChanges();
                        me.runtime.setLoginData(Ext.apply(me.runtime.getLoginData(), {
                            env: rec.get('envId')
                        }));
                        if (app) {
                            app.fireEvent('logindataupdated', me.runtime.getLoginData());
                        }
                        if (closeApps) {
                            appIds = Portal.util.Helper.getActiveAppIds();
                            if (appIds.length > 0) {
                                Ext.apply(snackbarCfg, {
                                    buttonText: Valence.lang.lit.relaunchApps,
                                    duration: 8000,
                                    handler: function() {
                                        for (var ii = 0; ii < appIds.length; ii++) {
                                            Portal.util.Helper.launchApp(appIds[ii]);
                                        }
                                    }
                                });
                            }
                            Portal.util.Helper.closeAllApps();
                        }
                        Ext.ComponentQuery.query('changeenvironment')[0].destroy();
                        Valence.common.util.Snackbar.show(snackbarCfg);
                        if (app) {
                            app.fireEvent('environmentset', me.runtime.getUser(), rec.get('envId'));
                        }
                    } else {
                        Valence.common.util.Snackbar.show(Valence.lang.lit.environmentNotSet);
                    }
                }
            });
        }
    },
    onLock: function() {
        var me = this,
            app = Valence.login.config.Runtime.getApplication();
        me.onSuspendLock();
        if (!me.runtime.getIsLocked()) {
            if (app) {
                if (app.fireEvent('beforelock') === false) {
                    return;
                }
            }
            Ext.Ajax.request({
                url: me.hostUrl + '/valence/vvlogin.pgm',
                params: {
                    action: 'lock'
                },
                scope: me,
                success: me.onLockSuccess
            });
        }
    },
    onLockSuccess: function(r) {
        var me = this,
            d = Ext.decode(r.responseText),
            app = Valence.login.config.Runtime.getApplication();
        if (d.success) {
            me.runtime.setIsLocked(true);
            if (app) {
                app.fireEvent('locked');
            }
            Valence.login.Processor.processLock();
        }
    },
    onLogout: function() {
        var me = this,
            frames = Ext.ComponentQuery.query('uxiframe[app]'),
            user = me.runtime.getUser(),
            parms = {
                action: 'logout'
            },
            app = Valence.login.config.Runtime.getApplication(),
            completeLogout = Ext.bind(function() {
                var processLogout = Ext.bind(me.processLogout, me),
                    anim;
                if (localStorage.getItem('sid') === me.runtime.getLoginData().sid) {
                    localStorage.removeItem('sid');
                }
                if (Valence.login.config.Runtime.getIsDesktop()) {
                    sessionStorage.removeItem('env');
                }
                if (app) {
                    console.log('loggedout');
                    app.fireEvent('loggedout', user);
                }
                console.log('logout');
                Ext.Function.defer(function() {
                    anim = {
                        duration: 100,
                        easing: 'easeOut',
                        opacity: 0.15,
                        callback: function() {
                            processLogout();
                        }
                    };
                    if (Ext.isClassic) {
                        Ext.get(document.body).fadeOut(anim);
                    } else {
                        Ext.get(document.body).animate(anim);
                    }
                }, 150);
            }, me),
            request;
        if (me.runtime.getIsLoggingOut() || (app && app.fireEvent('beforelogout', user, parms) === false)) {
            return;
        }
        me.runtime.setIsLoggingOut(true);
        //only peform the needed actions if running in the portal
        //
        if (Valence.login.Processor.getNamespace() === 'Portal') {
            // save any running apps to sessionstorage if desktop...
            //
            if (Valence.login.config.Runtime.getIsDesktop()) {
                var runningStr = Ext.getStore('RunningApps'),
                    apps = [];
                runningStr.each(function(r) {
                    apps.push(r.get('appId'));
                });
                sessionStorage.setItem('valence-last-running-apps', apps);
            }
            // kill all iframes...
            //
            for (var ii = 0; ii < frames.length; ii++) {
                frames[ii].destroy();
            }
            // kill all windows...
            //
            var openWindows = me.runtime.getActiveWindows();
            if (openWindows) {
                for (ii = 0; ii < openWindows.length; ii++) {
                    try {
                        openWindows[ii].close();
                    } catch (err) {}
                }
            }
            //do nothing
            if (Ext.isModern) {
                Ext.Viewport.mask({
                    indicator: true,
                    xtype: 'loadmask',
                    message: Valence.lang.lit.loading,
                    zIndex: 1000
                });
            }
        }
        me.runtime.setActiveWindows([]);
        //stop the polling
        //
        me.onSuspendPolling();
        try {
            Ext.Ajax.request({
                url: me.hostUrl + '/valence/vvvport.pgm',
                params: parms,
                scope: me,
                async: false,
                success: completeLogout,
                failure: completeLogout
            });
        } catch (e) {
            completeLogout();
        }
    },
    onRenderBasePortalComponent: function(cmp) {
        var me = this,
            app = Valence.login.config.Runtime.getApplication();
        if (app) {
            app.fireEvent('componentrender', cmp);
        }
    },
    //onSendPasswordSuccess : function (r) {
    //    var d  = Ext.decode(r.responseText),
    //        lf = Ext.ComponentQuery.query('login')[0];
    //
    //    lf.el.unmask();
    //    if (d.success){
    //        Valence.util.Helper.msg(Valence.lang.msg.tempPasswordSent);
    //        lf.swapToLogin();
    //    } else {
    //        var fld = lf.down('#' + d.fld);
    //        if (fld){
    //            fld.markInvalid(Valence.common.util.Helper.getLit(d));
    //            fld.focus();
    //        }
    //    }
    //},
    pollServer: function() {
        var me = this,
            timerReset = me.runtime.getLogoutTaskReset(),
            app = Valence.login.config.Runtime.getApplication(),
            p = {
                action: 'poll',
                timerReset: timerReset
            };
        if (timerReset) {
            //if we are telling the backend that activity has occured
            // on the front-end then reset the flag in runtime for the next poll
            //
            me.runtime.setLogoutTaskReset(false);
        }
        if (app) {
            app.fireEvent('beforepoll', p);
        }
        Ext.Ajax.request({
            url: me.hostUrl + '/valence/vvvport.pgm',
            params: p,
            scope: me,
            success: me.pollServerSuccess,
            failure: function(conn) {
                // status "569" is reserved for Valence...
                //   this condition will be handled by another process (see Ajax.js in Valence package)
                //
                if (conn.status !== 569) {
                    me.runtime.setIsConnected(false);
                }
            }
        });
    },
    pollServerSuccess: function(r) {
        var me = this,
            d = Ext.decode(r.responseText),
            app = Valence.login.config.Runtime.getApplication();
        if (app) {
            app.fireEvent('poll', d);
        }
        switch (d.status) {
            case 'ok':
                me.runtime.setIsConnected(true);
                break;
            case '*NOSESSION':
                if (!Ext.isEmpty(me.lockTask)) {
                    me.lockTask.cancel();
                };
                if (!me.runtime.getIsLoggingOut()) {
                    Valence.common.util.Dialog.show({
                        title: Valence.lang.msg.sessionEndHeader,
                        msg: Valence.lang.msg.sessionEndBody,
                        buttons: [
                            '->',
                            {
                                text: Valence.lang.lit.ok
                            }
                        ],
                        scope: me,
                        handler: me.onLogout
                    });
                };
                break;
            case 'RELOAD':
                var str = Ext.getStore('Apps');
                if (str) {
                    str.load();
                };
                break;
        }
    },
    processLogout: function() {
        var params = Ext.getUrlParam(),
            removeParams = [
                'password',
                'customSid'
            ],
            addToSearch = function(prop, val) {
                if (!Ext.isEmpty(search)) {
                    search += '&';
                }
                search += prop + '=' + val;
            },
            search = '';
        //some parameters may need to be removed...
        //
        if (!Ext.Object.isEmpty(params)) {
            Ext.iterate(params, function(prop, val) {
                if (Ext.Array.indexOf(removeParams, prop) === -1) {
                    addToSearch(prop, val);
                }
            });
        }
        location.search = search;
    },
    resetTimers: function() {
        var me = this;
        if (!Ext.isEmpty(me.lockTask)) {
            me.lockTask.delay(me.settings.getLockTimeout());
        }
        if (me.logoutTask) {
            me.runtime.setLogoutTaskReset(true);
            me.logoutTask.delay(me.settings.getSessionTimeout());
        }
    },
    onResumeLock: function() {
        var me = this;
        if (!Ext.isEmpty(me.lockTask)) {
            me.lockTask.delay(me.settings.getLockTimeout());
        }
    },
    onResumePolling: function() {
        var me = this;
        if (me.pollRunner) {
            Ext.TaskManager.start(me.pollRunner);
        }
    },
    sessionTimeout: function() {
        var me = this;
        me.onLogout();
    },
    onSuspendLock: function() {
        var me = this;
        if (!Ext.isEmpty(me.lockTask)) {
            me.lockTask.cancel();
        }
    },
    onSuspendPolling: function() {
        var me = this;
        if (me.pollRunner) {
            Ext.TaskManager.stop(me.pollRunner);
        }
    }
});

Ext.define('Valence.login.config.Runtime', {
    singleton: true,
    config: {
        activeWindows: [],
        allowChangePassword: false,
        appContainer: 'canvas',
        autoLogin: false,
        environment: null,
        language: null,
        isConnected: null,
        isMobile: false,
        isDesktop: false,
        isLocked: false,
        isLoggingOut: false,
        logoutTaskReset: false,
        loginData: null,
        reloadApps: false,
        namespace: null,
        theme: null,
        urlParms: Ext.getUrlParam(),
        user: null
    },
    constructor: function() {
        this.initConfig(this.config);
    },
    applyAppContainer: function(v) {
        var me = this;
        if (me.getUrlParms().tabbed) {
            return 'canvastabs';
        } else {
            return (v == '1') ? 'canvastabs' : 'canvas';
        }
    },
    applyIsConnected: function(v) {
        var me = this,
            masked;
        if (v === false) {
            if (Ext.isClassic) {
                Ext.MessageBox.wait(Valence.lang.lit.reconnectBody, '<p style="font-size:11pt";>' + Valence.lang.lit.reconnectHeader + '</p>');
            } else {
                Valence.login.config.Runtime.getApplication().fireEvent('disconnected');
                Ext.Viewport.mask({
                    indicator: true,
                    xtype: 'loadmask',
                    message: Valence.lang.lit.reconnectBody,
                    zIndex: 1000
                });
            }
        } else if (v === true) {
            if (!me.getIsConnected()) {
                if (Ext.isClassic && Ext.Msg.isVisible()) {
                    Ext.Msg.hide();
                } else if (Ext.isModern) {
                    masked = Ext.Viewport.getMasked();
                    if (!Ext.isEmpty(masked) || masked) {
                        Valence.login.config.Runtime.getApplication().fireEvent('connected');
                        Ext.Viewport.unmask();
                    }
                }
            }
        }
        return v;
    },
    applyLoginData: function(o) {
        var me = this,
            eObj;
        if (!o) {
            return;
        }
        o.envName = '???';
        if (!Ext.isEmpty(o.loginId)) {
            o.loginId = Ext.util.Format.uppercase(o.loginId);
            o.initial = o.loginId.substr(0, 1);
        } else {
            o.loginId = '???';
            o.initial = o.loginId.substr(0, 1) || '?';
        }
        if (!Ext.isEmpty(o.firstname && !Ext.isEmpty(o.lastname))) {
            o.initial = o.firstname.substr(0, 1) + o.lastname.substr(0, 1);
        }
        if (!Ext.isEmpty(o.envs)) {
            o.alwChgEnv = (o.envs.length > 1);
            if (!Ext.isEmpty(o.env)) {
                // retrieve the proper object...
                //
                for (var ii = 0; ii < o.envs.length; ii++) {
                    eObj = o.envs[ii];
                    if (o.env == eObj.envId) {
                        o.envName = Valence.util.Helper.decodeUTF16(eObj.envName);
                    }
                }
            }
        } else {
            o.alwChgEnv = false;
        }
        if (!Ext.isEmpty(o.theme)) {
            me.setTheme(o.theme);
        }
        if (!Ext.isEmpty(o.layout)) {
            me.setAppContainer(o.layout);
        }
        return o;
    },
    getApplication: function() {
        var me = this,
            ns = me.getNamespace();
        if (ns && !Ext.isEmpty(window[ns]) && typeof window[ns].getApplication === "function") {
            return window[ns].getApplication();
        }
        return null;
    }
});

Ext.define('Valence.login.config.Settings', {
    singleton: true,
    config: {
        aboutPage: '/desktop/about/index.html',
        browserTitle: 'Valence',
        closeAppsOnEnvironmentChange: true,
        dateFormat: 'Y-m-d',
        defaultLanguage: 'en',
        displayLaunchpad: true,
        favicon: '/resources/images/favicon.ico',
        iconOnTab: true,
        lockTimeout: 120,
        lockConnections: false,
        logoutOnUnload: false,
        maxAutoStartApps: null,
        maxAppsOpen: 15,
        maxFavorites: 24,
        menuTextMode: 'USER',
        multiLingual: null,
        pathVariables: null,
        passwordReset: null,
        pollInterval: 30,
        promptBeforeCloseMsg: null,
        promptBeforeCloseTitle: null,
        sessionTimeoutWarning: null,
        //todo - to be implemented
        sessionTimeout: null,
        setUserCookie: null,
        tabShortcutKeys: true,
        version: null,
        welcomePage: null,
        zoom5250: 1.5
    },
    applyLockTimeout: function(v) {
        return v * 60000;
    },
    applyPollInterval: function(v) {
        return v * 1000;
    },
    applySessionTimeout: function(v) {
        var me = this,
            num = v,
            warning = (num > 2) ? (num - (num - 2)) : null;
        // set the warning timeout 2 minutes before this...
        //
        if (warning) {
            me.setSessionTimeoutWarning(warning * 60000);
        }
        return v * 60000;
    },
    constructor: function() {
        this.initConfig(this.config);
    }
});

Ext.define('Valence.login.model.Language', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'VVLNGNAME',
            type: 'string',
            convert: Valence.util.Helper.decodeUTF16
        },
        {
            name: 'VVLNG',
            type: 'string'
        }
    ],
    proxy: {
        type: 'ajax',
        url: '',
        // set by "Processor"
        extraParams: {
            action: 'getLanguages'
        },
        reader: {
            type: 'json',
            rootProperty: 'VVLNGS'
        }
    }
});

Ext.define('Valence.login.store.Languages', {
    extend: 'Ext.data.Store',
    requires: [
        'Valence.login.model.Language'
    ],
    storeId: 'Languages',
    model: 'Valence.login.model.Language'
});

Ext.define('Valence.login.util.Helper', {
    singleton: true,
    requires: [
        'Valence.common.util.Dialog'
    ],
    getHookValue: function(prop) {
        // note do NOT reference hook as "Valence.Hook"...command will then automatically pull
        // this file into the build process which we do not want...
        //
        var hook = Valence['Hook'],
            obj = prop.split('.'),
            theme = localStorage.getItem('valence-theme'),
            value = hook[obj[0]];
        if (value) {
            for (var ii = 1; ii < obj.length; ii++) {
                if (!Ext.isEmpty(value)) {
                    value = value[obj[ii]];
                } else {
                    Ext.log({
                        msg: 'Property ' + prop + ' not found in Valence.Hook'
                    });
                    return null;
                }
            }
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
        return value;
    },
    showImageDialog: function(baseMessage, imageSrc) {
        var me = this,
            message = '';
        if (!Ext.isEmpty(imageSrc)) {
            var style = (Valence.login.config.Runtime.getIsDesktop()) ? 'max-width: 200px;' : '';
            message = '<div style="text-align: center;"><img src="' + imageSrc + '" cls="vv-login-img" style="' + style + '"></img></div>';
        }
        message += '<div style="margin-top:16px;">' + baseMessage + '</div>';
        Valence.common.util.Dialog.show({
            msg: message,
            minHeight: 140,
            noButtons: true
        });
    }
});

Ext.define('Valence.login.model.Connection', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.proxy.LocalStorage'
    ],
    fields: [
        {
            name: 'desc',
            defaultValue: ''
        },
        {
            name: 'url',
            defaultValue: ''
        },
        {
            name: 'port',
            defaultValue: ''
        },
        {
            name: 'autostartappid',
            defaultValue: ''
        },
        {
            name: 'invalid',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'selected',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'lastLoggedInUser',
            type: 'string',
            defaultValue: ''
        }
    ],
    proxy: {
        autoLoad: false,
        autoSync: true,
        type: 'localstorage',
        id: 'valence-connections'
    }
});

Ext.define('Valence.login.store.Connections', {
    extend: 'Ext.data.Store',
    requires: [
        'Valence.login.model.Connection'
    ],
    storeId: 'Connections',
    model: 'Valence.login.model.Connection'
});

Ext.define('Valence.login.model.Environment', {
    extend: 'Ext.data.Model',
    fields: [
        'envId',
        'current',
        {
            name: 'envName',
            convert: Valence.util.Helper.decodeUTF16
        }
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});

Ext.define('Valence.login.store.Login_Environments', {
    extend: 'Ext.data.Store',
    requires: [
        'Valence.login.model.Environment'
    ],
    storeId: 'Login_Environments',
    model: 'Valence.login.model.Environment'
});

Ext.define('Valence.login.view.login.LoginModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.login',
    data: {
        appBarTitleIconAlign: 'left',
        appBarTitleIconCls: 'x-fa fa-bars',
        appBarTitleHide: false,
        appBarTitleMenuHide: true,
        appBarUI: 'primary-dark',
        appBarSearch: false,
        appBarSearchIcon: false,
        connectionsCls: '',
        forgotPasswordCls: 'vv-login-forgot-pwd',
        forgotPasswordPrompt: false,
        hasConnection: false,
        inConnectionEditMode: false,
        loginValidation: true,
        loginValidationText: Valence.lang.lit.canNotBeBlank,
        loginDisabled: false,
        mobilePortal: false
    },
    formulas: {
        connectionRequired: function(get) {
            // get('mode') is kind of redundant but included it so this value would get updated due to timing and mode possibly
            // being set after the viewmodel is created
            //
            return Valence.login.Processor.isPortal() && get('mode') !== 'desktop' && (Ext.os.name == 'iOS' || Ext.os.name == 'Android');
        },
        showNoConnection: function(get) {
            return get('connectionRequired') && !get('hasConnection');
        },
        showExistingConnection: function(get) {
            return get('connectionRequired') && get('hasConnection');
        },
        connectionsCls: function(get) {
            return (get('hasConnection') ? 'vv-login-connections' : 'vv-login-connections vv-login-connections-none');
        },
        loginValidationHTML: function(get) {
            return (get('loginValidation') ? '' : get('loginValidationText'));
        },
        editConnectionBtnIconCls: function(get) {
            return (get('inConnectionEditMode') ? 'vvicon vvicon-pencil6' : '');
        },
        connectionFtrEditIconCls: function(get) {
            return (get('inConnectionEditMode') ? 'fa fa-times' : 'vvicon vvicon-pencil6');
        }
    }
});

Ext.define('Valence.login.view.changepassword.ChangepasswordController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.changepassword',
    onClickOk: function() {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            curpwd = view.lookupReference('curpwd').getValue(),
            newpwd = view.lookupReference('newpwd').getValue(),
            newpwd2 = view.lookupReference('newpwd2').getValue(),
            user = vm.get('user'),
            params = {
                user: Valence.util.Helper.encodeUTF16(user),
                action: 'chgPassword',
                curpwd: Valence.util.Helper.encodeUTF16(curpwd),
                newpwd: Valence.util.Helper.encodeUTF16(newpwd),
                newpwd2: Valence.util.Helper.encodeUTF16(newpwd2)
            },
            app = Valence.login.config.Runtime.getApplication();
        if (app && app.fireEvent('beforechangepassword', params) !== false) {
            if (Ext.isClassic) {
                view.el.mask();
            } else {
                Ext.Viewport.mask({
                    xtype: 'loadmask'
                });
            }
            Ext.Ajax.request({
                url: Valence.login.Processor.getHostUrl() + '/valence/vvlogin.pgm',
                params: params,
                success: function(r) {
                    if (Ext.isClassic) {
                        view.el.unmask();
                    } else {
                        Ext.Viewport.unmask();
                    }
                    var d = Ext.decode(r.responseText);
                    if (d.success) {
                        if (app) {
                            app.fireEvent('passwordchanged', user, newpwd);
                        }
                        me.fireViewEvent('success', newpwd);
                        view.destroy();
                        if (Ext.isClassic) {
                            Valence.common.util.Snackbar.show(Valence.lang.lit.passwordChg);
                        }
                    } else {
                        view.lookupReference(d.fld).markInvalid(Valence.common.util.Helper.getLit(d));
                    }
                }
            });
        }
    },
    onClickCancel: function() {
        var app = Valence.login.config.Runtime.getApplication();
        if (app) {
            app.fireEvent('passwordcancel');
        }
        this.getView().close();
    },
    onSpecialKeyPassword: function(fld, e) {
        var me = this,
            view = me.getView(),
            form = view.lookupReference('form');
        if (e.getKey() === e.ENTER && form.isValid()) {
            me.onClickOk();
        }
    }
});

Ext.define('Valence.login.view.changepassword.ChangepasswordModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.changepassword'
});

Ext.define('Valence.login.view.changepassword.Changepassword', {
    extend: 'Ext.Window',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Text',
        'Ext.form.Panel',
        'Ext.layout.container.Fit',
        'Valence.login.view.changepassword.ChangepasswordController',
        'Valence.login.view.changepassword.ChangepasswordModel'
    ],
    xtype: 'changepassword',
    basePortal: true,
    cls: 'vv-chg-pwd',
    autoShow: true,
    viewModel: {
        type: 'changepassword'
    },
    controller: 'changepassword',
    layout: 'fit',
    width: 400,
    modal: true,
    title: Valence.lang.lit.changePassword,
    defaultFocus: '[name=curpwd]',
    buttons: [
        {
            text: Valence.lang.lit.cancel,
            handler: 'onClickCancel'
        }
    ],
    items: [
        {
            xtype: 'form',
            reference: 'form',
            cls: 'vv-chg-pwd-form',
            bodyPadding: '8 24',
            defaults: {
                xtype: 'textfield',
                allowBlank: false,
                inputType: 'password',
                labelAlign: 'top',
                labelSeparator: '',
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [
                {
                    reference: 'curpwd',
                    fieldLabel: Valence.lang.lit.currentPassword,
                    cls: 'vv-chgpwd-cur',
                    labelClsExtra: 'vv-chgpwd-cur-lbl',
                    name: 'curpwd',
                    listeners: {
                        specialkey: 'onSpecialKeyPassword'
                    }
                },
                {
                    reference: 'newpwd',
                    fieldLabel: Valence.lang.lit.newPassword,
                    cls: 'vv-chgpwd-new',
                    labelClsExtra: 'vv-chgpwd-new-lbl',
                    name: 'newpwd',
                    listeners: {
                        specialkey: 'onSpecialKeyPassword'
                    }
                },
                {
                    reference: 'newpwd2',
                    fieldLabel: Valence.lang.lit.retypeNewPassword,
                    cls: 'vv-chgpwd-new2',
                    labelClsExtra: 'vv-chgpwd-new2-lbl',
                    name: 'newpwd2',
                    listeners: {
                        specialkey: 'onSpecialKeyPassword'
                    }
                },
                {
                    xtype: 'button',
                    formBind: true,
                    cls: 'vv-chgpwd-ok-btn',
                    text: Valence.lang.lit.ok,
                    scale: 'medium',
                    handler: 'onClickOk'
                }
            ]
        }
    ]
});

Ext.define('Valence.login.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',
    requires: [
        'Valence.common.util.Dialog',
        'Valence.login.view.changepassword.Changepassword',
        'Valence.login.store.Connections',
        'Valence.common.util.Snackbar',
        'Valence.login.util.Helper'
    ],
    init: function() {
        var me = this;
        me.listen({
            global: {
                vvonline: 'onNetworkChangeOnline',
                vvoffline: 'onNetworkChangeOffline'
            }
        });
    },
    initViewModel: function(vm) {
        var me = this,
            view = me.getView(),
            connection, rec, store;
        vm.set({
            forgotPasswordText: Valence.lang.lit.forgotPassword,
            connectionsText: Valence.lang.lit.noConnections
        });
        if (Ext.isModern) {
            vm.bind('{loginValidation}', function(loginValidation) {
                Ext.each(view.query('field'), function(item) {
                    if (/field/.test(item.getXTypes())) {
                        item.toggleCls('vv-field-invalid', !loginValidation);
                    }
                    return true;
                });
            });
        }
    },
    afterRender: function(cmp) {
        var me = this,
            user = cmp.lookupReference('user'),
            password = cmp.lookupReference('password');
        setTimeout(function() {
            var uVal, pVal;
            if (!Ext.isEmpty(user)) {
                uVal = user.getValue();
            }
            if (!Ext.isEmpty(password)) {
                pVal = password.getValue();
            }
            if (user && Ext.isEmpty(uVal)) {
                user.focus();
            } else {
                password.focus();
            }
            if (!Ext.isEmpty(uVal) && !Ext.isEmpty(pVal)) {
                me.onLogin();
            }
        }, 200);
    },
    // Used for modern to check if the login package is running from the mobile portal
    //
    onAfterRenderLogin: function() {
        var me = this,
            vm = me.getViewModel(),
            connection, rec, store, find;
        if (vm.get('connectionRequired')) {
            store = me.getConnectionStore();
            find = function(rec) {
                if (rec.get('selected') && rec.get('invalid')) {
                    return true;
                }
                return false;
            };
            rec = store.getAt(store.findBy(find));
            if (!Ext.isEmpty(rec)) {
                vm.set({
                    hasConnection: false,
                    connectionsText: rec.get('desc') + ' !',
                    loginDisabled: true
                });
                Valence.common.util.Dialog.show({
                    title: Valence.lang.lit.invalidConnection,
                    msg: 'Cannot connect to ' + rec.get('desc'),
                    buttons: [
                        '->',
                        {
                            text: Valence.lang.lit.ok
                        }
                    ],
                    handler: function() {
                        me.connectionHandler(false);
                    }
                });
                return;
            }
            rec = store.findRecord('selected', true);
            if (store.getCount() > 0) {
                if (Ext.isEmpty(rec)) {
                    rec = store.getAt(0);
                    rec.set('selected', true);
                    rec.commit();
                    store.sync();
                }
                connection = {
                    hasConnection: true,
                    connectionsText: rec.get('desc'),
                    hostUrl: rec.get('url') + ":" + rec.get('port')
                };
                Ext.apply(connection, rec.getData());
            } else {
                connection = {
                    hasConnection: false,
                    loginDisabled: true,
                    connectionsText: Valence.lang.lit.noConnections
                };
            }
            vm.set(connection);
            // added timeout to ensure the viewport is unmasked
            //
            setTimeout(function() {
                Ext.Viewport.unmask();
            }, 300);
        }
    },
    getConnectionStore: function() {
        var str = Ext.getStore('Connections');
        if (Ext.isEmpty(str)) {
            str = Ext.create('Valence.login.store.Connections');
        }
        return str;
    },
    onClickConnectionMenuAdd: function() {
        var me = this,
            vm = me.getViewModel();
        vm.set('inConnectionEditMode', false);
        me.connectionHandler(true);
    },
    onClickConnectionMenuBtn: function(btn) {
        var me = this,
            vm = me.getViewModel(),
            rec = btn.rec,
            connName = rec.get('desc'),
            url = rec.get('url') + ':' + rec.get('port'),
            loginPkgOpts = Valence.login.Processor.getOptions();
        Valence.login.Processor.setOptions(Ext.apply(loginPkgOpts, {
            hostUrl: url
        }));
        Valence.login.Processor.setHostUrl(url);
        if (vm.get('inConnectionEditMode')) {
            if (!Ext.isEmpty(rec)) {
                vm.set({
                    connRec: rec
                });
            }
            me.connectionHandler(true);
            return;
        }
        vm.set({
            hasConnection: true,
            loginDisabled: false,
            connectionsText: connName
        });
        Ext.Viewport.hideMenu('left');
    },
    onClickConnectionMenuEdit: function() {
        var me = this,
            vm = me.getViewModel();
        vm.set('inConnectionEditMode', !vm.get('inConnectionEditMode'));
    },
    onClickCancelForgotPassword: function() {
        var me = this,
            vm = me.getViewModel();
        vm.set({
            forgotPasswordPrompt: false,
            forgotPasswordText: Valence.lang.lit.forgotPassword,
            loginValidation: true
        });
    },
    connectionHandler: function(fromMenu) {
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            footer = {
                xtype: 'container',
                docked: 'bottom',
                layout: {
                    type: 'hbox'
                },
                defaults: {
                    height: 40,
                    ui: 'transparent',
                    flex: 1
                },
                items: [
                    {
                        xtype: 'button',
                        bind: {
                            iconCls: '{connectionFtrEditIconCls}'
                        },
                        listeners: {
                            tap: 'onClickConnectionMenuEdit',
                            scope: me
                        }
                    },
                    {
                        xtype: 'button',
                        iconCls: 'fa fa-plus',
                        listeners: {
                            tap: 'onClickConnectionMenuAdd',
                            scope: me
                        }
                    }
                ]
            },
            header = {
                xtype: 'component',
                cls: 'vv-connections-menu-hdr',
                html: Valence.lang.lit.connections
            },
            store, menu,
            connectionBtns = [],
            btnTxt, menuItems, lock;
        store = Ext.getStore('Connections');
        if (store.getCount() == 0 || fromMenu) {
            if (fromMenu) {
                Ext.Viewport.hideMenu('left');
            }
            view.setActiveItem(1);
        } else {
            store.each(function(rec) {
                btnTxt = rec.get('desc');
                if (rec.get('invalid')) {
                    btnTxt += '<span style="padding-left:8px; position:relative; top:1px;" class="vvicon vvicon-notification2"></span>';
                }
                connectionBtns.push({
                    text: btnTxt,
                    rec: rec,
                    bind: {
                        iconCls: '{editConnectionBtnIconCls}'
                    }
                });
            });
            menuItems = [
                header,
                {
                    xtype: 'container',
                    cls: 'vv-connections-menu-body',
                    defaultType: 'button',
                    defaults: {
                        ui: 'transparent',
                        listeners: {
                            tap: 'onClickConnectionMenuBtn',
                            scope: me
                        },
                        cls: 'vv-connections-menu-body-btn',
                        iconAlign: 'right'
                    },
                    items: connectionBtns
                }
            ];
            lock = Valence.login.config.Settings.getLockConnections();
            if (Ext.isString(lock)) {
                lock = (lock == 'true');
            }
            if (!lock) {
                menuItems.push(footer);
            }
            menu = Ext.create('Ext.Menu', {
                cls: 'vv-login-connections-menu',
                viewModel: vm,
                listeners: {
                    hide: 'onHideConnectionMenu',
                    scope: me
                },
                items: menuItems
            });
            Ext.Viewport.setMenu(menu, {
                side: 'left',
                cover: false
            });
            Ext.Viewport.showMenu('left');
        }
    },
    onClickConnection: function() {
        var me = this;
        me.connectionHandler();
    },
    onClickForgotPassword: function() {
        var me = this,
            vm = me.getViewModel();
        vm.set({
            forgotPasswordPrompt: true,
            forgotPasswordText: Valence.lang.lit.tempPasswordPrompt,
            loginValidation: true
        });
    },
    onClickSelectLanguage: function() {
        var me = this,
            view, viewEl;
        if (Ext.isClassic) {
            view = me.getView();
            view.el.down('.x-box-inner').addCls('vv-login-show-select-lng');
            Ext.widget('window', {
                title: Valence.lang.lit.selectLanguage,
                layout: 'fit',
                autoShow: true,
                width: 300,
                modal: true,
                closable: true,
                items: [
                    {
                        xtype: 'grid',
                        store: 'Languages',
                        hideHeaders: true,
                        columns: [
                            {
                                flex: 1,
                                text: Valence.lang.lit.language,
                                dataIndex: 'VVLNGNAME'
                            }
                        ],
                        listeners: {
                            scope: me,
                            itemclick: 'onSelectLanguage'
                        }
                    }
                ],
                listeners: {
                    scope: me,
                    destroy: 'onDestroyLanguageSelection'
                }
            });
        } else {
            Valence.common.util.PickerList.showPickerList({
                title: 'Select a Language:',
                handler: me.onSelectLanguage,
                listArray: 'Languages',
                displayField: 'VVLNGNAME',
                scope: me
            });
        }
    },
    onDestroyChangepassword: function(cmp) {
        var me = this,
            view = me.getView();
        view.el.down('.x-box-inner').removeCls('vv-login-show-chg-password');
    },
    onDestroyLanguageSelection: function(cmp) {
        var me = this,
            view = me.getView();
        view.el.down('.x-box-inner').removeCls('vv-login-show-select-lng');
    },
    onHideConnectionMenu: function() {
        var me = this,
            view = me.getView(),
            vm = me.getViewModel();
        if (/login/.test(view.getActiveItem().getXTypes())) {
            vm.set('inConnectionEditMode', false);
        }
    },
    onLogin: function() {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            form = view.lookupReference('form'),
            values = form.getValues(),
            user = values.user,
            appId = Valence.login.Processor.getAppId(),
            app = Valence.login.config.Runtime.getApplication(),
            hostUrl = Valence.login.Processor.getHostUrl(),
            mobilePortal = Valence.login.Processor.getNamespace() == 'Portal' && Ext.isModern && (Ext.os.name == 'iOS' || Ext.os.name == 'Android'),
            url,
            parms = {
                action: 'login',
                lng: vm.get('language'),
                display: vm.get('mode'),
                version: vm.get('version'),
                forceEnv: Valence.login.config.Runtime.getUrlParms().environment
            },
            invalid, connStr, find, rec;
        if (Ext.isModern) {
            if (Ext.isEmpty(values.user)) {
                view.lookupReference('user').toggleCls('vv-field-invalid', true);
                vm.set('loginValidation', false);
                invalid = true;
            } else {
                view.lookupReference('user').toggleCls('vv-field-invalid', false);
            }
            if (Ext.isEmpty(values.password)) {
                view.lookupReference('password').toggleCls('vv-field-invalid', true);
                vm.set('loginValidation', false);
                invalid = true;
            } else {
                view.lookupReference('password').toggleCls('vv-field-invalid', false);
            }
            if (invalid) {
                vm.set('loginValidationText', Valence.lang.lit.canNotBeBlank);
                return;
            }
        }
        // encode the form values...
        //
        values.user = Valence.util.Helper.encodeUTF16(values.user);
        values.password = Valence.util.Helper.encodeUTF16(values.password);
        Ext.apply(parms, values);
        //if appId exists then pass it to validate authorization
        //
        if (!Ext.isEmpty(appId)) {
            Ext.apply(parms, {
                validateAppId: appId
            });
        }
        if (mobilePortal) {
            Valence.login.Processor.setHostUrl(hostUrl);
        } else {
            if (Ext.isModern) {
                Ext.Viewport.mask({
                    indicator: true,
                    xtype: 'loadmask',
                    message: Valence.lang.lit.loading
                });
            } else {
                Valence.common.util.Helper.loadMask(Valence.lang.lit.validatingLogin);
            }
        }
        if (!app || app.fireEvent('beforelogin', parms) !== false) {
            // todo -- remove for production
            //if (Ext.os.name !== 'iOS' && Ext.os.name !== 'Android' && hostUrl == 'http://192.168.75.14:6050'){
            //    hostUrl = '';
            //}
            url = hostUrl + '/valence/vvlogin.pgm';
            Ext.Ajax.request({
                url: url,
                params: parms,
                scope: me,
                success: function(r) {
                    Valence.common.util.Helper.destroyLoadMask();
                    var d = Ext.decode(r.responseText);
                    if (mobilePortal) {
                        Ext.Viewport.unmask();
                    } else {
                        Valence.common.util.Helper.destroyLoadMask();
                    }
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
                            data: d.envs
                        });
                        Valence.login.config.Runtime.setUser(user);
                        if (app) {
                            app.fireEvent('login', user, d.sid);
                            app.fireEvent('environmentset', user, d.env);
                        }
                        d.firstname = Valence.util.Helper.decodeUTF16(d.firstname);
                        d.lastname = Valence.util.Helper.decodeUTF16(d.lastname);
                        if (Ext.isModern && Valence.login.Processor.isPortal()) {
                            connStr = me.getConnectionStore();
                            find = function(rec) {
                                return rec.get('selected') && rec.get('invalid');
                            };
                            rec = connStr.getAt(connStr.findBy(find));
                            if (!Ext.isEmpty(rec)) {
                                rec.set('invalid', false);
                                rec.commit();
                                connStr.sync();
                            }
                        }
                        me.fireViewEvent('loggedin', me.getView(), Ext.apply(d, {
                            loginId: user
                        }));
                    } else {
                        if (app) {
                            app.fireEvent('loginfailure', parms, d);
                        }
                        // login has failed...
                        //   this can be any number of reasons:
                        //
                        //  1.) change password required (sts === "changepassword")
                        //  2.) too many sessions for non Enterprise installation with option to kill session (sts === "killsession")
                        //  3.) too many sessions for non Enterprise (sts === "exceededlimit")
                        //  4.) invalid credentials
                        //
                        var sts = d.sts || null;
                        if (!sts) {
                            if (Ext.isEmpty(d.fld) && !Ext.isEmpty(d.lit)) {
                                var image = view.down('image'),
                                    imageSrc = (!Ext.isEmpty(image) && !Ext.isEmpty(image.src)) ? image.src : null;
                                Valence.login.util.Helper.showImageDialog(Valence.common.util.Helper.getLit(d), imageSrc);
                                view.hide();
                            } else {
                                if (Ext.isClassic) {
                                    view.lookupReference(d.fld).markInvalid(Valence.common.util.Helper.getLit(d));
                                } else {
                                    view.lookupReference(d.fld).toggleCls('vv-field-invalid', true);
                                    vm.set({
                                        loginValidation: false,
                                        loginValidationText: Valence.lang.lit.invalidLogin.toLowerCase()
                                    });
                                }
                            }
                        } else if (sts === 'changepassword') {
                            if (app && app.fireEvent('beforeshowchangepassword') !== false) {
                                if (Valence.login.config.Runtime.getIsDesktop()) {
                                    view.el.down('.x-box-inner').addCls('vv-login-show-chg-password');
                                    Ext.widget('changepassword', {
                                        listeners: {
                                            scope: me,
                                            destroy: 'onDestroyChangepassword',
                                            success: 'onSuccessChangepassword'
                                        },
                                        viewModel: {
                                            data: {
                                                user: view.lookupReference('user').getValue()
                                            }
                                        }
                                    });
                                }
                            }
                        }
                        // login for mobile portal is handle by the app after login
                        else if (sts === 'killsession' || sts === 'exceededlimit') {
                            if (Valence.login.config.Runtime.getIsDesktop()) {
                                Valence.common.util.Dialog.show({
                                    msg: Valence.common.util.Helper.getLit(d),
                                    buttons: [
                                        {
                                            text: Valence.lang.lit.ok
                                        }
                                    ]
                                });
                            } else {}
                        } else // todo - mobile logic for "killsession" or "exceededlimit"
                        {
                            Valence.common.util.Snackbar.show(Valence.lang.lit.serverError);
                        }
                    }
                    if (Ext.isModern) {
                        Ext.Viewport.unmask();
                    }
                },
                failure: function() {
                    Ext.log({
                        msg: 'login failure'
                    });
                    if (Ext.isModern) {
                        Ext.Viewport.unmask();
                    } else {
                        Valence.common.util.Helper.destroyLoadMask();
                    }
                    Valence.common.util.Dialog.show({
                        title: Valence.lang.lit.error,
                        msg: Valence.lang.lit.noResponseFromServer,
                        buttonAlign: 'right',
                        buttons: [
                            {
                                text: Valence.lang.lit.ok
                            }
                        ]
                    });
                }
            });
        }
    },
    onKeyupLogin: function(fld, e) {
        var me = this,
            view = me.getView(),
            name, pwFld;
        if (e.keyCode == 13) {
            name = fld.getName();
            if (name == 'user') {
                pwFld = view.lookupReference('password');
                pwFld.focus();
            } else if (name == 'password') {
                me.onLogin();
            }
        }
    },
    onNetworkChangeOnline: function() {
        if (Ext.os.name == 'iOS' || Ext.os.name == 'Android') {
            var me = this,
                disable = false,
                connStr = Ext.getStore('Connections');
            if (Ext.isEmpty(connStr) || connStr.getCount() == 0) {
                disable = true;
            }
            me.getViewModel().set('loginDisabled', disable);
        }
    },
    onNetworkChangeOffline: function() {
        if (Ext.os.name == 'iOS' || Ext.os.name == 'Android') {
            var me = this;
            me.getViewModel().set('loginDisabled', true);
        }
    },
    onRenderLogin: function(cmp) {
        cmp.getLayout().onContentChange();
    },
    onSelectLanguage: function(view, rec) {
        var me = this,
            lng = rec.get('VVLNG');
        if (Valence.login.config.Runtime.getIsDesktop()) {
            var wl = window.location,
                newPath = wl.pathname + '?lang=' + lng;
            if (Ext.isModern) {
                newPath += '&modern';
            }
            wl.href = newPath;
        } else {}
    },
    // todo - onSelectLanguage mobile
    onSendPassword: function() {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            form = view.lookupReference('form'),
            values = form.getValues(),
            user = values.user,
            app = Valence.login.config.Runtime.getApplication(),
            parms = {
                action: 'sendPassword',
                user: Valence.util.Helper.encodeUTF16(user),
                text0: Valence.util.Helper.encodeUTF16(Valence.lang.lit.tempPassword),
                text1: Valence.util.Helper.encodeUTF16(Valence.lang.lit.tempPasswordEmail1),
                text2: Valence.util.Helper.encodeUTF16(Valence.lang.lit.tempPasswordEmail2),
                text3: Valence.util.Helper.encodeUTF16(Valence.lang.lit.tempPasswordEmail3)
            };
        if (Ext.isEmpty(user)) {
            if (Ext.isModern) {
                view.lookupReference('user').toggleCls('vv-field-invalid', true);
                vm.set('loginValidation', false);
            }
            return;
        }
        if (app && app.fireEvent('beforesendpassword', parms) !== false) {
            // todo -- set mask for mobile
            form.el.mask();
            Ext.Ajax.request({
                url: Valence.login.Processor.getHostUrl() + '/valence/vvlogin.pgm',
                params: parms,
                scope: me,
                success: me.onSendPasswordSuccess
            });
        }
    },
    onSendPasswordSuccess: function(r) {
        var me = this,
            d = Ext.decode(r.responseText),
            form = me.getView().lookupReference('form');
        form.el.unmask();
        if (d.success) {
            me.onClickCancelForgotPassword();
            Valence.common.util.Snackbar.show(Valence.lang.lit.tempPasswordSent);
        } else {
            var fld = me.getView().lookupReference(d.fld);
            if (fld) {
                fld.markInvalid(Valence.common.util.Helper.getLit(d));
                fld.focus();
            }
        }
    },
    onSpecialKeyPassword: function(fld, e) {
        var me = this,
            view = me.getView(),
            form = view.lookupReference('form');
        if (e.getKey() === e.ENTER && form.isValid()) {
            if (view.getXType() === 'login') {
                me.onLogin();
            } else {
                me.onUnlock();
            }
        }
    },
    onSuccessChangepassword: function(view, pwd) {
        var me = this,
            password = me.getView().lookupReference('password');
        password.setValue(pwd);
        me.onLogin();
    },
    onUnlock: function() {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            pw = view.lookupReference('password').getValue();
        Ext.Ajax.request({
            url: vm.get('hostUrl') + '/valence/vvlogin.pgm',
            params: {
                action: 'unlock',
                password: Valence.util.Helper.encodeUTF16(pw)
            },
            scope: me,
            success: me.onUnlockSuccess
        });
    },
    onUnlockSuccess: function(r) {
        var me = this,
            view = me.getView(),
            app = Valence.login.config.Runtime.getApplication(),
            d = Ext.decode(r.responseText);
        if (d.success) {
            view.el.fadeOut({
                callback: function() {
                    view.destroy();
                }
            });
            Valence.login.config.Runtime.setIsLocked(false);
            if (app) {
                app.fireEvent('unlock');
                app.fireEvent('resumelock');
            }
        } else {
            view.lookupReference('password').markInvalid(Valence.common.util.Helper.getLit(d));
        }
    }
});

Ext.define('Valence.login.view.login.Login', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.Text',
        'Ext.form.Panel',
        'Ext.layout.container.VBox',
        'Valence.login.view.login.LoginModel',
        'Valence.login.view.login.LoginController'
    ],
    xtype: 'login',
    viewModel: {
        type: 'login'
    },
    controller: 'login',
    cls: 'vv-login-cnt',
    layout: {
        type: 'vbox',
        align: 'middle'
    },
    basePortal: true,
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            items: me.buildItems()
        });
        me.callParent(arguments);
        me.on({
            scope: me,
            afterrender: me.onAfterRender
        });
    },
    buildItems: function() {
        return [
            {
                xtype: 'image',
                bind: {
                    src: '{image}'
                },
                cls: 'vv-login-img'
            },
            {
                xtype: 'form',
                reference: 'form',
                cls: 'vv-login-form',
                bodyCls: 'vv-login-form-body',
                defaults: {
                    width: '100%',
                    labelAlign: 'top',
                    labelSeparator: ''
                },
                items: [
                    {
                        xtype: 'textfield',
                        cls: 'vv-login-user',
                        msgTarget: 'under',
                        labelClsExtra: 'vv-login-user-lbl',
                        fieldLabel: Valence.lang.lit.userName,
                        allowBlank: false,
                        name: 'user',
                        itemId: 'user',
                        reference: 'user',
                        ui: 'large',
                        bind: {
                            value: '{username}'
                        },
                        triggers: {
                            user: {
                                cls: 'login-trigger vvicon-user vv-login-user-trigger'
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        cls: 'vv-login-pwd',
                        msgTarget: 'under',
                        labelClsExtra: 'vv-login-pwd-lbl',
                        name: 'password',
                        itemId: 'password',
                        reference: 'password',
                        validateOnBlur: false,
                        ui: 'large',
                        fieldLabel: Valence.lang.lit.password,
                        allowBlank: false,
                        inputType: 'password',
                        bind: {
                            hidden: '{forgotPasswordPrompt}',
                            disabled: '{forgotPasswordPrompt}',
                            value: '{password}'
                        },
                        triggers: {
                            lock: {
                                cls: 'login-trigger vvicon-lock vv-login-user-password'
                            }
                        },
                        listeners: {
                            specialkey: 'onSpecialKeyPassword'
                        }
                    },
                    {
                        xtype: 'button',
                        formBind: true,
                        cls: 'vv-login-btn',
                        itemId: 'login-btn',
                        bind: {
                            hidden: '{forgotPasswordPrompt}'
                        },
                        text: Valence.lang.lit.login,
                        scale: 'medium',
                        handler: 'onLogin'
                    },
                    {
                        xtype: 'button',
                        formBind: true,
                        cls: 'vv-login-sendpwd-btn',
                        itemId: 'sendpwd-btn',
                        bind: {
                            hidden: '{!forgotPasswordPrompt}'
                        },
                        text: Valence.lang.lit.sendPassword,
                        scale: 'medium',
                        handler: 'onSendPassword'
                    },
                    {
                        xtype: 'component',
                        cls: 'vv-login-forgotpwd-cancel',
                        html: Valence.lang.lit.cancel,
                        bind: {
                            hidden: '{!forgotPasswordPrompt}'
                        },
                        listeners: {
                            el: {
                                click: 'onClickCancelForgotPassword'
                            }
                        }
                    },
                    {
                        xtype: 'component',
                        cls: 'vv-login-select-lng',
                        itemId: 'selectlng-btn',
                        hidden: !Valence.login.config.Settings.getMultiLingual(),
                        html: Valence.lang.lit.selectLanguage,
                        listeners: {
                            el: {
                                click: 'onClickSelectLanguage'
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'component',
                cls: 'vv-login-forgot-pwd',
                itemId: 'forgotpwd-btn',
                bind: {
                    hidden: '{!forgotPassword}',
                    html: '{forgotPasswordText}'
                },
                listeners: {
                    el: {
                        click: 'onClickForgotPassword'
                    }
                }
            }
        ];
    },
    onAfterRender: function(cmp) {
        var me = this;
        Ext.on('resize', me.onResizeBrowser, me);
    },
    onDestroy: function() {
        var me = this;
        Ext.un('resize', me.onResizeBrowser, me);
        me.callParent(arguments);
    },
    onResizeBrowser: function() {
        var me = this;
        me.updateLayout();
    }
});

/**
 * Class to initiate Valence Portal security, UI, and all related Portal tasks.
 */
Ext.define('Valence.login.Processor', {
    singleton: true,
    requires: [
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
        'Valence.login.view.login.Login'
    ],
    //'Valence.login.view.phone.login.Login',
    //'Valence.login.view.phone.connection.Connection',
    //'Valence.login.view.tablet.login.Login',
    //'Valence.login.view.tablet.connection.Connection'
    config: {
        appId: null,
        appUmbrella: null,
        autoLogout: null,
        bypassLogin: false,
        bypassReuseSid: false,
        callback: null,
        connectionName: null,
        customSid: '',
        forcePrompt: false,
        forgotPassword: true,
        hook: '',
        hostUrl: '',
        image: null,
        isRunningInPortal: false,
        language: '',
        namespace: '',
        mode: 'desktop',
        options: {},
        password: null,
        renderTo: null,
        scope: null,
        sid: null,
        theme: '',
        themePath: null,
        username: '',
        version: null
    },
    scripts: [],
    applyMode: function(mode) {
        Valence.login.config.Runtime.setIsDesktop(mode === 'desktop');
        Valence.login.config.Runtime.setIsMobile(mode !== 'desktop');
        return mode;
    },
    applyNamespace: function(ns) {
        Valence.login.config.Runtime.setNamespace(ns);
        return ns;
    },
    applyOptions: function(o) {
        var me = this;
        // reset any necessary configs...
        //
        me.setBypassLogin(false);
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
        }
        if (Ext.isEmpty(o.hostUrl)) {
            o.hostUrl = window.location.origin || window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
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
            me.setRenderTo((Ext.isModern) ? Ext.Viewport.el : Ext.getBody());
        }
        if (o.themePath) {
            me.setThemePath(o.themePath);
        }
        return o;
    },
    checkHookForImage: function() {
        var me = this,
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
    createUUID: function() {
        var s = [],
            hexDigits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 62), 1);
        }
        s[14] = "4";
        // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 3) | 8, 1);
        // bits 6-7 of the clock_seq_hi_and_reserved to 01
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
    init: function(o) {
        var me = this;
        Ext.applyIf(o, {
            scope: me,
            mode: 'desktop',
            poll: true,
            autoLock: true,
            autoLogout: true,
            manageIframes: false
        });
        me.setOptions(o);
        me.processUrl().then(me.processConnections).then(me.processHook).then(me.processSid).then(me.processToken).then(me.processSettings).then(me.processLanguage).then(me.processLocale).then(me.processTheme).then(me.processFavicon).then(me.processAppUmbrella).then(me.processView).then(me.processLoginData).then(me.processUnload).then(me.processCallback).then(me.processAppTasks).then(null, me.processFailure);
    },
    isPortal: function() {
        return Valence.login.config.Runtime.getNamespace() === 'Portal';
    },
    processAppTasks: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            ctl = me.getAppUmbrella();
        ctl.initTasks();
        deferred.resolve(content);
        return deferred.promise;
    },
    processAppUmbrella: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            options = me.getOptions();
        me.setAppUmbrella(Ext.create('Valence.login.AppUmbrella'));
        me.getAppUmbrella().init(options);
        deferred.resolve(content);
        return deferred.promise;
    },
    processCallback: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            cb = me.getCallback(),
            scope = me.getScope() || content.scope;
        if (cb) {
            if (Ext.isModern) {
                Ext.Viewport.unmask();
            }
            Ext.callback(cb, scope);
        }
        deferred.resolve(content);
        return deferred.promise;
    },
    processConnections: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            cfg, rec, store, cmp, hostUrl, url, port, desc, updateUrl;
        if (me.getNamespace() == 'Portal' && Ext.isModern && (Ext.os.name == 'iOS' || Ext.os.name == 'Android')) {
            updateUrl = function(recs, ops, success) {
                if (!success || store.getCount() == 0) {
                    // todo -- uncomment and remove if for production
                    //
                    //if (me.getHostUrl() != 'http://192.168.75.14:6050') {
                    //    me.setHostUrl('');
                    //}
                    Ext.Viewport.unmask();
                    cfg = {
                        xtype: 'connection',
                        fullScreen: true,
                        viewModel: {
                            data: {
                                // needs to be set to hide the remove button
                                //
                                inConnectionEditMode: false
                            }
                        },
                        listeners: {
                            connectionadded: function(cmp, vals) {
                                hostUrl = vals.url + ':' + vals.port;
                                Ext.Ajax.request({
                                    url: hostUrl + '/valence/vvlogin.pgm',
                                    params: {
                                        action: 'getSettings'
                                    },
                                    success: function() {
                                        cmp.destroy();
                                        store.add(vals);
                                        store.sync();
                                        Ext.Viewport.mask({
                                            indicator: true,
                                            xtype: 'loadmask',
                                            message: Valence.lang.lit.loading
                                        });
                                        deferred.resolve(content);
                                        me.setOptions(Ext.apply(me.getOptions(), {
                                            hostUrl: hostUrl
                                        }));
                                        me.setHostUrl(hostUrl);
                                    },
                                    failure: function() {
                                        Valence.common.util.Dialog.show({
                                            title: Valence.lang.lit.invalidConnection,
                                            msg: 'Cannot connect to ' + vals.desc,
                                            buttons: [
                                                '->',
                                                {
                                                    text: Valence.lang.lit.ok
                                                }
                                            ]
                                        });
                                    }
                                });
                            },
                            connectionfromlink: function() {
                                rec = store.findRecord('selected', true);
                                if (Ext.isEmpty(rec) && store.getCount() > 0) {
                                    rec = store.getAt(0);
                                    rec.set('selected', true);
                                    rec.commit();
                                    store.sync();
                                }
                                hostUrl = rec.get('url') + ":" + rec.get('port');
                                me.setOptions(Ext.apply(me.getOptions(), {
                                    hostUrl: hostUrl
                                }));
                                me.setHostUrl(hostUrl);
                                cmp.destroy();
                                Ext.Viewport.mask({
                                    indicator: true,
                                    xtype: 'loadmask',
                                    message: Valence.lang.lit.loading
                                });
                                deferred.resolve(content);
                            },
                            scope: me
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
                        indicator: true,
                        xtype: 'loadmask',
                        message: 'Checking ' + desc
                    });
                    hostUrl = rec.get('url') + ':' + rec.get('port');
                    me.setHostUrl(hostUrl);
                    me.setOptions(Ext.apply(me.getOptions(), {
                        hostUrl: hostUrl
                    }));
                    Ext.Ajax.request({
                        url: hostUrl + '/valence/vvlogin.pgm',
                        params: {
                            action: 'getSettings'
                        },
                        success: function() {
                            Ext.Viewport.mask({
                                indicator: true,
                                xtype: 'loadmask',
                                message: Valence.lang.lit.loading
                            });
                            deferred.resolve(content);
                        },
                        failure: function() {
                            me.setHostUrl('');
                            rec.set('invalid', true);
                            rec.commit();
                            store.sync();
                            Ext.Viewport.mask({
                                indicator: true,
                                xtype: 'loadmask',
                                message: Valence.lang.lit.loading
                            });
                            deferred.resolve(content);
                        }
                    });
                }
            };
            Valence.login.config.Settings.setLockConnections(localStorage.getItem('vvlocked') == 'true');
            Ext.Viewport.mask({
                indicator: true,
                xtype: 'loadmask',
                message: Valence.lang.lit.loading
            });
            store = Ext.getStore('Connections');
            if (Ext.isEmpty(store)) {
                store = Ext.create('Valence.login.store.Connections');
            }
            if (!store.isLoaded()) {
                store.load({
                    callback: function(recs, operation, success) {
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
    processFailure: function(content) {
        var me = content.scope,
            cb = me.getCallback(),
            scope = me.getScope() || content.scope;
        if (content.processLocale) {
            me.processLocale(content);
        }
        if (content.processTheme) {
            me.processTheme(content);
        }
        if (content.executeCallback) {
            if (cb) {
                Ext.callback(cb, scope);
            }
        }
        if (!content.controlledError) {
            Ext.log({
                msg: 'Error occurred during login "Processor"'
            });
        }
    },
    processFavicon: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = Valence.login.config.Settings.getFavicon();
        document.getElementsByTagName('head')[0].appendChild(link);
        deferred.resolve(content);
        return deferred.promise;
    },
    processHook: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            cacheBust = new Date().getTime(),
            hook = me.getHook();
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
                urls: me.scripts,
                callback: function() {
                    deferred.resolve(content);
                }
            });
        } else {
            deferred.resolve(content);
        }
        return deferred.promise;
    },
    processLanguage: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
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
    processLocale: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            lang = me.getLanguage();
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
                urls: me.scripts,
                callback: function() {
                    me.scripts.length = 0;
                    deferred.resolve(content);
                }
            });
        } else {
            deferred.resolve(content);
        }
        return deferred.promise;
    },
    processLock: function() {
        var me = this,
            cfg, cmp;
        Ext.suspendLayouts();
        cfg = {
            xtype: 'lock',
            fullScreen: true,
            viewModel: {
                data: {
                    connectionName: me.getConnectionName(),
                    hostUrl: me.getHostUrl(),
                    lockText: {
                        text: Valence.lang.lit.sessionLockedForUser + ' ' + Valence.login.config.Runtime.getUser()
                    },
                    namespace: me.getNamespace(),
                    mode: me.getMode(),
                    version: me.getVersion()
                }
            },
            listeners: {
                unlocked: function() {
                    cmp.destroy();
                }
            }
        };
        if (!Ext.isModern) {
            cfg.renderTo = me.getRenderTo();
            cmp = Ext.widget('lock', cfg);
        } else {
            cmp = Ext.Viewport.add(cfg);
        }
        setTimeout(function() {
            Ext.resumeLayouts(true);
        }, 200);
    },
    processLoginData: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred');
        Valence.login.config.Runtime.setLoginData(content);
        deferred.resolve(content);
        return deferred.promise;
    },
    processSettings: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            app = Valence.login.config.Runtime.getApplication();
        Ext.Ajax.request({
            url: me.getHostUrl() + '/valence/vvlogin.pgm',
            params: {
                action: 'getSettings',
                mode: me.getMode(),
                customSid: me.getCustomSid(),
                forcePrompt: me.getForcePrompt()
            },
            success: function(r) {
                var d = Ext.decode(r.responseText),
                    settings = Valence.login.config.Settings;
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
                settings.setPasswordReset(d.pwdResetAllowed);
                settings.setPathVariables(d.pathVar);
                settings.setPollInterval(d.pollInterval);
                settings.setSetUserCookie(d.usrCookie);
                settings.setWelcomePage(d.welcomePage);
                settings.setVersion(d.version);
                if (!me.getVersion()) {
                    me.setVersion(d.version);
                }
                // only set the title if this is the Portal...
                //
                if (me.isPortal() && d.browserTitle) {
                    document.title = Valence.util.Helper.decodeUTF16(d.browserTitle);
                }
                if (app) {
                    app.fireEvent('settingsapplied', d);
                }
                // if a customSid was passed, check
                //
                if (d.sid) {
                    me.setBypassLogin(true);
                    // do nothing with this sid as we do not want to overwrite localStorage with this...
                    //
                    // set the user...
                    //
                    if (d.loginId) {
                        d.loginId = Valence.util.Helper.decodeUTF16(d.loginId);
                        Valence.login.config.Runtime.setUser(d.loginId);
                        d.firstname = Valence.util.Helper.decodeUTF16(d.firstname);
                        d.lastname = Valence.util.Helper.decodeUTF16(d.lastname);
                    }
                    //  create the environments store...
                    //
                    if (d.envs) {
                        Ext.create('Valence.login.store.Login_Environments', {
                            data: d.envs
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
                deferred.resolve(content);
            },
            failure: function() {
                Ext.log({
                    msg: 'Valence login processor: call to getSettings failure'
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
    processSid: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            sid = me.getSid(),
            app = Valence.login.config.Runtime.getApplication(),
            appId;
        //if not the portal check for app id in url and set it for passing 
        // to login / is valid session for validation
        //
        if (!me.isPortal()) {
            appId = Ext.getUrlParam('app');
            if (!Ext.isEmpty(appId)) {
                me.setAppId(appId);
            }
        }
        // if there is no sid or set to bypass...
        //    resolve - continue the login process
        //  else
        //    verify that the sid is valid
        //
        if (Ext.isEmpty(sid) || me.getBypassReuseSid()) {
            deferred.resolve(content);
        } else {
            var params = {
                    action: 'isValidSession'
                };
            if (!Ext.isEmpty(appId)) {
                Ext.apply(params, {
                    validateAppId: appId
                });
            }
            Ext.Ajax.request({
                url: me.getHostUrl() + '/valence/vvlogin.pgm',
                params: params,
                scope: me,
                success: function(r) {
                    var d = Ext.decode(r.responseText);
                    if (d.success) {
                        d.loginId = Valence.util.Helper.decodeUTF16(d.loginId);
                        Ext.create('Valence.login.store.Login_Environments', {
                            data: d.envs
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
                        d.lastname = Valence.util.Helper.decodeUTF16(d.lastname);
                        // for backward compatibility (pre Valence 5) set the sessionStorage as well...
                        //
                        sessionStorage.setItem('sid', d.sid);
                        deferred.resolve(Ext.apply(content, d, {
                            reuseSid: true,
                            sid: sid
                        }));
                    } else {
                        if (!Ext.isEmpty(d.lit)) {
                            Valence.login.util.Helper.showImageDialog(Valence.common.util.Helper.getLit(d), me.getImage());
                            deferred.reject();
                        } else {
                            deferred.resolve(Ext.apply(content, d, {
                                reuseSid: false,
                                sid: null
                            }));
                            localStorage.removeItem('sid');
                            sessionStorage.removeItem('sid');
                        }
                    }
                },
                failure: function() {
                    Ext.log({
                        msg: 'Valence login processor: call to isValidSession failure'
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
    processTasks: function() {
        var me = this;
    },
    processTheme: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            theme = me.getTheme() || localStorage.getItem('valence-theme') || 'default',
            mode = me.getMode(),
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
            link.id = 'portaltheme';
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = path;
            head.appendChild(link);
            me.setTheme(theme);
            // load the Portal overrides.css file...
            //
            localStorage.setItem('valence-theme', theme);
            link = document.createElement('link');
            link.id = 'portaloverrides';
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = '/resources/' + mode + '/themes/css/Portal/overrides.css?_vc=' + cacheBust;
            head.appendChild(link);
            if (!me.isPortal()) {
                // setup an event listener so this app will know when the Portal theme has been changed...
                //
                Valence.util.Helper.addEventListener('themechanged', Valence.util.Helper.swapTheme);
            }
        }
        deferred.resolve(content);
        return deferred.promise;
    },
    processToken: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred');
        if (!Ext.isModern) {
            if (Ext.util.Cookies.get('vvtoken') === null) {
                var uuid = me.createUUID(),
                    secure = location.protocol === 'https:' ? true : false;
                // set secure to false if not running https (last parm)
                Ext.util.Cookies.set('vvtoken', uuid, null, '/', null, secure);
            }
        }
        deferred.resolve(content);
        return deferred.promise;
    },
    processUnload: function(content) {
        var me = content.scope,
            deferred = Ext.create('Ext.Deferred'),
            execute = (!Ext.isEmpty(me.getAutoLogout())) ? me.getAutoLogout() : Valence.login.config.Settings.getLogoutOnUnload();
        if (execute) {
            // call logout routine if user closes tab or browser before logging out...
            // also destroy all iframes to initiate any other cleanup...
            //
            window.onunload = function() {
                var app = Valence.login.config.Runtime.getApplication();
                if (app) {
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
                            url: me.getHostUrl() + '/valence/vvvport.pgm',
                            params: {
                                action: 'logout'
                            },
                            async: false
                        });
                    }
                }
            };
            window.onbeforeunload = function(evt) {
                if (!Valence.login.config.Runtime.getIsLoggingOut() && Valence.login.config.Runtime.getUser() && Valence.login.config.Runtime.getUrlParms().portal !== 'false') {
                    return Valence.lang.lit.valencePortal;
                }
            };
        }
        deferred.resolve(content);
        return deferred.promise;
    },
    processUrl: function() {
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            parms = Valence.login.config.Runtime.getUrlParms(),
            sid = (!Ext.isEmpty(parms.sid)) ? parms.sid : localStorage.getItem('sid');
        me.setCustomSid(!Ext.isEmpty(parms.customSid) ? parms.customSid : '');
        me.setForcePrompt(!Ext.isEmpty(parms.forcePrompt) ? parms.forcePrompt : false);
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
                scope: me,
                executeCallback: true,
                processLocale: true,
                processTheme: true,
                controlledError: true
            });
        }
        // if a customSid was passed...bypass the processSid check...
        //
        if (!Ext.isEmpty(me.getCustomSid())) {
            me.setBypassReuseSid(true);
        }
        deferred.resolve({
            scope: me,
            theme: parms.theme || null
        });
        return deferred.promise;
    },
    processView: function(content) {
        var me = content.scope,
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
                xtype: 'login',
                fullScreen: true,
                viewModel: {
                    data: {
                        connectionName: me.getConnectionName(),
                        hostUrl: me.getHostUrl(),
                        image: me.getImage(),
                        forgotPassword: me.getForgotPassword(),
                        language: me.getLanguage(),
                        namespace: me.getNamespace(),
                        password: me.getPassword(),
                        mode: me.getMode(),
                        mobilePortal: me.getNamespace() == 'Portal' && Ext.isModern && (Ext.os.name == 'iOS' || Ext.os.name == 'Android'),
                        username: me.getUsername(),
                        version: me.getVersion()
                    }
                },
                listeners: {
                    loggedin: function(cmp, o) {
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
                                me.setOptions(Ext.apply(me.getOptions(), {
                                    hostUrl: me.getHostUrl()
                                }));
                            }
                            Ext.Viewport.mask({
                                indicator: true,
                                xtype: 'loadmask',
                                message: Valence.lang.lit.loading
                            });
                        }
                        deferred.resolve(Ext.apply(content, o));
                    }
                }
            };
            if (!Ext.isModern) {
                cfg.renderTo = me.getRenderTo();
                cmp = Ext.widget('login', cfg);
            } else {
                cmp = Ext.Viewport.add(cfg);
                setTimeout(function() {
                    Ext.Viewport.unmask();
                    if (!Ext.isEmpty(navigator.splashscreen)) {
                        navigator.splashscreen.hide();
                    }
                }, 300);
            }
            setTimeout(function() {
                Ext.resumeLayouts(true);
            }, 500);
        }
        return deferred.promise;
    }
});

Ext.define('Valence.login.view.changeenvironment.ChangeEnvironment', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.grid.Panel',
        'Ext.layout.container.VBox',
        'Valence.common.ux.grid.Renderer'
    ],
    xtype: 'changeenvironment',
    basePortal: true,
    cls: 'vv-chgenv',
    closeAppsMsg: false,
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            title: Valence.lang.lit.changeEnvironment,
            maxHeight: 450,
            width: 550,
            modal: true,
            items: me.buildItems(),
            buttons: me.buildButtons()
        });
        me.callParent(arguments);
    },
    buildButtons: function() {
        var me = this;
        return [
            {
                text: Valence.lang.lit.cancel,
                scope: me,
                handler: me.onEsc
            }
        ];
    },
    buildItems: function() {
        var me = this,
            i = [];
        i.push({
            xtype: 'grid',
            flex: 1,
            cls: 'vv-chgenv-list',
            bubbleEvents: [
                'beforeitemclick',
                'itemclick'
            ],
            store: Ext.getStore('Login_Environments'),
            enableColumnHide: false,
            enableColumnMove: false,
            enableColumnResize: false,
            columns: [
                {
                    text: Valence.lang.lit.environment,
                    menuDisabled: true,
                    dataIndex: 'envName',
                    flex: 1
                },
                {
                    menuDisabled: true,
                    dataIndex: 'current',
                    width: 100,
                    align: 'center',
                    renderer: Valence.common.ux.grid.Renderer.tick
                }
            ]
        });
        if (me.closeAppsMsg) {
            i.push({
                xtype: 'component',
                cls: 'vv-chgenv-appclose-msg',
                html: Valence.lang.lit.allRunningAppsClose
            });
        }
        return i;
    }
});

Ext.define('Valence.login.view.lock.Lock', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.Img',
        'Ext.layout.container.VBox',
        'Valence.login.view.login.LoginModel',
        'Valence.login.view.login.LoginController'
    ],
    xtype: 'lock',
    viewModel: {
        type: 'login'
    },
    controller: 'login',
    cls: 'vv-lock-cnt',
    layout: {
        type: 'vbox',
        align: 'middle'
    },
    basePortal: true,
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            items: me.buildItems()
        });
        me.callParent(arguments);
    },
    buildItems: function() {
        return [
            {
                xtype: 'image',
                src: Valence.login.util.Helper.getHookValue('ui.lockLogoUrl') || '/resources/images/valence_logo.png',
                cls: 'vv-lock-img'
            },
            {
                xtype: 'form',
                reference: 'form',
                cls: 'vv-lock-form depth-1',
                bodyCls: 'vv-lock-form-body',
                defaults: {
                    width: '100%',
                    labelAlign: 'top',
                    labelSeparator: ''
                },
                items: [
                    {
                        xtype: 'textfield',
                        cls: 'vv-lock-pwd',
                        labelClsExtra: 'vv-lock-pwd-lbl',
                        name: 'password',
                        reference: 'password',
                        msgTarget: 'under',
                        fieldLabel: Valence.lang.lit.password,
                        allowBlank: false,
                        inputType: 'password',
                        ui: 'large',
                        triggers: {
                            lock: {
                                cls: 'login-trigger vvicon-lock vv-lock-user-password'
                            }
                        },
                        listeners: {
                            specialkey: 'onSpecialKeyPassword'
                        }
                    },
                    {
                        xtype: 'button',
                        formBind: true,
                        cls: 'vv-login-btn',
                        text: Valence.lang.lit.ok,
                        scale: 'medium',
                        handler: 'onUnlock'
                    }
                ]
            },
            {
                xtype: 'component',
                tpl: [
                    '<div class="vv-lock-text">{[fm.uppercase(values.text)]}</div>'
                ],
                bind: {
                    data: '{lockText}'
                }
            }
        ];
    }
});

