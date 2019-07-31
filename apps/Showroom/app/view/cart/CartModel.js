Ext.define('Showroom.view.cart.CartModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.cart',

    requires: [
        'Showroom.model.SelectedProd',
        'Showroom.model.AddressList',
        'Showroom.model.AddressSuggestion'
    ],

    data: {
        theQoute: null,
        titleText: 'This is the title',
        printURL: null,
        quoteKey: null,
        toEmail: null,
    },

    stores: {
        selectedProds: {
            model: 'Showroom.model.SelectedProd',
            autoLoad: false,
            listeners: {
                datachanged: 'onSelectedDataChanged',
                update: 'onQtyUpdate'

            }
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
        },
        addressList: {
            model: 'Showroom.model.AddressList',
            autoLoad: false,
        },
        addressSuggestion: {
            model: 'Showroom.model.AddressSuggestion',
            autoLoad: true,
            proxy: {
                type: 'memory'
            },
            data: [
                { description: 'Peter', type: 'Venkman' },
                { description: 'Raymond', type: 'Stantz' },
                { description: 'Egon', type: 'Spengler' },
                { description: 'Winston', type: 'Zeddemore' }
            ]
        }
    }
});
