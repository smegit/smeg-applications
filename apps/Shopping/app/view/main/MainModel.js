Ext.define('Shopping.view.main.MainModel', {
    extend   : 'Ext.app.ViewModel',
    requires : [
        // 'Shopping.model.DeliveryOption',
        'Shopping.model.PaymentOption',
        'Shopping.model.StockLocation'
    ],
    alias    : 'viewmodel.main',
    data     : {
        agent       : null,
        agentName   : '',
        cartOptions : null,
        STKDFT      : null
    },
    stores   : {
        // DeliveryOptions : {
        //     model    : 'Shopping.model.DeliveryOption',
        //     autoLoad : false
        // },
        PaymentOptions  : {
            model    : 'Shopping.model.PaymentOption',
            autoLoad : false
        },
        StockLocations  : {
            model    : 'Shopping.model.StockLocation',
            autoLoad : false
        }
    }
});
