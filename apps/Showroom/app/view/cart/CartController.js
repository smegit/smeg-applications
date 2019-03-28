Ext.define('Showroom.view.cart.CartController', {
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


        var imgColumn = view.down('grid').getColumns()[0];
        // imgColumn.setRenderer(function () {
        //     return '<img src="/Product/Images/CPRA115N_200x200.jpg" />';
        // });
        console.info(imgColumn);
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
            findRecord = selectedProdsStore.findRecord('MODEL', rec.MODEL, 0, false, false, true);

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
                    var findRecord = selectedProdsStore.findRecord('MODEL', record.getData().MODEL, 0, false, false, true);
                    selectedProdsStore.remove(findRecord);

                    var prodDv = Ext.ComponentQuery.query('#prodDv');

                    // Change product dataview which has been deleted
                    console.info(prodDv);

                    var catView = Ext.ComponentQuery.query('category')[0],
                        catVm = catView.getViewModel(),
                        prodStore = catVm.getStore('products'),
                        findRecordInProds = prodStore.findRecord('MODEL', record.getData().MODEL, 0, false, false, true);
                    if (findRecordInProds) {
                        findRecordInProds.set('addBtnClass', 'dv-prod-btn-deSelected');
                        findRecordInProds.set('addBtnText', 'Add to Cart');
                    }
                    console.info(catView);
                    console.info(catVm);
                    console.info(prodStore);
                    //prodDv.getViewItems();

                }
            }
        });


        //Ext.Msg.alert('Delete', info.record.get('name'));



    },

    /**
     * onAfterRenderAddressSearch - setup the google address lookup fields
     * @param cmp
     */
    onAfterRenderAddressSearch: function (cmp) {
        console.log('onAfterRenderAddress called');
        var me = this,
            input = cmp.el.down('input');

        //google api auto places a place holder on the element. Stop it by adding the attribute
        //
        input.dom.placeholder = 'Street';

        cmp.googleAutoComplete = new google.maps.places.Autocomplete(
            document.getElementById(input.id),
            { types: ['geocode', 'establishment'] });

        //limit auto complete to Australia
        //
        cmp.googleAutoComplete.setComponentRestrictions({
            country: ['au']
        });

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        cmp.googleAutoComplete.addListener('place_changed', Ext.bind(me.autoFillAddress, me, [cmp]));
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
            selectedProdsStore = vm.getStore('selectedProds'),
            selectedArray = [];


        console.info(custInfoForm.getValues());
        var allRecords = (selectedProdsStore.getData().getSource() || selectedProdsStore.getData()).getRange();

        // Constract selectedArray[]
        for (var i = 0; i < selectedProdsStore.getCount(); i++) {
            var p = selectedProdsStore.getAt(i).getData();
            selectedArray.push({
                MODEL: p.MODEL,
                PRICEOLD: p.PRICEOLD,
                PRICE: p.PRICE,
                PRODGROUP: p.PRODGROUP,
                QUANTY: p.QUANTY
            });
            console.info(selectedProdsStore.getAt(i).getData());
        }

        me.requestSave(custInfoValues, JSON.stringify(selectedArray)).then(function (res) {
            console.info(res);
            if (res.success) {
                Ext.Msg.alert('Your quote has been saved.', JSON.stringify(res), Ext.emptyFn);
            } else {
                Ext.Msg.alert('Failed to save your quote', JSON.stringify(res), Ext.emptyFn);

            }
        }, function (res) {
            console.info(res);
            Ext.Msg.alert('Server Error', JSON.stringify(res), Ext.emptyFn);
        });



        console.info(selectedArray);
        console.info(custInfoValues);
    },
    requestSave: function (formData, list) {
        console.info('requestSave called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1010',
            action: 'saveQuote',
            selectedProds: list
        };
        Ext.apply(params, formData)
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
    onEmail: function () {
        console.info('onEmail called');
        setTimeout(function () {
            Ext.Msg.alert('Sent', 'The quote has been sent do you successfully.', Ext.emptyFn);
        }, 500);

        // Should go to first page

    },

    onCancel: function () {
        console.info('onCancel called');
        Ext.Msg.confirm('Confirmation', 'Are you sure you want to leave this page ?', function (res) {
            if (res == 'yes') {
                //Ext.getCmp('app-main').setActiveTab(0);
                console.info(Ext.ComponentQuery.query('app-main')[0].setActiveTab(0));


            } else {

            }
        });

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
