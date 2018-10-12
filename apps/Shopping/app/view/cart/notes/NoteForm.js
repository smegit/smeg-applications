Ext.define('Shopping.view.cart.notes.NoteForm', {
    extend: 'Ext.form.Panel',
    xtype: 'noteform',
    requires: [
        // 'Shopping.model.NoteTypeOption',
        // 'Shopping.model.NoteActionOption',
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
    ],
    //title: 'Login',
    //frame: true,
    //width: 320,
    //height: 300,
    padding: 20,
    bodyPadding: 12,

    //controller: 'notes',
    defaultType: 'textfield',

    // viewModel: {
    //     //type: 'notes'
    //     // type: 'main'
    // },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'combo',
            fieldLabel: 'Note Type',
            reference: 'noteType',
            id: 'noteType',
            displayField: 'NOTETYPED',
            valueField: 'NOTETYPEC',
            editable: false,
            allowBlank: false,
            publishes: 'value',
            queryMode: 'local',
            padding: '5',
            labelWidth: 80,
            labelStyle: 'text-align: center',
            //flex: 1,
            bind: {
                store: '{NoteTypeOptions}',
                value: '{theNote.OFTYPE}'
            },
            // Stop the click evt from propagation otherwise the modal will disappear
            listConfig: {
                listeners: {
                    el: {
                        click: {
                            fn: function (ev, anchor) {
                                ev.stopPropagation()
                            }
                        }
                    }
                }
            }
        }, {
            xtype: 'combo',
            fieldLabel: 'Action',
            reference: 'noteAction',
            displayField: 'NOTEACTD',
            valueField: 'NOTEACTC',
            editable: false,
            queryMode: 'local',
            padding: '5',
            labelWidth: 80,
            labelStyle: 'text-align: center',

            // flex: 1,
            bind: {
                store: '{NoteActionOptions}',
                // disabled: '{noteType.value !== "follow_up"}',
                value: '{theNote.OFFUPACT}'
            },

            // Stop the click evt from propagation otherwise the modal will disappear
            listConfig: {
                listeners: {
                    el: {
                        click: {
                            fn: function (ev, anchor) {
                                ev.stopPropagation()
                            }
                        }
                    }
                }
            }
        }, {
            xtype: 'checkboxfield',
            name: 'noteComplete',
            //fieldLabel: 'Complete',
            boxLabel: 'completed',
            reference: 'noteComplete',
            flex: 1,
            bind: {
                value: '{theNote.OFFUPCMP}'
            },
        }]
    }, {
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            //xtype: 'combo',
            xtype: 'textfield',
            editable: true,
            //flex: 1,
            padding: '5',
            fieldLabel: 'Detail',
            reference: 'noteDetail',
            msgTarget: 'qtip',
            labelWidth: 80,
            labelStyle: 'text-align: center',
            bind: {
                //disabled: '{noteType.value !== "follow_up"}',
                value: '{theNote.OFFUPDET}'
            }
        }, {
            xtype: 'datefield',
            fieldLabel: 'Date',
            editable: false,
            reference: 'noteFollowUpDate',
            padding: '5',
            labelWidth: 80,
            labelStyle: 'text-align: center',
            id: 'fuDatePicker',
            showToday: false,
            minValue: new Date(),
            maxValue: Ext.Date.add(new Date(), Ext.Date.YEAR, 1), //1 Year from the current date
            // flex: 1,
            bind: {
                //disabled: '{noteType.value !== "follow_up"}',
                value: '{theNote.OFFUPDAT}'
            },
            listeners: {
                //expand: 'onClickDatePicker'
            }
        }]
    }, {
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'textarea',
            fieldLabel: 'Note',
            reference: 'noteText',
            emptyText: 'Note',
            bind: '{theNote.OFNOTE}',
            labelWidth: 80,
            labelStyle: 'text-align: center',
            height: 250,
            flex: 1,
            padding: '5',
            listeners: {
                change: 'onChangeNote'
            }
        }]
    }]

})