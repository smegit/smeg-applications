Ext.define('Ext.overrides.field.Text', {
    override : 'Ext.field.Text',

    config : {
        invalid        : false,
        invalidMsg     : null,
        readOnly       : false,
        forceUppercase : false
    },

    initialize : function () {
        var me = this;
        me.callParent(arguments);

        if (me.getForceUppercase()) {
            me.on({
                scope  : me,
                change : me.onChangeTextValue
            });
        }
    },

    onChangeTextValue : function(cmp, value){
        var me = this;
        cmp.suspendEvents(false);
        me.setValue(Ext.util.Format.uppercase(value));
        cmp.resumeEvents();
    },

    setInvalid : function (invalid, msg) {
        var me         = this,
            el         = Ext.get(me.element),
            inputEl    = Ext.get(el.selectNode('.x-field-input')),
            invalidMsg = me.getInvalidMsg(),
            errorText  = Valence.lang.lit.ERROR;

        if (invalid) {
            if (Ext.isEmpty(invalidMsg)) {
                me.setInvalidMsg(inputEl.insertHtml('afterEnd', Ext.util.Format.format('<div class="vv-mdrn-invalid-msg">{0}</div>', msg || errorText)));
            } else {
                invalidMsg = Ext.get(invalidMsg);
                invalidMsg.setHtml(msg || errorText);
            }
        }
        me.toggleCls('vv-mdrn-invalid', invalid);
    },

    setReadOnly : function (readOnly) {
        var me = this;
        me.toggleCls('x-field-readonly', readOnly);
        me.callParent(arguments);
    }
});
