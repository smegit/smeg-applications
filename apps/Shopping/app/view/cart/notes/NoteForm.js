Ext.define('Shopping.view.cart.notes.NoteForm', {
    extend: 'Ext.form.Panel',
    xtype: 'noteform',
    requires: [

    ],
    //title: 'Login',
    //frame: true,
    //width: 320,
    //height: 300,
    padding: 20,
    bodyPadding: 12,

    //controller: 'notes',
    defaultType: 'textfield',

    viewModel: {
        type: 'notes'
    },

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
            displayField: 'label',
            valueField: 'name',
            publishes: 'value',
            padding: '5',
            flex: 1,
            bind: {
                store: '{noteTypes}'
            }
        }, {
            xtype: 'combo',
            fieldLabel: 'Action',
            reference: 'noteAction',
            displayField: 'label',
            valueField: 'name',
            padding: '5',
            flex: 1,
            bind: {
                store: '{noteActions}',
                // disabled: '{noteType.value !== "follow_up"}',
            }
        }]
    }, {
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'combo',
            editable: true,
            flex: 1,
            padding: '5',
            fieldLabel: 'Detail',
            reference: 'noteDetail',
            bind: {
                //disabled: '{noteType.value !== "follow_up"}',
            }
        }, {
            xtype: 'datefield',
            fieldLabel: 'Date',
            reference: 'noteFollowUpDate',
            padding: '5',
            flex: 1,
            bind: {
                //disabled: '{noteType.value !== "follow_up"}',
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
            flex: 1,
            padding: '5',
            listeners: {
                change: 'onChangeNote'
            }
        }]
    }, {
        xtype: 'container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'checkboxfield',
            name: 'noteComplete',
            fieldLabel: 'Complete',
            boxLabel: 'completed',
            reference: 'noteComplete',
            bind: {
                value: '{theNote.OFFUPCMP}'
            }
        }]
    }]
})