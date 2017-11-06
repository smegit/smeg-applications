Ext.define('Ext.overrides.MessageBox',{
    override : 'Ext.MessageBox',

    wait : function(config){
        var me = this;
        console.log('need to add progress bar');
        me.show(config);
    }
});
