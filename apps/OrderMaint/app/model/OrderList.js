Ext.define('OrderMaint.model.OrderList', {
    extend: 'Ext.data.Model',
    fields: [],
    // reader: {
    //     type: 'json',
    //     // rootProperty: 'recs',
    //     // totalProperty: 'totalCount'
    // }

    proxy: {
        type: 'ajax',
        extraParams: {
            pgm: 'EC1050',
            action: 'getCarts'
        },
        url: '/valence/vvcall.pgm',
        reader: {
            type: 'json',
            rootProperty: 'Carts',
            totalProperty: 'totalCount'
        }
    }

})