Ext.define('Ext.overrides.classic.form.field.Number', {
    override : 'Ext.form.field.Number',
    setDecimalPrecision : function(v){
        this.decimalPrecision = v;
    }
});