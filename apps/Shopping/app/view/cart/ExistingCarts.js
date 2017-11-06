Ext.define('Shopping.view.cart.ExistingCarts', {
    extend : 'Ext.grid.Panel',

    xtype : 'existingcarts',

    bind : {
        store : '{existingCarts}'
    },

    config : {
        countInTitle : false
    },

    tbar : [{
        xtype : 'tbtext',
        html  : 'Double-click to load cart'
    }, '->', {
        xtype     : 'textfield',
        width     : 300,
        emptyText : 'Search Saved Orders',
        listeners : {
            change : 'onChangeSearchSavedOrders'
        }
    }],

    columns : {
        items    : [
            {
                text      : 'Date',
                dataIndex : 'OAMNTD',
                flex      : 0,
                width     : 100
            },
            {
                text      : 'Time',
                dataIndex : 'OAMNTT',
                flex      : 0,
                width     : 80
            },
            {
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
            }
        ],
        defaults : {
            menuDisabled : true,
            flex         : 1
        }
    }

});
