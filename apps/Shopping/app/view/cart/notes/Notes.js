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
        'Shopping.view.main.MainModel',
        'Valence.common.widget.DockedSearch',

        'Ext.grid.*'
    ],
    xtype: 'notes',
    reference: 'notesWin',
    viewModel: {
        type: 'notes'
    },
    controller: 'notes',
    // title: 'Notes',
    height: 700,
    width: '80%',
    bodyPadding: 5,

    // layout: {
    //     type: 'vbox',
    //     align: 'stretch'
    // },
    closable: false,
    modal: true,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaultFocus: 'textarea',
    maximizable: true,
    //maximized: true,
    bind: {
        title: 'Notes - {orderKey}'
    },
    listeners: {
        //close: 'onClose',
        beforeshow: 'onBeforeShow'
    },
    // listeners: {
    //     resize: function (win, width, height, eOpts) {
    //         var notelist = this.lookupReference('notelist');
    //         console.log('resize called');
    //         console.info(notelist);
    //         if (notelist.getHeight() == '400') {
    //             console.log('reset the height to 600');
    //             //notelist.setHeight('300');
    //         }
    //         //this.lookupReference('notelist').setHeight('600');
    //         console.info(notelist);
    //         //win.center();
    //     }
    // },
    buttonAlign: 'center',
    // fbar: [{
    //     minWidth: 80,
    //     text: 'Save'
    // }, {
    //     minWidth: 80,
    //     text: 'Cancel'
    // }],
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: me.buildItems(),
            //tbar: me.buildTbar(),
            bbar: me.buildBBar()
        });
        me.callParent(arguments);
    },
    buildTbar: function () {
        return [{
            text: 'Add Note',

        }]
    },

    buildItems: function () {
        var me = this;
        return [
            // {
            // xtype: 'container',
            // flex: 1,
            // itemId: 'contentPanel'
            // }
            {
                xtype: 'grid',
                //title: 'Notes',

                reference: 'notelist',
                width: '50%',
                margin: '0 5 0 0',
                bind: {
                    store: '{Notes}',
                    selection: '{theNote}'
                },
                frame: true,
                autoLoad: true,
                viewConfig: {
                    markDirty: false,
                    stripRows: true,
                    columnLines: true
                },
                resizable: true,
                // plugins: {
                //     //gridfilters: true
                // },
                columns: {
                    items: [{
                        xtype: 'datecolumn',
                        text: 'Date/Time',
                        format: 'd/m/Y H:i',
                        dataIndex: 'dateTime',
                        align: 'center',
                        width: 120,
                    },
                    {
                        text: 'Created By',
                        align: 'center',
                        dataIndex: 'OFCRTUSER',
                        width: 60,
                        //filter: 'list'
                    }, {
                        text: 'Updated by',
                        align: 'center',
                        dataIndex: 'OFCHGUSER',
                        width: 60,
                        // filter: 'list'
                    }, {
                        text: 'Type',
                        dataIndex: 'OFTYPE',
                        align: 'center',
                        width: 60,
                        //filter: 'list',
                        renderer: function (v) {

                            var mainVm = this.getView().up('app-main').getViewModel(),
                                typeStore = mainVm.getStore('NoteTypeOptions'),
                                idx = typeStore.find('NOTETYPEC', v),
                                rec = typeStore.getAt(idx);
                            if (rec) {
                                return rec.get('NOTETYPES')
                            }
                        }
                    }, {
                        text: 'Note',
                        dataIndex: 'OFNOTE',
                        //cellWrap: true,
                        flex: 1,
                        // renderer: function (v) {
                        //     return v.replace(/(?:\r\n|\r|\n)/g, ' ');
                        // }
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
                        fields: ['OFNOTE', 'OFTYPE', 'OFCRTUSER'],
                        bind: {
                            store: '{Notes}'
                        }
                    }]
                }],
                listeners: {
                    itemclick: 'onItemClick',
                }

            },
            {
                xtype: 'form',
                //title: 'Details',
                reference: '',
                flex: 1,
                bodyPadding: 10,
                defaultType: 'textfield',
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
                        forceSelection: true,
                        enableKeyEvents: true,
                        editable: false,
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
                        // listConfig: {
                        //     listeners: {
                        //         el: {
                        //             click: {
                        //                 fn: function (ev, anchor) {
                        //                     ev.stopPropagation()
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Follow Up',
                        reference: 'noteAction',
                        displayField: 'NOTEACTD',
                        valueField: 'NOTEACTC',
                        editable: true,
                        allowBlank: true,
                        defaultValue: null,
                        publishes: 'value',
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
                        // listConfig: {
                        //     listeners: {
                        //         el: {
                        //             click: {
                        //                 fn: function (ev, anchor) {
                        //                     ev.stopPropagation()
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                    }, {
                        xtype: 'checkboxfield',
                        name: 'noteComplete',
                        //fieldLabel: 'Complete',
                        boxLabel: 'completed',
                        reference: 'noteComplete',
                        publishes: 'value',
                        flex: 1,
                        bind: {
                            disabled: '{noteAction.value == null}',
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
                        publishes: 'value',
                        labelWidth: 80,
                        labelStyle: 'text-align: center',
                        bind: {
                            disabled: '{noteAction.value == null}',
                            value: '{theNote.OFFUPDET}'
                        },
                        listeners: {
                            focusleave: 'detailValidation'
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
                            disabled: '{noteAction.value == null}',
                            value: '{theNote.OFFUPDAT}'
                        },
                        listeners: {
                            //expand: 'onClickDatePicker'
                            focusleave: 'dateValidation'
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
            }
        ]
    },

    // itmes: [{
    //     xtype: 'container',
    //     flex: 1,
    //     itemId: 'contentPanel'
    // }],
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
                    },
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
            items: [{
                xtype: 'button',
                text: 'Add Note',
                //ui: 'blue',
                //itemId: 'add2',
                //reference: 'add2',
                listeners: {
                    click: 'onClickAddNote'
                }
            },
            { xtype: 'tbfill' }, {
                text: 'Cancel',
                itemId: 'cancelButton',
                listeners: {
                    // scope: me,
                    click: function (e) {
                        console.info(e);
                        me.onEsc();
                    }
                    //click: 'onClickCancel'
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
                text: 'Save',
                ui: 'blue',
                //itemId: 'add2',
                //reference: 'add2',
                listeners: {
                    click: 'onClickSave'
                }
            }, { xtype: 'tbfill' }]
        }
    }
});