/**
 * This view is an example list of people.
 */
Ext.define('Showroom.view.cart.Cart', {
    extend: 'Ext.Container',
    xtype: 'cart',
    reference: 'cartRef',

    requires: [
        //'Showroom.store.Personnel'
        //'Showroom.view.product.ProductController'
        'Ext.form.FieldContainer',
        'Ext.form.FieldSet',
        //'Ext.form.ContainerField',
        'Ext.field.Number',
        'Ext.field.Spinner',
        'Ext.field.Password',
        'Ext.field.Email',
        'Ext.field.Url',
        'Ext.field.DatePicker',
        'Ext.field.Select',
        'Ext.field.Hidden',
        'Ext.field.Radio',
        'Ext.field.*',
        'Ext.form.Panel',
        //'Ext.grid.plugin.CellEditing',
        'Ext.grid.plugin.Editable',
        //'Ext.field.ComboBox'
        'Ext.grid.*'
    ],

    //title: 'Cart',
    //scrollable: true,
    controller: 'cart',
    viewModel: 'cart',
    //height: 900,
    //autoScroll: true,


    listeners: {
        addToCart: 'onAddToCart',
        removeFromCart: 'onRemoveFromCart',
        cancelCart: 'onCancel'
    },

    //height: '200',
    items: [
        {
            xtype: 'grid',
            title: "You've selected",

            plugins: [{
                type: 'grideditable'
            }],
            bind: {
                //title: '{titleText}',
                store: '{selectedProds}',
            },
            emptyText: 'No products being selected yet',
            //flex: 1,
            height: 300,
            cls: 'cart-list',
            striped: false,
            columns: [
                {
                    text: '',
                    //minWidth: 0,
                    //maxWidth: 50,
                    width: 100,
                    cls: 'img-column',
                    dataIndex: 'SMALLPIC',
                    align: 'center',
                    sortable: false,
                    cell: {
                        encodeHtml: false,
                        cls: 'img-cell'
                    },
                    padding: 0,
                    renderer: function (v, record, dataIndex, cell, column) {
                        //return '<img src="' + v + '" style="height:40px" / >';
                        console.info(v);
                        var onErrorReplace = '\"/Product/Images/FAB10HLR_200x200.jpg\"';
                        return "<img  src=\"" + v + "\" onerror='this.src=\"/Product/Images/missing.png\"' style='height:40px'/>";
                    }
                }, {
                    text: 'Model',
                    //flex: 1,
                    width: 100,
                    dataIndex: 'SBITM'
                }, {
                    text: 'Description',
                    flex: 1,
                    dataIndex: 'I1IDSC'
                },
                {
                    text: 'Unit Price',
                    width: 100,
                    dataIndex: 'SBUPRC',
                    align: 'right',
                    renderer: function (value, record) {
                        return Ext.util.Format.usMoney(value);
                    }
                },
                {
                    text: 'Quantity',
                    width: 100,
                    //padding: 10,
                    dataIndex: 'SBQTYO',
                    align: 'right',
                    editable: true,
                    editor: {
                        xtype: 'numberfield'
                    },
                },
                // {
                //     width: 70,

                //     cell: {
                //         xtype: 'widgetcell',
                //         widget: {
                //             xtype: 'button',
                //             iconCls: 'x-fa fa-ban',
                //             ui: 'round',
                //             bind: '{record}',
                //             handler: 'onDeleteRecord'
                //         }
                //     }
                // }
            ]

        }, {
            xtype: 'formpanel',
            //title: 'Customer Info',
            id: 'custInfoForm',
            shadow: true,
            reference: 'custInfoFormRef',
            height: 400,
            //layout: 'fit',
            defaults: {
                msgTarget: 'under'
            },
            relative: true,
            items: [
                {
                    xtype: 'fieldset',
                    id: 'fieldset1',
                    //title: 'Customer Info',
                    //instructions: 'Please enter the information above.',
                    defaults: {
                        labelWidth: '35%'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'SAORDKEY',
                            hidden: true,
                            bind: {
                                value: '{theQoute.SAORDKEY}'
                            }

                        },

                        {
                            xtype: 'textfield',
                            name: 'SACSTNAM',
                            autoComplete: false,
                            label: 'Name',
                            //placeHolder: 'Tom Roy',
                            allowBlank: false,
                            required: true,
                            msgTarget: 'under',
                            clearIcon: true,
                            bind: {
                                value: '{theQoute.SACSTNAM}'
                            },
                        },
                        // {
                        //     xtype: 'textfield',
                        //     //xtype: 'combo',
                        //     name: 'SACSTST1',
                        //     label: 'Address',
                        //     placeHolder: 'Address Line 1',
                        //     //gApiAddrType: 'baseAddressLine1',
                        //     clearIcon: true,
                        //     bind: {
                        //         value: '{theQoute.SACSTST1}'
                        //     },
                        //     listeners: {
                        //         //added: 'onAfterRenderAddressSearch'
                        //         painted: 'onAfterRenderAddressSearch',
                        //         clearicontap: 'onClearAddr'
                        //     }
                        // },

                        {
                            xtype: 'textfield',
                            name: 'SACSTST1',
                            label: 'Address',
                            id: 'searchAddressField',
                            bind: {
                                value: '{theQoute.SACSTST1}'
                            },
                            //relative: true,
                            //placeHolder: 'Harvey Norman',
                            clearIcon: true,
                            listeners: {
                                focus: function (cmp, e, eopts) {
                                    cmp.select();
                                    // console.info('focus called');
                                    // var ost = comp.element.dom.offsetTop;
                                    // console.info(ost);
                                    // this.getParent().getParent().getScrollable().scrollTo(0, 0)
                                    //console.info();
                                    //this.getParent().getParent().getScrollable().getScroller().scrollTo(0, ost);
                                },
                                blur: 'onSearchAddressBlur',
                                keyup: 'onSearchAddressTap',
                                clearicontap: 'onClearAddr'
                            }
                        },

                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                //pack: 'end'
                            },
                            cls: 'address-container2',
                            margin: "0 0 5 0",
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'SACSTST2',
                                    //label: 'Address',
                                    //labelWidth: '35%',
                                    //labelAlign: 'top',
                                    bind: {
                                        value: '{theQoute.SACSTST2}'
                                    },
                                    placeHolder: 'Address Line 2',
                                    //margin: "0 10 0 0",
                                    flex: 1,
                                },
                            ]
                        },

                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                //pack: 'end'
                            },
                            cls: 'address-container',
                            //title: 'Address',

                            //defaultType: 'textfield',
                            //margin: '0 0 5 0',
                            //width: '65%',
                            items: [
                                // {
                                //     xtype: 'textfield',
                                //     name: 'address2',
                                //     //label: 'Address',
                                //     //labelWidth: '35%',
                                //     //labelAlign: 'top',
                                //     placeHolder: 'Address Line 2',
                                //     margin: "0 10 0 0",
                                //     flex: 1,
                                // },

                                {
                                    xtype: 'textfield',
                                    name: 'SACSTCTY',
                                    autoComplete: false,
                                    //label: 'Suburb',
                                    placeHolder: 'Suburb',
                                    clearIcon: false,
                                    margin: "0 10 0 0",
                                    bind: {
                                        value: '{theQoute.SACSTCTY}'
                                    },
                                    flex: 1,

                                }, {
                                    xtype: 'textfield',
                                    name: 'SACSTSTA',
                                    autoComplete: false,
                                    //label: 'State',
                                    placeHolder: 'State',
                                    clearIcon: false,
                                    margin: "0 10 0 0",
                                    bind: {
                                        value: '{theQoute.SACSTSTA}'
                                    },
                                    flex: 1

                                }, {
                                    xtype: 'textfield',
                                    name: 'SACSTPST',
                                    autoComplete: false,
                                    //label: 'Post Code',
                                    placeHolder: 'Post Code',
                                    clearIcon: false,
                                    margin: "0 10 0 0",
                                    flex: 1,
                                    bind: {
                                        value: '{theQoute.SACSTPST}'
                                    },

                                },
                                {
                                    xtype: 'textfield',
                                    name: 'SACSTCOU',
                                    autoComplete: false,
                                    //label: 'Post Code',
                                    placeHolder: 'Country',
                                    clearIcon: false,
                                    //margin: "0 10 0 0",
                                    flex: 1,
                                    bind: {
                                        value: '{theQoute.SACSTCOU}'
                                    },

                                }],
                        },
                        {
                            xtype: 'emailfield',
                            name: 'SACSTEML',
                            autoComplete: false,
                            label: 'Email',
                            //clearIcon: true,
                            //handler: 'onEmail'
                            //placeHolder: 'email@email.com',
                            bind: {
                                value: '{theQoute.SACSTEML}'
                            },
                        },
                        {
                            xtype: 'textfield',
                            name: 'SACSTPH1',
                            label: 'Contact Number',
                            autoComplete: false,
                            //placeHolder: '0412345678',
                            clearIcon: true,
                            bind: {
                                value: '{theQoute.SACSTPH1}'
                            },
                        },
                        {
                            xtype: 'textfield',
                            name: 'SARFAG',
                            label: 'Referring Agent',
                            autoComplete: false,
                            //placeHolder: 'Harvey Norman',
                            clearIcon: true,
                            bind: {
                                value: '{theQoute.SARFAG}'
                            },
                            listeners: {
                                focus: function (comp, e, eopts) {
                                    // console.info('focus called');
                                    // var ost = comp.element.dom.offsetTop;
                                    // console.info(ost);
                                    // this.getParent().getParent().getScrollable().scrollTo(0, 0)
                                    //console.info();
                                    //this.getParent().getParent().getScrollable().getScroller().scrollTo(0, ost);
                                }
                            }
                        },
                        // {
                        //     xtype: 'textfield',
                        //     name: 'searchAddress',
                        //     label: 'Search Address',
                        //     id: 'searchAddressField',
                        //     //relative: true,
                        //     //placeHolder: 'Harvey Norman',
                        //     clearIcon: true,
                        //     listeners: {
                        //         focus: function (cmp, e, eopts) {
                        //             cmp.select();
                        //             // console.info('focus called');
                        //             // var ost = comp.element.dom.offsetTop;
                        //             // console.info(ost);
                        //             // this.getParent().getParent().getScrollable().scrollTo(0, 0)
                        //             //console.info();
                        //             //this.getParent().getParent().getScrollable().getScroller().scrollTo(0, ost);
                        //         },
                        //         keyup: 'onSearchAddressTap',
                        //     }
                        // },
                        {
                            xtype: 'textfield',
                            name: 'searchAddressDisplay',
                            label: 'Search Address',
                            id: 'searchAddressDisplay',
                            //floated: true
                            //relative: true,
                            //placeHolder: 'Harvey Norman',
                            hidden: true,

                        },


                        // {
                        //     xtype: 'selectfield',
                        //     name: 'rank',
                        //     label: 'Rank',
                        //     options: [
                        //         {
                        //             text: 'Master',
                        //             value: 'master'
                        //         },
                        //         {
                        //             text: 'Journeyman',
                        //             value: 'journeyman'
                        //         },
                        //         {
                        //             text: 'Apprentice',
                        //             value: 'apprentice'
                        //         }
                        //     ]
                        // },
                    ]
                },
                {
                    xtype: 'container',
                    defaults: {
                        xtype: 'button',
                        style: 'margin: 1em',
                        flex: 1
                    },
                    layout: {
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'spacer'
                        },
                        {
                            text: 'Save',
                            ui: 'grey',
                            handler: 'onSave'
                        },
                        {
                            text: 'Cancel',
                            ui: 'grey',
                            handler: 'onCancel'
                        }, {
                            xtype: 'spacer'
                        }
                        // {
                        //     text: 'Email',
                        //     ui: 'action',
                        //     handler: 'onEmail'
                        // },
                        // {
                        //     text: 'Print',
                        //     ui: 'action',
                        //     //handler: 'onSave'
                        // },
                    ]
                }]


        },
    ]



    // columns: [
    //     { text: 'model', dataIndex: 'MODEL', width: 100 },
    //     // { text: 'Email', dataIndex: 'email', width: 230 },
    //     // { text: 'Phone', dataIndex: 'phone', width: 150 }
    // ],
});
