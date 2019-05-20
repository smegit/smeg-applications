Ext.define('OrderMaint.view.main.OrderView', {
    extend: 'Ext.container.Container',
    xtype: 'orderView',
    requires: [
        'Ext.grid.feature.Summary',
        'OrderMaint.view.main.Note'
    ],
    itemId: 'orderViewId',
    width: '95%',
    style: 'margin: auto',
    //region: 'center',
    //data: this.data,
    buildItems: function () {
        var me = this,
            data = me.config.data,
            cartHdr = data.CartHdr[0];
        return [{
            xtype: 'gridpanel',
            title: me.buildTitleTextData(),
            titleAlign: 'center',
            cls: 'item-list',
            //ui: 'background',
            //padding: '10 0',
            border: true,
            margin: '0 10 0 0',
            // bind: {
            //     store: '{data.CartDtl}'
            // },
            store: Ext.create('Ext.data.Store', {
                data: me.buildStoreData()
            }),
            columns: [
                // {
                //     text: '',
                //     //minWidth: 0,
                //     //maxWidth: 50,
                //     width: 100,
                //     cls: 'img-column',
                //     dataIndex: 'SMALLPIC',
                //     align: 'center',
                //     sortable: false,
                //     cell: {
                //         encodeHtml: false,
                //         cls: 'img-cell'
                //     },
                //     padding: 0,
                //     renderer: function (v, record, dataIndex, cell, column) {
                //         //return '<img src="' + v + '" style="height:40px" / >';
                //         console.info(v);
                //         var onErrorReplace = '\"/Product/Images/FAB10HLR_200x200.jpg\"';
                //         return "<img  src=\"" + v + "\" onerror='this.src=\"/Product/Images/missing.png\"' style='height:40px'/>";
                //     }
                // },
                {
                    text: 'Item',
                    flex: 1,
                    dataIndex: 'OBITM',
                    // renderer: function (v, meta) {
                    //     meta.tdCls += ' cart-list-prd-detail';
                    //     return v;
                    // }
                }, {
                    text: 'Description',
                    cellWrap: true,
                    dataIndex: 'I1IDSC',
                    flex: 2,
                    // renderer: function (v, meta, record) {
                    //     // console.info(v);
                    //     // console.info(record);
                    //     // console.info(record.getData().plain_txt);
                    //     meta.tdCls += ' cart-list-prd-detail';
                    //     return v + '<p style="color:red;margin:auto">' + record.getData().plain_txt + '</p>';
                    // }
                },
                {
                    text: 'Order',
                    align: 'right',
                    dataIndex: 'OBQTYO',
                    flex: 1,

                },
                {
                    text: 'Delivered',
                    align: 'right',
                    dataIndex: 'OBQTYD',
                    flex: 1,

                },
                {
                    text: 'Price',
                    align: 'right',
                    dataIndex: 'OBUPRC',
                    flex: 1,

                },
                {
                    text: 'Sub Total',
                    align: 'right',
                    dataIndex: 'OBTOTA',
                    flex: 1,

                },
                {
                    text: '',
                    width: 30
                }
            ]
        },
        // {
        //     xtype: 'container',
        //     // height: 400,
        //     // width: 400,
        //     margin: 'auto',
        //     width: '40%',
        //     flex: 1,
        //     items: [{
        //         xtype: 'gridpanel',
        //         padding: '10 0',
        //         border: true,
        //         //margin: '0 10 0 0',
        //         //width: '95%',
        //         cls: 'payment-component',
        //         emptyText: 'No Payment Received.',
        //         store: Ext.create('Ext.data.Store', {
        //             data: me.buildPaymentStoreData()
        //         }),
        //         hidden: me.hidePaymentHistory(),
        //         features: [{
        //             id: 'paymentSummary',
        //             ftype: 'summary',
        //             showSummaryRow: true,
        //         }],
        //         columns: [
        //             // {
        //             //     text: 'Label',
        //             //     dataIndex: 'label',
        //             //     sortable: false,

        //             // },
        //             {
        //                 text: 'Payment Detail',
        //                 flex: 1,
        //                 dataIndex: 'NOTE',
        //                 sortable: false,
        //                 menuDisabled: true
        //             },
        //             {
        //                 text: 'Amount',
        //                 align: 'right',
        //                 dataIndex: 'AMOUNT',
        //                 flex: 1,
        //                 sortable: false,
        //                 menuDisabled: true,
        //                 cls: 'gridTitle',
        //                 renderer: function (value, meta) {
        //                     meta.tdCls += ' cart-list-prd-detail';
        //                     return Ext.util.Format.number(value, '0,0.00');
        //                 },
        //                 summaryType: 'sum',
        //                 summaryRenderer: function (value) {
        //                     console.info(this.up('orderView'));
        //                     var data = this.up('orderView').config.data;

        //                     if (data.payments.length > 0) {
        //                         var totalPaid = data.TOTALPAID,
        //                             balance = data.CartHdr[0].OAORDTOT - totalPaid;
        //                         return Ext.String.format('<b>BALANCE: {0} </b> <b>Paid: {1}</b>', Ext.util.Format.currency(balance), Ext.util.Format.currency(totalPaid));
        //                     } else {
        //                         return;
        //                     }
        //                 }
        //             },
        //             // {
        //             //     text: '',
        //             //     maxWidth: 30
        //             // }
        //         ],
        //     }]
        // },
        {
            xtype: 'gridpanel',
            padding: '10 0',
            border: true,
            margin: '0 10 0 0',
            ui: 'background',
            emptyText: 'No Payment Received.',
            store: Ext.create('Ext.data.Store', {
                data: me.buildPaymentStoreData()
            }),
            hidden: me.hidePaymentHistory(),
            features: [{
                id: 'paymentSummary',
                ftype: 'summary',
                showSummaryRow: true,
            }],
            columns: [
                // {
                //     text: 'Label',
                //     dataIndex: 'label',
                //     sortable: false,

                // },
                {
                    text: 'Payment Detail',
                    flex: 1,
                    dataIndex: 'NOTE',
                    sortable: false,
                    menuDisabled: true
                },
                {
                    text: 'Amount',
                    align: 'right',
                    dataIndex: 'AMOUNT',
                    flex: 1,
                    sortable: false,
                    menuDisabled: true,
                    cls: 'gridTitle',
                    renderer: function (value, meta) {
                        meta.tdCls += ' cart-list-prd-detail';
                        return Ext.util.Format.number(value, '0,0.00');
                    },
                    summaryType: 'sum',
                    summaryRenderer: function (value) {
                        console.info(this.up('orderView'));
                        var data = this.up('orderView').config.data;

                        if (data.payments.length > 0) {
                            var totalPaid = data.TOTALPAID,
                                balance = data.CartHdr[0].OAORDTOT - totalPaid;
                            return Ext.String.format('<b>BALANCE: {0} </b> <b>Paid: {1}</b>', Ext.util.Format.currency(balance), Ext.util.Format.currency(totalPaid));
                        } else {
                            return;
                        }
                    }
                },
                {
                    text: '',
                    width: 30
                }]

        },
        {
            xtype: 'fieldset',
            title: 'Order Info',
            defaultType: 'textfield',
            //cls: 'cart-fieldset',
            itemId: 'orderInfoFieldSet',
            margin: '0 10 0 0',
            //padding: '2 20 16 20',
            layout: 'hbox',

            defaults: {
                border: true,
                xtype: 'panel',
                flex: 1,
                layout: 'anchor',
                width: '100%',
                editable: false
            },
            fieldDefaults: {
                labelAlign: 'top',
                msgTarget: 'side'
            },

            items: [
                {
                    xtype: 'textfield',
                    margin: '0 32 0 0',
                    // labelWidth: 75,
                    // maxWidth: 160,
                    fieldLabel: 'Reference',
                    value: cartHdr.OACSTREF,
                    anchor: '-5',
                },
                {
                    xtype: 'textfield',
                    margin: '0 32 0 0',
                    // labelWidth: 75,
                    // maxWidth: 160,
                    fieldLabel: 'Sales',
                    value: cartHdr.OAREP,
                    anchor: '-5',
                },
                {
                    xtype: 'textfield',
                    margin: '0 32 0 0',
                    // labelWidth: 75,
                    // maxWidth: 160,
                    fieldLabel: 'Request Date',
                    value: cartHdr.OADELD,
                    anchor: '-5',
                },
                {
                    xtype: 'textfield',
                    margin: '0 32 0 0',
                    // labelWidth: 75,
                    // maxWidth: 160,
                    fieldLabel: 'Stock Location',
                    value: data.OASTKLOC,
                    anchor: '-5',
                },
            ]

        },
        {
            xtype: 'fieldset',
            title: 'Customer Info',
            defaultType: 'textfield',
            //cls: 'cart-fieldset',
            itemId: 'custInfoFieldSet',
            margin: '0 10 0 0',
            //padding: '2 20 16 20',
            layout: 'hbox',
            collapsible: true,
            collapsed: me.collapseCustInfo(),
            height: 150,
            defaults: {
                border: true,
                xtype: 'panel',
                flex: 1,
                layout: 'anchor',
                width: '100%',
                editable: false,
            },
            fieldDefaults: {
                labelAlign: 'top',
                msgTarget: 'side',
                editable: false,
                maxWidth: 400,
            },

            items: [
                {
                    xtype: 'textfield',
                    margin: '0 32 0 0',
                    // labelWidth: 75,
                    // maxWidth: 160,
                    fieldLabel: 'Name',
                    value: cartHdr.OACSTNAM,
                    anchor: '-5',
                },
                // {
                //     xtype: 'textfield',
                //     margin: '0 32 0 0',
                //     // labelWidth: 75,
                //     // maxWidth: 160,
                //     fieldLabel: 'Address1',
                //     value: cartHdr.OACSTST1,
                //     anchor: '-5',
                // },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Address',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    anchor: '-5',
                    margin: '0 32 0 0',
                    readOnly: false,
                    disabled: false,
                    defaults: {
                        xtype: 'textfield',
                        hideLabel: true,
                        // readOnly: me.release,
                        // disabled: me.release,
                        flex: 1,
                        editable: false,
                    },
                    items: [{
                        // name: 'OACSTPH1',
                        // allowBlank: false,
                        margin: '0 8 0 0',
                        value: cartHdr.OACSTST1
                    }, {
                        //name: 'OACSTPH2',
                        value: cartHdr.OACSTST2
                    }]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'City/States/Postcode/Country',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    anchor: '-5',
                    margin: '0 32 0 0',
                    readOnly: false,
                    disabled: false,
                    defaults: {
                        xtype: 'textfield',
                        hideLabel: true,
                        // readOnly: me.release,
                        // disabled: me.release,
                        flex: 1,
                        editable: false,
                    },
                    items: [{
                        // name: 'OACSTPH1',
                        // allowBlank: false,
                        margin: '0 8 0 0',
                        value: cartHdr.OACSTCTY
                    }, {
                        //name: 'OACSTPH2',
                        margin: '0 8 0 0',
                        value: cartHdr.OACSTSTA
                    },
                    {
                        //name: 'OACSTPH2',
                        margin: '0 8 0 0',
                        value: cartHdr.OACSTPST
                    },
                    {
                        //name: 'OACSTPH2',
                        value: cartHdr.OACSTCOU
                    }]
                },
                // {
                //     xtype: 'textfield',
                //     margin: '0 32 0 0',
                //     // labelWidth: 75,
                //     // maxWidth: 160,
                //     fieldLabel: 'Address2',
                //     value: cartHdr.OACSTST2,
                //     anchor: '-5',
                // },
                // {
                //     xtype: 'textfield',
                //     margin: '0 32 0 0',
                //     // labelWidth: 75,
                //     // maxWidth: 160,
                //     fieldLabel: 'Address2',
                //     value: cartHdr.OACSTST2,
                //     anchor: '-5',
                // },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Phone',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    anchor: '-5',
                    readOnly: false,
                    disabled: false,
                    margin: '0 32 0 0',
                    defaults: {
                        xtype: 'textfield',
                        hideLabel: true,
                        // readOnly: me.release,
                        // disabled: me.release,
                        flex: 1,
                        editable: false,
                    },
                    items: [{
                        name: 'OACSTPH1',
                        allowBlank: false,
                        margin: '0 8 0 0',
                        value: cartHdr.OACSTPH1
                    }, {
                        name: 'OACSTPH2',
                        value: cartHdr.OACSTPH2
                    }]
                },
                {
                    xtype: 'textfield',
                    margin: '0 32 0 0',
                    //padding: '10',
                    // labelWidth: 75,
                    // maxWidth: 160,
                    fieldLabel: 'Email',
                    value: cartHdr.OACSTEML,
                    anchor: '-5',
                },
            ]

        },
        /*------------------Deliver Address -----------------*/
        {
            xtype: 'fieldset',
            title: 'Delivery Address',
            defaultType: 'textfield',
            //cls: 'cart-fieldset',
            itemId: 'deliveryFieldset',
            margin: '0 10 0 0',
            //padding: '2 20 16 20',
            layout: 'hbox',
            collapsible: true,
            collapsed: true,

            defaults: {
                border: true,
                xtype: 'panel',
                flex: 1,
                layout: 'anchor',
                editable: false,
            },
            fieldDefaults: {
                labelAlign: 'top',
                msgTarget: 'side',
                editable: false,
            },

            items: [
                {
                    xtype: 'textfield',
                    margin: '0 32 0 0',
                    // labelWidth: 75,
                    // maxWidth: 160,
                    fieldLabel: 'Name',
                    value: cartHdr.OADELNAM,
                    anchor: '-5',
                },
                // {
                //     xtype: 'textfield',
                //     margin: '0 32 0 0',
                //     // labelWidth: 75,
                //     // maxWidth: 160,
                //     fieldLabel: 'Address1',
                //     value: cartHdr.OACSTST1,
                //     anchor: '-5',
                // },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Address',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    margin: '0 32 0 0',
                    readOnly: false,
                    disabled: false,
                    defaults: {
                        xtype: 'textfield',
                        hideLabel: true,
                        // readOnly: me.release,
                        // disabled: me.release,
                        flex: 1,
                        editable: false,
                    },
                    items: [{
                        // name: 'OACSTPH1',
                        // allowBlank: false,
                        margin: '0 8 0 0',
                        value: cartHdr.OADELST1
                    }, {
                        //name: 'OACSTPH2',
                        value: cartHdr.OADELST2
                    }]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'City/States/Postcode/Country',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    margin: '0 32 0 0',
                    readOnly: false,
                    disabled: false,
                    defaults: {
                        xtype: 'textfield',
                        hideLabel: true,
                        // readOnly: me.release,
                        // disabled: me.release,
                        flex: 1,
                        editable: false,
                    },
                    items: [{
                        // name: 'OACSTPH1',
                        // allowBlank: false,
                        margin: '0 8 0 0',
                        value: cartHdr.OADELCTY
                    }, {
                        //name: 'OACSTPH2',
                        margin: '0 8 0 0',
                        value: cartHdr.OADELSTA
                    },
                    {
                        //name: 'OACSTPH2',
                        margin: '0 8 0 0',
                        value: cartHdr.OADELPST
                    },
                    {
                        //name: 'OACSTPH2',
                        value: cartHdr.OADELCOU
                    }]
                },
                // {
                //     xtype: 'textfield',
                //     margin: '0 32 0 0',
                //     // labelWidth: 75,
                //     // maxWidth: 160,
                //     fieldLabel: 'Address2',
                //     value: cartHdr.OACSTST2,
                //     anchor: '-5',
                // },
                // {
                //     xtype: 'textfield',
                //     margin: '0 32 0 0',
                //     // labelWidth: 75,
                //     // maxWidth: 160,
                //     fieldLabel: 'Address2',
                //     value: cartHdr.OACSTST2,
                //     anchor: '-5',
                // },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Phone',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    readOnly: false,
                    disabled: false,
                    margin: '0 32 0 0',
                    defaults: {
                        xtype: 'textfield',
                        hideLabel: true,
                        // readOnly: me.release,
                        // disabled: me.release,
                        flex: 1,
                        editable: false,
                    },
                    items: [{
                        name: 'OACSTPH1',
                        allowBlank: false,
                        margin: '0 8 0 0',
                        value: cartHdr.OADELPH1
                    }, {
                        name: 'OACSTPH2',
                        value: cartHdr.OADELPH2
                    }]
                },
                {
                    xtype: 'textfield',
                    margin: '0 32 0 0',
                    //padding: '10',
                    // labelWidth: 75,
                    // maxWidth: 160,
                    fieldLabel: 'Email',
                    value: cartHdr.OADELEML,
                    anchor: '-5',
                },
            ]

        },
        // {
        //     xtype: 'container',
        //     layout: {
        //         type: 'hbox',
        //         align: 'stretch'
        //     },
        //     items: [


        //         {
        //             xtype: 'fieldset',
        //             title: 'Deliver Address',
        //             defaultType: 'textfield',
        //             //cls: 'cart-fieldset',
        //             //itemId: 'custInfoFieldSet',
        //             margin: 0,
        //             //padding: '2 20 16 20',
        //             layout: 'vbox',

        //             defaults: {
        //                 border: true,
        //                 xtype: 'panel',
        //                 flex: 1,
        //                 layout: 'anchor',
        //                 editable: false,
        //             },
        //             fieldDefaults: {
        //                 labelAlign: 'left',
        //                 msgTarget: 'side',
        //                 editable: false,
        //             },

        //             items: [
        //                 {
        //                     xtype: 'textfield',
        //                     margin: '0 32 0 0',
        //                     // labelWidth: 75,
        //                     // maxWidth: 160,
        //                     fieldLabel: 'Name',
        //                     value: cartHdr.OACSTNAM,
        //                     anchor: '-5',
        //                 },
        //                 // {
        //                 //     xtype: 'textfield',
        //                 //     margin: '0 32 0 0',
        //                 //     // labelWidth: 75,
        //                 //     // maxWidth: 160,
        //                 //     fieldLabel: 'Address1',
        //                 //     value: cartHdr.OACSTST1,
        //                 //     anchor: '-5',
        //                 // },
        //                 {
        //                     xtype: 'fieldcontainer',
        //                     fieldLabel: 'Address',
        //                     layout: {
        //                         type: 'hbox',
        //                         align: 'stretch'
        //                     },
        //                     readOnly: false,
        //                     disabled: false,
        //                     defaults: {
        //                         xtype: 'textfield',
        //                         hideLabel: true,
        //                         // readOnly: me.release,
        //                         // disabled: me.release,
        //                         flex: 1,
        //                         editable: false,
        //                     },
        //                     items: [{
        //                         // name: 'OACSTPH1',
        //                         // allowBlank: false,
        //                         //margin: '0 8 0 0',
        //                         value: cartHdr.OACSTST1
        //                     }, {
        //                         //name: 'OACSTPH2',
        //                         value: cartHdr.OACSTST2
        //                     }]
        //                 },
        //                 {
        //                     xtype: 'fieldcontainer',
        //                     fieldLabel: 'Address',
        //                     layout: {
        //                         type: 'hbox',
        //                         align: 'stretch'
        //                     },
        //                     readOnly: false,
        //                     disabled: false,
        //                     defaults: {
        //                         xtype: 'textfield',
        //                         hideLabel: true,
        //                         // readOnly: me.release,
        //                         // disabled: me.release,
        //                         flex: 1,
        //                         editable: false,
        //                     },
        //                     items: [{
        //                         // name: 'OACSTPH1',
        //                         // allowBlank: false,
        //                         //margin: '0 8 0 0',
        //                         value: cartHdr.OACSTCTY
        //                     }, {
        //                         //name: 'OACSTPH2',
        //                         value: cartHdr.OACSTSTA
        //                     },
        //                     {
        //                         //name: 'OACSTPH2',
        //                         value: cartHdr.OACSTPST
        //                     },
        //                     {
        //                         //name: 'OACSTPH2',
        //                         value: cartHdr.OACSTCOU
        //                     }]
        //                 },
        //                 // {
        //                 //     xtype: 'textfield',
        //                 //     margin: '0 32 0 0',
        //                 //     // labelWidth: 75,
        //                 //     // maxWidth: 160,
        //                 //     fieldLabel: 'Address2',
        //                 //     value: cartHdr.OACSTST2,
        //                 //     anchor: '-5',
        //                 // },
        //                 {
        //                     xtype: 'textfield',
        //                     margin: '0 32 0 0',
        //                     // labelWidth: 75,
        //                     // maxWidth: 160,
        //                     fieldLabel: 'Address2',
        //                     value: cartHdr.OACSTST2,
        //                     anchor: '-5',
        //                 },
        //                 // {
        //                 //     xtype: 'fieldcontainer',
        //                 //     fieldLabel: 'Phone',
        //                 //     layout: {
        //                 //         type: 'hbox',
        //                 //         align: 'stretch'
        //                 //     },
        //                 //     readOnly: false,
        //                 //     disabled: false,
        //                 //     defaults: {
        //                 //         xtype: 'textfield',
        //                 //         hideLabel: true,
        //                 //         // readOnly: me.release,
        //                 //         // disabled: me.release,
        //                 //         flex: 1,
        //                 //         editable: false,
        //                 //     },
        //                 //     items: [{
        //                 //         name: 'OACSTPH1',
        //                 //         allowBlank: false,
        //                 //         margin: '0 8 0 0',
        //                 //         value: cartHdr.OACSTPH1
        //                 //     }, {
        //                 //         name: 'OACSTPH2',
        //                 //         value: cartHdr.OACSTPH2
        //                 //     }]
        //                 // }
        //             ]

        //         },


        //     ]

        // },

        /*----------------- Special Instructions ----------------*/
        {
            xtype: 'fieldset',
            title: 'Speical Instructions',
            defaultType: 'textfield',
            //cls: 'cart-fieldset',
            itemId: 'speicalInstructionFieldset',
            margin: '0 10 0 0',
            //padding: '2 20 16 20',
            layout: 'hbox',
            collapsible: true,
            collapsed: true,
            defaults: {
                border: true,
                xtype: 'panel',
                flex: 1,
                layout: 'anchor',
                editable: false,
            },
            items: [
                {
                    xtype: 'textareafield',
                    name: 'OASPI',
                    anchor: '100%',
                    maxLength: 160,
                    //maxLengthText: 'This field is limited to 160 characters.',
                    value: cartHdr.OASPI
                },

            ]
        },
        /*------------------ Note Grid ---------------------*/
        {
            xtype: 'expander-note',
            titleAlign: 'center',
            // width: 750,
            // height: 300,
            viewConfig: {
                preserveScrollOnRefresh: true,
                deferEmptyText: true,
                emptyText: 'No data available.'
            }
        },
        {
            xtype: 'component',

            items: [
                {
                    xtype: 'button',
                    text: 'PDF',
                    handler: 'getPDF'
                }
            ]
        },
            // {
            //     xtype: 'button',
            //     text: 'PDF',
            //     handler: 'getPDF'
            //     },
        ]
    },

    initComponent: function (view) {
        var me = this;
        console.info('initComponent called');
        console.info(view);

        Ext.apply(me, {
            items: me.buildItems(),
            // plugins: me.buildPlugins()
        });
        me.callParent(arguments);
        console.info(arguments);
    },
    buildStoreData: function () {
        var me = this;
        console.info(this);
        return this.config.data.CartDtl;
    },
    buildPaymentStoreData: function () {
        var me = this;
        console.info(this.config.data.payments);
        return this.config.data.payments;
    },
    buildTitleTextData: function () {
        var me = this;
        console.info(this);
        return 'Order: ' + this.config.data.CartHdr[0].OAORDKEY + '  Date: ' + this.config.data.CartHdr[0].OADATE;
    },
    // ifShowSummaryRow: function () {
    //     var me = this,
    //         data = this.config.data;
    //     return data.payments.length > 0 ? true : false;
    // },
    hidePaymentHistory: function () {
        var me = this,
            data = this.config.data;
        return data.payments.length > 0 ? false : true;
    },
    collapseCustInfo: function () {
        var me = this,
            data = this.config.data;
        return Ext.isEmpty(data.CartHdr[0].OACSTNAM) ? true : false;
    }
});