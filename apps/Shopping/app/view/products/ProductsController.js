Ext.define('Shopping.view.products.ProductsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.products',

    init: function () {
        var me = this,
            catStore = me.getCategoriesStore();
        //console.info(catStore);

        if (!Ext.isEmpty(catStore)) {
            catStore.on({
                scope: me,
                load: me.onLoadCategories
            });
        }

        // added
        me.listen({
            controller: {
                '*': { callChangeStockLocation: me.onChangeStockLocation }
            }
        })

    },

    getCategoriesStore: function () {
        console.log('getCategoriesStore called');
        var me = this,
            view = me.getView();

        return view.lookupViewModel().getStore('categories');
    },

    onSelectStockLocation: function (fld, rec) {
        this.getView().fireEvent('selectstocklocation', fld, rec);
    },

    // onChangeStockLocation: function (cmp, value) {
    //     console.log('onChangeStockLocation called ' + value);
    //     var me = this,
    //         vm = me.getViewModel(),
    //         store = me.getView().lookupViewModel(true).getStore('products');

    //     // console.info(store);
    //     //vm.set('STKLOC', value);
    //     if (!Ext.isEmpty(value)) {
    //         Ext.apply(store.getProxy().extraParams, {
    //             stkloc: value
    //         });
    //     }
    // },

    onClearSearch: function (fld) {
        console.info('onClearSearch called');
        var me = this,
            vm = me.getViewModel(),
            catStore = vm.getStore('categories'),

            str = vm.getStore('products');

        //str.clearFilter();
        //console.info(vm);
        //console.info(catStore.getAt(0));
        me.lookupReference('cats').getSelectionModel().deselectAll();
        me.lookupReference('cats').getSelectionModel().select(catStore.getAt(0));
    },

    onSelectCat: function () {
        //console.info('onSelectCat called');
        var me = this,
            view = me.getView(),
            searchField = me.lookupReference('searchField');

        searchField.reset();
        //console.info(searchField);
    },

    // Used to add "Enter Key" listeners
    // onSearchFieldRender: function (cmp, listeners) {
    //     var me = this;
    //     console.info('onSearchFieldRender called');
    //     console.info(cmp);
    //     console.info(listeners);
    //     cmp.getEl().on('keypress', function (e, t, eOpts) {
    //         console.info(e);
    //         console.info(t);
    //         var key = e.which || e.keyCode;
    //         if (key === 13) { // 13 is enter
    //             // code for enter
    //             //Ext.getCmp('searchFieldId').setValue("TEXT");
    //             me.onKeyupSearch(cmp)
    //         }
    //     });
    // },
    onKeyupSearch: function (fld) {
        console.info('onKeyupSearch called');
        var me = this,
            value = fld.getValue(),
            vm = me.getViewModel(),
            prodStore = vm.getStore('products'),

            str = vm.getStore('products');
        console.info(value);
        console.info(value.length);
        // console.info(vm);
        if (value.length == 0) {
            me.onClearSearch();

        }
        if (value.length > 2) {
            me.lookupReference('cats').getSelectionModel().deselectAll();
            var obj = {
                cat: 'CAT',
                searchText: value
            };


            me.lookupReference('productsdv').mask('Loading');
            me.requestSearch(obj).then(function (res) {
                console.info(res);
                if (res.success) {
                    prodStore.loadData(res.prods, false);
                    vm.set({
                        bannerText: res.CATDESC,
                    });
                }
                me.lookupReference('productsdv').unmask();
            }, function () {
                Ext.Msg.alert('Server Error', 'Failed to search products', Ext.emptyFn);
                me.lookupReference('productsdv').unmask();
            });


        }



        //Valence.util.Helper.processTypedInputFilter(str, ['PRODDESC', 'MODEL'], value);

    },


    requestSearch: function (obj) {
        console.log('requestSearch called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1010',
            action: 'getProds',
        };
        Ext.apply(params, obj);
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

    onLoadCategories: function (cmp, recs) {
        console.log('onLoadCategories called');
        var me = this;
        //console.info(recs);

        if (!Ext.isEmpty(recs)) {
            me.lookupReference('cats').getSelectionModel().select(recs[0]);
        }

        me.lookupReference('productsdv').unmask();
    },

    onSelectFirstCat: function () {
        console.log('onSelectFirstCat called');
        // var me = this,
        //     catStore = me.getCategoriesStore(),
        //     firstRec = (!Ext.isEmpty(catStore) && catStore.getCount() > 0) ? catStore.getAt(0) : null;

        // if (!Ext.isEmpty(firstRec)) {
        //     //me.lookupReference('cats').getSelectionModel().select(firstRec);
        // }
    },

    onUnmaskProductsView: function () {
        this.lookupReference('productsdv').unmask();
    },

    onViewCart: function () {
        console.log('onViewCart in products controller called');
        this.getView().fireEvent('viewcart');
        //this.getView().fireEvent('updatecartandshow');
    },
    onUpdateCartAndShow: function () {
        console.log('onUpdateCartAndShow in products controller called');
        this.getView().fireEvent('updatecartandshow');
    },

    onSearchClick: function (view, rowIndex, colIndex, row, event, rec) {
        console.log('onSearchClick called');
        var me = this,
            vm = me.getViewModel();
        var dynamicFields = ['field1', 'field2', 'field3', 'field4', 'field5', 'field6'];
        var productsMainView = Ext.ComponentQuery.query('productsmain')[0];

        // Bind the form title dynamically
        if (!Ext.isEmpty(rec)) {
            vm.set('catDesc', rec.getData().CATDESC);
            vm.set('catId', rec.getData().CATID);
        } else {
            vm.set('catDesc', 'all products');
        }


        console.info(Ext.ComponentQuery.query('productsmain')[0]);

        // Show the search form,'advancedsearch' must be added into DOM 
        // before get the reference of the search form

        productsMainView.add({
            xtype: 'advancedsearch'
        }).show();


        var formPanel = Ext.ComponentQuery.query('advancedsearch')[0].down('form');
        console.info(formPanel);

        // Generate the content of search form dynamically
        dynamicFields.forEach(function (e) {
            formPanel.add({
                xtype: 'textfield',
                name: e,
                fieldLabel: e
            })
        });
        // Generate the search form
    },

    onSearchFormBeforeShow: function () {
        // console.log('onSearchFormBeforeShow called');
    },

    // requestSearch: function () {
    //     console.log('requestSearch called');
    //     var me = this,
    //         deferred = Ext.create('Ext.Deferred'),
    //         params = {},
    //         searchForm = me.getView().down('form'),
    //         queryDetail = searchForm.getValues();
    //     console.info(queryDetail);

    //     params = {
    //         pgm: 'EC1050',
    //         action: 'search',
    //     };
    //     Ext.apply(params, queryDetail);
    //     console.info(params);
    //     Ext.Ajax.request({
    //         //url: '/valence/vvcall.pgm',
    //         url: 'https://3c865ddd-691b-430f-9a04-d817b32ffe51.mock.pstmn.io/search',
    //         method: 'GET',
    //         params: params,
    //         success: function (res) {
    //             var response = Ext.decode(res.responseText);
    //             deferred.resolve(response);
    //         },
    //         failure: function (res) {
    //             var response = Ext.decode(res.responseText);
    //             deferred.reject(response);
    //         }
    //     });
    //     return deferred.promise;
    // },

    onSearchRequestClick: function () {
        console.log('onSearchRequestClick called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            searchWin = me.getView().down('advancedsearch'),
            prodStore = vm.getStore('products'),
            searchForm = me.getView().down('form'),
            queryDetail = searchForm.getValues(),
            cateTree = view.down('categories');
        // console.info(searchForm.getValues());
        // console.info(prodStore);
        // console.info(queryDetail);
        // console.info(cateTree);
        // console.info(cateTree.getSelection());
        //searchWin.close();

        // Trim the queryDetail
        for (var key in queryDetail) {
            if (!queryDetail[key]) {
                delete queryDetail[key]
            }
        }
        //console.info(queryDetail);

        prodStore.clearFilter();
        prodStore.filterBy(function (rec) {

            //console.info(queryDetail);

            //for (var k of Object.keys(queryDetail)) {
            for (var k in queryDetail) {
                //console.log(k, queryDetail[k]);
                var found = rec.data.ATTRIBS.find(function (e) {
                    return e.hasOwnProperty(k);
                });
                // console.info(found);
                // console.info(k);
                // console.info(rec);
                // console.info(queryDetail[k]);

                //console.info(rec.data.ATTRIBS[k]);
                if (found) {
                    var queryString = queryDetail[k].replace(/[|&;$%@"<>()+,]/g, "");
                    var foundString = found[k].replace(/[|&;$%@"<>()+,]/g, "");
                    //var regex = RegExp(queryDetail[k], 'gi');
                    var regex = RegExp(queryString, 'gi');
                    console.info(queryString);
                    console.info(foundString);
                    // if (!regex.test(found[k])) {
                    //     return false;
                    // }

                    if (!regex.test(foundString)) {
                        return false;
                    }
                } else {
                    return false;
                }
            };
            return true;
        });
        //console.info(prodStore);
        vm.notify();


    },

    onSearchFormClearTriggerClick: function (combo, trigger) {
        combo.setValue();
    },
    onSearchFormChange: function (field, value) {
        console.log('onSearchFormChange called');
        var me = this;
        if (value) {
            field.getTrigger('clear').show();
            field.getTrigger('picker').hide();
        } else {
            field.getTrigger('clear').hide();
            field.getTrigger('picker').show();
        }
        me.onSearchRequestClick();
    },

    onSearchAll: function () {
        console.log('onSearchAll called');
        var me = this;
        me.onSearchClick();
    },

    onBackToCate: function () {
        console.log('onBackToCate called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            cateTree = view.down('categories'),
            searchView = view.down('search'),
            cateTreeStore = vm.getStore('categories'),
            prodStore = vm.getStore('products');
        // console.info(cateTree);
        // console.info(searchView);
        cateTree.setHidden(false);
        searchView.setHidden(true);
        cateTreeStore.clearFilter();
        prodStore.clearFilter();
    },

    onSearchAction: function () {
        console.info('onSearchAction called');
    }
});