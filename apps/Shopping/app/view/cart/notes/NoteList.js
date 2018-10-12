Ext.define('Shopping.view.cart.notes.NoteList', {
    extend: 'Ext.container.Container',
    xtype: 'notelist',
    //controller: 'notes',
    viewModel: {
        type: 'notes'
    },
    // bind: {
    //     store: '{Notes}'
    // },
    autoLoad: true,
    items: [
        {
            xtype: 'grid',
            flex: 1,
            height: 400,
            bind: {
                store: '{Notes}',
                selection: '{theNote}'
            },
            autoScroll: true,
            autoLoad: true,
            //columnLines: true,
            viewConfig: {
                markDirty: true,
                stripRows: true,
                columnLines: true,
                rowLines: true
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
                },
                {
                    text: 'Type',
                    dataIndex: 'OFTYPE',
                    renderer: function (v) {

                        var mainVm = this.getView().up('app-main').getViewModel(),
                            typeStore = mainVm.getStore('NoteTypeOptions'),
                            idx = typeStore.find('NOTETYPEC', v),
                            rec = typeStore.getAt(idx);
                        if (rec) {
                            return rec.get('NOTETYPES')
                        }
                    }
                },
                {
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
                    fields: ['OFNOTE', 'OFTYPE', 'OFCRTUSER'],
                    bind: {
                        store: '{Notes}'
                    }
                }]
            }],
            listeners: {
                itemclick: 'onItemClick'
            }
        }
    ],
    // columns: {
    //     items: [{
    //         text: 'Date/Time',
    //         dataIndex: 'dateTime',
    //         align: 'center',
    //         width: 150
    //     }, {
    //         text: 'Note',
    //         dataIndex: 'OFNOTE',
    //         cellWrap: true,
    //         flex: 1,
    //         renderer: function (v) {
    //             return v.replace(new RegExp('\r?\n', 'g'), '<br/>');
    //         }
    //     }, {
    //         text: 'By',
    //         align: 'center',
    //         dataIndex: 'OFCRTUSER',
    //         width: 100
    //     }]
    // },
})