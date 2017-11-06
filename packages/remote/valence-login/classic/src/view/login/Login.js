Ext.define('Valence.login.view.login.Login', {
    extend        : 'Ext.container.Container',
    requires      : [
        'Ext.button.Button',
        'Ext.form.field.Text',
        'Ext.form.Panel',
        'Ext.layout.container.VBox',
        'Valence.login.view.login.LoginModel',
        'Valence.login.view.login.LoginController',
        'Valence.login.view.lock.Lock',
        'Valence.login.view.changeenvironment.ChangeEnvironment'
    ],
    xtype         : 'login',
    viewModel     : {
        type : 'login'
    },
    controller    : 'login',
    cls           : 'vv-login-cnt',
    layout        : {
        type  : 'vbox',
        align : 'middle'
    },
    basePortal    : true,
    itemId        : 'login-outer',
    initComponent : function () {
        var me = this;

        // suspend the layouts until the image is loaded...
        //
        Ext.suspendLayouts();
        Ext.apply(me, {
            items : me.buildItems()
        });
        me.callParent(arguments);

        me.on({
            scope       : me,
            afterrender : me.onAfterRender
        });
    },

    buildItems : function () {
        // originally had the image set via a binding but this causes
        // the load event of the image to fire twice which didn't allow us
        // to hook into the event properly
        //   were having issues where the form was over the image
        //
        var me = this,
            vm = me.getViewModel();
        return [{
            xtype     : 'image',
            src       : vm.get('image'),
            cls       : 'vv-login-img',
            listeners : {
                load : {
                    element : 'el',
                    fn      : function (el) {
                        Ext.resumeLayouts(true);
                    }
                },
                error : {
                    element : 'el',
                    fn : function(){
                        Ext.resumeLayouts(true);
                    }
                }
            }
        }, {
            xtype     : 'form',
            reference : 'form',
            cls       : 'vv-login-form',
            bodyCls   : 'vv-login-form-body',
            itemId    : 'login-form',
            basePortal : true,
            defaults  : {
                width          : '100%',
                labelAlign     : 'top',
                labelSeparator : ''
            },
            items     : [{
                xtype         : 'textfield',
                cls           : 'vv-login-user',
                msgTarget     : 'under',
                labelClsExtra : 'vv-login-user-lbl',
                fieldLabel    : Valence.lang.lit.userName,
                allowBlank    : false,
                name          : 'user',
                itemId        : 'user',
                reference     : 'user',
                ui            : 'large',
                bind          : {
                    value : '{username}'
                },
                triggers      : {
                    user : {
                        cls : 'login-trigger vvicon-user vv-login-user-trigger'
                    }
                }
            }, {
                xtype          : 'textfield',
                cls            : 'vv-login-pwd',
                msgTarget      : 'under',
                labelClsExtra  : 'vv-login-pwd-lbl',
                name           : 'password',
                itemId         : 'password',
                reference      : 'password',
                validateOnBlur : false,
                ui             : 'large',
                fieldLabel     : Valence.lang.lit.password,
                allowBlank     : false,
                inputType      : 'password',
                bind           : {
                    hidden   : '{forgotPasswordPrompt}',
                    disabled : '{forgotPasswordPrompt}',
                    value    : '{password}'

                },
                triggers       : {
                    lock : {
                        cls : 'login-trigger vvicon-lock vv-login-user-password'
                    }
                },
                listeners      : {
                    specialkey : 'onSpecialKeyPassword'
                }
            }, {
                xtype    : 'button',
                formBind : true,
                cls      : 'vv-login-btn',
                itemId   : 'login-btn',
                bind     : {
                    hidden : '{forgotPasswordPrompt}'
                },
                text     : Valence.lang.lit.login,
                scale    : 'medium',
                handler  : 'onLogin'
            }, {
                xtype    : 'button',
                formBind : true,
                cls      : 'vv-login-sendpwd-btn',
                itemId   : 'sendpwd-btn',
                bind     : {
                    hidden : '{!forgotPasswordPrompt}'
                },
                text     : Valence.lang.lit.sendPassword,
                scale    : 'medium',
                handler  : 'onSendPassword'
            }, {
                xtype     : 'component',
                cls       : 'vv-login-forgotpwd-cancel',
                html      : Valence.lang.lit.cancel,
                bind      : {
                    hidden : '{!forgotPasswordPrompt}'
                },
                listeners : {
                    el : {
                        click : 'onClickCancelForgotPassword'
                    }
                }
            }, {
                xtype     : 'component',
                cls       : 'vv-login-select-lng',
                itemId    : 'selectlng-btn',
                hidden    : !Valence.login.config.Settings.getMultiLingual(),
                html      : Valence.lang.lit.selectLanguage,
                listeners : {
                    el : {
                        click : 'onClickSelectLanguage'
                    }
                }
            }]
        }, {
            xtype     : 'component',
            cls       : 'vv-login-forgot-pwd',
            itemId    : 'forgotpwd-btn',
            bind      : {
                hidden : '{!showForgotPassword}',
                html   : '{forgotPasswordText}'
            },
            listeners : {
                el : {
                    click : 'onClickForgotPassword'
                }
            }
        }];
    },

    onAfterRender : function (cmp) {
        var me = this;
        Ext.on('resize', me.onResizeBrowser, me);
    },

    onDestroy : function () {
        var me = this;
        Ext.un('resize', me.onResizeBrowser, me);
        me.callParent(arguments);
    },

    onResizeBrowser : function () {
        var me = this;
        me.updateLayout();
    }
});