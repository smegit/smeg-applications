Ext.define('Shopping.view.cart.CartController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'Ext.*',
        'Shopping.util.Helper',
        'Shopping.view.cart.PaymentForm',
        'Shopping.view.cart.Payments',
        'Shopping.view.cart.Print',
        'Shopping.view.cart.notes.Notes',

        //'Shopping.view.cart.NoteList',
        'Shopping.view.cart.notes.NotesController'
    ],
    alias: 'controller.cart',
    listen: {
        global: {
            resize: {
                fn: 'onViewportResize',
                buffer: 200
            }
        }
    },

    /**
     * init - setup app level listeners and portal application destroy listener
     */
    init: function () {
        var me = this,
            appFrame = Shopping.util.Helper.getApp();

        me.requiredFieldMsg = 'Please fill in all required sections';

        Shopping.getApplication().on({
            scope: me,
            resetcart: 'onResetCart'
        });

        //listen for the destroy of the application and release if we have an active cart release it
        //
        if (!Ext.isEmpty(appFrame)) {
            appFrame.on({
                scope: me,
                beforedestroy: function () {
                    me.releaseCart(false);
                }
            });
        }
    },

    /**
     * autoFillAddress - auto fill the address fields if the user selected an address from the google lookup
     * @param customer
     */
    autoFillAddress: function (cmp) {
        var me = this,
            place = cmp.googleAutoComplete.getPlace(),
            customer = (cmp.name === 'OACSTST1') ? true : false,
            fieldset = (customer) ? cmp.up('#customerfieldset') : cmp.up('#deliveryfieldset'),
            fields = fieldset.query('field[gApiAddrType]'),
            addressLine2 = fieldset.down('[addressLine2=true]'),
            addressLine1 = '',
            type, field, value;

        if (!Ext.isEmpty(place.address_components)) {
            for (var ii = 0; ii < fields.length; ii++) {
                fields[ii].setValue('');
            }

            for (ii = 0; ii < place.address_components.length; ii++) {
                type = place.address_components[ii].types[0];

                if (type !== 'street_number' && type !== 'route') {
                    field = fieldset.down('[gApiAddrType=' + type + ']');

                    if (!Ext.isEmpty(field)) {
                        value = place.address_components[ii][field.gApiAddrAttr];
                        if (!Ext.isEmpty(value)) {
                            field.setValue(value);
                        }
                    }
                } else {
                    if (type === 'street_number') {
                        value = place.address_components[ii].long_name;
                        if (!Ext.isEmpty(value)) {
                            addressLine1 = value + ' ';
                        }
                    } else {
                        value = place.address_components[ii].long_name;
                        if (!Ext.isEmpty(value)) {
                            addressLine1 += value;
                        }
                    }
                }
            }

            if (customer) {
                if (!Ext.isEmpty(addressLine1)) {
                    fieldset.down('[name=OACSTST1]').setValue(addressLine1);
                }
            } else {
                if (!Ext.isEmpty(addressLine1)) {
                    fieldset.down('[name=OADELST1]').setValue(addressLine1);
                }
            }

            //set the name if the location search is not a standard address
            //
            if (!Ext.isEmpty(place.types) && !Ext.Array.contains(place.types, 'street_address') && !Ext.isEmpty(place.name)) {
                if (customer) {
                    var name = fieldset.down('[name=OACSTNAM]');
                    if (!Ext.isEmpty(name) && Ext.isEmpty(name.getValue())) {
                        name.setValue(place.name)
                    }
                } else {
                    var name = fieldset.down('[name=OADELNAM]');
                    if (!Ext.isEmpty(name) && Ext.isEmpty(name.getValue())) {
                        name.setValue(place.name)
                    }
                }
            }

            //set the phone number if the location search is not a standard address and its provided
            //
            if (!Ext.isEmpty(place.international_phone_number)) {
                //format the number
                //
                var addressPhone = place.international_phone_number,
                    plusFound = addressPhone.indexOf('+');
                if (plusFound !== -1) {
                    var firstSpace = addressPhone.indexOf(' ');
                    if (firstSpace !== -1) {
                        addressPhone = addressPhone.substring(firstSpace);
                    }
                }

                //remove spaces and only keep numbers
                //
                addressPhone = addressPhone.replace(/\s/g, '').replace(/\D+/g, '');

                if (!Ext.isEmpty(addressPhone)) {
                    //make sure its a length of 10
                    //
                    addressPhone = '0000000000'.substr(addressPhone.length) + addressPhone;
                }

                if (customer) {
                    var phoneNumber = fieldset.down('[name=OACSTPH1]');
                    if (!Ext.isEmpty(phoneNumber)) {
                        phoneNumber.setValue(addressPhone)
                    }
                } else {
                    var phoneNumber = fieldset.down('[name=OADELPH1]');
                    if (!Ext.isEmpty(phoneNumber)) {
                        phoneNumber.setValue(addressPhone)
                    }
                }
            }

            if (!Ext.isEmpty(addressLine2)) {
                addressLine2.focus();
            }
        }
    },

    /**
     * closeShowReleaseWindow - close or show the release window
     * @param action
     */
    closeShowReleaseWindow: function (action) {
        var me = this,
            wdw = me.lookupReference('releasewindow');

        if (!Ext.isEmpty(action) && !Ext.isEmpty(wdw)) {
            wdw[action]();
        }
    },

    confirmRelease: function () {
        console.info('confirmRelease called');
        var me = this,
            vm = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            cartInfo = me.getCartInformation(),
            params = {
                pgm: 'EC1050',
                action: 'confirm',
                products: (!Ext.isEmpty(cartInfo) && !Ext.isEmpty(cartInfo.products)) ? Ext.encode(cartInfo.products) : null,
                //stkloc: vm.get('STKLOC')
            };

        Valence.common.util.Helper.loadMask('Processing');

        Ext.apply(params, cartInfo.data);

        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'POST',
            params: params,
            success: function (r) {
                var d = Ext.decode(r.responseText);
                Valence.common.util.Helper.destroyLoadMask();
                if (!d.success || d.success === "false") {
                    me.showError(d);
                    deferred.reject(d);
                    return;
                } else {
                    deferred.resolve(d);
                }
            },
            failure: function () {
                Valence.common.util.Helper.destroyLoadMask();
                Valence.common.util.Dialog.show({
                    title: 'Error',
                    minWidth: 300,
                    msg: 'Not able to process at this time.',
                    buttons: [{
                        text: 'Ok',
                    }]
                });
                deferred.reject();
            }
        });

        return deferred.promise;
    },

    /**
     * depositRelease - process the deposit / release of a order
     * @param cmp
     * @param action
     */
    depositRelease: function (cmp, action) {
        console.log('depositRelease called');
        var me = this,
            vm = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            cartInfo = me.getCartInformation(action),
            view = me.getView(),
            orderKeyFld = view.down('[name=OAORDKEY]'),
            params = {
                pgm: 'EC1050',
                action: action,
                products: (!Ext.isEmpty(cartInfo) && !Ext.isEmpty(cartInfo.products)) ? Ext.encode(cartInfo.products) : null,
                //stkloc: vm.get('STKLOC')
            }, rep;

        if (!Ext.isEmpty(cartInfo)) {
            Valence.common.util.Helper.loadMask(cmp.maskMsg);

            rep = vm.getStore('cartReps').findRecord('REP', cartInfo.data.OAREP, 0, false, false, true);

            if (!Ext.isEmpty(rep)) {
                Ext.apply(params, {
                    OAREPC: rep.get('CODE')
                });
            }

            Ext.apply(params, cartInfo.data);
            Ext.Ajax.request({
                url: '/valence/vvcall.pgm',
                method: 'POST',
                params: params,
                success: function (r) {
                    var d = Ext.decode(r.responseText),
                        orderKey = d.OAORDKEY;

                    if (!Ext.isEmpty(orderKey)) {
                        vm.set('activeCartNumber', orderKey);
                        orderKeyFld.setValue(orderKey);
                    }

                    if (!d.success || d.success === "false") {
                        var respProducts = d.CartDtl;
                        if (respProducts && respProducts.length > 0) {
                            var str = vm.getStore('cartItems'),
                                rec;
                            for (var i = 0; i < respProducts.length; i++) {
                                rec = str.findRecord('product_id', respProducts[i].OBITM);
                                rec.set('allocated', respProducts[i].OBQTYA);
                                rec.commit();
                            }
                        }

                        vm.set('hideAllocated', false);

                        Valence.common.util.Helper.destroyLoadMask();
                        if (Ext.isEmpty(d.msg)) {
                            d.msg = 'Some product(s) not available in selected stock location. Try alternative stock location.';
                        }

                        Valence.common.util.Dialog.show({
                            title: 'Error',
                            minWidth: 300,
                            msg: d.msg,
                            buttons: [{
                                text: 'Ok'
                            }]
                        });
                        deferred.reject(d);
                        return;
                    }

                    deferred.resolve(Ext.apply(d, {
                        action: action
                    }));
                },
                failure: function (response) {
                    var d = Ext.decode(response.responseText);
                    Valence.common.util.Helper.destroyLoadMask();
                    Valence.common.util.Dialog.show({
                        title: 'Error',
                        minWidth: 300,
                        msg: (!Ext.isEmpty(d)) ? d : 'Not able to setup deposit at this time.',
                        buttons: [{
                            text: 'Ok'
                        }]
                    });
                    deferred.reject(d);
                }
            });
        }
        return deferred.promise;
    },

    /**
     * getCartInformation - get the current cart information
     * @returns {*}
     */
    getCartInformation: function (opt) {
        console.info('getCartInformation called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            valid = me.isFormValid(),
            releaseItems = view.down('cartrelease'),
            form = (Ext.isEmpty(releaseItems)) ? view.down('cartform') : releaseItems.down('cartform');

        if (!valid) {
            Valence.util.Helper.showSnackbar(me.requiredFieldMsg);
            return null;
        } else {
            var formData = vm.get('cartValues'),
                store = view.lookupViewModel(true).getStore('cartItems'),
                storeCount = store.getCount(),
                standardOrder = me.isStandardOrder(opt),
                prodArray = [],
                product, rec;

            Ext.apply(formData, form.getValues());
            //console.info(store);
            //console.info(form.getValues());

            for (var i = 0; i < storeCount; i++) {
                rec = store.getAt(i);
                product = rec.getData();
                //console.info(Shopping.util.Helper.getOutstanding(rec));
                //console.info(product);
                prodArray.push({
                    OBITM: product.product_id,
                    OBQTYO: product.quantity,
                    OBQTYD: product.delivered,
                    OBUPRC: product.price,
                    //OBQTYR: (standardOrder) ? Shopping.util.Helper.getOutstanding(rec) : product.release
                    OBQTYR: product.release,

                    //OBGENF: product.generated,
                    ALWDEL: product.deletable,
                    ALWORDQ: product.orderQtyEditable,
                    ALWRLSQ: product.releaseQtyEditable,
                    OBORDLNO: product.orderLineNO,
                    OBPRMCOD: product.OBPRMCOD

                });
            }

            //remove the address search fields if in the values object
            //
            //customer
            //
            if (typeof formData.customerSearch !== 'undefined') {
                delete formData.customerSearch;
            }

            //delivery
            //
            if (typeof formData.deliverySearch !== 'undefined') {
                delete formData.deliverySearch;
            }

            // Remove fieldset collapsible checkbox from formData
            var checkboxName = form.down('#deliveryfieldset').down('checkbox').name;

            if (checkboxName && typeof formData[checkboxName] !== 'undefined') {
                delete formData[checkboxName];
            }
            if (!form.down('#deliveryfieldset').down('checkbox').value) {
                formData['OADELCON'] = '';
                formData['OADELCOU'] = '';
                formData['OADELCTY'] = '';
                formData['OADELEML'] = '';
                formData['OADELNAM'] = '';
                formData['OADELPH1'] = '';
                formData['OADELPH2'] = '';
                formData['OADELPST'] = '';
                formData['OADELST1'] = '';
                formData['OADELST2'] = '';
                formData['OADELSTA'] = '';
            }

            return {
                data: formData,
                products: prodArray
            };
        }
    },


    // get cart information without validating form
    getCart: function () {
        console.log('getCart called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            form = view.down('cartform'),
            formData = vm.get('cartValues'),
            store = vm.getStore('cartItems'),
            prodArray = [], item;
        //console.info(store);

        //console.info(form);
        //console.info(form.getValues());
        Ext.apply(formData, form.getValues());
        // generate product Array
        for (var i = 0; i < store.getCount(); i++) {
            item = store.getAt(i).getData();
            prodArray.push({
                OBITM: item.product_id,
                OBQTYO: item.quantity,
                OBQTYD: item.delivered,
                OBUPRC: item.price,
                //OBQTYR: (standardOrder) ? Shopping.util.Helper.getOutstanding(rec) : product.release
                OBQTYR: item.release,
                //OBGENF: item.generated,

                ALWDEL: product.deletable,
                ALWORDQ: product.orderQtyEditable,
                ALWRLSQ: product.releaseQtyEditable,
                OBORDLNO: product.orderLineNO,
                OBPRMCOD: product.OBPRMCOD
            })

        }

        return {
            data: formData,
            products: prodArray
        }
    },


    /**
     * getPayments - get the order payments
     * @param content
     */
    getPayments: function (content) {
        var me = this,
            vm = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            view = me.getView(),
            checkout = (content.action === 'checkout') ? true : false;

        vm.set('orderPayments', null);

        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: {
                pgm: 'EC1050',
                action: 'getPayments',
                OAORDKEY: content.OAORDKEY,
                paymode: content.action
            },
            success: function (r) {
                var d = Ext.decode(r.responseText);
                if (d.success) {
                    d.OAORDKEY = content.OAORDKEY;
                    vm.set('orderPayments', d);
                    vm.notify();
                    deferred.resolve(content);
                } else {
                    Valence.common.util.Helper.destroyLoadMask();
                    me.showError(d)
                        .then(function () {
                            deferred.reject(d);
                        });
                }
            },
            failure: function (response) {
                Valence.common.util.Helper.destroyLoadMask();
                me.showError(response)
                    .then(function () {
                        deferred.reject(Ext.decode(response.responseText));
                    });
            }
        });

        return deferred.promise;
    },

    isFormValid: function () {
        var me = this,
            view = me.getView(),
            releaseItems = view.down('cartrelease'),
            form = (Ext.isEmpty(releaseItems)) ? view.down('cartform') : releaseItems.down('cartform'),
            valid = form.isValid(),
            fieldInError = (!valid) ? form.down('field{isValid()===false}') : null;

        if (Ext.isEmpty(fieldInError)) {
            // var flwDate = me.lookupReference('followUpDte'),
            //     flwDateValue = flwDate.getValue(),
            //     flwMsg = me.lookupReference('followUpMsg'),
            //     flwMsgValue = flwMsg.getValue(),
            //     msg = 'This field is required',
            //     markInvaild = function (fld) {
            //         fld.markInvalid(msg);
            //         fld.focus();
            //         valid = false;
            //     }
            // //check to see if followup info was set and set correctly
            // //
            // if (!Ext.isEmpty(flwDateValue) && Ext.isEmpty(flwMsgValue)) {
            //     markInvaild(flwMsg);
            // } else if (Ext.isEmpty(flwDateValue) && !Ext.isEmpty(flwMsgValue)) {
            //     markInvaild(flwDate);
            // }
        } else {
            fieldInError.focus();
        }

        return valid;
    },

    /**
     * isStandardOrder - determine if this is a standard order. meaning all the release fields are 0 and
     *    outstanding is greater than 0.
     * @returns {boolean}
     */
    isStandardOrder: function (opt) {
        var me = this,
            view = me.getView(),
            store = view.lookupViewModel(true).getStore('cartItems'),
            outstandingItems = store.queryBy(function (rec) {
                var outstanding = Shopping.util.Helper.getOutstanding(rec);
                if (!Ext.isEmpty(outstanding) && outstanding > 0) {
                    return true;
                }
            }),
            releaseZeroItems = store.queryBy(function (rec) {
                var outstanding = Shopping.util.Helper.getOutstanding(rec);
                if (!Ext.isEmpty(outstanding) && outstanding > 0 && rec.get('release') == 0) {
                    return true;
                }
            }), standard;

        if (outstandingItems.getCount() === releaseZeroItems.getCount() && opt == 'checkout') {
            standard = true;
            releaseZeroItems.each(function (rec) {
                rec.set('release', Shopping.util.Helper.getOutstanding(rec));
                rec.commit();
            })
        } else {
            standard = false;
        }

        // console.info(standard);
        // console.info(outstandingItems);
        // console.info(releaseZeroItems);
        return standard;
    },

    /**
     * onActivate - setup the cart view.
     */
    onActivate: function () {
        console.log('onActivate called');

        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            mainForm = view.down('cartform'),
            custDetail = view.down('cart-customerdetail'),
            dlvFieldSet = custDetail.down('#deliveryfieldset'),
            dlvName = dlvFieldSet.down('[name=OADELNAM]').getValue(),
            cartForm = Ext.ComponentQuery.query('cartmain')[0].down('cartform').getForm(),
            totalPaid = vm.get('totalPaid'),
            paymentGrid = me.getView().down('paymenthistory'),
            cartItemGrid = me.getView().down('cartlist');

        vm.set('hideAllocated', true);
        if (vm.get('hideOrdKey')) {
            mainForm.down('#cartrepscombo').setReadOnly(false);
        }

        view.lookupViewModel(true).getStore('cartReps').load();

        Ext.ComponentQuery.query('cartlist')[0].reconfigure(view.lookupViewModel(true).getStore('cartItems'));

        dlvFieldSet.checkboxCmp.setValue(!Ext.isEmpty(dlvName));

        // set scroll to top
        //
        view.setScrollY(0);

        setTimeout(function () {
            mainForm.down('#reffield').focus();

            // disable calculate button
            me.lookupReference('calcBtn').disable();

            //console.info(paymentGrid);

            // toggle item list summary 
            cartItemGrid.getView().getFeature('itemSummary').toggleSummaryRow(true);
            // toggle payment history summary
            Ext.apply(paymentGrid.getColumns()[1], {
                summaryRenderer: function () {
                    //var total = Ext.util.Format.number(totalPaid, '0,0.00');
                    //return Ext.String.format('<b>PAID: {0}</b>', total);
                    return vm.get('listFooterText');
                }
            });
            paymentGrid.getView().getFeature('paymentSummary').toggleSummaryRow(true);

        }, 200);
    },

    /**
     * onAfterRenderAddressSearch - setup the google address lookup fields
     * @param cmp
     */
    onAfterRenderAddressSearch: function (cmp) {
        //console.log('onAfterRenderAddress called');
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

    onBeforeActivate: function () {
        console.log('onBeforeActivate called');
        var me = this,
            vm = me.getViewModel(),
            orderPayments = vm.get('orderPayments'),
            activeCartNumber = vm.get('activeCartNumber');

        if (Ext.isEmpty(orderPayments) && !Ext.isEmpty(activeCartNumber)) {
            Valence.common.util.Helper.loadMask('Loading');

            // me.getPayments({
            //     action: 'checkout',
            //     OAORDKEY: activeCartNumber
            // })
            //     .then(function () {
            //         Valence.common.util.Helper.destroyLoadMask();
            //     });
            Valence.common.util.Helper.destroyLoadMask();
        }
    },

    onBeforeEditList: function (editor, context) {
        console.log('onBeforeEditList called');
        var me = this,
            field = context.field,
            rec = context.record,
            outstanding = Shopping.util.Helper.getOutstanding(rec),
            checkoutButton = me.lookupReference('checkoutButton');
        //console.info(editor);
        //console.info(context);

        // if (!Ext.isEmpty(rec.get('generated')) && rec.get('generated') == 'Y') {
        //     return false;
        // }

        if (context.field == 'quantity') {
            if (!Ext.isEmpty(rec.get('orderQtyEditable')) && rec.get('orderQtyEditable') == 'N') {
                return false;
            }
        }
        if (context.field == 'release') {
            if (!Ext.isEmpty(rec.get('releaseQtyEditable')) && rec.get('releaseQtyEditable') == 'N') {
                return false;
            }
        }

        // if (!Ext.isEmpty(rec.get('orderQtyEditable')) && rec.get('orderQtyEditable') == 'N') {
        //     return false;
        // }

        if (field === 'release' && (Ext.isEmpty(outstanding) || outstanding == 0)) {
            return false;
        }

        //checkoutButton.disable();
    },

    onCancelEditList: function () {
        var me = this,
            checkoutButton = me.lookupReference('checkoutButton');

        //checkoutButton.enable();
    },

    /**
     * onCellClickList - check if user is requesting to remove an item from the cart
     * @param cmp
     * @param td
     * @param cellIndex
     * @param rec
     */
    onCellClickList: function (cmp, td, cellIndex, rec, tr, rowIndex, e) {
        console.log('onCellClickList called');
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            grid = cmp.grid,
            store = grid.getStore(),
            column = grid.headerCt.items.getAt(cellIndex),
            viewModel = me.getViewModel(),
            cartCount = viewModel.get('cartCount');
        // console.info(rec);
        // console.info(store);
        // console.info(column);
        if (rec.get('deletable') == 'Y') {
            if (!Ext.isEmpty(column.action) && column.action === 'removecartitem' && store.getCount() > 1) {
                if (Ext.isEmpty(rec.get('delivered')) || rec.get('delivered') == 0) {
                    viewModel.set('cartCount', cartCount - rec.get('quantity'));
                    store.remove(rec);
                    grid.getView().refresh();

                    // Set buttons
                    vm.set('needUpdate', true);
                    Ext.ComponentQuery.query('#calcBtnSelector')[0].enable();
                    //Ext.ComponentQuery.query('cartlist')[0].getView().getFeature('itemSummary').toggleSummaryRow(false);
                    //Ext.ComponentQuery.query('#listFooterSumId')[0].setHidden(true);
                    // Disable payBtn and chkoutBtn, pdf, notes , save
                    Ext.ComponentQuery.query('#payBtnSelector')[0].setDisabled(true);
                    Ext.ComponentQuery.query('#chkoutBtnSelector')[0].setDisabled(true);

                    Ext.ComponentQuery.query('#pdfBtnSelector')[0].setDisabled(true);
                    Ext.ComponentQuery.query('#notesBtnSelector')[0].setDisabled(true);
                    Ext.ComponentQuery.query('#saveBtnSelector')[0].setDisabled(true);



                }
            } else {
                var target = e.getTarget(),
                    item = (!Ext.isEmpty(target)) ? Ext.get(target) : null;

                if (!Ext.isEmpty(item) && (item.hasCls('cart-list-prd-detail') || item.up('.cart-list-prd-detail'))) {
                    view.fireEvent('showdetail', view, {
                        getData: function () {
                            return {
                                MODEL: rec.get('product_id')
                            }
                        }
                    }, true);
                }
            }
        } else {
            console.log('click on generated item');
        }

    },

    /**
     * onCellEditList - update the cart values
     * @param editor
     * @param e
     */
    onCellEditList: function (editor, e) {
        e.record.commit();

        var me = this,
            viewModel = me.getViewModel(),
            total = e.store.sum('quantity');

        //update the cart number
        //
        if (!Ext.isEmpty(total)) {
            viewModel.set('cartCount', total);
        } else {
            viewModel.set('cartCount', 0);
        }
    },

    /**
     * onClickBack - request to go back to the main landing section of products
     */
    onClickBack: function () {
        console.log('onClickBack called');
        var me = this,
            view = me.getView();
        view.fireEvent('back', view);
    },

    onClickClear: function () {
        //console.log('onClickClear called');
        var me = this,
            view = me.getView();

        me.resetCart();
        view.fireEvent('reset', view);
        me.onClickBack();
    },


    /**
     * onClickDeposit - request start depositing on this order, get the payments and show the payment entery window
     * @param cmp
     */
    onClickDeposit: function (cmp) {
        console.log('onClickDeposit called');
        //console.info(cmp);
        var me = this,
            valid = me.isFormValid();

        if (valid) {
            me.depositRelease(cmp, 'deposit')
                .then(Ext.bind(me.getPayments, me))
                .then(Ext.bind(me.requestPayment, me));
        } else {
            Valence.util.Helper.showSnackbar(me.requiredFieldMsg);
        }
    },

    onClickNotes1: function () {
        console.log('onClickNotes1 called');
        var me = this,
            cartInfo = me.getCartInformation(),
            vm = me.getViewModel(),
            orderNumber = vm.get('activeCartNumber');
        if (!Ext.isEmpty(cartInfo)) {
            Valence.common.util.Helper.loadMask('Loading');
        }


        me.requestNotes(orderNumber)
            .then(function (content) {
                if (!Ext.isEmpty(content) && content.success) {
                    Valence.common.util.Helper.destroyLoadMask();
                    me.showNotes(content);
                } else {
                    Valence.common.util.Helper.destroyLoadMask();
                    me.showError({ msg: 'Failed to get notes' });
                }
            }, function (content) {
                Valence.common.util.Helper.destroyLoadMask();
                me.showError({ msg: 'Failed to get notes' });
            });
        // me.requestCalcualte()
        //     .then(function (res) {

        //         if (!Ext.isEmpty(res) && res.success) {
        //             me.loadCart(res);
        //             return res.CartHdr[0].OAORDKEY

        //         } else {
        //             console.log('loadCart error');
        //             Valence.common.util.Helper.destroyLoadMask();
        //             me.showError(res);
        //         }

        //     }, function (res) {
        //         //console.info(res);
        //         Valence.common.util.Helper.destroyLoadMask();
        //         me.showError(res);
        //     }).
        //     then(function (key) {
        //         var me = this,
        //             deferred = Ext.create('Ext.Deferred'),
        //             params = {
        //                 pgm: 'EC1050',
        //                 action: 'getNotes',
        //                 OAORDKEY: key
        //             };
        //         Ext.Ajax.request({
        //             url: '/valence/vvcall.pgm',
        //             params: params,
        //             success: function (r) {
        //                 var d = Ext.decode(r.responseText);
        //                 //console.info(d);
        //                 deferred.resolve(d);
        //             }
        //         });
        //         return deferred.promise;
        //     })
        //     .then(function (content) {
        //         Valence.common.util.Helper.destroyLoadMask();
        //         me.showNotes(content);
        //     });
    },


    requestNotes: function (key) {
        var me = this,
            cartInfo = me.getCartInformation(),
            deferred = Ext.create('Ext.Deferred'),
            params = {
                pgm: 'EC1050',
                action: 'getNotes',
                OAORDKEY: key,
                products: (!Ext.isEmpty(cartInfo) && !Ext.isEmpty(cartInfo.products)) ? Ext.encode(cartInfo.products) : null,
            };
        Ext.apply(params, cartInfo.data);
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: params,
            success: function (r) {
                var d = Ext.decode(r.responseText);
                //console.info(d);
                deferred.resolve(d);
            }
        });
        return deferred.promise;
    },


    onClickNotes: function () {
        //console.log('debug onClickNotes called');
        var me = this,
            vm = me.getViewModel(),
            valid = me.isFormValid(),
            cartInfo = me.getCartInformation(),
            needUpdate = vm.get('needUpdate'),
            formDirty = false;

        // reset form value
        var cartForm = Ext.ComponentQuery.query('cartmain')[0].down('cartform').getForm();

        // check if form dirty
        items = cartForm.getFields().items;
        for (i = 0; i < items.length; i++) {
            if (items[i].wasDirty == true) {
                formDirty = true;
                break;
            };
        }
        // console.log(needUpdate);
        // console.info(formDirty);
        if (valid) {
            if (!Ext.isEmpty(cartInfo) && (needUpdate || formDirty)) {
                me.saveCart(cartInfo.data, cartInfo.products, 'Saving Existing Order...')
                    .then(function (content) {
                        vm.set('activeCartNumber', content.OAORDKEY);

                        Ext.apply(cartInfo.data, {
                            OAORDKEY: content.OAORDKEY
                        });
                        vm.notify();
                        // reset dirty = false
                        for (i = 0; i < items.length; i++) {
                            items[i].wasDirty = false;
                        }

                        return content.OAORDKEY;
                    })
                    .then(function (key) {
                        var me = this,
                            deferred = Ext.create('Ext.Deferred'),
                            params = {
                                pgm: 'EC1050',
                                action: 'getNotes',
                                OAORDKEY: key
                            };
                        Ext.Ajax.request({
                            url: '/valence/vvcall.pgm',
                            params: params,
                            success: function (r) {
                                var d = Ext.decode(r.responseText);
                                //console.info(d);
                                deferred.resolve(d);
                            }
                        });
                        return deferred.promise;
                    })
                    .then(function (content) {
                        //console.info(content);
                        me.showNotes(content);
                        //Ext.bind(me.loadNotes(content), me);
                        // Ext.ComponentQuery.query('app-main')[0].add({
                        //     xtype: 'notes',
                        //     viewModel: {
                        //         data: {
                        //             //orderKey: vm.get('activeCartNumber')
                        //         }
                        //     },
                        //     listeners: {
                        //         delay: 200,
                        //         beforerender: function (cmp) {
                        //             console.log('beforerender called');
                        //             console.info(cmp);
                        //             console.info(content);
                        //             var storeNotes = cmp.getViewModel().getStore('Notes'),
                        //                 storeNoteTypeOpts = cmp.getViewModel().getStore('NoteTypeOpts'),
                        //                 storeNoteActionOpts = cmp.getViewModel().getStore('NoteActionOpts'),
                        //                 storeNoteDetailOpts = cmp.getViewModel().getStore('NoteDetailOpts');
                        //             storeNoteTypeOpts.loadRawData(content.noteTypes);
                        //             storeNoteActionOpts.loadRawData(content.noteActions);
                        //             storeNoteActionOpts.insert(0, [{ 'NOTEACTC': null, 'NOTEACTD': "None", 'NOTEACTS': null, 'NOTEACTV': null }]);
                        //             storeNoteDetailOpts.loadRawData(content.emailDefaults);
                        //             storeNotes.loadRawData(content.notes);
                        //         },
                        //         beforeshow: function (cmp) {
                        //             console.log('beforeshow called');
                        //         },
                        //         show: function (cmp) {
                        //             var store = cmp.getViewModel().getStore('Notes');
                        //         },
                        //         afterrender: function (cmp) {
                        //             var store = cmp.getViewModel().getStore('Notes');
                        //             if (store.getCount() > 0) {
                        //                 cmp.lookupReference('notelist').getSelectionModel().select(0);
                        //             } else {
                        //                 cmp.lookupReference('noteType').focus();
                        //             }

                        //         }
                        //     }
                        // }).show();
                    });
            } else {
                var orderNumber = vm.get('activeCartNumber');
                me.getNotes(orderNumber)
                    .then(function (content) {
                        //console.info(content);
                        me.showNotes(content);
                    })
            }
            vm.set('needUpdate', false);
            formDirty = false;

        } else {
            Valence.util.Helper.showSnackbar(me.requiredFieldMsg);
        }

    },


    // Get Notes 
    getNotes: function (orderNumber) {
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {
                pgm: 'EC1050',
                action: 'getNotes',
                OAORDKEY: orderNumber
            };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: params,
            success: function (r) {
                var d = Ext.decode(r.responseText);
                //console.info(d);
                deferred.resolve(d);
            }
        });
        return deferred.promise;
    },


    // Show notes window
    showNotes: function (content) {
        Ext.ComponentQuery.query('app-main')[0].add({
            xtype: 'notes',
            viewModel: {
                data: {
                    //orderKey: vm.get('activeCartNumber')
                }
            },
            listeners: {
                delay: 200,
                beforerender: function (cmp) {
                    // console.log('beforerender called');
                    // console.info(cmp);
                    // console.info(content);
                    var storeNotes = cmp.getViewModel().getStore('Notes'),
                        storeNoteTypeOpts = cmp.getViewModel().getStore('NoteTypeOpts'),
                        storeNoteActionOpts = cmp.getViewModel().getStore('NoteActionOpts'),
                        storeNoteDetailOpts = cmp.getViewModel().getStore('NoteDetailOpts');
                    storeNoteTypeOpts.loadRawData(content.noteTypes);
                    storeNoteActionOpts.loadRawData(content.noteActions);
                    storeNoteActionOpts.insert(0, [{ 'NOTEACTC': null, 'NOTEACTD': "None", 'NOTEACTS': null, 'NOTEACTV': null }]);
                    storeNoteDetailOpts.loadRawData(content.emailDefaults);
                    storeNotes.loadRawData(content.notes);
                },
                beforeshow: function (cmp) {
                    //console.log('beforeshow called');
                },
                show: function (cmp) {
                    var store = cmp.getViewModel().getStore('Notes');
                },
                afterrender: function (cmp) {
                    var store = cmp.getViewModel().getStore('Notes');
                    if (store.getCount() > 0) {
                        cmp.lookupReference('notelist').getSelectionModel().select(0);
                        cmp.lookupReference('notelist').getView().focusRow(0);
                    } else {
                        cmp.lookupReference('noteType').focus();
                    }

                }
            }
        }).show();
    },


    // // Load Type Options
    // loadNoteTypeOpts: function (content) {
    //     console.log('loadNoteTypeOptions called');
    //     var me = this,
    //         notesVm = Ext.ComponentQuery.query('notes')[0].getViewModel(),
    //         store = notesVm.getStore('NoteTypeOpts');
    //     console.info(notesVm);
    //     if (!Ext.isEmpty(store) && !Ext.isEmpty(content.noteTypes)) {
    //         store.loadRawData(content.noteTypes);
    //     }
    //     console.info(store);
    // },

    // // Load Action Options
    // loadNoteActionOptions: function (content) {
    //     console.log('loadNoteActionOptions called');
    //     //console.info(content);

    //     var noteActionOpts = content.noteActions;

    //     var me = this,
    //         vm = me.getViewModel(),
    //         store = vm.getStore('NoteActionOptions');
    //     if (!Ext.isEmpty(store) && !Ext.isEmpty(content.noteActions)) {
    //         //noteActionOpts.push({ "NOTEACTC": ' ', "NOTEACTD": ' ', "NOTEACTS": ' ', "NOTEACTV": ' ' });
    //         //console.info(noteActionOpts);
    //         store.loadRawData(content.noteActions);
    //         store.insert(0, [{ 'NOTEACTC': null, 'NOTEACTD': "None", 'NOTEACTS': null, 'NOTEACTV': null }]);
    //     }
    //     //console.info(store);
    // },


    // // Load Detail Options
    // loadNoteDetailOptions: function (content) {
    //     console.log('loadNoteDetailOptions called');
    //     var noteDetailOpts = content.emailDefaults;
    //     var me = this,
    //         vm = me.getViewModel(),
    //         store = vm.getStore('NoteDetailOptions');
    //     if (!Ext.isEmpty(store) && !Ext.isEmpty(content.emailDefaults)) {
    //         store.loadRawData(content.emailDefaults);
    //     }
    //     //console.info(store);
    // },

    // // Load Notes
    // loadNotes: function (content) {
    //     console.log('loadNotes called');
    //     console.info(content);
    //     console.info(Ext.ComponentQuery.query('notes')[0].getViewModel());
    //     console.info(this);

    //     var notesVm = Ext.ComponentQuery.query('notes')[0].getViewModel(),
    //         store = notesVm.getStore('Notes');
    //     console.info(Ext.ComponentQuery.query('notes')[0].getViewModel());
    //     if (!Ext.isEmpty(store) && !Ext.isEmpty(content.notes)) {
    //         store.loadRawData(content.notes);
    //     }
    //     // console.info(this);
    // },



    /**
     * onClickRelease - start the release of the selected products.
     * @param cmp
     */
    onClickRelease: function (cmp) {
        console.log('onClickRelease called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            valid = me.isFormValid();

        if (valid) {
            me.depositRelease(cmp, 'checkout')
                .then(function (content) {
                    //check if all release values are zero
                    //console.info(content);
                    var standardOrder = me.isStandardOrder(),
                        store = view.lookupViewModel(true).getStore('cartItems'),
                        count = store.getCount(),
                        rec;

                    store.suspendEvents(true);
                    for (var ii = 0; ii < count; ii++) {
                        rec = store.getAt(ii);
                        if (standardOrder) {
                            rec.set('viewReleaseQty', Shopping.util.Helper.getOutstanding(rec));
                            rec.commit();
                        } else {
                            rec.set('viewReleaseQty', rec.get('release'));
                            rec.commit();
                        }
                    }
                    store.resumeEvents();

                    vm.set('hideAllocated', true);

                    //setup delivery options
                    //
                    if (!Ext.isEmpty(content.DeliveryOptions)) {
                        vm.set('deliveryOptions', content.DeliveryOptions);
                    } else {
                        vm.set('deliveryOptions', null);
                    }
                    vm.notify();
                    Valence.common.util.Helper.destroyLoadMask();
                    view.add({
                        xtype: 'cartrelease',
                        reference: 'releasewindow',
                        renderTo: Ext.getBody(),
                        chkContent: content
                    }).show();
                });
        } else {
            Valence.util.Helper.showSnackbar(me.requiredFieldMsg);
        }
    },

    /**
     * onClickReleaseConfirm - process the release of products requesting payment if needed.
     */
    onClickReleaseConfirm: function () {
        console.info('onClickReleaseConfirm called');
        var me = this,
            vm = me.getViewModel(),
            releaseWindow = me.lookupReference('releasewindow');

        releaseWindow.hide();

        Valence.common.util.Helper.loadMask('Processing');

        me.getPayments(releaseWindow.chkContent)
            .then(Ext.bind(function (content) {
                //first check if we need to request payment
                //
                var requestPay = true,
                    orderPay = vm.get('orderPayments');
                //check if max pay is equal to 0 and if so we do not have to request payment
                //
                if (!Ext.isEmpty(orderPay.maxpay) && !Ext.isEmpty(orderPay.maxpay[0].maxpay) && parseFloat(orderPay.maxpay[0].maxpay) == 0) {
                    requestPay = false;
                }

                if (requestPay) {
                    console.info('requestPay');
                    me.requestPayment(content);
                } else {
                    var cartInfo = me.getCartInformation();

                    // confirm release because they have a max pay of 0 meaning they already deposited the full amount.
                    //
                    me.confirmRelease()
                        .then(function (content) {
                            console.info('afterconfirmRelease');
                            me.closeShowReleaseWindow('close');
                            me.printCart(content.OAORDKEY, cartInfo.data, content.printURL);
                            me.onClickClear();
                        }, function () {
                            me.closeShowReleaseWindow('close');
                            me.onClickClear();
                        });
                }
            }, me))
            .then(Ext.bind(me.requestPayment, me), function () {
                releaseWindow.show();
            });
    },



    // on Click PDF - bring the pdf 
    onClickPDF: function () {
        console.log('onClickPDF called');
        var me = this,
            cartInfo = me.getCartInformation();
        //me.onClickSave();
        if (!Ext.isEmpty(cartInfo)) {
            Valence.common.util.Helper.loadMask('Generating PDF......');
            me.requestPDF()
                .then(function (content) {
                    Valence.common.util.Helper.destroyLoadMask();
                    console.info(content);
                    if (content.success) {
                        // var win = window.open('', '_blank');
                        // win.location = content.printURL;
                        // win.focus();
                        me.printCart(content.OAORDKEY, cartInfo.data, content.printURL);
                    } else {
                        me.showError({ msg: 'Failed to download PDF' });
                    }

                }, function () {
                    Valence.common.util.Helper.destroyLoadMask();
                    me.showError({ msg: 'Failed to download PDF' });
                });
        }

    },

    requestPDF: function () {
        console.log('requestPDF called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            vm = me.getViewModel(),
            params = {},
            cartInfo = me.getCartInformation(),
            valid = me.isFormValid();
        //console.info(cartInfo);
        params = {
            pgm: 'EC1050',
            action: 'getPDF',
            //OAORDKEY: vm.get('activeCartNumber'),
            products: (!Ext.isEmpty(cartInfo) && !Ext.isEmpty(cartInfo.products)) ? Ext.encode(cartInfo.products) : null,

        };
        if (valid) {
            Ext.apply(params, cartInfo.data);
            console.log('valid form');
            Ext.Ajax.request({
                url: '/valence/vvcall.pgm',
                //method: 'GET',
                params: params,
                success: function (res) {
                    //console.info(res);
                    var resp = Ext.decode(res.responseText);
                    deferred.resolve(resp);
                    //deferred.reject(resp);
                },
                failure: function (res) {
                    //console.info(res);
                    var resp = Ext.decode(res.responseText);
                    deferred.reject(resp);
                }
            });

        }

        return deferred.promise;

    },

    /**
     * onClickSave - save the current order
     */
    onClickSave: function () {
        console.log('onClickSave called');
        // console.info(this);
        var me = this,
            cartInfo = me.getCartInformation();

        console.info(cartInfo);
        if (!Ext.isEmpty(cartInfo)) {
            me.saveCart(cartInfo.data, cartInfo.products)
                .then(function (content) {
                    console.info(content);
                    Valence.common.util.Snackbar.show('Your order has been saved.');

                    //print the order
                    //
                    Ext.apply(cartInfo.data, {
                        OAORDKEY: content.OAORDKEY
                    });

                    //me.printCart(content.OAORDKEY, cartInfo.data, content.printURL);

                    //clear/reset the cart and go back to the main section
                    //
                    me.onClickClear();
                }, function (content) {
                    Valence.common.util.Dialog.show({
                        minWidth: 300,
                        msg: (!Ext.isEmpty(content.msg)) ? content.msg : 'There was an error saving your cart.',
                        buttons: [{
                            text: 'Ok'
                        }]
                    });
                });
        }
    },

    onClickViewPayments: function (event, el) {
        var me = this,
            element = Ext.get(el);

        if (!Ext.isEmpty(element) && element.hasCls('pym-info-icon')) {
            me.getView().add({
                xtype: 'payments',
                renderTo: Ext.getBody()
            }).show();
        }
    },

    onEditList: function (editor, e) {
        var me = this,
            checkoutButton = me.lookupReference('checkoutButton');

        e.record.commit();

        //checkoutButton.enable();
    },

    /**
     * onHideCreditInfo - reset the credit information when hidden
     * @param cmp
     */
    onHideCreditInfo: function (cmp) {
        cmp.getForm().setValues({
            CCEM: new Date().getMonth() + 1,
            CCEY: new Date().getFullYear(),
            CCNAME: '',
            CCNUM: '',
            CVS: ''
        });
    },

    /**
     * onResetCart - reset the cart
     */
    onResetCart: function () {
        this.resetCart();
    },

    /**
     * onSelectStockLocation - stock location selected, let the shopping store know...
     * @param fld
     * @param rec
     */
    onSelectStockLocation: function (fld, rec) {
        console.log('onSelectStockLocation');
        var me = this,
            view = me.getView();
        view.fireEvent('selectstocklocation', fld, rec);
    },

    /**
     * onSpecialKeyPaymentForm - check for enter key on the payment form and attempt to send payment
     * @param fld
     * @param e
     */
    onSpecialKeyPaymentForm: function (fld, e) {
        var me = this;

        if (e.getKey() == e.ENTER) {
            me.sendPayment();
        }
    },

    /**
     * onUpdateRepsReadOnly - set the reps combo read only value
     * @param value
     */
    onUpdateRepsReadOnly: function (value) {
        console.log('onUpdateResReadOnly called');
        this.lookupReference('cartrepscombo').setReadOnly(value);
    },

    /**
     * onValidateEditList - Validate the edit on the release column so they can't enter more than the quantity
     * @param editor
     * @param context
     * @returns {boolean}
     */
    onValidateEditList: function (editor, context) {
        var me = this,
            rec = context.record,
            value = context.value,
            fld = context.column.field;

        if (context.field === 'release') {
            var outstanding = Shopping.util.Helper.getOutstanding(rec);
            fld.markInvalid(null);
            if (!Ext.isEmpty(value) && Ext.isEmpty(outstanding)) {
                fld.markInvalid('No outstanding items');
                return false;
            }
            if (!Ext.isEmpty(value) && value > outstanding) {
                fld.markInvalid('Value must be equal or less than outstanding');
                return false;
            }
        } else if (context.field === 'quantity') {
            fld.markInvalid(null);
            if (value < rec.get('delivered')) {
                fld.markInvalid('Quantity can not be greater than delivered');
                return false;
            }
        }
    },

    /**
     * onViewportResize - adjust the smegwindow/release window based of viewport width/height
     * @param width
     * @param height
     */
    onViewportResize: function (width, height) {
        var me = this,
            wdw = me.lookupReference('smegwindow'),
            releaseWin = me.lookupReference('releasewindow'),
            wdwHeight, wdwWidth;

        if (!Ext.isEmpty(wdw) && wdw.isVisible()) {
            wdwWidth = wdw.getWidth();
            wdwHeight = wdw.getHeight();
            if (wdwWidth > width) {
                if (Ext.isEmpty(wdw.orgWidth)) {
                    wdw.orgWidth = wdwWidth;
                }
                wdw.setWidth(width * .9);
            } else if (!Ext.isEmpty(wdw.orgWidth) && wdw.orgWidth > wdwWidth && wdw.orgWidth < width) {
                wdw.setWidth(wdw.orgWidth);
            }
            if (wdwHeight > height) {
                if (Ext.isEmpty(wdw.orgHeight)) {
                    wdw.orgWidth = wdwHeight;
                }
                wdw.setHeight(height * .9);
            } else if (!Ext.isEmpty(wdw.orgHeight) && wdw.orgHeight > wdwHeight && wdw.orgHeight < height) {
                wdw.setHeight(wdw.orgHeight);
            }
            wdw.updateLayout();
        } else if (!Ext.isEmpty(releaseWin) && releaseWin.isVisible()) {
            releaseWin.center();
            releaseWin.updateLayout();
        } else {
            var visibleWindow = Ext.ComponentQuery.query('window{isVisible()===true}')[0];
            if (!Ext.isEmpty(visibleWindow)) {
                visibleWindow.updateLayout();
                visibleWindow.center();
            }
        }
    },

    /**
     * onViewReadyList - when the cart items list is ready set a dummy record in the store.
     * @param cmp
     */
    onViewReadyList: function (cmp) {
        console.log('onViewReadyList called');
        if (!cmp.release) {
            var me = this,
                store = cmp.getStore();

            //because of the layout and the grid not scrolling initial view
            // of the grid is not showing empty text if empty
            //
            if (store.getCount() === 0) {
                var rec = store.add({ dummy: true });
                store.remove(rec);
            }
        }
    },

    /**
     * printCart - Print the active order/cart
     * @param key
     */
    printCart: function (key, orderData, url) {
        var me = this,
            iframeSource = url;

        Ext.create('Shopping.view.cart.Print', {
            iframeSource: iframeSource,
            title: 'Order - ' + key,
            orderData: orderData,
            renderTo: Ext.getBody()
        }).show();
    },

    /**
     * releaseCart - relase the cart
     * @param async
     */
    releaseCart: function (async) {
        var me = this,
            vm = me.getViewModel(),
            activeCart = vm.get('activeCartNumber');

        if (Ext.isEmpty(async)) {
            async = true;
        }

        if (!Ext.isEmpty(activeCart)) {
            // No success callback because we do nothing with the response
            Ext.Ajax.request({
                url: '/valence/vvcall.pgm',
                async: async,
                params: {
                    pgm: 'EC1050',
                    action: 'releaseCart',
                    OAORDKEY: activeCart
                }
            });
        }
    },

    /**
     * resetCart - reset the cart "list, form, view model"
     */
    resetCart: function () {
        console.log('resetCart called');
        var me = this,
            vm = me.getViewModel(),
            cartForm = Ext.ComponentQuery.query('cartmain')[0].down('cartform');

        me.releaseCart();

        vm.getStore('cartItems').removeAll();
        console.info(vm.get('defaultStockLocation'));

        // reset form 
        cartForm.down('#deliveryChkbox').setValue(false);
        cartForm.down('#deliveryfieldset').setExpanded(false);
        cartForm.reset();

        vm.set({
            cartCount: 0,
            disableSalesPerson: false,
            activeCartNumber: null,
            cartValues: null,
            oldCartValues: null,
            orderPayments: null,
            STKLOC: null,
            //STKLOC: vm.get('defaultStockLocation'),
            //currentStockLoc: vm.get('defaultStockLocation'),
        });
        vm.set('activeCartNumber', null);

        vm.notify();
        //console.info(vm);
        // cartForm.down('#deliveryChkbox').setValue(false);
        // cartForm.down('#deliveryfieldset').setExpanded(false);
        // cartForm.reset();

    },

    /**
     * saveCart - save the actiev cart
     * @param formData
     * @param products
     * @param maskText
     */
    saveCart: function (formData, products, maskText) {
        // added 
        // console.log('saveCart called');
        // console.info(formData);
        var me = this,
            delField = me.lookupReference('deliveryfieldset'),

            vm = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            maskText = (Ext.isEmpty(maskText)) ? 'Saving' : maskText,
            params = {
                pgm: 'EC1050',
                action: 'saveCart',
                products: Ext.encode(products),
                //stkloc: vm.get('STKLOC')
            }, rep;

        Valence.common.util.Helper.loadMask(maskText);

        rep = vm.getStore('cartReps').findRecord('REP', formData.OAREP, 0, false, false, true);

        if (!Ext.isEmpty(rep)) {
            Ext.apply(params, {
                OAREPC: rep.get('CODE')
            });
        }



        Ext.apply(params, formData);
        // console.log('Before posting ');
        // console.info(formData);
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'POST',
            params: params,
            success: function (response) {
                var resp = Ext.decode(response.responseText);
                if (resp.success) {
                    Valence.common.util.Helper.destroyLoadMask();
                    deferred.resolve(resp);
                } else {
                    deferred.reject(resp);
                }
            },

            failure: function (response) {
                Valence.common.util.Helper.destroyLoadMask();
                var resp = Ext.decode(response.responseText);
                deferred.reject(resp);
            }
        });

        return deferred.promise;
    },

    /**
     * requestPayment - show window so payment cant be placed on active cart
     * @param content
     */
    requestPayment: function (content) {
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            view = me.getView(),
            vm = me.getViewModel(),
            orderPayments = vm.get('orderPayments'),
            checkout = (content.action === 'checkout') ? true : false,
            maxPayment = orderPayments.maxpay[0].maxpay;

        Valence.common.util.Helper.destroyLoadMask();

        view.add({
            xtype: 'window',
            itemId: 'cartPayment',
            printURL: content.printURL,
            ui: 'smeg',
            bodyPadding: 20,
            width: 600,
            height: '80%',
            modal: true,
            checkout: checkout,
            title: checkout ? 'Payment' : 'Deposit',
            closable: false,
            scrollable: true,
            layout: 'fit',
            reference: 'smegwindow',
            defaultFocus: '[name=OAPAYM]',
            onEsc: Ext.emptyFn,
            items: [{
                xtype: 'cartpayment',
                scrollable: 'y',
                paymode: content.action,
                cartInfo: orderPayments,
                maxpay: maxPayment
            }],
            bbar: ['->', {
                text: 'Cancel',
                scale: 'medium',
                handler: function (btn) {
                    btn.up('window').close();
                }
            }, {
                    ui: 'blue',
                    scale: 'medium',
                    text: 'Ok',
                    width: 80,
                    scope: me,
                    paymode: content.action,
                    listeners: {
                        scope: me,
                        click: me.sendPayment
                    }
                }],
            listeners: {
                scope: me,
                close: function () {
                    if (checkout) {
                        me.closeShowReleaseWindow('show');
                    }
                }
            }
        }).show();

        deferred.resolve(content);

        return deferred.promise;
    },

    /**
     * sendPayment - send the payment on the active cart
     */
    sendPayment: function () {
        console.info('sendPayment called');
        var me = this,
            formPanel = Ext.ComponentQuery.query('cartpayment')[0],
            form = formPanel.getForm(),
            formValues = form.getValues(),
            orderKey = formValues.OAORDKEY,
            maxPayment = formPanel.maxpay,
            payAmt = formValues.OAPAYAMT,
            blankStr = 'This field is required.',
            paymentWin = formPanel.up('window').el,
            invalidForm = false,
            wdw, resp, params, payAmtCnt, keepGoing, maxpay;

        invalidForm = !form.isValid();
        //formPanel.up('window').disable();
        //formPanel.disable();

        if (!invalidForm) {
            if (Ext.isEmpty(formValues.OAPAYM)) {
                formPanel.down('#payMethCombo').markInvalid('This field is required');
                // cnx update
                invalidForm = true;
            }
            if (parseFloat(payAmt) > parseFloat(maxPayment)) {
                formPanel.down('#payAmtFld').markInvalid('Payment is greater than balance.');
                // cnx update
                invalidForm = true;
            }
            if (Ext.isEmpty(payAmt) || !Ext.isEmpty(payAmt) && parseFloat(payAmt) < -4000.00) {
                formPanel.down('#payAmtFld').markInvalid('Payment amount required and must not be negative.');
                // cnx update
                invalidForm = true;
            }
            // add validation for credit card
            //
            //if (formValues.OAPAYM == 'CC') {
            if (formValues.OAPAYM == 'INT') {
                if (Ext.isEmpty(formValues.CCNAME)) {
                    formPanel.down('[name=CCNAME]').markInvalid(blankStr);
                    // cnx update
                    invalidForm = true;
                }
                if (Ext.isEmpty(formValues.CCNUM)) {
                    formPanel.down('[name=CCNUM]').markInvalid(blankStr);
                    // cnx update
                    invalidForm = true;
                }
                if (Ext.isEmpty(formValues.CCEM)) {
                    formPanel.down('[name=CCEM]').markInvalid(blankStr);
                    // cnx update
                    invalidForm = true;
                }
                if (Ext.isEmpty(formValues.CCEY)) {
                    formPanel.down('[name=CCEY]').markInvalid(blankStr);
                    // cnx update
                    invalidForm = true;
                }
                if (Ext.isEmpty(formValues.CVS)) {
                    formPanel.down('[name=CVS]').markInvalid(blankStr);
                    // cnx update
                    invalidForm = true;
                }
            } else if (formValues.OAPAYM === 'FIN') {
                formValues['CCNUM'] = formValues.OAPAYAPN;
                delete formValues.OAPAYAPN;
            }

            if (!invalidForm) {
                if (formValues.OAPAYCHKBX != 'on') {
                    Valence.common.util.Dialog.show({
                        title: 'Terms & Conditions',
                        msg: 'Please confirm acceptance of terms and conditions.',
                        buttons: [{ text: 'Ok' }]
                    });
                    invalidForm = true;
                }
            }

            if (invalidForm) {
                var invalidField = formPanel.down('field{hasCls("x-form-invalid")===true}');
                if (!Ext.isEmpty(invalidField)) {
                    invalidField.focus();
                }
                return;
            }
            // formPanel.up('window').disable();
            formPanel.up('window').mask('Confirming Payment.');
            // Valence.common.util.Helper.loadMask({
            //     renderTo: paymentWin.el,
            //     text: 'Confirming Payment'
            // });

            params = {
                pgm: 'EC1050',
                action: 'pay',
                paymode: formPanel.paymode
            };

            Ext.apply(params, formValues);
            Ext.Ajax.request({
                url: '/valence/vvcall.pgm',
                timeout: 120000,
                params: params,
                success: function (response) {
                    formPanel.up('window').enable();
                    resp = Ext.decode(response.responseText);
                    console.info(resp);
                    if (resp.success) {
                        wdw = formPanel.up('window');
                        keepGoing = resp['continue'];

                        if (keepGoing != 'yes') {
                            var cartInfo = me.getCartInformation();
                            wdw.hide();
                            //console.info(wdw);
                            if (wdw.checkout) {
                                //process release confirmation
                                //
                                me.confirmRelease()
                                    .then(function (content) {
                                        //console.info(content);
                                        wdw.close();
                                        me.closeShowReleaseWindow('close');
                                        //if (!Ext.isEmpty(resp.printURL)) {
                                        me.printCart(orderKey, cartInfo.data, content.printURL);
                                        //}
                                        me.onClickClear();
                                    }, function () {
                                        wdw.close();
                                        me.closeShowReleaseWindow('close');
                                        me.onClickClear();
                                    });
                            } else {
                                Valence.common.util.Snackbar.show({
                                    text: Ext.isEmpty(resp.msg) ? 'Your order has been processed.' : resp.msg
                                });
                                wdw.close();
                                if (!Ext.isEmpty(resp.printURL)) {
                                    me.printCart(orderKey, cartInfo.data, resp.printURL);
                                }
                                me.onClickClear();
                            }
                        } else {
                            Valence.common.util.Snackbar.show({
                                text: Ext.isEmpty(resp.msg) ? 'Payment accepted, thank you.' : resp.msg
                            });
                            Ext.Ajax.request({
                                url: '/valence/vvcall.pgm',
                                params: {
                                    pgm: 'EC1050',
                                    action: 'getPayments',
                                    OAORDKEY: orderKey,
                                    paymode: formPanel.paymode
                                },
                                success: function (r) {
                                    resp = Ext.decode(r.responseText);
                                    payAmtCnt = me.lookupReference('payamountcnt');
                                    payAmtCnt.setData(resp);
                                    maxpay = resp.maxpay[0].maxpay;
                                    formPanel.maxpay = maxpay;
                                    // manually setting values to reset form. CC fields are hidden
                                    // and are not resetting when form.reset() is used
                                    form.setValues({
                                        CCEM: new Date().getMonth() + 1,
                                        CCEY: new Date().getFullYear(),
                                        CCNAME: '',
                                        CCNUM: '',
                                        CVS: '',
                                        OAORDKEY: orderKey,
                                        //OAORDNET: maxpay,
                                        //OAORDTAX: '',
                                        OAORDTOTAL: maxpay,
                                        OAPAYAMT: '',
                                        OAPAYM: ''
                                    });

                                    formPanel.down('#payMethCombo').focus();
                                    form.reset();
                                    setTimeout(function () {
                                        me.lookupReference('tacchbx').setValue('on');
                                    }, 200);
                                    formPanel.up('window').unmask();
                                    //Valence.common.util.Helper.destroyLoadMask(paymentWin.el);
                                },
                                failure: me.showError
                            });
                        }
                    } else {
                        me.showError(resp);
                        formPanel.up('window').unmask();
                        //Valence.common.util.Helper.destroyLoadMask(paymentWin.el);
                    }
                },
                failure: function (response) {
                    //Valence.common.util.Helper.destroyLoadMask(paymentWin.el);
                    formPanel.up('window').unmask();
                    me.showError(response);
                }
            });
        }
    },

    /**
     * showError - show error from the backend to the user
     * @param r
     */
    showError: function (r) {
        var d = {},
            deferred = Ext.create('Ext.Deferred');

        if (!Ext.isEmpty(r) && !Ext.isEmpty(r.responseText)) {
            d = Ext.decode(r.responseText);
        } else {
            d = r;
        }

        Valence.common.util.Dialog.show({
            title: 'Error',
            minWidth: 300,
            msg: Ext.isEmpty(d.msg) ? 'Error' : d.msg,
            buttons: [{
                text: 'Ok'
            }],
            handler: function () {
                deferred.resolve();
            }
        });

        return deferred.promise;
    },

    // listener for updateData
    onUpdateData: function () {
        //console.log('onUpdateData called');
    },

    onOrderChange: function () {
        //console.info('onOrderChange called');
    },
    oCartBeforeShow: function () {
        //console.log('onCartBeforeShow called');
    },

    calculateCart: function () {
        // gether info and send back
        console.log('calculateCart called');
        var me = this;
        //console.info(me.getCartInformation());


    },

    onClickContainer: function () {
        console.info('onClickContainer called');
    },
    // Enable calculate button when type into promotion text
    // onPromoCodeChange: function () {
    //     console.log('onPromoCodeChange called');
    //     var me = this,
    //         calcBtn = me.lookupReference('calcBtn'),
    //         promoCode = me.lookupReference('promoCodeTextField'),
    //         payBtn = me.lookupReference('payBtn'),
    //         checkoutButton = me.lookupReference('checkoutButton'),
    //         //listFooterSum = me.lookupReference('listFooterSum'),
    //         vm = me.getViewModel();
    //     //console.info(promoCode.isDirty());
    //     //console.info(me.lookupReference('payBtn'));
    //     //console.info(vm.get('needUpdate'));
    //     if (promoCode.isDirty()) {
    //         calcBtn.enable();
    //         //me.toggleCartListSummary(false);



    //         // var grid = me.getView().down('cartlist');
    //         // grid.getColumns()[9].setSummaryRenderer('123');
    //         // Ext.apply(grid.getColumns()[9], {
    //         //     summaryRenderer: function (value) {
    //         //         //return '123';
    //         //         return Ext.String.format('<b>Updated: {0}</b>', Ext.util.Format.currency(value));
    //         //     }
    //         // });
    //         // // console.info(grid.getColumns());
    //         // console.info(grid.getView().getCell(1, 2));
    //         // me.toggleCartListSummary(true);

    //         // TODO: disable payment and deliver
    //         payBtn.disable();
    //         payBtn.setTooltip('Please calculate first.');
    //         checkoutButton.disable();
    //         //listFooterSum.setHidden(true);

    //         Ext.ComponentQuery.query('#pdfBtnSelector')[0].setDisabled(true);
    //         Ext.ComponentQuery.query('#notesBtnSelector')[0].setDisabled(true);
    //         Ext.ComponentQuery.query('#saveBtnSelector')[0].setDisabled(true);


    //     } else if (!promoCode.isDirty() && !vm.get('needUpdate')) {
    //         console.log('should enable pay and deliver');
    //         calcBtn.disable();
    //         payBtn.enable();
    //         checkoutButton.enable();
    //         me.toggleCartListSummary(true);
    //         //listFooterSum.setHidden(false);

    //         Ext.ComponentQuery.query('#pdfBtnSelector')[0].setDisabled(false);
    //         Ext.ComponentQuery.query('#notesBtnSelector')[0].setDisabled(false);
    //         Ext.ComponentQuery.query('#saveBtnSelector')[0].setDisabled(false);

    //     }
    //     //console.info(vm.get('needUpdate'));
    // },

    requestCalcualte: function () {
        console.log('request calculate called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            vm = me.getViewModel(),
            params = {},
            cartInfo = me.getCartInformation(),
            valid = me.isFormValid();
        console.info(cartInfo);
        params = {
            pgm: 'EC1050',
            action: 'calculate',
            products: (!Ext.isEmpty(cartInfo) && !Ext.isEmpty(cartInfo.products)) ? Ext.encode(cartInfo.products) : null,
        };


        if (valid) {
            Ext.apply(params, cartInfo.data);
            console.log('valid form');
            Ext.Ajax.request({
                url: '/valence/vvcall.pgm',
                params: params,
                success: function (res) {
                    //console.info(res);
                    var resp = Ext.decode(res.responseText);
                    deferred.resolve(resp);
                    //deferred.reject(resp);
                },
                failure: function (res) {
                    //console.info(res);
                    var resp = Ext.decode(res.responseText);
                    deferred.reject(resp);
                }
            })
        } else {
            //console.log('invalid form');
        }
        return deferred.promise;

    },

    loadCart: function (resp) {
        console.log('loadCart called');
        //console.info(resp);
        var me = this,
            vm = me.getViewModel(),
            cartItems = resp.CartDtl,
            updatedItems = [],
            formValues = {},
            cartItemCount = 0,
            paymentHistoryStore = vm.getStore('paymentHistory'),
            paymentHistoryStoreItems = [],
            payments = resp.payments;

        //console.info(resp);
        //vm.set('activeCartNumber', null);

        // Load Cart Items
        var cartItemStore = vm.getStore('cartItems');
        //console.info(cartItemsStore);
        cartItemStore.removeAll();

        if (!Ext.isEmpty(cartItems)) {
            for (var i = 0; i < cartItems.length; i++) {
                //console.log('1');
                cartItemCount = cartItemCount + cartItems[i].OBQTYO;
                updatedItems.push({
                    "product_id": cartItems[i].OBITM,
                    "quantity": cartItems[i].OBQTYO,
                    "allocated": cartItems[i].OBQTYA,
                    "price": cartItems[i].OBUPRC,
                    "prod_desc": cartItems[i].I1IDSC,
                    "delivered": cartItems[i].OBQTYD,
                    "smallpic": cartItems[i].SMALLPIC,


                    "sub_total": cartItems[i].OBTOTA,
                    //"generated": cartItems[i].OBGENF,

                    "deletable": cartItems[i].ALWDEL,
                    "releaseQtyEditable": cartItems[i].ALWRLSQ,
                    "orderQtyEditable": cartItems[i].ALWORDQ,
                    "orderLineNO": cartItems[i].OBORDLNO,
                    "OBPRMCOD": cartItems[i].OBPRMCOD,
                    "plain_txt": cartItems[i].PALINTXT
                    // TODO: add "deletable"
                });
            }
        }

        cartItemStore.add(updatedItems);
        //console.info(updatedItems);
        //console.info(cartItemStore);
        //console.info(cartItemStore.sum('sub_total'));

        vm.set({
            orderTotal: cartItemStore.sum('sub_total')
        });
        //  reload cart items
        // load cart header
        if (!Ext.isEmpty(resp.CartHdr)) {
            Ext.apply(formValues, resp.CartHdr[0]);
        }
        if (formValues.OADELD === '0001-01-01') {
            console.info('change OADELD value to null');
            formValues.OADELD = null;
        }
        vm.set({
            STKLOC: resp.OASTKLOC,
            cartValues: formValues,
            disableSalesPerson: (!Ext.isEmpty(resp.lockSalesPerson) && resp.lockSalesPerson === 'true' && !Ext.isEmpty(formValues.OAREP)) ? true : false
        });
        vm.set({
            cartCount: cartItemCount,
            activeCartNumber: resp.CartHdr[0].OAORDKEY,
            needUpdate: false
        });


        // load payment history
        //paymentHistoryStore.loadData(obj.payments);
        if (!Ext.isEmpty(resp.TOTALPAID)) {
            vm.set('totalPaid', resp.TOTALPAID)
        }
        paymentHistoryStore.removeAll();
        vm.set('hidePaymentHistory', true);
        if (!Ext.isEmpty(payments)) {
            vm.set('hidePaymentHistory', false);
            for (var i = 0; i < payments.length; i++) {
                paymentHistoryStoreItems.push({
                    "label": payments[i].LABEL,
                    "note": payments[i].NOTE,
                    "amount": payments[i].AMOUNT
                })
            }
        }
        paymentHistoryStore.add(paymentHistoryStoreItems);
        vm.notify();

        var grid = me.getView().down('cartlist');
        var summary = grid.getView().getFeature('itemSummary');
        //console.info(grid);
        //console.info(grid.getView().getFeature('itemSummary'));
        // summary.summaryRecord.setData('order', '123');
        // var summaryRow = grid.getView().getFeature(0);
        // var styleObj = {
        //     'color': 'red'
        // };
        //summaryRow.setStyle(styleObj);
        grid.getView().getFeature('itemSummary').toggleSummaryRow(true);
        //summaryRow.toggleSummaryRow(true);
        //console.info(summaryRow);
        me.lookupReference('calcBtn').disable();
        me.lookupReference('payBtn').enable();
        me.lookupReference('checkoutButton').enable();
        //me.lookupReference('listFooterSum').setHidden(false);

        me.lookupReference('pdfBtn').enable();
        me.lookupReference('notesBtn').enable();
        me.lookupReference('saveBtn').enable();

    },

    toggleCartListSummary: function (show) {
        var me = this,
            grid = me.getView().down('cartlist');
        grid.getView().getFeature('itemSummary').toggleSummaryRow(show);

        // if (show) {
        //     Ext.ComponentQuery.query('#payBtnSelector')[0].disable();
        //     Ext.ComponentQuery.query('#chkoutBtnSelector')[0].disable();
        // } else {
        //     Ext.ComponentQuery.query('#payBtnSelector')[0].enable();
        //     Ext.ComponentQuery.query('#chkoutBtnSelector')[0].enable();
        // }

    },

    onCalculateClick: function () {
        console.info('onUpdateClick called');
        var me = this,
            vm = me.getViewModel(),
            valid = me.isFormValid(),
            view = me.getView(),
            paymentGrid = me.getView().down('paymenthistory');
        if (valid) {
            Valence.common.util.Helper.loadMask('Calculating Your Order ......');
        }

        me.requestCalcualte()
            .then(function (res) {
                //console.info(res);
                if (!Ext.isEmpty(res) && res.success) {
                    me.loadCart(res);
                    view.fireEvent('loadPromoSelections', res.promoSelection);
                    view.fireEvent('loadPromoHeader', res.promoHeader);

                    // check if need to render promotion page
                    if (!Ext.isEmpty(res.promoSelection) && res.promoSelection.length > 0) {
                        view.add({
                            xtype: 'promowin'
                        }).show();
                    }
                    Valence.common.util.Helper.destroyLoadMask();
                    // need to reload payment history summary
                    paymentGrid.getView().getFeature('paymentSummary').toggleSummaryRow(true);
                } else {
                    console.log('loadCart error');
                    Valence.common.util.Helper.destroyLoadMask();
                    me.showError(res);
                }
            }, function (res) {
                //console.info(res);
                Valence.common.util.Helper.destroyLoadMask();
                me.showError(res);
            });
        // var me = this,
        //     vm = me.getViewModel(),
        //     params = {},
        //     cartInfo = me.getCartInformation(),
        //     valid = me.isFormValid(),
        //     cartItemCount = 0;

        // console.info(cartInfo);
        // params = {
        //     pgm: 'EC1050',
        //     action: 'calculate',
        //     products: (!Ext.isEmpty(cartInfo) && !Ext.isEmpty(cartInfo.products)) ? Ext.encode(cartInfo.products) : null,
        // };
        // // var grid = me.getView().down('cartlist');
        // // var summary = grid.getView().getFeature('itemSummary');
        // // console.info(grid.getView().getFeature('itemSummary'));
        // // grid.getView().getFeature('itemSummary').toggleSummaryRow(true);
        // //grid.getView().getFeature('summary').toggleSummary(true);
        // // if old cart
        // if (valid) {
        //     console.log('valid form');
        //     Ext.Ajax.request({
        //         url: '/valence/vvcall.pgm',
        //         params: params,
        //         success: function (res) {
        //             console.info(res);
        //             var resp = Ext.decode(res.responseText);
        //             var cartItems = resp.CartDtl,
        //                 updatedItems = [];

        //             console.info(resp);
        //             //vm.set('activeCartNumber', null);
        //             var cartItemsStore = vm.getStore('cartItems');
        //             console.info(cartItemsStore);
        //             cartItemsStore.removeAll();

        //             if (!Ext.isEmpty(cartItems)) {
        //                 for (var i = 0; i < cartItems.length; i++) {
        //                     console.log('1');
        //                     cartItemCount = cartItemCount + cartItems[i].OBQTYO;
        //                     updatedItems.push({
        //                         "product_id": cartItems[i].OBITM,
        //                         "quantity": cartItems[i].OBQTYO,
        //                         "allocated": cartItems[i].OBQTYA,
        //                         "price": cartItems[i].OBUPRC,
        //                         "prod_desc": cartItems[i].I1IDSC,
        //                         "delivered": cartItems[i].OBQTYD,
        //                         "smallpic": cartItems[i].SMALLPIC,


        //                         "sub_total": cartItems[i].OBTOTA,
        //                         "generated": cartItems[i].OBGENF
        //                     });
        //                 }
        //             }

        //             cartItemsStore.add(updatedItems);
        //             console.info(updatedItems);
        //             //console.info(cartItemsStore);

        //             //  reload cart items
        //             vm.set({
        //                 cartCount: cartItemCount,
        //                 activeCartNumber: resp.CartHdr[0].OAORDKEY
        //             });
        //             vm.notify();


        //             var grid = me.getView().down('cartlist');
        //             var summary = grid.getView().getFeature('itemSummary');
        //             //console.info(grid);
        //             //console.info(grid.getView().getFeature('itemSummary'));
        //             // summary.summaryRecord.setData('order', '123');
        //             grid.getView().getFeature('itemSummary').toggleSummaryRow(true);

        //             me.lookupReference('calcBtn').disable();
        //         },
        //         failure: function (res) {
        //             console.info(res);
        //             console.log('response error');
        //         }
        //     });
        // } else {
        //     console.log('invalid form');
        // }
    },
    onOrderSummaryRenderer: function () {
        console.log('Summary Renderer called');
        return '123';
    },

    // hover effect to bottom buttons 
    onMouseOver: function (btn) {
        console.info(btn);
        btn.el.addCls(['x-btn-blue-small']);
        btn.btnInnerEl.addCls(["x-btn-inner-blue-small"]);
        btn.el.removeCls(['x-btn-white-small']);
        btn.btnInnerEl.removeCls(["x-btn-inner-white-small"]);
    },
    onMouseOut: function (btn) {
        btn.el.removeCls(['x-btn-blue-small']);
        btn.btnInnerEl.removeCls(["x-btn-inner-blue-small"]);
        btn.el.addCls(['x-btn-white-small']);
        btn.btnInnerEl.addCls(["x-btn-inner-white-small"]);
    },
    onBtnDisable: function (cmp, value, oldValue) {
        console.log('onBtnDisabledChange called');
        //console.info(cmp);
        cmp.setTooltip('Calculate');
    },

    // click on disabled payment 
    onClickDisabledBtn: function () {
        console.log('onClickDisabledBtn called');
        //this.showError({ msg: 'Calculate Your Order First.' });
        var me = this;
        //console.info(me.lookupReference('payBtn'));
        //console.info(me.lookupReference('checkoutButton'));

        if (me.lookupReference('payBtn').disabled && !me.lookupReference('calcBtn').disabled) {
            //Valence.util.Helper.showSnackbar('Calculate your order first.');
            me.showDialog2({ title: 'Tips', msg: 'Calculate Your Order First.' });
        }
        if (me.lookupReference('checkoutButton').disabled) {
            //Valence.util.Helper.showSnackbar('Calculate your order first.');
            // me.showDialog2({ title: 'Tips', msg: 'Calculate Your Order First.' });
        }

    },

    // Show Dialog

    /**
     * showError - show error from the backend to the user
     * @param r
     */
    showDialog: function (r) {
        var d = {},
            deferred = Ext.create('Ext.Deferred');

        if (!Ext.isEmpty(r) && !Ext.isEmpty(r.responseText)) {
            d = Ext.decode(r.responseText);
        } else {
            d = r;
        }

        Valence.common.util.Dialog.show({
            title: Ext.isEmpty(d.title) ? 'Error' : d.title,
            minWidth: 300,
            msg: Ext.isEmpty(d.msg) ? 'Error' : d.msg,
            buttons: [{
                text: 'Ok'
            }],
            handler: function () {
                deferred.resolve();
            }
        });

        return deferred.promise;
    },

    showDialog2: function (r) {
        var d = {};

        if (!Ext.isEmpty(r) && !Ext.isEmpty(r.responseText)) {
            d = Ext.decode(r.responseText);
        } else {
            d = r;
        }

        Valence.common.util.Dialog.show({
            title: Ext.isEmpty(d.title) ? 'Error' : d.title,
            minWidth: 300,
            msg: Ext.isEmpty(d.msg) ? 'Error' : d.msg,
            buttons: [{ text: 'Ok' }]
        });
    },


    onRowBodyKeyPress: function (p1) {
        console.log('onRowBodyKeyPress');
        //console.info(p1);
    },
    onClickCancelPromoWin: function () {
        console.log('onClickCancelPromoWin called');
        var me = this,
            promoWindow = me.getView().down('promowin');
        //console.info(promoWindow);
        promoWindow.close();
        //console.info(me.getView().down('promowin'));
    },
    onClickSelectPromoWin: function () {
        console.log('onClickSelectPromoWin called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            selectedCount = vm.get('selectedPromoCount'),
            prmTotalQty = vm.get('prmTotalQty'),
            prmMaxSel = vm.get('prmMaxSel');
        //console.info(vm.get('promoItems'));
        // validate selections 
        if (selectedCount > prmMaxSel) {
            me.showError({ msg: 'Maximum number of items you can select is ' + prmMaxSel });
            return null;
        } else {
            console.log('good selection');
        }
        Valence.common.util.Helper.loadMask('Processing Your Order ......');

        me.requestAddPromo()
            .then(function (res) {
                //console.info(res);
                if (!Ext.isEmpty(res) && res.success) {
                    me.loadCart(res);
                    view.fireEvent('loadPromoSelections', res.promoSelection);
                    view.fireEvent('loadPromoHeader', res.promoHeader);

                    me.onClickCancelPromoWin();
                    // check if need to render promotion page
                    //console.log('before show promo');
                    if (!Ext.isEmpty(res.promoSelection) && res.promoSelection.length > 0) {
                        //console.log('show pop up');
                        view.add({
                            xtype: 'promowin'
                        }).show();
                    } else {
                        // close promo pop-up
                        console.log('should close pop up');
                        me.onClickCancelPromoWin();
                    }
                    Valence.common.util.Helper.destroyLoadMask();
                } else {
                    console.log('loadCart error');
                    Valence.common.util.Helper.destroyLoadMask();
                    me.showError(res);
                }
            }, function (res) {
                //console.info(res);
                Valence.common.util.Helper.destroyLoadMask();
                me.showError(res);
            });
    },

    // request add promo
    requestAddPromo: function () {
        console.log('requestAddPromo called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            vm = me.getViewModel(),
            params = {},
            orderKey = vm.get('activeCartNumber'),
            promoList = vm.get('selectedPromos'),
            promoOrderLineNumber = vm.get('prmOrderLineNumber');
        //console.info(cartInfo);
        params = {
            pgm: 'EC1050',
            action: 'addPromo',
            OAORDKEY: orderKey,
            ORDLNO: promoOrderLineNumber,
            selectedPromos: Ext.encode(promoList)
        };
        // must have an order key
        if (!Ext.isEmpty(orderKey)) {
            Ext.Ajax.request({
                url: '/valence/vvcall.pgm',
                //url: 'https://42848ff2-8ad4-43d1-859c-c0e5d1a9997e.mock.pstmn.io/calculate_cart',
                //method: 'GET',
                params: params,
                success: function (res) {
                    //console.info(res);
                    var resp = Ext.decode(res.responseText);
                    deferred.resolve(resp);
                    //deferred.reject(resp);
                },
                failure: function (res) {
                    //console.info(res);
                    var resp = Ext.decode(res.responseText);
                    deferred.reject(resp);
                }
            });
        }
        return deferred.promise;


    },
    onPromoSelectionChange: function (th, rec) {
        console.log('onPromoSelectionChange called');
        //console.info(th);
        //console.info(rec);
        var selectedList = [],
            item, selectedTotal = 0;
        var me = this,
            vm = me.getViewModel();
        for (var i = 0; i < rec.length; i++) {
            item = rec[i].getData();
            //console.info(rec[i]);
            selectedTotal = selectedTotal + 1;
            // selectedList.push({
            //     prm_code: item.prm_code,
            //     prm_model: item.prm_model,
            //     prm_qty: 1
            // });
            selectedList.push({
                PBPRMCOD: item.prm_code,
                PBITM: item.prm_model,
                PBSELQTY: 1
            });
        }
        vm.set('selectedPromos', selectedList);
        vm.set('selectedPromoCount', selectedTotal);
        //console.info(vm.get('selectedPromos'));
        //console.info(vm.get('selectedPromoCount'));

    },
    onPromoSelect: function (th, rec) {
        console.log('onPromoSelect called');
    },

    onEditPromoList: function (editor, e) {
        var me = this,
            vm = me.getViewModel(),
            prmSelectionStore = vm.getStore('promoSelections');
        var selectedList = [],
            item, selectedTotal = 0;
        e.record.commit();
        //console.info(prmSelectionStore);

        // constructing selection list
        for (var i = 0; i < prmSelectionStore.getCount(); i++) {
            item = prmSelectionStore.getAt(i).getData();
            if (item.prm_qty > 0) {
                selectedTotal = selectedTotal + item.prm_qty;
                // selectedList.push({
                //     prm_code: item.prm_code,
                //     prm_model: item.prm_model,
                //     prm_qty: item.prm_qty
                // });
                selectedList.push({
                    PBPRMCOD: item.prm_code,
                    PBITM: item.prm_model,
                    PBSELQTY: item.prm_qty
                });
            }
        }
        vm.set('selectedPromos', selectedList);
        vm.set('selectedPromoCount', selectedTotal);
        //console.info(vm.get('selectedPromos'));
        //console.info(vm.get('selectedPromoCount'));
    }
});