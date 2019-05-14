Ext.define('pdf.view.main.FileListWindow', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.grid.column.Date'
    ],
    xtype: 'fileListWin',
    height: 500,
    width: 620,
    modal: true,
    title: 'Saved Files',
    closable: true,

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
            //select: 'onSelectFile',
            itemdblclick: 'onItemDblClick'
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

        },
        // {
        //     xtype: 'datecolumn',
        //     text: 'Date',
        //     dataIndex: 'date',
        //     width: 100,
        //     format: 'd/m/Y'
        //     //renderer: 
        // },
        {
            xtype: 'datecolumn',
            text: 'Date',
            dataIndex: 'timestamp',
            width: 100,
            renderer: function (value) {
                console.info(value);
                return Ext.Date.format(value, 'j/n/Y');
            },
            // renderer: Ext.util.Format.dateRenderer('j-M-Y')
        },
        {
            xtype: 'datecolumn',
            //format: 'H:M:S',
            text: 'Time',
            dataIndex: 'timestamp',
            width: 100,
            renderer: function (value) {
                return Ext.Date.format(value, 'H:i:s');
            }
        },
        // {
        //     //xtype: 'datecolumn',
        //     //format: 'H:M:S',
        //     text: 'Time',
        //     dataIndex: 'time',
        //     width: 100,
        // },
        {
            //text: 'Action',
            xtype: 'actioncolumn',
            items: ['@view'],
            //align: 'left',
            width: 50,
        },
        {
            text: '',
            width: 25,
        }
        ]
    }]
});