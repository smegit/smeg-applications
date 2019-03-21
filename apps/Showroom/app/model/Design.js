Ext.define('Showroom.model.Design', {
    extend: 'Ext.data.Model',
    type: 'memory',


    fields: [
        'name', 'code', 'image'
    ],
    reader: {
        type: 'json'
    },
});