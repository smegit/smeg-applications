Ext.define('Shopping.view.cart.List', {
    extend       : 'Ext.grid.Panel',
    xtype        : 'cartlist',
    bind         : {
        store : '{cartItems}'
    },
    countInTitle : false,
    ui           : 'background',
    features     : [{
        ftype : 'summary'
    }],
    cls          : 'cart-list',
    overCls      : 'cart-list-over',
    plugins      : [{
        ptype        : 'cellediting',
        clicksToEdit : 1
    }],
    viewConfig   : {
        emptyText : 'No Items have been added to this Order'
    },
    columns      : {
        items    : [
            {
                text      : 'Item',
                flex      : 1,
                dataIndex : 'product_id'
            },
            {
                text      : 'Description',
                dataIndex : 'prod_desc',
                flex      : 0,
                width     : 400
            }, {
                text            : 'Quantity (Click to Change)',
                width           : 160,
                align           : 'right',
                dataIndex       : 'quantity',
                cls             : 'cart-qty-col',
                editor          : {
                    xtype : 'numberfield'
                },
                summaryType     : 'sum',
                summaryRenderer : function (value, summaryData, dataIndex) {
                    return Ext.String.format('<b>{0}</b>', value);
                }
            }, {
                text      : 'Allocated',
                flex      : 1,
                align     : 'right',
                dataIndex : 'allocated',
                bind      : {
                    hidden : '{hideAllocated}'
                }

            }, {
                text      : 'Price',
                flex      : 1,
                align     : 'right',
                dataIndex : 'price',
                renderer  : function (value) {
                    return Ext.util.Format.currency(value, null, 0);
                }

            }, {
                text            : 'Total',
                flex            : 1,
                align           : 'right',
                dataIndex       : 'extended_price',
                renderer        : function (value) {
                    return Ext.util.Format.currency(value);
                },
                summaryType     : 'sum',
                summaryRenderer : function (value, summaryData, dataIndex) {
                    return Ext.String.format('<b>{0}</b>', Ext.util.Format.currency(value));
                }
            }, {
                text     : '',
                action   : 'removecartitem',
                width    : 30,
                align    : 'center',
                renderer : function () {
                    return '<span data-qtip="Remove" class="vvicon-in-cell vvicon-cross"><span>';
                }
            }
        ],
        defaults : {
            menuDisabled : true
        }
    }

});