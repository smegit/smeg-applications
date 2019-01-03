Ext.define('Shopping.model.CartItem', {
    extend: 'Ext.data.Model',
    idProperty: 'product_id',
    fields: [
        {
            name: 'product_id',
            //reference: 'Product'
        },
        {
            name: 'prod_desc'
        },
        {
            name: 'plain_txt'
        },
        {
            name: 'quantity',
            type: 'int'
        },
        {
            name: 'allocated',
            type: 'int',
            defaultValue: 0
        },
        {
            name: 'price',
            type: 'number'
        },
        // {
        //     name: 'extended_price',
        //     calculate: function (data) {
        //         return data.quantity * data.price;
        //     }
        // },

        {
            name: 'sub_total',
            type: 'number'
        },
        {
            name: 'generated'
        },
        // TODO: add another column called deletable
        {
            name: 'deletable'
        },
        {
            name: 'releaseQtyEditable'
        },
        {
            name: 'orderQtyEditable'
        },

        {
            name: 'orderLineNO'
        },
        {
            name: 'OBPRMCOD'
        },


        {
            name: 'release',
            type: 'int',
            defaultValue: 0
        },
        {
            name: 'delivered',
            type: 'int',
            defaultValue: 0
        },
        {
            name: 'outstanding',
            type: 'int',
            convert: function (v, rec) {
                var qty = rec.get('quantity'),
                    delivered = rec.get('delivered');
                return qty - delivered;
            }
        },
        {
            name: 'viewReleaseQty',
            type: 'int'
        }
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});