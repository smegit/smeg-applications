Ext.define('Shopping.view.cart.CartController', {
    extend   : 'Ext.app.ViewController',
    requires : [
        'Shopping.util.Helper',
        'Shopping.view.cart.PaymentForm',
        'Shopping.view.cart.Payments',
        'Shopping.view.cart.Print',
        'Shopping.view.cart.notes.Notes'
    ],
    alias    : 'controller.cart',
    listen   : {
        global : {
            resize : {
                fn     : 'onViewportResize',
                buffer : 200
            }
        }
    },

    /**
     * init - setup app level listeners and portal application destroy listener
     */
    init : function () {
        var me       = this,
            appFrame = Shopping.util.Helper.getApp();

        me.requiredFieldMsg = 'Please fill in all required sections';

        Shopping.getApplication().on({
            scope     : me,
            resetcart : 'onResetCart'
        });

        //listen for the destroy of the application and release if we have an active cart release it
        //
        if (!Ext.isEmpty(appFrame)) {
            appFrame.on({
                scope         : me,
                beforedestroy : function () {
                    me.releaseCart(false);
                }
            });
        }
    },

    /**
     * autoFillAddress - auto fill the address fields if the user selected an address from the google lookup
     * @param customer
     */
    autoFillAddress : function (cmp) {
        var me           = this,
            place        = cmp.googleAutoComplete.getPlace(),
            customer     = (cmp.name === 'OACSTST1') ? true : false,
            fieldset     = (customer) ? cmp.up('#customerfieldset') : cmp.up('#deliveryfieldset'),
            fields       = fieldset.query('field[gApiAddrType]'),
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
                    plusFound    = addressPhone.indexOf('+');
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
    closeShowReleaseWindow : function (action) {
        var me  = this,
            wdw = me.lookupReference('releasewindow');

        if (!Ext.isEmpty(action) && !Ext.isEmpty(wdw)) {
            wdw[action]();
        }
    },

    confirmRelease : function () {
        var me       = this,
            vm       = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            cartInfo = me.getCartInformation(),
            params   = {
                pgm      : 'EC1050',
                action   : 'confirm',
                products : (!Ext.isEmpty(cartInfo) && !Ext.isEmpty(cartInfo.products)) ? Ext.encode(cartInfo.products) : null,
                stkloc   : vm.get('STKDFT')
            };

        Valence.common.util.Helper.loadMask('Processing');

        Ext.apply(params, cartInfo.data);

        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            method  : 'POST',
            params  : params,
            success : function (r) {
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
            failure : function () {
                Valence.common.util.Helper.destroyLoadMask();
                Valence.common.util.Dialog.show({
                    title    : 'Error',
                    minWidth : 300,
                    msg      : 'Not able to process at this time.',
                    buttons  : [{
                        text : 'Ok'
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
    depositRelease : function (cmp, action) {
        var me          = this,
            vm          = me.getViewModel(),
            deferred    = Ext.create('Ext.Deferred'),
            cartInfo    = me.getCartInformation(),
            view        = me.getView(),
            orderKeyFld = view.down('[name=OAORDKEY]'),
            params      = {
                pgm      : 'EC1050',
                action   : action,
                products : (!Ext.isEmpty(cartInfo) && !Ext.isEmpty(cartInfo.products)) ? Ext.encode(cartInfo.products) : null,
                stkloc   : vm.get('STKDFT')
            }, rep;

        if (!Ext.isEmpty(cartInfo)) {
            Valence.common.util.Helper.loadMask(cmp.maskMsg);

            rep = vm.getStore('cartReps').findRecord('REP', cartInfo.data.OAREP, 0, false, false, true);

            if (!Ext.isEmpty(rep)) {
                Ext.apply(params, {
                    OAREPC : rep.get('CODE')
                });
            }

            Ext.apply(params, cartInfo.data);
            Ext.Ajax.request({
                url     : '/valence/vvcall.pgm',
                method  : 'POST',
                params  : params,
                success : function (r) {
                    var d        = Ext.decode(r.responseText),
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
                            title    : 'Error',
                            minWidth : 300,
                            msg      : d.msg,
                            buttons  : [{
                                text : 'Ok'
                            }]
                        });
                        deferred.reject(d);
                        return;
                    }

                    deferred.resolve(Ext.apply(d, {
                        action : action
                    }));
                },
                failure : function (response) {
                    var d = Ext.decode(response.responseText);
                    Valence.common.util.Helper.destroyLoadMask();
                    Valence.common.util.Dialog.show({
                        title    : 'Error',
                        minWidth : 300,
                        msg      : (!Ext.isEmpty(d)) ? d : 'Not able to setup deposit at this time.',
                        buttons  : [{
                            text : 'Ok'
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
    getCartInformation : function () {
        var me           = this,
            vm           = me.getViewModel(),
            view         = me.getView(),
            valid        = me.isFormValid(),
            releaseItems = view.down('cartrelease'),
            form         = (Ext.isEmpty(releaseItems)) ? view.down('cartform') : releaseItems.down('cartform');

        if (!valid) {
            Valence.util.Helper.showSnackbar(me.requiredFieldMsg);
            return null;
        } else {
            var formData      = vm.get('cartValues'),
                store         = view.lookupViewModel(true).getStore('cartItems'),
                storeCount    = store.getCount(),
                standardOrder = me.isStandardOrder(),
                prodArray     = [],
                product, rec;

            Ext.apply(formData, form.getValues());

            for (var i = 0; i < storeCount; i++) {
                rec     = store.getAt(i);
                product = rec.getData();
                prodArray.push({
                    OBITM  : product.product_id,
                    OBQTYO : product.quantity,
                    OBUPRC : product.price,
                    OBQTYR : (standardOrder) ? Shopping.util.Helper.getOutstanding(rec) : product.release
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

            return {
                data     : formData,
                products : prodArray
            };
        }
    },

    /**
     * getPayments - get the order payments
     * @param content
     */
    getPayments : function (content) {
        var me       = this,
            vm       = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            view     = me.getView(),
            checkout = (content.action === 'checkout') ? true : false;

        vm.set('orderPayments', null);

        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : {
                pgm      : 'EC1050',
                action   : 'getPayments',
                OAORDKEY : content.OAORDKEY,
                paymode  : content.action
            },
            success : function (r) {
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
            failure : function (response) {
                Valence.common.util.Helper.destroyLoadMask();
                me.showError(response)
                    .then(function () {
                        deferred.reject(Ext.decode(response.responseText));
                    });
            }
        });

        return deferred.promise;
    },

    isFormValid : function () {
        var me           = this,
            view         = me.getView(),
            releaseItems = view.down('cartrelease'),
            form         = (Ext.isEmpty(releaseItems)) ? view.down('cartform') : releaseItems.down('cartform'),
            valid        = form.isValid(),
            fieldInError = (!valid) ? form.down('field{isValid()===false}') : null;

        if (Ext.isEmpty(fieldInError)) {
            var flwDate      = me.lookupReference('followUpDte'),
                flwDateValue = flwDate.getValue(),
                flwMsg       = me.lookupReference('followUpMsg'),
                flwMsgValue  = flwMsg.getValue(),
                msg          = 'This field is required',
                markInvaild  = function (fld) {
                    fld.markInvalid(msg);
                    fld.focus();
                    valid = false;
                }
            //check to see if followup info was set and set correctly
            //
            if (!Ext.isEmpty(flwDateValue) && Ext.isEmpty(flwMsgValue)) {
                markInvaild(flwMsg);
            } else if (Ext.isEmpty(flwDateValue) && !Ext.isEmpty(flwMsgValue)) {
                markInvaild(flwDate);
            }
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
    isStandardOrder : function () {
        var me               = this,
            view             = me.getView(),
            store            = view.lookupViewModel(true).getStore('cartItems'),
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

        if (outstandingItems.getCount() === releaseZeroItems.getCount()) {
            standard = true;
            releaseZeroItems.each(function (rec) {
                rec.set('release', Shopping.util.Helper.getOutstanding(rec));
                rec.commit();
            })
        } else {
            standard = false;
        }

        return standard;
    },

    /**
     * onActivate - setup the cart view.
     */
    onActivate : function () {
        var me          = this,
            vm          = me.getViewModel(),
            view        = me.getView(),
            mainForm    = view.down('cartform'),
            custDetail  = view.down('cart-customerdetail'),
            dlvFieldSet = custDetail.down('#deliveryfieldset'),
            dlvName     = dlvFieldSet.down('[name=OADELNAM]').getValue();

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
        }, 200);
    },

    /**
     * onAfterRenderAddressSearch - setup the google address lookup fields
     * @param cmp
     */
    onAfterRenderAddressSearch : function (cmp) {
        var me    = this,
            input = cmp.el.down('input');

        //google api auto places a place holder on the element. Stop it by adding the attribute
        //
        input.dom.placeholder = 'Street';

        cmp.googleAutoComplete = new google.maps.places.Autocomplete(
            document.getElementById(input.id),
            {types : ['geocode', 'establishment']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        cmp.googleAutoComplete.addListener('place_changed', Ext.bind(me.autoFillAddress, me, [cmp]));
    },

    onBeforeActivate : function () {
        var me               = this,
            vm               = me.getViewModel(),
            orderPayments    = vm.get('orderPayments'),
            activeCartNumber = vm.get('activeCartNumber');

        if (Ext.isEmpty(orderPayments) && !Ext.isEmpty(activeCartNumber)) {
            Valence.common.util.Helper.loadMask('Loading');

            me.getPayments({
                action   : 'checkout',
                OAORDKEY : activeCartNumber
            })
                .then(function () {
                    Valence.common.util.Helper.destroyLoadMask();
                });
        }
    },

    onBeforeEditList : function (editor, context) {
        var me             = this,
            field          = context.field,
            rec            = context.record,
            outstanding    = Shopping.util.Helper.getOutstanding(rec),
            checkoutButton = me.lookupReference('checkoutButton');

        if (field === 'release' && (Ext.isEmpty(outstanding) || outstanding == 0)) {
            return false;
        }

        checkoutButton.disable();
    },

    onCancelEditList : function () {
        var me             = this,
            checkoutButton = me.lookupReference('checkoutButton');

        checkoutButton.enable();
    },

    /**
     * onCellClickList - check if user is requesting to remove an item from the cart
     * @param cmp
     * @param td
     * @param cellIndex
     * @param rec
     */
    onCellClickList : function (cmp, td, cellIndex, rec, tr, rowIndex, e) {
        var me        = this,
            view      = me.getView(),
            grid      = cmp.grid,
            store     = grid.getStore(),
            column    = grid.headerCt.items.getAt(cellIndex),
            viewModel = me.getViewModel(),
            cartCount = viewModel.get('cartCount');

        if (!Ext.isEmpty(column.action) && column.action === 'removecartitem' && store.getCount() > 1) {
            if (Ext.isEmpty(rec.get('delivered')) || rec.get('delivered') == 0) {
                viewModel.set('cartCount', cartCount - rec.get('quantity'));
                store.remove(rec);
                grid.getView().refresh();
            }
        } else {
            var target = e.getTarget(),
                item   = (!Ext.isEmpty(target)) ? Ext.get(target) : null;

            if (!Ext.isEmpty(item) && (item.hasCls('cart-list-prd-detail') || item.up('.cart-list-prd-detail'))) {
                view.fireEvent('showdetail', view, {
                    getData : function () {
                        return {
                            MODEL : rec.get('product_id')
                        }
                    }
                }, true);
            }
        }
    },

    /**
     * onCellEditList - update the cart values
     * @param editor
     * @param e
     */
    onCellEditList : function (editor, e) {
        e.record.commit();

        var me        = this,
            viewModel = me.getViewModel(),
            total     = e.store.sum('quantity');

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
    onClickBack : function () {
        var me   = this,
            view = me.getView();
        view.fireEvent('back', view);
    },

    onClickClear : function () {
        var me   = this,
            view = me.getView();

        me.resetCart();
        view.fireEvent('reset', view);
        me.onClickBack();
    },

    /**
     * onClickDeposit - request start depositing on this order, get the payments and show the payment entery window
     * @param cmp
     */
    onClickDeposit : function (cmp) {
        var me    = this,
            valid = me.isFormValid();

        if (valid) {
            me.depositRelease(cmp, 'deposit')
                .then(Ext.bind(me.getPayments, me))
                .then(Ext.bind(me.requestPayment, me));
        } else {
            Valence.util.Helper.showSnackbar(me.requiredFieldMsg);
        }
    },

    onClickNotes : function () {
        var me   = this,
            vm   = me.getViewModel(),
            view = me.getView();

        Ext.ComponentQuery.query('app-main')[0].add({
            xtype     : 'notes',
            viewModel : {
                data : {
                    orderKey : vm.get('activeCartNumber')
                }
            }
        }).show();
    },

    /**
     * onClickRelease - start the release of the selected products.
     * @param cmp
     */
    onClickRelease : function (cmp) {
        var me    = this,
            vm    = me.getViewModel(),
            view  = me.getView(),
            valid = me.isFormValid();

        if (valid) {
            me.depositRelease(cmp, 'checkout')
                .then(function (content) {
                    //check if all release values are zero
                    var standardOrder = me.isStandardOrder(),
                        store         = view.lookupViewModel(true).getStore('cartItems'),
                        count         = store.getCount(),
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
                        xtype      : 'cartrelease',
                        reference  : 'releasewindow',
                        renderTo   : Ext.getBody(),
                        chkContent : content
                    }).show();
                });
        } else {
            Valence.util.Helper.showSnackbar(me.requiredFieldMsg);
        }
    },

    /**
     * onClickReleaseConfirm - process the release of products requesting payment if needed.
     */
    onClickReleaseConfirm : function () {
        var me            = this,
            releaseWindow = me.lookupReference('releasewindow');

        releaseWindow.hide();

        Valence.common.util.Helper.loadMask('Processing');

        me.getPayments(releaseWindow.chkContent)
            .then(Ext.bind(me.requestPayment, me), function () {
                releaseWindow.show();
            });
    },

    /**
     * onClickSave - save the current order
     */
    onClickSave : function () {
        var me       = this,
            cartInfo = me.getCartInformation();

        if (!Ext.isEmpty(cartInfo)) {
            me.saveCart(cartInfo.data, cartInfo.products)
                .then(function (content) {
                    Valence.common.util.Snackbar.show('Your order has been saved.');

                    //print the order
                    //
                    Ext.apply(cartInfo.data,{
                        OAORDKEY : content.OAORDKEY
                    });

                    me.printCart(content.OAORDKEY, cartInfo.data);

                    //clear/reset the cart and go back to the main section
                    //
                    me.onClickClear();
                }, function (content) {
                    Valence.common.util.Dialog.show({
                        minWidth : 300,
                        msg      : (!Ext.isEmpty(content.msg)) ? content.msg : 'There was an error saving your cart.',
                        buttons  : [{
                            text : 'Ok'
                        }]
                    });
                });
        }
    },

    onClickViewPayments : function (event, el) {
        var me      = this,
            element = Ext.get(el);

        if (!Ext.isEmpty(element) && element.hasCls('pym-info-icon')) {
            me.getView().add({
                xtype    : 'payments',
                renderTo : Ext.getBody()
            }).show();
        }
    },

    onEditList : function (editor, e) {
        var me             = this,
            checkoutButton = me.lookupReference('checkoutButton');

        e.record.commit();

        checkoutButton.enable();
    },

    /**
     * onHideCreditInfo - reset the credit information when hidden
     * @param cmp
     */
    onHideCreditInfo : function (cmp) {
        cmp.getForm().setValues({
            CCEM   : new Date().getMonth() + 1,
            CCEY   : new Date().getFullYear(),
            CCNAME : '',
            CCNUM  : '',
            CVS    : ''
        });
    },

    /**
     * onResetCart - reset the cart
     */
    onResetCart : function () {
        this.resetCart();
    },

    /**
     * onSelectStockLocation - stock location selected, let the shopping store know...
     * @param fld
     * @param rec
     */
    onSelectStockLocation : function (fld, rec) {
        var me   = this,
            view = me.getView();
        view.fireEvent('selectstocklocation', fld, rec);
    },

    /**
     * onSpecialKeyPaymentForm - check for enter key on the payment form and attempt to send payment
     * @param fld
     * @param e
     */
    onSpecialKeyPaymentForm : function (fld, e) {
        var me = this;

        if (e.getKey() == e.ENTER) {
            me.sendPayment();
        }
    },

    /**
     * onUpdateRepsReadOnly - set the reps combo read only value
     * @param value
     */
    onUpdateRepsReadOnly : function (value) {
        this.lookupReference('cartrepscombo').setReadOnly(value);
    },

    /**
     * onValidateEditList - Validate the edit on the release column so they can't enter more than the quantity
     * @param editor
     * @param context
     * @returns {boolean}
     */
    onValidateEditList : function (editor, context) {
        var me    = this,
            rec   = context.record,
            value = context.value,
            fld   = context.column.field;

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
    onViewportResize : function (width, height) {
        var me         = this,
            wdw        = me.lookupReference('smegwindow'),
            releaseWin = me.lookupReference('releasewindow'),
            wdwHeight, wdwWidth;

        if (!Ext.isEmpty(wdw) && wdw.isVisible()) {
            wdwWidth  = wdw.getWidth();
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
    onViewReadyList : function (cmp) {
        if (!cmp.release) {
            var me    = this,
                store = cmp.getStore();

            //because of the layout and the grid not scrolling initial view
            // of the grid is not showing empty text if empty
            //
            if (store.getCount() === 0) {
                var rec = store.add({dummy : true});
                store.remove(rec);
            }
        }
    },

    /**
     * printCart - Print the active order/cart
     * @param key
     */
    printCart : function (key, orderData) {
        var me           = this,
            iframeSource = '/Product/ORD' + key + '.pdf';

        Ext.create('Shopping.view.cart.Print', {
            iframeSource : iframeSource,
            title        : 'Order - ' + key,
            orderData    : orderData,
            renderTo     : Ext.getBody()
        }).show();
    },

    /**
     * releaseCart - relase the cart
     * @param async
     */
    releaseCart : function (async) {
        var me         = this,
            vm         = me.getViewModel(),
            activeCart = vm.get('activeCartNumber');

        if (Ext.isEmpty(async)) {
            async = true;
        }

        if (!Ext.isEmpty(activeCart)) {
            // No success callback because we do nothing with the response
            Ext.Ajax.request({
                url    : '/valence/vvcall.pgm',
                async  : async,
                params : {
                    pgm      : 'EC1050',
                    action   : 'releaseCart',
                    OAORDKEY : activeCart
                }
            });
        }
    },

    /**
     * resetCart - reset the cart "list, form, view model"
     */
    resetCart : function () {
        var me       = this,
            vm       = me.getViewModel(),
            cartForm = Ext.ComponentQuery.query('cartmain')[0].down('cartform');

        me.releaseCart();

        vm.getStore('cartItems').removeAll();

        vm.set({
            cartCount        : 0,
            activeCartNumber : null,
            cartValues       : null,
            orderPayments    : null
        });

        vm.notify();
        cartForm.down('#deliveryChkbox').setValue(false);
        cartForm.down('#deliveryfieldset').setExpanded(false);
        cartForm.reset();
    },

    /**
     * saveCart - save the actiev cart
     * @param formData
     * @param products
     * @param maskText
     */
    saveCart : function (formData, products, maskText) {
        var me       = this,
            vm       = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            maskText = (Ext.isEmpty(maskText)) ? 'Saving' : maskText,
            params   = {
                pgm      : 'EC1050',
                action   : 'saveCart',
                products : Ext.encode(products),
                stkloc   : vm.get('STKDFT')
            }, rep;

        Valence.common.util.Helper.loadMask(maskText);

        rep = vm.getStore('cartReps').findRecord('REP', formData.OAREP, 0, false, false, true);

        if (!Ext.isEmpty(rep)) {
            Ext.apply(params, {
                OAREPC : rep.get('CODE')
            });
        }
        Ext.apply(params, formData);
        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            method  : 'POST',
            params  : params,
            success : function (response) {
                var resp = Ext.decode(response.responseText);
                if (resp.success) {
                    Valence.common.util.Helper.destroyLoadMask();
                    deferred.resolve(resp);
                } else {
                    deferred.reject(resp);
                }
            },

            failure : function (response) {
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
    requestPayment : function (content) {
        var me            = this,
            deferred      = Ext.create('Ext.Deferred'),
            view          = me.getView(),
            vm            = me.getViewModel(),
            orderPayments = vm.get('orderPayments'),
            checkout      = (content.action === 'checkout') ? true : false,
            maxPayment    = orderPayments.maxpay[0].maxpay;

        Valence.common.util.Helper.destroyLoadMask();

        view.add({
            xtype        : 'window',
            itemId       : 'cartPayment',
            ui           : 'smeg',
            bodyPadding  : 20,
            width        : 600,
            height       : '80%',
            modal        : true,
            checkout     : checkout,
            title        : checkout ? 'Payment' : 'Deposit',
            closable     : false,
            scrollable   : true,
            layout       : 'fit',
            reference    : 'smegwindow',
            defaultFocus : '[name=OAPAYM]',
            items        : [{
                xtype      : 'cartpayment',
                scrollable : 'y',
                paymode    : content.action,
                cartInfo   : orderPayments,
                maxpay     : maxPayment
            }],
            bbar         : ['->', {
                text    : 'Cancel',
                scale   : 'medium',
                handler : function (btn) {
                    btn.up('window').close();
                    if (checkout) {
                        me.closeShowReleaseWindow('show');
                    }
                }
            }, {
                ui        : 'blue',
                scale     : 'medium',
                text      : 'Ok',
                width     : 80,
                scope     : me,
                paymode   : content.action,
                listeners : {
                    scope : me,
                    click : me.sendPayment
                }
            }]
        }).show();

        deferred.resolve(content);

        return deferred.promise;
    },

    /**
     * sendPayment - send the payment on the active cart
     */
    sendPayment : function () {
        var me          = this,
            formPanel   = Ext.ComponentQuery.query('cartpayment')[0],
            form        = formPanel.getForm(),
            formValues  = form.getValues(),
            orderKey    = formValues.OAORDKEY,
            maxPayment  = formPanel.maxpay,
            payAmt      = formValues.OAPAYAMT,
            blankStr    = 'This field is required.',
            paymentWin  = formPanel.up('window').el,
            invalidForm = false,
            wdw, resp, params, payAmtCnt, keepGoing, maxpay;

        invalidForm = !form.isValid();

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
            if (formValues.OAPAYM == 'CC') {
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
                        title   : 'Terms & Conditions',
                        msg     : 'Please confirm acceptance of terms and conditions.',
                        buttons : [{text : 'Ok'}]
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
            Valence.common.util.Helper.loadMask({
                renderTo : paymentWin.el,
                text     : 'Confirming Payment'
            });

            params = {
                pgm     : 'EC1050',
                action  : 'pay',
                paymode : formPanel.paymode
            };

            Ext.apply(params, formValues);
            Ext.Ajax.request({
                url     : '/valence/vvcall.pgm',
                params  : params,
                success : function (response) {
                    resp = Ext.decode(response.responseText);
                    if (resp.success) {
                        wdw       = formPanel.up('window');
                        keepGoing = resp['continue'];

                        if (keepGoing != 'yes') {
                            var cartInfo = me.getCartInformation();
                            wdw.close();
                            if (wdw.checkout) {
                                //process release confirmation
                                //
                                me.confirmRelease()
                                    .then(function () {
                                        me.closeShowReleaseWindow('close');
                                        me.printCart(orderKey, cartInfo.data);
                                        me.onClickClear();
                                    }, function () {
                                        me.closeShowReleaseWindow('close');
                                        me.onClickClear();
                                    });
                            } else {
                                Valence.common.util.Snackbar.show({
                                    text : !Ext.isEmpty(resp.msg) ? 'Your order has been processed.' : resp.msg
                                });

                                me.printCart(orderKey, cartInfo.data);
                                me.onClickClear();
                            }
                        } else {
                            Valence.common.util.Snackbar.show({
                                text : !Ext.isEmpty(resp.msg) ? 'Payment accepted, thank you.' : resp.msg
                            });
                            Ext.Ajax.request({
                                url     : '/valence/vvcall.pgm',
                                params  : {
                                    pgm      : 'EC1050',
                                    action   : 'getPayments',
                                    OAORDKEY : orderKey,
                                    paymode  : formPanel.paymode
                                },
                                success : function (r) {
                                    resp      = Ext.decode(r.responseText);
                                    payAmtCnt = me.lookupReference('payamountcnt');
                                    payAmtCnt.setData(resp);
                                    maxpay           = resp.maxpay[0].maxpay;
                                    formPanel.maxpay = maxpay;
                                    // manually setting values to reset form. CC fields are hidden
                                    // and are not resetting when form.reset() is used
                                    form.setValues({
                                        CCEM       : new Date().getMonth() + 1,
                                        CCEY       : new Date().getFullYear(),
                                        CCNAME     : '',
                                        CCNUM      : '',
                                        CVS        : '',
                                        OAORDKEY   : orderKey,
                                        OAORDNET   : maxpay,
                                        OAORDTAX   : '',
                                        OAORDTOTAL : maxpay,
                                        OAPAYAMT   : '',
                                        OAPAYM     : ''
                                    });

                                    formPanel.down('#payMethCombo').focus();
                                    form.reset();
                                    setTimeout(function () {
                                        me.lookupReference('tacchbx').setValue('on');
                                    }, 200);
                                    Valence.common.util.Helper.destroyLoadMask(paymentWin.el);
                                },
                                failure : me.showError
                            });
                        }
                    } else {
                        me.showError(resp);
                        Valence.common.util.Helper.destroyLoadMask(paymentWin.el);
                    }
                },
                failure : function (response) {
                    Valence.common.util.Helper.destroyLoadMask(paymentWin.el);
                    me.showError(response);
                }
            });
        }
    },

    /**
     * showError - show error from the backend to the user
     * @param r
     */
    showError : function (r) {
        var d        = {},
            deferred = Ext.create('Ext.Deferred');

        if (!Ext.isEmpty(r) && !Ext.isEmpty(r.responseText)) {
            d = Ext.decode(r.responseText);
        } else {
            d = r;
        }

        Valence.common.util.Dialog.show({
            title    : 'Error',
            minWidth : 300,
            msg      : Ext.isEmpty(d.msg) ? 'Error' : d.msg,
            buttons  : [{
                text : 'Ok'
            }],
            handler  : function () {
                deferred.resolve();
            }
        });

        return deferred.promise;
    }
});