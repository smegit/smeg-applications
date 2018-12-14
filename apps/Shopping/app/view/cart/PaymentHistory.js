Ext.define('Shopping.view.cart.PaymentHistory', {
    extend: 'Ext.form.FieldSet',
    xtype: 'paymenthistory',
    requires: [
        'Ext.grid.feature.Summary',
    ],
    title: 'Payments',
    //padding: '0 20',

    items: [{
        xtype: 'grid',
        //border: true,
        reference: 'paymentHistoryGrid',
        bind: {
            store: '{paymentHistory}'
        },
        features: [{
            id: 'paymentSummary',
            ftype: 'summary',
            showSummaryRow: false,
        }],
        columns: [
            {
                text: 'Label',
                dataIndex: 'label',
                sortable: false,

            }, {
                text: 'Note',
                flex: 2,
                dataIndex: 'note',
                sortable: false,

            },
            {
                text: 'Amount',
                align: 'right',
                dataIndex: 'amount',
                flex: 1,
                sortable: false,
                renderer: function (value) {
                    return Ext.util.Format.number(value, '0,0.00');
                },
                //summaryType: 'sum',
                // summaryRenderer: function (value) {
                //     return Ext.String.format('<b>Total Pai: {0}</b>', Ext.util.Format.currency(value));
                // }
            }]

    }],

})