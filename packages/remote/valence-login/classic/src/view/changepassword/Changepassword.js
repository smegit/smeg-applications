Ext.define('Valence.login.view.changepassword.Changepassword', {
    extend       : 'Ext.Window',
    requires     : [
        'Ext.button.Button',
        'Ext.form.field.Text',
        'Ext.form.Panel',
        'Ext.layout.container.Fit',
        'Valence.login.view.changepassword.ChangepasswordController',
        'Valence.login.view.changepassword.ChangepasswordModel'
    ],
    xtype        : 'changepassword',
    basePortal   : true,
    cls          : 'vv-chg-pwd',
    autoShow     : true,
    viewModel    : {
        type : 'changepassword'
    },
    controller   : 'changepassword',
    layout       : 'fit',
    width        : 400,
    modal        : true,
    title        : Valence.lang.lit.changePassword,
    defaultFocus : '[name=curpwd]',
    buttons      : [{
        text    : Valence.lang.lit.cancel,
        handler : 'onClickCancel'
    }],
    items        : [{
        xtype       : 'form',
        reference   : 'form',
        cls         : 'vv-chg-pwd-form',
        bodyPadding : '8 24',
        defaults    : {
            xtype          : 'textfield',
            allowBlank     : false,
            inputType      : 'password',
            labelAlign     : 'top',
            labelSeparator : '',
            anchor         : '100%',
            msgTarget      : 'under'
        },
        items       : [{
            reference     : 'curpwd',
            fieldLabel    : Valence.lang.lit.currentPassword,
            cls           : 'vv-chgpwd-cur',
            labelClsExtra : 'vv-chgpwd-cur-lbl',
            name          : 'curpwd',
            listeners     : {
                specialkey : 'onSpecialKeyPassword'
            }
        }, {
            reference     : 'newpwd',
            fieldLabel    : Valence.lang.lit.newPassword,
            cls           : 'vv-chgpwd-new',
            labelClsExtra : 'vv-chgpwd-new-lbl',
            name          : 'newpwd',
            listeners     : {
                specialkey : 'onSpecialKeyPassword'
            }
        }, {
            reference     : 'newpwd2',
            fieldLabel    : Valence.lang.lit.retypeNewPassword,
            cls           : 'vv-chgpwd-new2',
            labelClsExtra : 'vv-chgpwd-new2-lbl',
            name          : 'newpwd2',
            listeners     : {
                specialkey : 'onSpecialKeyPassword'
            }
        }, {
            xtype    : 'button',
            formBind : true,
            cls      : 'vv-chgpwd-ok-btn',
            text     : Valence.lang.lit.ok,
            scale    : 'medium',
            handler  : 'onClickOk'
        }]
    }]
});
