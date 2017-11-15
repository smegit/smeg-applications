Ext.define('Shopping.view.shoppingstore.ShoppingStoreModel', {
    extend   : 'Ext.app.ViewModel',
    alias    : 'viewmodel.shoppingstore',
    requires : [
        'Ext.data.Store',
        'Shopping.model.CartItem',
        'Shopping.model.CartRep',
        'Shopping.model.Category',
        'Shopping.model.ExistingCart',
        'Shopping.model.Product'
    ],

    data : {
        activeCartNumber      : null,
        cartCount             : 0,
        cartValues            : {},
        loadProducts          : true, //was originally false then set but this looks like the cause of the timing issue
        hideAllocated         : true,
        hideBannerText        : true,
        bannerText            : '',
        deliveryDisabledDates : null, //Example exclude one day ['25/12/2017']
        deliveryDisabledDays  : null //Example [0, 6] would be excluding weekends
    },

    formulas : {
        hideOrdKey        : function (get) {
            return Ext.isEmpty(get('activeCartNumber'));
        },
        ordKeyText        : function (get) {
            return 'Order - ' + get('activeCartNumber');
        },
        stkLocation       : function (get) {
            return get('STKLOC') || get('STKDFT');
        },
        hideClearCart     : function (get) {
            return get('cartCount') == 0;
        },
        orderPaymentsInfo : function (get) {
            var paymentsResp = get('orderPayments'),
                payments     = (!Ext.isEmpty(paymentsResp) && !Ext.isEmpty(paymentsResp.PaySum)) ? paymentsResp.PaySum : null,
                balance      = 0,
                paid         = 0;
            if (!Ext.isEmpty(payments)) {
                for (var ii = 0; ii < payments.length; ii++) {
                    if (payments[ii].LABEL.toUpperCase() === 'PAID') {
                        paid += payments[ii].AMOUNT;
                    } else if (payments[ii].LABEL.toUpperCase() === 'BALANCE') {
                        balance = payments[ii].AMOUNT;
                    }
                }
            }
            return '<div class="cart-pym-info">'+
                   '  <span class="x-form-item-label-default pym-lbl">Paid:</span><span class="pym-val">' + Ext.util.Format.currency(paid) + '</span>'+
                   '  <span class="x-form-item-label-default pym-lbl">Balance:</span><span class="pym-val">' + Ext.util.Format.currency(balance) + '</span>'+
                   '  <span data-qtip="View Payments" class="pym-info-cnt"><span class="pym-info-icon vvicon-info"></span></span>'+
                   '</div>';
        },
        orderHasPayments : function(get){
            var paymentsResp = get('orderPayments'),
                payments     = (!Ext.isEmpty(paymentsResp) && !Ext.isEmpty(paymentsResp.PaySum)) ? paymentsResp.PaySum : null,
                paymentFound = false;

            if (!Ext.isEmpty(payments)) {
                for (var ii = 0; ii < payments.length; ii++) {
                    if (payments[ii].LABEL.toUpperCase() === 'PAID') {
                        paymentFound = true;
                        break;
                    }
                }
            }
            return paymentFound;
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
        },
        ReleaseItems  : {
            type    : 'chained',
            source  : new Ext.create('Ext.data.Store'),
            filters : [
                function (rec) {
                    return (rec.get('viewReleaseQty') > 0);
                }
            ]
        }
    }
});