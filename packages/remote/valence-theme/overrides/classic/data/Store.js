Ext.define('Ext.overrides.classic.data.Store', {
    override       : 'Ext.data.Store',
    constructDataCollection : function(){
        return new Ext.util.Collection({
            rootProperty   : 'data',
            multiSortLimit : this.multiSortLimit || 10
        });
    }
});