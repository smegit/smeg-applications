Ext.define('Valence.common.overrides.classic.form.trigger.Trigger', {
    override   : 'Ext.form.trigger.Trigger',
    setVisible : function (visible) {
        var trigger    = this,
            fieldValue = trigger.field.getValue();
        if (trigger.pluginId === 'clearvalue') {
            if ((!Ext.isEmpty(fieldValue) && visible) || Ext.isEmpty(fieldValue) && !visible) {
                trigger.setHidden(!visible);
            }
        } else {
            trigger.setHidden(!visible);
        }
    }
});