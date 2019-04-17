if (typeof Valence !== 'undefined') {
    Ext.form.field.Date.prototype.format = Valence.util.Helper.getDateFormat();
    Ext.onReady(function(){
        if (!Ext.isEmpty(Ext.form)){
            Ext.override(Ext.form.field.Base,{
                getSubmitData : function(){
                    var me = this,
                        data = null,
                        val;
                    if (!me.disabled && me.submitValue && !me.isFileUpload()) {
                        val = me.getSubmitValue();
                        if (val !== null) {
                            data = {};
                            data[me.getName()] = (!me.graphic) ? val : Valence.util.Helper.encodeUTF16(val);
                        }
                    }
                    return data;
                },
                setValue: function(value) {
                    var me = this;
                    if (me.decode){
                        value = Valence.util.Helper.decodeUTF16(value);
                    }
                    me.setRawValue(me.valueToRaw(value));
                    return me.mixins.field.setValue.call(me, value);
                }
            });

            //add db2 o type vtype
            //
            Ext.override(Ext.form.field.VTypes, {
                /**
                 * openTypeMaxLength - validator for db2 open type field max length since we can't
                 *   use the standard maxLength property on the field
                 * @param value
                 * @param fld
                 * @returns {boolean}
                 */
                openTypeMaxLength : function (value, fld) {
                    if (!Ext.isEmpty(value) && !Ext.isEmpty(fld) && !Ext.isEmpty(fld.openMaxLength)) {
                        var getOpenFieldValueInfo = function (value, maxLength) {
                                var length = 0,
                                    maxValue;

                                if (!Ext.isEmpty(value) && Ext.isString(value)) {
                                    var singleByte     = true,
                                        currentLength  = 0,
                                        checkMaxLength = function (index, applying) {
                                            if (Ext.isEmpty(maxValue) && !Ext.isEmpty(maxLength)) {
                                                if (currentLength + applying > maxLength) {
                                                    maxValue = value.substring(0, index);
                                                }
                                            }
                                        },
                                        _byte;

                                    length = value.length;

                                    // loop through string one character at a time
                                    //    count dbcs char as 2 and sbcs as 1 and also account for shift-in and shift-out
                                    //
                                    for (var ii = 0; ii < value.length; ii++) {
                                        _byte = value.charCodeAt(ii);

                                        if (!((_byte <= 0x007F) || (_byte >= 0xFF61 && _byte <= 0xFF9F))) {
                                            if (singleByte) {
                                                checkMaxLength(ii, 4);
                                                currentLength += 4;
                                                length += 3;
                                                singleByte = false;
                                            } else {
                                                checkMaxLength(ii, 2);
                                                currentLength += 2;
                                                length++;
                                            }
                                        } else {
                                            singleByte = true;
                                            checkMaxLength(ii, 1);
                                            currentLength++;
                                        }
                                    }
                                }
                                return {
                                    length   : length,
                                    maxValue : maxValue
                                };
                            },
                            maxLen                = parseInt(fld.openMaxLength),
                            info;

                        if (!Ext.isEmpty(fld.enforceMaxLength) && fld.enforceMaxLength) {
                            info = getOpenFieldValueInfo(value, maxLen);
                            if (!Ext.isEmpty(info.maxValue)) {
                                fld.suspendEvents(false);
                                fld.setValue(info.maxValue);
                                fld.resumeEvents();
                                return true;
                            }
                        } else {
                            info = getOpenFieldValueInfo(value, maxLen);
                        }

                        return (info.length <= maxLen);
                    }
                }
            });

            //new components for db2 o type support
            //
            //<if classic>
            Ext.define('AppTemplate.form.field.OpenText', {
                extend        : 'Ext.form.field.Text',
                xtype         : 'opentextfield',
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
            //</if>
        }
    });
}