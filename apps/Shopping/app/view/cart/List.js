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
        clicksToEdit : 1,
        listeners : {
            validateedit : 'onValidateEditCartItems'
        }
    }],
    viewConfig   : {
        emptyText : 'No Items have been added to this Order'
    },
    columns      : {
        items    : [
            {
                text      : 'Item',
                cellWrap  : true,
                flex      : 1,
                maxWidth  : 110,
                dataIndex : 'product_id'
            },
            {
                text      : 'Description',
                cellWrap  : true,
                dataIndex : 'prod_desc',
                flex      : 2
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
                text            : 'Release',
                dataIndex       : 'release',
                width           : 85,
                align           : 'right',
                editor          : {
                    xtype : 'numberfield'
                },
                summaryType     : 'sum',
                summaryRenderer : function (value) {
                    return Ext.String.format('<b>{0}</b>', value);
                }
            }, {
                text            : 'Delivered',
                dataIndex       : 'delivered',
                width           : 85,
                align           : 'right',
                summaryType     : 'sum',
                summaryRenderer : function (value) {
                    return Ext.String.format('<b>{0}</b>', value);
                }
            }, {
                text            : 'Outstanding',
                dataIndex       : 'outstanding',
                width           : 100,
                align           : 'right',
                summaryType     : 'sum',
                summaryRenderer : function (value) {
                    return Ext.String.format('<b>{0}</b>', value);
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
                summaryRenderer : function (value) {
                    return Ext.String.format('<b>{0}</b>', Ext.util.Format.currency(value));
                }
            }, {
                text     : '',
                action   : 'removecartitem',
                width    : 30,
                align    : 'center',
                renderer : function (value, meta, rec, rowIndex, colIndex, store) {
                    if (store.getCount() > 1){
                        return '<span data-qtip="Remove" class="vvicon-in-cell vvicon-cross"><span>';
                    }
                    return '';
                }
            }
        ],
        defaults : {
            menuDisabled : true
        }
    }

});