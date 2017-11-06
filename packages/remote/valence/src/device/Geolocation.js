Ext.define('Valence.device.Geolocation', {
    singleton : true,

    getCurrentPosition : function (config) {
        Ext.apply(config, {
            requestId  : 'geolocation',
            responseId : 'geolocationPosition',
            method     : 'getCurrentPosition'
        });
        Valence.device.Access.initiate(config);
    }
});