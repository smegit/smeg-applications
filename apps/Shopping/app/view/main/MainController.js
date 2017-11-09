Ext.define('Shopping.view.main.MainController', {
    extend        : 'Ext.app.ViewController',
    alias         : 'controller.main',
    initViewModel : function () {
        var me = this;

        //get the initial options
        //
        me.getOptions()
            .then(function (content) {
                Shopping.getApplication().fireEvent('agentselected', content);
                Valence.common.util.Helper.destroyLoadMask();
            });
    },

    /**
     * getOptions - get the options for the application. will be notified if the user is allowed to work with
     *   multiple agencies and if they can ask them what agency
     */
    getOptions : function () {
        var me       = this,
            vm       = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            agency   = vm.get('agency'),
            params   = {
                pgm    : 'EC1010',
                action : 'getOptions'
            };

        //check if we are working with a specific agent because the user is allowed to work
        // with multiple agencies
        //
        if (!Ext.isEmpty(agency)) {
            Ext.apply(params, {
                agency : agency
            });
        }

        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : params,
            scope   : me,
            success : function (r) {
                var me          = this,
                    d           = Ext.decode(r.responseText),
                    continueFnc = function (agency) {
                        //use the base "single" agent
                        //
                        vm.set('agent', agency);

                        me.loadDeliveryOptions(d);
                        me.loadPaymentOptions(d);
                        me.loadStockLocations(d);

                        deferred.resolve(d);
                    };

                if (!Ext.isEmpty(d.agencies) && Ext.isArray(d.agencies) && d.agencies.length > 1) {
                    //has multiple agencies
                    // ask user which agent they want to work with
                    //
                } else {
                    //use the base "single" agent
                    //
                    continueFnc(d.agencies);
                }
            }
            // success : function (response, opts) {
            //     var obj = Ext.decode(response.responseText);
            //     if (!Ext.isEmpty(obj.AgentName)) {
            //         vm.set('agentName', obj.AgentName[0].Name);
            //     }
            //     if (!Ext.isEmpty(obj.StockDft)) {
            //         dflt    = obj.StockDft[0].STKDFT;
            //         prodStr = vm.getStore('products');
            //         Ext.apply(prodStr.getProxy().extraParams, {
            //             stkloc : dflt
            //         });
            //         vm.set('STKDFT', dflt);
            //         setTimeout(function () {
            //             vm.set('loadProducts', true);
            //         }, 300);
            //     }
            //     if (!Ext.isEmpty(obj.DelOpts)) {
            //         cartOptions = obj.DelOpts;
            //     }
            //     cmp = Ext.create('Shopping.view.cart.Main', {
            //         cartOptions : cartOptions
            //     });
            //     card.add(cmp);
            //     if (!Ext.isEmpty(callback)) {
            //         Ext.callback(callback, (!Ext.isEmpty(scope)) ? scope : me, [true, obj]);
            //     }
            // },
            // failure : function (response, opts) {
            //     if (!Ext.isEmpty(callback)) {
            //         Ext.callback(callback, (!Ext.isEmpty(scope)) ? scope : me, [false, response]);
            //     }
            // }
        });

        return deferred.promise;
    },

    loadDeliveryOptions : function(content){
        var me    = this,
            vm    = me.getViewModel(),
            store = vm.getStore('DeliveryOptions');

        if (!Ext.isEmpty(store) && !Ext.isEmpty(content.Delms)) {
            store.loadRawData(content.Delms);
        }
    },

    loadPaymentOptions : function (content) {
        var me    = this,
            vm    = me.getViewModel(),
            store = vm.getStore('PaymentOptions');

        if (!Ext.isEmpty(store) && !Ext.isEmpty(content.Payms)) {
            store.loadRawData(content.Payms);
        }
    },

    loadStockLocations : function (content) {
        var me    = this,
            vm    = me.getViewModel(),
            store = vm.getStore('StockLocations');

        if (!Ext.isEmpty(store) && !Ext.isEmpty(content.StockLoc)) {
            store.loadRawData(content.StockLoc);
        }
    }
});
