Ext.define('Shopping.view.shoppingstore.ShoppingStoreController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.shoppingstore',
    requires: [
        'Ext.form.field.Number',
        'Ext.window.Window',
        'Shopping.view.cart.ExistingCarts',
        'Shopping.view.cart.Main',
        'Shopping.view.products.detail.ImageMain',
        'Shopping.view.products.detail.Main',
        'Valence.common.util.Dialog',
        'Valence.common.util.Snackbar'
    ],

    init: function () {
        //console.log('init called');
        var me = this,
            vm = me.getViewModel();

        me.control({
            'categories': {
                selectionchange: me.onSelectionChangeEntities
            },
            'products dataview': {
                itemclick: me.onItemClickProduct,
                addtocart: me.onAddToCart,
                showdetail: me.onShowDetail,
                showinfo: me.onItemClickProduct,
            },
            'detailview': {
                showlargerimage: me.onDetailImageClick
            },
            'heading button': {
                click: me.onHeadingButtonClick
            },
            'dtlimagemain #dtlImgAddToCart': {
                click: me.onAddToCartFromDetail
            },
            'existingcarts': {
                cellclick: me.onCellClickExistCart
            }
        });

        Shopping.getApplication().on({
            scope: me,
            agentselected: me.agentSelected,
            beforelogout: me.resetCart
        });
    },

    initViewModel: function (vm) {
        var me = this,
            releaseCartItems = vm.getStore('ReleaseItems'),
            cartItems = vm.getStore('cartItems');

        releaseCartItems.setSource(cartItems);
    },

    agentSelected: function (content) {
        //console.log('agentSelected called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView('categories'),
            mainVm = me.getView().lookupViewModel(true),
            card = me.lookupReference('card'),
            mainCart = me.lookupReference('cartcontainer'),
            stockDefault = mainVm.get('defaultStockLocation'),
            catTree = me.lookupReference('catsRef');
        var catView = Ext.ComponentQuery.query('categories')[0].getView();


        // console.log('stockDefault => ' + stockDefault);

        if (!Ext.isEmpty(stockDefault)) {
            var productsStore = vm.getStore('products');
            Ext.apply(productsStore.getProxy().extraParams, {
                stkloc: stockDefault
            });
        }

        if (Ext.isEmpty(mainCart)) {
            console.log('mainCart is empty');
            mainCart = Ext.create('Shopping.view.cart.Main', {
                cartOptions: mainVm.get('cartOptions'),
                listeners: {
                    scope: me,
                    back: 'onClickGoBack',
                    resetcart: 'onResetCart',
                    selectstocklocation: 'onSelectStockLocation',
                    showdetail: 'onShowDetail'
                }
            });
            card.add(mainCart);
        } else {
            console.log('mainCart not empty');
            me.resetCart();
            me.onClickGoBack();
        }

        //if (vm.getStore('categories').loadCount >= 1)
        vm.getStore('categories').load({
            scope: me,
            callback: function () {
                //console.log('callback called');
                //Ext.ComponentQuery.query('categories')[0].getView().expendAll();
                vm.getStore('categories').getRoot().expand();

            }
        });
        //console.info(Ext.ComponentQuery.query('categories')[0].getView());



    },

    onAfterRenderSearchSavedOrders: function (cmp) {
        var me = this;
        setTimeout(function () {
            cmp.focus();
        }, 100);
    },

    onSelectStockLocation: function (fld, rec) {
        console.log('onSelectStockLocation called');
        var me = this,
            vm = me.getViewModel(),
            str = vm.getStore('products'),
            extraParams = str.getProxy().extraParams,
            val = rec.get('STKCOD');

        vm.set('STKLOC', val);
        //console.info(vm);
        Ext.apply(extraParams, {
            stkloc: val
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

    onClickGoBack: function () {
        console.log('onClickGoBack called');
        var me = this;
        //me.getViewModel().getStore('products').load();
        me.lookupReference('card').getLayout().setActiveItem(0);
    },

    onClearSearchSavedOrders: function (cmp) {
        var me = this,
            vm = me.getViewModel(),
            str = vm.getStore('existingCarts');

        str.clearFilter();
    },

    deleteCart: function (orderKey, callback, scope) {
        var me = this;

        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: {
                pgm: 'EC1050',
                action: 'deleteCart',
                OAORDKEY: orderKey
            },
            success: function (response) {
                if (!Ext.isEmpty(callback)) {
                    Ext.callback(callback, (!Ext.isEmpty(scope)) ? scope : me, [true, response]);
                }
            },
            failure: function (response) {
                if (!Ext.isEmpty(callback)) {
                    Ext.callback(callback, (!Ext.isEmpty(scope)) ? scope : me, [false, response]);
                }
            }
        });
    },

    onChangeSearchSavedOrders: function (fld, val) {
        var me = this,
            vm = me.getViewModel(),
            str = vm.getStore('existingCarts');

        str.clearFilter();

        Valence.util.Helper.processTypedInputFilter(str, ['OAORDKEY', 'OAMNTD', 'OAMNTT', 'OACSTREF', 'OAREP', 'OAORDKEY', 'OACSTNAM', 'OACSTEML', 'OACSTPH1', 'OACSTPH2'], val);
    },
    onClearSearch: function (fld) {
        var me = this,
            vm = me.getViewModel(),
            str = vm.getStore('products');

        str.clearFilter();
    },

    onKeyupSearch: function (fld) {
        var me = this,
            value = fld.getValue(),
            vm = me.getViewModel(),
            str = vm.getStore('products'),
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

    onViewCart: function (rec) {
        console.log(rec);
        console.info('onViewCart in shoppingstore controller called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            form = view.down('cartform'),
            cartmain = Ext.ComponentQuery.query('cartmain')[0], params = {};

        this.lookupReference('card').getLayout().setActiveItem(1);


        // send cart info to back end 

        // caculate the price and disable the calculate the button
        //console.info(vm);
        //console.info(cartmain.getController().getCart());
        //console.info(me.getCart());


        // if new order send data to back end else just bring the existing order
        // if (Ext.isEmpty(vm.get('activeCartNumber'))) {
        //     var cartInfo = me.getCart();
        //     Ext.apply(params, cartInfo.data);
        //     Ext.apply(params, { products: Ext.encode(cartInfo.products) });
        //     console.info(params);
        //     Ext.Ajax.request({
        //         url: 'https://a2cbb64f-4a1c-41a0-937e-0be30120dcf4.mock.pstmn.io/calculate_new_cart',
        //         method: 'POST',
        //         params: params,
        //         success: function (r) {
        //             console.info(r);
        //             me.lookupReference('card').getLayout().setActiveItem(1);

        //         },
        //         failure: function (r) {
        //             console.log('calculate cart failure');
        //         }
        //     });
        // } else {
        //     console.log('existing order');
        //     me.lookupReference('card').getLayout().setActiveItem(1);
        // }

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
        console.info(store);

        console.info(form);
        console.info(form.getValues());
        Ext.apply(formData, form.getValues());
        // generate product Array
        for (var i = 0; i < store.getCount(); i++) {
            item = store.getAt(i).getData();
            prodArray.push({
                OBITM: item.product_id,
                OBQTYO: item.quantity,
                OBUPRC: item.price,
                //OBQTYR: (standardOrder) ? Shopping.util.Helper.getOutstanding(rec) : product.release
                OBQTYR: item.release
            })

        }

        return {
            data: formData,
            products: prodArray
        }
    },





    onAddToCart: function (e, dtlQuantity) {
        // If add to cart is clicked from the Detail screen then
        // we need to get the product from the ViewModel and quantity from the spinner
        //console.log('onAddToCart called');
        var me = this,
            viewModel = me.getViewModel(),
            product = (dtlQuantity ? viewModel.get('product').Product[0] : e.data),
            quantity = (dtlQuantity ? dtlQuantity : 1),
            cartItemStore = viewModel.getStore('cartItems'),
            cartItem = {
                product_id: product.MODEL,
                prod_desc: product.PRODDESC,
                quantity: quantity,
                price: product.PRICE,
                smallpic: product.SMALLPIC
            },
            existingRec = cartItemStore.findRecord('product_id', product.MODEL, 0, false, true, true),
            snackbarEl = Ext.getBody().query('.w-snackbar-outer')[0],
            snackbarCmp = (!Ext.isEmpty(snackbarEl)) ? Ext.getCmp(snackbarEl.id) : null,
            notify = function () {
                Valence.common.util.Snackbar.show({
                    text: quantity + ' item(s) have been added to cart',
                    duration: 2000
                });
            };

        if (!Ext.isEmpty(existingRec)) {
            existingRec.set({
                quantity: existingRec.get('quantity') + quantity
            });
            existingRec.commit();
        } else {
            cartItemStore.add(cartItem);
        }

        viewModel.set('cartCount', viewModel.get('cartCount') + quantity);
        //check if the snackbar is already visible and if so don't show it again
        //
        if (!Ext.isEmpty(snackbarCmp) && (!snackbarCmp.isVisible() || !snackbarCmp.hasCls('is-active'))) {
            notify();
        } else if (Ext.isEmpty(snackbarCmp)) {
            notify();
        }
    },

    onAddToCartFromDetail: function (cmp, e) {
        var quantity = 1;
        if (cmp.itemId === 'addtocartbutton') {
            quantity = Ext.ComponentQuery.query('#dtl-quantity')[0].getValue();
        } else {
            quantity = Ext.ComponentQuery.query('#dtl-img-quantity')[0].getValue();
        }
        this.onAddToCart(cmp, quantity);
        cmp.up('window').close();
    },

    onItemClickProduct: function (cmp, record, el, index, e) {
        var me = this,
            attr = Ext.get(e.getTarget()).getAttribute('data-event'),
            selectedText = document.getSelection();

        //check if the element has selected text. If so user is selecting text "model" so don't show the details
        // window
        //
        if (!Ext.isEmpty(selectedText) && !selectedText.isCollapsed && !Ext.isEmpty(selectedText.extentNode)) {
            if (!Ext.isEmpty(selectedText.extentNode.parentElement) && el.contains(selectedText.extentNode.parentElement)) {
                return;
            }
        }

        if (attr) {
            cmp.fireEvent(attr, record);
        } else {
            cmp.fireEvent('showdetail', cmp, record);
        }
    },

    onSelectionChangeEntities: function (sm, recs) {
        console.log('onSelectionChangeEntities called');
        var me = this,
            rec = recs[0],
            vm = me.getViewModel(),
            str = vm.getStore('products'),
            xp = str.getProxy().extraParams;

        // console.info(str);
        // console.info(rec);
        if (rec) {
            console.log('rec is not null');
            Ext.apply(xp, {
                cat: rec.get('CATID')
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
                bannerText: rec.get('BANTEXT'),
                hideBannerText: Ext.isEmpty(rec.get('BANTEXT'))
            });
        }
    },

    onShowDetail: function (cmp, rec, viewOnly) {
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            obj;

        if (Ext.isEmpty(viewOnly) || !Ext.isBoolean(viewOnly)) {
            viewOnly = false;
        }

        Valence.common.util.Helper.loadMask({
            renderTo: cmp.el,
            text: 'Loading'
        });

        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: {
                pgm: 'EC1010',
                action: 'getProdDtl',
                prod: rec.getData().MODEL,
                stkloc: vm.get('STKLOC')
            },
            success: function (response, opts) {
                Valence.common.util.Helper.destroyLoadMask(cmp.el);
                obj = Ext.decode(response.responseText);
                me.getViewModel().set('product', obj);
                var windowCfg = {
                    xtype: 'window',
                    frame: true,
                    closable: true,
                    draggable: false,
                    ui: 'smeg',
                    width: 600,
                    height: "80%",
                    //height: "100%",
                    modal: true,
                    fixed: true,
                    scrollable: true,
                    reference: 'smegwindow',
                    bodyPadding: 5,
                    layout: {
                        type: 'card'
                    },
                    title: 'Product Information: ' + obj.Product[0].MODEL,
                    items: [{
                        xtype: 'productdetail',
                        height: '100%',
                        minWidth: 400
                    }],
                    autoShow: true,
                    listeners: {
                        afterrender: function (cmp) {
                            var header = cmp.getHeader(),
                                title = (!Ext.isEmpty(header)) ? header.getTitle() : null;

                            if (!Ext.isEmpty(title) && !Ext.isEmpty(title.textEl)) {
                                title.textEl.selectable();
                            }
                        }
                    }
                };

                if (viewOnly) {
                    Ext.apply(windowCfg, {
                        defaultFocus: 'button',
                        dockedItems: [{
                            xtype: 'toolbar',
                            dock: 'bottom',
                            cls: 'detail-bbar',
                            items: ['->', {
                                text: 'Ok',
                                ui: 'blue',
                                scale: 'medium',
                                listeners: {
                                    click: function (cmp) {
                                        cmp.up('window').onEsc();
                                    }
                                }
                            }]
                        }]
                    });
                } else {
                    Ext.apply(windowCfg, {
                        dockedItems: [{
                            xtype: 'toolbar',
                            dock: 'bottom',
                            cls: 'detail-bbar',
                            items: ['->', {
                                xtype: 'numberfield',
                                name: 'quantity',
                                cls: 'numberfield',
                                itemId: 'dtl-quantity',
                                fieldLabel: 'Quantity',
                                labelWidth: 54,
                                scale: 'small',
                                width: 120,
                                height: 25,
                                minValue: 0,
                                value: 1,
                            }, {
                                    xtype: 'button',
                                    text: 'add',
                                    //ui: 'blue',
                                    scale: 'small',
                                    cls: 'btn-detail-add-cart',
                                    itemId: 'addtocartbutton',
                                    handler: 'onAddToCartFromDetail',
                                    height: 'auto',
                                    //style: 'height: 25px;'
                                }]
                        }]
                    });
                }
                view.add(windowCfg).show();
            },

            failure: function (response, opts) {
                var resp = Ext.decode(response.responseText);
                Ext.Msg.alert('Error', (resp.msg ? resp.msg : 'There was an error loading the detail.'));
            }
        });
    },

    onDetailImageClick: function () {
        var me = this,
            cmp = Ext.ComponentQuery.query('dtlimagemain')[0];
        if (!cmp) {
            cmp = Ext.widget('dtlimagemain');
        }
        Ext.ComponentQuery.query('detailview')[0].up('window').getLayout().setActiveItem(cmp);
    },

    onResetCart: function () {
        this.lookupReference('productsMain').fireEvent('selectfirstcat');
    },

    resetCart: function () {
        Shopping.getApplication().fireEvent('resetcart');

        this.lookupReference('productsMain').fireEvent('selectfirstcat');
    },

    onHeadingButtonClick: function (btn) {
        console.log('onHeadingButtonClick called');
        var me = this,
            action = btn.action;

        if (action === 'resetcart') {
            me.resetCart();
        } else if (action === 'existingcarts') {
            me.showExistingCarts();
        }
    },

    showExistingCarts: function () {
        var me = this,
            body = Ext.getBody(),
            view = me.getView(),
            vm = me.getViewModel(),
            store = vm.getStore('existingCarts');

        Valence.common.util.Helper.loadMask({
            renderTo: body,
            text: 'Loading'
        });

        store.clearFilter();

        store.load({
            scope: me,
            callback: function () {
                Valence.common.util.Helper.destroyLoadMask(body);
                view.add({
                    xtype: 'window',
                    itemId: 'exCartWindow',
                    renderTo: Ext.getBody(),
                    ui: 'smeg',
                    frame: true,
                    closable: true,
                    width: 850,
                    height: "80%",
                    modal: true,
                    reference: 'smegwindow',
                    layout: {
                        type: 'card'
                    },
                    title: 'Saved Orders',
                    items: [{
                        xtype: 'existingcarts'
                    }]
                }).show();
            }
        });
    },


    // Load New Cart, first update and then load
    onUpdateCartAndShow: function () {
        console.log('onUpdateCartAndShow in ShoppingStoreController called');

        Valence.common.util.Helper.loadMask({
            text: 'Loading Cart'
        });
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(), params = {};

        console.info(vm);

        // if new order get the assigned order key and load the order details
        if (Ext.isEmpty(vm.get('activeCartNumber')) || (!Ext.isEmpty(vm.get('activeCartNumber')) && vm.get('needUpdate'))) {
            var cartInfo = me.getCart();
            Ext.apply(params, cartInfo.data);
            Ext.apply(params, { products: Ext.encode(cartInfo.products) });
            console.info(params);
            Ext.Ajax.request({
                url: 'https://a2cbb64f-4a1c-41a0-937e-0be30120dcf4.mock.pstmn.io/calculate_new_cart',
                method: 'POST',
                params: params,
                success: function (r) {
                    Valence.common.util.Helper.destroyLoadMask();
                    console.info(r);
                    obj = Ext.decode(r.responseText);
                    var cartItems = obj.CartDtl,
                        cartItemStore = vm.getStore('cartItems'),
                        cartItemStoreItems = [];
                    //repStr = vm.getStore(cartReps)
                    // Set assigned order key
                    if (!Ext.isEmpty(obj.CartHdr[0].OAORDKEY)) {
                        vm.set('activeCartNumber', obj.CartHdr[0].OAORDKEY);
                    }

                    // Load cart item list

                    // Reset Cart Item Store
                    cartItemStore.removeAll();

                    if (!Ext.isEmpty(cartItems)) {
                        for (var i = 0; i < cartItems.length; i++) {
                            product = cartItems[i];
                            //prodQuantity = product.OBQTYO;
                            //cartItemCount = cartItemCount + prodQuantity;
                            cartItemStoreItems.push({
                                "product_id": product.OBITM,
                                "quantity": product.OBQTYO,
                                "allocated": product.OBQTYA,
                                "price": product.OBUPRC,
                                "prod_desc": product.I1IDSC,
                                "delivered": product.OBQTYD,
                                "smallpic": product.SMALLPIC
                            });
                        }
                    }

                    cartItemStore.add(cartItemStoreItems);
                    me.onViewCart();

                    vm.notify();



                },
                failure: function (r) {
                    Valence.common.util.Helper.destroyLoadMask();
                    console.log('calculate cart failure');
                }
            });
        } else {
            console.log('existing order');
            Valence.common.util.Helper.destroyLoadMask();
            me.onViewCart();

        }

    },

    loadExistingCart: function (cell, el, cellIndex, record) {
        console.info('loadExistingCart called');
        var me = this,
            vm = me.getViewModel(),
            cartKey = record.get('OAORDKEY'),
            exCartListWindow = Ext.ComponentQuery.query('#exCartWindow')[0],
            activeCart = vm.get('activeCartNumber'),
            params = {
                pgm: 'EC1050',
                action: 'getCartDetails',
                OAORDKEY: cartKey
            }, obj, delvOpt, delvOpts = {}, delvOptsArray = [];

        Valence.common.util.Helper.loadMask({
            renderTo: exCartListWindow.el,
            text: 'Loading Cart'
        });

        // Add active cart number if exists to release cart on the server
        if (activeCart) {
            params['oldcart'] = activeCart;
        }
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: params,
            success: function (r) {
                //console.info(r);
                obj = Ext.decode(r.responseText);
                //console.info(obj);
                var continueFnc = function () {
                    var products = obj.CartDtl,
                        formPanel = Ext.ComponentQuery.query('cartform')[0],
                        form = formPanel.getForm(),
                        fieldset = formPanel.query('#deliveryfieldset')[0],
                        fields = fieldset.query('field'),
                        cartItemStore = vm.getStore('cartItems'),
                        cartItemStoreItems = [],
                        cartItemCount = 0,
                        repStr = vm.getStore('cartReps'),
                        formValues = {},
                        repRec, product, field, fldValue, prodQuantity,
                        delvDate, ninetyDate, todayDate;

                    //console.info(cartItemStore);
                    if (!Ext.isEmpty(obj.CartHdr)) {
                        Ext.apply(formValues, obj.CartHdr[0]);
                    }

                    if (!Ext.isEmpty(obj.DeliveryOptions)) {
                        delvOptsArray = obj.DeliveryOptions;
                        for (var i = 0; i < delvOptsArray.length; i++) {
                            delvOpt = delvOptsArray[i];
                            delvOpts[delvOpt.ODDELC] = delvOpt.ODDELV;
                        }
                        Ext.apply(formValues, delvOpts);
                    }

                    // Validate rep to be sure it still exists
                    //
                    repStr.load(function () {
                        var cartContainer = me.lookupReference('cartcontainer');
                        repRec = repStr.findRecord('REP', formValues.OAREP);

                        if (!Ext.isEmpty(cartContainer)) {
                            cartContainer.fireEvent('updaterepsreadonly', !Ext.isEmpty(repRec));
                        }

                        if (Ext.isEmpty(repRec)) {
                            form.setValues({
                                OAREP: ''
                            });
                        }
                    });

                    // validate date to be sure it is within the timeframe of today and 90 days from now
                    //
                    delvDate = Ext.Date.parse(formValues.OADELD, 'Y-m-d');
                    todayDate = Ext.Date.parse(Ext.util.Format.date(new Date(), 'Y-m-d'), 'Y-m-d');
                    ninetyDate = new Date();
                    ninetyDate.setDate(ninetyDate.getDate() + 200);

                    // convert to time since epoch
                    delvDate = delvDate.getTime();
                    todayDate = todayDate.getTime();
                    ninetyDate = ninetyDate.getTime();

                    if (delvDate < todayDate || delvDate > ninetyDate) {
                        formValues.OADELD = null;
                    }

                    //check for follow-up date and if null clear it
                    //
                    if (!Ext.isEmpty(formValues.OAFUDT) && formValues.OAFUDT === '0001-01-01') {
                        formValues.OAFUDT = null;
                    }

                    vm.set({
                        STKLOC: obj.OASTKLOC,
                        cartValues: formValues,
                        disableSalesPerson: (!Ext.isEmpty(obj.lockSalesPerson) && obj.lockSalesPerson === 'true' && !Ext.isEmpty(formValues.OAREP)) ? true : false
                    });

                    // Check to see if Delivery Address is set and should be "expanded"
                    fieldset.down('#deliveryChkbox').setValue(false);
                    // console.info(formValues);
                    // console.info(Ext.isEmpty(formValues.OADELST1));
                    if (!Ext.isEmpty(formValues.OADELST1) || !Ext.isEmpty(formValues.OADELCTY) || !Ext.isEmpty(formValues.OADELSTA) || !Ext.isEmpty(formValues.OADELPST) || !Ext.isEmpty(formValues.OADELPH1)) {
                        setTimeout(function () {
                            //console.info('chkbox mark true');
                            fieldset.down('#deliveryChkbox').setValue(true);
                        }, 10);
                    } else {
                        setTimeout(function () {
                            //console.info('chkbox mark false');
                            fieldset.down('#deliveryChkbox').setValue(false);
                        }, 10);
                    }

                    // Reset Cart Item Store
                    cartItemStore.removeAll();

                    if (!Ext.isEmpty(products)) {
                        for (var ii = 0; ii < products.length; ii++) {
                            product = products[ii];
                            prodQuantity = product.OBQTYO;
                            cartItemCount = cartItemCount + prodQuantity;
                            cartItemStoreItems.push({
                                "product_id": product.OBITM,
                                "quantity": prodQuantity,
                                "allocated": product.OBQTYA,
                                "price": product.OBUPRC,
                                "prod_desc": product.I1IDSC,
                                "delivered": product.OBQTYD,
                                "smallpic": product.SMALLPIC
                            });
                        }
                    }

                    cartItemStore.add(cartItemStoreItems);

                    vm.set({
                        cartCount: cartItemCount,
                        activeCartNumber: cartKey
                    });
                    //console.info(me);
                    me.onViewCart();

                    vm.notify();
                };

                if (!obj.success) {
                    me.showError(obj);
                    Valence.common.util.Helper.destroyLoadMask(exCartListWindow.el);
                    return;
                }

                // Close Existing Cart List Window
                Valence.common.util.Helper.destroyLoadMask(exCartListWindow.el);
                exCartListWindow.close();

                //check if the agent/customer is different than the current agent/customer
                //
                var header = (!Ext.isEmpty(obj.CartHdr)) ? obj.CartHdr[0] : null,
                    selectedAgent = (!Ext.isEmpty(header)) ? header.OACSTN : null,
                    mainController = me.getView().up('app-main').getController(),
                    mainVm = me.getView().lookupViewModel(true),
                    activeAgent = mainVm.get('agent');


                // reset form value
                // var cartForm = Ext.ComponentQuery.query('cartmain')[0].down('cartform').getForm();

                // cartForm.setValues(cartForm.getValues());

                //check if the agent is different form the one we are currently working with
                // if so update the portal and get the options
                if (!Ext.isEmpty(selectedAgent) && selectedAgent != activeAgent) {
                    // console.log('agent change');
                    // console.info(selectedAgent);
                    // console.info(activeAgent);


                    //console.info(parent.Portal);
                    if (!Ext.isEmpty(parent.Portal)) {
                        // console.log('in parent Portal');
                        // console.info(parent.Portal.getApplication());
                        parent.Portal.getApplication().fireEvent('smegagentchanged', selectedAgent);
                    }
                    mainController.getOptions(selectedAgent)
                        .then(function (content) {
                            Valence.common.util.Helper.destroyLoadMask();
                            var stockDefault = mainVm.get('STKLOC');
                            // Added to reload the categories and products
                            Shopping.getApplication().fireEvent('agentselected', content);

                            if (!Ext.isEmpty(stockDefault)) {
                                var productsStore = vm.getStore('products');
                                Ext.apply(productsStore.getProxy().extraParams, {
                                    stkloc: stockDefault
                                });
                            }
                            continueFnc();
                        }, function (content) {
                            Valence.common.util.Helper.destroyLoadMask();
                            Valence.common.util.Dialog.show({
                                title: 'Error',
                                msg: content.msg,
                                minWidth: 210,
                                buttons: [{
                                    text: Valence.lang.lit.ok
                                }]
                            });
                        });
                } else {
                    continueFnc();
                }
                vm.set('needUpdate', false);
                //me.onViewCart();
            },
            failure: me.showError
        });
    },

    // Cart Items change then mark needUpate = true
    onGridDatachanged: function () {
        console.log('onGridDatachanged called');
        var me = this,
            vm = me.getViewModel();
        vm.set('needUpdate', true);

    },
    onGridUpdate: function () {
        console.log('onGridUpdate called');
        var me = this,
            vm = me.getViewModel();
        vm.set('needUpdate', true);
    },

    onCartRepsLoad: function () {
        console.log('onCartRepsLoad called');
        var me = this,
            vm = me.getViewModel(),
            cartForm = Ext.ComponentQuery.query('cartmain')[0].down('cartform').getForm(),
            items = cartForm.getFields().items;
        //console.info(cartForm);

        setTimeout(function () {
            if (!Ext.isEmpty(vm.get('activeCartNumber'))) {
                //console.log('old order');
                // console.info(cartForm.getFields());
                for (i = 0; i < items.length; i++) {
                    items[i].wasDirty = false;
                }
            } else {
                //console.log('new order');
            }
        }, 100);

    },

    onCellClickExistCart: function (cmp, td, cellIndex, rec) {
        console.log('onCellClickExistCart');
        var me = this,
            grid = cmp.grid,
            store = grid.getStore(),
            column = grid.headerCt.items.getAt(cellIndex),
            regex = new RegExp('ord', 'i');

        if (!Ext.isEmpty(column.action) && column.action === 'removecart' && !regex.test(rec.get('OAOSTS'))) {
            me.deleteCart(rec.get('OAORDKEY'), function (success, response) {
                var resp = Ext.decode(response.responseText);
                if (success && resp.success) {
                    store.remove(rec);
                    Valence.common.util.Snackbar.show({ text: 'Order deleted' });
                } else {
                    Valence.common.util.Dialog.show({
                        title: 'Error',
                        minWidth: 300,
                        msg: !Ext.isEmpty(resp.msg) ? resp.msg : 'Error deleting order',
                        buttons: [{ text: 'Ok' }]
                    });
                }
            }, me);
        } else {
            me.loadExistingCart(cmp, td, cellIndex, rec);
        }
    },

    showError: function (r) {
        var d = {};

        if (!Ext.isEmpty(r) && !Ext.isEmpty(r.responseText)) {
            d = Ext.decode(r.responseText);
        } else {
            d = r;
        }

        Valence.common.util.Dialog.show({
            title: 'Error',
            minWidth: 300,
            msg: Ext.isEmpty(d.msg) ? 'Error' : d.msg,
            buttons: [{ text: 'Ok' }]
        });
    },

    // onShowInfo: function () {
    //     console.log('onShowInfo called');
    //     //this.onShowDetail();
    // }
});