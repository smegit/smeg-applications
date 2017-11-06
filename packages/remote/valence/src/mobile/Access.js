/**
 * @class Valence.mobile.Access
 * Determine if running in the native mobile portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 */
Ext.define('Valence.mobile.Access', {
    alternateClassName : ['Valence.device.Access'],
    singleton          : true,

    /**
     * @method isNativePortal
     * Returns true if running in the native mobile iOS/Android portal
     * @return {boolean}
     *
     * ##Example
     *      Valence.mobile.Access.isNativePortal();
     *
     */
    isNativePortal : function () {
        return (typeof wizViewMessenger !== 'undefined' && !Ext.isEmpty(wizViewMessenger));
    },

    initiate : function (config) {
        var me                = this,
            config            = (!Ext.isEmpty(config)) ? config : {},
            scope             = config.scope || window,
            callback          = config.callback || null,
            callbackMandatory = !Ext.isEmpty(config.callbackMandatory) ? config.callbackMandatory : true,
            responseId        = config.responseId || null,
            requestId         = config.requestId || null,
            method            = config.method || null,
            obj               = {
                requestId  : requestId,
                responseId : responseId,
                method     : method
            },
            listenerObj       = {
                scope  : scope,
                single : true
            },
            rspFnc            = function (d) {
                if (callback) {
                    if (typeof callback === 'function') {
                        Ext.callback(callback, scope, [d]);
                    } else {
                        Ext.callback(eval(callback), scope, [d]);
                    }
                }
            };

        // if a callback is mandatory, ensure one has been passed...
        //
        if (callbackMandatory && !callback) {
            Ext.Msg.alert('Error', 'This functionality requires that you provide a callback.');
            return;
        }

        // setup the callback if applicable...
        //
        if (!Ext.isEmpty(callback)) {
            listenerObj[responseId] = rspFnc;
            var viewport            = window.Ext.ComponentQuery.query('viewport')[0]
            if (viewport) {
                viewport.on(listenerObj);
            }
        }

        // apply the config object...but first remove the scope and callback properties if they exist...
        //
        if (config.scope) {
            delete config.scope;
        }
        if (config.callback) {
            delete config.callback;
        }
        Ext.apply(obj, config);
        wizViewMessenger.postMessage(obj, 'mainView');
    }
});