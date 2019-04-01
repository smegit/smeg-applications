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

        columns: [{
            text: 'Referring Agent',
            dataIndex: 'referringAgent',
        }, {
            text: 'Name',
            dataIndex: 'name'
        }, {
            text: 'Address',
            dataIndex: 'address'
        }, {
            text: 'Email',
            dataIndex: 'email'
        }, {
            text: 'Contact Number',
            dataIndex: 'contactNumber'
        }]
    }]


});