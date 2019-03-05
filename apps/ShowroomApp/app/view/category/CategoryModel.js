Ext.define('ShowroomApp.view.category.CategoryModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.category',

    requires: [
        // 'ExecDashboard.model.MetaProfitloss',
        // 'ExecDashboard.model.FullProfitloss'
    ],

    stores: {
        categories: {
            model: 'ShowroomApp.model.Category',
            autoLoad: false,

            listeners: {
                // load: 'onMetaDataLoad'
            },
            // data: [{
            //     CATID: '1', CATDESC: '111'
            // }, { CATID: '2', CATDESC: '222' }]
        }
    }
});
