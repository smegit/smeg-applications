Ext.define('Shopping.view.shoppingstore.ShoppingStore', {
    extend     : 'Ext.Container',
    requires   : [
        'Shopping.view.shoppingstore.ShoppingStoreModel',
        'Shopping.view.shoppingstore.ShoppingStoreController',
        'Shopping.view.products.Main',
        'Shopping.view.cart.Main',
    ],
    xtype      : 'shoppingstore',
    viewModel  : {
        type : 'shoppingstore'
    },
    controller : 'shoppingstore',
    layout     : 'fit',
    items      : [{
        xtype     : 'container',
        layout    : {
            type : 'card'
        },
        reference : 'card',
        items     : [{
            xtype : 'productsmain'
        }]
    }]
});