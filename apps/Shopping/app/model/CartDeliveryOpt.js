Ext.define('Shopping.model.CartDeliveryOpt',{
    extend: 'Ext.data.Model',
    type        : 'memory',
    reader      :  {
        type    :   'json',
        rootProperty    :   'Delms'
    }
});
