Ext.define('Shopping.view.shoppingstore.ShoppingStore', {
    extend: 'Ext.Container',
    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Card',
        'Ext.layout.container.Fit',
        'Shopping.view.cart.Main',
        'Shopping.view.products.Main',
        'Shopping.view.shoppingstore.ShoppingStoreController',
        'Shopping.view.shoppingstore.ShoppingStoreModel'
    ],
    xtype: 'shoppingstore',
    viewModel: {
        type: 'shoppingstore'
    },
    controller: 'shoppingstore',
    layout: 'fit',
    items: [{
        xtype: 'container',
        layout: {
            type: 'card'
        },
        reference: 'card',
        items: [{
            reference: 'productsMain',
            xtype: 'productsmain',
            listeners: {
                //selectstocklocation: 'onSelectStockLocation',
                viewcart: 'onViewCart',
                updatecartandshow: 'onUpdateCartAndShow'
            }
        }]
    }]
});