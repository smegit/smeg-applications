Ext.define('ShoppingCart.model.CartDeliveryOpt',{
    extend: 'Ext.data.Model',
    type        : 'memory',
    reader      :  {
        type    :   'json',
        rootProperty    :   'Delms'
    }
});
