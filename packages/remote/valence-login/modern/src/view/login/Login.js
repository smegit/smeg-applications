Ext.define('Valence.login.view.login.Login', {
    extend : 'Valence.common.widget.NavContainer',
    xtype :'login',

    requires : [
        'Valence.login.view.phone.login.Login',
        'Valence.login.view.tablet.login.Login',

        'Valence.login.view.connection.Connection',

        'Valence.login.view.login.LoginModel',
        'Valence.login.view.login.LoginController'
    ],

    viewModel  : {
        type : 'login'
    },
    controller : 'login',

    initialize : function(){
        var me = this,
            phone = Ext.os.is.Phone;

        me.callParent(arguments);

        me.add([{
            xtype : (phone ? 'login-phone' : 'login-tablet')
        }, {
            xtype : 'connection'
        }]);
    }
});
