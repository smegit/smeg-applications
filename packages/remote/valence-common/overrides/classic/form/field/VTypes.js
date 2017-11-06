Ext.define('Valence.common.overrides.classic.form.field.VTypes', {
    override          : 'Ext.form.field.VTypes',
    requires          : [
        'Valence.common.util.Helper'
    ],
    /**
     * openTypeMaxLength - validator for db2 open type field max length since we can't
     *   use the standard maxLength property on the field
     * @param value
     * @param fld
     * @returns {boolean}
     */
    openTypeMaxLength : function (value, fld) {
        if (!Ext.isEmpty(value) && !Ext.isEmpty(fld) && !Ext.isEmpty(fld.openMaxLength)) {
            var maxLen = parseInt(fld.openMaxLength),
                info;

            if (!Ext.isEmpty(fld.enforceMaxLength) && fld.enforceMaxLength) {
                //if enforceMaxLength then pass the max to the getOpenFieldValueInfo
                // if the max is hit set the value to the max
                //
                info = Valence.common.util.Helper.getOpenFieldValueInfo(value, maxLen);
                if (!Ext.isEmpty(info.maxValue)) {
                    fld.suspendEvents(false);
                    fld.setValue(info.maxValue);
                    fld.resumeEvents();
                    return true;
                }
            } else {
                info = Valence.common.util.Helper.getOpenFieldValueInfo(value);
            }

            return (info.length <= maxLen);
        }
    }
});