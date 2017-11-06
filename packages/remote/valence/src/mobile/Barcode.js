/**
 * Start and stop the barcode scanner
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Scan Barcode Example
 *
 * You can use the {@link Valence.mobile.Barcode#scan} method to start the barcode scanner:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Barcode.scan({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response.success) {
 *                 if (!response.data.cancelled) {
 *                     var info = '';
 *                     if (response.data.format) {
 *                         info += 'Format : ' + response.data.format + '<br>';
 *                     }
 *                     if (response.data.text) {
 *                         info += 'Text : ' + response.data.text;
 *                     }
 *                     Ext.Msg.alert('Barcode Scanned', info);
 *                 } else {
 *                     Ext.Msg.alert('Barcode Scan', 'Cancelled');
 *                 }
 *             }
 *         }
 *     });
 *
 *    {@img ValenceBarcode.png}
 *
 * ## Stop Barcode Scanner Example
 *
 * You can use the {@link Valence.mobile.Barcode#stop} method to stop the barcode scanner:
 *
 *     Valence.mobile.Barcode.stopScan();
 *
 * **Note:** By default the camera scanner will be used unless one of the Infinite Peripherals barcode
 * scanners is attached. [Infinite Peripherals](http://ipcprint.com)
 */
Ext.define('Valence.mobile.Barcode', {
    alternateClassName : ['Valence.device.Barcode'],
    singleton          : true,

    /**
     * Start the barcode scanner
     *
     * @param {Object} config
     * The config for scanning of a barcode.
     *
     * @param {Function} config.callback
     * The callback which is called when a barcode is scanned or canceled.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.success
     * Successfully started the scanner
     *
     * @param {Object} config.callback.response.data
     * Barcode information
     *
     * @param {Boolean} config.callback.response.data.cancelled
     * If the barcode scanner was canceled. <i>This is only valid for the camera barcode scanner.</i>
     *
     * @param {String} config.callback.response.data.format
     * The format of the scanned barcode. <i>This is only valid for the camera barcode scanner.</i>
     *
     * @param {String} config.callback.response.data.text
     * The value of the scanned barcode.
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    scan : function (config) {
        Ext.apply(config, {
            requestId  : 'barcode',
            responseId : 'scanBarcode',
            method     : 'scan'
        });
        Valence.mobile.Access.initiate(config);
    },

    /**
     * Stop Scanner - this is only valid for Infinite Peripheral hardware
     * @method
     */
    stopScan : function () {
        var config = {
            callbackMandatory : false,
            requestId         : 'barcode',
            responseId        : 'stopScanBarcode',
            method            : 'stop'
        };
        Valence.mobile.Access.initiate(config);
    }
});