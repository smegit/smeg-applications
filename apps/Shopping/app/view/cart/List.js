Ext.define('Shopping.view.cart.List', {
    extend : 'Ext.grid.Panel',
    xtype  : 'cartlist',
    requires      : [
        'Ext.form.field.Number',
        'Ext.grid.feature.Summary',
        'Ext.grid.plugin.CellEditing',
        'Shopping.util.Helper'
    ],
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
    header        : {
        bind : {
            hidden : '{hideOrdKey}',
            title  : '{ordKeyText}'
        }
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
                sortable  : false,
                renderer  : function (v, meta) {
                    if (!Ext.isEmpty(v)) {
                        meta.tdCls += ' image-column';
                        return '<image class="cart-list-prd-detail" src="' + v + '" height="50" width="50"></image>';
                    }
                    return '';
                }
            }, {
                text      : 'Item',
                width     : 100,
                dataIndex : 'product_id',
                renderer  : function (v, meta) {
                    meta.tdCls += ' cart-list-prd-detail';
                    return v;
                }
            }, {
                text      : 'Description',
                cellWrap  : true,
                dataIndex : 'prod_desc',
                flex      : 2,
                renderer  : function (v, meta) {
                    meta.tdCls += ' cart-list-prd-detail';
                    return v;
                }
            }];

        if (!me.release) {
            cols = Ext.Array.merge(cols, [{
                text            : 'Order',
                width           : 70,
                align           : 'right',
                dataIndex       : 'quantity',
                sortable        : false,
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
                sortable        : false,
                width           : 75,
                align           : 'right',
                summaryType     : 'sum',
                summaryRenderer : function (value) {
                    return Ext.String.format('<b>{0}</b>', value);
                }
            }, {
                text            : 'Outstanding',
                dataIndex       : 'outstanding',
                sortable        : false,
                width           : 90,
                align           : 'right',
                renderer        : function(v, meta, rec){
                    return Shopping.util.Helper.getOutstanding(rec);
                },
                summaryType     : 'sum',
                summaryRenderer : function (value) {
                    return Ext.String.format('<b>{0}</b>', value);
                }
            }, {
                text            : '<div data-qtip="Enter partial delivery.">Release</div>',
                dataIndex       : 'release',
                sortable        : false,
                width           : 70,
                align           : 'right',
                editor          : {
                    xtype : 'numberfield'
                },
                renderer        : function (v, meta, rec) {
                    var outstanding = Shopping.util.Helper.getOutstanding(rec);
                    if (!Ext.isEmpty(outstanding) && outstanding > 0) {
                        meta.tdCls += ' editable-column';
                        return '<div data-qtip="Enter partial delivery.">' + v + '</div>';
                    }
                    return 0;
                },
                summaryType     : 'sum',
                summaryRenderer : function (value) {
                    return Ext.String.format('<b>{0}</b>', value);
                }
            }, {
                text      : 'Allocated',
                width     : 70,
                align     : 'right',
                dataIndex : 'allocated',
                sortable  : false,
                bind      : {
                    hidden : '{hideAllocated}'
                },
                renderer : function(v, meta, rec){
                    if (v < rec.get('release')){
                        meta.tdCls += ' cart-list-alc-error';
                    }
                    return v;
                }
            }, {
                text      : 'Price',
                width     : 80,
                align     : 'right',
                dataIndex : 'price',
                sortable  : false,
                renderer  : function (value) {
                    return Ext.util.Format.number(value, '0,0.00');
                }

            }, {
                text            : 'Total',
                width           : 85,
                align           : 'right',
                dataIndex       : 'extended_price',
                sortable        : false,
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
                sortable : false,
                renderer : function (value, meta, rec, rowIndex, colIndex, store) {
                    if (store.getCount() > 1 && (Ext.isEmpty(rec.get('delivered')) || rec.get('delivered') == 0)) {
                        return '<span data-qtip="Remove" class="vvicon-in-cell vvicon-cross"><span>';
                    }
                    return '';
                }
            }]);
        } else {
            cols = Ext.Array.merge(cols, [{
                text            : 'Release',
                width           : 75,
                align           : 'right',
                dataIndex       : 'viewReleaseQty',
                summaryType     : 'sum',
                sortable        : false,
                summaryRenderer : function (value) {
                    return Ext.String.format('<b>{0}</b>', value);
                }
            }, {
                text      : 'Price',
                flex      : 1,
                align     : 'right',
                dataIndex : 'price',
                sortable  : false,
                renderer  : function (value) {
                    return Ext.util.Format.number(value, '0,0.00');
                }

            }, {
                text            : 'Total',
                flex            : 1,
                align           : 'right',
                dataIndex       : 'extended_price',
                sortable        : false,
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
                    beforeedit   : 'onBeforeEditList',
                    canceledit   : 'onCancelEditList',
                    edit         : 'onEditList',
                    validateedit : 'onValidateEditList'
                }
            }];
        }
        return [];
    }
});