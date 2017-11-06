Ext.define('Wrapper.view.app.App', {
    extend : 'Ext.container.Container',
    xtype  : 'app-wrapped-app',

    requires : [
        'Ext.layout.container.Fit',
        'Wrapper.view.app.AppModel'
    ],

    viewModel : 'app',

    layout : {
        type : 'fit'
    },

    items : [{
        xtype : 'component',
        tpl   : '<iframe width="100%" height="100%" frameborder="0" src="{src}"></iframe>',
        bind  : {
            data : '{iframeData}'
        }
    }]
});
