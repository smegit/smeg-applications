Ext.define('pdf.view.main.FileListWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.grid.Panel',
        'Ext.grid.column.Action'
    ],
    xtype: 'fileListWin',
    height: 500,
    width: 600,
    modal: true,
    title: 'Saved Files',

    items: [{
        xtype: 'grid',
        //title: 'Saved Files',
        height: 500,

        bind: {
            store: '{fileList}'
        },
        actions: {
            view: {
                iconCls: 'x-fa fa-eye',
                tooltip: 'View File',
                handler: 'onViewFile'
            },
        },
        listeners: {
            select: 'onSelectFile'
        },
        columns: [{
            text: 'Agent ID',
            dataIndex: 'agent',
            width: 100,
        }, {
            text: 'Agent Name',
            dataIndex: 'name',
            //width: 200,
            flex: 1

        }, {
            text: 'Date',
            dataIndex: 'date',
            width: 100,
        }, {
            text: 'Time',
            dataIndex: 'time',
            width: 100,
        },
        {
            //text: 'Action',
            xtype: 'actioncolumn',
            items: ['@view'],
            align: 'center',

            width: 50,
        }
        ]
    }]
});