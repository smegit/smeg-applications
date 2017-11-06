Ext.define('Wrapper.view.main.MainController', {
    extend : 'Ext.app.ViewController',

    requires : [
        'Wrapper.view.app.App'
    ],

    alias : 'controller.main',

    initViewModel : function (vm) {
        var me           = this,
            vm           = me.getViewModel(),
            apps         = Wrapper.config.Runtime.getApps(),
            activeAppRec = apps[0].appRec;

        if (apps.length > 1) {
            vm.set({
                appBarTitleMenu     : {
                    items : apps
                },
                appBarTitleMenuHide : false,
                appBarTitle         : 'Smeg'
            });
        } else {
            vm.set({
                appBarTitle : 'Smeg - ' + apps[0].text
            });
        }

        me.showApp(activeAppRec);
    },

    onAppSelected : function (appBar, menuItem) {
        var me         = this,
            vm         = me.getViewModel(),
            view       = me.getView(),
            appRec     = menuItem.appRec,
            appId      = menuItem.appId,
            runningApp = Ext.ComponentQuery.query('app-wrapped-app[appId=' + appId + ']')[0];

        if (Ext.isEmpty(runningApp)) {
            me.showApp(appRec);
        } else {
            view.getLayout().setActiveItem(runningApp);
        }
    },

    onClickChangePassword : function () {
        Wrapper.getApplication().fireEvent('changepassword');
    },

    onClickLock : function () {
        Wrapper.getApplication().fireEvent('lock');
    },
	
	 onClickLogout : function () {
        Wrapper.getApplication().fireEvent('logout');
    },

    showApp : function (rec) {
        var me             = this,
            view           = me.getView(),
            loginProcessor = Valence.login.Processor,
            key            = Ext.util.Format.date(new Date(), 'time') + Math.floor((Math.random() * 10000) + 1),
            oper           = '?',
            path           = rec.get('path'),
            type           = rec.get('type'),
            pathHasParams  = (path.indexOf('?') > -1),
            params         = rec.get('params'),
            connUrl        = loginProcessor.getHostUrl(),
            sid            = Valence.login.config.Runtime.getLoginData().sid || localStorage.getItem('sid'),
            env            = Valence.login.config.Runtime.getLoginData().env || sessionStorage.getItem('env'),
            theme          = loginProcessor.getTheme(),
            url;

        if (pathHasParams) {
            oper = '&';
        }

        if (!Ext.isEmpty(params)) {
            if (type !== '*URL' && type !== '*XCT') {
                var firstChar = params.substring(0, 1);
                if (firstChar === '?') {
                    params = '&' + params.substring(1, params.length);
                }
                if (firstChar !== '&') {
                    params = '&' + params;
                }
            } else {
                var firstChar = params.substring(0, 1);
                if (firstChar === '?' || firstChar !== '&') {
                    params = params.substring(1, params.length)
                }
            }
        }

        if (type === '*URL' || type === '*XCT') {
            url = path + params;
        } else if (type === '*DOC') {
            url = connUrl + '/valence/vvcall.pgm?pgm=*DOC&app=' + rec.get('appId') + '&sid=' + sid + params;
        } else {
            url = connUrl + path + oper + 'app=' + rec.get('appId') + '&lang=' + loginProcessor.getLanguage() + '&sid=' + sid + '&env=' + env + '&key=' + key + '&theme=' + theme + params;
            if (!Ext.isClassic) {
                url += '&native=true&deviceType=' + Wrapper.getApplication().getCurrentProfile().getName();
            }
        }

        var newApp = view.add({
            xtype     : 'app-wrapped-app',
            appId     : rec.get('appId'),
            viewModel : {
                data : {
                    iframeData : {
                        src : url
                    }
                }
            }
        });

        view.getLayout().setActiveItem(newApp);
    }
});
