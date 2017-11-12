Ext.define('Shopping.view.shoppingstore.ShoppingStoreModel', {
    extend   : 'Ext.app.ViewModel',
    alias    : 'viewmodel.shoppingstore',
    requires : [
        'Shopping.model.CartItem',
        'Shopping.model.CartRep',
        'Shopping.model.Category',
        'Shopping.model.ExistingCart',
        'Shopping.model.Product'
    ],

    data : {
        activeCartNumber      : null,
        cartCount             : 0,
        loadProducts          : true, //was originally false then set but this looks like the cause of the timing issue
        hideAllocated         : true,
        hideBannerText        : true,
        bannerText            : '',
        deliveryDisabledDates : null, //Example exclude one day ['25/12/2017']
        deliveryDisabledDays  : null //Example [0, 6] would be excluding weekends
    },

    formulas : {
        hideOrdKey    : function (get) {
            return Ext.isEmpty(get('activeCartNumber'));
        },
        ordKeyText    : function (get) {
            return 'Order: ' + get('activeCartNumber');
        },
        stkLocation   : function (get) {
            return get('STKLOC') || get('STKDFT');
        },
        hideClearCart : function (get) {
            return get('cartCount') == 0;
        }
    },

    stores : {
        cartReps      : {
            model    : 'Shopping.model.CartRep',
            autoLoad : true
        },
        cartItems     : {
            model    : 'Shopping.model.CartItem',
            autoLoad : false
        },
        categories    : {
            model    : 'Shopping.model.Category',
            autoLoad : false,
            pageSize : 0
        },
        existingCarts : {
            model    : 'Shopping.model.ExistingCart',
            pageSize : 0,
            autoLoad : false
        },
        products      : {
            model    : 'Shopping.model.Product',
            autoLoad : false,
            pageSize : 0
        }
    }
});