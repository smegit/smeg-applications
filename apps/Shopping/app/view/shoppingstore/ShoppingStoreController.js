Ext.define('Shopping.view.shoppingstore.ShoppingStoreController', {
    extend   : 'Ext.app.ViewController',
    alias    : 'controller.shoppingstore',
    requires : [
        'Ext.form.field.Number',
        'Ext.window.Window',
        'Shopping.view.cart.ExistingCarts',
        'Shopping.view.cart.Main',
        'Shopping.view.products.detail.ImageMain',
        'Shopping.view.products.detail.Main',
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
            'existingcarts'                 : {
                cellclick : me.onCellClickExistCart
            }
        });

        Shopping.getApplication().on({
            scope         : me,
            agentselected : me.agentSelected,
            beforelogout  : me.resetCart
        });
    },

    initViewModel : function (vm) {
        var me               = this,
            releaseCartItems = vm.getStore('ReleaseItems'),
            cartItems        = vm.getStore('cartItems');

        releaseCartItems.setSource(cartItems);
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
                cartOptions : mainVm.get('cartOptions'),
                listeners   : {
                    scope               : me,
                    back                : 'onClickGoBack',
                    resetcart           : 'onResetCart',
                    selectstocklocation : 'onSelectStockLocation',
                    showdetail          : 'onShowDetail'
                }
            });
            card.add(mainCart);
        } else {
            me.resetCart();
            me.onClickGoBack();
        }

        vm.getStore('categories').load();
    },

    onAfterRenderSearchSavedOrders : function (cmp) {
        var me = this;
        setTimeout(function () {
            cmp.focus();
        }, 100);
    },

    onSelectStockLocation : function (fld, rec) {
        var me          = this,
            vm          = me.getViewModel(),
            str         = vm.getStore('products'),
            extraParams = str.getProxy().extraParams,
            val         = rec.get('STKCOD');

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
        this.lookupReference('card').getLayout().setActiveItem(1);
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
                price      : product.PRICE,
                smallpic   : product.SMALLPIC
            },
            existingRec   = cartItemStore.findRecord('product_id', product.MODEL, 0, false, true, true),
            snackbarEl    = Ext.getBody().query('.w-snackbar-outer')[0],
            snackbarCmp   = (!Ext.isEmpty(snackbarEl)) ? Ext.getCmp(snackbarEl.id) : null,
            notify        = function () {
                Valence.common.util.Snackbar.show({
                    text     : quantity + ' item(s) have been added to cart',
                    duration : 2000
                });
            };

        if (!Ext.isEmpty(existingRec)) {
            existingRec.set({
                quantity : existingRec.get('quantity') + quantity
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

    onShowDetail : function (cmp, rec, viewOnly) {
        var me   = this,
            view = me.getView(),
            vm   = me.getViewModel(),
            obj;

        if (Ext.isEmpty(viewOnly) || !Ext.isBoolean(viewOnly)) {
            viewOnly = false;
        }

        Valence.common.util.Helper.loadMask({
            renderTo : cmp.el,
            text     : 'Loading'
        });

        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : {
                pgm    : 'EC1010',
                action : 'getProdDtl',
                prod   : rec.getData().MODEL,
                stkloc : vm.get('STKLOC')
            },
            success : function (response, opts) {
                Valence.common.util.Helper.destroyLoadMask(cmp.el);
                obj = Ext.decode(response.responseText);
                me.getViewModel().set('product', obj);
                var windowCfg = {
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
                    autoShow    : true
                };

                if (viewOnly) {
                    Ext.apply(windowCfg, {
                        defaultFocus : 'button',
                        dockedItems : [{
                            xtype : 'toolbar',
                            dock  : 'bottom',
                            cls   : 'detail-bbar',
                            items : ['->', {
                                text      : 'Ok',
                                ui        : 'blue',
                                scale     : 'medium',
                                listeners : {
                                    click : function (cmp) {
                                        cmp.up('window').onEsc();
                                    }
                                }
                            }]
                        }]
                    });
                } else {
                    Ext.apply(windowCfg, {
                        dockedItems : [{
                            xtype : 'toolbar',
                            dock  : 'bottom',
                            cls   : 'detail-bbar',
                            items : ['->', {
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
                                ui      : 'blue',
                                scale   : 'medium',
                                itemId  : 'addtocartbutton',
                                handler : 'onAddToCartFromDetail'
                            }]
                        }]
                    });
                }

                view.add(windowCfg).show();
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

    onResetCart : function () {
        this.lookupReference('productsMain').fireEvent('selectfirstcat');
    },

    resetCart : function () {
        Shopping.getApplication().fireEvent('resetcart');

        this.lookupReference('productsMain').fireEvent('selectfirstcat');
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
        var me    = this,
            body  = Ext.getBody(),
            view  = me.getView(),
            vm    = me.getViewModel(),
            store = vm.getStore('existingCarts');

        Valence.common.util.Helper.loadMask({
            renderTo : body,
            text     : 'Loading'
        });

        store.clearFilter();

        store.load({
            scope    : me,
            callback : function () {
                Valence.common.util.Helper.destroyLoadMask(body);
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

        Valence.common.util.Helper.loadMask({
            renderTo : exCartListWindow.el,
            text     : 'Loading Cart'
        });

        // Add active cart number if exists to release cart on the server
        if (activeCart) {
            params['oldcart'] = activeCart;
        }
        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : params,
            success : function (r) {
                obj             = Ext.decode(r.responseText);
                var continueFnc = function () {
                    var products           = obj.CartDtl,
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
                        var cartContainer = me.lookupReference('cartcontainer');
                        repRec            = repStr.findRecord('REP', formValues.OAREP);

                        if (!Ext.isEmpty(cartContainer)) {
                            cartContainer.fireEvent('updaterepsreadonly', !Ext.isEmpty(repRec));
                        }

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

                    //check for follow-up date and if null clear it
                    //
                    if (!Ext.isEmpty(formValues.OAFUDT) && formValues.OAFUDT === '0001-01-01'){
                        formValues.OAFUDT = null;
                    }

                    // get stock location
                    //
                    vm.set('STKLOC', formValues.OASTKLOC);

                    //Update form values
                    vm.set('cartValues', formValues);

                    // Check to see if Delivery Address is set and should be "expanded"
                    fieldset.down('#deliveryChkbox').setValue(false);
                    if (!Ext.isEmpty(formValues.OADELST1) || !Ext.isEmpty(formValues.OADELCTY) || !Ext.isEmpty(formValues.OADELSTA) || !Ext.isEmpty(formValues.OADELPST) ||!Ext.isEmpty(formValues.OADELPH1)){
                        setTimeout(function(){
                            fieldset.down('#deliveryChkbox').setValue(true);
                        },0);
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
                                "prod_desc"  : product.I1IDSC,
                                "delivered"  : product.OBQTYD,
                                "smallpic"   : product.SMALLPIC
                            });
                        }
                    }

                    cartItemStore.add(cartItemStoreItems);

                    // vm.set('cartCount', cartItemCount);
                    vm.set({
                        cartCount        : cartItemCount,
                        activeCartNumber : cartKey
                    });
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
                var header         = (!Ext.isEmpty(obj.CartHdr)) ? obj.CartHdr[0] : null,
                    selectedAgent  = (!Ext.isEmpty(header)) ? header.OACSTN : null,
                    mainController = me.getView().up('app-main').getController(),
                    mainVm         = me.getView().lookupViewModel(true),
                    activeAgent    = mainVm.get('agent');

                //check if the agent is different form the one we are currently working with
                // if so update the portal and get the options
                if (!Ext.isEmpty(selectedAgent) && selectedAgent != activeAgent) {
                    if (!Ext.isEmpty(parent.Portal)) {
                        parent.Portal.getApplication().fireEvent('smegagentchanged', selectedAgent);
                    }
                    mainController.getOptions(selectedAgent)
                        .then(function (content) {
                            Valence.common.util.Helper.destroyLoadMask();
                            var stockDefault = mainVm.get('STKDFT');

                            if (!Ext.isEmpty(stockDefault)) {
                                var productsStore = vm.getStore('products');
                                Ext.apply(productsStore.getProxy().extraParams, {
                                    stkloc : stockDefault
                                });
                            }
                            continueFnc();
                        }, function (content) {
                            Valence.common.util.Helper.destroyLoadMask();
                            Valence.common.util.Dialog.show({
                                title    : 'Error',
                                msg      : content.msg,
                                minWidth : 210,
                                buttons  : [{
                                    text : Valence.lang.lit.ok
                                }]
                            });
                        });
                } else {
                    continueFnc();
                }
            },
            failure : me.showError
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
                var resp = Ext.decode(response.responseText);
                if (success && resp.success) {
                    store.remove(rec);
                    Valence.common.util.Snackbar.show({text : 'The cart has been deleted'});
                } else {
                    Valence.common.util.Dialog.show({
                        title    : 'Error',
                        minWidth : 300,
                        msg      : !Ext.isEmpty(resp.msg) ? resp.msg : 'Error deleting cart',
                        buttons  : [{text : 'Ok'}]
                    });
                }
            }, me);
        } else {
            me.loadExistingCart(cmp, td, cellIndex, rec);
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