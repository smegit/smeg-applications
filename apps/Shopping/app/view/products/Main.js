Ext.define('Shopping.view.products.Main', {
    extend: 'Ext.container.Container',
    xtype: 'productsmain',
    requires: [
        'Shopping.view.products.View',
        'Shopping.view.products.Categories',
        'Shopping.view.products.Heading',
        'Ext.layout.container.Border',
        'Shopping.view.products.ProductsController',

        'Shopping.view.products.AdvancedSearch'
    ],
    layout: {
        type: 'border'
    },
    controller: 'products',
    listeners: {
        //selectfirstcat: 'onSelectFirstCat',
        unmaskproductsview: 'onUnmaskProductsView'
    },
    items: [{
        xtype: 'heading',
        region: 'north',
        height: 50
    }, {
        xtype: 'categories',
        width: 280,
        region: 'west'
    }, {
        xtype: 'products',
        region: 'center'
    }]
});