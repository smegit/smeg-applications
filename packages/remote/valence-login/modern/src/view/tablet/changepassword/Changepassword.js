Ext.define('Valence.login.view.tablet.changepassword.Changepassword', {
    extend     : 'Ext.Container',

    requires : [
        'Ext.Toolbar',
        'Ext.field.Password',
        'Ext.field.Text',
        'Ext.form.Panel'
    ],
    layout : 'fit',
    xtype      : 'changepassword-tablet',
    cls        : 'vv-chg-pwd-tblt',

    items      : [{
        xtype       : 'formpanel',
        reference   : 'form',
        cls         : 'vv-chg-pwd-form',
        defaultType : 'textfield',
        defaults    : {
            allowBlank     : false,
            inputType      : 'password',
            labelAlign     : 'top'
        },
        items       : [{
            reference     : 'curpwd',
            label    : Valence.lang.lit.currentPassword,
            cls           : 'vv-chgpwd-cur',
            labelCls : 'vv-chgpwd-cur-lbl',
            name          : 'curpwd',
            listeners     : {
                specialkey : 'onSpecialKeyPassword'
            }
        }, {
            xtype : 'passwordfield',
            reference     : 'newpwd',
            label    : Valence.lang.lit.newPassword,
            cls           : 'vv-chgpwd-new',
            labelCls : 'vv-chgpwd-new-lbl',
            name          : 'newpwd',
            listeners     : {
                specialkey : 'onSpecialKeyPassword'
            }
        }, {
            xtype : 'passwordfield',
            reference     : 'newpwd2',
            label    : Valence.lang.lit.retypeNewPassword,
            cls           : 'vv-chgpwd-new2',
            labelCls : 'vv-chgpwd-new2-lbl',
            name          : 'newpwd2',
            listeners     : {
                specialkey : 'onSpecialKeyPassword'
            }
        }, {
            xtype : 'toolbar',
            docked : 'bottom',
            items : [{
                xtype : 'button',
                text : Valence.lang.lit.cancel,
                handler : 'onClickCancel'
            },'->',{
                xtype    : 'button',
                cls      : 'vv-chgpwd-ok-btn',
                text     : Valence.lang.lit.ok,
                handler  : 'onClickOk'
            }]
        }]
    }]
});
