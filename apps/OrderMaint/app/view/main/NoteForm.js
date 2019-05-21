Ext.define('OrderMaint.view.main.NoteForm', {
    extend: 'Ext.form.Panel',
    requires: [
        //'Ext.form.*'
    ],
    xtype: 'noteForm',
    cls: 'note-form',
    //title: 'Note Form',
    style: "margin: 'auto'",
    layout: {
        type: 'vbox',
        alain: 'stretch'
    },
    fieldDefaults: {
        labelAlign: 'top',
        msgTarget: 'side',
        editable: false,
        //maxWidth: 400,
        margin: '10'
    },

    buttons: [
        { text: 'Save', handler: 'onSaveClick' },
        {
            text: 'Cancel',
            handler: function (btn) {
                btn.up('window').close();
            }
        }
    ],
    buildItems: function () {
        var me = this;
        console.info(me);
        return [
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    alain: 'stretch'
                },
                defaults: {
                    flex: 1
                },
                items: [{
                    xtype: 'combo',
                    fieldLabel: 'Type',
                    allowBlank: false,
                    editable: false,
                    queryMode: 'local',
                    displayField: 'NOTETYPED',
                    valueField: 'NOTETYPEC',
                    name: 'OFTYPE',
                    store: Ext.create('Ext.data.Store', {
                        data: me.buildTypeStoreData()
                    }),
                    listeners: {
                        focus: function (cmp) {
                            console.info(cmp)
                        }
                    }
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Follow Up',
                    displayField: 'NOTEACTD',
                    editable: false,
                    valueField: 'NOTEACTC',
                    reference: 'noteAction',
                    publishes: 'value',
                    name: 'OFFUPACT',
                    store: Ext.create('Ext.data.Store', {
                        data: me.buildActionStoreData()
                    }),
                    listeners: {
                        beforeselect: function (combo, record, index) {
                            // console.info(combo);
                            // console.info(record);
                            // console.info(index);
                            // console.info(record.get('NOTEACTC'));
                            var codeField = combo.up('form').down('#codeFieldId'),
                                emailField = combo.up('form').down('#emailFieldId'),
                                dateField = combo.up('form').down('#dateFieldId'),
                                noteAction = record.get('NOTEACTC');
                            // emailField.reset();
                            // dateField.reset();
                            if (noteAction == 'P') {
                                codeField.setValue('*PHONE');
                            } else {
                                codeField.setValue('');
                            }
                            // console.info(codeField);
                        }
                    }
                }, {
                    xtype: 'datefield',
                    itemId: 'dateFieldId',
                    fieldLabel: 'Date',
                    editable: false,
                    name: 'OFFUPDAT',
                    format: 'd/m/Y',
                    submitFormat: 'Y-m-d',
                    allowBlank: false,
                    bind: {
                        hidden: '{noteAction.value == null || noteAction.value == "" }',
                        disabled: '{noteAction.value == null || noteAction.value == "" }'
                    }
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Email',
                    displayField: 'EMLDSC',
                    valueField: 'EMLCOD',
                    name: 'OFFUPDET',
                    publishes: [
                        'value',
                        'rawValue',
                        'dirty'
                    ],
                    reference: 'emailField',
                    itemId: 'emailFieldId',
                    vtype: 'email',
                    allowBlank: false,
                    store: Ext.create('Ext.data.Store', {
                        data: me.buildEmailDefaultStoreData()
                    }),
                    bind: {
                        visible: '{noteAction.value == "E"}',
                        disabled: '{noteAction.value != "E"}'
                    },
                    listeners: {
                        beforeselect: function (combo, record, index) {
                            console.info(combo);
                            console.info(record);
                            console.info(index);
                            console.info(record.get('EMLCOD'));
                            var codeField = combo.up('form').down('#codeFieldId'),
                                OFFUPCOD = record.get('EMLCOD');
                            if (OFFUPCOD != '*EMAIL') {
                                Ext.apply(combo, { vtype: '' });
                            } else {
                                console.info('in email');
                                combo.selectText();
                                Ext.apply(combo, { vtype: 'email' });
                                codeField.setValue('*EMAIL');
                                //combo.selectText();
                            }
                            console.info(codeField);
                        },
                        select: function (combo, record, index) {
                            var OFFUPCOD = record.get('EMLCOD');
                            if (OFFUPCOD == '*EMAIL') {
                                combo.selectText();
                            }
                        }
                    }

                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Phone',
                    allowBlank: false,
                    name: 'OFFUPDET',
                    regex: /^\d+$/,
                    bind: {
                        visible: '{noteAction.value == "P"}',
                        disabled: '{noteAction.value != "P"}',
                    },
                }, {
                    xtype: 'checkboxfield',
                    boxLabel: 'Done',
                    name: 'OFFUPCMP',
                    inputValue: '1',
                    uncheckedValue: '0',
                    bind: {
                        visible: '{noteAction.value == "E" || noteAction.value == "P" || noteAction.value == "V"}',
                    }


                }]
            },
            // {
            //     xtype: 'container',
            //     layout: {
            //         type: 'hbox',
            //         align: 'stretch'
            //     },

            //     //flex: 1,
            //     items: [{
            //         xtype: 'textarea',
            //         fieldLabel: 'Note',
            //         //flex: 1,
            //         //width: '50%'
            //     }]
            // },
            {
                xtype: 'textarea',
                fieldLabel: 'Note',
                name: 'OFNOTE',
                allowBlank: false,
                flex: 1,
                width: '100%'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Order Key',
                name: 'OAORDKEY',
                value: me.buildOrderKey(),
                hidden: true
            },
            {
                xtype: 'textfield',
                itemId: 'codeFieldId',
                fieldLabel: 'OFFUPCOD',
                name: 'OFFUPCOD',
                hidden: true,
                bind: {
                    value: '{emailField.value}' || '{noteAction.value == "P" ? "*PHONE": ""}'
                },
                scope: this,
                listeners: {
                    change: function (cmp, newValue, oldValue) {
                        console.info('change called');
                        // console.info(cmp);
                        // console.info(newValue);
                        // console.info(oldValue);
                        var codeField = cmp.up('form').down('#codeFieldId'),
                            ereg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                        if (ereg.test(newValue)) {
                            codeField.setValue('*EMAIL')
                        }
                    }
                }

            }
        ]
    },

    initComponent: function () {
        var me = this;
        console.info('initComponent noteform called');
        Ext.apply(me, {
            items: me.buildItems()
        });
        me.callParent(arguments);
    },
    buildTypeStoreData: function () {
        var me = this;
        return me.noteOptions.noteTypes;
    },
    buildActionStoreData: function () {
        var me = this,
            actionArray = new Array();
        //noteActionsList = me.noteActions.noteActions;
        console.info(me);
        actionArray.push({
            NOTEACTC: "",
            NOTEACTD: "None",
            NOTEACTS: "None",
            NOTEACTV: "",
        });
        me.noteOptions.noteActions.forEach(function (e) {
            actionArray.push(e);
        });
        return actionArray;
    },
    buildEmailDefaultStoreData: function () {
        var me = this;
        return me.noteOptions.emailDefaults;
    },
    buildOrderKey: function () {
        var me = this;
        return me.orderKey;
    },
    beforeselectEmail: function (combo, record, index) {
        var me = this;
        console.info('beforeselectEmail called');
        console.info(combo);
        console.info(record);
        console.info(index);
    },
    codeFieldChange: function (cmp, newValue, oldValue) {
        console.info('change called');
        console.info(cmp);
        console.info(newValue);
        console.info(oldValue);
        var codeFieldValues = ['', ''];

    }
});