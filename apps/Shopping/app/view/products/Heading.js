Ext.define('Shopping.view.products.Heading', {
    extend   : 'Ext.toolbar.Toolbar',
    requires : [
        'Valence.common.ux.plugin.form.field.ClearValue'
    ],
    xtype    : 'heading',
    ui       : 'heading',

    layout : {
        type : 'hbox'
    },

    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            items : me.buildItems()
        });
        me.callParent(arguments);
    },

    buildItems : function () {
        var me = this;
        return [{
            xtype : 'tbtext',
            style   : {
                'font-weight' : 500,
                'font-size'   : '16px'
            },
            bind : {
                html : '{agentName}'
            }
        }, {
            xtype : 'tbfill'
        }, {
            xtype : 'combo',
            queryMode : 'local',
            width : 305,
            labelWidth : 95,
            valueField : 'STKCOD',
            displayField : 'STKDSC',
            reference : 'stocklocs',
            cls : 'combo-no-bckgrd',
            fieldLabel : 'Stock Location',
            forceSelection : true,
            listeners : {
                change : 'onChangeStockLocation'
            },
            bind : {
                store : '{StockLocations}',
                value : '{stkLocation}'
            }
        },{
            xtype           : 'textfield',
            itemId          : 'search',
            width           : 200,
            emptyText       : 'Filter Results',
            margin          : '0 15 0 0',
            enableKeyEvents : true,
            plugins         : [{
                ptype : 'formfieldclearvalue'
            }]
        }, {
            xtype  : 'button',
            action : 'existingcarts',
            text   : 'View Saved Orders'
        }, {
            xtype     : 'component',
            height    : '100%',
            itemId    : 'cart',
            width     : 50,
            margin    : '8 0 0 0',
            bind      : {
                data : {
                    cartCount : '{cartCount}'
                }
            },
            listeners : {
                click : 'onViewCart'
            },
            tpl       : me.buildTpl()
        }, {
            xtype  : 'button',
            text   : 'Clear',
            action : 'resetcart',
            itemId : 'newOrderBtn',
            hidden : true,
            bind   : {
                hidden : '{hideClearCart}'
            }
        }];
    },

    buildTpl : function () {
        var me = this;
        return Ext.create('Ext.XTemplate',
            '<div data-event="viewcart" class="vvicon-cart4 cart-size">',
            '<div data-event="viewcart" class="cart-num">{cartCount}</div>',
            '</div>'
        );
    },

    onClickHeading : function (e) {
        var me    = this,
            el    = Ext.get(e.getTarget()),
            event = el.getAttribute('data-event');

        if (event) {
            me.fireEvent(event, el);
        }
    },

    onRender : function () {
        var me = this;
        me.callParent(arguments);

        me.el.on({
            scope : me,
            click : me.onClickHeading
        });
    }

});