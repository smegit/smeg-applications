Ext.define('Shopping.view.cart.DeliveryOptions', {
    extend        : 'Ext.form.FieldSet',
    requires      : [
        'Ext.layout.container.Table'
    ],
    xtype         : 'deliveryoptions',
    title         : 'Delivery Options',
    cls           : 'cart-fieldset',
    padding       : '5 10 8 10',
    layout        : {
        type    : 'table',
        columns : 3
    },
    scrollable    : 'x',
    defaults      : {
        xtype          : 'checkbox',
        uncheckedValue : '0',
        inputValue     : '1',
        width          : '100%'
    },
    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            items : me.buildItems()
        });
        me.callParent(arguments);
    },
    buildItems    : function () {
        var me      = this,
            options = me.lookupViewModel().get('deliveryOptions'),
            items   = [];

        if (!Ext.isEmpty(options)){
            for (var ii = 0; ii < options.length; ii++) {
                items.push({
                    boxLabel : options[ii].DELD,
                    name     : options[ii].DELC
                });
            }
        }
        return items;
    }
});