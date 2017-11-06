Ext.define('ShoppingCart.view.main.Main', {
    extend : 'Ext.container.Container',

    xtype : 'app-main',

    requires : [
        'Ext.plugin.Viewport',
        'Ext.layout.container.Card',
        'ShoppingCart.view.products.Main',
        'ShoppingCart.view.cart.Main',
        'ShoppingCart.view.main.MainModel',
        'ShoppingCart.view.main.MainController'
    ],

    viewModel : {
        type : 'main'
    },

    controller : 'main',

    plugins : ['viewport'],

    layout : 'fit',

    minWidth   : 1024,

    items : [{
        xtype  : 'container',
        layout : {
            type : 'card'
        },
        reference : 'card',
        items  : [{
            xtype : 'productsmain'
        }]
    }]
});