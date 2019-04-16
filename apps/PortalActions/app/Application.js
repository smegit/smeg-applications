/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('PortalActions.Application', {
    extend: 'Ext.app.Application',
    
    name: 'PortalActions',

    requires : [
        'Valence.login.Processor',
        'Valence.util.Helper',
        'PortalActions.store.Actions'
    ],

    stores: [
        'Actions'
    ],
    
    launch: function () {
        Valence.login.Processor.init({
            namespace : 'PortalActions',
            callback  : function () {
                Ext.Viewport.add(Ext.create('PortalActions.view.main.Main'));
            }
        });
    },

    onAppUpdate: function () {
        window.location.reload();
    }
});
