Ext.define('ShoppingCart.model.CartRep', {
    extend : 'Ext.data.Model',

    fields : ['REP','CODE'],

    proxy  : {
        type        : 'ajax',
        url         : '/valence/vvcall.pgm',
        extraParams : {
            pgm    : 'EC1010',
            action : 'getReps'
        },
        reader      : {
            type         : 'json',
            rootProperty : 'Reps'
        }
    }
});
