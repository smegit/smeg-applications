Ext.define('Valence.device.Email', {
    singleton : true,

    compose : function (config) {
        if (!Ext.isEmpty(config)) {
            Ext.apply(config, {
                options : Ext.clone(config)
            });
        } else {
            config = {};
        }
        Ext.apply(config, {
            requestId         : 'emailComposer',
            responseId        : 'emailComposer',
            callbackMandatory : false
        });
        Valence.device.Access.initiate(config);
    }
});