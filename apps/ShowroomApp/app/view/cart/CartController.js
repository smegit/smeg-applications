Ext.define('ShowroomApp.view.cart.CartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cart',

    init: function (view) {
        // We provide the updater for the activeState config of our View.
        //view.updateActiveState = this.updateActiveState.bind(this);
        console.info(view);
        var me = this,
            vm = me.getViewModel();
        console.info(vm);
        vm.notify();
    },

    // onToggleKpi: function (button) {
    //     if (button.pressed) {
    //         var view = this.getView();
    //         view.setActiveState(button.filter);
    //     }
    // },

    // updateActiveState: function (activeState) {
    //     console.log('updateActiveState called');
    //     console.info(activeState);
    //     var refs = this.getReferences();
    //     var viewModel = this.getViewModel();

    //     refs[activeState].setPressed(true);
    //     viewModel.set('kpiCategory', activeState);

    //     this.fireEvent('changeroute', this, 'kpi/' + activeState);
    // }
});
