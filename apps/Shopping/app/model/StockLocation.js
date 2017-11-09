Ext.define('Shopping.model.StockLocation', {
    extend : 'Ext.data.Model',
    fields : ['STKCOD', 'STKDSC'],
    type   : 'memory',
    reader : {
        type : 'json'
    }
});
