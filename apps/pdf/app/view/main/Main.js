/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('pdf.view.main.Main', {
    // extend: 'Ext.tab.Panel',
    // xtype: 'app-main',

    // requires: [
    //     'Ext.plugin.Viewport',
    //     'Ext.window.MessageBox',

    //     'pdf.view.main.MainController',
    //     'pdf.view.main.MainModel',
    //     'pdf.view.main.List'
    // ],

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
    // },
    //     //     {
    //     //     title: 'Users',
    //     //     iconCls: 'fa-user',
    //     //     bind: {
    //     //         html: '{loremIpsum}'
    //     //     }
    //     // }, {
    //     //     title: 'Groups',
    //     //     iconCls: 'fa-users',
    //     //     bind: {
    //     //         html: '{loremIpsum}'
    //     //     }
    //     // }, {
    //     //     title: 'Settings',
    //     //     iconCls: 'fa-cog',
    //     //     bind: {
    //     //         html: '{loremIpsum}'
    //     //     }
    //     //     }
    // ]

    extend: 'Ext.Panel',
    xtype: 'app-main',
    //closable: true,

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'pdf.view.main.MainController',
        'pdf.view.main.MainModel',
        'pdf.view.main.List'
    ],
    viewModel: 'main',
    controller: 'main',
    hideOnMaskTap: true,
    showAnimation: {
        type: 'pop',
        // duration: 250,
        // easing: 'ease-out'
    },
    cls: 'pdf-panel',
    centered: true,
    width: '100%',
    height: '100%',
    layout: 'fit',
    //title: 'PDF',
    items: [{
        xtype: 'component',
        cls: 'download-cmp',
        height: '100%',
        //html: '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>',
        //html: '<iframe src="/PRODUCT/DEL20001428.pdf" width="100%" height="100%" >This is iframe</iframe>',
        bind: {
            html: '{iframeHTML}'
        }
    }]
});
