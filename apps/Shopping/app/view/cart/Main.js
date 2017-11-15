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
    listeners     : {
        activate           : 'onActivate',
        beforeactivate     : 'onBeforeActivate',
        updaterepsreadonly : 'onUpdateRepsReadOnly'
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
                        value : '{STKDFT}'
                    }
                }]
            }, {
                text    : 'Continue Shopping',
                ui      : 'white',
                handler : 'onClickBack'
                // }, {
                //     text      : 'Clear Order',
                //     maskMsg   : 'Clearing Cart',
                //     ui        : 'white',
                //     listeners : {
                //         click : 'onClickClear'
                //     }
                // }, {
                //     text      : 'Save',
                //     ui        : 'white',
                //     maskMsg   : 'Saving Order',
                //     listeners : {
                //         click : 'onClickSave'
                //     }
            }, {
                text      : 'Deposit',
                ui        : 'white',
                maskMsg   : 'Setting up Deposit',
                listeners : {
                    click : 'onClickDeposit'
                }
            }, {
                text    : 'Release',
                ui      : 'blue',
                maskMsg : 'Setting up Release',
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
            text      : 'Clear Order',
            maskMsg   : 'Clearing Cart',
            ui        : 'white',
            listeners : {
                click : 'onClickClear'
            }
        }, {
            text      : 'Save',
            ui        : 'white',
            maskMsg   : 'Saving Order',
            listeners : {
                click : 'onClickSave'
            }
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
            bind      : {
                store : '{cartItems}'
            },
            minHeight : 80
        }, {
            xtype       : 'cartform',
            cartOptions : opts
        }]
    }
});
