Ext.define('Wrapper.view.main.Main', {
    extend : 'Ext.panel.Panel',
    xtype  : 'app-main',

    requires : [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'Ext.layout.container.Fit',
        'Ext.layout.container.Card',
        'Valence.common.widget.Appbar',

        'Wrapper.view.main.MainController',
        'Wrapper.view.main.MainModel'
    ],

    plugins : ['viewport'],

    controller : 'main',
    viewModel  : 'main',

    layout : {
        type : 'card'
    },

    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            dockedItems : me.buildDockedItems()
        });
        me.callParent(arguments);
    },

    buildDockedItems : function () {
        var me = this;
        return [{
            xtype     : 'widget_appbar',
            dock      : 'top',
            height    : 70,
            endItems  : [{
                ui    : 'transparent',
                scale : 'medium',
                text  : Valence.login.config.Runtime.getLoginData().loginId,
                menu  : {
                    items : [{
                        reference : 'changePassword',
                        text      : Valence.lang.lit.changePassword,
                        listeners : {
                            click : 'onClickChangePassword'
                        }
                    }, {						
						reference : 'lock',
                        text      : Valence.lang.lit.lock,
                        listeners : {
                            click : 'onClickLock'
                        }
                    }, {
                        reference : 'logout',
                        text      : Valence.lang.lit.logout,
                        listeners : {
                            click : 'onClickLogout'
                        }
                    }]
                }
            }],
            listeners : {
                appselected : 'onAppSelected'
            }
        }];
    }
});
