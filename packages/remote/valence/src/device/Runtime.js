Ext.define('Valence.device.Runtime', {
    singleton : true,

    getData : function (config) {
        Ext.apply(config, {
            requestId  : 'getRuntimeData',
            responseId : 'runtimeData'
        });
        Valence.device.Access.initiate(config);
    },

    removeData : function (keys) {
        var config = {
            callbackMandatory : false,
            requestId         : 'removeRuntimeData',
            keys              : keys
        };
        Valence.device.Access.initiate(config);
    },

    setData : function (data) {
        var config = {
            callbackMandatory : false,
            requestId         : 'setRuntimeData'
        };

        Ext.apply(config, {
            data : data
        });
        Valence.device.Access.initiate(config);
    }
});