Ext.define('Shopping.view.cart.notes.Notes', {
    extend        : 'Ext.window.Window',
    requires      : [
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
    xtype         : 'notes',
    viewModel     : {
        type : 'notes'
    },
    controller    : 'notes',
    title         : 'Notes',
    height        : 500,
    width         : 700,
    layout        : {
        type  : 'vbox',
        align : 'stretch'
    },
    closable      : true,
    modal         : true,
    defaultFocus  : 'textarea',
    maximizable   : true,
    bind          : {
        title : 'Notes - {orderKey}'
    },
    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            items : me.buildItems(),
            bbar  : me.buildBBar()
        });
        me.callParent(arguments);
    },
    buildItems    : function () {
        var me = this;
        return [{
            xtype       : 'grid',
            flex        : 1,
            bind        : {
                store : '{Notes}'
            },
            autoLoad    : true,
            viewConfig  : {
                markDirty   : false,
                stripRows   : true,
                columnLines : true
            },
            columns     : {
                items : [{
                    text      : 'Date',
                    dataIndex : 'friendlyDate',
                    align     : 'center',
                    width     : 100
                }, {
                    text      : 'Time',
                    dataIndex : 'OFCRTTIME',
                    align     : 'center',
                    width     : 100,
                    renderer  : function (v) {
                        if (!Ext.isEmpty(v)) {
                            return Ext.util.Format.date(Ext.Date.parse(v, 'H:i:s'), 'H:i');
                        }
                        return '';
                    }
                }, {
                    text      : 'Note',
                    dataIndex : 'OFNOTE',
                    cellWrap  : true,
                    flex      : 1,
                    renderer  : function (v) {
                        return v.replace(new RegExp('\r?\n', 'g'), '<br/>');
                    }
                }, {
                    text      : 'By',
                    align     : 'center',
                    dataIndex : 'OFCRTUSER',
                    width     : '100'
                }]
            },
            dockedItems : [{
                xtype : 'toolbar',
                dock  : 'top',
                style : {
                    'z-index' : 11
                },
                items : [{
                    xtype  : 'widget_dockedsearch',
                    flex   : 1,
                    fields : ['NOTE'],
                    bind   : {
                        store : '{Notes}'
                    }
                }]
            }, {
                xtype : 'toolbar',
                dock  : 'bottom',
                style : {
                    'z-index' : 11
                },
                items : [{
                    xtype     : 'textarea',
                    reference : 'noteText',
                    emptyText : 'Note',
                    flex      : 1,
                    listeners : {
                        change : 'onChangeNote'
                    }
                }]
            }],
            listeners   : {
                itemclick : 'onItemClick'
            }
        }];
    },
    buildBBar     : function () {
        var me = this;
        return {
            items : ['->', {
                text      : 'Cancel',
                itemId    : 'cancelButton',
                listeners : {
                    scope : me,
                    click : function () {
                        me.onEsc();
                    }
                }
            }, {
                xtype     : 'button',
                text      : 'Add',
                ui        : 'blue',
                bind      : {
                    disabled : '{disableAddButton}'
                },
                listeners : {
                    click : 'onClickAdd'
                }
            }]
        };
    }
});