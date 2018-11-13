Ext.define('Shopping.model.NoteDetailOption', {
    extend: 'Ext.data.Model',
    fields: ['EMLCOD', 'EMLDSC', 'EMLSEQ'],
    type: 'memory',
    reader: {
        type: 'json'
    }
})