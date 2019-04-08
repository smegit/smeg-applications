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
        var padElement = Ext.get('touchpad');
        //console.info(padElement);
        //Ext.Msg.alert('padElement', JSON.stringify(padElement), Ext.emptyFn);

        view.on({
            click: function (e) {
                console.info('tap event');
                console.info(e);
            }
        });
    },

    onAddToCart: function (content) {
        var me = this,
            vm = me.getViewModel(),
            selectedProdsStore = vm.getStore('selectedProds'),
            rec = content.getData(),
            payload = {};
        console.info('onAddToCart called');
        console.info(content.getData());

        // Trim Record 
        delete rec.ATTRIBS;
        delete rec.id
        Ext.apply(rec, {
            SBQTYO: 1,
        });

        payload = {
            SBITM: rec.MODEL,
            SBQTYO: 1,
            SBUPRC: rec.PRICE,
            I1IDSC: rec.PRODDESC,
            SMALLPIC: rec.SMALLPIC,
            addBtnClass: rec.addBtnClass,
            addBtnText: rec.addBtnText
        };
        console.info(rec);
        console.info(payload);
        //selectedProdsStore.loadRawData(rec, true);
        selectedProdsStore.loadRawData(payload, true);
        console.info(selectedProdsStore);
        //vm.notify();




    },

    onRemoveFromCart: function (content) {
        console.info('onRemoveFromCart called');
        var me = this,
            vm = me.getViewModel(),
            selectedProdsStore = vm.getStore('selectedProds'),
            rec = content.getData(),
            findRecord = selectedProdsStore.findRecord('SBITM', rec.MODEL, 0, false, false, true);

        // looking up rec in store
        console.info(findRecord);
        if (findRecord) {
            // if (findRecord.getData().QUANTY > 1) {
            //     findRecord.set('QUANTY', findRecord.getData().QUANTY - 1)
            // } else {
            selectedProdsStore.remove(findRecord);
            //}
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


        Ext.Msg.confirm('Confirmation', 'Are you sure you want to delete ' + record.get('SBITM') + '?', function (res) {
            console.info(1)
            console.info(res);
            if (res == 'yes') {
                if (record) {
                    var findRecord = selectedProdsStore.findRecord('SBITM', record.getData().SBITM, 0, false, false, true);
                    selectedProdsStore.remove(findRecord);

                    var prodDv = Ext.ComponentQuery.query('#prodDv');

                    // Change product dataview which has been deleted
                    console.info(prodDv);

                    var catView = Ext.ComponentQuery.query('category')[0],
                        catVm = catView.getViewModel(),
                        prodStore = catVm.getStore('products'),
                        findRecordInProds = prodStore.findRecord('SBITM', record.getData().SBITM, 0, false, false, true);
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
        //input.dom.placeholder = 'Street';

        cmp.googleAutoComplete = new google.maps.places.Autocomplete(
            document.getElementById(input['id']),
            { types: ['geocode', 'establishment'] });

        //limit auto complete to Australia
        //
        cmp.googleAutoComplete.setComponentRestrictions({
            country: ['au']
        });

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        cmp.googleAutoComplete.addListener('place_changed', Ext.bind(me.autoFillAddress, me, [cmp]));
        console.info('end');
    },


    autoFillAddress: function (cmp) {
        console.info('autoFillAddress called');
        console.info(cmp);
        var me = this,
            view = me.getView(),
            place = cmp.googleAutoComplete.getPlace(),
            street_number, route, suburb, state, postal_code;
        console.info(place);


        place.address_components.forEach(function (e) {
            console.info(e);

            // get street number
            if (e.types.includes('street_number')) {
                street_number = e.long_name;
            }
            // get street name
            if (e.types.includes('route')) {
                route = e.long_name;
            }
            // get suburb
            if (e.types.includes('locality')) {
                suburb = e.long_name;
            }
            // get state
            if (e.types.includes('administrative_area_level_1')) {
                state = e.short_name;
            }
            // get postal code
            if (e.types.includes('postal_code')) {
                postal_code = e.long_name;
            }
            // get country
            if (e.types.includes('country')) {
                country = e.long_name;
            }
        });


        //console.info(`${street_number} ${route} ${suburb} ${state} ${postal_code} `)

        //var street = place.address_components
        console.info(view.down('fieldset').down('[name=address]'));
        view.down('fieldset').down('[name=SACSTST1]').setValue(street_number + ' ' + route);
        view.down('fieldset').down('[name=SACSTCTY]').setValue(suburb);
        view.down('fieldset').down('[name=SACSTSTA]').setValue(state);
        view.down('fieldset').down('[name=SACSTPST]').setValue(postal_code);
        view.down('fieldset').down('[name=SACSTCOU]').setValue(country);
    },

    onClearAddr: function () {
        console.info('onClearAddr called');
        var me = this,
            view = me.getView();
        //view.down('fieldset').down('[name=address]').reset();
        view.down('fieldset').down('[name=suburb]').reset();
        view.down('fieldset').down('[name=state]').reset();
        view.down('fieldset').down('[name=postCode]').reset();
        view.down('fieldset').down('[name=country]').reset();

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
                SBITM: p.SBITM,
                //PRICEOLD: p.PRICEOLD,
                SBUPRC: p.SBUPRC,
                //PRODGROUP: p.PRODGROUP,
                SBQTYO: p.SBQTYO
            });
            console.info(selectedProdsStore.getAt(i).getData());
        }
        console.info(selectedArray);

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
            pgm: 'EC3050',
            action: 'saveCart',
            products: list
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

    requestRelease: function (cartId) {
        console.info('requestRelease called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC3050',
            action: 'releaseCart',
            cartId: cartId
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'POST',
            params: params,
            success: function (res) {
                console.info(res);
                if (res.success) {
                    console.info('cart has been released');
                }
            },
            failure: function (res) {
                console.info('failed to release the cart');
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
        var me = this,
            vm = me.getViewModel(),
            tabPanel = Ext.ComponentQuery.query('app-main')[0],
            custInfoForm = me.lookupReference('custInfoFormRef'),
            qouteGrid = Ext.ComponentQuery.query('qlist')[0].down('grid'),
            selectedProdsStore = vm.getStore('selectedProds'),
            cartId = '1';
        Ext.Msg.confirm('Confirmation', 'Are you sure you want to leave this page ?', function (res) {
            if (res == 'yes') {
                //Ext.getCmp('app-main').setActiveTab(0);
                //console.info(Ext.ComponentQuery.query('app-main')[0].setActiveTab(0));
                tabPanel.setActiveItem(0);

                // reset cart
                selectedProdsStore.removeAll();
                //

                // Deselect grid
                qouteGrid.deselectAll();

                // reset the customer form
                custInfoForm.reset();


                // release the cart
                me.requestRelease(cartId).then(function (res) {
                    console.info('cart released');
                }, function (res) {
                    console.info('failed to release the cart');
                });

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
