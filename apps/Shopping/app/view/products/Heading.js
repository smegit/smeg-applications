Ext.define('Shopping.view.products.Heading', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'Valence.common.ux.plugin.form.field.ClearValue'
    ],
    xtype: 'heading',
    ui: 'primary-dark',
    layout: {
        type: 'hbox'
    },
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: me.buildItems()
        });
        me.callParent(arguments);
    },

    buildItems: function () {
        var me = this;
        return [{
            xtype: 'combo',
            cls: 'fld-in-header',
            queryMode: 'local',
            width: 305,
            labelWidth: 95,
            height: 32,
            valueField: 'STKCOD',
            displayField: 'STKDSC',
            reference: 'stocklocs',
            fieldLabel: 'Stock Location',
            forceSelection: true,
            listeners: {
                select: 'onSelectStockLocation',
                change: 'onChangeStockLocation'
            },
            bind: {
                store: '{StockLocations}',
                value: '{currentStockLoc}'
            }
        }, {
            xtype: 'tbfill'
        }, {
            xtype: 'textfield',
            cls: 'fld-in-header',
            itemId: 'search',
            width: 200,
            height: 32,
            emptyText: 'Filter Products',
            margin: '0 8 0 0',
            enableKeyEvents: true,
            plugins: [{
                ptype: 'formfieldclearvalue'
            }],
            listeners: {
                clear: 'onClearSearch',
                keyup: {
                    buffer: 250,
                    fn: 'onKeyupSearch'
                }
            }
        }, {
            xtype: 'button',
            action: 'existingcarts',
            text: 'Saved Orders',
            bind: {
                hidden: '{!hideClearCart}'
            }
        }, {
            xtype: 'component',
            height: '100%',
            itemId: 'cart',
            width: 50,
            margin: '8 0 0 0',
            bind: {
                data: {
                    cartCount: '{cartCount}'
                },
                hidden: '{hideClearCart}'
            },
            listeners: {
                el: {
                    click: 'onViewCart'
                }
            },
            tpl: me.buildTpl()
            //commenting out the reset cart since its available inside the cart but can easily be added back
            // if users request it
            // }, {
            //     xtype  : 'button',
            //     text   : 'Clear',
            //     action : 'resetcart',
            //     itemId : 'newOrderBtn',
            //     hidden : true,
            //     bind   : {
            //         hidden : '{hideClearCart}'
            //     }
        }];
    },

    buildTpl: function () {
        var me = this;
        return Ext.create('Ext.XTemplate',
            '<div data-event="viewcart" class="vvicon-cart4 cart-size">',
            '<div data-event="viewcart" class="cart-num">{cartCount}</div>',
            '</div>'
        );
    }
});