/**
 * Access and modify the badge number of the Valence Portal app icon
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Set Badge Example
 *
 * You can use the {@link Valence.mobile.Badge#set} method to change the value of the badge:
 *
 *     Valence.mobile.Badge.set(4);
 *
 *    {@img ValenceBadge.png}
 *
 * ## Get Badge Example
 *
 * You can use the {@link Valence.mobile.Badge#get} method to get the value of the badge:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Badge.get({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             Ext.Msg.alert('Badge', response);
 *         }
 *     });
 *
 * ## Clear Badge Example
 *
 * You can use the {@link Valence.mobile.Badge#clear} method to clear the badge:
 *
 *     Valence.mobile.Badge.clear();
 *
 * **Note:** When requesting access to the badge the user must grant permission.
 */
Ext.define('Valence.mobile.Badge', {
    alternateClassName : ['Valence.device.Badge'],
    singleton          : true,

    /**
     * Clears the current value of the badge
     * @method
     */
    clear : function () {
        var config = {
            callbackMandatory : false,
            requestId         : 'badge',
            method            : 'clear'
        };
        Valence.mobile.Access.initiate(config);
    },

    /**
     * Get the current value of the badge
     *
     * @param {Object} config
     * The config to get the badge value.
     *
     * @param {Function} config.callback
     * The callback with the badge value.
     *
     * @param {Number} config.callback.response
     * Value of the badge.
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    get : function (config) {
        Ext.apply(config, {
            requestId  : 'badge',
            responseId : 'badge',
            method     : 'get'
        });
        Valence.mobile.Access.initiate(config);
    },

    /**
     * Set the value of the badge
     * @param {Number} value
     * @method
     */
    set : function (value) {
        var config = {};
        Ext.apply(config, {
            callbackMandatory : false,
            requestId         : 'badge',
            method            : 'set',
            value             : value
        });
        Valence.mobile.Access.initiate(config);
    }
});