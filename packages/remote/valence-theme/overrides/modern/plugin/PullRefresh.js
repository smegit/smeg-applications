Ext.define('Ext.overrides.modern.plugin.PullRefresh',{
    override : 'Ext.plugin.PullRefresh',
    initialize : function(){
        var me  = this,
            lit = Valence.lang.lit;

        me.setPullText(lit.pullDownToUpdate);
        me.setReleaseText(lit.releaseToRefresh);
        me.setLoadingText(lit.loading);
        me.setLoadedText(lit.loaded);
        me.setLastUpdatedText(lit.lastUpdated + ':&nbsp;');
        // todo -- callback not firing
        //Valence.util.Helper.getDateFormat({
        //
        //    callback : function(){
        //        //me.setLastUpdatedDateFormat();
        //    }
        //});

        me.callParent(arguments);
    }
});