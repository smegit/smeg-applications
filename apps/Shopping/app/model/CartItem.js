Ext.define('Shopping.model.CartItem', {
    extend: 'Ext.data.Model',
    idProperty : 'product_id',
    fields: [
        {
            name            :   'product_id',
            reference       :   'Product'
        },
        {
            name            :   'prod_desc'
        },
        {
            name            :   'quantity',
            type        :   'int'
        },
        {
            name            :   'allocated',
            type            :   'int',
            defaultValue    :   0
        },
        {
            name    :   'price',
            type    :   'number'
        },
        {
            name    : 'extended_price',
            calculate: function(data){
                return data.quantity * data.price;
            }
        }
    ]
});