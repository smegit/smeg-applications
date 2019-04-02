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

    items: [{
        xtype: 'grid',
        rowNumbers: true,

        title: "Qoute List",
        height: 800,
        bind: {
            store: '{qoutes}',
            selection: '{theQoute}'
        },
        listeners: {
            select: 'onGridSelect'
        },


        columns: [{
            text: 'Referring Agent',
            flex: 1,
            dataIndex: 'referringAgent',
            // filter: {
            //     type: 'string',
            //     itemDefaults: {
            //         emptyText: 'Search for...'
            //     }
            // }

        }, {
            text: 'Name',
            dataIndex: 'name'
        },
        {
            text: 'Address',
            flex: 1,
            columns: [{
                text: 'Street',
                dataIndex: 'address',

                flex: 1,
                sortable: true,
            },
            {
                text: 'Suburb',
                dataIndex: 'suburb',

                flex: 1,
                sortable: true,
            },
            {
                text: 'State',
                dataIndex: 'state',

                flex: 1,
                sortable: true,
            },
            {
                text: 'Post Code',
                dataIndex: 'postCode',

                flex: 1,
                sortable: true,
            },]


            //dataIndex: 'address'
        },
        {
            text: 'Email',
            //flex: 1,
            width: 160,
            dataIndex: 'email'
        }, {
            text: 'Contact Number',
            //flex: 1,
            width: 160,
            dataIndex: 'contactNumber'
        },
        {
            text: 'Date',
            flex: 1,
            //dataIndex: 'email'
        },
            // {
            // text: 'Update At',
            // flex: 1,
            // //dataIndex: 'contactNumber'
            // }
        ]
    }]


});