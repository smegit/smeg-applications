Ext.define('Shopping.model.PromoSelection', {
    extend: 'Ext.data.Model',
    field: [
        { name: 'prm_desc' },
        { name: 'prm_model' },
        { name: 'prm_code' },
        { name: 'prm_price', type: 'number' },
        { name: 'prm_qty', type: 'int' },
        { name: 'prm_uprice', type: 'number' },
        { name: 'prm_smallpic' }
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
})