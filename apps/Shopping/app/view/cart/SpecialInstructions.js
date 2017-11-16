Ext.define('Shopping.view.cart.SpecialInstructions', {
    extend        : 'Ext.form.FieldSet',
    requires      : [
        'Ext.form.field.TextArea'
    ],
    xtype         : 'specialinstructions',
    title         : 'Special Instructions',
    cls           : 'cart-fieldset',
    padding       : '5 18 8 15',
    initComponent : function () {
        var me = this;

        Ext.apply(me, {
            items : me.buildItems(me.cartOptions)
        });
        me.callParent(arguments);
    },
    buildItems    : function () {
        var me = this;
        return [{
            xtype         : 'textareafield',
            name          : 'OASPI',
            anchor        : '100%',
            maxLength     : 160,
            maxLengthText : 'This field is limited to 160 characters.',
            bind          : {
                value : {
                    single : me.release,
                    bindTo : '{cartValues.OASPI}'
                }
            }
        }]
    }
});