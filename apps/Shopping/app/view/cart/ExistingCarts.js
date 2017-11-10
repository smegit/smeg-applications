Ext.define('Shopping.view.cart.ExistingCarts', {
    extend     : 'Ext.grid.Panel',
    xtype      : 'existingcarts',
    bind       : {
        store : '{existingCarts}'
    },
    config     : {
        countInTitle : false
    },
    viewConfig : {
        emptyTextPlugin : true,
        emptyText       : {
            heading : 'No Saved Orders',
            iconCls : 'vvicon-price-tags2'
        }
    },
    tbar       : {
        style : {
            'z-index' : 11
        },
        items : [{
            xtype : 'tbtext',
            html  : 'Double-click to load cart'
        }, '->', {
            xtype     : 'textfield',
            width     : 300,
            emptyText : 'Search Saved Orders',
            plugins   : [{
                ptype : 'formfieldclearvalue'
            }],
            listeners : {
                afterrender : 'onAfterRenderSearchSavedOrders',
                change      : 'onChangeSearchSavedOrders',
                clear       : 'onClearSearchSavedOrders'
            }
        }]
    },
    columns    : {
        items    : [{
            text      : 'Date',
            dataIndex : 'OAMNTD',
            flex      : 0,
            width     : 100,
            renderer  : function(v){
                if (!Ext.isEmpty(v)){
                    return Ext.util.Format.date(Ext.Date.parse(v, 'Y-m-d'), 'd-m-Y');
                }
                return '';
            }
        }, {
            text      : 'Time',
            dataIndex : 'OAMNTT',
            flex      : 0,
            width     : 80,
            renderer  : function(v){
                if (!Ext.isEmpty(v)){
                    return Ext.util.Format.date(Ext.Date.parse(v, 'H:i:s'), 'H:i');
                }
                return '';
            }
        }, {
            text      : 'Order #',
            dataIndex : 'OAORDKEY',
            flex      : 0,
            width     : 100
        }, {
            text      : 'Reference',
            dataIndex : 'OACSTREF'
        }, {
            text      : 'Rep Code',
            dataIndex : 'OAREP'
        }, {
            text      : 'Status',
            dataIndex : 'OAOSTS',
            flex      : 0,
            width     : 80
        }, {
            text     : '',
            action   : 'removecart',
            flex     : 0,
            width    : 50,
            renderer : function (val, meta, rec) {
                var regex = new RegExp("dep", "i");

                if (regex.test(rec.get('OAOSTS'))) {
                    return '';
                }
                return '<span class="vvicon-in-cell vvicon-cross" style="color:#B20000;"><span>';
            }
        }],
        defaults : {
            menuDisabled : true,
            flex         : 1
        }
    }
});
