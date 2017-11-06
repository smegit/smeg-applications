Ext.define('Valence.common.widget.Selector',{
    extend          : 'Ext.view.View',
    xtype           : 'widget_selector',
    store           : null,
    valueField      : 'value',
    itemCls         : 'w-selector-item',
    overItemCls     : 'w-selector-item-over',
    selectedItemCls : 'w-selector-item-sel',
    deselectOnClick : false,
    trackMouse      : true,
    displayField    : 'desc',
    cls             : 'x-field x-form-item w-selector-wrap',
    autoSelect      : -1,
    manualSet       : false,
    itemStyle       : null,
    tooltipField    : null,
    isFormField     : true,
    height          : 27,
    initComponent   : function(){
        var me = this;
        if (!Ext.isEmpty(me.additionalCls)){
            me.cls = me.cls + ' ' + me.additionalCls;
        }
        Ext.applyIf(me,{
            itemSelector : 'div.' + me.itemCls,
            tpl          : this.buildTpl()
        });
        me.callParent(arguments);

        me.on({
            scope           : me,
            afterrender     : me.onAfterRender,
            beforeitemclick : me.onBeforeItemClick,
            selectionchange : {
                buffer : 350,
                fn     : me.onSelectionChangeList
            }
        });
    },

    buildTpl : function(){
        var me = this;
        return Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '<div {[this.getItemStyle(xindex)]} {[this.getTooltip(values)]} class="' + me.itemCls + '">',
            '{[this.getValue(values)]}',
            '</div>',
            '</tpl>',{
                getItemStyle : function(i){
                    var style = me.itemStyle;
                    if (me.itemStyle){
                        if (i > 1){
                            style += 'border-left:none;';
                        }
                        return 'style="' + style + '"';
                    } else if (i > 1){
                        return 'style="border-left:none;' + '"';
                    }
                },
                getTooltip : function(v){
                    if (me.tooltipField){
                        return 'data-qtip="' + v[me.tooltipField] + '"';
                    }
                },
                getValue : function(v){
                    return v[me.displayField];
                }
            }
        );
    },

    deselectSelected : function(){
        var me = this,
            recs = me.getSelectionModel().getSelection();
        for (var ii=0; ii<recs.length; ii++){
            me.selModel.deselect(recs[ii],true);
        }
    },

    getDisplayValue : function(){
        var me = this,
            recs = me.getSelectionModel().getSelection();
        if (recs.length === 0){
            return null;
        } else if (recs.length === 1){
            return recs[0].get(me.displayField);
        } else {
            var r = [];
            for (var ii=0; ii < recs.length; ii++){
                r.push(recs[ii].get(me.displayField));
            }
            return r;
        }
    },

    getSubmitData : function(){
        var me = this,
            o  = {};

        o[me.name] = me.getValue();
        return o;
    },

    getSubmitValue : function(){
        var me = this;
        return me.getValue();
    },

    getValue : function(){
        var me = this,
            recs = me.getSelectionModel().getSelection();
        if (recs.length === 0){
            return null;
        } else if (recs.length === 1){
            return recs[0].get(me.valueField);
        } else {
            var r = [];
            for (var ii=0; ii < recs.length; ii++){
                r.push(recs[ii].get(me.valueField));
            }
            return r;
        }
    },

    isDirty : function(){
        return false;
    },

    isFileUpload : function(){
        return false;
    },

    isValid : function(){
        return true;
    },

    setAutoSelect : function(num){
        var me = this;
        if (num >= 0) {
            if (me.store.getCount() > 0) {
                me.getSelectionModel().select(num);
            }
            me.autoSelect = num;
        }
    },

    setValue : function(v){
        var me = this,
            vals = [],
            rec,
            sm = me.getSelectionModel(),
            str = me.store;

        me.manualSet = true;
        if (!Ext.isArray(v)){
            vals.push(v);
        } else {
            vals = v;
        }
        for (var ii=0; ii<vals.length; ii++){
            rec = str.findRecord(me.valueField,vals[ii]);
            if (rec){
                me.getSelectionModel().select(str.indexOf(rec));
                me.fireEvent('change', me, rec);
            }
        }
        me.manualSet = false;
    },

    validate : function(){
        return true;
    },

    onAfterRender : function(){
        var me = this;
        if (me.autoSelect !== -1){
            if (me.store.getCount()>0){
                me.getSelectionModel().select(me.autoSelect);
            } else {
                me.store.on({
                    scope  : me,
                    single : true,
                    load   : me.onAfterRender
                });
            }
        }
    },

    onBeforeItemClick : function(rec,view){
        var me = this;

        if (!me.manualSet && me.deselectOnClick && me.selModel.isSelected(rec)){
            me.selModel.deselect(rec,true);
            me.fireEvent('itemunclick',me,view,rec);
            return false;
        }
    },

    onSelectionChangeList : function(view, recs){
        var me    = this,
            value = recs[0].get(me.valueField);

        me.publishState('value', value);

        me.fireEvent('change', me, recs, value);
    },

    reset : function(){
        var me = this;
        if (me.autoSelect !== -1){
            if (me.store.getCount()>0){
                me.getSelectionModel().select(me.autoSelect);
            }
        }
    }
});