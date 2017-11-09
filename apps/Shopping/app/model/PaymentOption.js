Ext.define('Shopping.model.PaymentOption', {
    extend : 'Ext.data.Model',
    fields : ['PAYMCOD', 'PAYMDSC'],
    type   : 'memory',
    reader : {
        type : 'json'
    }
});