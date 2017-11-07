Ext.define('Shopping.view.cart.Main', {
    extend    : 'Ext.panel.Panel',
    xtype     : 'cartmain',
    reference : 'cartcontainer',

    requires      : [
        'Shopping.view.cart.List',
        'Shopping.view.cart.Form',
        'Ext.button.Split',
        'Ext.layout.container.VBox'
    ],
    cls           : 'cart',
    bodyPadding   : '10 20',
    scrollable    : true,
    layout        : 'anchor',
    defaults      : {
        maxWidth : 1060,
        style    : {
            'margin-left'  : 'auto',
            'margin-right' : 'auto'
        }
    },
    tbar          : {
        xtype  : 'toolbar',
        height : 50,
        layout : {
            type : 'hbox'
        },
        items  : [
            {
                xtype    : 'container',
                layout   : {
                    type  : 'hbox',
                    align : 'stretch'
                },
                flex     : 1,
                defaults : {
                    flex : 1
                },
                items    : [{
                    xtype   : 'tbtext',
                    padding : 6,
                    style   : {
                        'font-weight' : 500,
                        'font-size'   : '16px'
                    },
                    bind    : {
                        html : '{agentName}'
                    }
                }, {
                    xtype   : 'tbtext',
                    padding : 6,
                    style   : {
                        'font-weight' : 500,
                        'font-size'   : '16px'
                    },
                    bind    : {
                        hidden : '{hideOrdKey}',
                        html   : '{ordKeyText}'
                    }
                }, {
                    xtype          : 'combo',
                    queryMode      : 'local',
                    flex           : 0,
                    width          : 305,
                    labelWidth     : 95,
                    valueField     : 'STKCOD',
                    displayField   : 'STKDSC',
                    reference      : 'stocklocs',
                    cls            : 'combo-cart-stock',
                    fieldLabel     : 'Stock Location',
                    forceSelection : true,
                    listeners      : {
                        change : 'onChangeStockLocation'
                    },
                    bind           : {
                        store : '{stockLocations}',
                        value : '{stkLocation}'
                    }
                }]
            }, {
                text     : 'Continue Shopping',
                cls      : 'btn-shopping',
                focusCls : 'btn-shopping',
                overCls  : 'btn-shopping-over',
                handler  : 'onClickGoBack'
            }, {
                text    : 'Clear Order',
                maskMsg : 'Clearing Cart',
                action  : 'clearcart'
            }, {
                text    : 'View Saved Orders',
                maskMsg : 'Loading',
                action  : 'existingcarts'
            }, {
                text    : 'Save',
                action  : 'savecart',
                maskMsg : 'Saving Order'
            }, {
                text    : 'Deposit',
                action  : 'deposit',
                maskMsg : 'Setting up Deposit'
            }, {
                text     : 'Checkout',
                action   : 'checkout',
                maskMsg  : 'Checking Out',
                cls      : 'btn-checkout',
                overCls  : 'btn-checkout-over',
                focusCls : 'btn-checkout'
            }]
    },
    bbar          : {
        xtype  : 'toolbar',
        height : 50,
        items  : [{
            xtype : 'tbfill'
        }, {
            text     : 'Continue Shopping',
            cls      : 'btn-shopping',
            focusCls : 'btn-shopping',
            overCls  : 'btn-shopping-over',
            handler  : 'onClickGoBack'
        }, {
            text    : 'Clear Order',
            maskMsg : 'Clearing Cart',
            action  : 'clearcart'
        }, {
            text    : 'View Saved Orders',
            maskMsg : 'Loading',
            action  : 'existingcarts'
        }, {
            text    : 'Save',
            action  : 'savecart',
            maskMsg : 'Saving Order'
        }, {
            text    : 'Deposit',
            action  : 'deposit',
            maskMsg : 'Setting up Deposit'
        }, {
            text     : 'Checkout',
            action   : 'checkout',
            maskMsg  : 'Checking Out',
            cls      : 'btn-checkout',
            overCls  : 'btn-checkout-over',
            focusCls : 'btn-checkout'
        }]
    },
    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            items : me.buildItems(me.cartOptions)
        });
        me.callParent(arguments);
    },

    buildItems : function (opts) {
        return [{
            xtype     : 'cartlist',
            minHeight : 100
        }, {
            xtype       : 'cartform',
            cartOptions : opts
        }]
    }
});
