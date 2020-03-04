Ext.define('Shopping.Application', {
    extend: 'Ext.app.Application',
    name: 'Shopping',
    requires: [
        'Valence.login.Processor',
        'Valence.common.util.Helper'
    ],
    stores: [
        'Agency'
    ],

    launch: function () {
        var me = this;
        //process login if running outside the portal
        //
        Valence.login.Processor.init({
            namespace: 'Shopping',
            callback: function () {
                Valence.common.util.Helper.loadMask({
                    text: 'SMEG Shopping Cart'
                });
                Ext.create('Shopping.view.main.Main');
            }
        });

        // Ext.Ajax.on('beforerequest', function (conn, options) {
        //     console.info('beforerequest called');
        //     // console.info(conn);
        //     // console.info(options);
        //     if (options.params.pgm === 'EC1010') {
        //         Ext.apply(options.params, {
        //             function: 'shopping'
        //         });
        //     }
        // });




    },

    onBeforeLaunch: function () {
        console.info('onBeforeLaunch called');
        var me = this;
        Ext.Ajax.on('beforerequest', function (conn, options) {
            // console.info('beforerequest called');
            // console.info(conn);
            // console.info(options);
            // if (options.params.pgm === 'EC1010') {
            Ext.apply(options.params, {
                function: 'AGN'
            });
            // }
        });

        // if reload the app from inside then won't need to render selection page
        // var reloadAgentId = localStorage.getItem('reloadAgentId');
        // console.info(reloadAgentId);

        // load agency selection page
        me.requestGetAgencies().then(function (res) {
            console.info(res);
            // var store = Ext.create('Ext.data.Store', {
            //     data: res.agencies
            // });
            // console.info(store);
            var agencyStore = Ext.data.StoreManager.lookup('Agency');
            agencyStore.loadData(res.agencies);
            console.info(agencyStore);

            if (agencyStore.getCount() === 1) {
                //Ext.create('Shopping.view.main.Main');
                me.setAgent(agencyStore.getAt(0));
            } else {
                var agencyWindow = Ext.create('Ext.window.Window', {
                    title: 'Select Agency',
                    renderTo: Ext.getBody(),
                    closable: false,
                    modal: true,
                    width: 500,
                    height: 400,
                    allowEsc: false,
                    cls: 'smeg-agency-sel-win',
                    layout: 'fit',
                    items: [{
                        xtype: 'grid',
                        store: agencyStore,
                        dockedItems: [{
                            xtype: 'toolbar',
                            cls: 'smeg-agency-sel-win-sch-tb',
                            dock: 'top',
                            style: {
                                'z-index': 11
                            },
                            layout: 'fit',
                            items: [{
                                xtype: 'textfield',
                                emptyText: 'Search',
                                listeners: {
                                    scope: me,
                                    afterrender: function (cmp) {
                                        setTimeout(function () {
                                            cmp.focus();
                                        }, 100);
                                    },
                                    change: {
                                        buffer: 350,
                                        fn: function (cmp, value) {
                                            //Valence.util.Helper.processTypedInputFilter2(agencyStore, ['ACCOUNT', 'NAME'], value, 'smegAgentFilter');
                                            Shopping.util.Helper.processTypedInputFilter2(agencyStore, ['NAME', 'ACCOUNT', 'SEARCH'], value, 'smegAgentFilter');

                                        }
                                    },
                                    // specialkey: function (cmp, e) {
                                    //     if (e.getKey() == e.ENTER) {
                                    //         var grid = cmp.up('grid'),
                                    //             store = grid.getStore();
                                    //         if (store.count() === 1) {
                                    //             me.setAgent(store.getAt(0));
                                    //             agencyWindow.destroy();
                                    //         }
                                    //     }
                                    // }
                                }
                            }]
                        }],
                        hideHeaders: true,
                        columns: [{
                            flex: 3,
                            dataIndex: 'NAME'
                        }, {
                            flex: 1,
                            dataIndex: 'ACCOUNT',
                            align: 'right'
                        }],
                        listeners: {
                            scope: me,
                            itemclick: function (cmp, rec) {
                                me.setAgent(rec);
                                agencyWindow.destroy();

                            }
                        },
                        onEsc: function () {
                            return;
                        }
                    }]
                }).show();
            }
            // localStorage.removeItem('reloadAgentId');
        }, function (res) {
            console.info(res);
        });

        return true;
    },

    onAppUpdate: function () {
        window.location.reload();
    },

    requestGetAgencies: function () {
        console.log('requestGetAgencies called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1000',
            action: 'getAgencies',
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'POST',
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

    setAgent: function (rec) {
        console.info('setAgent called');
        var me = this,
            agent = rec.get('ACCOUNT'),
            agencyStore = Ext.data.StoreManager.lookup('Agency');
        Valence.common.util.Helper.loadMask('Setting Agent');
        // clear agency store filter
        agencyStore.removeFilter('smegAgentFilter');

        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: {
                pgm: 'EC1000',
                action: 'setAgent',
                agent: agent
            },
            scope: me,
            success: function (r) {
                var me = this,
                    d = Ext.decode(r.responseText);

                Valence.common.util.Helper.destroyLoadMask();

                // set active agent in the app
                localStorage.setItem('activeAgent', agent);
                // var globalVm = new Ext.app.ViewModel({
                //     data: {
                //         activeAgent = agent,
                //     }
                // });
                if (!d.success) {
                    Valence.common.util.Dialog.show({
                        msg: d.msg || 'Not able to set agency at this time.',
                        buttons: [{
                            text: Valence.lang.lit.ok
                        }],
                        scope: me,
                        // handler: resetAgent
                    });
                } else {
                    Ext.create('Shopping.view.main.Main');
                }
            },
            failure: function () {
                Valence.common.util.Helper.destroyLoadMask();
            }
        });

    }
});
