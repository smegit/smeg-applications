Ext.define('Ext.overrides.dataview.List', {
    override : 'Ext.dataview.List',

    deferEmptyText : false,

    initialize : function(){
        var me = this;
        me.callParent(arguments);
        if (me.emptyTextPlugin) {
            me.setEmptyText({});
        }
    }
});
