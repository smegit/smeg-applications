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

    layout: 'fit',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    itemId: 'filegrid',
                    title: 'Salesperson Maintenance',
                    store: 'Main',
                    columnLines: false,
                    viewConfig: {
                        itemId: 'filegridview',
                        stripeRows: true
                    },
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            itemId: 'filegridtoolbartop',
                            items: [
                                {
                                    xtype: 'triggerfield',
                                    itemId: 'search',
                                    width: 250,
                                    fieldLabel: 'Search',
                                    labelAlign: 'right',
                                    labelWidth: 50,
                                    enableKeyEvents: true,
                                    triggers : {
                                        clear : {
                                            cls : 'x-form-clear-trigger',
                                            handler : function(cmp){;
                                                cmp.onTriggerClick();
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'addbutton',
                                    iconCls: 'vvicon-16 vvicon-plus2',
                                    tooltip: 'add record'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'downloadbutton',
                                    iconCls: 'vvicon-16 vvicon-download',
                                    tooltip: 'download'
                                }
                            ]
                        },
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
                            renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
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
                            text: 'NAME'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: '15%',
                            align: 'left',
                            dataIndex: 'A1USRCOD',
                            text: 'CODE'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: '20%',
                            align: 'left',
                            dataIndex: 'A1LOGIN',
                            text: 'LOGIN'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: '30%',
                            align: 'left',
                            dataIndex: 'A1USREML',
                            text: 'EMAIL'
                        },
                        {
                            xtype: 'gridcolumn',
                            width: '10%',
                            align: 'center',
                            dataIndex: 'A1USRSTS',
                            text: 'STATUS'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});