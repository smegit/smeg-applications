Ext.define('Shopping.view.cart.CartController', {
    extend   : 'Ext.app.ViewController',
    requires : [
        'Shopping.util.Helper',
        'Shopping.view.cart.PaymentForm'
    ],
    alias    : 'controller.cart',

    /**
     * init - setup app level listeners and portal application destroy listener
     */
    init : function () {
        var me       = this,
            appFrame = Shopping.util.Helper.getApp();

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
    autoFillAddress : function (customer) {
        var me           = this,
            place        = (customer) ? me.customerAddressAutoComplete.getPlace() : me.deliveryAddressAutoComplete.getPlace(),
            fieldset     = (customer) ? Ext.ComponentQuery.query('cartform #customerfieldset')[0] : Ext.ComponentQuery.query('cartform #deliveryfieldset')[0],
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
                    Ext.ComponentQuery.query('cartform [name=OACSTST1]')[0].setValue(addressLine1);
                }
            } else {
                if (!Ext.isEmpty(addressLine1)) {
                    Ext.ComponentQuery.query('cartform [name=OADELST1]')[0].setValue(addressLine1);
                }
            }

            if (!Ext.isEmpty(addressLine2)) {
                addressLine2.focus();
            }
        }
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
                stkloc   : vm.get('stkLocation')
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

                    deferred.resolve(d);
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
        var me   = this,
            view = me.getView(),
            form = view.down('cartform');

        if (!form.isValid()) {
            Valence.util.Helper.showSnackbar('Please fill in all required sections');
            var fieldInError = form.down('field{isValid()===false}');
            if (!Ext.isEmpty(fieldInError)) {
                fieldInError.focus();
            }
            return null;
        } else {
            var formData         = form.getValues(),
                store            = view.lookupViewModel(true).getStore('cartItems'),
                storeCount       = store.getCount(),
                outstandingItems = store.queryBy(function (rec) {
                    if (!Ext.isEmpty(rec.get('outstanding')) && rec.get('outstanding') > 0) {
                        return true;
                    }
                }),
                releaseZeroItems = store.query('release', 0, 0, false, false, true),
                standardOrder    = (outstandingItems.getCount() === releaseZeroItems.getCount()) ? true : false,
                prodArray        = [],
                product;

            for (var i = 0; i < storeCount; i++) {
                product = store.getAt(i).getData();
                if (product.quantity !== product.delivered) {
                    prodArray.push({
                        OBITM  : product.product_id,
                        OBQTYO : product.quantity,
                        OBUPRC : product.price,
                        OBQTYR : (standardOrder) ? product.quantity : product.release
                    });
                }
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
     * onActivate - setup the cart view.
     */
    onActivate : function () {
        var me          = this,
            vm          = me.getViewModel(),
            view        = me.getView(),
            dlvFieldSet = me.lookupReference('deliveryfieldset'),
            dlvName     = dlvFieldSet.down('[name=OADELNAM]').getValue();

        vm.set('hideAllocated', true);
        if (vm.get('hideOrdKey')) {
            me.lookupReference('cartrepscombo').setReadOnly(false);
        }

        view.lookupViewModel(true).getStore('cartReps').load();

        Ext.ComponentQuery.query('cartlist')[0].reconfigure(view.lookupViewModel(true).getStore('cartItems'));

        dlvFieldSet.checkboxCmp.setValue(!Ext.isEmpty(dlvName));

        // set scroll to top
        //
        view.setScrollY(0);

        setTimeout(function () {
            me.lookupReference('reffield').focus();
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
        input.dom.placeholder = 'Street Address 1';

        //set input background color
        //
        // input.setStyle('background-color', '#E3F2FD');

        if (cmp.itemId === 'customerSearch') {
            // Create the customer address auto complete object
            //
            me.customerAddressAutoComplete = new google.maps.places.Autocomplete(
                (document.getElementById(input.id)),
                {types : ['geocode']});

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            me.customerAddressAutoComplete.addListener('place_changed', Ext.bind(me.autoFillAddress, me, [true]));
        } else {
            // Create the customer address auto complete object
            //
            me.deliveryAddressAutoComplete = new google.maps.places.Autocomplete(
                (document.getElementById(input.id)),
                {types : ['geocode']});

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            me.deliveryAddressAutoComplete.addListener('place_changed', Ext.bind(me.autoFillAddress, me, [false]));
        }
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
            view = me.getView(),
            grid      = cmp.grid,
            store     = grid.getStore(),
            column    = grid.headerCt.items.getAt(cellIndex),
            viewModel = me.getViewModel(),
            cartCount = viewModel.get('cartCount');

        if (!Ext.isEmpty(column.action) && column.action === 'removecartitem' && store.getCount() > 1) {
            viewModel.set('cartCount', cartCount - rec.get('quantity'));
            store.remove(rec);
            grid.getView().refresh();
        } else {
            var target = e.getTarget(),
                item = (!Ext.isEmpty(target)) ? Ext.get(target) : null;

            if (!Ext.isEmpty(item) && item.hasCls('cart-list-item-image')){
                view.fireEvent('showdetail', view, {
                    getData : function(){
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

    onClickDeposit : function (cmp) {
        var me           = this,
            view         = me.getView(),
            form         = view.down('cartform'),
            valid        = form.isValid(),
            fieldInError = (!valid) ? form.down('field{isValid()===false}') : null;

        if (Ext.isEmpty(fieldInError)) {
            me.depositRelease(cmp, 'deposit')
                .then(function (content) {
                    console.log('response : ', content);
                });
        } else {
            fieldInError.focus();
        }
    },

    onClickRelease : function (cmp) {
        var me           = this,
            view         = me.getView(),
            form         = view.down('cartform'),
            valid        = form.isValid(),
            fieldInError = (!valid) ? form.down('field{isValid()===false}') : null;

        if (Ext.isEmpty(fieldInError)) {
            me.depositRelease(cmp, 'checkout')
                .then(function (content) {
                    console.log('response : ', content);
                });
            // view.add({
            //     xtype     : 'cartrelease',
            //     reference : 'releasewindow',
            //     renderTo  : Ext.getBody()
            // }).show();
        } else {
            fieldInError.focus();
        }
    },

    onClickSave : function () {
        var me       = this,
            cartInfo = me.getCartInformation();

        if (!Ext.isEmpty(cartInfo)) {
            me.saveCart(cartInfo.data, cartInfo.products)
                .then(function (content) {
                    Valence.common.util.Snackbar.show('Your order has been saved.');

                    //print the order
                    //
                    me.printCart(content.OAORDKEY);

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

    onHideCreditInfo : function (cmp) {
        cmp.getForm().setValues({
            CCEM   : new Date().getMonth() + 1,
            CCEY   : new Date().getFullYear(),
            CCNAME : '',
            CCNUM  : '',
            CVS    : ''
        });
    },

    onResetCart : function () {
        this.resetCart();
    },

    onSelectStockLocation : function (fld, rec) {
        var me   = this,
            view = me.getView();
        view.fireEvent('selectstocklocation', fld, rec);
    },

    onSpecialKeyPaymentForm : function (fld, e) {
        var me = this;

        if (e.getKey() == e.ENTER) {
            me.sendPayment();
        }
    },

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
            fld.markInvalid(null);
            if (!Ext.isEmpty(value) && value > rec.get('quantity')) {
                fld.markInvalid('Quantity is greater than release');
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

    printCart : function (key) {
        var me     = this,
            body   = Ext.getBody(),
            vm     = me.getViewModel(),
            str    = vm.getStore('cartItems'),
            lines  = Ext.Array.pluck(str.data.items, 'data'),
            jsDate = new Date(),
            date   = Ext.util.Format.date(jsDate, 'Y-m-d'),
            time   = Ext.util.Format.date(jsDate, 'g:iA'),
            data   = {},
            dRec, delvStr, qty, total, d2;

        body.mask('Printing Order');

        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : {
                pgm      : 'ec1055',
                action   : 'readCartDetails',
                OAORDKEY : key
            },
            scope   : me,
            success : function (r) {
                var d = Ext.decode(r.responseText);
                if (d.success) {

                    // apply header info...
                    //
                    Ext.apply(data, d.CartHdr[0]);
                    Ext.apply(data, {
                        deliveryOpts : d.DeliveryOptions
                    });
                    Ext.apply(data, d.OrderInfo[0]);

                    // translate the delivery method...
                    //
                    delvStr = vm.getStore('DeliveryOptions');
                    dRec    = str.findRecord('DELMCOD', data.OADELM);

                    if (dRec) {
                        Ext.apply(data, {
                            OADELM : dRec.get('DELMDSC')
                        });
                    }

                    lines = d.CartDtl;

                    // total the lines...
                    //
                    qty   = 0;
                    total = 0;
                    for (var ii = 0; ii < lines.length; ii++) {
                        lines[ii].extended_price = (lines[ii].OBQTYO * lines[ii].OBUPRC);
                        qty += lines[ii].OBQTYO;
                        total += lines[ii].extended_price;
                    }
                    lines.push({
                        OBITM          : '',
                        OBQTYO         : qty,
                        extended_price : total
                    });

                    Ext.apply(data, {
                        lines : lines,
                        date  : date,
                        time  : time
                    });
                    Ext.Ajax.request({
                        url     : '/valence/vvcall.pgm',
                        params  : {
                            action   : 'getPayments',
                            pgm      : 'EC1050',
                            OAORDKEY : key,
                            paymode  : 'print'
                        },
                        success : function (r) {
                            d2 = Ext.decode(r.responseText);
                            if (d2.success) {
                                Ext.apply(data, {
                                    PaySum : Ext.isEmpty(d2.PaySum) ? null : d2.PaySum
                                });
                                Shopping.util.Helper.printCart({
                                    data : data
                                });
                            } else {
                                me.showError(d2);
                            }
                            body.unmask();
                        },
                        failure : function (resp) {
                            me.showError(resp);
                            body.unmask();
                        }
                    });
                }
            }
        });
    },

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

    resetCart : function () {
        var me = this,
            vm = me.getViewModel();

        me.releaseCart();

        vm.getStore('cartItems').removeAll();

        vm.set({
            cartCount        : 0,
            activeCartNumber : null,
            cartValues       : null
        });

        vm.notify();

        Ext.ComponentQuery.query('cartform')[0].reset();
    },

    saveCart : function (formData, products, maskText) {
        var me       = this,
            vm       = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            maskText = (Ext.isEmpty(maskText)) ? 'Saving' : maskText,
            params   = {
                pgm      : 'EC1050',
                action   : 'saveCart',
                products : Ext.encode(products),
                stkloc   : vm.get('stkLocation')
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
                var resp = Ext.decode(response.responseText);
                deferred.reject(resp);
            }
        });

        return deferred.promise;
    },

    requestPayment : function (action) {
        var me   = this,
            vm   = me.getViewModel(),
            view = me.getView();

        view.add({
            xtype        : 'window',
            itemId       : 'cartPayment',
            ui           : 'smeg',
            bodyPadding  : 20,
            width        : 600,
            y            : 40,
            height       : '80%',
            modal        : true,
            title        : action == 'checkout' ? 'Payment' : 'Deposit',
            closable     : true,
            scrollable   : true,
            layout       : 'fit',
            reference    : 'smegwindow',
            defaultFocus : '#payMethCombo',
            items        : [{
                xtype      : 'cartpayment',
                scrollable : 'y'
                // paymode    : action,
                // cartInfo   : response,
                // maxpay     : maxPayment //johnny
            }],
            bbar         : ['->', {
                text    : 'Cancel',
                ui      : 'white',
                handler : function (btn) {
                    btn.up('window').close();
                }
            }, {
                ui        : 'blue',
                text      : 'Ok',
                width     : 80,
                scope     : me,
                paymode   : action,
                listeners : {
                    scope : me,
                    click : me.sendPayment
                }
            }]
        }).show();
    },

    sendPayment : function () {
        var me          = this,
            formPanel   = Ext.ComponentQuery.query('cartpayment')[0],
            form        = formPanel.getForm(),
            formValues  = form.getValues(),
            orderKey    = formValues.OAORDKEY,
            maxPayment  = formPanel.maxpay,
            payAmt      = formValues.OAPAYAMT,
            blankStr    = 'This field is required.',
            invalidForm = false,
            wdw, resp, params, payAmtCnt, keepGoing, maxpay;

        if (formValues.OAPAYCHKBX != 'on') {
            Valence.common.util.Dialog.show({
                title   : 'Terms & Conditions',
                msg     : 'Please confirm acceptance of terms and conditions.',
                buttons : [{text : 'Ok'}]
            });
            invalidForm = true;
        }

        invalidForm = !form.isValid();

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
        }


        if (invalidForm) {
            return;
        }

        params = {
            pgm     : 'EC1050',
            action  : 'pay',
            paymode : formPanel.paymode
        };

        Ext.apply(params, formValues);
        formPanel.up('window').el.mask('Confirming Payment');
        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : params,
            success : function (response) {
                resp = Ext.decode(response.responseText);
                if (resp.success) {
                    wdw       = formPanel.up('window');
                    keepGoing = resp['continue'];

                    if (keepGoing != 'yes') {
                        wdw.close();
                        Valence.common.util.Snackbar.show({
                            text : !Ext.isEmpty(resp.msg) ? 'Your order has been processed.' : resp.msg
                        });
                        me.resetCart();
                        me.printCart(orderKey);
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
                                formPanel.up('window').el.unmask();
                            },
                            failure : me.showError
                        });
                    }
                } else {
                    me.showError(resp);
                    formPanel.up('window').el.unmask();
                }
            },
            failure : function (response) {
                formPanel.up('window').el.unmask();
                me.showError(response);
            }
        });

    },

    showError : function (r) {
        var d = {};

        if (!Ext.isEmpty(r) && !Ext.isEmpty(r.responseText)) {
            d = Ext.decode(r.responseText);
        } else {
            d = r;
        }

        Valence.common.util.Dialog.show({
            title    : 'Error',
            minWidth : 300,
            msg      : Ext.isEmpty(d.msg) ? 'Error' : d.msg,
            buttons  : [{text : 'Ok'}]
        });
    }
});