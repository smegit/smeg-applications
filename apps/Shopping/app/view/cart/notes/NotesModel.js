Ext.define('Shopping.view.cart.notes.NotesModel', {
    extend: 'Ext.app.ViewModel',
    requires: [
        'Shopping.model.Note',
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
                    //OAORDKEY: '20000503'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'notes'
                }
            },
            sorters: [{
                //property: 'dateTime',
                //property: 'OFCRTDATE',
                property: 'OFSEQ',
                direction: 'DESC'
            }],
            listeners: {
                // load: function () {
                //     //this.grid.getSelectionModel().selectFirstRow();
                // }
            }
        },
        // noteTypes: {
        //     proxy: {
        //         type: 'ajax',
        //         url: '/valence/vvcall.pgm',
        //         extraParams: {
        //             pgm: 'EC1010',
        //             action: 'getOptions',
        //         },
        //         reader: {
        //             type: 'json',
        //             rootProperty: 'noteTypes'
        //         }
        //     },
        // data: [
        //     { name: 'enquiry', label: 'Enquiry' },
        //     { name: 'follow_up', label: 'Follow Up' },
        //     { name: 'service', label: 'Service' }
        // ]
        // },
        // noteActions: {
        //     proxy: {
        //         type: 'ajax',
        //         url: '/valence/vvcall.pgm',
        //         extraParams: {
        //             pgm: 'EC1010',
        //             action: 'getOptions',
        //         },
        //         reader: {
        //             type: 'json',
        //             rootProperty: 'noteActions'
        //         }
        //     },
        //     // data: [
        //     //     { name: 'phone', label: 'Phone' },
        //     //     { name: 'email', label: 'Email' }
        //     // ]
        // },
        noteStatus: {
            data: [
                { name: 'ongoing', label: 'Ongoing' },
                { name: 'complete', label: 'Complete' }
            ]
        }
    }
});