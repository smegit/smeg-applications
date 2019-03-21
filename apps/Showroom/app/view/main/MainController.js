/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Showroom.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    initViewModel: function (vm) {

        console.info('initViewModel called');
        // var sid = Valence.login.config.Runtime.getLoginData().sid || localStorage.getItem('sid'),
        //     env = Valence.login.config.Runtime.getLoginData().env || sessionStorage.getItem('env');
        var me = this,
            //sid = Valence.login.config.Runtime.getLoginData(),
            env = sessionStorage.getItem('env');
        //loginProcessor = Valence.login.Processor;

        //var apps = Showroom.config.Runtime.getApps();
        //var appId = Ext.getUrlParam('app');
        //console.info(appId);
        // console.info(loginProcessor);
        //console.info(apps);
        //console.info(sid);
        //console.info(env);
        //Ext.Msg.alert('Success1', appId + sid, Ext.emptyFn);




    },
    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    setAgent: function () {

    },


    onConfirm: function (choice) {
        // var me = this;
        // if (choice === 'yes') {
        //     //
        //     console.info('I selected yes');
        //     me.requestCat()
        //         .then(function (res) {
        //             console.info(res);
        //             if (res.success) {
        //                 Ext.Msg.alert('Success1', JSON.stringify(res), Ext.emptyFn);
        //             } else {
        //                 Ext.Msg.alert('Error1', JSON.stringify(res), Ext.emptyFn);
        //             }


        //         }, function (res) {
        //             console.info(res);
        //             Ext.Msg.alert('Error2', JSON.stringify(res), Ext.emptyFn);
        //         });

        // }
    },

    // requestCat: function () {
    //     console.log('requestCat called');
    //     console.info(window.location);
    //     var me = this,
    //         deferred = Ext.create('Ext.Deferred'),
    //         params = {};
    //     params = {
    //         pgm: 'EC1010',
    //         action: 'getCats',
    //         sid: localStorage.getItem('sid'),
    //         //app: 1014,
    //         //cat: 'catId'
    //     };
    //     Ext.Ajax.request({
    //         url: '/valence/vvcall.pgm',
    //         method: 'GET',
    //         params: params,
    //         success: function (res) {
    //             var response = Ext.decode(res.responseText);
    //             deferred.resolve(response);
    //         },
    //         failure: function (res) {
    //             var response = Ext.decode(res.responseText);
    //             deferred.reject(response);
    //         }
    //     });
    //     return deferred.promise;
    // },

    onAppSelected: function () {
        console.info('onAppSelected called');
    }

});
