Ext.define('Showroom.model.SelectedProd', {
    extend: 'Ext.data.Model',
    //fields : ['VVRRN','BECATID','BECDSC','VVCATSEQ','BANTEXT'],
    //fields: [{ name: 'text', type: 'string', mapping: 'CATDESC' }, 'CATID', 'CATDSC', 'BANTEXT', 'showProds', { name: 'expanded', type: 'boolean', defaultValue: true, persist: false }],
    fields: [
        'SBITM',
        'SBQTYO',
        'SBUPRC',
        'I1IDSC',
        'SMALLPIC'
    ],
    // proxy: {
    //     type: 'ajax',
    //     url: '/valence/vvcall.pgm',
    //     extraParams: {
    //         pgm: 'EC1010',
    //         action: 'getCats'
    //     },
    //     reader: {
    //         type: 'json',
    //         rootProperty: 'cats'
    //     }
    // },

});