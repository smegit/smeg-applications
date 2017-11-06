Ext.define('Valence.device.Barcode', {
    singleton : true,

    scan : function (config) {
        Ext.apply(config, {
            requestId  : 'barcode',
            responseId : 'scanBarcode',
            method     : 'scan'
        });
        Valence.device.Access.initiate(config);
    },

    stopScan : function () {
        var config = {
            callbackMandatory : false,
            requestId         : 'barcode',
            responseId        : 'stopScanBarcode',
            method            : 'stop'
        };
        Valence.device.Access.initiate(config);
    }
});