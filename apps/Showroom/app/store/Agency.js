Ext.define('Showroom.store.Agency', {
    extend: 'Ext.data.Store',

    alias: 'store.agency',

    fields: [
        'NAME', 'ACCOUNT',
    ],

    // data: {
    //     items: [
    //         { NAME: 'Jean Luc', email: "jeanluc.picard@enterprise.com", ACCOUNT: "555-111-1111" },
    //         { NAME: 'Worf', email: "worf.moghsson@enterprise.com", ACCOUNT: "555-222-2222" },
    //         { NAME: 'Deanna', email: "deanna.troi@enterprise.com", ACCOUNT: "555-333-3333" },
    //         { NAME: 'Data', email: "mr.data@enterprise.com", ACCOUNT: "555-444-4444" }
    //     ]
    // },

    // proxy: {
    //     type: 'memory',
    //     reader: {
    //         type: 'json',
    //         rootProperty: 'items'
    //     }
    // }
    // proxy: {
    //     type: 'ajax',
    //     url: '/valence/vvcall.pgm',
    //     extraParams: {
    //         pgm: 'EC1000',
    //         action: 'getAgencies',
    //         //cat : 'LAUNDRY PRODUCTS'
    //     },
    //     reader: {
    //         type: 'json',
    //         //rootProperty: 'prods'
    //     }
    // }
});
