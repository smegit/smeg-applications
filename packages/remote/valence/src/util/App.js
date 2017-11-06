/**
 * @class Valence.util.App
 * Valence JavaScript methods for use in the Valence portal. For Valence 3.2 and above,
 * these methods replace the methods in class Valence.tab
 *
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

        if (!Valence.device.Access.isNativePortal()) {
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
            Valence.device.Access.initiate(config);
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
                if (Ext.isEmpty(record)){
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
     * Check if an application is currently running in the portal
     *
     * @param {Number} appId
     *
     * ##Example -
     *
     * The following code snippet will close application id 1234
     *
     *     Valence.util.App.isRunning(1234);
     *
     */
    isRunning : function (appId) {
        var me = this;

        if (!Valence.device.Access.isNativePortal()) {
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
            Valence.device.Access.initiate(config);
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
     *
     */
    launch : function (obj) {
        var me              = this,
            appId           = obj.app || null,
            forceNew        = obj.forceNew || false,
            additionalParms = obj.params || null;

        if (!Ext.isEmpty(appId)) {
            if (!Valence.device.Access.isNativePortal()) {
                var appRecord = me.getAvailableApp(appId);

                if (!Ext.isEmpty(appRecord)) {
                    var portal = me.getDesktopPortal();
                    if (!Ext.isEmpty(portal)) {
                        portal.util.Helper.launchApp(appRecord, additionalParms, forceNew);
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
                Valence.device.Access.initiate(config);
                return;
            }
        }
        return false;
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
    setActive : function(obj) {
        var me    = this,
            appId = obj.app || obj.appId || obj;

        if (!Valence.device.Access.isNativePortal()) {
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
            Valence.device.Access.initiate(config);
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
    setPromptBeforeClose : function(key, obj, active){
        var me = this;

        if (!Valence.device.Access.isNativePortal()) {
            if (Ext.isEmpty(active)){
                active = true;
            }

            //if key is not passed in pull it from the url
            //
            if (!Ext.isString(key)){
                key = Ext.getUrlParam('key');
            }

            if (!Ext.isEmpty(key)){
                //get the app record
                //
                var appRecord = me.getRunningApp(key);
                if (!Ext.isEmpty(appRecord)){
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