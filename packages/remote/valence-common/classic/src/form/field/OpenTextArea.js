/**
 * This is for support of db2 open data types "Japan" for text areas
 */
Ext.define('Valence.common.form.field.OpenTextArea', {
    extend        : 'Ext.form.field.TextArea',
    xtype         : 'opentextareafield',
    vtype         : 'openTypeMaxLength',
    initComponent : function () {
        var me = this;

        if (!Ext.isEmpty(me.maxLength)) {
            Ext.apply(me, {
                openMaxLength : me.maxLength,
                vtypeText     : Valence.lang.lit.maximumLengthForField.replace('VAR1', me.maxLength)
            });
            delete me.maxLength;
        }

        me.callParent(arguments);
    }
});