Ext.define('Shopping.view.main.MainController', {
    extend        : 'Ext.app.ViewController',
    alias         : 'controller.main',
    initViewModel : function () {
        var me          = this,
            updateAgent = new Ext.util.DelayedTask(function () {
                me.onSmegAgentSetPortal();
            });

        //listen for the agent change from the portal that is fired
        // from the hook
        //
        window.smegAgentChanged = Ext.bind(function () {
            updateAgent.delay(500);
        }, me);

        //get the initial options
        //
        me.getOptions()
            .then(function (content) {
                Valence.common.util.Helper.destroyLoadMask();
                Shopping.getApplication().fireEvent('agentselected', content);
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
                var me = this,
                    d  = Ext.decode(r.responseText),
                    stockDefault;

                if (!Ext.isEmpty(d.StockDft)) {
                    stockDefault = d.StockDft[0].STKDFT;
                }

                //use the base "single" agent
                //
                vm.set({
                    'agentName'   : d.AgentName[0].Name,
                    'cartOptions' : d.DelOpts,
                    'STKDFT'      : stockDefault
                });

                me.loadDeliveryOptions(d);
                me.loadPaymentOptions(d);
                me.loadStockLocations(d);

                deferred.resolve(d);
            }
        });

        return deferred.promise;
    },

    loadDeliveryOptions : function (content) {
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
    },

    onSmegAgentSetPortal : function () {
        var me = this;

        Valence.common.util.Helper.loadMask({
            text : 'Loading Agent'
        });

        //get the initial options
        //
        me.getOptions()
            .then(function (content) {
                Shopping.getApplication().fireEvent('agentselected', content);
                Valence.common.util.Helper.destroyLoadMask();
            });
    }
});
