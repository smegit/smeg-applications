Ext.define('Shopping.view.cart.Main', {
    extend        : 'Ext.panel.Panel',
    xtype         : 'cartmain',
    reference     : 'cartcontainer',
    requires      : [
        'Shopping.view.cart.List',
        'Shopping.view.cart.Form',
        'Shopping.view.cart.CartController',
        'Ext.button.Split',
        'Ext.layout.container.VBox'
    ],
    controller    : 'cart',
    cls           : 'cart',
    bodyPadding   : '10 20',
    scrollable    : true,
    layout        : 'anchor',
    listeners : {
        activate : 'onActivate'
    },
    defaults      : {
        maxWidth : 1060,
        style    : {
            'margin-left'  : 'auto',
            'margin-right' : 'auto'
        }
    },
    tbar          : {
        xtype  : 'toolbar',
        ui     : 'primary-dark',
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
                    cls     : 'fld-in-header',
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
                    cls            : 'fld-in-header',
                    queryMode      : 'local',
                    flex           : 0,
                    width          : 305,
                    labelWidth     : 95,
                    valueField     : 'STKCOD',
                    displayField   : 'STKDSC',
                    reference      : 'stocklocs',
                    fieldLabel     : 'Stock Location',
                    forceSelection : true,
                    listeners      : {
                        select : 'onSelectStockLocation'
                    },
                    bind           : {
                        store : '{StockLocations}',
                        value : '{STKCOD}'
                    }
                }]
            }, {
                text    : 'Continue Shopping',
                // cls      : 'btn-shopping',
                // focusCls : 'btn-shopping',
                // overCls  : 'btn-shopping-over',
                ui      : 'white',
                handler : 'onClickBack'
            }, {
                text    : 'Clear Order',
                maskMsg : 'Clearing Cart',
                ui      : 'white',
                action  : 'clearcart'
            }, {
                text    : 'Save',
                action  : 'savecart',
                ui      : 'white',
                maskMsg : 'Saving Order'
            }, {
                text    : 'Deposit',
                action  : 'deposit',
                ui      : 'white',
                maskMsg : 'Setting up Deposit'
                // }, {
                //     text     : 'Checkout',
                //     action   : 'checkout',
                //     maskMsg  : 'Checking Out',
                //     cls      : 'btn-checkout',
                //     overCls  : 'btn-checkout-over',
                //     focusCls : 'btn-checkout'
            }, {
                text    : 'Release',
                ui      : 'blue',
                handler : 'onClickRelease'
            }]
    },
    bbar          : {
        xtype  : 'toolbar',
        ui     : 'primary-dark',
        height : 50,
        items  : [{
            xtype : 'tbfill'
        }, {
            text    : 'Continue Shopping',
            // cls      : 'btn-shopping',
            // focusCls : 'btn-shopping',
            // overCls  : 'btn-shopping-over',
            ui      : 'white',
            handler : 'onClickBack'
        }, {
            text    : 'Clear Order',
            ui      : 'white',
            maskMsg : 'Clearing Cart',
            action  : 'clearcart'
        }, {
            text    : 'Save',
            ui      : 'white',
            action  : 'savecart',
            maskMsg : 'Saving Order'
        }, {
            text    : 'Deposit',
            action  : 'deposit',
            maskMsg : 'Setting up Deposit'
            // }, {
            //     text     : 'Checkout',
            //     action   : 'checkout',
            //     maskMsg  : 'Checking Out',
            //     cls      : 'btn-checkout',
            //     overCls  : 'btn-checkout-over',
            //     focusCls : 'btn-checkout'
        }, {
            text    : 'Release',
            ui      : 'blue',
            handler : 'onClickRelease'
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
