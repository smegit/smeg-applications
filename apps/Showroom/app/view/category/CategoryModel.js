Ext.define('Showroom.view.category.CategoryModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.category',

    requires: [
        // 'ExecDashboard.model.MetaProfitloss',
        // 'ExecDashboard.model.FullProfitloss'
        'Showroom.model.Design',
        'Showroom.model.Product',
        'Showroom.model.Category',
    ],
    data: {
        currentCat: {},
        currentCatParent: {},
        prodDetail: null,
        selections: [],
        product: {},
        banText: 'Products',
        hideCloseBtn: true
    },

    stores: {
        categories: {
            model: 'Showroom.model.Category',
            autoLoad: false,

            listeners: {
                // load: 'onMetaDataLoad'
            },
        },
        products: {
            model: 'Showroom.model.Product',
            autoLoad: false
        },
        designs: {
            model: 'Showroom.model.Design',
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
