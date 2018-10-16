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

    //autoLoad: true,
    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            //flex: 1,
            reference: 'notelist',
            autoHeight: true,
            maxHeight: 800,
            //layout: 'fit',
            //autoScroll: true,
            // responsiveConfig: {
            //     'width < 768': {
            //         height: '90%',
            //     },
            //     'width >= 768': {
            //         height: '60%',
            //     }
            // },
            //plugins: ['fittoparent'],
            bind: {
                store: '{Notes}',
                selection: '{theNote}'
            },
            autoScroll: true,
            autoLoad: false,

            //autoHeight: true,
            //columnLines: true,
            viewConfig: {
                markDirty: true,
                stripRows: true,
                columnLines: true,
                rowLines: true,
                //maxHeight: 30,

            },
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
                    width: 60
                }, {
                    text: 'Updated by',
                    align: 'center',
                    dataIndex: 'OFCHGUSER',
                    width: 60
                }, {
                    text: 'Type',
                    dataIndex: 'OFTYPE',
                    align: 'center',
                    width: 60,
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
                    renderer: function (v) {
                        return v.replace(/(?:\r\n|\r|\n)/g, ' ');
                    }
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