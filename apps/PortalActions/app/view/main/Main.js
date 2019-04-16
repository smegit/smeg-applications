Ext.define('PortalActions.view.main.Main', {
    extend : 'Valence.common.widget.NavContainer',
    xtype  : 'app-main',

    requires : [
        'PortalActions.view.main.ActionList',
        'PortalActions.view.main.Header',
        'PortalActions.view.main.MainController',
        'PortalActions.view.main.MainModel',

        'Valence.common.widget.Appbar'
    ],

    controller : 'main',
    viewModel  : 'main',

    bind : {
        activeItem : '{activeItem}'
    },

    reference : 'card',

    initialize : function () {
        var me = this;

        me.add(me.buildItems());
        me.callParent(arguments);
    },

    buildItems : function () {
        var me = this;
        return [{
            xtype     : 'widget_appbar',
            docked    : 'top',
            listeners : {
                back      : 'onTapTitle',
                titletap  : 'onTapTitle',
                filtertap : 'onTapFilterBtn'
            }
        }, {
            xtype  : 'container',
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            items  : [{
                xtype  : 'header',
                docked : 'top'
            }, {
                xtype : 'actionlist',
                flex  : 1
            }]
        }, {
            xtype      : 'container',
            layout     : 'vbox',
            scrollable : null,
            items      : [{
                xtype : 'container',
                flex  : 1
            }, {
                xtype     : 'container',
                reference : 'signaturecontainer',
                height    : 300,
                padding   : 10,
                listeners : {
                    initialize : function (cmp) {
                        var width = window.innerWidth - 30;
                        cmp.setHtml('<canvas width="' + width + 'px" height="280px" style="border:1px solid #777777; background: #fff;"><canvas>');
                    }
                }
            }, {
                xtype  : 'toolbar',
                docked : 'bottom',
                ui     : 'light',
                cls    : 'signature-tlbr',
                items  : [{
                    text    : Valence.lang.lit.clear,
                    ui      : 'transparent',
                    handler : 'onTapClearSignatureButton',
                    xtype   : 'button'
                }, {
                    xtype : 'spacer',
                    flex  : 1
                }, {
                    text    : Valence.lang.lit.save,
                    ui      : 'transparent-action',
                    handler : 'onTapSaveSignatureButton'
                }]
            }]
        }];
    }
});
