Ext.define('Valence.common.ux.plugin.form.field.ClearValue', {
    extend : 'Ext.plugin.Abstract',
    alias  : 'plugin.formfieldclearvalue',
    config : {
        boundCmp   : null,
        triggerKey : 'clear'
    },

    pluginId   : 'clearvalue',
    disabled   : false,
    verbose    : false,
    hideOnBlur : false,

    init : function (field) {
        if (!field.isFormField) {
            if (this.verbose) {
                console.log('Must be a form field');
            }
            return;
        }
        var me             = this,
            triggers       = field.getTriggers(),
            key            = me.getTriggerKey(),
            fieldListeners = {
                scope  : me,
                change : me.onChange,
                reset  : me.onReset,
                render : me.onRender
            };

        me.setBoundCmp(field);

        if (!triggers) {
            triggers = {};
        }

        if (triggers[key] !== undefined) {
            if (me.verbose) {
                console.error('Component ' + field.getId() + ' already has a trigger with the key "' + key + '". Will not initialize "formfieldclearvalue" on this field.');
            }
            return;
        }

        triggers[key] = me.defineTrigger();

        //be sure keyEvents are turned on; then listen for keyup
        field.enableKeyEvents = true;

        if (me.hideOnBlur) {
            //add additional listeners for blur/focus
            //
            Ext.apply(fieldListeners, {
                blur  : me.onBlur,
                focus : me.onFocus
            });
        }

        field.on(fieldListeners);

        field.setTriggers(triggers);

        me.callParent(arguments);
    },

    disable : function () {
        var me       = this,
            fld      = me.getCmp(),
            triggers = fld.getTriggers();

        if (!Ext.isEmpty(triggers.clear)) {
            triggers.clear.hide();
            triggers.clear.el.fadeOut();
        }

        me.disabled = true;

        me.callParent(arguments);
    },

    enable : function () {
        var me       = this,
            fld      = me.getCmp(),
            triggers = fld.getTriggers();
        me.disabled  = false;
        if (!Ext.isEmpty(triggers.clear)) {
            if (Ext.isEmpty(fld.getValue()) || fld.readOnly) {
                triggers.clear.setHidden(true);
                triggers.clear.el.fadeOut();
            }
        }

        me.callParent(arguments);
    },


    onClickClearInput : function () {
        var me  = this,
            fld = me.getCmp(),
            key = me.getTriggerKey(),
            trigger =fld.triggers[key];

        fld.setValue('');
        trigger.hide();
        fld.fireEvent('clear', fld);
    },

    onChange : function (cmp) {
        var me  = this,
            val = cmp.getValue(),
            key = me.getTriggerKey(),
            trigger =cmp.triggers[key];

        if (cmp.hasFocus){
            if (!me.disabled && !cmp.readOnly) {
                trigger[!Ext.isEmpty(val) ? 'show' : 'hide']();
            } else {
                trigger.el['fadeOut']();
            }
        }
    },

    onReset : function(cmp){
        var me  = this,
            key = me.getTriggerKey(),
            trigger =cmp.triggers[key];

        trigger.hide();
    },

    onBlur : function (cmp) {
        var me           = this,
            key          = me.getTriggerKey(),
            clearTrigger = cmp.triggers[key];
        if (!Ext.isEmpty(clearTrigger)) {
            clearTrigger.hide();
        }
    },

    onFocus : function (cmp) {
        var me           = this,
            key          = me.getTriggerKey(),
            clearTrigger = cmp.triggers[key];
        if (!Ext.isEmpty(clearTrigger) && !Ext.isEmpty(cmp.getValue())) {
            clearTrigger.show();
        }
    },

    onRender : function (cmp) {
        var me  = this,
            val = cmp.getValue(),
            key = me.getTriggerKey();

        if (!me.disabled && !cmp.readOnly) {
            if (!Ext.isEmpty(val)){
                cmp.triggers[key].el['fadeIn']();
            }
            //cmp.triggers[key].el[!Ext.isEmpty(val) ? 'fadeIn' : 'fadeOut']();
        } else {
            cmp.triggers[key].el['fadeOut']();
        }
    },

    defineTrigger : function () {
        var me = this;
        return {
            scope   : me,
            weight  : 1, //place after existing triggers
            hidden  : true,
            cls     : 'vvicon-cancel-circle vv-icon-trigger-medium',
            handler : me.onClickClearInput,
            style   : 'display:none;'
        };
    }
});
