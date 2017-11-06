Ext.define('Valence.login.view.tablet.connection.Connection', {
    extend     : 'Ext.Container',
    requires   : [
        'Ext.Toolbar',
        'Ext.Button',
        'Ext.field.Text',
        'Ext.field.Number',
        'Ext.form.Panel',
        'Ext.layout.VBox',
        'Valence.login.view.connection.ConnectionModel',
        'Valence.login.view.connection.ConnectionController'
    ],
    fullScreen : true,
    xtype      : 'connection-tablet',

    cls    : 'vv-connection-card-tablet',
    layout : {
        type  : 'vbox',
        align : 'center',
        pack  : 'center'
    },
    height : '100%',

    config : {
        items : [{
            xtype     : 'widget_appbar',
            docked    : 'top',
            listeners : {
                titletap : 'onTapTitle'
            }
        }, {
            xtype  : 'container',
            cls    : 'vv-connection-cnt-tablet',
            height : '100%',
            layout : {
                type  : 'vbox',
                align : 'center',
                pack  : 'center'
            },
            items  : [{
                xtype     : 'formpanel',
                reference : 'connectionform',
                cls       : 'vv-connection-form depth-1',
                height    : 360,
                defaults  : {
                    width          : '100%',
                    labelAlign     : 'top',
                    labelSeparator : '',
                    listeners : {
                        keyup : 'onConnectionKeyup'
                    }
                },
                items     : [{
                    xtype     : 'textfield',
                    cls       : 'vv-connection-desc',
                    labelCls  : 'vv-connection-desc-lbl',
                    label     : Valence.lang.lit.description,
                    required  : true,
                    name      : 'desc',
                    reference : 'description'
                }, {
                    xtype     : 'textfield',
                    cls       : 'vv-connection-url',
                    labelCls  : 'vv-connection-url-lbl',
                    label     : Valence.lang.lit.webAddressURL,
                    required  : true,
                    name      : 'url',
                    reference : 'connectionUrl',
                    listeners : {
                        focus : 'onFocusUrl'
                    }
                }, {
                    xtype     : 'numberfield',
                    cls       : 'vv-connection-port',
                    labelCls  : 'vv-connection-port-lbl',
                    label     : 'Port', // todo vlit
                    required  : true,
                    name      : 'port',
                    reference : 'port'
                }, {
                    xtype     : 'textfield',
                    cls       : 'vv-connection-autostartapp',
                    labelCls  : 'vv-connection-autostartapp-lbl',
                    label     : 'Auto Start App ID', // todo vlit
                    name      : 'autostartappid',
                    reference : 'autostartappid'
                }, {
                    xtype : 'component',
                    cls   : 'vv-connection-validation',
                    bind  : {
                        html : '{connectionValidationText}'
                    }
                },{
                    xtype   : 'button',
                    ui      : 'action-valence-blue',
                    text    : Valence.lang.lit.save,
                    cls     : 'vv-connection-save-btn',
                    handler : 'onTapSaveConnection',
                }]
            }]
        }]
    }
});
