Ext.define('Valence.device.Information', {
    singleton : true,

    connectionType : function (config) {
        Ext.apply(config, {
            requestId  : 'getConnectionType',
            responseId : 'connectionType'
        });
        Valence.device.Access.initiate(config);
    },

    get : function (config) {
        Ext.apply(config, {
            requestId  : 'getDeviceInformation',
            responseId : 'deviceInformation'
        });
        Valence.device.Access.initiate(config);
    }
});