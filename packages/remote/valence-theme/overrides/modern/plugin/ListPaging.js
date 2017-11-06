Ext.define('Ext.overrides.modern.plugin.ListPaging',{
    override : 'Ext.plugin.ListPaging',
    initialize : function(){
        var me = this;

        me.setNoMoreRecordsText(Valence.lang.lit.noMoreRecords);
        me.setLoadMoreText(Valence.lang.lit.loadMore);

        me.callParent(arguments);
    }
});