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

    onAddToCart: function (content) {
        var me = this,
            vm = me.getViewModel(),
            selectedProdsStore = vm.getStore('selectedProds'),
            rec = content.getData();
        console.info('onAddToCart called');
        console.info(content.getData());

        // Trim Record 
        delete rec.ATTRIBS;
        delete rec.id
        Ext.apply(rec, {
            QUANTY: 1,
        })
        console.info(rec);
        selectedProdsStore.loadRawData(rec, true);
        console.info(selectedProdsStore);
        //vm.notify();



    },

    onRemoveFromCart: function (content) {
        console.info('onRemoveFromCart called');
        var me = this,
            vm = me.getViewModel(),
            selectedProdsStore = vm.getStore('selectedProds'),
            rec = content.getData(),
            findRecord = selectedProdsStore.findRecord('MODEL', rec.MODEL);

        // looking up rec in store
        var idx = selectedProdsStore.find('MODEL', rec.MODEL);
        console.info(findRecord);
        if (findRecord) {
            if (findRecord.getData().QUANTY > 1) {
                findRecord.set('QUANTY', findRecord.getData().QUANTY - 1)
            } else {
                selectedProdsStore.remove(findRecord);
            }
        }
    },

    onDeleteRecord: function (btn) {
        console.info('onDeleteRecord called');
        var me = this,
            vm = me.getViewModel(),
            selectedProdsStore = vm.getStore('selectedProds'),
            cell = btn.getParent(),
            record = cell.getRecord();
        console.info(record);


        Ext.Msg.confirm('Confirmation', 'Are you sure you want to delete ' + record.get('MODEL') + '?', function (res) {
            console.info(1)
            console.info(res);
            if (res == 'yes') {
                if (record) {
                    var findRecord = selectedProdsStore.findRecord('MODEL', record.getData().MODEL);
                    selectedProdsStore.remove(findRecord);

                    var prodDv = Ext.ComponentQuery.query('#prodDv');

                    // Change product dataview which has been deleted
                    console.info(prodDv);
                    //prodDv.getViewItems();

                }
            }
        });


        //Ext.Msg.alert('Delete', info.record.get('name'));



    },

    onSave: function (one, two, three) {
        console.info('onSave called');
        console.info(one);
        console.info(two);
        console.info(three);
        var me = this,
            vm = me.getViewModel(),
            custInfoForm = me.lookupReference('custInfoFormRef'),
            custInfoValues = custInfoForm.getValues(),
            selectedProdsStore = vm.getStore('selectedProds');


        console.info(custInfoForm.getValues());
        //console.info(selectedProdsStore.)
    }

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
