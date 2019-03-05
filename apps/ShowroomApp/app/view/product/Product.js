/**
 * This view is an example list of people.
 */
Ext.define('ShowroomApp.view.product.Product', {
    extend: 'Ext.grid.Grid',
    xtype: 'product',

    requires: [
        //'ShowroomApp.store.Personnel'
        //'ShowroomApp.view.product.ProductController'
    ],

    title: 'Product',
    controller: 'product',
    //viewModel: 'product',

    bind: {
        store: '{products}'
    },
    height: '200',



    columns: [
        { text: 'model', dataIndex: 'MODEL', width: 100 },
        // { text: 'Email', dataIndex: 'email', width: 230 },
        // { text: 'Phone', dataIndex: 'phone', width: 150 }
    ],
});
