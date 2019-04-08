Ext.define('Showroom.view.cart.CartModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.cart',

    requires: [
        'Showroom.model.SelectedProd'
    ],

    data: {
        //theQoute: null,
    },

    stores: {
        selectedProds: {
            model: 'Showroom.model.SelectedProd',
            autoLoad: false,
            // data: [
            //     { MODEL: 'Catalogue1', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR", PRICE: '1000', QUANTY: '1' },
            //     { MODEL: 'Catalogue2', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR", PRICE: '1000', QUANTY: '1' },
            //     { MODEL: 'Catalogue3', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR", PRICE: '1000', QUANTY: '1' },
            //     { MODEL: 'Catalogue4', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR", PRICE: '1000', QUANTY: '1' },
            //     { MODEL: 'Catalogue1', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR", PRICE: '1000', QUANTY: '1' },
            //     { MODEL: 'Catalogue2', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR", PRICE: '1000', QUANTY: '1' },
            //     { MODEL: 'Catalogue3', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR", PRICE: '1000', QUANTY: '1' },
            //     { MODEL: 'Catalogue4', image: "https://www.smeglondon.com/sites/smeglondon.com/files/styles/product_thumbnails/public/TSF01PBUK%2050%27s%20Retro%20Style%20%202%20Slice%20Toaster.jpg?itok=3h6b3HUR", PRICE: '1000', QUANTY: '1' }

            // ],
        }
    }
});
