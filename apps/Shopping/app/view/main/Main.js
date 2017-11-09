Ext.define('Shopping.view.main.Main', {
    extend : 'Ext.container.Container',
    xtype : 'app-main',
    requires   : [
        'Ext.layout.container.Fit',
        'Ext.plugin.Viewport',
        'Shopping.view.main.MainController',
        'Shopping.view.main.MainModel',
        'Shopping.view.shoppingstore.ShoppingStore'
    ],
    viewModel  : {
        type : 'main'
    },
    controller : 'main',
    plugins    : ['viewport'],
    layout     : 'fit',
    minWidth   : 1024,
    items      : [{
        xtype : 'shoppingstore'
    }]
});