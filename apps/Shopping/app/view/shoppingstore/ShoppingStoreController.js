Ext.define('Shopping.view.shoppingstore.ShoppingStoreController', {
    extend   : 'Ext.app.ViewController',
    alias    : 'controller.shoppingstore',
    requires : [
        'Ext.window.Window',

        'Shopping.util.Helper',
        'Shopping.view.cart.Main',
        'Shopping.view.products.Heading',
        'Shopping.view.products.detail.Main',
        'Shopping.view.products.detail.View',
        'Shopping.view.products.detail.ImageMain',
        'Shopping.view.cart.List',
        'Shopping.view.cart.PaymentForm',
        'Shopping.view.cart.ExistingCarts',

        'Valence.common.util.Dialog',
        'Valence.common.util.Snackbar'
    ],

    init : function () {
        var me = this,
            vm = me.getViewModel();

        me.control({
            'categories'                    : {
                selectionchange : me.onSelectionChangeEntities
            },
            'products dataview'             : {
                itemclick  : me.onItemClickProduct,
                addtocart  : me.onAddToCart,
                showdetail : me.onShowDetail
            },
            'detailview'                    : {
                showlargerimage : me.onDetailImageClick
            },
            'heading button'                : {
                click : me.onHeadingButtonClick
            },
            'dtlimagemain #dtlImgAddToCart' : {
                click : me.onAddToCartFromDetail
            },
            'cartlist'                      : {
                cellclick : me.onCellClickProducts,
                edit      : me.onCellEdit,
                viewready : me.onViewReadyCartList
            },
            'cartmain button'               : {
                click : me.onCartButtonClick
            },
            'cartpayment'                   : {
                hideCreditInfo : me.onHideCreditInfo
            },
            'cartform #customerSearch'      : {
                afterrender : me.onAfterRenderAddressSearch
            },
            'cartform #deliverySearch'      : {
                afterrender : me.onAfterRenderAddressSearch
            },
            'existingcarts'                 : {
                celldblclick : me.loadExistingCart,
                cellclick    : me.onCellClickExistCart
            }
        });

        window.beforeDestroy = Ext.bind(function () {
            this.releaseCart();
        }, me);

        // cnx update
        Shopping.getApplication().on('beforelogout', me.resetCart);

        Shopping.getApplication().on({
            scope         : me,
            agentselected : me.agentSelected,
            beforelogout  : me.resetCart
        });
    },

    // cnx update -- added global listener for window resizing
    //
    listen : {
        global : {
            resize : {
                fn     : 'onViewportResize',
                buffer : 200
            }
        }
    },

    // cnx update -- listener function that calculates the width and height if it is larger than the width
    // and centers the window
    //
    onViewportResize : function (width, height) {
        var me  = this,
            wdw = me.lookupReference('smegwindow'),
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
            wdw.center();
            // cnx update
            wdw.updateLayout();
        }
    },

    agentSelected : function (content) {
        var me           = this,
            vm           = me.getViewModel(),
            mainVm       = me.getView().lookupViewModel(true),
            card         = me.lookupReference('card'),
            mainCart     = me.lookupReference('cartcontainer'),
            stockDefault = mainVm.get('STKDFT');

        if (!Ext.isEmpty(stockDefault)) {
            var productsStore = vm.getStore('products');
            Ext.apply(productsStore.getProxy().extraParams, {
                stkloc : stockDefault
            });
        }

        if (Ext.isEmpty(mainCart)) {
            mainCart = Ext.create('Shopping.view.cart.Main', {
                cartOptions : mainVm.get('cartOptions')
            });
            card.add(mainCart);
        } else {
            me.resetCart();
        }

        vm.getStore('categories').load();
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

    onAfterRenderSearchSavedOrders : function (cmp) {
        var me = this;
        setTimeout(function () {
            cmp.focus();
        }, 100);
    },

    onBeforeShowCartMenu : function (menu) {
        var me               = this,
            vm               = me.getViewModel(),
            activeCartNumber = vm.get('activeCartNumber'),
            menuItem         = menu.down('#invoiceitem');

        if (!Ext.isEmpty(activeCartNumber)) {

        }
        menuItem.setText(!Ext.isEmpty(activeCartNumber) ? 'Update Invoice' : 'Create Invoice')
        menuItem.maskMsg = !Ext.isEmpty(activeCartNumber) ? 'Updating Invoice' : 'Creating Invoice';
    },

    onChangeStockLocation : function (fld, val) {
        var me          = this,
            vm          = me.getViewModel(),
            str         = vm.getStore('products'),
            extraParams = str.getProxy().extraParams;

        vm.set('STKLOC', val);

        Ext.apply(extraParams, {
            stkloc : val
        });

        if (vm.get('loadProducts')) {
            str.load(
                function () {
                    setTimeout(function () {
                        me.lookupReference('productsMain').fireEvent('unmaskproductsview');
                    }, 200);
                }
            );
        }
    },

    onClickGoBack : function () {
        var me = this;
        me.getViewModel().getStore('products').load();
        me.lookupReference('card').getLayout().setActiveItem(0);
    },

    onClearSearchSavedOrders : function (cmp) {
        var me  = this,
            vm  = me.getViewModel(),
            str = vm.getStore('existingCarts');

        str.clearFilter();
    },

    onHideCreditInfo   : function (cmp) {
        cmp.getForm().setValues({
            CCEM   : new Date().getMonth() + 1,
            CCEY   : new Date().getFullYear(),
            CCNAME : '',
            CCNUM  : '',
            CVS    : ''
        });
    },
    onKeyUpPaymentForm : function (fld, e) {
        var me = this;
        if (e.keyCode == '13') {
            me.sendPayment();
        }
    },

    deleteCart : function (orderKey, callback, scope) {
        var me = this;

        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : {
                pgm      : 'EC1050',
                action   : 'deleteCart',
                OAORDKEY : orderKey
            },
            success : function (response) {
                if (!Ext.isEmpty(callback)) {
                    Ext.callback(callback, (!Ext.isEmpty(scope)) ? scope : me, [true, response]);
                }
            },
            failure : function (response) {
                if (!Ext.isEmpty(callback)) {
                    Ext.callback(callback, (!Ext.isEmpty(scope)) ? scope : me, [false, response]);
                }
            }
        });
    },

    onAfterRenderAddressSearch : function (cmp) {
        var me    = this,
            input = cmp.el.down('input');

        //google api auto places a place holder on the element. Stop it by adding the attribute
        //
        input.dom.placeholder = ' ';

        //set input background color
        //
        input.setStyle('background-color', '#FFFF99');

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

    onChangeSearchSavedOrders : function (fld, val) {
        var me  = this,
            vm  = me.getViewModel(),
            str = vm.getStore('existingCarts');

        str.clearFilter();

        Valence.util.Helper.processTypedInputFilter(str, ['OAORDKEY', 'OAMNTD', 'OAMNTT', 'OACSTREF', 'OAREP', 'OAORDKEY', 'OACSTNAM'], val);
    },
    onClearSearch             : function (fld) {
        var me  = this,
            vm  = me.getViewModel(),
            str = vm.getStore('products');

        str.clearFilter();
    },

    onKeyupSearch : function (fld) {
        var me    = this,
            value = fld.getValue(),
            vm    = me.getViewModel(),
            str   = vm.getStore('products'),
            regEx = new RegExp(value, "i");

        str.clearFilter();
        str.filterBy(function (rec) {
            if (regEx.test(rec.get('PRODDSC'))) {
                return true;
            }
            if (regEx.test(rec.get('MODEL'))) {
                return true;
            }
            return false;
        });
    },

    onViewCart : function (rec) {
        var me          = this,
            vm          = me.getViewModel(),
            dlvFieldSet = me.lookupReference('deliveryfieldset'),
            dlvName     = dlvFieldSet.down('[name=OADELNAM]').getValue();

        vm.set('hideAllocated', true);
        if (vm.get('hideOrdKey')) {
            me.lookupReference('cartrepscombo').setReadOnly(false);
        }

        vm.getStore('cartReps').load();

        Ext.ComponentQuery.query('cartlist')[0].reconfigure(vm.getStore('cartItems'));

        me.lookupReference('card').getLayout().setActiveItem(1);

        dlvFieldSet.checkboxCmp.setValue(!Ext.isEmpty(dlvName));

        // set scroll to top
        //
        me.lookupReference('cartcontainer').setScrollY(0);

        setTimeout(function () {
            me.lookupReference('reffield').focus();
        }, 200);
    },

    onAddToCart : function (e, dtlQuantity) {
        // If add to cart is clicked from the Detail screen then
        // we need to get the product from the ViewModel and quantity from the spinner
        var me            = this,
            viewModel     = me.getViewModel(),
            product       = (dtlQuantity ? viewModel.get('product').Product[0] : e.data),
            quantity      = (dtlQuantity ? dtlQuantity : 1),
            cartItemStore = viewModel.getStore('cartItems'),
            cartItem      = {
                product_id : product.MODEL,
                prod_desc  : product.PRODDESC,
                quantity   : quantity,
                price      : product.PRICE
            },
            existingRec   = cartItemStore.findRecord('product_id', product.MODEL, 0, false, true, true);

        if (!Ext.isEmpty(existingRec)) {
            existingRec.set({
                quantity : existingRec.get('quantity') + quantity
            });
            existingRec.commit();
        } else {
            cartItemStore.add(cartItem);
        }

        viewModel.set('cartCount', viewModel.get('cartCount') + quantity);
        Valence.common.util.Snackbar.show({
            text     : quantity + ' item(s) have been added to cart',
            duration : 2000
        });
    },

    onAddToCartFromDetail : function (cmp, e) {
        var quantity = 1;
        if (cmp.itemId === 'addtocartbutton') {
            quantity = Ext.ComponentQuery.query('#dtl-quantity')[0].getValue();
        } else {
            quantity = Ext.ComponentQuery.query('#dtl-img-quantity')[0].getValue();
        }
        this.onAddToCart(cmp, quantity);
        cmp.up('window').close();
    },

    onItemClickProduct : function (cmp, record, el, index, e) {
        var me   = this,
            attr = Ext.get(e.getTarget()).getAttribute('data-event');
        if (attr) {
            cmp.fireEvent(attr, record);
        } else {
            cmp.fireEvent('showdetail', cmp, record);
        }
    },

    onSelectionChangeEntities : function (sm, recs) {
        var me  = this,
            rec = recs[0],
            vm  = me.getViewModel(),
            str = vm.getStore('products'),
            xp  = str.getProxy().extraParams;

        if (rec) {
            Ext.apply(xp, {
                cat : rec.get('CATID')
            });
            if (vm.get('loadProducts')) {
                str.load(
                    function () {
                        setTimeout(function () {
                            me.lookupReference('productsMain').fireEvent('unmaskproductsview');
                        }, 200);
                    }
                );
            }
            vm.set({
                bannerText     : rec.get('BANTEXT'),
                hideBannerText : Ext.isEmpty(rec.get('BANTEXT'))
            });
        }
    },

    onShowDetail : function (cmp, rec) {
        var me   = this,
            view = me.getView(),
            vm   = me.getViewModel(),
            obj;
        cmp.mask("Loading");

        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : {
                pgm    : 'EC1010',
                action : 'getProdDtl',
                prod   : rec.getData().MODEL,
                stkloc : vm.get('STKLOC')
            },
            success : function (response, opts) {
                cmp.unmask();
                obj = Ext.decode(response.responseText);
                me.getViewModel().set('product', obj);

                view.add({
                    xtype       : 'window',
                    frame       : true,
                    closable    : true,
                    ui          : 'smeg',
                    width       : 600,
                    height      : "80%",
                    modal       : true,
                    fixed       : true,
                    scrollable  : true,
                    reference   : 'smegwindow',
                    bodyPadding : 5,
                    layout      : {
                        type : 'card'
                    },
                    title       : 'Product Detail: ' + obj.Product[0].MODEL,
                    items       : [{
                        xtype    : 'productdetail',
                        height   : '100%',
                        minWidth : 400
                    }],
                    autoShow    : true,
                    dockedItems : [{
                        xtype  : 'toolbar',
                        dock   : 'bottom',
                        cls    : 'detail-bbar',
                        height : 65,
                        items  : ['->', {
                            xtype      : 'numberfield',
                            name       : 'quantity',
                            itemId     : 'dtl-quantity',
                            fieldLabel : 'Quantity',
                            labelWidth : 54,
                            width      : 150,
                            minValue   : 0,
                            value      : 1
                        }, {
                            text    : 'ADD TO CART',
                            ui      : 'primary',
                            scale   : 'medium',
                            itemId  : 'addtocartbutton',
                            cls     : 'btn-detail-add-cart',
                            handler : 'onAddToCartFromDetail'
                        }]
                    }]
                }).show();
            },

            failure : function (response, opts) {
                var resp = Ext.decode(response.responseText);
                Ext.Msg.alert('Error', (resp.msg ? resp.msg : 'There was an error loading the detail.'));
            }
        });
    },

    onDetailImageClick : function () {
        var me  = this,
            cmp = Ext.ComponentQuery.query('dtlimagemain')[0];
        if (!cmp) {
            cmp = Ext.widget('dtlimagemain');
        }
        Ext.ComponentQuery.query('detailview')[0].up('window').getLayout().setActiveItem(cmp);
    },

    onCellClickProducts : function (cmp, td, cellIndex, rec) {
        var me        = this,
            grid      = cmp.grid,
            store     = grid.getStore(),
            column    = grid.headerCt.items.getAt(cellIndex),
            viewModel = me.getViewModel(),
            cartCount = viewModel.get('cartCount');

        if (!Ext.isEmpty(column.action) && column.action === 'removecartitem') {
            viewModel.set('cartCount', cartCount - rec.get('quantity'));
            store.remove(rec);

            grid.getView().refresh();
        }
    },

    onCellEdit : function (editor, e) {
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

    onCartButtonClick : function (cmp) {
        var me         = this,
            body       = Ext.getBody(),
            vm         = me.getViewModel(),
            action     = cmp.action,
            activeCart = vm.get('activeCartNumber');

        if (!Ext.isEmpty(action)) {
            // Process Form Data - Delete (Clear), Save, and Checkout

            var cartForm = Ext.ComponentQuery.query('cartform')[0];

            if (action === 'clearcart') {
                me.resetCart();
            } else if (action === 'savecart' || action === 'checkout' || action === 'deposit') {

                var errorMessage = 'This field is required',
                    formErrorMsg = function () {
                        Valence.common.util.Dialog.show({
                            title   : 'Incomplete Cart',
                            msg     : 'Please fill in all required sections.',
                            buttons : [{text : 'Ok'}]
                        });
                    },
                    validateForm = function () {
                        var orderInfoFields  = cartForm.down('#orderInfoFieldSet').query('[required]'),
                            customerFields   = cartForm.down('#customerfieldset').query('[required]'),
                            deliveryCheckbox = cartForm.down('#deliveryfieldset').down('checkbox'),
                            errorFound       = false,
                            deliveryFields;

                        //check order fields
                        //
                        for (var ii = 0; ii < orderInfoFields.length; ii++) {
                            if (Ext.isEmpty(orderInfoFields[ii].getValue())) {
                                orderInfoFields[ii].markInvalid(errorMessage);
                                errorFound = true;
                            }
                        }

                        //check customer fields
                        //
                        for (ii = 0; ii < customerFields.length; ii++) {
                            if (Ext.isEmpty(customerFields[ii].getValue())) {
                                customerFields[ii].markInvalid(errorMessage);
                                errorFound = true;
                            }
                        }

                        //delivery if needed
                        //
                        if (deliveryCheckbox.getValue()) {
                            deliveryFields = cartForm.down('#deliveryfieldset').query('[required]');
                            for (ii = 0; ii < deliveryFields.length; ii++) {
                                if (Ext.isEmpty(deliveryFields[ii].getValue())) {
                                    deliveryFields[ii].markInvalid(errorMessage);
                                    errorFound = true;
                                }
                            }
                        }
                        return !errorFound;
                    };

                if (!cartForm.isValid()) {
                    if (action === 'checkout' || action === 'deposit') {
                        validateForm();
                    }
                    formErrorMsg();
                    return;
                } else if (action === 'checkout' || action === 'deposit') {
                    var valid = validateForm();
                    if (!valid) {
                        formErrorMsg();
                        return;
                    }
                }

                // Get Form Data and Products from Store
                var formData  = cartForm.getValues(),
                    store     = vm.getStore('cartItems'),
                    prodArray = [];

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
                var checkboxName = Ext.ComponentQuery.query('cartform #deliveryfieldset')[0].down('checkbox').name;
                if (checkboxName && typeof formData[checkboxName] !== 'undefined') {
                    delete formData[checkboxName];
                }

                for (var i = 0; i < store.getCount(); i++) {
                    var product = store.getAt(i).getData();
                    prodArray.push(
                        {
                            OBITM  : product.product_id,
                            OBQTYO : product.quantity,
                            OBUPRC : product.price
                        }
                    );
                }

                if (action === 'savecart' || action == 'printcart') {
                    me.saveCart(cmp, formData, prodArray);
                } else {
                    me.checkout(cmp, formData, prodArray, action);
                }
            } else if (action == 'existingcarts') {
                me.showExistingCarts();
            }
        }
    },

    onMenuClickCartAction : function (menu, menuItem) {
        var me = this;
        me.onCartButtonClick(menuItem);
    },

    onViewReadyCartList : function (cmp) {
        var me    = this,
            store = cmp.getStore();

        //because of the layout and the grid not scrolling initial view
        // of the grid is not showing empty text if empty
        //
        if (store.getCount() === 0) {
            var rec = store.add({dummy : true});
            store.remove(rec);
        }
    },

    saveCart : function (cmp, formData, products) {
        var me     = this,
            vm     = me.getViewModel(),
            body   = Ext.getBody(),
            params = {
                pgm      : 'EC1050',
                action   : 'saveCart',
                products : Ext.encode(products),
                stkloc   : vm.get('stkLocation')
            }, resp, rep;


        body.mask(cmp.maskMsg);

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
                resp = Ext.decode(response.responseText);
                if (resp.success) {
                    Valence.common.util.Snackbar.show({text : 'Your order has been saved.'});
                    me.onPrintCart(resp.OAORDKEY);
                    me.resetCart();
                } else {
                    Ext.Msg.alert('Error', (resp.msg ? resp.msg : 'There was an error saving your cart.'));
                }
                body.unmask();
            },

            failure : function (response) {
                resp = Ext.decode(response.responseText);
                Ext.Msg.alert('Error', (resp.msg ? resp.msg : 'There was an error saving your cart.'));
                body.unmask();
            }
        });
    },

    checkout : function (cmp, formData, products, action) {
        var me                = this,
            body              = Ext.getBody(),
            vm                = me.getViewModel(),
            cartList          = Ext.ComponentQuery.query('cartlist')[0],
            cartItemsStore    = vm.getStore('cartItems'),
            formPanel         = Ext.ComponentQuery.query('cartform')[0],
            orderInfoFieldset = formPanel.query('#orderInfoFieldSet')[0],
            params            = {
                pgm      : 'EC1050',
                action   : action,
                products : Ext.encode(products),
                stkloc   : vm.get('stkLocation')
            }, response, orderKey, ordField, respProducts, rec, rep, cartPayment, maxPayment;

        // if there are products in the cart
        if (products.length == 0) {
            Ext.Msg.alert('Cart Error', 'Must have at least 1 product');
            return;
        }

        body.mask(cmp.maskMsg);

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
            success : function (r) {
                response = Ext.decode(r.responseText);
                orderKey = response.OAORDKEY;

                if (orderKey) {
                    vm.set('activeCartNumber', orderKey);
                    ordField = orderInfoFieldset.query('[name=OAORDKEY]')[0].setValue(orderKey);
                }
                if (!response.success || response.success === "false") {
                    respProducts = response.CartDtl;
                    if (respProducts && respProducts.length > 0) {
                        for (var i = 0; i < respProducts.length; i++) {
                            rec = cartItemsStore.findRecord('product_id', respProducts[i].OBITM);
                            rec.set('allocated', respProducts[i].OBQTYA);
                            rec.commit();
                        }
                    }

                    vm.set('hideAllocated', false);

                    body.unmask();
                    if (Ext.isEmpty(response.msg)) {
                        response.msg = 'Some product(s) not available in selected stock location. Try alternative stock location.';
                    }
                    me.showError(response);
                    return;
                }

                Ext.Ajax.request({
                    url     : '/valence/vvcall.pgm',
                    params  : {
                        pgm      : 'EC1050',
                        action   : 'getPayments',
                        OAORDKEY : orderKey,
                        paymode  : action
                    },
                    success : function (r) {
                        response          = Ext.decode(r.responseText);
                        response.OAORDKEY = orderKey;
                        maxPayment        = response.maxpay[0].maxpay;
                        cartPayment       = {
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
                            // cnx update
                            reference    : 'smegwindow',
                            // cnx update -- default focus
                            defaultFocus : '#payMethCombo',
                            items        : [{
                                xtype      : 'cartpayment',
                                scrollable : 'y',
                                paymode    : action,
                                cartInfo   : response,
                                maxpay     : maxPayment
                            }],
                            bbar         : ['->', {
                                text    : 'Cancel',
                                ui      : 'primary',
                                scale   : 'medium',
                                cls     : 'btn-cancel',
                                handler : function (btn) {
                                    btn.up('window').close();
                                }
                            }, {
                                cls      : 'btn-checkout',
                                overCls  : 'btn-checkout-over',
                                focusCls : 'btn-checkout',
                                ui       : 'primary',
                                scale    : 'medium',
                                text     : 'Ok',
                                width    : 80,
                                scope    : me,
                                paymode  : action,
                                handler  : me.sendPayment
                            }]
                        };
                        me.getView().add(cartPayment).show();
                        body.unmask();
                    },
                    failure : function (response) {
                        me.showError(response);
                        body.unmask();
                    }
                });
            },

            failure : function (response) {
                Ext.Msg.alert('Error', Ext.decode(response.responseText));
                body.unmask();
            }
        });
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

        me.lookupReference('productsMain').fireEvent('selectfirstcat');
        me.onClickGoBack();
    },

    onHeadingButtonClick : function (btn) {
        var me     = this,
            action = btn.action;

        if (action === 'resetcart') {
            me.resetCart();
        } else if (action === 'existingcarts') {
            me.showExistingCarts();
        }
    },

    showExistingCarts : function () {
        var me   = this,
            body = Ext.getBody(),
            view = me.getView(),
            vm   = me.getViewModel();

        body.mask('Loading');

        vm.getStore('existingCarts').load({
            scope    : me,
            callback : function () {
                body.unmask();
                view.add({
                    xtype     : 'window',
                    itemId    : 'exCartWindow',
                    renderTo  : Ext.getBody(),
                    ui        : 'smeg',
                    frame     : true,
                    closable  : true,
                    width     : 850,
                    height    : "80%",
                    modal     : true,
                    reference : 'smegwindow',
                    layout    : {
                        type : 'card'
                    },
                    title     : 'Saved Orders',
                    items     : [{
                        xtype : 'existingcarts'
                    }]
                }).show();
            }
        });
    },

    loadExistingCart : function (cell, el, cellIndex, record) {
        var me                                            = this,
            vm                                            = me.getViewModel(),
            cartKey                                       = record.get('OAORDKEY'),
            exCartListWindow                              = Ext.ComponentQuery.query('#exCartWindow')[0],
            activeCart                                    = vm.get('activeCartNumber'),
            params                                        = {
                pgm      : 'EC1050',
                action   : 'getCartDetails',
                OAORDKEY : cartKey
            }, obj, delvOpt, delvOpts = {}, delvOptsArray = [];

        exCartListWindow.mask('Loading Cart');

        // Add active cart number if exists to release cart on the server
        if (activeCart) {
            params['oldcart'] = activeCart;
        }
        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : params,
            success : function (r) {
                obj = Ext.decode(r.responseText);
                if (!obj.success) {
                    me.showError(obj);
                    exCartListWindow.unmask();
                    return;
                }

                // Close Existing Cart List Window
                exCartListWindow.unmask();
                exCartListWindow.close();
                var products           = obj.CartDtl,
                    viewModel          = me.getViewModel(),
                    formPanel          = Ext.ComponentQuery.query('cartform')[0],
                    form               = formPanel.getForm(),
                    fieldset           = formPanel.query('#deliveryfieldset')[0],
                    fields             = fieldset.query('field'),
                    cartItemStore      = vm.getStore('cartItems'),
                    cartItemStoreItems = [],
                    cartItemCount      = 0,
                    repStr             = vm.getStore('cartReps'),
                    formValues         = {},
                    repRec, product, field, fldValue, prodQuantity,
                    delvDate, ninetyDate, todayDate;

                if (!Ext.isEmpty(obj.CartHdr)) {
                    Ext.apply(formValues, obj.CartHdr[0]);
                }

                if (!Ext.isEmpty(obj.DeliveryOptions)) {
                    delvOptsArray = obj.DeliveryOptions;
                    for (var i = 0; i < delvOptsArray.length; i++) {
                        delvOpt                  = delvOptsArray[i];
                        delvOpts[delvOpt.ODDELC] = delvOpt.ODDELV;
                    }
                    Ext.apply(formValues, delvOpts);
                }

                // Validate rep to be sure it still exists
                //
                repStr.load(function () {
                    repRec = repStr.findRecord('REP', formValues.OAREP);

                    me.lookupReference('cartrepscombo').setReadOnly(!Ext.isEmpty(repRec));

                    if (Ext.isEmpty(repRec)) {
                        form.setValues({
                            OAREP : ''
                        });
                    }
                });

                // validate date to be sure it is within the timeframe of today and 90 days from now
                //
                delvDate   = Ext.Date.parse(formValues.OADELD, 'Y-m-d');
                todayDate  = Ext.Date.parse(Ext.util.Format.date(new Date(), 'Y-m-d'), 'Y-m-d');
                ninetyDate = new Date();
                ninetyDate.setDate(ninetyDate.getDate() + 90);

                // convert to time since epoch
                delvDate   = delvDate.getTime();
                todayDate  = todayDate.getTime();
                ninetyDate = ninetyDate.getTime();

                if (delvDate < todayDate || delvDate > ninetyDate) {
                    formValues.OADELD = null;
                }

                // get stock location
                //
                vm.set('STKLOC', formValues.OASTKLOC);

                //Update form values
                form.setValues(formValues);

                // Check to see if Delivery Address is set and should be "expanded"
                for (var i = 0; i < fields.length; i++) {
                    field    = fields[i];
                    fldValue = field.getValue();

                    if (field.xtype !== 'checkboxfield' && !Ext.isEmpty(fldValue)) {
                        fieldset.expand();
                        break;
                    }
                }

                // Reset Cart Item Store
                cartItemStore.removeAll();

                if (!Ext.isEmpty(products)) {
                    for (var ii = 0; ii < products.length; ii++) {
                        product       = products[ii];
                        prodQuantity  = product.OBQTYO;
                        cartItemCount = cartItemCount + prodQuantity;
                        cartItemStoreItems.push({
                            "product_id" : product.OBITM,
                            "quantity"   : prodQuantity,
                            "allocated"  : product.OBQTYA,
                            "price"      : product.OBUPRC,
                            "prod_desc"  : product.I1IDSC
                        });
                    }
                }

                cartItemStore.add(cartItemStoreItems);

                viewModel.set('cartCount', cartItemCount);
                viewModel.set({
                    cartCount        : cartItemCount,
                    activeCartNumber : cartKey
                });
                me.onViewCart();
            },
            failure : me.showError
        });
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
            // cnx update
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
                        me.onPrintCart(orderKey);
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
                                maxpay           = resp.maxpay[0].maxpay
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
                                // cnx update -- focus payment combo
                                //
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

    onCellClickExistCart : function (cmp, td, cellIndex, rec) {
        var me     = this,
            grid   = cmp.grid,
            store  = grid.getStore(),
            column = grid.headerCt.items.getAt(cellIndex),
            regex  = new RegExp('dep', 'i');

        if (!Ext.isEmpty(column.action) && column.action === 'removecart' && !regex.test(rec.get('OAOSTS'))) {
            me.deleteCart(rec.get('OAORDKEY'), function (success, response) {
                if (success) {
                    store.remove(rec);
                    Valence.common.util.Snackbar.show({text : 'The cart has been deleted'});
                } else {
                    var resp = Ext.decode(response.responseText);
                    Ext.Msg.alert('Error', (resp.msg ? resp.msg : 'Error deleting cart'));
                }
            }, me);
        }
    },

    onPrintCart : function (key) {
        var me                              = this,
            body                            = Ext.getBody(),
            vm                              = me.getViewModel(),
            str                             = vm.getStore('cartItems'),
            lines                           = Ext.Array.pluck(str.data.items, 'data'),
            jsDate                          = new Date(),
            date                            = Ext.util.Format.date(jsDate, 'Y-m-d'),
            time                            = Ext.util.Format.date(jsDate, 'g:iA'),
            dRec, delvStr, qty, total, data = {}, d2;

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

    /**
     * onValidateEditCartItems - Validate the edit on the release column so they can't enter more than the quantity
     * @param editor
     * @param context
     * @returns {boolean}
     */
    onValidateEditCartItems : function (editor, context) {
        var me = this;

        if (context.field === 'release') {
            var rec   = context.record,
                value = context.value,
                fld = context.column.field;
            fld.markInvalid(null);
            if (!Ext.isEmpty(value) && value > rec.get('quantity')) {
                fld.markInvalid('Quantity is greater than release');
                return false;
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