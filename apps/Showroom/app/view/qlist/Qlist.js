Ext.define('Showroom.view.qlist.Qlist', {
    extend: 'Ext.Panel',
    xtype: 'qlist',
    controller: 'qlist',
    title: 'Qoute List',

    requires: [
        //'Ext.grid.filters.*'
    ],

    viewModel: 'qlist',
    // plugins: {
    //     //gridfilters: true
    // },


    items: [{
        xtype: 'grid',
        rowNumbers: true,

        height: 600,
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
            dataIndex: 'email'
        }, {
            text: 'Contact Number',
            dataIndex: 'contactNumber'
        }]
    }]


});