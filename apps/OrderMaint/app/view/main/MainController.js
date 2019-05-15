/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('OrderMaint.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',
    requires: [
        'OrderMaint.view.main.OrderView'
    ],

    init: function (view) {
        var me = this,
            vm = me.getViewModel(),
            orderListStore = vm.getStore('orderList');
        console.info(vm);

        me.control({
            "#ordergrid": {
                //beforeitemclick: this.onFileGridBeforeItemClick,
                itemdblclick: me.onOrderGridItemDblClick
            },
        });
        // load order list
        // me.requestOrderList().then(function (res) {
        //     console.info(res);
        //     if (res.success) {
        //         orderListStore.loadData(res.Carts);
        //     }
        // }, function (res) {

        // });
    },

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },
    onOrderGridItemDblClick: function (grid, record, item, index, e) {
        console.info('onOrderGridItemDblClick called');
        console.info(grid);
        console.info(record);
        console.info(item);
        console.info(index);
        console.info(e);

        console.info(record.get('OAORDKEY'));
        var me = this,
            orderKey = record.get('OAORDKEY'),
            tabPanel = me.getView();
        // tabPanel = me.lookupReference('tabpanel');

        console.info(tabPanel);
        me.requestCartDetail(orderKey).then(
            function (res) {
                console.info(res);

                // Add tab
                var tab = tabPanel.add({
                    title: orderKey,
                    html: 'This is tab 123',
                    scrollable: true,
                    closable: true,
                    orderKey: orderKey,
                    items: [{
                        xtype: 'orderView',
                        data: res
                    }]
                });
                tabPanel.setActiveTab(tab);
                console.info(tab);

            },
            function () {
                console.info(res);
            }
        );

    },
    btnHandler: function (one, two, three) {
        console.info(one);
        console.info(two);
        console.info(three);
    },
    // services to back-end calls
    requestOrderList: function () {
        console.info('requestOrderList called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1050',
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

    // get cart details
    requestCartDetail: function (orderKey) {
        console.info('requestCartDetail called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1050',
            action: 'getCartDetails',
            OAORDKEY: orderKey
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
    }

});
