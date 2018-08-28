Ext.define('Valence.device.Print', {
    singleton : true,

    content : function(config){
        Ext.apply(config, {
            requestId  : 'print',
            method     : 'sendContent',
            responseId : 'printSendContent'
        });
        Valence.device.Access.initiate(config);
    },

    isAvailable : function(config){
        Ext.apply(config, {
            requestId  : 'print',
            method     : 'isAvailable',
            responseId : 'printAvailable'
        });
        Valence.device.Access.initiate(config);
    }
});