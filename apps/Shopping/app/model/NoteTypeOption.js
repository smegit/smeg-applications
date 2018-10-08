Ext.define('Shopping.model.NoteTypeOption', {
    extend: 'Ext.data.Model',
    fields: ['NOTETYPEC', 'NOTETYPED', 'NOTETYPES'],
    type: 'memory',
    reader: {
        type: 'json'
    }
})