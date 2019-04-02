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
        removeFromCart: 'onRemoveFromCart'
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
                        var onErrorReplace = '\"/Product/Images/FAB10HLR_200x200.jpg\"';
                        return "<img  src=\"" + v + "\" onerror='this.src=\"/Product/Images/FAB10HLR_200x200.jpg\"' style='height:40px'/>";
                    }
                }, {
                    text: 'Model',
                    //flex: 1,
                    width: 150,
                    dataIndex: 'MODEL'
                }, {
                    text: 'Description',
                    flex: 1,
                    dataIndex: 'PRODDESC'
                },
                {
                    text: 'Unit Price',
                    width: 120,
                    dataIndex: 'PRICE'
                },
                {
                    text: 'Quanty',
                    width: 75,
                    dataIndex: 'QUANTY',
                    editable: true,
                    editor: {
                        xtype: 'numberfield'
                    },
                }, {
                    width: 70,

                    cell: {
                        xtype: 'widgetcell',
                        widget: {
                            xtype: 'button',
                            iconCls: 'x-fa fa-ban',
                            ui: 'round',
                            bind: '{record}',
                            handler: 'onDeleteRecord'
                        }
                    }
                }]

        }, {
            xtype: 'formpanel',
            //title: 'Customer Info',
            id: 'custInfoForm',
            shadow: true,
            reference: 'custInfoFormRef',
            //height: 300,
            //layout: 'fit',
            items: [
                {
                    xtype: 'fieldset',
                    id: 'fieldset1',
                    title: 'Customer Info',
                    instructions: 'Please enter the information above.',
                    defaults: {
                        labelWidth: '35%'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'referringAgent',
                        label: 'Referring Agent',
                        placeHolder: 'Harvey Norman',
                        clearIcon: true,
                        bind: {
                            value: '{theQoute.referringAgent}'
                        },
                        listeners: {
                            focus: function (comp, e, eopts) {
                                console.info('focus called');
                                var ost = comp.element.dom.offsetTop;
                                console.info(ost);
                                this.getParent().getParent().getScrollable().scrollTo(0, 0)
                                //console.info();
                                //this.getParent().getParent().getScrollable().getScroller().scrollTo(0, ost);
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        name: 'name',
                        label: 'Name',
                        placeHolder: 'Tom Roy',
                        clearIcon: true,
                        bind: {
                            value: '{theQoute.name}'
                        }

                    },
                    {
                        xtype: 'textfield',
                        //xtype: 'combo',
                        name: 'address',
                        label: 'Address',
                        //gApiAddrType: 'baseAddressLine1',
                        clearIcon: true,
                        bind: {
                            value: '{theQoute.address}'
                        },
                        listeners: {
                            //added: 'onAfterRenderAddressSearch'
                            painted: 'onAfterRenderAddressSearch',
                            clearicontap: 'onClearAddr'
                        }
                    },


                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        //title: 'Address',

                        //defaultType: 'textfield',
                        //margin: '0 0 5 0',
                        //width: '65%',
                        items: [
                            // {
                            //     xtype: 'textfield',
                            //     name: 'street',
                            //     //label: 'Address',
                            //     //labelWidth: '35%',
                            //     //labelAlign: 'top',
                            //     placeHolder: 'Street',
                            //     margin: "0 10 0 0",
                            //     flex: 1,
                            // },

                            {
                                xtype: 'textfield',
                                name: 'suburb',
                                //label: 'Suburb',
                                placeHolder: 'Suburb',
                                margin: "0 10 0 0",
                                bind: {
                                    value: '{theQoute.suburb}'
                                },
                                //flex: 1,

                            }, {
                                xtype: 'textfield',
                                name: 'state',
                                //label: 'State',
                                placeHolder: 'State',
                                margin: "0 10 0 0",
                                bind: {
                                    value: '{theQoute.state}'
                                },
                                //flex: 1

                            }, {
                                xtype: 'textfield',
                                name: 'postCode',
                                //label: 'Post Code',
                                placeHolder: 'Post Code',
                                //margin: "0 10 0 0",
                                //flex: 1
                                bind: {
                                    value: '{theQoute.postCode}'
                                },

                            }],
                    },
                    {
                        xtype: 'emailfield',
                        name: 'email',
                        label: 'Email',
                        clearIcon: true,
                        //handler: 'onEmail'
                        bind: {
                            value: '{theQoute.email}'
                        },
                    },
                    {
                        xtype: 'textfield',
                        name: 'contactNumber',
                        label: 'Contact Number',
                        placeHolder: '0412345678',
                        clearIcon: true,
                        bind: {
                            value: '{theQoute.contactNumber}'
                        },
                    }]
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
                            text: 'Save',
                            ui: 'action',
                            handler: 'onSave'
                        },
                        {
                            text: 'Email',
                            ui: 'action',
                            handler: 'onEmail'
                        },
                        {
                            text: 'Print',
                            ui: 'action',
                            //handler: 'onSave'
                        },
                        {
                            text: 'Cancel',
                            ui: 'action',
                            handler: 'onCancel'
                        },
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
