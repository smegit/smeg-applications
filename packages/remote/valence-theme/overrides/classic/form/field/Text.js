Ext.define('Ext.overrides.classic.form.field.Text', {
    override       : 'Ext.form.field.Text',
    forceUppercase : false,
    initComponent  : function (){
        var me = this;

        if (me.forceUppercase){
            if (!me.fieldStyle){
                me.fieldStyle = 'text-transform:uppercase';
            } else{
                if (Ext.isObject(me.fieldStyle)){
                    Ext.apply(me.fieldStyle, {
                        'text-transform' : 'uppercase'
                    });
                } else if (Ext.isString(me.fieldStyle)){
                    me.fieldStyle += 'text-transform:uppercase;';
                }
            }
        }

        me.callParent(arguments);
    },
    getRawValue    : function (){
        var me = this,
            v  = (me.inputEl ? me.inputEl.getValue() : Ext.valueFrom(me.rawValue, ''));
        if (me.forceUppercase){
            v = Ext.util.Format.uppercase(v);
        }
        me.rawValue = v;
        return v;
    },
    getValue       : function (){
        var me = this;
        if (me.forceUppercase){
            var value = me.callParent(arguments);
            value     = Ext.util.Format.uppercase(value);
            return value;
        } else{
            return me.callParent(arguments);
        }
    },

    setForceUppercase : function (v){
        var me = this;

        me.forceUppercase = v;
        if (me.forceUppercase){
            me.inputEl.setStyle('text-transform', 'uppercase');
        } else{
            me.inputEl.setStyle('text-transform', 'none');
        }
    }
});