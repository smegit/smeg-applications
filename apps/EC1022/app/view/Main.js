Ext.define('EC1022.view.Main', {
    extend: 'Ext.container.Viewport',

    requires: [
        'Ext.grid.Panel',
        'Ext.grid.View',
        'Ext.form.field.Trigger',
        'Ext.toolbar.Fill',
        'Ext.button.Button',
        'Ext.toolbar.Paging',
        'Ext.grid.column.Column'
    ],
    //layout: 'fit',
    layout: {
        type: 'vbox',
        align: 'center'
    },

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'toolbar',
                    //ui: 'primary-dark',
                    width: '100%',
                    height: 50,
                    style: {
                        'background-color': 'rgba(0, 0, 0, 0.87)',
                        'border-style': 'none',
                    },
                    cls: 'tool-bar',
                    layout: {
                        type: 'hbox'
                    },
                    items: [
                        { xtype: 'tbfill' },
                        //'Salesperson Maintenance',
                        {
                            xtype: 'component',
                            html: 'Salesperson Maintenance',
                            style: {
                                'font-size': '18px',
                                'color': 'white',
                                'font-weight': 'bolder'
                            }
                        },
                        { xtype: 'tbfill' },
                        {
                            //xtype: 'triggerfield',
                            xtype: 'textfield',
                            itemId: 'search',
                            width: 300,
                            emptyText: 'SEARCH',
                            // fieldLabel: 'Search',
                            labelAlign: 'right',
                            labelWidth: 50,
                            enableKeyEvents: true,
                            triggers: {
                                clear: {
                                    cls: 'x-form-clear-trigger',
                                    handler: function (cmp) {
                                        ;
                                        cmp.onTriggerClick();
                                    }
                                },
                                search: {
                                    cls: 'x-form-search-trigger',
                                    handler: function (cmp) {
                                        cmp.onSearchClick();
                                    }
                                }
                            }
                        },
                        // {
                        //     xtype: 'button',
                        //     itemId: 'searchBtn',
                        //     //iconCls: 'x-fa fa-plus',
                        //     tooltip: 'search record',
                        //     margin: '0 0 0 10px',
                        //     text: 'Search',
                        //     // border: false,
                        //     // style: {
                        //     //     'background-color': 'inherit',
                        //     // }
                        // },
                        {
                            xtype: 'combo',
                            //cls: 'smeg-agency-sel',
                            height: 32,
                            width: 300,
                            itemId: 'smegAgency',
                            readOnly: true,
                            margin: '0 0 0 10px',
                            // hidden: (agencyStore.getCount() === 0) ? true : false,
                            listeners: {
                                // scope: me,
                                afterrender: function (cmp) {
                                    console.info(cmp.agentNo);
                                    cmp.agentTip = Ext.create('Ext.tip.ToolTip', {
                                        showDelay: 800,
                                        target: cmp.el,
                                        html: '',
                                        agentNo: cmp.agentNo,
                                        listeners: {
                                            scope: me,
                                            beforeshow: function (cmp) {
                                                var agCombo = Ext.ComponentQuery.query('#smegAgency')[0];
                                                // if (!Ext.isEmpty(selectedRec)) {
                                                //     cmp.setHtml('<div class="smeg-agency-sel-tip"><span class="label">Agent #: </span><span class="code">' + selectedRec.get('ACCOUNT') + '</span></div>')
                                                //     return true;
                                                // }
                                                console.info(agCombo);
                                                cmp.setHtml('Agent #:' + agCombo.agentNo);
                                                return true;
                                            }
                                        }
                                    });
                                },
                            }
                        },
                        {
                            xtype: 'button',
                            itemId: 'addbutton',
                            iconCls: 'x-fa fa-plus white-btn',
                            tooltip: 'add record',
                            margin: '0 10px',
                            border: false,
                            style: {
                                'background-color': 'inherit',
                            }
                        },
                        {
                            xtype: 'button',
                            itemId: 'downloadbutton',
                            iconCls: 'x-fa fa-download white-btn',
                            tooltip: 'download',
                            border: false,
                            style: {
                                'background-color': 'inherit',
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    width: '60%',
                    height: '90%',
                    layout: 'fit',
                    cls: 'grid-container',
                    margin: '20px 0 0 0',
                    items: [
                        {
                            xtype: 'gridpanel',
                            itemId: 'filegrid',
                            //title: 'Salesperson Maintenance',
                            store: 'Main',
                            columnLines: false,
                            viewConfig: {
                                itemId: 'filegridview',
                                stripeRows: true
                            },
                            // tools: [
                            //     {
                            //         //xtype: 'triggerfield',
                            //         xtype: 'textfield',
                            //         itemId: 'search',
                            //         width: 250,
                            //         emptyText: 'search',
                            //         // fieldLabel: 'Search',
                            //         labelAlign: 'right',
                            //         labelWidth: 50,
                            //         enableKeyEvents: true,
                            //         triggers: {
                            //             clear: {
                            //                 cls: 'x-form-clear-trigger',
                            //                 handler: function (cmp) {
                            //                     ;
                            //                     cmp.onTriggerClick();
                            //                 }
                            //             }
                            //         }
                            //     },
                            //     // {
                            //     //     xtype: 'button',
                            //     //     itemId: 'searchBtn',
                            //     //     //iconCls: 'x-fa fa-plus',
                            //     //     tooltip: 'search record',
                            //     //     margin: '0 0 0 10px',
                            //     //     text: 'Search',
                            //     //     // border: false,
                            //     //     // style: {
                            //     //     //     'background-color': 'inherit',
                            //     //     // }
                            //     // },
                            //     {
                            //         xtype: 'combo',
                            //         //cls: 'smeg-agency-sel',
                            //         height: 32,
                            //         width: 200,
                            //         itemId: 'smegAgency',
                            //         readOnly: true,
                            //         margin: '0 0 0 10px',
                            //         // hidden: (agencyStore.getCount() === 0) ? true : false,
                            //     },
                            //     {
                            //         xtype: 'button',
                            //         itemId: 'addbutton',
                            //         iconCls: 'x-fa fa-plus',
                            //         tooltip: 'add record',
                            //         margin: '0 10px',
                            //         border: false,
                            //         style: {
                            //             'background-color': 'inherit',
                            //         }
                            //     },
                            //     {
                            //         xtype: 'button',
                            //         itemId: 'downloadbutton',
                            //         iconCls: 'x-fa fa-download',
                            //         tooltip: 'download',
                            //         border: false,
                            //         style: {
                            //             'background-color': 'inherit',
                            //         }
                            //     }],
                            dockedItems: [
                                // {
                                //     xtype: 'toolbar',
                                //     dock: 'top',
                                //     itemId: 'filegridtoolbartop',
                                //     items: [
                                //         {
                                //             xtype: 'triggerfield',
                                //             itemId: 'search',
                                //             width: 250,
                                //             fieldLabel: 'Search',
                                //             labelAlign: 'right',
                                //             labelWidth: 50,
                                //             enableKeyEvents: true,
                                //             triggers: {
                                //                 clear: {
                                //                     cls: 'x-form-clear-trigger',
                                //                     handler: function (cmp) {
                                //                         ;
                                //                         cmp.onTriggerClick();
                                //                     }
                                //                 }
                                //             }
                                //         },
                                //         {
                                //             xtype: 'tbfill'
                                //         },
                                //         {
                                //             xtype: 'button',
                                //             itemId: 'addbutton',
                                //             iconCls: 'vvicon-16 vvicon-plus2',
                                //             tooltip: 'add record'
                                //         },
                                //         {
                                //             xtype: 'button',
                                //             itemId: 'downloadbutton',
                                //             iconCls: 'vvicon-16 vvicon-download',
                                //             tooltip: 'download'
                                //         }
                                //     ]
                                // },
                                {
                                    xtype: 'pagingtoolbar',
                                    dock: 'bottom',
                                    itemId: 'pagingtoolbar',
                                    inputItemWidth: 50,
                                    displayInfo: true,
                                    store: 'Main'
                                }
                            ],
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                        return '<div class="vvicon-in-cell vvicon-more"></div>';
                                    },
                                    draggable: false,
                                    width: '4.75%',
                                    resizable: false,
                                    sortable: false,
                                    align: 'center',
                                    dataIndex: 'dummy',
                                    menuDisabled: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: '20%',
                                    align: 'left',
                                    dataIndex: 'A1USRNAM',
                                    text: 'Name',
                                    menuDisabled: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: '15%',
                                    align: 'left',
                                    dataIndex: 'A1USRCOD',
                                    text: 'Employee No',
                                    menuDisabled: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: '20%',
                                    align: 'left',
                                    dataIndex: 'A1LOGIN',
                                    text: 'Login',
                                    menuDisabled: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: '30%',
                                    align: 'left',
                                    dataIndex: 'A1USREML',
                                    text: 'Email',
                                    menuDisabled: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    width: '10%',
                                    align: 'center',
                                    dataIndex: 'A1USRSTS',
                                    text: 'Status',
                                    menuDisabled: true
                                }
                            ]
                        }
                    ]

                },
                // {
                //     xtype: 'gridpanel',
                //     itemId: 'filegrid',
                //     title: 'Salesperson Maintenance',
                //     store: 'Main',
                //     columnLines: false,
                //     viewConfig: {
                //         itemId: 'filegridview',
                //         stripeRows: true
                //     },
                //     width: '80%',
                //     height: '100%',
                //     tools: [
                //         {
                //             //xtype: 'triggerfield',
                //             xtype: 'textfield',
                //             itemId: 'search',
                //             width: 250,
                //             emptyText: 'search',
                //             // fieldLabel: 'Search',
                //             labelAlign: 'right',
                //             labelWidth: 50,
                //             enableKeyEvents: true,
                //             triggers: {
                //                 clear: {
                //                     cls: 'x-form-clear-trigger',
                //                     handler: function (cmp) {
                //                         ;
                //                         cmp.onTriggerClick();
                //                     }
                //                 }
                //             }
                //         },
                //         // {
                //         //     xtype: 'button',
                //         //     itemId: 'searchBtn',
                //         //     //iconCls: 'x-fa fa-plus',
                //         //     tooltip: 'search record',
                //         //     margin: '0 0 0 10px',
                //         //     text: 'Search',
                //         //     // border: false,
                //         //     // style: {
                //         //     //     'background-color': 'inherit',
                //         //     // }
                //         // },
                //         {
                //             xtype: 'combo',
                //             //cls: 'smeg-agency-sel',
                //             height: 32,
                //             width: 200,
                //             itemId: 'smegAgency',
                //             readOnly: true,
                //             margin: '0 0 0 10px',
                //             // hidden: (agencyStore.getCount() === 0) ? true : false,
                //         },
                //         {
                //             xtype: 'button',
                //             itemId: 'addbutton',
                //             iconCls: 'x-fa fa-plus',
                //             tooltip: 'add record',
                //             margin: '0 10px',
                //             border: false,
                //             style: {
                //                 'background-color': 'inherit',
                //             }
                //         },
                //         {
                //             xtype: 'button',
                //             itemId: 'downloadbutton',
                //             iconCls: 'x-fa fa-download',
                //             tooltip: 'download',
                //             border: false,
                //             style: {
                //                 'background-color': 'inherit',
                //             }
                //         }],
                //     dockedItems: [
                //         // {
                //         //     xtype: 'toolbar',
                //         //     dock: 'top',
                //         //     itemId: 'filegridtoolbartop',
                //         //     items: [
                //         //         {
                //         //             xtype: 'triggerfield',
                //         //             itemId: 'search',
                //         //             width: 250,
                //         //             fieldLabel: 'Search',
                //         //             labelAlign: 'right',
                //         //             labelWidth: 50,
                //         //             enableKeyEvents: true,
                //         //             triggers: {
                //         //                 clear: {
                //         //                     cls: 'x-form-clear-trigger',
                //         //                     handler: function (cmp) {
                //         //                         ;
                //         //                         cmp.onTriggerClick();
                //         //                     }
                //         //                 }
                //         //             }
                //         //         },
                //         //         {
                //         //             xtype: 'tbfill'
                //         //         },
                //         //         {
                //         //             xtype: 'button',
                //         //             itemId: 'addbutton',
                //         //             iconCls: 'vvicon-16 vvicon-plus2',
                //         //             tooltip: 'add record'
                //         //         },
                //         //         {
                //         //             xtype: 'button',
                //         //             itemId: 'downloadbutton',
                //         //             iconCls: 'vvicon-16 vvicon-download',
                //         //             tooltip: 'download'
                //         //         }
                //         //     ]
                //         // },
                //         {
                //             xtype: 'pagingtoolbar',
                //             dock: 'bottom',
                //             itemId: 'pagingtoolbar',
                //             inputItemWidth: 50,
                //             displayInfo: true,
                //             store: 'Main'
                //         }
                //     ],
                //     columns: [
                //         {
                //             xtype: 'gridcolumn',
                //             renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                //                 return '<div class="vvicon-in-cell vvicon-more"></div>';
                //             },
                //             draggable: false,
                //             width: '4.75%',
                //             resizable: false,
                //             sortable: false,
                //             align: 'center',
                //             dataIndex: 'dummy',
                //             menuDisabled: true
                //         },
                //         {
                //             xtype: 'gridcolumn',
                //             width: '20%',
                //             align: 'left',
                //             dataIndex: 'A1USRNAM',
                //             text: 'NAME'
                //         },
                //         {
                //             xtype: 'gridcolumn',
                //             width: '15%',
                //             align: 'left',
                //             dataIndex: 'A1USRCOD',
                //             text: 'CODE'
                //         },
                //         {
                //             xtype: 'gridcolumn',
                //             width: '20%',
                //             align: 'left',
                //             dataIndex: 'A1LOGIN',
                //             text: 'LOGIN'
                //         },
                //         {
                //             xtype: 'gridcolumn',
                //             width: '30%',
                //             align: 'left',
                //             dataIndex: 'A1USREML',
                //             text: 'EMAIL'
                //         },
                //         {
                //             xtype: 'gridcolumn',
                //             width: '10%',
                //             align: 'center',
                //             dataIndex: 'A1USRSTS',
                //             text: 'STATUS'
                //         }
                //     ]
                // }
            ]
        });

        me.callParent(arguments);
    }

});