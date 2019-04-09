Ext.define('Showroom.model.Product', {
    extend: 'Ext.data.Model',
    type: 'memory',


    fields: [
        'MODEL',
        {
            name: 'PRICE',
            convert: function (v) {
                return Ext.util.Format.number(v, '0.00');
            }
        },
        {
            name: 'formatedPrice',
            convert: function (v, rec) {
                var p = rec.get('PRICE');
                //console.info(p);
                return Ext.util.Format.usMoney(p);
            }
        }
    ],
    reader: {
        type: 'json'
    },

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



});