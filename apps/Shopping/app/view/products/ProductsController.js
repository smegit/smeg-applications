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
    }
});