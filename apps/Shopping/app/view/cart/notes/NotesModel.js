Ext.define('Shopping.view.cart.notes.NotesModel', {
    extend: 'Ext.app.ViewModel',
    requires: [
        'Shopping.model.Note'
    ],
    alias: 'viewmodel.notes',
    stores: {
        Notes: {
            model: 'Shopping.model.Note',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: '/valence/vvcall.pgm',
                extraParams: {
                    pgm: 'EC1050',
                    action: 'getNotes',
                    OAORDKEY: '{orderKey}'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'notes'
                }
            },
            sorters: [{
                property: 'dateTime',
                direction: 'DESC'
            }]
        }
    }
});