Ext.define('Valence.login.view.changepassword.ChangepasswordController', {
    extend        : 'Ext.app.ViewController',
    alias         : 'controller.changepassword',
    onClickOk     : function () {
        var me      = this,
            vm      = me.getViewModel(),
            view    = me.getView(),
            curpwd  = view.lookupReference('curpwd').getValue(),
            newpwd  = view.lookupReference('newpwd').getValue(),
            newpwd2 = view.lookupReference('newpwd2').getValue(),
            user    = vm.get('user'),
            params  = {
                user    : Valence.util.Helper.encodeUTF16(user),
                action  : 'chgPassword',
                curpwd  : Valence.util.Helper.encodeUTF16(curpwd),
                newpwd  : Valence.util.Helper.encodeUTF16(newpwd),
                newpwd2 : Valence.util.Helper.encodeUTF16(newpwd2)
            },
            app     = Valence.login.config.Runtime.getApplication();


        if (app && app.fireEvent('beforechangepassword', params) !== false) {
            if (Ext.isClassic) {
                view.el.mask();
            } else {
                Ext.Viewport.mask({
                    xtype : 'loadmask'
                });
            }

            Ext.Ajax.request({
                url     : Valence.login.Processor.getHostUrl() + '/valence/vvlogin.pgm',
                params  : params,
                success : function (r) {
                    if (Ext.isClassic) {
                        view.el.unmask();
                    } else {
                        Ext.Viewport.unmask();
                    }
                    var d = Ext.decode(r.responseText);
                    if (d.success) {
                        if (app) {
                            app.fireEvent('passwordchanged', user, newpwd);
                        }
                        me.fireViewEvent('success', newpwd);
                        view.destroy();
                        if (Ext.isClassic){
                            Valence.common.util.Snackbar.show(Valence.lang.lit.passwordChg);
                        }
                    } else {
                        view.lookupReference(d.fld).markInvalid(Valence.common.util.Helper.getLit(d));
                    }
                }
            });
        }
    },

    onClickCancel : function () {
        var app = Valence.login.config.Runtime.getApplication();

        if (app) {
            app.fireEvent('passwordcancel');
        }
        this.getView().close();
    },

    onSpecialKeyPassword : function (fld, e) {
        var me   = this,
            view = me.getView(),
            form = view.lookupReference('form');
        if (e.getKey() === e.ENTER && form.isValid()) {
            me.onClickOk();
        }
    }
});