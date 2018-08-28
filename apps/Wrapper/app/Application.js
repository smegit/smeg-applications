Ext.define('Wrapper.Application', {
    extend : 'Ext.app.Application',

    name : 'Wrapper',

    requires : [
        'Valence.login.Processor',
        'Valence.common.util.Helper',
        'Wrapper.config.Runtime'
    ],

    stores : [
        'Apps'
    ],

    launch : function () {
        var me = this;

        Valence.login.Processor.init({
            namespace : 'Wrapper',
            callback  : function () {
                var appsStore       = Ext.getStore('Apps'),
                    showLaunchError = function (msg) {
                        Valence.common.util.Helper.destroyLoadMask();

                        Valence.common.util.Dialog.show({
                            title     : Valence.lang.lit.error,
                            msg       : msg,
                            noButtons : true,
                            minWidth  : 400
                        });
                    };

                Valence.common.util.Helper.loadMask(Valence.lang.lit.loading);

                //setup the window unload
                //
                me.setupUnload();

                //load the available apps
                //
                appsStore.load({
                    scope    : me,
                    callback : function (recs) {
                        var wrappedAppsInfo = [],
                            //wrapperAppId = Ext.getUrlParam('app'),
                            // update this value if you create a new app record otherwise uncomment the line before
                            // and the ?app=[appId] to the url
                            wrapperAppId    = '1004',
                            appId;

                        for (var ii = 0; ii < recs.length; ii++) {
                            appId = recs[ii].get('appId');
                            if (wrapperAppId != appId) {
                                wrappedAppsInfo.push({
                                    text    : recs[ii].get('name'),
                                    appId   : recs[ii].get('appId'),
                                    appRec  : recs[ii],
                                    event   : 'appselected',
                                    checked : (ii === 0) ? true : false
                                });
                            }
                        }

                        if (!Ext.isEmpty(wrappedAppsInfo)) {
                            Wrapper.config.Runtime.setApps(wrappedAppsInfo);

                            Valence.common.util.Helper.destroyLoadMask();

                            //launch the application
                            //
                            Ext.create('Wrapper.view.main.Main');
                        } else {
                            showLaunchError('Wrapped app(s) not found as valid applications.');
                        }
                    }
                });
            }
        });
    },

    onAppUpdate : function () {
        window.location.reload();
    },

    setupUnload : function () {
        var me       = this,
            onUnload = (!Ext.isEmpty(window.onunload)) ? window.onunload : Ext.emptyFn;

        window.onunload = Ext.bind(function () {
            var frames = Ext.ComponentQuery.query('uxiframe[app]');

            //find any uxiframes and notify them destroy
            //
            for (var ii = 0; ii < frames.length; ii++) {
                var frameWin = frames[ii].getWin();

                frames[ii].fireEvent('beforedestroy', frames[ii]);
                frames[ii].fireEvent('destroy', frames[ii]);
                if (!Ext.isEmpty(frameWin.beforeDestroy) && typeof frameWin.beforeDestroy === 'function'){
                    frameWin.beforeDestroy();
                }
            }
            onUnload();
        }, me);
    }
});
