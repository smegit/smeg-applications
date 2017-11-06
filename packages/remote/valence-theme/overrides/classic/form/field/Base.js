Ext.define('Ext.overrides.classic.form.field.Base', {
    override       : 'Ext.form.field.Base',
    getSubmitData: function() {
        var me = this,
            data = null,
            val;
        if (!me.disabled && me.submitValue) {
            val = me.getSubmitValue();
            if (val !== null) {
                data = {};
                data[me.getName()] = (!me.graphic) ? val : Valence.util.Helper.encodeUTF16(val);
            }
        }
        return data;
    },
    reset: function(){
        var me = this;

        me.beforeReset();
        me.setValue(me.originalValue);
        me.clearInvalid();
        // delete here so we reset back to the original state
        delete me.wasValid;

        // adding "reset" event....
        //
        me.fireEvent('reset',me);
    }
});