Ext.define('ShowroomApp.view.category.CategoryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.category',

    init: function (view) {
        // We provide the updater for the activeState config of our View.
        console.log('init called');
        console.info(view);
        view.updateActiveState = this.updateActiveState.bind(this);
    },
    initViewModel: function (viewModel) {
        console.log('initViewModel called');
        console.info(viewModel);
    },

    onToggleKpi: function (button) {
        if (button.pressed) {
            var view = this.getView();
            view.setActiveState(button.filter);
        }
    },

    updateActiveState: function (activeState) {
        console.log('updateActiveState called');
        console.info(activeState);
        // var refs = this.getReferences();
        // var viewModel = this.getViewModel();

        // refs[activeState].setPressed(true);
        // viewModel.set('kpiCategory', activeState);

        // this.fireEvent('changeroute', this, 'kpi/' + activeState);
    },

    onItemTap: function (dv, index, target, rec, e) {
        var me = this,
            vm = me.getViewModel(),
            cateStore = vm.getStore('categories'),
            view = me.getView();
        console.log('onItemTap called');
        console.info(dv);
        console.info(index);
        console.info(target);
        console.info(rec);
        console.info(e);
        // when the category has sub category
        console.info(rec.get('cats'));
        console.info(cateStore);
        if (rec.get('cats')) {
            console.info('has cats');
            cateStore.loadData(rec.get('cats'), false);
            view.getLayout().setAnimation({
                type: 'slide',
                direction: 'right'
            });
            console.info(view);


        } else {
            console.log('has no cats')
        }
    },

    onSegBtnToggle: function (container, button, pressed) {
        //alert("User toggled the '" + button.getText() + "' button: " + (pressed ? 'on' : 'off'));
        //console.info('toggle called');
        // console.info(container);
        // console.info(button);
        // console.info(pressed);
        if (pressed) {
            console.info('toggle called');
            console.info(button);

        }
    }
});
