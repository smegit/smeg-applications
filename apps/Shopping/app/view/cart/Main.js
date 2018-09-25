Ext.define('Shopping.view.cart.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'cartmain',
    reference: 'cartcontainer',
    requires: [
        'Shopping.view.cart.List',
        'Shopping.view.cart.Form',
        'Shopping.view.cart.CartController',
        //'Shopping.view.cart.NoteList'
    ],
    controller: 'cart',
    cls: 'cart',
    bodyPadding: '10 20',
    scrollable: true,
    layout: 'anchor',
    listeners: {
        activate: 'onActivate',
        beforeactivate: 'onBeforeActivate',
        updaterepsreadonly: 'onUpdateRepsReadOnly'
    },
    defaults: {
        maxWidth: 1060,
        style: {
            'margin-left': 'auto',
            'margin-right': 'auto'
        }
    },
    tbar: {
        xtype: 'toolbar',
        ui: 'primary-dark',
        height: 50,
        layout: {
            type: 'hbox'
        },
        items: [
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                flex: 1,
                defaults: {
                    flex: 1
                },
                items: [{
                    xtype: 'combo',
                    cls: 'fld-in-header',
                    queryMode: 'local',
                    flex: 0,
                    width: 305,
                    height: 32,
                    labelWidth: 95,
                    valueField: 'STKCOD',
                    displayField: 'STKDSC',
                    reference: 'stocklocs',
                    fieldLabel: 'Stock Location',
                    forceSelection: true,
                    listeners: {
                        select: 'onSelectStockLocation'
                    },
                    bind: {
                        store: '{StockLocations}',
                        value: '{STKLOC}'
                    }
                }]
            }, '->', {
                text: 'Continue Shopping',
                ui: 'white',
                handler: 'onClickBack'
            }, {
                text: 'Exit Order',
                maskMsg: 'Exiting Order',
                ui: 'white',
                listeners: {
                    click: 'onClickClear'
                }
            }, {
                text: 'Save',
                ui: 'white',
                maskMsg: 'Saving Order',
                listeners: {
                    click: 'onClickSave'
                }
            }, {
                text: 'Deposit',
                ui: 'white',
                maskMsg: 'Setting up Deposit',
                listeners: {
                    click: 'onClickDeposit'
                }
            }, {
                text: 'Process',
                reference: 'checkoutButton',
                ui: 'blue',
                maskMsg: 'Preparing to process order',
                handler: 'onClickRelease'
            }]
    },
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: me.buildItems(me.cartOptions)
        });
        me.callParent(arguments);
    },

    buildItems: function (opts) {
        return [{
            xtype: 'cartlist',
            bind: {
                store: '{cartItems}'
            },
            minHeight: 80
        }, {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            bind: {
                hidden: '{hideOrdKey}'
            },
            items: [{
                xtype: 'component',
                bind: {
                    html: '{orderNotesInfo}'
                },
                listeners: {
                    el: {
                        click: 'onClickNotes'
                    }
                }
            }, {
                xtype: 'component',
                flex: 1
            }, {
                xtype: 'component',
                bind: {
                    hidden: '{!orderHasPayments}',
                    html: '{orderPaymentsInfo}'
                },
                listeners: {
                    el: {
                        click: 'onClickViewPayments'
                    }
                }
            }]
        }, {
            xtype: 'cartform',
            cartOptions: opts
        }]
    }
});
