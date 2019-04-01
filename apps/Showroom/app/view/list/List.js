Ext.define('Showroom.view.list.List', {
    extend: 'Ext.Container',
    xtype: 'list',
    controller: 'list',
    title: 'Qoute List',

    requires: [
        //'Ext.grid.filters.*'
    ],

    plugins: {
        //gridfilters: true
    },

    // rowNumbers: true,

    // columns: [{
    //     text: 'Referring Agent',
    //     dataIndex: 'referringAgent',
    // }, {
    //     text: 'Name',
    //     dataIndex: 'name'
    // }, {
    //     text: 'Address',
    //     dataIndex: 'address'
    // }, {
    //     text: 'Email',
    //     dataIndex: 'email'
    // }, {
    //     text: 'Contact Number',
    //     dataIndex: 'contactNumber'
    // }]
});