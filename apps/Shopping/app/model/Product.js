Ext.define('Shopping.model.Product', {
    extend: 'Ext.data.Model',
    fields: ['STOCKTIP', 'PRODDSC', 'MODEL', 'PRICEOLD', 'PRICE', {
        name: 'EXPIRY',
        type: 'date',
        dateFormat: 'Y-m-d',
        convert: function (v) {
            if (v == '0001-01-01') {
                return null;
            }
            return Ext.Date.parse(v, 'Y-m-d');
        }
    }],
    proxy: {
        type: 'ajax',
        url: '/valence/vvcall.pgm',
        extraParams: {
            pgm: 'EC1010',
            action: 'getProds',
            //cat : 'LAUNDRY PRODUCTS'
        },
        reader: {
            type: 'json',
            rootProperty: 'prods'
        }
    }
});