Ext.define('Shopping.view.cart.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'cartmain',
    reference: 'cartcontainer',
    requires: [
        'Shopping.view.cart.List',
        'Shopping.view.cart.Form',
        'Shopping.view.cart.CartController',
        //'Shopping.view.cart.NoteList'
        'Shopping.view.cart.PaymentHistory'
    ],
    controller: 'cart',
    cls: 'cart',
    bodyPadding: '10 20',
    scrollable: true,
    layout: 'anchor',
    listeners: {
        activate: 'onActivate',
        beforeactivate: 'onBeforeActivate',
        updaterepsreadonly: 'onUpdateRepsReadOnly',
        //loadInitData: 'onLoadInitData'
    },
    defaults: {
        maxWidth: 1060,
        style: {
            'margin-left': 'auto',
            'margin-right': 'auto'
        }
    },
    bbar: {
        xtype: 'toolbar',
        // ui: 'primary-dark',
        ui: 'light',
        height: 40,
        defaults: {
            xtype: 'button',
            margin: 5,
        },
        // layout: {
        //     type: 'hbox',
        //     align: 'middle'
        // },
        items: [
            // {
            //     xtype: 'container',
            //     layout: {
            //         type: 'hbox',
            //         align: 'stretch'
            //     },
            //     flex: 1,
            //     defaults: {
            //         flex: 1
            //     },
            //     items: [
            //         // {
            //         //     xtype: 'combo',
            //         //     cls: 'fld-in-header',
            //         //     queryMode: 'local',
            //         //     flex: 0,
            //         //     width: 305,
            //         //     height: 32,
            //         //     labelWidth: 95,
            //         //     editable: false,
            //         //     valueField: 'STKCOD',
            //         //     displayField: 'STKDSC',
            //         //     reference: 'stocklocs',
            //         //     fieldLabel: 'Stock Location',
            //         //     forceSelection: true,
            //         //     listeners: {
            //         //         select: 'onSelectStockLocation'
            //         //     },
            //         //     bind: {
            //         //         store: '{StockLocations}',
            //         //         value: '{STKLOC}'
            //         //     }
            //         // }
            //     ]
            // },
            //'->',
            //'->',
            { xtype: 'tbfill' },
            {
                text: 'Continue Shopping',
                ui: 'white',
                //ui: 'round',
                //ui: 'blue',
                handler: 'onClickBack',
                listeners: {
                    // mouseover: 'onMouseOver',
                    // mouseout: 'onMouseOut'
                }
            }, {
                text: 'Exit Order',
                maskMsg: 'Exiting Order',
                ui: 'white',
                //ui: 'blue',
                listeners: {
                    click: 'onClickClear',
                    // mouseover: 'onMouseOver',
                    // mouseout: 'onMouseOut'
                }
            }, {
                text: 'PDF',
                ui: 'white',
                //ui: 'blue',
                //maskMsg: 'Saving Order',
                listeners: {
                    click: 'onClickPDF',
                    // mouseover: 'onMouseOver',
                    // mouseout: 'onMouseOut'
                }
            },
            // {
            //     text: 'Save',
            //     ui: 'white',
            //     maskMsg: 'Saving Order',
            //     listeners: {
            //         click: 'onClickSave'
            //     }
            // },
            {
                text: 'Notes',
                ui: 'white',
                //ui: 'blue',
                maskMsg: 'Loading Notes',
                listeners: {
                    click: 'onClickNotes',
                    // mouseover: 'onMouseOver',
                    // mouseout: 'onMouseOut'
                }
            },
            {
                text: 'Payment',
                //ui: 'white',
                ui: 'blue',
                maskMsg: 'Setting up Deposit',
                listeners: {
                    click: 'onClickDeposit',
                    //mouseover: 'onMouseOver',
                    //mouseout: 'onMouseOut'
                }
            }, {
                text: 'Deliver',
                reference: 'checkoutButton',
                ui: 'blue',
                maskMsg: 'Preparing to process order',
                handler: 'onClickRelease',
                listeners: {
                }
            },
            //'', '', ''
            { xtype: 'tbspacer' },
            { xtype: 'tbspacer' },
            { xtype: 'tbspacer' }
        ]
    },

    // buttons: [
    //     {
    //         text: 'Continue Shopping',
    //         ui: 'white',
    //         handler: 'onClickBack'
    //     }, {
    //         text: 'Exit Order',
    //         maskMsg: 'Exiting Order',
    //         ui: 'white',
    //         listeners: {
    //             click: 'onClickClear'
    //         }
    //     }, {
    //         text: 'PDF',
    //         ui: 'white',
    //         //maskMsg: 'Saving Order',
    //         listeners: {
    //             click: 'onClickPDF'
    //         }
    //     },
    //     // {
    //     //     text: 'Save',
    //     //     ui: 'white',
    //     //     maskMsg: 'Saving Order',
    //     //     listeners: {
    //     //         click: 'onClickSave'
    //     //     }
    //     // },
    //     {
    //         text: 'Notes',
    //         ui: 'white',
    //         maskMsg: 'Loading Notes',
    //         listeners: {
    //             click: 'onClickNotes'
    //         }
    //     },
    //     {
    //         text: 'Payment',
    //         ui: 'white',
    //         maskMsg: 'Setting up Deposit',
    //         listeners: {
    //             click: 'onClickDeposit'
    //         }
    //     }, {
    //         text: 'Deliver',
    //         reference: 'checkoutButton',
    //         ui: 'blue',
    //         maskMsg: 'Preparing to process order',
    //         handler: 'onClickRelease'
    //     }
    // ],
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
                //hidden: '{hideOrdKey}'
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
        },
        {
            xtype: 'paymenthistory'
        }]
    }
});
