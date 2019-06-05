Ext.define('Showroom.view.category.AgencyList', {
    extend: 'Ext.Panel',
    requires: [
        'Ext.grid.Grid',
    ],
    xtype: 'agencyList',
    // reference: 'selectAgency',
    //id: 'selectAgency',
    //closable: true,
    hideOnMaskTap: true,
    showAnimation: {
        type: 'pop',
        // duration: 250,
        // easing: 'ease-out'
    },
    controller: 'main',

    modal: true,
    hideOnMaskTap: false,
    centered: true,
    width: '50%',
    height: 400,
    layout: 'fit',
    title: 'Select Agency',
    // layout: {
    //     type: 'vbox'
    // },
    // viewModel: {
    //     type: 'category'
    // },

    items: [{
        xtype: 'grid',
        height: 300,
        //bind: {
        store: 'Agency',
        //},
        // store: Ext.create('Ext.data.Store', {
        //     data: agencies
        // }),
        columns: [
            {
                text: 'Name',
                flex: 3,
                dataIndex: 'NAME',
            }, {
                text: 'Account',
                flex: 1,
                dataIndex: 'ACCOUNT',
                align: 'right'
            }
        ],
        listeners: {
            select: 'onSelectAgency'
        }

    }],

    // initialize: function () {
    //     var me = this;
    //     console.info('initComponent called');
    //     //console.info(view);
    //     console.info(me);

    //     Ext.apply(me, {
    //         items: me.buildItems(),
    //         // plugins: me.buildPlugins()
    //     });
    //     me.callParent(arguments);
    //     //console.info(arguments);
    // },
});