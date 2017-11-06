Ext.define('Shopping.Application', {
    extend: 'Ext.app.Application',
    name: 'Shopping',
    requires : [
        'Valence.login.Processor',
        'Valence.common.util.Helper'
    ],

    launch: function () {
        var me = this;
        //process login if running outside the portal
        //
        Valence.login.Processor.init({
            namespace : 'Shopping',
            callback  : function () {
                Valence.common.util.Helper.loadMask({
                    text : 'SMEG Shopping Cart'
                });
                Ext.create('Shopping.view.main.Main');
            }
        });
    },

    onAppUpdate: function () {
        window.location.reload();
    }
});
