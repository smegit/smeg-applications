Ext.define('ShowroomApp.view.product.ProductModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.product',

    requires: [
        'ShowroomApp.model.Product'
    ],

    // formulas: {
    //     typeFilter: function (get) {
    //         var category = get('category');
    //         return this.filters[category];
    //     }
    // },

    // filters: {
    //     all: ['news', 'forum'],
    //     news: ['news'],
    //     forum: ['forum']
    // },

    stores: {
        products: {
            model: 'ShowroomApp.model.Product',
            autoLoad: true,
            pageSize: 0,
            // proxy: {
            //     type: 'ajax',
            //     url: '/valence/vvcall.pgm',
            //     extraParams: {
            //         pgm: 'EC1010',
            //         action: 'getProds',
            //         cat: 'DDR'
            //     },
            //     reader: {
            //         type: 'json',
            //         rootProperty: 'prods'
            //     }
            // }
            // data: [
            //     { model: 'Catalogue1', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
            //     { model: 'Catalogue2', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
            //     { model: 'Catalogue3', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
            //     { model: 'Catalogue4', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
            //     { model: 'Catalogue1', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
            //     { model: 'Catalogue2', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
            //     { model: 'Catalogue3', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" },
            //     { model: 'Catalogue4', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR" }

            // ],
        }
    }
});
