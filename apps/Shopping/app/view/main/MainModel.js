Ext.define('Shopping.view.main.MainModel',{
    extend    : 'Ext.app.ViewModel',
    alias     : 'viewmodel.main',

    requires : [
        'Shopping.model.CartDeliveryOpt',
        'Shopping.model.CartItem',
        'Shopping.model.CartPaymentOpt',
        'Shopping.model.CartRep',
        'Shopping.model.Category',
        'Shopping.model.ExistingCart',
        'Shopping.model.Product',
        'Shopping.model.StockLocation'
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
            model : 'Shopping.model.CartDeliveryOpt',
            autoLoad : false
        },
        cartPaymentOpts : {
            model : 'Shopping.model.CartPaymentOpt',
            autoLoad : false
        },
        cartReps : {
            model : 'Shopping.model.CartRep',
            autoLoad : true
        },
        cartItems : {
            model : 'Shopping.model.CartItem',
            autoLoad : false
        },
        categories : {
            model : 'Shopping.model.Category',
            autoLoad : false,
            pageSize : 0
        },
        existingCarts : {
            model : 'Shopping.model.ExistingCart',
            autoLoad : false
        },
        products : {
            model : 'Shopping.model.Product',
            autoLoad : false,
            pageSize : 0
        },
        stockLocations : {
            model : 'Shopping.model.StockLocation',
            autoLoad : false
        }
    }
});
