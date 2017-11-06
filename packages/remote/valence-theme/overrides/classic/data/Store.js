Ext.define('Ext.overrides.classic.data.Store', {
    override       : 'Ext.data.Store',
    compatibility  : ['6.0.1','6.0.2'],
    constructDataCollection : function(){
        return new Ext.util.Collection({
            rootProperty   : 'data',
            multiSortLimit : this.multiSortLimit || 10
        });
    }
});