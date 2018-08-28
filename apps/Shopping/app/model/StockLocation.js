Ext.define('Shopping.model.StockLocation', {
    extend: 'Ext.data.Model',


    // added 
    fields: [
        { name: 'STKCOD', defaultValue: 0 },
        { name: 'STKDSC', defaultValue: null }
    ],
    type: 'memory',
    reader: {
        type: 'json'
    }
});
