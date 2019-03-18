/**
 * This view is an example list of people.
 */
Ext.define('ShowroomApp.view.cart.Cart', {
    extend: 'Ext.panel.Panel',
    xtype: 'cart',
    reference: 'cartRef',

    requires: [
        //'ShowroomApp.store.Personnel'
        //'ShowroomApp.view.product.ProductController'
        'Ext.form.FieldSet',
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

    ],

    //title: 'Cart',
    controller: 'cart',
    viewModel: 'cart',

    scrollable: 'y',

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
            columns: [{
                text: 'Model',
                flex: 1,
                //width: 400,
                dataIndex: 'MODEL'
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
                        listeners: {
                            focus: function (comp, e, eopts) {
                                var ost = comp.element.dom.offsetTop;
                                console.info(ost);
                                this.getParent().getParent().getScrollable().scrollTo(0, ost)
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
                        clearIcon: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'address',
                        label: 'Address',
                        clearIcon: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'Email',
                        label: 'Email',
                        clearIcon: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'contactNumber',
                        label: 'Contact Number',
                        placeHolder: '0412345678',
                        clearIcon: true
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
                            text: 'Reset',
                            ui: 'action',
                            handler: function () {
                                Ext.getCmp('basicform').reset();
                            }
                        }
                    ]
                }]


        }
    ]



    // columns: [
    //     { text: 'model', dataIndex: 'MODEL', width: 100 },
    //     // { text: 'Email', dataIndex: 'email', width: 230 },
    //     // { text: 'Phone', dataIndex: 'phone', width: 150 }
    // ],
});
