Ext.define('Showroom.view.qlist.Qlist', {
    extend: 'Ext.grid.Grid',
    xtype: 'qlist',
    controller: 'qlist',
    //title: 'Qoute List',
    //title: "Product Selections",

    requires: [
        //'Ext.grid.filters.*'
        'Ext.grid.plugin.PagingToolbar',

    ],

    viewModel: 'qlist',
    // plugins: {
    //     //gridfilters: true
    // },

    //plugins: 'pagingtoolbar',
    plugins: [{
        type: 'pagingtoolbar',
        id: 'qlist_pagingtool'
    }],





    listeners: {
        getQouteList: 'onGetQouteList',
    },
    items: [{
        xtype: 'grid',
        rowNumbers: true,
        id: 'qlistInner',

        //title: "Product Selections",
        border: true,
        //style: 'border: 1px solid blue;',
        height: 700,
        bind: {
            store: '{qoutes}',
            //selection: '{theQoute}'
        },
        listeners: {
            select: 'onGridSelect',
            selectionchange: 'onGridSelectionChange'

        },

        columns: [
            {
                text: 'Date',
                dataIndex: 'SADATE',
                id: 'SADATE'
            }, {
                text: 'Order Key',
                flex: 1,
                dataIndex: 'SAORDKEY',
                id: 'SAORDKEY',
                //sortable: false,
                // filter: {
                //     type: 'string',
                //     itemDefaults: {
                //         emptyText: 'Search for...'
                //     }
                // }

            }, {
                text: 'Name',
                dataIndex: 'SACSTNAM',
                id: 'SACSTNAM',
            },
            {
                text: 'Suburb',
                dataIndex: 'SACSTCTY',
                id: 'SACSTCTY',

                flex: 1,
                sortable: true,
            },
            {
                text: 'Post Code',
                dataIndex: 'SACSTPST',
                id: 'SACSTPST',

                flex: 1,
                sortable: true,
            },
            {
                text: 'Status',
                dataIndex: 'SAOSTS',
                id: 'SAOSTS',

                flex: 1,
                sortable: true,
            },
            // {
            //     text: 'Address',
            //     flex: 1,
            //     columns: [{
            //         text: 'Street',
            //         dataIndex: 'SACSTST1',

            //         flex: 1,
            //         sortable: true,
            //     },
            //     {
            //         text: 'Suburb',
            //         dataIndex: 'SACSTCTY',

            //         flex: 1,
            //         sortable: true,
            //     },
            //     {
            //         text: 'State',
            //         dataIndex: 'SACSTSTA',

            //         flex: 1,
            //         sortable: true,
            //     },
            //     {
            //         text: 'Post Code',
            //         dataIndex: 'SACSTPST',

            //         flex: 1,
            //         sortable: true,
            //     },]


            //     //dataIndex: 'address'
            // },
            // {
            //     text: 'Email',
            //     //flex: 1,
            //     width: 160,
            //     dataIndex: 'SACSTEML'
            // }, {
            //     text: 'Contact Number',
            //     //flex: 1,
            //     width: 160,
            //     dataIndex: 'SACSTPH1'
            // },
            // {
            //     text: 'Date',
            //     flex: 1,
            //     //dataIndex: 'email'
            // },
            // {
            // text: 'Update At',
            // flex: 1,
            // //dataIndex: 'contactNumber'
            // }
        ]
    }],

    bbar: [{
        xtype: 'pagingtoolbar',
    }]


});