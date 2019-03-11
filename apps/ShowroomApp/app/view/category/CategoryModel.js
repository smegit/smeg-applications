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
        },
        products: {
            model: 'ShowroomApp.model.Product',
            autoLoad: false
        }
    }
});
