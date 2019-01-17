Ext.define('Shopping.view.cart.PaymentHistory', {
    extend: 'Ext.grid.Panel',
    xtype: 'paymenthistory',
    requires: [
        'Ext.grid.feature.Summary',
    ],
    ui: 'background',
    countInTitle: false,
    bind: {
        hidden: '{hidePaymentHistory}',
        store: '{paymentHistory}',
    },
    //margin: '10',
    // header: {
    //     //title: 'Payment History'
    // },
    // style: {
    //     marginTop: '10px'
    // },
    //padding: '0 0 10 0',
    reference: 'paymentHistoryGrid',

    cls: 'cart-list',
    overCls: 'cart-list-over',
    features: [{
        id: 'paymentSummary',
        ftype: 'summary',
        showSummaryRow: false,
    }],
    columns: [
        // {
        //     text: 'Label',
        //     dataIndex: 'label',
        //     sortable: false,

        // },
        {
            text: 'Payment Detail',
            flex: 1,
            dataIndex: 'note',
            sortable: false,
            menuDisabled: true,
        },
        {
            text: 'Amount',
            align: 'right',
            dataIndex: 'amount',
            flex: 1,
            sortable: false,
            menuDisabled: true,
            cls: 'gridTitle',
            renderer: function (value, meta) {
                meta.tdCls += ' cart-list-prd-detail';
                return Ext.util.Format.number(value, '0,0.00');
            },
            //summaryType: 'sum',
            // summaryRenderer: function (value) {
            //     //return Ext.String.format('<b>Total Pai: {0}</b>', Ext.util.Format.currency(value));
            //     return '{listFooterText}'
            // }
        },
        {
            text: '',
            width: 30
        }]



})