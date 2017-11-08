Ext.define('Welcome.view.main.Main', {
    extend     : 'Ext.container.Container',
    xtype      : 'app-main',
    requires   : [
        'Ext.container.Container',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Welcome.view.main.MainController',
        'Welcome.view.main.MainModel',
        'Welcome.view.main.apps.Apps'
    ],
    controller : 'main',
    viewModel  : 'main',
    cls        : 'app-main',
    layout     : {
        type  : 'vbox',
        align : 'stretch'
    },
    items      : [{
        xtype   : 'container',
        width   : '100%',
        padding : 45,
        layout  : {
            type  : 'hbox',
            align : 'stretch'
        },
        items   : [{
            xtype : 'component',
            html  : '&nbsp;',
            flex  : 1
        }, {
            xtype  : 'image',
            src    : '/resources/images/smeg/smeg_logo.png',
            width  : 200,
            height : 50
        }, {
            xtype : 'component',
            html  : '&nbsp;',
            flex  : 1
        }]
    }, {
        xtype    : 'container',
        flex     : 1,
        layout   : {
            type  : 'hbox',
            align : 'stretch'
        },
        defaults : {
            flex : 1,
            cls  : 'depth-1'
        },
        items    : [{
            xtype  : 'apps',
            margin : '0 16 32 32'
        }, {
            xtype       : 'panel',
            title       : 'Specials',
            margin      : '0 16 32 16',
            bodyPadding : 32,
            style       : {
                'border' : '1px solid #d0d0d0'
            },
            html        : '<div style="font-size:15px;font-weight:400;">Content</div>'
        }, {
            xtype       : 'panel',
            title       : 'News',
            margin      : '0 32 32 16',
            bodyPadding : 32,
            style       : {
                'border' : '1px solid #d0d0d0'
            },
            html        : '<div style="font-size:15px;font-weight:400;">Content</div>'
        }]
    }]
});
