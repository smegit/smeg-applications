Ext.define('ShoppingCart.plugin.form.field.ClearValue',{
    extend : 'Ext.plugin.Abstract',
    alias  : 'plugin.formfieldclearvalue',
    config : {
        boundCmp   : null,
        triggerKey : 'clear'
    },
    init : function(field) {
        if (!field.isFormField){
            return;
        }
        var me = this,
            triggers = field.getTriggers(),
            key = me.getTriggerKey();

        me.setBoundCmp(field);

        if (!triggers) {
            triggers = {};
        }

        if (triggers[key] !== undefined) {
            return;
        }

        triggers[key] = {
            scope          : me,
            weight         : -2, //place before existing triggers
            hidden         : true,
            hideOnReadOnly : false,
            cls            : 'x-form-clear-trigger',
            handler        : me.onClickClearInput
        };

        //be sure keyEvents are turned on; then listen for keyup
        field.enableKeyEvents = true;
        field.on({
            scope  : me,
            change : me.onChange
        });

        field.setTriggers(triggers);
    },

    onClickClearInput : function(){
        var me = this,
            fld = me.getCmp();

        fld.reset();
        fld.triggers.clear.el.fadeOut();
        fld.fireEvent('clear', fld);
    },

    onChange : function(cmp){
        var val = cmp.getValue(),
            key = this.getTriggerKey();

        cmp.triggers[key].el[ !Ext.isEmpty(val) ? 'fadeIn' : 'fadeOut' ]();
    }
});
