/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('pdf.Application', {
    extend: 'Ext.app.Application',

    name: 'pdf',

    stores: [
        // TODO: add global / shared stores here
    ],

    launch: function () {
        // TODO - Launch the application
        console.info('launch called');
        Ext.Ajax.on('beforerequest', function (conn, options) {
            console.info('beforerequest called');
            console.info(conn);
            console.info(options);
            var queryString = window.location.search,
                SID = queryString.substring(queryString.indexOf("&sid=") + 5, queryString.indexOf("&env=")),
                APP = queryString.substring(5, 9);
            Ext.apply(options.params, {
                sid: SID,
                app: APP
            });
        });
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
