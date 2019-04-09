Ext.define('Showroom.view.qlist.QlistController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.qlist',


    init: function (view) {
        console.info('initList called');
        console.info(view);


        // get the list of quotes(carts)



    },

    requestGetCarts: function () {
        console.info('requestGetCarts called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC3050',
            action: 'getCarts'
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'GET',
            params: params,
            success: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.resolve(response);
            },
            failure: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.reject(response);
            }
        });
        return deferred.promise;
    },
    requestGetCartDetails: function (orderKey) {
        console.info('requestCartDetails called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC3050',
            action: 'getCartDetails',
            SAORDKEY: orderKey,
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'GET',
            params: params,
            success: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.resolve(response);
            },
            failure: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.reject(response);
            }
        });
        return deferred.promise;
    },

    onGridSelectionChange: function () {
        console.info('onGridSelectionChange called');
        //return false;

    },

    hasValueObj: function (obj) {
        for (var key in obj) {
            // if (obj[key] != null || obj[key] != '')
            //     return true;
            if (!Ext.isEmpty(obj[key])) return true;
            //console.info();
        }
        return false
    },

    onGridSelect: function (dv, rec) {
        console.info('onGridSelect called');
        console.info(dv);
        console.info(rec);
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            cartView = Ext.ComponentQuery.query('cart')[0],
            cartVm = cartView.getViewModel(),
            selectedProdsStore = cartVm.getStore('selectedProds'),
            tabPanel = Ext.ComponentQuery.query('app-main')[0],
            orderKey = rec.get('SAORDKEY');
        console.info(selectedProdsStore);
        console.info(vm);
        console.info(cartVm);


        console.info(cartView.down('formpanel').getValues());
        console.info(me.hasValueObj(cartView.down('formpanel').getValues()));
        // check if there is cart open 
        if (selectedProdsStore.getCount() > 0 || me.hasValueObj(cartView.down('formpanel').getValues())) {
            // Non empty cart 
        } else {
            // Empty cart

        }


        // Load selects products
        // console.info(rec.get('products'));
        // selectedProdsStore.loadRawData(rec.get('products'), true);
        // console.info(selectedProdsStore);


        me.requestGetCartDetails(orderKey).then(
            function (res) {
                console.info(res);
                cartVm.set('theQoute', res.CartHdr[0]);
                selectedProdsStore.loadRawData(res.CartDtl, true);

            },
            function (res) {
                console.info(res);
                console.info('Server Error: loading cart details');
            }
        );


        // Set Active tab 
        console.info(tabPanel);
        tabPanel.setActiveItem(1);
    },

    onGetQouteList: function () {
        console.info('onGetQouteList called');
        var me = this,
            vm = me.getViewModel(),
            qoutesStore = vm.getStore('qoutes');
        me.requestGetCarts().then(
            function (res) {
                console.info(res);
                if (res.success) {
                    qoutesStore.loadData(res.Carts, false);
                } else {
                    console.info('loading carts error');
                }
            },
            function (res) {
                console.info(res);
                console.info('Server error: loading carts');
            }
        );
    }




});