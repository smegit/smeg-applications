Ext.define('EC1022.view.EditWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.editwindow',

    requires: [
        'Ext.form.Panel',
        'Ext.form.field.Number',
        'Ext.toolbar.Toolbar',
        'Ext.toolbar.Fill',
        'Ext.button.Button'
    ],

    height: 500,
    width: 600,
    layout: 'fit',
    defaultFocus: '[name=A1USRNAM]',
    title: 'Record',
    modal: true,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    itemId: 'editwindowform',
                    scrollable: true,
                    autoScroll: true,
                    defaults: {
                        labelAlign: 'right',
                        labelWidth: 100,
                        msgTarget: 'under'
                    },
                    layout: 'auto',
                    bodyPadding: 10,
                    header: false,
                    items: [
                        {
                            xtype: 'displayfield',
                            maxLength: 10,
                            itemId: 'A1CN',
                            size: 15,
                            fieldLabel: 'AGENCY',
                            submitValue: true,
                            name: 'A1CN'
                        },
                        {
                            xtype: 'displayfield',
                            maxLength: 10,
                            itemId: 'A1USRID',
                            size: 15,
                            fieldLabel: 'USER Id',
                            submitValue: true,
                            name: 'A1USRID'
                        },
                        {
                            xtype: 'textfield',
                            graphic: true,
                            maxLength: 30,
                            enforceMaxLength: true,
                            allowBlank: false,
                            emptyText: 'Salesperson name',
                            itemId: 'A1USRNAM',
                            size: 50,
                            fieldLabel: 'NAME',
                            name: 'A1USRNAM'
                        },
                        {
                            xtype: 'textfield',
                            graphic: true,
                            vtype: 'alphanum',
                            maxLength: 30,
                            enforceMaxLength: true,
                            allowBlank: false,
                            emptyText: 'Login ID with no spaces',
                            itemId: 'A1LOGIN',
                            size: 50,
                            fieldLabel: 'LOGIN',
                            name: 'A1LOGIN'
                        },
                        {
                            xtype: 'textfield',
                            vtype: 'email',
                            maxLength: 100,
                            enforceMaxLength: true,
                            allowBlank: false,
                            itemId: 'A1USREML',
                            size: 50,
                            fieldLabel: 'EMAIL',
                            name: 'A1USREML'
                        },
                        {
                            xtype: 'textfield',
                            maxLength: 12,
                            enforceMaxLength: true,
                            itemId: 'A1USRCOD',
                            size: 18,
                            fieldLabel: 'CODE',
                            name: 'A1USRCOD'
                        },
                        {
                            xtype: 'textfield',
                            maxLength: 1,
                            enforceMaxLength: true,
                            itemId: 'A1USRSTS',
                            size: 2,
                            fieldLabel: 'STATUS',
                            name: 'A1USRSTS'
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'bottom',
                            itemId: 'editwindowtoolbar',
                            items: [
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'save',
                                    minWidth: 60,
                                    text: 'Save'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});