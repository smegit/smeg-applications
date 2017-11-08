Ext.define('Welcome.view.main.apps.AppsController', {
    extend : 'Ext.app.ViewController',
    alias  : 'controller.apps',

    /**
     * onItemClick - launch or set active the application
     * @param cmp
     * @param rec
     */
    onItemClick : function (cmp, rec) {
        var me  = this,
            app = rec.get('appId');

        //launch or focus the application
        //
        if (!Valence.util.App.isRunning(app)) {
            //launch the application
            //
            Valence.util.App.launch({
                app : app
            });
        } else {
            //since the application is already running set it as active
            //
            Valence.util.App.setActive({
                app : app
            });
        }
    }
});