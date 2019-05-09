/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('pdf.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    requires: [
        // 'Ext.form.*',
        // 'Ext.Button.*'
        'pdf.model.FileList'
    ],


    data: {
        name: 'pdf',

        loremIpsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        //printURL: '/PRODUCT/DEL20001428.pdf',
        hideList: true
    },

    stores: {
        fileList: {
            model: 'pdf.model.FileList',
            autoLoad: false,

            listeners: {
                // load: 'onMetaDataLoad'
            },
        },
    }

    //TODO - add data, formulas and/or methods to support your view
});
