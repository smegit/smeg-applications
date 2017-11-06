Ext.define('Valence.device.InAppBrowser', {
    singleton : true,

    show : function (config) {
        Ext.apply(config, {
            callbackMandatory : false,
            requestId         : 'showInAppBrowser',
            responseId        : 'inAppBrowser'
        });
        Valence.device.Access.initiate(config);
    }
});