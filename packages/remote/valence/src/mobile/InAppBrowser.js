/**
 * Display a window that behaves like a standard web browser.
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Show Example
 *
 * You can use the {@link Valence.mobile.InAppBrowser#show} method:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.InAppBrowser.show({
 *         url      : 'http://www.cnxcorp.com',
 *         options  : {
 *             closebuttoncaption : 'Close CNX Corp'
 *         }
 *         scope    : me,
 *         callback : function () {
 *             Ext.Viewport.unmask();
 *         }
 *     });
 *
 *    {@img ValenceInAppBrowser.jpeg}
 */
Ext.define('Valence.mobile.InAppBrowser', {
    alternateClassName : ['Valence.device.InAppBrowser'],
    singleton : true,

    /**
     * Show a window that behaves like a browser with a valid url.
     *
     * @param {Object} config
     * The config for requesting the inAppBrowser
     *
     * @param {String} config.url
     * The URL to load
     *
     * @param {Object} [config.options]
     * Optional parameters to customize the inAppBrowser.
     *
     * @param {String} [config.options.location]
     * Set to yes or no to turn the InAppBrowser's location bar on or off.  DEFAULTS to `no`
     *
     * @param {String} [config.options.closebuttoncaption]
     * Set the close button text.  DEFAULTS to `Close` which is based of the current language selected by the user.
     *
     * @param {String} [config.options.enableosshare]
     * Enable/Disable the share button. To disable pass 'no'. DEFAULTS to `yes`
     *
     * @param {String} [config.options.disallowoverscroll]
     * Set to yes or no. DEFAULTS to `no` Turns on/off the UIWebViewBounce property.
     *
     * @param {String} [config.options.clearcache]
     * Set to yes to have the browser's cookie cache cleared before the new window is opened
     *
     * @param {String} [config.options.clearsessioncache]
     * Set to yes to have the session cookie cache cleared before the new window is opened
     *
     * @param {String} [config.options.toolbar]
     * Set to yes or no to turn the toolbar on or off for the InAppBrowser DEFAULTS to `yes`
     *
     * @param {String} [config.options.enableViewportScale]
     * Set to yes or no to prevent viewport scaling through a meta tag DEFAULTS to `yes`
     *
     * @param {String} [config.options.mediaPlaybackRequiresUserAction]
     * Set to yes or no to prevent HTML5 audio or video from autoplaying DEFAULTS to `no`
     *
     * @param {String} [config.options.allowInlineMediaPlayback]
     * Set to yes or no to allow in-line HTML5 media playback, displaying within the browser window rather than a device-specific playback interface. The HTML's video element must also include the webkit-playsinline attribute DEFAULTS to `no`
     *
     * @param {String} [config.options.keyboardDisplayRequiresUserAction]
     * Set to yes or no to open the keyboard when form elements receive focus via JavaScript's focus() call DEFAULTS to `yes`
     *
     * @param {String} [config.options.suppressesIncrementalRendering]
     * Set to yes or no to wait until all new view content is received before being rendered DEFAULTS to `no`
     *
     * @param {String} [config.options.presentationstyle]
     * Set to pagesheet, formsheet or fullscreen to set the presentation style DEFAULTS to `fullscreen`
     *
     * @param {String} [config.options.transitionstyle]
     * Set to fliphorizontal, crossdissolve or coververtical to set the transition style DEFAULTS to `coververtical`
     *
     * @param {String} [config.options.toolbarposition]
     * Set to top or bottom. DEFAULTS to `top` Causes the toolbar to be at the top or bottom of the window.
     *
     * @param {Function} config.callback
     * The callback which is called when the inAppBrowser is closed.
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    show : function (config) {
        Ext.apply(config, {
            callbackMandatory : false,
            requestId         : 'showInAppBrowser',
            responseId        : 'inAppBrowser'
        });
        Valence.mobile.Access.initiate(config);
    }
});