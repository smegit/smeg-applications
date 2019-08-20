Ext.define('EC1022.Application', {
    name: 'EC1022',

    extend: 'Ext.app.Application',

    views: [
        // TODO: add views here
    ],

    controllers: [
        // TODO: add controllers here
    ],

    stores: [
        // TODO: add stores here
        // 'Agenc'
    ],

    launch: function () {
        // TODO - Launch the application
        console.info('launch called');

        Ext.Ajax.on('requestcomplete', function (conn, response, options) {
            console.info('requestcomplete called');
            console.info(conn);
            console.info(options);
            console.info(response);
            // var queryString = window.location.search,
            //     SID = queryString.substring(queryString.indexOf("&sid=") + 5, queryString.indexOf("&env=")),
            //     APP = queryString.substring(5, 9);

            //if (options.params.pgm === 'EC1010') {
            // Ext.apply(options.params, {
            //     function: 'showroom'
            // });
            //}
        });

    }
});