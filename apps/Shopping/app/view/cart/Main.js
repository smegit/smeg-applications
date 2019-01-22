Ext.define('Shopping.view.cart.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'cartmain',
    reference: 'cartcontainer',
    requires: [
        'Ext.tip.*',
        'Shopping.view.cart.List',
        'Shopping.view.cart.Form',
        'Shopping.view.cart.CartController',
        //'Shopping.view.cart.NoteList'
        'Shopping.view.cart.PaymentHistory',
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
            'margin-right': 'auto',
            'margin-top': '10px'
        }
    },
    // bbar: {
    //     xtype: 'toolbar',
    //     // ui: 'primary-dark',
    //     ui: 'light',
    //     height: 40,
    //     defaults: {
    //         xtype: 'button',
    //         margin: 5,
    //     },
    //     // layout: {
    //     //     type: 'hbox',
    //     //     align: 'middle'
    //     // },
    //     items: [
    //         // {
    //         //     xtype: 'container',
    //         //     layout: {
    //         //         type: 'hbox',
    //         //         align: 'stretch'
    //         //     },
    //         //     flex: 1,
    //         //     defaults: {
    //         //         flex: 1
    //         //     },
    //         //     items: [
    //         //         // {
    //         //         //     xtype: 'combo',
    //         //         //     cls: 'fld-in-header',
    //         //         //     queryMode: 'local',
    //         //         //     flex: 0,
    //         //         //     width: 305,
    //         //         //     height: 32,
    //         //         //     labelWidth: 95,
    //         //         //     editable: false,
    //         //         //     valueField: 'STKCOD',
    //         //         //     displayField: 'STKDSC',
    //         //         //     reference: 'stocklocs',
    //         //         //     fieldLabel: 'Stock Location',
    //         //         //     forceSelection: true,
    //         //         //     listeners: {
    //         //         //         select: 'onSelectStockLocation'
    //         //         //     },
    //         //         //     bind: {
    //         //         //         store: '{StockLocations}',
    //         //         //         value: '{STKLOC}'
    //         //         //     }
    //         //         // }
    //         //     ]
    //         // },
    //         //'->',
    //         //'->',
    //         { xtype: 'tbfill' },
    //         {
    //             text: 'Continue Shopping',
    //             ui: 'white',
    //             //ui: 'round',
    //             //ui: 'blue',
    //             handler: 'onClickBack',
    //             listeners: {
    //                 // mouseover: 'onMouseOver',
    //                 // mouseout: 'onMouseOut'
    //             }
    //         }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
    //         { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
    //         {
    //             text: 'Exit Order',
    //             maskMsg: 'Exiting Order',
    //             ui: 'white',
    //             //ui: 'blue',
    //             listeners: {
    //                 click: 'onClickClear',
    //                 // mouseover: 'onMouseOver',
    //                 // mouseout: 'onMouseOut'
    //             }
    //         }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
    //         { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },

    //         {
    //             text: 'PDF',
    //             ui: 'white',
    //             //ui: 'blue',
    //             //maskMsg: 'Saving Order',
    //             listeners: {
    //                 click: 'onClickPDF',
    //                 // mouseover: 'onMouseOver',
    //                 // mouseout: 'onMouseOut'
    //             }
    //         },

    //         { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
    //         { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
    //         // {
    //         //     text: 'Save',
    //         //     ui: 'white',
    //         //     maskMsg: 'Saving Order',
    //         //     listeners: {
    //         //         click: 'onClickSave'
    //         //     }
    //         // },
    //         {
    //             text: 'Notes',
    //             ui: 'white',
    //             //ui: 'blue',
    //             maskMsg: 'Loading Notes',
    //             listeners: {
    //                 click: 'onClickNotes1',
    //                 // mouseover: 'onMouseOver',
    //                 // mouseout: 'onMouseOut'
    //             }
    //         }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
    //         { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
    //         {
    //             xtype: 'container',
    //             layout: {
    //                 type: 'hbox',
    //                 align: 'stretch'
    //             },
    //             listeners: {
    //                 click: {
    //                     element: 'el',
    //                     fn: 'onClickDisabledBtn'
    //                 }
    //             },
    //             items: [{
    //                 xtype: 'button',
    //                 text: 'Payment2',
    //                 //ui: 'white',
    //                 disabled: false,
    //                 ui: 'blue',
    //                 reference: 'payBtn',
    //                 itemId: 'payBtnSelector',
    //                 maskMsg: 'Setting up Deposit',
    //                 //tooltip: 'Calculate your order first',
    //                 listeners: {
    //                     click: 'onClickDeposit',
    //                     //disable: 'onBtnDisable',
    //                     //mouseover: 'onMouseOver',
    //                     //mouseout: 'onMouseOut'
    //                 }
    //             }]
    //         },
    //         // {
    //         //     text: 'Payment',
    //         //     //ui: 'white',
    //         //     ui: 'blue',
    //         //     reference: 'payBtn',
    //         //     itemId: 'payBtnSelector',
    //         //     maskMsg: 'Setting up Deposit',
    //         //     //tooltip: 'Calculate your order first',
    //         //     listeners: {
    //         //         click: 'onClickDeposit',
    //         //         disable: 'onBtnDisable',
    //         //         mouseover: 'onMouseOver',
    //         //         //mouseout: 'onMouseOut'
    //         //     }
    //         // },
    //         { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
    //         { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
    //         // {
    //         //     text: 'Deliver',
    //         //     reference: 'checkoutButton',
    //         //     ui: 'blue',
    //         //     //reference: 'delBtn',
    //         //     itemId: 'chkoutBtnSelector',
    //         //     maskMsg: 'Preparing to process order',
    //         //     handler: 'onClickRelease',
    //         //     listeners: {
    //         //     }
    //         // },
    //         {
    //             xtype: 'container',
    //             layout: {
    //                 type: 'hbox',
    //                 align: 'stretch'
    //             },
    //             listeners: {
    //                 click: {
    //                     element: 'el',
    //                     fn: 'onClickDisabledBtn'
    //                 }
    //             },
    //             items: [
    //                 {
    //                     xtype: 'button',
    //                     text: 'Deliver',
    //                     reference: 'checkoutButton',
    //                     ui: 'blue',
    //                     disabled: false,
    //                     //reference: 'delBtn',
    //                     itemId: 'chkoutBtnSelector',
    //                     maskMsg: 'Preparing to process order',
    //                     handler: 'onClickRelease',
    //                     listeners: {
    //                     }
    //                 },
    //             ]
    //         },

    //         { xtype: 'tbfill' },
    //         //'', '', ''
    //         { xtype: 'tbspacer' },
    //         { xtype: 'tbspacer' },
    //         { xtype: 'tbspacer' }
    //     ]
    // },

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
        },
        // {
        //     xtype: 'container',
        //     layout: {
        //         type: 'hbox',
        //         align: 'stretch'
        //     },
        //     bind: {
        //         //hidden: '{hideOrdKey}'
        //     },
        //     items: [{
        //         xtype: 'component',
        //         bind: {
        //             html: '{orderNotesInfo}'
        //         },
        //         listeners: {
        //             el: {
        //                 click: 'onClickNotes'
        //             }
        //         }
        //     }, {
        //         xtype: 'component',
        //         flex: 1
        //     }, {
        //         xtype: 'component',
        //         bind: {
        //             hidden: '{!orderHasPayments}',
        //             html: '{orderPaymentsInfo}'
        //         },
        //         listeners: {
        //             el: {
        //                 click: 'onClickViewPayments'
        //             }
        //         }
        //     }]
        // },


        // {
        //     xtype: 'container',
        //     layout: {
        //         type: 'hbox',
        //         align: 'stretch'
        //     },
        //     items: [
        //         { xtype: 'tbfill' },
        //         {
        //             xtype: 'paymenthistory',
        //             width: '50%'
        //         },
        //     ]
        // },

        {
            xtype: 'paymenthistory'
        },
        {
            xtype: 'cartform',
            cartOptions: opts
        },




        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            padding: '10 0 10 0',
            defaults: {
                xtype: 'button'
            },
            items: [
                { xtype: 'tbfill' },
                {
                    text: 'Continue Shopping',
                    //ui: 'white',
                    //ui: 'round',
                    ui: 'blue',
                    handler: 'onClickBack',
                    listeners: {
                        // mouseover: 'onMouseOver',
                        // mouseout: 'onMouseOut'
                    }
                },

                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },

                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    listeners: {
                        click: {
                            element: 'el',
                            fn: 'onClickDisabledBtn'
                        }
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'PDF',
                            //iconCls: 'button-home-small',
                            //ui: 'white',
                            itemId: 'pdfBtnSelector',
                            reference: 'pdfBtn',
                            ui: 'blue',
                            icon: 'resources/images/file-pdf-regular.svg',
                            //maskMsg: 'Saving Order',
                            listeners: {
                                click: 'onClickPDF',
                                // mouseover: 'onMouseOver',
                                // mouseout: 'onMouseOut'
                            }
                        },
                    ]
                },

                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },

                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    listeners: {
                        click: {
                            element: 'el',
                            fn: 'onClickDisabledBtn'
                        }
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Notes',
                            //ui: 'white',
                            ui: 'blue',
                            maskMsg: 'Loading Notes',
                            itemId: 'notesBtnSelector',
                            reference: 'notesBtn',
                            listeners: {
                                click: 'onClickNotes1',
                                // mouseover: 'onMouseOver',
                                // mouseout: 'onMouseOut'
                            }
                        },
                    ]
                },
                // {
                //     text: 'PDF',
                //     //iconCls: 'button-home-small',
                //     //ui: 'white',
                //     itemId: 'pdfBtnSelector',
                //     ui: 'blue',
                //     icon: 'resources/images/file-pdf-regular.svg',
                //     //maskMsg: 'Saving Order',
                //     listeners: {
                //         click: 'onClickPDF',
                //         // mouseover: 'onMouseOver',
                //         // mouseout: 'onMouseOut'
                //     }
                // },

                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                // {
                //     text: 'Save',
                //     ui: 'white',
                //     maskMsg: 'Saving Order',
                //     listeners: {
                //         click: 'onClickSave'
                //     }
                // },



                // {
                //     text: 'Notes',
                //     //ui: 'white',
                //     ui: 'blue',
                //     maskMsg: 'Loading Notes',
                //     itemId: 'notesBtnSelector',
                //     listeners: {
                //         click: 'onClickNotes1',
                //         // mouseover: 'onMouseOver',
                //         // mouseout: 'onMouseOut'
                //     }
                // },

                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    listeners: {
                        click: {
                            element: 'el',
                            fn: 'onClickDisabledBtn'
                        }
                    },
                    items: [{
                        xtype: 'button',
                        text: 'Payment',
                        //ui: 'white',
                        disabled: false,
                        ui: 'blue',
                        reference: 'payBtn',
                        itemId: 'payBtnSelector',
                        maskMsg: 'Setting up Deposit',
                        //tooltip: 'Calculate your order first',
                        listeners: {
                            click: 'onClickDeposit',
                            //disable: 'onBtnDisable',
                            //mouseover: 'onMouseOver',
                            //mouseout: 'onMouseOut'
                        }
                    }]
                },
                // {
                //     text: 'Payment',
                //     //ui: 'white',
                //     ui: 'blue',
                //     reference: 'payBtn',
                //     itemId: 'payBtnSelector',
                //     maskMsg: 'Setting up Deposit',
                //     //tooltip: 'Calculate your order first',
                //     listeners: {
                //         click: 'onClickDeposit',
                //         disable: 'onBtnDisable',
                //         mouseover: 'onMouseOver',
                //         //mouseout: 'onMouseOut'
                //     }
                // },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                // {
                //     text: 'Deliver',
                //     reference: 'checkoutButton',
                //     ui: 'blue',
                //     //reference: 'delBtn',
                //     itemId: 'chkoutBtnSelector',
                //     maskMsg: 'Preparing to process order',
                //     handler: 'onClickRelease',
                //     listeners: {
                //     }
                // },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    listeners: {
                        click: {
                            element: 'el',
                            fn: 'onClickDisabledBtn'
                        }
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Deliver',
                            reference: 'checkoutButton',
                            ui: 'blue',
                            disabled: false,
                            //reference: 'delBtn',
                            itemId: 'chkoutBtnSelector',
                            maskMsg: 'Preparing to process order',
                            handler: 'onClickRelease',
                            listeners: {
                            }
                        },
                    ]
                },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },


                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    listeners: {
                        click: {
                            element: 'el',
                            fn: 'onClickDisabledBtn'
                        }
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Save',
                            maskMsg: 'Saving Order',
                            //ui: 'white',
                            ui: 'blue',
                            itemId: 'saveBtnSelector',
                            reference: 'saveBtn',
                            listeners: {
                                //click: 'onClickClear',
                                click: 'onClickSave'
                            }
                        }
                    ]
                },
                // {
                //     text: 'Save',
                //     maskMsg: 'Saving Order',
                //     //ui: 'white',
                //     ui: 'blue',
                //     itemId: 'saveBtnSelector',
                //     listeners: {
                //         //click: 'onClickClear',
                //         click: 'onClickSave'
                //     }
                // },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },

                {
                    xtype: 'button', text: 'Recalculate', ui: 'green',
                    //id: 'calcBtnId',
                    itemId: 'calcBtnSelector',
                    reference: 'calcBtn',
                    disabled: true,
                    listeners: {
                        click: 'onCalculateClick'
                    }
                },

                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                { xtype: 'tbspacer' }, { xtype: 'tbspacer' }, { xtype: 'tbspacer' },
                {
                    text: 'Cancel',
                    ui: 'blue',
                    listeners: {
                        //click: 'onClickClear',
                        click: 'onClickClear'
                    }
                },

                { xtype: 'tbfill' },
                //'', '', ''
                { xtype: 'tbspacer' },
                { xtype: 'tbspacer' },
                { xtype: 'tbspacer' }
            ]
        }
        ]
    }
});
