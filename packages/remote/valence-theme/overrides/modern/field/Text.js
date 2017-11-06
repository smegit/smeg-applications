Ext.define('Ext.overrides.field.Text',{
    override : 'Ext.field.Text',

    config : {
        invalid : false,
        invalidMsg : null,
        readOnly : false
    },

    setInvalid : function(invalid,msg){
        var me = this,
            el = Ext.get(me.element),
            inputEl = Ext.get(el.selectNode('.x-field-input')),
            invalidMsg = me.getInvalidMsg(),
            errorText = Valence.lang.lit.ERROR;

        if (invalid){
            if (Ext.isEmpty(invalidMsg)){
                me.setInvalidMsg(inputEl.insertHtml('afterEnd',Ext.util.Format.format('<div class="vv-mdrn-invalid-msg">{0}</div>',msg || errorText)));
            } else {
                invalidMsg = Ext.get(invalidMsg);
                invalidMsg.setHtml(msg || errorText);
            }
        }
        me.toggleCls('vv-mdrn-invalid',invalid);
    },

    setReadOnly : function(readOnly){
        var me = this;
        me.toggleCls('x-field-readonly',readOnly);
        me.callParent(arguments);
    }
});
