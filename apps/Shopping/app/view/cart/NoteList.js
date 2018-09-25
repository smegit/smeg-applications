Ext.define('Shopping.view.cart.NoteList', {
    extend: 'Ext.form.FieldSet',
    requires: [
        'Ext.form.field.TextArea',
        'Ext.grid.Panel',
        'Shopping.view.cart.notes.NotesModel',
        //'Shopping.view.cart.notes.NotesController',
        'Shopping.view.cart.CartController'


    ],
    xtype: 'notelist',
    collapsible: true,
    collapsed: true,
    viewModel: {
        type: 'notes'
    },
    controller: 'cart',
    title: 'Notes',
    cls: 'cart-fieldset',
    padding: '5 18 8 15',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        beforeexpand: 'onBeforeExpand'
    },


    initComponent: function () {
        var me = this,
            vm = me.getViewModel();
        console.log('initComponent called' + 'orderKey => ' + vm.get('activeCartNumber'));
        console.info(vm);
        Ext.apply(me, {
            items: me.buildItems()
        });
        me.callParent(arguments);

    },

    buildItems: function () {
        var me = this;
        return [{
            xtype: 'grid',
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
                    text: 'Date / Time',
                    dataIndex: 'OFNOTE',
                    align: 'center',
                    width: 150
                }, {
                    text: 'Note',
                    dataIndex: 'OFNOTE',
                    cellWrap: true,
                    flex: 1,
                    // renderer: function (v) {
                    //     return v.replace(new RegExp('\r?\n', 'g'), '<br/>');
                    // }
                }, {
                    text: 'By',
                    align: 'center',
                    dataIndex: 'OFNOTE',
                    width: 100
                }]
            }
        }];
    }

})