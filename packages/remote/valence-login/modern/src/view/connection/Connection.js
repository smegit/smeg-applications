Ext.define('Valence.login.view.connection.Connection', {
    extend : 'Ext.Container',
    xtype :'connection',

    requires : [
        'Valence.login.view.phone.connection.Connection',
        'Valence.login.view.tablet.connection.Connection',

        'Valence.login.view.connection.ConnectionModel',
        'Valence.login.view.connection.ConnectionController'
    ],

    cls : 'vv-connection-mobile-cnt',

    viewModel  : {
        type : 'connection'
    },
    controller : 'connection',

    height : '100%',

    layout : {
        type : 'fit'
    },

    listeners : {
        show : 'onShowConnection'
    },

    scrollable : 'y',

    initialize : function(){
        var me = this,
            phone = Ext.os.is.Phone;

        me.callParent();

        me.add([{
            xtype : (phone ? 'connection-phone' : 'connection-tablet')
        }]);
    }
});
