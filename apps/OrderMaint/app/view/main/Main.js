/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('OrderMaint.view.main.Main', {
    // extend: 'Ext.tab.Panel',
    // xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'OrderMaint.view.main.MainController',
        'OrderMaint.view.main.MainModel',
        'OrderMaint.view.main.List'
    ],

    // controller: 'main',
    // viewModel: 'main',

    // ui: 'navigation',

    // tabBarHeaderPosition: 1,
    // titleRotation: 0,
    // tabRotation: 0,

    // header: {
    //     layout: {
    //         align: 'stretchmax'
    //     },
    //     title: {
    //         bind: {
    //             text: '{name}'
    //         },
    //         flex: 0
    //     },
    //     iconCls: 'fa-th-list'
    // },

    // tabBar: {
    //     flex: 1,
    //     layout: {
    //         align: 'stretch',
    //         overflowHandler: 'none'
    //     }
    // },

    // responsiveConfig: {
    //     tall: {
    //         headerPosition: 'top'
    //     },
    //     wide: {
    //         headerPosition: 'left'
    //     }
    // },

    // defaults: {
    //     bodyPadding: 20,
    //     tabConfig: {
    //         plugins: 'responsive',
    //         responsiveConfig: {
    //             wide: {
    //                 iconAlign: 'left',
    //                 textAlign: 'left'
    //             },
    //             tall: {
    //                 iconAlign: 'top',
    //                 textAlign: 'center',
    //                 width: 120
    //             }
    //         }
    //     }
    // },

    // items: [{
    //     title: 'Home',
    //     iconCls: 'fa-home',
    //     // The following grid shares a store with the classic version's grid as well!
    //     items: [{
    //         xtype: 'mainlist'
    //     }]
    // }, {
    //     title: 'Users',
    //     iconCls: 'fa-user',
    //     bind: {
    //         html: '{loremIpsum}'
    //     }
    // }, {
    //     title: 'Groups',
    //     iconCls: 'fa-users',
    //     bind: {
    //         html: '{loremIpsum}'
    //     }
    // }, {
    //     title: 'Settings',
    //     iconCls: 'fa-cog',
    //     bind: {
    //         html: '{loremIpsum}'
    //     }
    // }]
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',
    reference: 'tabpanel',
    controller: 'main',
    viewModel: 'main',
    cls: 'main-tab',

    //flex: 1,
    //width: 600,
    //height: 6000,
    defaults: {
        bodyPadding: 10,
        scrollable: true,

    },
    tabBar: {
        layout: {
            //pack: 'center'
        },
    },
    //layout: 'fit',
    //tabPosition: 'bottom',
    items: [
        {
            title: 'Orders',
            iconCls: 'fa fa-list',
            // The following grid shares a store with the classic version's grid as well!
            items: [{
                xtype: 'orderlist'
            }]
        },
        // {
        //     title: 'Active Tab',
        //     html: 'KitchenSink.DummyText.longText'
        // }, {
        //     title: 'Inactive Tab',
        //     html: 'KitchenSink.DummyText.extraLongText'
        // }, {
        //     title: 'Disabled Tab',
        //     disabled: true
        // }, {
        //     title: 'Closable Tab',
        //     closable: true,
        //     html: 'KitchenSink.DummyText.longText'
        // }, {
        //     title: 'Another inactive Tab',
        //     html: 'KitchenSink.DummyText.extraLongText'
        // }
    ]
});
