Ext.define('Shopping.view.cart.notes.Notes', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.button.Button',
        'Ext.form.field.TextArea',
        'Ext.form.*',
        'Ext.grid.Panel',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'Shopping.view.cart.notes.NotesController',
        'Shopping.view.cart.notes.NotesModel',
        'Shopping.view.main.MainModel',
        'Valence.common.widget.DockedSearch',

        'Ext.grid.*',
        'Ext.grid.filters.Filters'

    ],
    xtype: 'notes',
    reference: 'notesWin',
    viewModel: {
        type: 'notes'
    },
    controller: 'notes',
    // title: 'Notes',
    height: '90%',
    width: '70%',
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
        beforeshow: 'onBeforeShowWindow',
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

                enableColumnHide: false,
                requires: [
                    'Ext.grid.*',
                    'Ext.grid.filters.Filters'
                ],
                reference: 'notelist',
                width: '30%',
                margin: '0 5 0 0',
                bind: {
                    store: '{Notes}',
                    selection: '{theNote}'
                },
                frame: true,
                autoLoad: false,
                viewConfig: {
                    markDirty: false,
                    stripRows: true,
                    columnLines: true
                },
                resizable: true,
                plugins: 'gridfilters',
                columns: {
                    items: [{
                        xtype: 'datecolumn',
                        text: 'Date/Time',
                        format: 'd/m/Y H:i',
                        dataIndex: 'dateTime',
                        align: 'center',
                        width: 120,
                        filter: true
                    },
                    // {
                    //     text: 'Created By',
                    //     align: 'center',
                    //     dataIndex: 'OFCRTUSER',
                    //     width: 60,
                    //     //filter: 'list'
                    // }, {
                    //     text: 'Updated by',
                    //     align: 'center',
                    //     dataIndex: 'OFCHGUSER',
                    //     width: 60,
                    //     // filter: 'list'
                    // },
                    {
                        text: 'Type',
                        dataIndex: 'OFTYPERENDER',
                        align: 'center',
                        width: 60,
                        align: 'left',
                        //filter: 'list',
                        // renderer: function (v) {
                        //     var mainVm = this.getView().up('app-main').getViewModel(),
                        //         typeStore = mainVm.getStore('NoteTypeOptions'),
                        //         idx = typeStore.find('NOTETYPEC', v),
                        //         rec = typeStore.getAt(idx);
                        //     if (rec) {
                        //         return rec.get('NOTETYPES')
                        //     }
                        // },
                        filter: {
                            type: 'list',
                            //dataIndex: 'NOTETYPES',


                            // labelField: 'NOTETYPES',
                            // labelIndex: 'NOTETYPES',
                            // bind: {
                            //     store: '{NoteTypeOptions}',
                            // },


                            // labelField: 'NOTETYPES', // override default of 'text'
                            // options: [
                            //     { value: 'Order', name: 'Order' },
                            //     { value: 'I', name: 'Info' },
                            //     { value: 'U', name: 'General' },
                            //     { value: 'S', name: 'Service' }
                            // ]
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
                    beforeselect: 'onBeforeSelect',
                    //beforeitemclick: 'onBeforeItemClick',
                    //load: 'onLoadNoteList',
                    //beforeshow: 'onLoadNoteList',
                    select: 'onNoteListSelect'
                    //afterrender: 'onAfterRenderNoteList'
                }

            },
            {
                xtype: 'form',
                //title: 'Details',
                reference: 'noteForm',
                flex: 1,
                //bodyPadding: 10,
                padding: '10 10 0 10',
                defaultType: 'textfield',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                listeners: {
                    show: 'onFormShow',
                    beforeshow: 'onFormShow',
                    activate: 'onFormShow',
                    dirtychange: 'onFormDirtyChange'
                },



                // items: [{
                //     xtype: 'container',
                //     layout: {
                //         type: 'vbox',
                //         align: 'stretch'
                //     },
                //     items: [{
                //         xtype: 'container',
                //         layout: {
                //             type: 'hbox',
                //             align: 'stretch'
                //         },
                //         items: []
                //     }, {
                //         xtype: 'container',
                //         layout: {
                //             type: 'hbox',
                //             align: 'stretch'
                //         },
                //         items: []

                //     }]
                // }],

                items: [{
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },

                    // plugins: {
                    //     responsive: true
                    // },
                    // responsiveConfig: {
                    //     'width < 600': {
                    //         layout: {
                    //             type: 'box',
                    //             vertical: true,
                    //             align: 'stretch'
                    //         }
                    //     },
                    //     'width >= 600': {

                    //     }
                    //},
                    items: [{
                        xtype: 'combo',
                        fieldLabel: 'Type',
                        reference: 'noteType',
                        id: 'noteType',
                        cls: 'note-type',
                        displayField: 'NOTETYPED',
                        valueField: 'NOTETYPEC',
                        forceSelection: true,
                        enableKeyEvents: true,
                        editable: false,
                        publishes: 'value',
                        queryMode: 'local',
                        padding: '5',
                        labelWidth: 50,
                        //labelStyle: 'width: auto;',
                        //labelStyle: 'text-align: right',
                        //flex: 1,
                        bind: {
                            store: '{NoteTypeOptions}',
                            value: '{theNote.OFTYPE}'
                        },
                        listeners: {
                            // dirtychange: function (field, newValue, oldValue) {
                            //     //console.log('form changed');
                            // },
                            //change: 'onSelectTypeChange',
                            select: 'onTypeSelect'
                        }

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
                        cls: 'note-type',
                        displayField: 'NOTEACTD',
                        valueField: 'NOTEACTC',
                        editable: false,
                        allowBlank: true,
                        forceSelection: true,
                        publishes: 'value',
                        queryMode: 'local',
                        padding: '5',
                        labelWidth: 70,
                        labelStyle: 'min-width: 40px',
                        //labelStyle: 'text-align: right',
                        bind: {
                            store: '{NoteActionOptions}',
                            // disabled: '{noteType.value !== "follow_up"}',
                            value: '{theNote.OFFUPACT}'
                        },
                        listeners: {
                            select: 'onSelectNoteAction'
                        },
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: 'Date',
                        editable: false,
                        reference: 'noteFollowUpDate',
                        padding: '5',
                        cls: 'note-type',
                        labelWidth: 50,
                        format: "d/m/Y",
                        formatText: '',
                        hidden: true,
                        //width: 160,
                        //labelWidth: false,
                        //labelStyle: 'width: auto',
                        // labelStyle: 'text-align: right',
                        id: 'fuDatePicker',
                        showToday: true,
                        //minValue: new Date(),
                        maxValue: Ext.Date.add(new Date(), Ext.Date.YEAR, 1), //1 Year from the current date
                        // flex: 1,
                        bind: {
                            disabled: '{noteAction.value == null}',
                            //visible: '{noteAction.value == null}',
                            value: '{theNote.OFFUPDAT}'
                        },
                        listeners: {
                            //expand: 'onClickDatePicker'
                            focusleave: 'dateValidation',
                            select: 'onTypeSelect',
                            expand: 'onExpand',
                            beforeactivate: 'onExpand'
                        }
                    },
                    // {
                    //     //xtype: 'combo',
                    //     xtype: 'textfield',
                    //     editable: true,
                    //     //flex: 1,
                    //     padding: '5',
                    //     fieldLabel: 'Detail',
                    //     reference: 'noteDetail',
                    //     msgTarget: 'qtip',
                    //     publishes: 'value',
                    //     cls: 'note-type',
                    //     labelWidth: 50,
                    //     //width: 160,
                    //     // labelWidth: false,
                    //     // labelStyle: 'width: auto',
                    //     //labelStyle: 'text-align: right',
                    //     bind: {
                    //         disabled: '{noteAction.value == null}',
                    //         value: '{theNote.OFFUPDET}',
                    //         //fieldLabel: '{note}'
                    //     },
                    //     listeners: {
                    //         focusleave: 'detailValidation',

                    //         // when change and set save button enabled
                    //         change: 'onTypeSelect',
                    //         //keyup: 'onTypeSelect'
                    //     }
                    // },
                    {
                        xtype: 'checkboxfield',
                        name: 'noteComplete',
                        //fieldLabel: 'Complete',
                        boxLabel: 'Done',
                        reference: 'noteComplete',
                        publishes: 'value',
                        flex: 1,
                        bind: {
                            //disabled: '{noteAction.value == null}',
                            value: '{theNote.OFFUPCMP}',
                            hidden: '{noteAction.value == null}'
                        },
                        listeners: {
                            change: 'onTypeSelect'
                        }
                    }]
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [

                        {
                            xtype: 'textfield',
                            editable: true,
                            fieldLabel: 'Created',
                            reference: 'noteCreated',
                            //cls: 'note-created',
                            padding: '5',
                            disabled: true,
                            //cls: 'note-type',
                            labelWidth: 50,
                            width: 220,
                            //labelStyle: 'width: auto',
                            // remove default styling for element wrapping the input element
                            inputWrapCls: '',
                            // remove default styling for div wrapping the input element and trigger button(s)
                            triggerWrapCls: '',
                            // remove the input element's background
                            fieldStyle: 'background:none',
                            bind: {
                                value: '{theNote.createdRender} {theNote.OFCRTUSER}',
                                //visible: '{theNote.OFCHGUSER == "" ? false: true}'
                            },
                            // setValue: function () {
                            //     return 'value';
                            // }

                        },
                        {
                            xtype: 'textfield',
                            editable: true,
                            fieldLabel: 'Updated',
                            reference: 'noteUpdated',
                            padding: '5',
                            disabled: true,
                            //cls: 'note-type',

                            width: 220,
                            labelWidth: 50,
                            //labelStyle: 'width: auto',

                            // remove default styling for element wrapping the input element
                            inputWrapCls: '',
                            // remove default styling for div wrapping the input element and trigger button(s)
                            triggerWrapCls: '',
                            // remove the input element's background
                            fieldStyle: 'background:none',
                            //flex: 1,
                            bind: {
                                value: '{theNote.updatedRender} {theNote.OFCHGUSER}',
                                //visible: '{theNote.OFCHGUSER == "" ? false: true}'
                            }
                        },
                        //{ xtype: 'tbfill' },
                        {
                            //xtype: 'combo',
                            xtype: 'textfield',
                            editable: true,
                            flex: 1,
                            padding: '5',
                            fieldLabel: 'Detail',
                            reference: 'noteDetail',
                            msgTarget: 'qtip',
                            publishes: 'value',
                            cls: 'note-type',
                            labelWidth: 40,
                            hidden: true,
                            //width: 200,
                            // labelWidth: false,
                            // labelStyle: 'width: auto',
                            //labelStyle: 'text-align: right',
                            bind: {
                                disabled: '{noteAction.value == null}',
                                //visible: '{noteAction.value == null}',
                                value: '{theNote.OFFUPDET}',
                                //fieldLabel: '{note}'
                            },
                            listeners: {
                                focusleave: 'detailValidation',

                                // when change and set save button enabled
                                change: 'onTypeSelect',
                                //keyup: 'onTypeSelect'
                            }
                        },
                    ]
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    flex: 1,
                    items: [{
                        xtype: 'textarea',
                        //fieldLabel: 'Note',
                        reference: 'noteText',
                        emptyText: 'Note',
                        bind: '{theNote.OFNOTE}',
                        // labelWidth: 80,
                        // labelStyle: 'text-align: center',
                        //height: 250,
                        flex: 1,
                        padding: '5',
                        enableKeyEvents: true,
                        listeners: {
                            change: 'onChangeNote',
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
            items: [
                { xtype: 'tbfill' },
                {
                    xtype: 'button',
                    text: 'Add Note',
                    ui: 'blue',
                    reference: 'addNoteBtn',
                    //ui: 'blue',
                    //itemId: 'add2',
                    //reference: 'add2',
                    listeners: {
                        click: 'onClickAddNote'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Save',
                    ui: 'blue',
                    disabled: true,
                    hidden: true,
                    //itemId: 'add2',
                    reference: 'saveBtn',
                    listeners: {
                        click: 'onClickSave'
                    }
                },
                {
                    text: 'Exit',
                    itemId: 'cancelButton',
                    reference: 'exitBtn',

                    listeners: {
                        click: 'onClickCancel'
                    }
                }

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
            ]
        }
    }
});