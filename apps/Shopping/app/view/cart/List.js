Ext.define('Shopping.view.cart.List', {
    extend : 'Ext.grid.Panel',
    xtype  : 'cartlist',

    requires : [
        'Ext.form.field.Number',
        'Ext.grid.feature.Summary',
        'Ext.grid.plugin.CellEditing'
    ],

    bind          : {
        store : '{cartItems}'
    },
    countInTitle  : false,
    ui            : 'background',
    features      : [{
        ftype : 'summary'
    }],
    cls           : 'cart-list',
    overCls       : 'cart-list-over',
    viewConfig    : {
        emptyText : 'No Items have been added to this Order'
    },
    listeners     : {
        cellclick : 'onCellClickList',
        edit      : 'onCellEditList',
        viewready : 'onViewReadyList'
    },
    initComponent : function () {
        var me = this;

        Ext.apply(me, {
            columns : me.buildColumns(),
            plugins : me.buildPlugins()
        });
        me.callParent(arguments);
    },
    buildColumns  : function () {
        var me   = this,
            cols = [{
                text      : '',
                minWidth  : 0,
                maxWidth  : 50,
                dataIndex : 'smallpic',
                align     : 'center',
                renderer  : function (v, meta) {
                    if (!Ext.isEmpty(v)) {
                        meta.tdCls += ' image-column';
                        return '<image class="cart-list-item-image" src="' + v + '" height="50" width="50"></image>';
                    }
                    return '';
                }
            }, {
                text      : 'Item',
                width     : 100,
                dataIndex : 'product_id'
                // align     : 'center'
                // renderer  : function (v, meta, rec) {
                //     var smallPic = rec.get('smallpic');
                //     if (!Ext.isEmpty(smallPic)) {
                //         return '<div>' + v + '</div>' +
                //             '<image class="cart-list-item-image" src="' + smallPic + '" height="50" width="50"></image>';
                //     } else {
                //         return v;
                //     }
                // }
            }, {
                text      : 'Description',
                cellWrap  : true,
                dataIndex : 'prod_desc',
                flex      : 2
            }];

        if (!me.release) {
            cols = Ext.Array.merge(cols, [{
                text            : 'Order',
                width           : 70,
                align           : 'right',
                dataIndex       : 'quantity',
                editor          : {
                    xtype : 'numberfield'
                },
                renderer        : function (v, meta) {
                    meta.tdCls += ' editable-column';
                    return v;
                },
                summaryType     : 'sum',
                summaryRenderer : function (value, summaryData, dataIndex) {
                    return Ext.String.format('<b>{0}</b>', value);
                }
            }, {
                text            : 'Delivered',
                dataIndex       : 'delivered',
                width           : 75,
                align           : 'right',
                summaryType     : 'sum',
                summaryRenderer : function (value) {
                    return Ext.String.format('<b>{0}</b>', value);
                }
            }, {
                text            : 'Outstanding',
                dataIndex       : 'outstanding',
                width           : 90,
                align           : 'right',
                summaryType     : 'sum',
                summaryRenderer : function (value) {
                    return Ext.String.format('<b>{0}</b>', value);
                }
            }, {
                text            : 'Release',
                dataIndex       : 'release',
                width           : 70,
                align           : 'right',
                editor          : {
                    xtype : 'numberfield'
                },
                renderer        : function (v, meta) {
                    meta.tdCls += ' editable-column';
                    return v;
                },
                summaryType     : 'sum',
                summaryRenderer : function (value) {
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
                width     : 80,
                align     : 'right',
                dataIndex : 'price',
                renderer  : function (value) {
                    return Ext.util.Format.number(value, '0,0.00');
                }

            }, {
                text            : 'Total',
                width           : 85,
                align           : 'right',
                dataIndex       : 'extended_price',
                renderer        : function (value) {
                    return Ext.util.Format.number(value, '0,0.00');
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
                    if (store.getCount() > 1) {
                        return '<span data-qtip="Remove" class="vvicon-in-cell vvicon-cross"><span>';
                    }
                    return '';
                }
            }]);
        } else {
            cols = Ext.Array.merge(cols, [{
                text            : 'Ordered',
                width           : 75,
                align           : 'right',
                dataIndex       : 'quantity',
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
                    return Ext.util.Format.number(value, '0,0.00');
                }

            }, {
                text            : 'Total',
                flex            : 1,
                align           : 'right',
                dataIndex       : 'extended_price',
                renderer        : function (value) {
                    return Ext.util.Format.number(value, '0,0.00');
                },
                summaryType     : 'sum',
                summaryRenderer : function (value) {
                    return Ext.String.format('<b>{0}</b>', Ext.util.Format.currency(value));
                }
            }]);
        }

        return {
            defaults : {
                menuDisabled : true
            },
            items    : cols
        };
    },
    buildPlugins  : function () {
        var me = this;
        if (!me.release) {
            return [{
                ptype        : 'cellediting',
                clicksToEdit : 1,
                listeners    : {
                    validateedit : 'onValidateEditList'
                }
            }];
        }
        return [];
    }
});