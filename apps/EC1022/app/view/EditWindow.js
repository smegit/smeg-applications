Ext.define('EC1022.view.EditWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.editwindow',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Number',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.button.Button',
        'Ext.form.field.Checkbox'
    ],

    height: 500,
    width: 600,
    layout: 'fit',
    defaultFocus: '[name=A1USRNAM]',
    title: 'Record',
    modal: true,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    itemId: 'editwindowform',
                    scrollable: true,
                    autoScroll: true,
                    defaults: {
                        labelAlign: 'right',
                        labelWidth: 100,
                        msgTarget: 'under'
                    },
                    layout: 'auto',
                    bodyPadding: 10,
                    header: false,
                    items: [
                        {
                            xtype: 'displayfield',
                            maxLength: 10,
                            itemId: 'A1CN',
                            size: 15,
                            fieldLabel: 'AGENCY',
                            submitValue: true,
                            name: 'A1CN'
                        },
                        {
                            xtype: 'displayfield',
                            maxLength: 10,
                            itemId: 'A1USRID',
                            size: 15,
                            fieldLabel: 'USER Id',
                            submitValue: true,
                            name: 'A1USRID'
                        },
                        {
                            xtype: 'textfield',
                            graphic: true,
                            maxLength: 30,
                            enforceMaxLength: true,
                            allowBlank: false,
                            emptyText: 'Salesperson name',
                            itemId: 'A1USRNAM',
                            size: 50,
                            fieldLabel: 'NAME',
                            name: 'A1USRNAM'
                        },
                        {
                            xtype: 'textfield',
                            graphic: true,
                            vtype: 'alphanum',
                            maxLength: 30,
                            enforceMaxLength: true,
                            allowBlank: false,
                            emptyText: 'Login ID with no spaces',
                            itemId: 'A1LOGIN',
                            size: 50,
                            fieldLabel: 'LOGIN',
                            name: 'A1LOGIN'
                        },
                        {
                            xtype: 'textfield',
                            vtype: 'email',
                            maxLength: 100,
                            enforceMaxLength: true,
                            allowBlank: false,
                            itemId: 'A1USREML',
                            size: 50,
                            fieldLabel: 'EMAIL',
                            name: 'A1USREML'
                        },
                        {
                            xtype: 'textfield',
                            maxLength: 12,
                            enforceMaxLength: true,
                            itemId: 'A1USRCOD',
                            size: 18,
                            fieldLabel: 'CODE',
                            name: 'A1USRCOD'
                        },
                        {
                            xtype: 'textfield',
                            maxLength: 1,
                            enforceMaxLength: true,
                            itemId: 'A1USRSTS',
                            size: 2,
                            fieldLabel: 'STATUS',
                            name: 'A1USRSTS'
                        },
                        // {
                        //     xtype: 'displayfield',
                        //     maxLength: 1,
                        //     enforceMaxLength: true,
                        //     submitValue: true,
                        //     itemId: 'VVACTIV',
                        //     size: 2,
                        //     fieldLabel: 'PASSWORD',
                        //     name: 'VVACTIV',
                        //     renderer: function (value, field) {
                        //         console.info(value);
                        //         console.info(field);
                        //         if (!Ext.isEmpty(value)) {
                        //             console.info('in if');
                        //             //var color = (value != 1) ? 'red' : 'black';
                        //             //console.info()

                        //             if (value === '1') {
                        //                 var enableBtn = field.up().getDockedItems()[0].down('#enableBtnId');

                        //                 enableBtn.setHidden(true);
                        //                 console.info(enableBtn);
                        //             } else {
                        //                 var winForm = field.up();
                        //                 console.info(winForm);
                        //                 //winForm.setDisabled(true);
                        //                 // Disable the input
                        //                 // winForm.down('#A1USRNAM').setDisabled(true);
                        //                 // winForm.down('#A1LOGIN').setDisabled(true);
                        //                 // winForm.down('#A1USREML').setDisabled(true);
                        //                 // winForm.down('#A1USRCOD').setDisabled(true);
                        //                 // winForm.down('#A1USRSTS').setDisabled(true);
                        //                 console.info(winForm.down('#A1USRNAM'));


                        //             }
                        //             var color = (value == '1') ? 'green' : 'red',
                        //                 str = (value == '1') ? 'Enabled' : 'Disabled';
                        //             return '<span style="color:' + color + ';">' + str + '</span>';
                        //         }
                        //     }
                        // },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: 'PASSWORD',
                            //labelWidth: 100,

                            // The body area will contain three text fields, arranged
                            // horizontally, separated by draggable splitters.
                            layout: 'hbox',
                            items: [{
                                xtype: 'displayfield',
                                submitValue: true,
                                itemId: 'VVACTIV',
                                size: 2,
                                //fieldLabel: 'PASSWORD',
                                name: 'VVACTIV',
                                renderer: function (value, field) {
                                    console.info(value);
                                    console.info(field);
                                    if (!Ext.isEmpty(value)) {
                                        //console.info('in if');
                                        // if status is inactive then hide the enable button
                                        var formValues = field.up('form').getValues(),
                                            enableBtn = field.up().down('#enableBtnId');
                                        console.info(field.up('form').getValues());
                                        if (formValues.A1USRSTS == 'I') {
                                            enableBtn.setHidden(true);
                                        }

                                        if (value === '1') {
                                            enableBtn.setHidden(true);
                                            console.info(enableBtn);
                                        } else {
                                            var winForm = field.up();
                                            // console.info(winForm);
                                            // winForm.setDisabled(true);
                                            // Disable the input
                                            // winForm.down('#A1USRNAM').setDisabled(true);
                                            // winForm.down('#A1LOGIN').setDisabled(true);
                                            // winForm.down('#A1USREML').setDisabled(true);
                                            // winForm.down('#A1USRCOD').setDisabled(true);
                                            // winForm.down('#A1USRSTS').setDisabled(true);
                                            //console.info(winForm.down('#A1USRNAM'));


                                        }
                                        var color = (value == '1') ? 'green' : 'red',
                                            str = (value == '1') ? 'Enabled' : 'Disabled';
                                        return '<span style="color:' + color + ';">' + str + '</span>';
                                    }
                                }
                            }, {
                                xtype: 'button',
                                text: 'Enable',
                                itemId: 'enableBtnId',
                                reference: 'enableBtnRef',
                                minWidth: 60,
                                margin: '0 0 0 10'
                            }]
                        }

                        // {
                        //     xtype: 'fieldcontainer',
                        //     fieldLabel: 'ENABLE',
                        //     defaultType: 'checkboxfield',
                        //     items: [
                        //         {
                        //             boxLabel: 'Enable User',
                        //             name: 'VVACTIV',
                        //             inputValue: '1',
                        //             //uncheckValue: '0'
                        //         }
                        //     ]
                        // },
                        // {
                        //     xtype: 'checkbox',
                        //     maxLength: 1,
                        //     enforceMaxLength: true,
                        //     itemId: 'VVACTIV',
                        //     size: 2,
                        //     fieldLabel: 'ENABLE',
                        //     name: 'VVACTIV'
                        // }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'bottom',
                            itemId: 'editwindowtoolbar',
                            items: [
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'cancelBtnId',
                                    reference: 'cancelBtnRef',
                                    minWidth: 60,
                                    text: 'Cancel',
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'save',
                                    minWidth: 60,
                                    text: 'Save'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});