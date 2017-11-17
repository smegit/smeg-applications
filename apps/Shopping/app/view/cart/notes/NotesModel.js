Ext.define('Shopping.view.cart.notes.NotesModel', {
    extend   : 'Ext.app.ViewModel',
    requires : [
        'Shopping.model.Note'
    ],
    alias    : 'viewmodel.notes',
    stores   : {
        Notes : {
            model    : 'Shopping.model.Note',
            autoLoad : false
        }
    }
});