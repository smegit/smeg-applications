/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('ShowroomApp.Application', {
    extend: 'Ext.app.Application',

    name: 'ShowroomApp',
    requires: [
        'Valence.login.Processor',
        'Valence.common.util.Helper',
        'ShowroomApp.config.Runtime',
        //'ShowroomApp.view.*'
    ],

    stores: [
        // TODO: add global / shared stores here
    ],

    launch: function () {
        // TODO - Launch the application


        Valence.login.Processor.init({
            namespace: 'ShowroomApp',
            callback: function () {
                //Ext.create('MyApp.view.Main');
                console.log('called back');
            }
        });

        var me = this;
        me.requestSetAgent('339277')
            .then(function (res) {
                console.info(res);
                if (res.success) {
                    Ext.Msg.alert('Success', JSON.stringify(res), Ext.emptyFn);

                } else {
                    Ext.Msg.alert('Error1', JSON.stringify(res), Ext.emptyFn);

                }

            }, function (res) {
                console.info(res);
                Ext.Msg.alert('Error', JSON.stringify(res), Ext.emptyFn);

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
    },

    requestSetAgent: function (agentId) {
        console.log('requestSetAgent called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1000',
            action: 'setAgent',
            //sid: localStorage.getItem('sid'),
            //app: 1014,
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
