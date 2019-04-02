Ext.define('Showroom.view.qlist.QlistController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.qlist',


    init: function (view) {
        console.info('initList called');
        console.info(view);
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
            selectedProdsStore = cartVm.getStore('selectedProds');
        console.info(selectedProdsStore);


        // Load selects products
        console.info(rec.get('products'));
        selectedProdsStore.loadRawData(rec.get('products'), true);

    }

});