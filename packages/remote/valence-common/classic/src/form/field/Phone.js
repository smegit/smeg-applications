Ext.define('Valence.common.form.field.Phone', {
    extend : 'Ext.form.field.Text',
    xtype : 'phonefield',

    submitNumbersOnly : true,
    maxLength        : 14,
    enforceMaxLength : true,
    config           : {
        phoneNumber : null,
    },
    vtype : 'phone',

    /**
     * Phone Field is used to display Phone Numbers. It will mask values and control the way values
     *  are submitted to the backend
     * Format (###) ###-####
     *
     * ## Example usage
     *     {
     *         xtype : 'phonefield',
     *         submitNumbersOnly : true
     *     }
     *
     * @param {Boolean} submitNumbersOnly Used to remove formatting
     */
    initComponent : function () {
        var me        = this,
            listeners = {
                scope  : me,
                change : me.updateField
            };

        me.callParent(arguments);
        me.setListeners(listeners);

        Ext.apply(Ext.form.field.VTypes, {
            //  vtype validation function
            phone     : function (val) {
                var numbersOnly = val.replace(/[^0-9]/g, '');

                //make sure the length is 10
                //
                return (numbersOnly.length === 10);
            },
            phoneRe   : '',
            // vtype Text property: The error text to display when the validation function returns false
            phoneText : 'Invalid phone number',
            // vtype Mask property: The keystroke filter mask
            phoneMask : /[0-9]/
        });
    },

    updateField : function (field, newVal) {
        var me = this;

        if (!Ext.isEmpty(newVal)) {
            //set the phone number with just the numbers
            me.setPhoneNumber(newVal.replace(/[^0-9#]/g, ''));

            //format the value
            //
            var items = newVal.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            newVal    = !items[2] ? items[1] : '(' + items[1] + ') ' + items[2] + (items[3] ? '-' + items[3] : '');

            field.suspendEvents();
            field.setValue(newVal);
            field.resumeEvents(true);
            field.validate();
        } else {
            me.setPhoneNumber(null);
        }
    },

    setSubmitValue : function (value) {
        return value;
    },

    getSubmitValue : function () {
        var me  = this,
            val = me.processRawValue(me.getRawValue());

        if (!Ext.isEmpty(val)) {
            if (me.submitNumbersOnly) {
                val = val.replace(/[^0-9]/g, '');
                val = parseInt(val);
            }
        } else {
            val = null;
        }
        return val;
    }
});