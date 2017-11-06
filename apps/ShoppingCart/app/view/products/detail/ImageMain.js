Ext.define('ShoppingCart.view.products.detail.ImageMain', {
    extend      : 'Ext.panel.Panel',
    xtype       : 'dtlimagemain',

    requires    : [
        'ShoppingCart.view.products.detail.ImageView'
    ],
    bodyPadding : 20,
    tbar        : {
        xtype : 'toolbar',
        height : 45,
        items : [{
            text : 'Return to Product Detail',
            handler : function(){
                Ext.ComponentQuery.query('detailview')[0].up('window').getLayout().setActiveItem(0);
            }
        }]
    },
    layout  : {
        type: 'fit'
    },
    items: [
        {
            xtype   :   'dtlimageview'
        }
    ]
});
