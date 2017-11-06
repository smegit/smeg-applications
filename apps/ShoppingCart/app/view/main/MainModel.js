Ext.define('ShoppingCart.view.main.MainModel',{
    extend    : 'Ext.app.ViewModel',
    alias     : 'viewmodel.main',

    requires : [
        'ShoppingCart.model.CartDeliveryOpt',
        'ShoppingCart.model.CartItem',
        'ShoppingCart.model.CartPaymentOpt',
        'ShoppingCart.model.CartRep',
        'ShoppingCart.model.Category',
        'ShoppingCart.model.ExistingCart',
        'ShoppingCart.model.Product',
        'ShoppingCart.model.StockLocation'
    ],

    data : {
        agentName : '',
        cartCount : 0,
        loadProducts : false,
        STKLOC : null,
        hideAllocated : true,
        hideBannerText : true,
        bannerText : ''
    },

    formulas : {
        hideOrdKey : function(get){
            return Ext.isEmpty(get('activeCartNumber'));
        },
        ordKeyText : function(get) {
            return 'Order: ' + get('activeCartNumber');
        },
        stkLocation : function(get) {
            return get('STKLOC') || get('STKDFT');
        },
        hideClearCart : function(get){
            return get('cartCount') == 0;
        }
    },

    stores : {
        cartDeliveryOpts : {
            model : 'ShoppingCart.model.CartDeliveryOpt',
            autoLoad : false
        },
        cartPaymentOpts : {
            model : 'ShoppingCart.model.CartPaymentOpt',
            autoLoad : false
        },
        cartReps : {
            model : 'ShoppingCart.model.CartRep',
            autoLoad : true
        },
        cartItems : {
            model : 'ShoppingCart.model.CartItem',
            autoLoad : false
        },
        categories : {
            model : 'ShoppingCart.model.Category',
            autoLoad : false,
            pageSize : 0
        },
        existingCarts : {
            model : 'ShoppingCart.model.ExistingCart',
            autoLoad : false
        },
        products : {
            model : 'ShoppingCart.model.Product',
            autoLoad : false,
            pageSize : 0
        },
        stockLocations : {
            model : 'ShoppingCart.model.StockLocation',
            autoLoad : false
        }
    }
});
