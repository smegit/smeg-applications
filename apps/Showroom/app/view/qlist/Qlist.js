Ext.define('Showroom.view.qlist.Qlist', {
    extend: 'Ext.Panel',
    xtype: 'qlist',
    controller: 'qlist',
    //title: 'Qoute List',

    requires: [
        //'Ext.grid.filters.*'
    ],

    viewModel: 'qlist',
    // plugins: {
    //     //gridfilters: true
    // },

    //plugins: 'gridfilters',

    listeners: {
        getQouteList: 'onGetQouteList'
    },
    items: [{
        xtype: 'grid',
        rowNumbers: true,

        title: "Qoute List",
        height: 800,
        bind: {
            store: '{qoutes}',
            //selection: '{theQoute}'
        },
        listeners: {
            select: 'onGridSelect'
        },


        columns: [{
            text: 'Order Key',
            flex: 1,
            dataIndex: 'SAORDKEY',
            // filter: {
            //     type: 'string',
            //     itemDefaults: {
            //         emptyText: 'Search for...'
            //     }
            // }

        }, {
            text: 'Name',
            dataIndex: 'SACSTNAM'
        },
        {
            text: 'Address',
            flex: 1,
            columns: [{
                text: 'Street',
                dataIndex: 'SACSTST1',

                flex: 1,
                sortable: true,
            },
            {
                text: 'Suburb',
                dataIndex: 'SACSTCTY',

                flex: 1,
                sortable: true,
            },
            {
                text: 'State',
                dataIndex: 'SACSTSTA',

                flex: 1,
                sortable: true,
            },
            {
                text: 'Post Code',
                dataIndex: 'SACSTPST',

                flex: 1,
                sortable: true,
            },]


            //dataIndex: 'address'
        },
        {
            text: 'Email',
            //flex: 1,
            width: 160,
            dataIndex: 'SACSTEML'
        }, {
            text: 'Contact Number',
            //flex: 1,
            width: 160,
            dataIndex: 'SACSTPH1'
        },
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
    }]


});