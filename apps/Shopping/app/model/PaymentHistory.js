Ext.define('Shopping.model.PaymentHistory', {
    extend: 'Ext.data.Model',
    field: [
        { name: 'label' },
        { name: 'note' },
        { name: 'amount', type: 'number' }
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
})