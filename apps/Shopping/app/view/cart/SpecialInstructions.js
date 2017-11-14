Ext.define('Shopping.view.cart.SpecialInstructions', {
    extend   : 'Ext.form.FieldSet',
    requires : [
        'Ext.form.field.TextArea'
    ],
    xtype    : 'specialinstructions',
    title    : 'Special Instructions',
    cls      : 'cart-fieldset',
    padding  : '5 18 5 15',
    items    : [{
        xtype         : 'textareafield',
        name          : 'OASPI',
        anchor        : '100%',
        maxLength     : 160,
        maxLengthText : 'This field is limited to 160 characters.',
        bind          : {
            value : '{cartValues.OASPI}'
        }
    }]
});