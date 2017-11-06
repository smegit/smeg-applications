/**
 * Device Information
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Get Connection Type Example
 *
 * You can use the {@link Valence.mobile.Information#connectionType} method:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Information.connectionType({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response) {
 *                 Ext.Msg.alert('Current Connection', response);
 *             }
 *         }
 *     });
 *
 *    {@img ValenceConnectionType.png}
 *
 * ## Get Device Information Example
 *
 * You can use the {@link Valence.mobile.Information#get} method:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Information.get({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response) {
 *                 var info = '';
 *                 if (response.model) {
 *                     info += 'Model : ' + response.model + '<br>';
 *                 }
 *                 if (response.platform) {
 *                     info += 'Platform : ' + response.platform;
 *                 }
 *                 Ext.Msg.alert('Device Info', info);
 *             }
 *         }
 *     });
 *
 *    {@img ValenceDeviceInformation.png}
 */
Ext.define('Valence.mobile.Information', {
    alternateClassName : ['Valence.device.Information'],
    singleton          : true,

    /**
     * Returns the connection type
     *
     * @param {Object} config
     * The config for getting the connection type
     *
     * @param {Function} config.callback
     * The callback which is called with the connection type.
     *
     * @param {Object} config.callback.response
     * The value of the connection type
     *
     * - unknown
     * - ethernet
     * - wifi
     * - 2g
     * - 3g
     * - 4g
     * - cellular
     * - none
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    connectionType : function (config) {
        Ext.apply(config, {
            requestId  : 'getConnectionType',
            responseId : 'connectionType'
        });
        Valence.mobile.Access.initiate(config);
    },

    /**
     * Returns the device information
     *
     * @param {Object} config
     * The config for getting the device information
     *
     * @param {Function} config.callback
     * The callback which is called with the device information.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.model
     * The name of the device's model or product. The value is set by the device manufacturer and may be different across versions of the same product.
     *
     * @param {Boolean} config.callback.response.platform
     * The device's operating system name.
     *
     * @param {Boolean} config.callback.response.uuid
     * The device's Universally Unique Identifier (UUID).
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    get : function (config) {
        Ext.apply(config, {
            requestId  : 'getDeviceInformation',
            responseId : 'deviceInformation'
        });
        Valence.mobile.Access.initiate(config);
    }
});