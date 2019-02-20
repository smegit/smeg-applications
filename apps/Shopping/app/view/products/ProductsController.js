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
        var me = this,
            vm = me.getViewModel(),
            str = vm.getStore('products');

        str.clearFilter();
    },

    onKeyupSearch: function (fld) {
        var me = this,
            value = fld.getValue(),
            vm = me.getViewModel(),
            str = vm.getStore('products');

        Valence.util.Helper.processTypedInputFilter(str, ['PRODDESC', 'MODEL'], value);
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
        vm.set('catDesc', rec.getData().CATDESC);
        vm.set('catId', rec.getData().CATID);

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

    requestSearch: function () {
        console.log('requestSearch called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {},
            searchForm = me.getView().down('form'),
            queryDetail = searchForm.getValues();
        console.info(queryDetail);

        params = {
            pgm: 'EC1050',
            action: 'search',
        };
        Ext.apply(params, queryDetail);
        console.info(params);
        Ext.Ajax.request({
            //url: '/valence/vvcall.pgm',
            url: 'https://3c865ddd-691b-430f-9a04-d817b32ffe51.mock.pstmn.io/search',
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

    onSearchRequestClick: function () {
        console.log('onSearchRequestClick called');
        var me = this,
            searchWin = me.getView().down('advancedsearch');
        console.info(searchWin);
        searchWin.close();

        Valence.common.util.Helper.loadMask('Searching Products...');
        me.requestSearch()
            .then(function (res) {
                console.info(res);

                Valence.common.util.Helper.destroyLoadMask();

            }, function (res) {
                console.log('failure result');
                console.info(res);
                Valence.common.util.Helper.destroyLoadMask();

            });

    }
});