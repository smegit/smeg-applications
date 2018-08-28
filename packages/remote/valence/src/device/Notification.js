Ext.define('Valence.device.Notification', {
    singleton : true,

    beep : function (times) {
        var config = {
            callbackMandatory : false,
            requestId         : 'beep'
        };

        if (!Ext.isEmpty(times)){
            Ext.apply(config, {
                times : times
            });
        }
        Valence.device.Access.initiate(config);
    }
});