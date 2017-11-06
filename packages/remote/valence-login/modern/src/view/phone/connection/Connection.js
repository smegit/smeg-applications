Ext.define('Valence.login.view.phone.connection.Connection', {
    extend     : 'Ext.Container',
    requires   : [
        'Ext.Toolbar',
        'Ext.Button',
        'Ext.field.Text',
        'Ext.form.Panel',
        'Ext.layout.VBox',
        'Valence.login.view.connection.ConnectionModel',
        'Valence.login.view.connection.ConnectionController'
    ],

    xtype      : 'connection-phone',

    cls        : 'vv-connection-card-phone',

    height : '100%',

    scrollable : 'y',

    layout     : {
        type  : 'vbox',
        align : 'stretch'
    },
    config : {
        items : [{
            xtype     : 'widget_appbar',
            docked    : 'top',
            listeners : {
                titletap : 'onTapTitle'
            }
        }, {
            xtype     : 'formpanel',
            reference : 'connectionform',
            record    : 'Valence.login.model.Connection',
            cls       : 'vv-connection-form',
            trackResetOnLoad : false,
            scrollable : 'y',
            layout    : {
                type : 'vbox',
                align: 'center',
                pack : 'center'
            },
            defaults  : {
                width          : '96%',
                labelAlign     : 'top',
                labelSeparator : '',
            },
            items     : [{
                xtype     : 'textfield',
                cls       : 'vv-connection-desc',
                labelCls  : 'vv-connection-desc-lbl',
                label     : Valence.lang.lit.description,
                required  : true,
                name      : 'desc',
                reference : 'description',
                listeners : {
                    keyup : 'onConnectionKeyup'
                }
            }, {
                xtype     : 'textfield',
                cls       : 'vv-connection-url',
                labelCls  : 'vv-connection-url-lbl',
                label     : Valence.lang.lit.webAddressURL,
                required  : true,
                name      : 'url',
                reference : 'connectionUrl',
                listeners : {
                    focus : 'onFocusUrl',
                    keyup : 'onConnectionKeyup'
                }
            }, {
                xtype     : 'textfield',
                cls       : 'vv-connection-port',
                labelCls  : 'vv-connection-port-lbl',
                label     : 'Port', // todo vlit
                required  : true,
                name      : 'port',
                reference : 'port',
                listeners : {
                    focus : 'onFocusPhoneField',
                    keyup : 'onConnectionKeyup'
                }
            }, {
                xtype     : 'textfield',
                cls       : 'vv-connection-autostartapp',
                labelCls  : 'vv-connection-autostartapp-lbl',
                label     : 'Auto Start App ID', // todo vlit
                name      : 'autostartappid',
                reference : 'autostartappid',
                listeners : {
                    focus : 'onFocusPhoneField',
                    keyup : 'onConnectionKeyup'
                }
            }, {
                xtype : 'component',
                cls   : 'vv-connection-validation',
                bind  : {
                    html : '{connectionValidationText}'
                }
            }]
        },{
            xtype : 'toolbar',
            docked  : 'bottom',
            border : 0,
            defaults : {
                flex : 1
            },
            items : [{
                xtype   : 'button',
                ui : 'transparent',
                text    : Valence.lang.lit.remove,
                handler : 'onTapRemoveConnection',
                bind : {
                    hidden : '{!inConnectionEditMode}'
                }
            },'->',{
                xtype   : 'button',
                ui      : 'action-valence-blue',
                text    : Valence.lang.lit.save,
                cls     : 'vv-connection-save-btn',
                handler : 'onTapSaveConnection'
            }]

        }]
    }
});