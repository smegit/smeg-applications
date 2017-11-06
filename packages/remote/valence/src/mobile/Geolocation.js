/**
 * Provides information about the device's location, such as latitude and longitude. Common sources of location information include Global Positioning System (GPS) and location inferred from network signals such as IP address, RFID, WiFi and Bluetooth MAC addresses, and GSM/CDMA cell IDs. There is no guarantee that the API returns the device's actual location.
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Get Current Position Example
 *
 * You can use the {@link Valence.mobile.Geolocation#getCurrentPosition} method to get the current geolocation:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Geolocation.getCurrentPosition({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response.success) {
 *                 if (response.coords) {
 *                     var info = '';
 *                     if (response.coords.latitude) {
 *                         info += 'Latitude : ' + response.coords.latitude + '<br>';
 *                     }
 *                     if (response.coords.longitude) {
 *                         info += 'Longitude : ' + response.coords.longitude;
 *                     }
 *                     Ext.Msg.alert('Current Position Info', info);
 *                 }
 *             } else {
 *                 Ext.Msg.alert('Error', response.message);
 *             }
 *         }
 *     });
 *
 * **Note:** When requesting the devices geoLocation the user must grant permission.
 */
Ext.define('Valence.mobile.Geolocation', {
    alternateClassName : ['Valence.device.Geolocation'],
    singleton          : true,

    /**
     * Returns the device's current position to the callback with a Position information.
     *
     * @param {Object} config
     * The config for getting the geoLocation
     *
     * @param {Function} config.callback
     * The callback which is called when geoLocation is captured or if an error occurred.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.success
     * Successfully retrieved the location information.
     *
     * @param {Object} config.callback.response.coords
     * A set of geographic coordinates.
     *
     * @param {Number} config.callback.response.coords.latitude
     * Latitude in decimal degrees.
     *
     * @param {Number} config.callback.response.coords.longitude
     * Height of the position in meters above the ellipsoid.
     *
     * @param {Number} config.callback.response.coords.accuracy
     * Accuracy level of the latitude and longitude coordinates in meters.
     *
     * @param {Number} config.callback.response.coords.altitudeAccuracy
     * Accuracy level of the altitude coordinate in meters.
     *
     * @param {Number} config.callback.response.coords.heading
     * Direction of travel, specified in degrees counting clockwise relative to the true north.
     *
     * @param {Number} config.callback.response.coords.speed
     * Current ground speed of the device, specified in meters per second.
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    getCurrentPosition : function (config) {
        Ext.apply(config, {
            requestId  : 'geolocation',
            responseId : 'geolocationPosition',
            method     : 'getCurrentPosition'
        });
        Valence.mobile.Access.initiate(config);
    }
});