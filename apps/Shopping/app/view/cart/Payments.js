Ext.define('Shopping.view.cart.Payments', {
    extend: 'Ext.window.Window',
    requires: [
        'Ext.data.Store',
        'Ext.grid.Panel',
        'Ext.grid.feature.Summary',
        'Ext.layout.container.Fit',
        'Ext.toolbar.Fill'
    ],
    xtype: 'payments',
    title: 'Payments',
    height: 375,
    width: 500,
    layout: 'fit',
    closable: true,
    modal: true,
    defaultFocus: 'button',
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: me.buildItems(),
            bbar: me.buildBBar()
        });
        me.callParent(arguments);
    },
    buildItems: function () {
        var me = this;
        return [{
            xtype: 'grid',
            frame: true,
            margin: '8 16 0 16',
            store: Ext.create('Ext.data.Store', {
                fields: ['action', 'amount', 'note'],
                data: me.buildStoreData()
            }),
            features: [{
                ftype: 'summary'
            }],
            viewConfig: {
                stripRows: true,
                columnLines: true
            },
            hideHeaders: true,
            columns: {
                defaults: {
                    sortable: false,
                    menuDisabled: true
                },
                items: [{
                    dataIndex: 'note',
                    flex: 3
                }, {
                    dataIndex: 'amount',
                    align: 'right',
                    flex: 1,
                    renderer: function (v) {
                        return Ext.util.Format.currency(v);
                    },
                    summaryType: 'sum',
                    summaryRenderer: function (value) {
                        return Ext.String.format('<b>{0}</b>', Ext.util.Format.currency(value));
                    }
                }]
            }
        }];
    },
    buildBBar: function () {
        var me = this;
        return {
            items: ['->', {
                text: 'Cancel',
                listeners: {
                    scope: me,
                    click: function () {
                        me.onEsc();
                    }
                }
            }]
        };
    },
    buildStoreData: function () {
        var me = this,
            paymentsResp = me.lookupViewModel().get('orderPayments'),
            payments = (!Ext.isEmpty(paymentsResp) && !Ext.isEmpty(paymentsResp.PaySum)) ? paymentsResp.PaySum : null,
            data = [];

        if (!Ext.isEmpty(payments)) {
            for (var ii = 0; ii < payments.length; ii++) {
                if (payments[ii].LABEL.toUpperCase() === 'PAID') {
                    data.push({
                        amount: payments[ii].AMOUNT,
                        note: payments[ii].NOTE
                    });
                }
            }
        }
        return data;
    }
});