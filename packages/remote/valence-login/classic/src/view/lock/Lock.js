Ext.define('Valence.login.view.lock.Lock',{
    extend        : 'Ext.container.Container',
    requires      : [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.Img',
        'Ext.layout.container.VBox',
        'Valence.login.view.login.LoginModel',
        'Valence.login.view.login.LoginController'
    ],
    xtype         : 'lock',
    viewModel     : {
        type : 'login'
    },
    controller    : 'login',
    cls           : 'vv-lock-cnt',
    layout        : {
        type  : 'vbox',
        align : 'middle'
    },
    basePortal    : true,
    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            items : me.buildItems()
        });
        me.callParent(arguments);
    },

    buildItems : function () {
        return [{
            xtype   : 'image',
            src     : Valence.login.util.Helper.getHookValue('ui.lockLogoUrl') || '/resources/images/valence_logo.png',
            cls     : 'vv-lock-img'
        }, {
            xtype     : 'form',
            reference : 'form',
            cls       : 'vv-lock-form depth-1',
            bodyCls   : 'vv-lock-form-body',
            defaults  : {
                width          : '100%',
                labelAlign     : 'top',
                labelSeparator : ''
            },
            items     : [{
                xtype         : 'textfield',
                cls           : 'vv-lock-pwd',
                labelClsExtra : 'vv-lock-pwd-lbl',
                name          : 'password',
                reference     : 'password',
                msgTarget     : 'under',
                fieldLabel    : Valence.lang.lit.password,
                allowBlank    : false,
                inputType     : 'password',
                ui            : 'large',
                triggers      : {
                    lock : {
                        cls : 'login-trigger vvicon-lock vv-lock-user-password'
                    }
                },
                listeners     : {
                    specialkey : 'onSpecialKeyPassword'
                }
            }, {
                xtype    : 'button',
                formBind : true,
                cls      : 'vv-login-btn',
                text     : Valence.lang.lit.ok,
                scale    : 'medium',
                handler  : 'onUnlock'
            }]
        },{
            xtype : 'component',
            tpl   : [
                '<div class="vv-lock-text">{[fm.uppercase(values.text)]}</div>'
            ],
            bind : {
                data : '{lockText}'
            }
        }];

    }
});