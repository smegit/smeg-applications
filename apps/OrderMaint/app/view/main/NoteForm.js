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
                    valueField: 'NOTEACTC',
                    reference: 'noteAction',
                    publishes: 'value',
                    name: 'OFFUPACT',
                    store: Ext.create('Ext.data.Store', {
                        data: me.buildActionStoreData()
                    }),
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    name: 'OFFUPDAT',
                    bind: {
                        hidden: '{noteAction.value == null || noteAction.value == "" }',
                    }
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Email',
                    displayField: 'EMLDSC',
                    valueField: 'EMLCOD',
                    name: 'OFFUPDET',
                    vtype: 'email',
                    store: Ext.create('Ext.data.Store', {
                        data: me.buildEmailDefaultStoreData()
                    }),
                    bind: {
                        visible: '{noteAction.value == "E"}',
                        disabled: '{noteAction.value != "E"}'
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
                fieldLabel: 'OFFUPCOD',
                name: 'OFFUPCOD',
                hidden: true
                //value: me.buildOrderKey()
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
    }
});