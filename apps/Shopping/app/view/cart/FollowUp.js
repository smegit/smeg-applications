Ext.define('Shopping.view.cart.FollowUp', {
    extend        : 'Ext.form.FieldSet',
    requires      : [
        'Ext.form.FieldContainer',
        'Ext.form.field.Date',
        'Ext.form.field.TextArea',
        'Ext.layout.container.HBox'
    ],
    xtype         : 'followup',
    title         : 'Follow-Up',
    cls           : 'cart-fieldset',
    padding       : '5 18 8 15',
    layout        : {
        type  : 'hbox',
        align : 'stretch'
    },
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
            xtype : 'fieldcontainer',
            items : [{
                xtype        : 'datefield',
                name         : 'OAFUDT',
                reference    : 'followUpDte',
                width        : 130,
                margin       : '0 16 0 0',
                hideLabel    : true,
                minValue     : new Date(),
                maxValue     : Ext.Date.add(new Date(), Ext.Date.YEAR, 1),
                format       : 'd/m/Y',
                submitFormat : 'Y-m-d',
                bind         : {
                    value : '{cartValues.OAFUDT}'
                }
            }]
        }, {
            flex          : 1,
            xtype         : 'textareafield',
            reference     : 'followUpMsg',
            name          : 'OAFUTX',
            maxLength     : 100,
            maxLengthText : 'This field is limited to 100 characters.',
            bind          : {
                value : '{cartValues.OAFUTX}'
            }
        }]
    }
});