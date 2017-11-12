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
        stripeRows      : true,
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
            width     : 85,
            renderer  : function (v) {
                if (!Ext.isEmpty(v)) {
                    return Ext.util.Format.date(Ext.Date.parse(v, 'Y-m-d'), 'd-m-Y');
                }
                return '';
            }
        }, {
            text      : 'Time',
            dataIndex : 'OAMNTT',
            flex      : 0,
            align     : 'center',
            width     : 60,
            renderer  : function (v) {
                if (!Ext.isEmpty(v)) {
                    return Ext.util.Format.date(Ext.Date.parse(v, 'H:i:s'), 'H:i');
                }
                return '';
            }
        }, {
            text      : 'Order #',
            dataIndex : 'OAORDKEY',
            flex      : 0,
            width     : 90
        }, {
            text      : 'Name',
            cellWrap  : true,
            dataIndex : 'OACSTNAM'
        }, {
            text      : 'Reference',
            cellWrap  : true,
            dataIndex : 'OACSTREF'
        }, {
            text      : 'Rep Code',
            cellWrap  : true,
            dataIndex : 'OAREP'
        }, {
            text      : 'Status',
            align     : 'center',
            dataIndex : 'OAOSTS',
            flex      : 0,
            width     : 60
        }, {
            text     : '',
            action   : 'removecart',
            flex     : 0,
            width    : 30,
            align    : 'center',
            renderer : function (val, meta, rec) {
                var regex = new RegExp("dep", "i");

                if (regex.test(rec.get('OAOSTS'))) {
                    return '';
                }
                return '<span data-qtip="Remove" class="vvicon-in-cell vvicon-cross"><span>';
            }
        }],
        defaults : {
            menuDisabled : true,
            flex         : 1
        }
    }
});
