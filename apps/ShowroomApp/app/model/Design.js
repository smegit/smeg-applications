Ext.define('ShowroomApp.model.Design', {
    extend: 'Ext.data.Model',
    type: 'memory',


    fields: [
        'name', 'code', 'image'
    ],
    reader: {
        type: 'json'
    },
});