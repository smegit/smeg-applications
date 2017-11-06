Ext.define('Valence.common.widget.hsteps.HSteps', {
    extend     : 'Ext.view.View',
    requires   : [
        'Valence.common.widget.hsteps.HStepsModel',
        'Valence.common.widget.hsteps.HStepsController'
    ],
    xtype       : 'widget_hsteps',

    viewModel   : {
        type : 'hsteps'
    },

    controller   : 'hsteps',
    itemSelector : 'div.hs-step-wrap',
    selectedItemCls : 'hs-selected',
    cls          : 'hs-wrap',
    autoSelect   : 0,
    tpl          : [
        '<div class="hs-inner">',
            '<tpl for=".">',
                '<div class="hs-step-wrap {[this.getAdditionalCls(values)]}">',
                    '<div class="hs-step">',
                        '<tpl if="sts == \'C\'">',
                            '<div class="hs-step-circle"><div class="vvicon-checkmark hs-step-cmpl"></div></div>',
                        '<tpl elseif="sts == \'I\'">',
                            '<div class="hs-step-circle"><div class="vvicon-warning hs-step-incmpl"></div></div>',
                        '<tpl else>',
                            '<div class="hs-step-circle">{[this.getStepValue(values, xindex)]}</div>',
                        '</tpl>',
                        '<div class="hs-step-text">{text}</div>',
                        '<tpl if="subtext">',
                            '<div class="hs-step-subtext">{subtext}</div>',
                        '</tpl>',
                    '</div>',
                    '<div class="hs-step-line"></div>',
                '</div>',
            '</tpl>',
        '</div>',{
            getAdditionalCls : function(v){
                if (v.sts && v.sts === 'C'){
                    return 'hs-complete';
                } else if (v.sts && v.sts === 'I'){
                    return 'hs-incomplete';
                }
            },
            getStepValue : function(v, index){
                if (!Ext.isEmpty(v.step)){
                    return v.step
                }
                return index;
            }
        }
    ],
    listeners : {
        beforeselect    : 'onBeforeselectStep',
        afterrender     : {
            delay : 200,
            fn    : 'onAfterrender'
        }
    },

    first : function(){
        var me = this,
            str = me.getStore(),
            rec = str.getAt(0);
        
        if (!Ext.isEmpty(rec)){
            me.getSelectionModel().select(rec);
        }
    },

    getCurrentStep : function () {
        var me        = this,
            selection = me.getSelection();

        if (!Ext.isEmpty(selection)) {
            return me.getSelection()[0];
        }
        return null;
    },

    next : function(setComplete){
        var me    = this,
            str   = me.getStore(),
            count = str.getCount()- 1,
            rec   = me.getSelection()[0],
            index;

        if (rec){
            if (setComplete){
                rec.set('sts','C');
            }
            index = str.indexOf(rec);
            index += 1;
            if (index <= count){
                me.getSelectionModel().select(str.getAt(index));
            }
        }
    },

    previous : function(setNotComplete){
        var me    = this,
            str   = me.getStore(),
            rec   = me.getSelection()[0],
            index;

        if (rec){
            index = str.indexOf(rec);
            index -= 1;
            if (index >= 0){
                if (setNotComplete){
                    str.getAt(index).set('sts','');
                }
                me.getSelectionModel().select(str.getAt(index));
            }
        }
    },

    setActive : function(stepRec){
        var me    = this,
            str   = me.getStore();

        if (!Ext.isEmpty(stepRec)){
            me.getSelectionModel().select(stepRec);
        }
    }
});