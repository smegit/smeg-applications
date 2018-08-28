Ext.define('Wrapper.view.app.App', {
    extend : 'Ext.container.Container',
    xtype  : 'app-wrapped-app',
    requires : [
        'Ext.layout.container.Fit',
        'Ext.ux.IFrame',
        'Wrapper.view.app.AppModel'
    ],
    viewModel : 'app',
    layout : {
        type : 'fit'
    },
    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            items : me.buildItems()
        });
        me.callParent(arguments);
    },
    buildItems : function(){
        var me = this,
            vm = me.getViewModel();
        return [{
            xtype     : 'uxiframe',
            app : vm.get('app'),
            src : vm.get('src')
        }]
    }
});
