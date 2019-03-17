/**
 * This view is an example list of people.
 */
Ext.define('ShowroomApp.view.cart.Cart', {
    extend: 'Ext.panel.Panel',
    xtype: 'cart',

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

    ],

    //title: 'Cart',
    controller: 'cart',
    viewModel: 'cart',

    scrollable: 'y',

    //height: '200',
    items: [
        {
            xtype: 'grid',
            title: "You've selected",
            bind: {
                store: '{selectedProds}',
            },
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
                width: 75,
                dataIndex: 'PRICE'
            },
            {
                text: 'Quanty',
                width: 75,
                dataIndex: 'QUANTY'
            }, {
                width: 70,

                cell: {
                    tools: {
                        approve: {
                            iconCls: 'x-fa fa-check green',
                            handler: 'onApprove'
                        },
                        decline: {
                            iconCls: 'x-fa fa-ban red',
                            handler: 'onDecline',
                            weight: 1
                        }
                    }
                }
            }]

        }, {
            xtype: 'formpanel',
            //title: 'Customer Info',
            id: 'custInfoForm',
            shadow: true,

            items: [
                {
                    xtype: 'fieldset',
                    id: 'fieldset1',
                    title: 'Personal Info',
                    instructions: 'Please enter the information above.',
                    defaults: {
                        labelWidth: '35%'
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'referringAgent',
                        label: 'Referring Agent',
                        placeHolder: 'Harvey Norman',
                        clearIcon: true
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
                            scope: this,
                            // handler: function (btn) {
                            //     var fieldset1 = Ext.getCmp('fieldset1'),
                            //         fieldset2 = Ext.getCmp('fieldset2');

                            //     if (btn.hasDisabled) {
                            //         fieldset1.enable();
                            //         fieldset2.enable();
                            //         btn.hasDisabled = false;
                            //         btn.setText('Disable fields');
                            //     } else {
                            //         fieldset1.disable();
                            //         fieldset2.disable();
                            //         btn.hasDisabled = true;
                            //         btn.setText('Enable fields');
                            //     }
                            // }
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
