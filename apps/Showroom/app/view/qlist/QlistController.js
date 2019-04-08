Ext.define('Showroom.view.qlist.QlistController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.qlist',


    init: function (view) {
        console.info('initList called');
        console.info(view);
        var me = this,
            vm = me.getViewModel(),
            qoutesStore = vm.getStore('qoutes');

        // get the list of quotes(carts)
        me.requestGetCarts().then(
            function (res) {
                console.info(res);
                if (res.success) {
                    qoutesStore.loadData(res.carts, false);
                } else {
                    console.info('loading carts error');
                }
            },
            function (res) {
                console.info(res);
                console.info('Server error: loading carts');
            }
        );

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
    requestGetCartDetails: function (cartId) {
        console.info('requestCartDetails called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC3050',
            action: 'getCartDetails',
            cartId: cartId,
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'GET',
            params: params,
            success: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.resovle(response);
            },
            failure: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.reject(response);
            }
        });
        return deferred.promise;
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
            cartId = rec.get('cartId');
        console.info(selectedProdsStore);


        // Load selects products
        // console.info(rec.get('products'));
        // selectedProdsStore.loadRawData(rec.get('products'), true);
        // console.info(selectedProdsStore);


        me.requestGetCartDetails(cartId).then(
            function (res) {
                console.info(res);
                selectedProdsStore.loadRawData(res.products, true);

            },
            function (res) {
                console.info(res);
                console.info('Server Error: loading cart details');
            }
        );


        // Set Active tab 
        console.info(tabPanel);
        tabPanel.setActiveItem(1);
    }

});