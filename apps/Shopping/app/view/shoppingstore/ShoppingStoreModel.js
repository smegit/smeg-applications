Ext.define('Shopping.view.shoppingstore.ShoppingStoreModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.shoppingstore',
    requires: [
        'Ext.data.Store',
        'Shopping.model.CartItem',
        'Shopping.model.CartRep',
        'Shopping.model.Category',
        'Shopping.model.ExistingCart',
        'Shopping.model.Product',

        // Add tree store
        'Ext.data.TreeStore',

        // Add payment history model
        'Shopping.model.PaymentHistory',
        'Shopping.model.PromoSelection',
        'Shopping.model.PromoCodeList'
    ],

    data: {
        activeCartNumber: null,
        cartCount: 0,
        cartValues: {},
        disableSalesPerson: false,
        loadProducts: true, //was originally false then set but this looks like the cause of the timing issue
        hideAllocated: true,
        hideBannerText: true,
        bannerText: '',
        deliveryDisabledDates: null, //Example exclude one day ['25/12/2017']
        // deliveryDisabledDays: null, //Example [0, 6] would be excluding weekends
        deliveryDisabledDays: [0, 6],
        deliveryOptions: null,
        orderPayments: null,
        totalPaid: null,
        prmShowQty: false,
        prmShowValue: false,
        prmDesc: null,
        prmText: null,
        prmOrderLineNumber: null,
        prmMaxSel: null,
        //promoItems: []
        selectedPromos: [],
        selectedPromoCount: 0,
        hidePaymentHistory: true,
        orderTotal: null,
        searchFormTitle: 'TestTitle',
        catId: null,
        catDesc: null,
        attributes: [],

    },

    formulas: {
        hideOrdKey: function (get) {
            return Ext.isEmpty(get('activeCartNumber'));
        },
        ordKeyText: function (get) {
            return 'Order: ' + get('activeCartNumber');
        },
        orderDate: function (get) {
            if (!Ext.isEmpty(get('cartValues')) && !Ext.isEmpty(get('cartValues').OADATE)) {
                return 'Date: ' + Ext.util.Format.date(get('cartValues').OADATE, 'd/m/Y');
            }
        },
        listFooterText: function (get) {
            var ordTot = get('orderTotal'),
                totalPaid = get('totalPaid');
            var balance = ordTot - totalPaid;
            return '<b>BALANCE: ' + Ext.util.Format.number(balance, '0,0.00') + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + 'PAID: ' + Ext.util.Format.number(get('totalPaid'), '0,0.00') + '</b>';
        },
        currentStockLoc: {
            get: function (get) {
                console.log('get => ' + get('STKLOC'));
                return get('STKLOC');
            },

            set: function (value) {
                console.log('set => ' + value);
                this.set({
                    STKLOC: value
                });
            }
        },
        hideClearCart: function (get) {
            return get('cartCount') == 0;
        },
        orderPaymentsInfo: function (get) {
            var paymentsResp = get('orderPayments'),
                payments = (!Ext.isEmpty(paymentsResp) && !Ext.isEmpty(paymentsResp.PaySum)) ? paymentsResp.PaySum : null,
                balance = 0,
                paid = 0;
            if (!Ext.isEmpty(payments)) {
                for (var ii = 0; ii < payments.length; ii++) {
                    if (payments[ii].LABEL.toUpperCase() === 'PAID') {
                        paid += payments[ii].AMOUNT;
                    } else if (payments[ii].LABEL.toUpperCase() === 'BALANCE') {
                        balance = payments[ii].AMOUNT;
                    }
                }
            }
            return '<div class="cart-pym-info">' +
                '  <span class="x-form-item-label-default pym-lbl">Paid:</span><span class="pym-val">' + Ext.util.Format.currency(paid) + '</span>' +
                '  <span class="x-form-item-label-default pym-lbl">Balance:</span><span class="pym-val">' + Ext.util.Format.currency(balance) + '</span>' +
                '  <span data-qtip="View Payments" class="pym-info-cnt"><span class="pym-info-icon vvicon-info"></span></span>' +
                '</div>';
        },
        orderNotesInfo: function (get) {
            return '<div class="cart-ord-info">' +
                '  <span data-qtip="Notes" class="ord-info-cnt"><span class="ord-info-icon vvicon-notebook"></span><span class="x-form-item-label-default ord-info-lbl">Notes</span></span>' +
                '</div>';
        },
        orderHasPayments: function (get) {
            var paymentsResp = get('orderPayments'),
                payments = (!Ext.isEmpty(paymentsResp) && !Ext.isEmpty(paymentsResp.PaySum)) ? paymentsResp.PaySum : null,
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
        },
        // requestDate: function (get) {
        //     if (!Ext.isEmpty(get('cartValues'))) {
        //         console.info(get('cartValues'));
        //         if (get('cartValues').OADELD == '0001-01-01') {
        //             return ''
        //         } else {
        //             return get('cartValues').OADELD;
        //         }
        //     }
        // }
        requestDate: {
            get: function (get) {
                if (!Ext.isEmpty(get('cartValues'))) {
                    if (get('cartValues').OADELD == '0001-01-01') {
                        return ''
                    } else {
                        return get('cartValues').OADELD;
                    }
                }
            },
            // set: function (value) {
            //     // this.set({

            //     // });
            //     console.info(value);
            // }
        }
    },

    stores: {
        cartReps: {
            model: 'Shopping.model.CartRep',
            autoLoad: false,
            listeners: {
                load: 'onCartRepsLoad'
            }
        },
        cartItems: {
            model: 'Shopping.model.CartItem',
            autoLoad: false,
            listeners: {
                datachanged: 'onGridDatachanged',
                //refresh: 'onGridRefresh',
                update: 'onGridUpdate'
            }
        },
        // categories    : {
        //     model    : 'Shopping.model.Category',
        //     autoLoad : false,
        //     pageSize : 0
        // },

        // Change categories store 
        categories: {
            type: 'tree',
            model: 'Shopping.model.Category',
            autoLoad: false,
            //pageSize: 0,
            root: {
                text: 'Products',
                expanded: false
            },
            folderSort: true,
            //lazyFill: true
            listeners: {
                load: 'onCategoryLoad'
            },
            filterer: 'bottomup',
        },
        existingCarts: {
            model: 'Shopping.model.ExistingCart',
            pageSize: 0,
            autoLoad: false
        },
        products: {
            model: 'Shopping.model.Product',
            autoLoad: false,
            pageSize: 0
        },
        ReleaseItems: {
            type: 'chained',
            source: new Ext.create('Ext.data.Store'),
            filters: [
                function (rec) {
                    return (rec.get('viewReleaseQty') > 0);
                }
            ]
        },
        paymentHistory: {
            model: 'Shopping.model.PaymentHistory',
            autoLoad: false
        },
        promoSelections: {
            model: 'Shopping.model.PromoSelection',
            autoLoad: false
        },
        promoCodeList: {
            model: 'Shopping.model.PromoCodeList',
            autoLoad: false
        }
    }
});