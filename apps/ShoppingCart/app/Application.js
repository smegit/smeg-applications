Ext.define('ShoppingCart.Application', {
    extend: 'Ext.app.Application',
    
    name: 'ShoppingCart',

    requires : [
        'ShoppingCart.util.Helper',
        'ShoppingCart.view.main.Main',
        'Valence.common.util.Helper'
    ],
    
    launch: function () {
        var me = this;

        Valence.login.Processor.init({
            namespace : 'ShoppingCart',
            scope     : me,
            callback  : function() {
                Valence.common.util.Helper.loadMask({
                    text : 'SMEG Shopping Cart'
                });
                Ext.create('ShoppingCart.view.main.Main');
            }
        });
    }
});
