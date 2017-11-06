Ext.define('Valence.device.Badge', {
    singleton : true,

    clear : function () {
        var config = {
            callbackMandatory : false,
            requestId         : 'badge',
            method            : 'clear'
        };
        Valence.device.Access.initiate(config);
    },

    get : function (config) {
        Ext.apply(config, {
            requestId  : 'badge',
            responseId : 'badge',
            method     : 'get'
        });
        Valence.device.Access.initiate(config);
    },

    set : function (value) {
        var config = {};
        Ext.apply(config, {
            callbackMandatory : false,
            requestId         : 'badge',
            method            : 'set',
            value             : value
        });
        Valence.device.Access.initiate(config);
    }
});