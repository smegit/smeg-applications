Ext.define('Valence.login.view.changeenvironment.ChangeEnvironment',{
    extend        : 'Ext.window.Window',
    requires      : [
        'Ext.grid.Panel',
        'Ext.layout.container.VBox',
        'Valence.common.ux.grid.Renderer'
    ],
    xtype         : 'changeenvironment',
    basePortal    : true,
    cls           : 'vv-chgenv',
    closeAppsMsg  : false,
    initComponent : function(){
        var me = this;
        Ext.apply(me,{
            layout    : {
                type  : 'vbox',
                align : 'stretch'
            },
            title     : Valence.lang.lit.changeEnvironment,
            maxHeight : 450,
            width     : 550,
            modal     : true,
            items     : me.buildItems(),
            buttons   : me.buildButtons()
        });
        me.callParent(arguments);
    },

    buildButtons : function(){
        var me = this;
        return [{
            text    : Valence.lang.lit.cancel,
            scope   : me,
            handler : me.onEsc
        }];
    },

    buildItems : function(){
        var me = this,
            i  = [];

        i.push({
            xtype              : 'grid',
            flex               : 1,
            cls                : 'vv-chgenv-list',
            bubbleEvents       : ['beforeitemclick','itemclick'],
            store              : Ext.getStore('Login_Environments'),
            enableColumnHide   : false,
            enableColumnMove   : false,
            enableColumnResize : false,
            columns            : [{
                text         : Valence.lang.lit.environment,
                menuDisabled : true,
                dataIndex    : 'envName',
                flex         : 1
            }, {
                menuDisabled : true,
                dataIndex    : 'current',
                width        : 100,
                align        : 'center',
                renderer     : Valence.common.ux.grid.Renderer.tick
            }]
        });
        if (me.closeAppsMsg){
            i.push({
                xtype : 'component',
                cls   : 'vv-chgenv-appclose-msg',
                html  : Valence.lang.lit.allRunningAppsClose
            });
        }


        return i;
    }
});