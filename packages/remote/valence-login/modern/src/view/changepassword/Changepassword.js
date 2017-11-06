Ext.define('Valence.login.view.changepassword.Changepassword', {
    extend : 'Ext.Container',
    xtype :'changepassword',

    requires : [
        'Valence.login.view.phone.changepassword.Changepassword',
        'Valence.login.view.tablet.changepassword.Changepassword',

        'Valence.login.view.changepassword.ChangepasswordController',
        'Valence.login.view.changepassword.ChangepasswordModel'
    ],

    viewModel  : {
        type : 'changepassword'
    },
    controller : 'changepassword',

    layout : 'fit',

    initialize : function(){
        var me = this,
            phone = Ext.os.is.Phone;

        me.callParent(arguments);

        me.add([{
            xtype : (phone ? 'changepassword-phone' : 'changepassword-tablet')
        }]);
    }
});
