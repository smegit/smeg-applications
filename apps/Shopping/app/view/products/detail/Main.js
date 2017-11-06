Ext.define('Shopping.view.products.detail.Main', {
    extend  :  'Ext.panel.Panel',
    xtype   :  'productdetail',
    requires:   [
        'Shopping.view.products.detail.View'
    ],
    viewModel   :   'detail',
    layout      :   {
        type    :   'card'
    },

    items : [
        {
            xtype   : 'detailview',
            scrollable  : true
        }
    ]
});
