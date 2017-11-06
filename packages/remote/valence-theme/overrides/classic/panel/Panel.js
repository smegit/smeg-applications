Ext.define('Ext.overrides.classic.panel.Panel', {
    override      : 'Ext.panel.Panel',

    // used to hold reference to the appBar textfield
    fltrFld : null,

    hideFilterBar : function () {
        var me  = this,
            bar = me.down('#filterbar');

        if (bar) {
            bar.hide();
        }

        if (!Ext.isEmpty(me.fltrFld)){
            me.fltrFld.setValue('');
        }
    },

    onClickClearFilter : function () {
        var me = this;
        me.fireEvent('clearfilter', me);
        me.hideFilterBar();
    },

    showFilterBar : function (filterText,fld) {
        var me  = this,
            bar = me.down('#filterbar');

        if (!Ext.isEmpty(fld)){
            me.fltrFld = fld;
        }

        if (!bar) {
            me.addDocked({
                xtype  : 'toolbar',
                ui     : 'background',
                itemId : 'filterbar',
                items  : [{
                    xtype   : 'button',
                    ui      : 'transparent',
                    iconCls : 'vvicon-19 vvicon-cancel-circle',
                    scope   : me,
                    handler : me.onClickClearFilter
                },{
                    xtype : 'tbtext',
                    html  : Valence.lang.lit.limitedBy + ': "' + filterText + '"'
                }]
            });
        } else {
            bar.down('tbtext').update(Valence.lang.lit.limitedBy + ': "' + filterText + '"');
            bar[Ext.isEmpty(filterText) ? 'hide' : 'show']();
        }
    }
});