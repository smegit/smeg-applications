Ext.define('Valence.login.AppUmbrella', {
    extend   : 'Ext.app.Controller',
    requires : [
        'Valence.common.util.Snackbar'
    ],

    init : function (options) {
        var me = this;

        Ext.apply(me, options);

        if (me.manageIframes) {
            me.control({
                'uxiframe' : {
                    load          : me.onIframeLoad,
                    beforedestroy : me.onIframeBeforeDestroy
                }
            });
        }

        me.listen({
            controller : {
                '*' : {
                    changeconnection : me.onChangeConnection,
                    changeenvironment : me.onChangeEnvironment,
                    changepassword    : me.onChangePassword,
                    lock              : me.onLock,
                    logout            : me.onLogout,
                    pending569logout  : me.onPending569Logout,
                    resumelock        : me.onResumeLock,
                    resumepolling     : me.onResumePolling,
                    suspendlock       : me.onSuspendLock,
                    suspendpolling    : me.onSuspendPolling
                }
            },
            component  : {
                'component[basePortal]' : {
                    render : me.onRenderBasePortalComponent
                }
            }
        });
        me.settings = Valence.login.config.Settings;
        me.runtime  = Valence.login.config.Runtime;
    },

    initTasks : function () {
        var me = this;

        // polling...
        //
        if (me.poll) {
            me.pollRunner = Ext.TaskManager.start({
                scope    : me,
                run      : me.pollServer,
                interval : me.settings.getPollInterval()
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

    onAttemptUnlockSuccess : function (r) {
        var me   = this,
            lock = Ext.ComponentQuery.query('lock')[0],
            d    = Ext.decode(r.responseText);

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

    onChangeConnection : function(url){
        var me = this;
        me.hostUrl = url;
    },

    onChangeEnvironment : function () {
        var me  = this,
            app = Valence.login.config.Runtime.getApplication();
        if (Valence.login.config.Runtime.getIsDesktop()) {
            Ext.widget('changeenvironment', {
                closeAppsMsg : me.settings.getCloseAppsOnEnvironmentChange(),
                listeners    : {
                    scope     : me,
                    destroy   : me.onDestroyChangeEnvironment,
                    itemclick : me.onItemclickEnvironment
                }
            }).show();
            if (app) {
                app.fireEvent('showchangeenvironment');
            }
        }
    },

    onChangePassword : function (target) {
        var me  = this,
            app = Valence.login.config.Runtime.getApplication();
        if (app && app.fireEvent('beforeshowchangepassword') !== false) {
            Ext.widget('changepassword', {
                animateTarget : target || null,
                viewModel     : {
                    data : {
                        user : me.runtime.getUser()
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

    onDestroyChangeEnvironment : function () {
        var me  = this,
            app = Valence.login.config.Runtime.getApplication();

        if (app) {
            app.fireEvent('hidechangeenvironment');
        }
    },

    onIframeBeforeDestroy : function (frame) {
        // if the frame has a "session" value then it was a 5250 web session...do some cleanup...
        //
        var doc     = frame.getDoc(),
            session = (doc) ? doc.getElementsByName('session')[0] : null;

        if (!Ext.isEmpty(session)) {
            Ext.Ajax.request({
                url : '/webaccess/iWAActiveSessions?action=stop&session=' + session.getAttribute('value')
            });
        }
    },

    onIframeLoad : function (frame) {
        var me = this,
            d  = frame.getDoc();

        if (d) {
            if (Ext.isIE8) {
                d.attachEvent('click', Ext.bind(me.resetTimers, me));
            } else {
                d.addEventListener('click', Ext.bind(me.resetTimers, me));
            }
        }
    },

    onItemclickEnvironment : function (view, rec) {
        var me          = this,
            closeApps   = me.settings.getCloseAppsOnEnvironmentChange(),
            current     = rec.get('current'),
            str         = view.getStore(),
            app         = Valence.login.config.Runtime.getApplication(),
            snackbarCfg = {
                text : Valence.lang.lit.yourEnvChanged
            }, appIds;

        if (!current && app && app.fireEvent('beforeenvironmentset', me.runtime.getUser(), rec.get('envId')) !== false) {
            Ext.ComponentQuery.query('changeenvironment')[0].el.mask(Valence.lang.lit.settingEnvironment);
            Ext.Ajax.request({
                omitPortalCredentials : true,
                url                   : '/valence/vvlogin.pgm',
                params                : {
                    action : 'setEnvironment',
                    sid    : Valence.util.Helper.getSid(),
                    env    : rec.get('envId')
                },
                scope                 : me,
                success               : function (r) {
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
                            env : rec.get('envId')
                        }));
                        if (app) {
                            app.fireEvent('logindataupdated', me.runtime.getLoginData())
                        }

                        if (closeApps) {
                            appIds = Portal.util.Helper.getActiveAppIds();
                            if (appIds.length > 0) {
                                Ext.apply(snackbarCfg, {
                                    buttonText : Valence.lang.lit.relaunchApps,
                                    duration   : 8000,
                                    handler    : function () {
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

    onLock : function () {
        var me  = this,
            app = Valence.login.config.Runtime.getApplication();

        me.onSuspendLock();

        if (!me.runtime.getIsLocked()) {

            if (app) {
                if (app.fireEvent('beforelock') === false) {
                    return;
                }
            }
            Ext.Ajax.request({
                url     : me.hostUrl + '/valence/vvlogin.pgm',
                params  : {
                    action : 'lock'
                },
                scope   : me,
                success : me.onLockSuccess
            });
        }
    },

    onLockSuccess : function (r) {
        var me  = this,
            d   = Ext.decode(r.responseText),
            app = Valence.login.config.Runtime.getApplication();

        if (d.success) {
            me.runtime.setIsLocked(true);
            if (app) {
                app.fireEvent('locked');
            }
            Valence.login.Processor.processLock();
        }
    },

    onLogout : function (anim) {
        var me             = this,
            frames         = Ext.ComponentQuery.query('uxiframe[app]'),
            user           = me.runtime.getUser(),
            parms          = {
                action : 'logout'
            },
            anim = (Ext.isBoolean(anim) && anim === false) ? false : true,
            app            = Valence.login.config.Runtime.getApplication(),
            completeLogout = Ext.bind(function () {
                var processLogout = Ext.bind(me.processLogout, me),
                    anim;

                if (localStorage.getItem('sid') === me.runtime.getLoginData().sid) {
                    localStorage.removeItem('sid');
                }
                if (Valence.login.config.Runtime.getIsDesktop()) {
                    sessionStorage.removeItem('env');
                }
                if (app) {
                    app.fireEvent('loggedout', user);
                }

                if (anim){
                    Ext.Function.defer(function () {
                        anim = {
                            duration : 100,
                            easing   : 'easeOut',
                            opacity  : 0.15,
                            callback : function () {
                                processLogout();
                            }
                        };
                        if (Ext.isClassic) {
                            Ext.get(document.body).fadeOut(anim);
                        } else {
                            Ext.get(document.body).animate(anim);
                        }

                    }, 150);
                } else {
                    processLogout();
                }
            }, me), request;

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
                    apps       = [];
                runningStr.each(function (r) {
                    apps.push(r.get('appId'));
                });
                sessionStorage.setItem('valence-last-running-apps', apps);
            }

            // kill all iframes...
            //
            for (var ii = 0; ii < frames.length; ii++) {
                frames[ii].fireEvent('beforedestroy', frames[ii]);
                frames[ii].fireEvent('destroy', frames[ii]);
            }

            // kill all windows...
            //
            var openWindows = me.runtime.getActiveWindows();
            if (openWindows) {
                for (ii = 0; ii < openWindows.length; ii++) {
                    try {
                        openWindows[ii].close();
                    } catch (err) {
                        //do nothing
                    }
                }
            }

            if (Ext.isModern) {
                Ext.Viewport.mask({
                    indicator : true,
                    xtype     : 'loadmask',
                    message   : Valence.lang.lit.loading,
                    zIndex    : 1000
                });
            }
        }

        me.runtime.setActiveWindows([]);

        //stop the polling
        //
        me.onSuspendPolling();

        try {
            Ext.Ajax.request({
                url     : me.hostUrl + '/valence/vvvport.pgm',
                params  : parms,
                scope   : me,
                async   : false
            });
            completeLogout();
        } catch (e) {
            completeLogout();
        }
    },

    onPending569Logout : function(){
        Valence.login.config.Runtime.setIsPending569Logout(true);
    },

    onRenderBasePortalComponent : function (cmp) {
        var me  = this,
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

    pollServer : function () {
        var me         = this,
            timerReset = me.runtime.getLogoutTaskReset(),
            app        = Valence.login.config.Runtime.getApplication(),
            p          = {
                action     : 'poll',
                timerReset : timerReset
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
            url     : me.hostUrl + '/valence/vvvport.pgm',
            params  : p,
            scope   : me,
            success : me.pollServerSuccess,
            failure : function (conn) {
                // status "569" is reserved for Valence...
                //   this condition will be handled by another process (see Ajax.js in Valence package)
                //
                if (conn.status !== 569) {
                    me.runtime.setIsConnected(false);
                }
            }
        });
    },

    pollServerSuccess : function (r) {
        var me  = this,
            d   = Ext.decode(r.responseText),
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
                }
                if (!me.runtime.getIsLoggingOut()) {
                    Valence.common.util.Dialog.show({
                        title   : Valence.lang.msg.sessionEndHeader,
                        msg     : Valence.lang.msg.sessionEndBody,
                        buttons : ['->', {
                            text : Valence.lang.lit.ok
                        }],
                        scope   : me,
                        handler : me.onLogout
                    });
                }
                break;
            case 'RELOAD':
                var catStr = Ext.getStore('Categories');
                if (catStr){
                    catStr.load({
                        callback : function(){
                            var appStr = Ext.getStore('Apps');
                            if (appStr){
                                appStr.load();
                            }
                        }
                    });
                }
                break;
        }
    },

    processLogout : function () {
        var newUrl       = window.location.href,
            removeParam  = function removeQueryStringParameter(key, url) {
                if (!url) url = window.location.href;

                var hashParts = url.split('#'),
                    regex     = new RegExp("([?&])" + key + "=.*?(&|#|$)", "i");

                if (hashParts[0].match(regex)) {
                    //REMOVE KEY AND VALUE
                    url = hashParts[0].replace(regex, '$1');

                    //REMOVE TRAILING ? OR &
                    url = url.replace(/([?&])$/, '');

                    //ADD HASH
                    if (typeof hashParts[1] !== 'undefined' && hashParts[1] !== null)
                        url += '#' + hashParts[1];
                }

                return url;
            },
            removeParams = ['password', 'customSid'];

        for (var ii=0; ii<removeParams.length; ii++){
            newUrl = removeParam(removeParams[ii], newUrl);
        }

        location.href = newUrl;

        Ext.util.History.add('login');

        window.location.reload();
    },

    resetTimers : function () {
        var me = this;

        if (!Ext.isEmpty(me.lockTask)) {
            me.lockTask.delay(me.settings.getLockTimeout());
        }
        if (me.logoutTask) {
            me.runtime.setLogoutTaskReset(true);
            me.logoutTask.delay(me.settings.getSessionTimeout());
        }
    },

    onResumeLock : function () {
        var me = this;
        if (!Ext.isEmpty(me.lockTask)) {
            me.lockTask.delay(me.settings.getLockTimeout());
        }
    },

    onResumePolling : function () {
        var me = this;
        if (me.pollRunner) {
            Ext.TaskManager.start(me.pollRunner);
        }
    },

    sessionTimeout : function () {
        var me = this;
        me.onLogout();
    },

    onSuspendLock : function () {
        var me = this;
        if (!Ext.isEmpty(me.lockTask)) {
            me.lockTask.cancel();
        }
    },

    onSuspendPolling : function () {
        var me = this;
        if (me.pollRunner) {
            Ext.TaskManager.stop(me.pollRunner);
        }
    }


});