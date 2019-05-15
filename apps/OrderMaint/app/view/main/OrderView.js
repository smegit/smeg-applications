Ext.define('OrderMaint.view.main.OrderView', {
    extend: 'Ext.container.Container',
    xtype: 'orderView',
    //data: this.data,
    buildItems: function () {
        var me = this;
        return [{
            xtype: 'gridpanel',
            title: 'Items',
            // bind: {
            //     store: '{data.CartDtl}'
            // },
            store: Ext.create('Ext.data.Store', {
                data: me.buildStoreData()
            }),
            columns: [
                // {
                //     text: '',
                //     //minWidth: 0,
                //     //maxWidth: 50,
                //     width: 100,
                //     cls: 'img-column',
                //     dataIndex: 'SMALLPIC',
                //     align: 'center',
                //     sortable: false,
                //     cell: {
                //         encodeHtml: false,
                //         cls: 'img-cell'
                //     },
                //     padding: 0,
                //     renderer: function (v, record, dataIndex, cell, column) {
                //         //return '<img src="' + v + '" style="height:40px" / >';
                //         console.info(v);
                //         var onErrorReplace = '\"/Product/Images/FAB10HLR_200x200.jpg\"';
                //         return "<img  src=\"" + v + "\" onerror='this.src=\"/Product/Images/missing.png\"' style='height:40px'/>";
                //     }
                // },
                {
                    text: 'Item',
                    width: 100,
                    dataIndex: 'OBITM',
                    // renderer: function (v, meta) {
                    //     meta.tdCls += ' cart-list-prd-detail';
                    //     return v;
                    // }
                }, {
                    text: 'Description',
                    cellWrap: true,
                    dataIndex: 'OBURRP',
                    flex: 1,
                    // renderer: function (v, meta, record) {
                    //     // console.info(v);
                    //     // console.info(record);
                    //     // console.info(record.getData().plain_txt);
                    //     meta.tdCls += ' cart-list-prd-detail';
                    //     return v + '<p style="color:red;margin:auto">' + record.getData().plain_txt + '</p>';
                    // }
                },
                {
                    text: 'Order',
                    align: 'right',
                    dataIndex: 'OBQTYO',
                },
                {
                    text: 'Delivered',
                    align: 'right',
                    dataIndex: 'OBQTYD',
                },
                {
                    text: 'Price',
                    align: 'right',
                    dataIndex: 'OBUPRC',
                },
                {
                    text: 'Sub Total',
                    align: 'right',
                    dataIndex: 'OBTOTA',
                }
            ]
        },
        // {
        //     xtype: 'form'
        // },

        {
            xtype: 'button',
            text: 'Button1',
            handler: 'btnHandler'
        }]
    },

    initComponent: function (view) {
        var me = this;
        console.info('initComponent called');
        console.info(view);

        Ext.apply(me, {
            items: me.buildItems(),
            // plugins: me.buildPlugins()
        });
        me.callParent(arguments);
        console.info(arguments);
    },
    buildStoreData: function () {
        var me = this;
        console.info(this);
        return this.config.data.CartDtl;
    }
});