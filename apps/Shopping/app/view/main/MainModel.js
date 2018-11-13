Ext.define('Shopping.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    requires: [
        // 'Shopping.model.DeliveryOption',
        'Shopping.model.PaymentOption',
        'Shopping.model.StockLocation',
        'Shopping.model.NoteTypeOption',
        'Shopping.model.NoteActionOption',
        'Shopping.model.NoteDetailOption'
    ],
    alias: 'viewmodel.main',
    data: {
        agent: null,
        agentName: '',
        cartOptions: null,
        STKDFT: null
    },
    stores: {
        // DeliveryOptions : {
        //     model    : 'Shopping.model.DeliveryOption',
        //     autoLoad : false
        // },
        PaymentOptions: {
            model: 'Shopping.model.PaymentOption',
            autoLoad: false
        },
        StockLocations: {
            model: 'Shopping.model.StockLocation',
            autoLoad: false
        },
        NoteTypeOptions: {
            model: 'Shopping.model.NoteTypeOption',
            autoLoad: false,

        },
        NoteActionOptions: {
            model: 'Shopping.model.NoteActionOption',
            autoLoad: false,
            // listeners: {
            //     write: function (store) {
            //         console.log('datachanged noteAction called');
            //         store.insert(0, { 'NOTEACTC': null, 'NOTEACTD': null, 'NOTEACTS': null, 'NOTEACTV': null })
            //     }
            // }

            // data: [
            //     { 'NOTEACTC': null, 'NOTEACTD': null, 'NOTEACTS': null, 'NOTEACTV': null },
            //     { 'NOTEACTC': '1', 'NOTEACTD': '1', 'NOTEACTS': '1', 'NOTEACTV': '1' }
            // ]
        },
        NoteDetailOptions: {
            model: 'Shopping.model.NoteDetailOption',
            autoLoad: false,
            // data: [
            //     { 'NOTEDETC': '*SALESPERSON', 'NOTEDETD': '*SALESPERSON', 'NOTEDETS': '*SALESPERSON', 'NOTEDETV': '*SALESPERSON' },
            //     { 'NOTEDETC': 'merry.poniman@smeg.com.au', 'NOTEDETD': 'merry.poniman@smeg.com.au', 'NOTEDETS': 'merry.poniman@smeg.com.au', 'NOTEDETV': 'merry.poniman@smeg.com.au' }
            // ]
            sorters: [{
                property: 'EMLSEQ',
                direction: 'ASC'
            }],
        }
    }
});
