/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('pdf.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    init: function (view) {
        console.info(view);
        var me = this,
            vm = me.getViewModel(),
            link, iframeHTML;

        Ext.MessageBox.show({
            msg: 'Generating PDF files, please wait...',
            progressText: 'Saving...',
            width: 300,
            wait: {
                interval: 400
            },
        });
        setTimeout(function () {
            me.requestPDF().then(
                function (res) {
                    console.info(res);
                    if (res.success) {
                        link = res.URL;
                    } else {
                        link = '/PRODUCT/testpdf.pdf';
                    }
                    iframeHTML = '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>';
                    vm.set('iframeHTML', iframeHTML);
                    Ext.MessageBox.hide();
                },
                function (res) {
                    console.info(res);
                });
        }, 300);
    },

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },

    requestPDF: function () {
        console.info('requestPDF called');
        // var queryString = window.location.search,
        //     SID = queryString.substring(queryString.indexOf("&sid=") + 5, queryString.indexOf("&env=")),
        //     APP = queryString.substring(5, 9);
        // console.info(SID);
        // console.info(APP);
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC2020',
            // sid: SID,
            // app: APP,
        }
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'GET',
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
    }
});
