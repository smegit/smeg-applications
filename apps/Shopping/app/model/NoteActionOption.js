Ext.define('Shopping.model.NoteActionOption', {
    extend: 'Ext.data.Model',
    fields: ['NOTEACTC', 'NOTEACTD', 'NOTEACTS', 'NOTEACTV'],
    type: 'memory',
    reader: {
        type: 'json'
    }
})