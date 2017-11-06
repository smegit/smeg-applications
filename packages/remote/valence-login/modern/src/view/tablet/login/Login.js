Ext.define('Valence.login.view.tablet.login.Login', {
    extend   : 'Ext.Container',
    requires : [
        'Ext.Toolbar',
        'Ext.Button',
        'Ext.field.Text',
        'Ext.field.Password',
        'Ext.form.Panel',
        'Ext.layout.VBox'
    ],

    xtype : 'login-tablet',

    cls : 'vv-login-cnt-tablet depth-1',

    layout : {
        type  : 'vbox',
        align : 'center',
        pack  : 'center'
    },

    listeners : {
        painted : 'onAfterRenderLogin'
    },

    items : [{
        xtype     : 'button',
        ui        : 'transparent-action',
        handler   : 'onClickConnection',
        reference : 'connectionBtn',
        cls       : 'vv-login-connections vv-login-connections-none',
        bind      : {
            html   : '{connectionsText}',
            hidden : '{!showNoConnection}'
        }
    }, {
        xtype  : 'container',
        cls    : 'vv-login-content-tablet depth-1',
        layout : {
            type  : 'vbox',
            align : 'center',
            pack  : 'center'
        },
        items  : [{
            xtype : 'image',
            cls   : 'vv-login-img'
        }, {
            xtype     : 'formpanel',
            reference : 'form',
            flex      : 1,
            width     : '100%',
            cls       : 'vv-login-form',
            defaults  : {
                labelAlign     : 'top',
                labelSeparator : '',
                listeners      : {
                    keyup : 'onKeyupLogin'
                }
            },
            items     : [{
                xtype          : 'textfield',
                cls            : 'vv-login-user',
                labelCls       : 'vv-login-user-lbl',
                label          : Valence.lang.lit.userName,
                allowBlank     : false,
                autoCapitalize : false,
                autoComplete   : false,
                autoCorrect    : false,
                reference      : 'user',
                name           : 'user',
                bind           : {
                    disabled : '{loginDisabled}',
                    value    : '{username}'
                }
            }, {
                xtype          : 'passwordfield',
                cls            : 'vv-login-pwd',
                labelCls       : 'vv-login-pwd-lbl',
                reference      : 'password',
                name           : 'password',
                label          : Valence.lang.lit.password,
                allowBlank     : false,
                autoCapitalize : false,
                autoComplete   : false,
                autoCorrect    : false,
                bind           : {
                    disabled : '{loginDisabled}',
                    hidden   : '{forgotPasswordPrompt}'
                }
            }, {
                xtype : 'component',
                cls   : 'vv-login-validation',
                bind  : {
                    html   : '{loginValidationText}',
                    hidden : '{loginValidation}'
                }
            }, {
                xtype   : 'button',
                cls     : 'vv-login-btn',
                ui      : 'action-valence-blue',
                text    : Valence.lang.lit.login,
                bind    : {
                    disabled : '{loginDisabled}',
                    hidden   : '{forgotPasswordPrompt}'
                },
                handler : 'onLogin'
            }, {
                xtype   : 'button',
                cls     : 'vv-login-sendpwd-btn',
                ui      : 'action-valence-blue',
                bind    : {
                    disabled : '{loginDisabled}',
                    hidden   : '{!forgotPasswordPrompt}'
                },
                text    : Valence.lang.lit.sendPassword,
                handler : 'onSendPassword'
            }, {
                xtype : 'component',
                cls   : 'vv-login-forgot-pwd-text',
                bind  : {
                    hidden : '{!forgotPasswordPrompt}',
                    html   : '{forgotPasswordText}'
                }
            }, {
                xtype   : 'button',
                cls     : 'vv-login-forgotpw-btn',
                ui      : 'transparent-action-valence-blue',
                bind    : {
                    disabled : '{loginDisabled}',
                    hidden   : '{!showForgotPassword}'
                },
                text    : Valence.lang.lit.forgotPassword,
                handler : 'onClickForgotPassword'
            }, {
                xtype   : 'button',
                cls     : 'vv-login-forgotpwd-cancel',
                ui      : 'transparent-action-valence-blue',
                text    : Valence.lang.lit.cancel,
                bind    : {
                    disabled : '{loginDisabled}',
                    hidden   : '{!forgotPasswordPrompt}'
                },
                handler : 'onClickCancelForgotPassword'
            }]
        }, {
            xtype     : 'button',
            ui        : 'transparent-action',
            reference : 'connectionBtnBottom',
            handler   : 'onClickConnection',
            cls       : 'vv-login-connections-bottom',
            bind      : {
                disabled : '{loginDisabled}',
                html     : '{connectionsText}',
                hidden   : '{!showExistingConnection}'
            }
        }, {
            xtype   : 'button',
            cls     : 'vv-login-language-btn',
            ui      : 'transparent-action-valence-blue',
            hidden  : !Valence.login.config.Settings.getMultiLingual(),
            bind    : {
                disabled : '{loginDisabled}',
                hidden   : '{!showLanguageSelection}'
            },
            text    : 'English',
            handler : 'onClickSelectLanguage'
        }]
    }
    ]
});