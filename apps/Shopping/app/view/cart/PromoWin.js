Ext.define('Shopping.view.cart.PromoWin', {
    extend: 'Ext.window.Window',
    //extend: 'Ext.grid.Panel'
    requires: [
        'Ext.grid.Panel',
        'Ext.grid.*',
        'Ext.grid.plugin.CellEditing',
    ],
    xtype: 'promowin',
    reference: 'promowinRef',
    height: 480,
    //width: '35%',
    width: 800,
    //closable: true,
    modal: true,
    bodyPadding: 5,

    bind: {
        title: '{prmDesc}',
    },
    // viewModel: {
    //     type: 'shoppingstore'
    // },
    tbar: [
        {
            xtype: 'panel',
            bind: {
                html: '{prmText}'
                //text: '{prmText}'
                //title: 'Hello'
            }
        }
    ],
    items: [{
        xtype: 'grid',
        flex: 0.5,
        height: 350,
        margin: '0 5 0 0',
        reference: 'promoGrid',
        //plugins: 'multiselection',
        plugins: {
            ptype: 'cellediting',
            clicksToEdit: 1
        },
        bind: {
            // title: '{prmText}',
            store: '{promoSelections}',
            selection: '{promoItems}'
        },
        //columnLines: true,
        //selType: 'checkboxmodel',
        selModel: {
            type: 'checkboxmodel',
            mode: 'SINGLE'
        },
        columns: [{
            text: '',
            minWidth: 0,
            maxWidth: 50,
            dataIndex: 'prm_smallpic',
            align: 'center',
            sortable: false,
            renderer: function (v, meta) {
                if (!Ext.isEmpty(v)) {
                    meta.tdCls += ' image-column';
                    return '<image class="cart-list-prd-detail" src="' + v + '" height="50" width="50"></image>';
                } else {
                    return '';
                }
            }
        }, {
            text: 'Item',
            width: 100,
            dataIndex: 'prm_model',
            renderer: function (v, meta) {
                meta.tdCls += ' cart-list-prd-detail';
                return v;
            }
        }, {
            text: 'Description',
            //cellWrap: true,
            dataIndex: 'prm_desc',
            width: 200,
            flex: 1,
            renderer: function (v, meta) {
                meta.tdCls += ' cart-list-prd-detail';
                return v;
            }
        }, {
            text: 'Value',
            dataIndex: 'prm_price',
            bind: {
                hidden: '{!prmShowValue}'
            },
            renderer: function (v, meta) {
                meta.tdCls += ' cart-list-prd-detail';
                return v;
            }
        }, {
            text: 'Quantity',
            dataIndex: 'prm_qty',
            bind: {
                //hidden: '{!prmShowQty}'
            },
            editor: {
                xtype: 'numberfield'
            },
            renderer: function (v, meta) {
                meta.tdCls += ' cart-list-prd-detail';
                return v;
            }
        }, {
            text: 'Unit Price',
            dataIndex: 'prm_uprice',
            renderer: function (v, meta) {
                meta.tdCls += ' cart-list-prd-detail';
                return v;
            }
        }]

    }],
    // bbar: [{

    // }]
    buttons: [{
        text: 'Select',
        handler: 'onClickSelectPromoWin'
    }, {
        text: 'Cancel',
        //handler: 'onResetFormClick'
        listeners: {
            click: 'onClickCancelPromoWin'
        }
    }],
});