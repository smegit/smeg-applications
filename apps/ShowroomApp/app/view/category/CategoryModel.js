Ext.define('ShowroomApp.view.category.CategoryModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.category',

    requires: [
        // 'ExecDashboard.model.MetaProfitloss',
        // 'ExecDashboard.model.FullProfitloss'
        'ShowroomApp.model.Design',
        'ShowroomApp.model.Product',
        'ShowroomApp.model.Category',
    ],
    data: {
        currentCat: {},
        currentCatParent: {},
        prodDetail: null
    },

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
        },
        designs: {
            model: 'ShowroomApp.model.Design',
            autoLoad: false,
            data: [
                { name: 'Dolce Stil Novo', code: 'DSN', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
                { name: 'Portofino', code: 'PORT', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
                { name: 'Linea', code: 'Lin', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
                { name: 'Classic', code: 'CLS', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
                { name: 'Victoria', code: 'Vic', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
            ],
        }
    }
});
