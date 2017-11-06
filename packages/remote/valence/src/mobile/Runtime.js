Ext.define('Valence.mobile.Runtime', {
    alternateClassName : ['Valence.device.Runtime'],
    singleton          : true,

    getData : function (config) {
        Ext.apply(config, {
            requestId  : 'getRuntimeData',
            responseId : 'runtimeData'
        });
        Valence.mobile.Access.initiate(config);
    },

    removeData : function (keys) {
        var config = {
            callbackMandatory : false,
            requestId         : 'removeRuntimeData',
            keys              : keys
        };
        Valence.mobile.Access.initiate(config);
    },

    setData : function (data) {
        var config = {
            callbackMandatory : false,
            requestId         : 'setRuntimeData'
        };

        Ext.apply(config, {
            data : data
        });
        Valence.mobile.Access.initiate(config);
    }
});