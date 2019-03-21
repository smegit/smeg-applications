/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Showroom.Application', {
    extend: 'Ext.app.Application',

    name: 'Showroom',

    stores: [
        // TODO: add global / shared stores here
    ],

    launch: function () {
        // TODO - Launch the application


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
        var me = this;
        me.requestSetAgent('339277')
            .then(function (res) {
                console.info(res);
                if (res.success) {
                    //Ext.Msg.alert('Success', JSON.stringify(res), Ext.emptyFn);

                } else {
                    Ext.Msg.alert('Error1', JSON.stringify(res), Ext.emptyFn);

                }

            }, function (res) {
                console.info(res);
                Ext.Msg.alert('Error12', JSON.stringify(window.location.search.substring(5, 9) + localStorage.getItem('sid')), Ext.emptyFn);

            });
        //Ext.Msg.alert('loc', JSON.stringify(window.location.search), Ext.emptyFn);

    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },
    requestSetAgent: function (agentId) {
        console.log('requestSetAgent called');
        var queryString = window.location.search;
        console.info(queryString);
        console.info(queryString.indexOf("&sid="));
        console.info(queryString.indexOf("&env="));
        console.info(queryString.substring(queryString.indexOf("&sid=") + 5, queryString.indexOf("&env=")));


        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1000',
            action: 'setAgent',
            //sid: queryString.substring(queryString.indexOf("&sid=") + 5, queryString.indexOf("&env=")),
            //app: window.location.search.substring(5, 9),
            agent: agentId
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'POST',
            params: params,
            success: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.resolve(response);
            },
            failure: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.reject(response);
            }
        });
        return deferred.promise;
    },
});
