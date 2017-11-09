Ext.define('Shopping.model.DeliveryOption', {
    extend : 'Ext.data.Model',
    fields : ['DELOPTC', 'DELOPTD'],
    type   : 'memory',
    reader : {
        type : 'json'
    }
});