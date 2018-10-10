Ext.define('Shopping.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    initViewModel: function () {
        var me = this,
            updateAgent = new Ext.util.DelayedTask(function () {
                //console.log('updateAgent');
                me.onSmegAgentSetPortal();
            });


        //listen for the agent change from the portal that is fired
        // from the hook
        //
        window.smegAgentChanged = Ext.bind(function () {
            console.log('window.smegAgentChanged');
            updateAgent.delay(500);
        }, me);

        //get the initial options
        //
        me.getOptions()
            .then(function (content) {
                console.log('get the initial options');
                Valence.common.util.Helper.destroyLoadMask();
                Shopping.getApplication().fireEvent('agentselected', content);
            }, function (content) {
                Valence.common.util.Helper.destroyLoadMask();

                Valence.common.util.Dialog.show({
                    title: 'Error',
                    msg: content.msg,
                    minWidth: 210,
                    buttons: [{
                        text: Valence.lang.lit.ok
                    }],
                    scope: me,
                    handler: function () {
                        Valence.util.App.close(Ext.getUrlParam('app'));
                    }
                });
            });
    },

    /**
     * getOptions - get the options for the application. will be notified if the user is allowed to work with
     *   multiple agencies and if they can ask them what agency
     */
    getOptions: function (agent) {
        console.log('getOptions called');
        var me = this,
            vm = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            params = {
                pgm: 'EC1010',
                action: 'getOptions'
            };

        //check if we are working with a specific agent because the user is allowed to work
        // with multiple agencies
        //
        if (!Ext.isEmpty(agent)) {
            Ext.apply(params, {
                agent: agent
            });
        }

        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: params,
            scope: me,
            success: function (r) {
                var me = this,
                    d = Ext.decode(r.responseText),
                    stockDefault, vmObj;

                if (!Ext.isEmpty(d.msg)) {
                    deferred.reject(d);
                } else {
                    var activeAgent;
                    if (!Ext.isEmpty(parent.smegGetCurrentAgent) && typeof parent.smegGetCurrentAgent === 'function') {
                        activeAgent = parent.smegGetCurrentAgent();
                    }

                    if (!Ext.isEmpty(d.StockDft)) {
                        stockDefault = d.StockDft[0].STKDFT;



                        // Added
                        //stockDefault = d.StockLoc.filter(loc => loc.STKCOD == d.StockDft[0].STKDFT)[0].STKDSC;
                    }

                    //use the base "single" agent
                    //
                    vmObj = {
                        'agentName': d.AgentName[0].Name,
                        'cartOptions': d.DelOpts,
                        // 'STKDFT'      : stockDefault,
                        'STKLOC': stockDefault,
                        'defaultStockLocation': stockDefault,

                        //'STKLOCDES': d.StockLoc.filter(loc => loc.STKCOD == d.StockDft[0].STKDFT)[0].STKDSC
                    };

                    if (!Ext.isEmpty(activeAgent)) {
                        Ext.apply(vmObj, {
                            agent: activeAgent
                        });
                    }

                    console.info(vmObj);
                    // console.info(d);

                    vm.set(vmObj);

                    // me.loadDeliveryOptions(d);
                    me.loadPaymentOptions(d);
                    me.loadStockLocations(d);

                    // load note type options
                    me.loadNoteTypeOptions(d);
                    me.loadNoteActionOptions(d);

                    console.info(d);
                    deferred.resolve(d);
                }
            }
        });

        return deferred.promise;
    },

    loadDeliveryOptions: function (content) {
        var me = this,
            vm = me.getViewModel(),
            store = vm.getStore('DeliveryOptions');

        if (!Ext.isEmpty(store) && !Ext.isEmpty(content.Delms)) {
            store.loadRawData(content.Delms);
        }
    },

    loadPaymentOptions: function (content) {
        var me = this,
            vm = me.getViewModel(),
            store = vm.getStore('PaymentOptions');

        if (!Ext.isEmpty(store) && !Ext.isEmpty(content.Payms)) {
            store.loadRawData(content.Payms);
        }
    },

    loadStockLocations: function (content) {
        //console.log('loadStockLocations called');
        var me = this,
            vm = me.getViewModel(),
            store = vm.getStore('StockLocations');

        // console.info(content);
        // console.info(stkloc);

        // store.reload();
        // store.removeAll();
        // delete store.lastQuery;
        if (!Ext.isEmpty(store) && !Ext.isEmpty(content.StockLoc)) {
            store.loadRawData(content.StockLoc);
            //stkloc[0].updateLayout();
            //store.loadData(content.StockLoc, false);
            //store.load();
        }



    },

    onSmegAgentSetPortal: function () {
        console.log('onSmegAgentSetPortal called');
        var me = this;

        Valence.common.util.Helper.loadMask({
            text: 'Loading Agent'
        });

        //get the initial options
        //
        me.getOptions()
            .then(function (content) {
                Shopping.getApplication().fireEvent('agentselected', content);
                Valence.common.util.Helper.destroyLoadMask();
            });
    },

    loadNoteTypeOptions: function (content) {
        var me = this,
            vm = me.getViewModel(),
            store = vm.getStore('NoteTypeOptions');
        if (!Ext.isEmpty(store) && !Ext.isEmpty(content.noteTypes)) {
            store.loadRawData(content.noteTypes);
        }
        //console.info(store);
    },

    loadNoteActionOptions: function (content) {
        var me = this,
            vm = me.getViewModel(),
            store = vm.getStore('NoteActionOptions');
        if (!Ext.isEmpty(store) && !Ext.isEmpty(content.noteActions)) {
            store.loadRawData(content.noteActions);
        }
        //console.info(store);
    }

});
