Ext.define('Shopping.view.main.Main', {
    extend : 'Ext.container.Container',

    xtype : 'app-main',

    requires : [
        'Ext.plugin.Viewport',
        'Ext.layout.container.Card',
        'Shopping.view.products.Main',
        'Shopping.view.cart.Main',
        'Shopping.view.main.MainModel',
        'Shopping.view.main.MainController'
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