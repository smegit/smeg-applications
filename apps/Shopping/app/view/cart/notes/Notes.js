Ext.define('Shopping.view.cart.notes.Notes', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.TextArea',
        'Ext.grid.Panel',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'Shopping.view.cart.notes.NotesController',
        'Shopping.view.cart.notes.NotesModel',
        'Valence.common.widget.DockedSearch'
    ],
    xtype: 'notes',
    viewModel: {
        type: 'notes'
    },
    controller: 'notes',
    // title: 'Notes',
    height: 500,
    width: 730,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    closable: true,
    modal: true,
    defaultFocus: 'textarea',
    maximizable: true,
    bind: {
        title: 'Notes - {orderKey}'
    },
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: me.buildItems(),
            bbar: me.buildBBar()
        });
        me.callParent(arguments);
    },

    buildItems: function () {
        var me = this;
        return [{
            xtype: 'container',
            flex: 1,
            itemId: 'contentPanel'
        }]
    },
    buildItems1: function () {
        var me = this;
        return [{
            xtype: 'grid',
            // height: auto,
            flex: 1,
            bind: {
                store: '{Notes}'
            },
            autoLoad: true,
            viewConfig: {
                markDirty: false,
                stripRows: true,
                columnLines: true
            },
            columns: {
                items: [{
                    text: 'Date/Time',
                    dataIndex: 'dateTime',
                    align: 'center',
                    width: 150
                }, {
                    text: 'Note',
                    dataIndex: 'OFNOTE',
                    cellWrap: true,
                    flex: 1,
                    renderer: function (v) {
                        return v.replace(new RegExp('\r?\n', 'g'), '<br/>');
                    }
                }, {
                    text: 'By',
                    align: 'center',
                    dataIndex: 'OFCRTUSER',
                    width: 100
                }]
            },
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                style: {
                    'z-index': 11
                },

                items: [{
                    xtype: 'widget_dockedsearch',
                    flex: 1,
                    fields: ['NOTE'],
                    bind: {
                        store: '{Notes}'
                    }
                }]
            }, {
                xtype: 'toolbar',
                dock: 'bottom',
                fieldDefaults: {
                    labelWidth: 60
                },

                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },

                bodyPadding: 5,
                style: {
                    'z-index': 11
                },
                style: "padding-top:5px",

                bodPpadding: 10,
                items: [{
                    xtype: 'combo',
                    fieldLabel: 'Note Type',
                    reference: 'noteType',
                    displayField: 'label',
                    valueField: 'name',
                    publishes: 'value',
                    style: "padding-top:5px",
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
                    style: "padding-top:5px",
                    flex: 1,
                    bind: {
                        store: '{noteActions}',
                        visible: '{noteType.value === "follow_up"}',
                    }
                },
                {
                    xtype: 'combo',
                    reference: 'noteDetail',
                    flex: 1,
                    style: "padding-top:5px",
                    fieldLabel: 'To',
                    bind: {
                        visible: '{noteType.value === "follow_up"}',
                    }
                },
                {
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    reference: 'noteFollowUpDate',
                    style: "padding-top:5px",
                    flex: 1,
                    bind: {
                        visible: '{noteType.value === "follow_up"}',
                    }
                },
                {
                    xtype: 'textarea',
                    reference: 'noteText',
                    emptyText: 'Note',
                    flex: 1,
                    style: "padding-top:5px",

                    listeners: {
                        change: 'onChangeNote'
                    }
                }]
            }],
            listeners: {
                itemclick: 'onItemClick'
            }
        }];
    },
    buildBBar: function () {
        var me = this;
        return {
            items: ['->', {
                xtype: 'button',
                text: 'Add2',
                ui: 'blue',
                itemId: 'add2',
                //reference: 'add2',
                listeners: {
                    click: 'onClickAdd2'
                }
            }, {
                    text: 'Cancel',
                    itemId: 'cancelButton',
                    listeners: {
                        // scope: me,
                        // click: function (e) {
                        //     console.info(e);
                        //     me.onEsc();
                        // }
                        click: 'onClickCancel'
                    }
                },
                // {
                //     xtype: 'button',
                //     text: 'Add',
                //     ui: 'blue',
                //     bind: {
                //         disabled: '{disableAddButton}'
                //     },
                //     listeners: {
                //         click: 'onClickAdd'
                //     }
                // }
                {
                    xtype: 'button',
                    text: 'Add',
                    ui: 'blue',
                    itemId: 'add2',
                    //reference: 'add2',
                    listeners: {
                        click: 'onClickAdd2'
                    }
                }
            ]
        };
    }
});