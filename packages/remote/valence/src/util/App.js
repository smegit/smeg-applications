/**
 * @class Valence.util.App
 * Various methods to work with apps in the Portal.
 */
Ext.define('Valence.util.App', {
    singleton : true,
    /**
     * @method close
     * Close a running application
     *
     * @param {Number} appId
     *
     * ##Example -
     *
     * The following code snippet will close application id 1234
     *
     *     Valence.util.App.close(1234);
     *
     */
    close     : function (appId) {
        var me = this;

        if (!Valence.mobile.Access.isNativePortal()) {
            var appRecord = me.getRunningApp(appId);

            if (!Ext.isEmpty(appRecord)) {
                var portal = me.getDesktopPortal();
                if (!Ext.isEmpty(portal)) {
                    portal.util.Helper.closeApp(appRecord);
                }
            } else {
                return false;
            }
        } else {
            //running in native mobile portal
            //
            var config = {
                callbackMandatory : false,
                nativeMandatory   : false,
                requestId         : 'app',
                method            : 'close'
            };
            if (typeof appId === "object") {
                Ext.apply(config, appId);
            } else {
                Ext.apply(config, {
                    app : appId
                });
            }
            Valence.mobile.Access.initiate(config);
        }
    },

    getDesktopPortal : function () {
        var me     = this,
            portal = parent.Portal;

        return portal;
    },

    getAvailableApp : function (appId) {
        var me     = this,
            portal = me.getDesktopPortal();

        if (!Ext.isEmpty(portal) && !Ext.isEmpty(appId) && typeof portal.getApplication === 'function') {
            var store = portal.getApplication().getStore('Apps');
            if (!Ext.isEmpty(store)) {
                return store.findRecord('appId', appId, 0, false, true, true);
            }
        }
        return null;
    },

    getRunningApp : function (id) {
        var me     = this,
            portal = me.getDesktopPortal();

        if (!Ext.isEmpty(portal) && !Ext.isEmpty(id) && typeof portal.getApplication === 'function') {
            var store = portal.getApplication().getStore('RunningApps');
            if (!Ext.isEmpty(store)) {
                //first check via key
                //
                var record = store.findRecord('key', id, 0, false, true, true);
                if (Ext.isEmpty(record)) {
                    //check via appId
                    //
                    record = store.findRecord('appId', id, 0, false, true, true);
                }
                return record;
            }
        }
        return null;
    },

    /**
     * @method isLaunched
     * Check if an application is currently running in the portal
     *
     * @param {Number} appId
     *
     * ##Example -
     *
     * The following code snippet will close application id 1234
     *
     *     Valence.util.App.isLaunched(1234);
     *
     */
    isLaunched : function (appId) {
        return this.isRunning(appId);
    },

    /**
     * @method isRunning
     *
     * ## Check if an application is currently running in the desktop portal:
     *
     *     Valence.util.App.isRunning(1234);
     *
     * ## Check if an application is currently running in the mobile portal:
     *
     *   You need to pass an object that contains a callback method.
     *
     *     Valence.util.App.isRunning({
     *         app      : 1234,
     *         callback : function(response){
     *             if (response){
     *                 Ext.Msg.alert('Is running');
     *             } else {
     *                 Ext.Msg.alert('Is not running');
     *             }
     *         }
     *     });
     */
    isRunning : function (appId) {
        var me = this;

        if (!Valence.mobile.Access.isNativePortal()) {
            var appRecord = me.getRunningApp(appId);
            if (!Ext.isEmpty(appRecord)) {
                return true;
            }
            return false;
        } else {
            //running in native mobile portal
            //
            var config = {
                nativeMandatory : false,
                responseId      : 'isLaunched',
                requestId       : 'app',
                method          : 'isLaunched'
            };
            Ext.apply(config, appId);
            Valence.mobile.Access.initiate(config);
        }
    },

    /**
     * @method launch
     * Launch an application is in the portal
     *
     * @param {Object} obj Object containing the following config:
     *
     * - `app`  The app Id
     * - `params`  The parameters to be passed in url format to the called app.
     * - `forceNew`  boolean (optional) Force the creation of a new app instance, regardless if the app is already open.
     * - `closable`  boolean (optional) If false the user wont be able to close this app in the portal.
     *
     */
    launch : function (obj) {
        var me              = this,
            appId           = obj.app || null,
            forceNew        = obj.forceNew || false,
            additionalParms = obj.params || null,
            closable        = (!Ext.isEmpty(obj.closable) && Ext.isBoolean(obj.closable)) ? obj.closable : null;

        if (!Ext.isEmpty(appId)) {
            if (!Valence.mobile.Access.isNativePortal()) {
                var appRecord = me.getAvailableApp(appId);

                if (!Ext.isEmpty(appRecord)) {
                    var portal = me.getDesktopPortal();
                    if (!Ext.isEmpty(portal)) {
                        portal.util.Helper.launchApp(appRecord, additionalParms, forceNew, closable);
                        return;
                    }
                }
            } else {
                var config = obj;
                Ext.apply(config, {
                    callbackMandatory : false,
                    nativeMandatory   : false,
                    requestId         : 'app',
                    method            : 'launch'
                });
                Valence.mobile.Access.initiate(config);
                return;
            }
        }
        return false;
    },

    /**
     * @method print
     * Print the application - this will generate a cleaner print than the default browser print
     */
    print : function () {
        var me           = this,
            destroyFrame = function () {
                var printFrame = Ext.ComponentQuery.query('uxiframe#vv-print-frame')[0];

                if (!Ext.isEmpty(printFrame)) {
                    printFrame.destroy();
                    printFrame = null;
                }
            },
            loadFrame    = function (screenShot) {
                if (!Ext.isEmpty(Ext.ux.IFrame)){
                    Ext.create('Ext.ux.IFrame', {
                        itemId    : 'vv-print-frame',
                        height    : '100%',
                        width     : '100%',
                        renderTo  : Ext.getBody(),
                        style     : {
                            display    : 'none',
                            visibility : 'hidden'
                        },
                        src       : '/resources/printScreen.html',
                        listeners : {
                            single : true,
                            load   : function (cmp) {
                                var frameWindow = cmp.getWin(),
                                    imageTag    = frameWindow.document.getElementById('screenshot');

                                //load the screenshot
                                //
                                imageTag.setAttribute('src', screenShot);
                                frameWindow.print();

                                setTimeout(function () {
                                    destroyFrame();
                                }, 5000);
                            }
                        }
                    });
                } else {
                    Ext.global.console.error('Valence.util.App.print requires Ext.ux.IFrame');
                }
            };

        if (!Ext.isEmpty(html2canvas)) {
            html2canvas(document.body, {
                onrendered : function (canvas) {
                    if (!Valence.mobile.Access.isNativePortal()) {
                        loadFrame(canvas.toDataURL());
                    } else {
                        Valence.mobile.Print.content({
                            scope    : me,
                            content  : '<!DOCTYPE html><html><body><img src="' + canvas.toDataURL() + '" alt="Screenshot" width="100%" height="100%"></body></html>',
                            callback : function (response) {
                                if (Ext.isEmpty(response)) {
                                    return;
                                }
                                if (!response.available) {
                                    Valence.common.util.Dialog.show({
                                        msg     : Valence.lang.lit.printerUnavailable,
                                        buttons : ['->', {
                                            text : Valence.lang.lit.ok
                                        }]
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    },

    /**
     * @method setActive
     * Set a specific application to be the active application
     *
     * @param {Object} obj Object containing the following config:
     *
     * - `app`  The app Id or key
     *
     */
    setActive : function (obj) {
        var me    = this,
            appId = obj.app || obj.appId || obj;

        if (!Valence.mobile.Access.isNativePortal()) {
            var appRecord = me.getRunningApp(appId);

            if (!Ext.isEmpty(appRecord)) {
                var portal = me.getDesktopPortal();
                if (!Ext.isEmpty(portal)) {
                    portal.util.Helper.activateApp(appRecord);
                    return;
                }
            }
        } else {
            var config = {
                requestId         : 'app',
                method            : 'show',
                nativeMandatory   : false,
                callbackMandatory : false
            };
            if (typeof app === "object") {
                Ext.apply(config, obj);
            } else {
                Ext.apply(config, {
                    app : obj
                });
            }
            Valence.mobile.Access.initiate(config);
        }
    },

    /**
     * if set, prompts the user before closing an app in the Portal.
     * @param {string} key if not provided will pull the key from the url params
     * @param {Object} obj The object must contain the properties of:
     *
     * - `title`  The title of the Prompt the user receives when attempting to close the app.
     * - `msg`  The message text
     *
     * * @param {Boolean} active Defaults to true however if set to false will trun off prompt before close.
     *
     * ## Example
     *      var key = Ext.getUrlParam('key');
     *
     *      Valence.app.setPromptBeforeClose(key,{
     *          title : 'Are you sure?',
     *          msg : 'All unsaved changes will be lost'
     *      });
     *
     *
     *  When the user attempts to close the application, they will see a message similar to this:
     *
     * {@img app_setPromptBeforeClose.png before close Prompt}
     */
    setPromptBeforeClose : function (key, obj, active) {
        var me = this;

        if (!Valence.mobile.Access.isNativePortal()) {
            if (Ext.isEmpty(active)) {
                active = true;
            }

            //if key is not passed in pull it from the url
            //
            if (!Ext.isString(key)) {
                key = Ext.getUrlParam('key');
            }

            if (!Ext.isEmpty(key)) {
                //get the app record
                //
                var appRecord = me.getRunningApp(key);
                if (!Ext.isEmpty(appRecord)) {
                    var portal = me.getDesktopPortal();
                    if (!Ext.isEmpty(portal)) {
                        //notify the portal to set prompt before close
                        //
                        portal.util.Helper.setPromptBeforeClose(appRecord, active, obj);
                        return;
                    }
                }
            }
        }
        return false;
    }
});