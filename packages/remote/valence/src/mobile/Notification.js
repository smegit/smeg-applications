/**
 * Notifications
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Beep Example
 *
 * You can use the {@link Valence.mobile.Notification#beep} method:
 *
 *     Valence.mobile.Notification.beep();
 */
Ext.define('Valence.mobile.Notification', {
    alternateClassName : ['Valence.device.Notification'],
    singleton          : true,

    /**
     * The device plays a beep sound.
     * @param {Number} [times] DEFAULTS to 1 beep
     * @method
     */
    beep : function (times) {
        var config = {
            callbackMandatory : false,
            requestId         : 'beep'
        };

        if (!Ext.isEmpty(times)) {
            Ext.apply(config, {
                times : times
            });
        }
        Valence.mobile.Access.initiate(config);
    }
});