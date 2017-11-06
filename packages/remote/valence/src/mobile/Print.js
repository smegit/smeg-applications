/**
 * Create full-quality printed output without the need to download or install drivers. Built in many printer models from most popular printer manufacturers. Just select an printer on your local network.
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Print Content Example
 *
 * You can use the {@link Valence.mobile.Print#content} method to send content to the printer:
 *
 *     Valence.mobile.Print.content({
 *         scope    : me,
 *         content  : '<b>Test Print</b><br><br>Valence Mobile Print',
 *         callback : function (response) {
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (!response.available) {
 *                 Ext.Msg.alert('Printer', 'Unavailable');
 *             }
 *         }
 *     });
 *
 *    {@img ValencePrintContent.jpg}
 *
 *
 * ## Is Available Example
 *
 * You can use the {@link Valence.mobile.Print#isAvailable} method to determine if printing is available on the device:
 *
 *     Valence.mobile.Print.isAvailable({
 *         scope    : me,
 *         callback : function (response) {
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response.available) {
 *                 Ext.Msg.alert('Printer', 'Available');
 *             } else {
 *                 Ext.Msg.alert('Printer', 'Unavailable');
 *             }
 *         }
 *     });
 *
 *    {@img ValencePrinterIsAvailable.png}
 */
Ext.define('Valence.mobile.Print', {
    alternateClassName : ['Valence.device.Print'],
    singleton          : true,

    /**
     * Print content to the printer. The method takes a string or a HTML DOM node. The string can contain HTML content. Optional parameters allows to specify the name of the document and a callback. The callback will be called if the user cancels.
     *
     * @param {Object} config
     * The config to send content to the printer.
     *
     * @param {Function} config.content
     * HTML string or DOM node
     *
     * @param {Function} config.callback
     * The callback which is called when printer is not available.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.available
     * false if the printer is not available
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    content : function (config) {
        Ext.apply(config, {
            requestId  : 'print',
            method     : 'sendContent',
            responseId : 'printSendContent'
        });
        Valence.mobile.Access.initiate(config);
    },

    /**
     * Find out if printing is available on the device
     *
     * @param {Object} config
     * The config to check if the printer is available.
     *
     * @param {Function} config.callback
     * The callback which is called when the information on printer availability.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.available
     * If the printer is available
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    isAvailable : function (config) {
        Ext.apply(config, {
            requestId  : 'print',
            method     : 'isAvailable',
            responseId : 'printAvailable'
        });
        Valence.mobile.Access.initiate(config);
    }
});