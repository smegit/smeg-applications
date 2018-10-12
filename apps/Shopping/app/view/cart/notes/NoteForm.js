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
    // initComponent: function () {
    //     var me = this;
    //     Ext.apply(me, {
    //         items: me.buildItems()
    //     });
    //     me.callParent(arguments);
    // },


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

            listeners: {
                // preventDefault: true,
                // stopEvent: true,
                // stopPropagation: true,
                //select: 'onSelect',
                select: {
                    //element: 'el',
                    //delegate: '',
                    preventDefault: true,
                    stopEvent: true,
                    stopPropagation: true,
                    // fn: function (evt) {
                    //     console.log('select');
                    //     console.info(evt);
                    // }
                }
            }

        }, {
            xtype: 'combo',
            fieldLabel: 'Action',
            reference: 'noteAction',
            allowBlank: false,
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

            // flex: 1,
            bind: {
                //disabled: '{noteType.value !== "follow_up"}',
                value: '{theNote.OFFUPDAT}'
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