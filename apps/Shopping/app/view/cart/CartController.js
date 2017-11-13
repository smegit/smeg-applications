Ext.define('Shopping.view.cart.CartController', {
    extend : 'Ext.app.ViewController',
    alias  : 'controller.cart',

    init : function () {
        var me = this;
        Shopping.getApplication().on({
            scope     : me,
            resetcart : 'onResetCart'
        });
    },


    autoFillAddress : function (customer) {
        var me           = this,
            place        = (customer) ? me.customerAddressAutoComplete.getPlace() : me.deliveryAddressAutoComplete.getPlace(),
            fieldset     = (customer) ? Ext.ComponentQuery.query('cartform #customerfieldset')[0] : Ext.ComponentQuery.query('cartform #deliveryfieldset')[0],
            fields       = fieldset.query('field[gApiAddrType]'),
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
                Ext.ComponentQuery.query('cartform #customerSearch')[0].setValue('');
                if (!Ext.isEmpty(addressLine1)) {
                    Ext.ComponentQuery.query('cartform [name=OACSTST1]')[0].setValue(addressLine1);
                }
            } else {
                Ext.ComponentQuery.query('cartform #deliverySearch')[0].setValue('');
                if (!Ext.isEmpty(addressLine1)) {
                    Ext.ComponentQuery.query('cartform [name=OADELST1]')[0].setValue(addressLine1);
                }
            }
        }
    },

    depositRelease : function (cmp, action) {//johnny
        var me       = this,
            vm       = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            cartInfo = me.getCartInformation(),
            params   = {
                pgm      : 'EC1050',
                action   : action,
                products : (!Ext.isEmpty(cartInfo) && !Ext.isEmpty(cartInfo.products)) ? Ext.encode(cartInfo.products) : null,
                stkloc   : vm.get('stkLocation')
            }, rep;

        if (!Ext.isEmpty(cartInfo)) {
            // Valence.util.Helper.loadMask(cmp.maskMsg);

            // rep = vm.getStore('cartReps').findRecord('REP', cartInfo.data.OAREP, 0, false, false, true);

            // if (!Ext.isEmpty(rep)) {
            //     Ext.apply(params, {
            //         OAREPC : rep.get('CODE')
            //     });
            // }

            Ext.apply(params, cartInfo.data);
            console.log('would call : ', params);
            deferred.resolve(null);
        }

        return deferred.promise;
    },

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

    onAfterRenderAddressSearch : function (cmp) {
        var me    = this,
            input = cmp.el.down('input');

        //google api auto places a place holder on the element. Stop it by adding the attribute
        //
        input.dom.placeholder = ' ';

        //set input background color
        //
        input.setStyle('background-color', '#E3F2FD');

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

    onCellClickList : function (cmp, td, cellIndex, rec) {
        var me        = this,
            grid      = cmp.grid,
            store     = grid.getStore(),
            column    = grid.headerCt.items.getAt(cellIndex),
            viewModel = me.getViewModel(),
            cartCount = viewModel.get('cartCount');

        if (!Ext.isEmpty(column.action) && column.action === 'removecartitem' && store.getCount() > 1) {
            viewModel.set('cartCount', cartCount - rec.get('quantity'));
            store.remove(rec);
            grid.getView().refresh();
        }
    },

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

    onClickBack : function () {
        var me   = this,
            view = me.getView();
        view.fireEvent('back', view);
    },

    onClickClear : function () {
        var me   = this,
            view = me.getView();

        me.resetCart();
        view.fire('reset', view);
        me.onClickGoBack();
    },

    onClickRelease        : function (cmp) {
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

    onResetCart : function(){
        this.resetCart();
    },

    onSelectStockLocation : function (fld, rec) {
        var me   = this,
            view = me.getView();
        view.fireEvent('selectstocklocation', fld, rec);
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

    releaseCart : function () {
        var me         = this,
            vm         = me.getViewModel(),
            activeCart = vm.get('activeCartNumber');

        if (!Ext.isEmpty(activeCart)) {
            // No success callback because we do nothing with the response
            Ext.Ajax.request({
                url    : '/valence/vvcall.pgm',
                async  : false,
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
        Ext.ComponentQuery.query('cartform')[0].reset();

        vm.set({
            cartCount        : 0,
            activeCartNumber : null
        });
    }
});