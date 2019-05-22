Ext.define('OrderMaint.view.main.Note', {
    extend: 'Ext.grid.Panel',
    xtype: 'expander-note',
    requires: [

        'Valence.common.widget.DockedSearch',
    ],

    title: 'Notes',
    itemId: 'notegrid',
    collapsible: true,
    collapsed: true,
    animCollapse: false,
    columnLines: true,
    enableLocking: true,
    border: true,
    //padding: 10,
    margin: '10 10 100 0',
    //width: 750,
    height: 500,
    emptyText: 'No Notes Saved',
    plugins: [{
        ptype: 'rowexpander',
        rowBodyTpl: new Ext.XTemplate(
            // '<p><b>Date/Time:</b> {OFCRTDATE}</p>',
            // '<p><b>User:</b> {OFCRTUSER}</p>',
            // '<p><b>Type:</b> {OFTYPE}</p>',
            //'<p><b>Note:</b> {OFNOTE}</p>')
            '<p style="white-space: pre-wrap;"><b>Note:</b> {OFNOTE}</p>')
    }],
    listeners: {
        render: function (cmp) {
            console.info(cmp);
            cmp.getEl('title').on('click', function (e) {
                //alert(Ext.getCmp(this.id).title);
            });
        }
    },
    tbar: [
        {
            xtype: 'textfield',
            itemId: 'searchFieldId',
            flex: 1,
            enableKeyEvents: true,
            listeners: {
                specialkey: 'onEnterKeyPressed',
                keyup: 'onKeyup'
            }
        },
        // {
        //     xtype: 'widget_dockedsearch',
        //     flex: 1,
        //     fields: ['NOTE'],
        //     // bind: {
        //     //     store: '{Notes}'
        //     // }
        // },
        {
            text: 'Search',
            tooltip: 'Search',
            iconCls: 'fa fa-search',
            handler: 'onSearchNotes'
        }, '-', {
            text: 'Add Note',
            tooltip: 'Add a new note',
            iconCls: 'fa fa-plus-circle',
            handler: 'onAddNote'
        }, '-',
        // {
        //     xtype: 'widget_dockedsearch',
        //     flex: 1,
        //     }
    ],

    initComponent: function () {
        console.info('initComponent expander-note called');
        var me = this;

        Ext.apply(me, {
            columns: me.buildColumns(),
            store: Ext.create('Ext.data.Store', {
                data: me.buildNoteStoreData()
            }),
            //bbar: me.buildBBar()
        });
        me.callParent(arguments);

    },

    buildColumns: function () {
        var me = this;
        console.info(me)
        return [{
            text: "Date/Time",
            dataIndex: 'OFCRTDATE'
        }, {
            text: "User",
            dataIndex: 'OFCRTUSER'
        }, {
            text: "Type",
            dataIndex: 'OFTYPE'
        }, {
            text: "Note",
            dataIndex: 'OFNOTE',
            flex: 1
        },]
    },
    buildNoteStoreData: function () {
        console.info('buildNoteStoreData called');
        var me = this;
        console.info(me);
    }



});