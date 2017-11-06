Ext.define('ShoppingCart.model.ExistingCart',{
    extend : 'Ext.data.Model',
    fields : ['OAORDKEY','OAMNTD','OAMNTT','OACSTREF','OAREP','OAORDKEY'],
    proxy  : {
        type        : 'ajax',
        url         : '/valence/vvcall.pgm',
        extraParams : {
            pgm    : 'EC1050',
            action : 'getCarts'
        },
        reader      : {
            type         : 'json',
            rootProperty : 'Carts'
        },

        fields      : [
            {
                name        :   'OAMNTT',
                type        :   'string'
            },
            {
                name        :   'OAMNTD',
                type        :   'string'
            },
            {
                name        :   'carttimestamp',
                convert   :   function(v){
                    return v.OAMNTD + ' ' + v.OAMNTT;
                }
            },'OAOSTS'
        ]
    }
});