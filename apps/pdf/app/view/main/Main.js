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

    extend: 'Ext.Container',
    xtype: 'app-main',
    //closable: true,

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'pdf.view.main.MainController',
        'pdf.view.main.MainModel',
        'Ext.view.View',
    ],
    viewModel: 'main',
    controller: 'main',
    hideOnMaskTap: true,
    showAnimation: {
        type: 'pop',
        // duration: 250,
        // easing: 'ease-out'
    },
    cls: 'pdf-panel1',
    // centered: true,
    // width: '100%',
    // height: '100%',
    // layout: 'fit',
    //title: 'AGENT STOCK',
    // title: {
    //     text: 'AGENT STOCK',
    //     style: 'text-align: center'
    // },

    items: [
        // {
        // xtype: 'component',
        // cls: 'download-cmp',
        // height: '100%',
        // //html: '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>',
        // //html: '<iframe src="/PRODUCT/DEL20001428.pdf" width="100%" height="100%" >This is iframe</iframe>',
        // bind: {
        //     html: '{iframeHTML}'
        // }
        // }
        {
            xtype: 'form',
            width: 500,
            //height: 500,
            cls: 'pdf-menu',
            border: true,
            title: {
                text: 'AGENCY STOCK',
                style: 'text-align: center'
            },
            //     type: 'vbox',
            //     align: 'center'

            // },
            // flex: 1,
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'table',
                        columns: 2,
                        tdAttrs: {
                            style: 'padding: 5px 10px'
                        }
                    },
                    cls: 'menu-container',
                    items: [
                        {
                            xtype: 'component',
                            html: 'Download New Stock Report',
                            cls: 'menu-cmp'
                        },
                        {
                            xtype: 'button',
                            text: 'Download',
                            width: 120,
                            scale: 'medium',
                            handler: 'onDownload',
                            ui: 'grey'
                        },
                        {
                            xtype: 'component',
                            html: 'Upload Scanned Stock Count',
                            cls: 'menu-cmp'
                        },
                        {
                            xtype: 'button',
                            text: 'Upload',
                            width: 120,
                            scale: 'medium',
                            handler: 'onUpload',
                            ui: 'grey'
                        },
                        {
                            xtype: 'component',
                            html: 'View Saved Stock Counts',
                            cls: 'menu-cmp'
                        },
                        {
                            xtype: 'button',
                            text: 'View',
                            width: 120,
                            scale: 'medium',
                            handler: 'onView',
                            ui: 'grey'
                        },
                        {
                            xtype: 'dataview',
                            itemSelector: 'div.dataview-multisort-item',
                            tpl: [
                                '<tpl for=".">',
                                '<div class="dataview-multisort-item">',
                                '<a href="{fileUrl}" target="_blank">{fileName}</a>' +
                                '</div>',
                                '</tpl>',
                            ],
                            bind: {
                                hidden: '{hideList}',
                                store: '{fileList}'
                            }

                        }

                    ]
                },
                // {
                //     xtype: 'button',
                //     scale: 'large',
                //     text: 'Download New Stock Report',
                //     margin: 'auto',
                //     handler: 'onDownload',
                //     //flex: 1,
                //     margin: 10,
                // },
                // {
                //     xtype: 'button',
                //     scale: 'large',
                //     text: 'Upload Scanned Stock Count',
                //     margin: 'auto',
                //     handler: 'onUpload',
                //     //flex: 1,
                //     margin: 10,
                // },
                // {
                //     xtype: 'button',
                //     scale: 'large',
                //     text: 'View Saved Stock Counts',
                //     margin: 'auto',
                //     handler: 'onView',
                //     //flex: 1,
                //     margin: 10,
                // }, {
                //     xtype: 'dataview',
                //     itemSelector: 'div.dataview-multisort-item',
                //     tpl: [
                //         '<tpl for=".">',
                //         '<div class="dataview-multisort-item">',
                //         '<a href="{fileUrl}" target="_blank">{fileName}</a>' +
                //         '</div>',
                //         '</tpl>',
                //     ],
                //     bind: {
                //         hidden: '{hideList}',
                //         store: '{fileList}'
                //     }

                // }
                // {
                //     xtype: 'fileuploadfield', // Same as filefield above
                //     buttonOnly: true,
                //     hideLabel: true,
                //     listeners: {
                //         change: 'buttonOnlyChange'
                //     }
                // }
            ]

        }
    ]


});
