Ext.define('Shopping.view.products.ProductsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.products',

    init: function () {
        var me = this,
            catStore = me.getCategoriesStore();

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
        var me = this,
            view = me.getView();

        return view.lookupViewModel().getStore('categories');
    },

    onSelectStockLocation: function (fld, rec) {
        this.getView().fireEvent('selectstocklocation', fld, rec);
    },

    onChangeStockLocation: function (cmp, value) {
        console.log('onChangeStockLocation called ' + value);
        var me = this,
            store = me.getView().lookupViewModel(true).getStore('products');

        console.info(store);
        if (!Ext.isEmpty(value)) {
            Ext.apply(store.getProxy().extraParams, {
                stkloc: value
            });
        }
    },

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
        var me = this;

        if (!Ext.isEmpty(recs)) {
            me.lookupReference('cats').getSelectionModel().select(recs[0]);
        }

        me.lookupReference('productsdv').unmask();
    },

    onSelectFirstCat: function () {
        var me = this,
            catStore = me.getCategoriesStore(),
            firstRec = (!Ext.isEmpty(catStore) && catStore.getCount() > 0) ? catStore.getAt(0) : null;

        if (!Ext.isEmpty(firstRec)) {
            me.lookupReference('cats').getSelectionModel().select(firstRec);
        }
    },

    onUnmaskProductsView: function () {
        this.lookupReference('productsdv').unmask();
    },

    onViewCart: function () {
        console.log('onViewCart called');
        this.getView().fireEvent('viewcart');
    }
});