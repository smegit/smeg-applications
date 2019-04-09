Ext.define('Showroom.view.category.CategoryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.category',
    requires: [
        //'Ext.Button'
        //'Ext.ux.IFrame',
        //'Showroom.view.category.Download'
        //'Ext.window.Window'
        //'Showroom.view.category.Download'
    ],

    init: function (view) {
        // We provide the updater for the activeState config of our View.
        console.log('init called');
        console.info(view);
        view.updateActiveState = this.updateActiveState.bind(this);
        var me = this;

        me.control({
            'category container': {
                addtocart: me.onAddToCart,
                showdownload: me.onShowDownload
                //itemTap: me.onAddToCart
            }
        });

    },
    initViewModel: function (viewModel) {
        console.log('initViewModel called');
        console.info(viewModel);
        var me = this;
        //     catStore = viewModel.getStore('categories');
        // me.requestCat().then(function (res) {
        //     console.info(res);
        //     catStore.loadData(res.cats);
        // }, function (res) {
        //     console.info(res);
        // });

        //me.loadCat('***');
        setTimeout(function () {

            me.loadCat('CAT');
            //Ext.Msg.alert('loc', JSON.stringify(window.location.search), Ext.emptyFn);


        }, 500)
        //me.loadCat('CAT');




    },

    onProdItemTap: function (dv, index, target, rec, e) {
        console.info(dv);
        console.info(index);
        console.info(target);
        console.info(rec.getData().MODEL);
        console.info(e);
        var me = this,
            prodModel = rec.get('MODEL'),
            vm = me.getViewModel(),
            cartVm = Ext.ComponentQuery.query('cart')[0].getViewModel(),
            selectedProdsStore = cartVm.getStore('selectedProds'),
            prodStore = vm.getStore('products'), product,
            findRecordInProds = prodStore.findRecord('MODEL', prodModel, 0, false, false, true),
            isSelected = selectedProdsStore.findRecord('MODEL', prodModel, 0, false, false, true) ? true : false;
        console.info(selectedProdsStore);
        console.info(prodModel);
        if (e.target.localName === 'button') {
            if (e.target.innerText == 'Add to Cart') {
                // e.target.innerText = 'Added'
                // e.target.className = 'dv-prod-btn-selected';

                console.info(cartVm);
                if (findRecordInProds) {
                    findRecordInProds.set('addBtnClass', 'dv-prod-btn-selected');
                    findRecordInProds.set('addBtnText', 'Added');
                }
                // console.info(prodStore);
                console.info(findRecordInProds);

                // Add product to the selection store
                // fire event 
                Ext.ComponentQuery.query('cart')[0].fireEvent('addToCart', rec)
                vm.notify();

            } else {
                // e.target.innerText = 'Add to Cart';
                // e.target.className = 'dv-prod-btn-deSelected';
                if (findRecordInProds) {
                    findRecordInProds.set('addBtnClass', 'dv-prod-btn-deSelected');
                    findRecordInProds.set('addBtnText', 'Add to Cart');
                }

                // Remove product from the selection store
                console.info(rec);
                console.info(Ext.ComponentQuery.query('cart')[0].fireEvent('removeFromCart', rec))

            }
            //Ext.Msg.alert("You clicked a button");
        } else {
            console.info('click on product');

            // Get product details
            me.requestProdDtl(prodModel)
                .then(function (res) {
                    if (res.success) {

                        console.info(findRecordInProds);
                        if (isSelected) {

                            Ext.apply(res, {
                                'addBtnClass': 'prd-dtl-add-btn-pressed',
                                'addBtnText': 'Added'
                            });

                        } else {
                            Ext.apply(res, {
                                'addBtnClass': 'prd-dtl-add-btn',
                                'addBtnText': 'Add to Cart'
                            });
                        }


                        vm.set('product', res);
                        console.info(vm.get('product'));


                        me.doCardNavigation(1);

                    } else {
                        Ext.Msg.alert('Failed to get product info', JSON.stringify(res), Ext.emptyFn);

                    }
                }, function (res) {
                    Ext.Msg.alert('Server Error', JSON.stringify(res), Ext.emptyFn);
                });



            //me.doCardNavigation(1);
        }

    },
    loadCat: function (catId) {
        var me = this,
            vm = me.getViewModel(),
            catStore = vm.getStore('categories');
        //Ext.Msg.alert('loc', JSON.stringify(window.location.search), Ext.emptyFn);
        me.requestCat(catId).then(function (res) {
            console.info(res);
            if (res.success) {
                //vm.set('currentCatRoot', res.CATID);
                catStore.loadData(res.cats);

                delete res.cats
                vm.set('currentCatParent', res);
                //vm.set('currentCat', res);

                console.info(catStore);
                console.info(vm.get('currentCat'));
                console.info(vm.get('currentCatParent'));
            } else {
                Ext.Msg.alert('Error111', JSON.stringify(res), Ext.emptyFn);
            }
        }, function (res) {
            Ext.Msg.alert('Error222', JSON.stringify(res), Ext.emptyFn);
        });
    },


    onBeforeShow: function () {
        console.info('onBeforeShow called');
        var me = this,
            vm = me.getViewModel();
        console.info(vm.getStore('products'));
    },

    onAddToCart: function (target) {
        console.info('onAddToCart called');
        console.info(target);
        var me = this,
            vm = me.getViewModel(),
            cartVm = Ext.ComponentQuery.query('cart')[0].getViewModel(),
            selectedProdsStore = cartVm.getStore('selectedProds'),
            product = vm.get('product'),
            products = vm.getStore('products'),
            findRecordInProds = products.findRecord('MODEL', product.Product[0].MODEL, 0, false, false, true),
            isSelected = selectedProdsStore.findRecord('MODEL', product.Product[0].MODEL, 0, false, false, true) ? true : false,
            mainView = Ext.ComponentQuery.query('app-main')[0];


        console.info(mainView);
        if (target.target.innerText == 'Added') {
            // product.addBtnClass = 'prd-dtl-add-btn';
            // product.addBtnText = 'Add to Cart';
            target.target.innerText = 'Add to Cart';
            target.target.className = 'prd-dtl-add-btn';
            Ext.ComponentQuery.query('cart')[0].fireEvent('removeFromCart', findRecordInProds);
            findRecordInProds.set('addBtnClass', 'dv-prod-btn-deSelected');
            findRecordInProds.set('addBtnText', 'Add to Cart');

            // disable list


        } else {
            // product.addBtnClass = 'prd-dtl-add-btn-pressed';
            // product.addBtnText = 'Added';
            target.target.innerText = 'Added';
            target.target.className = 'prd-dtl-add-btn-pressed';
            Ext.ComponentQuery.query('cart')[0].fireEvent('addToCart', findRecordInProds);
            findRecordInProds.set('addBtnClass', 'dv-prod-btn-selected');
            findRecordInProds.set('addBtnText', 'Added');

        }
        console.info(product);
        console.info(target);
        vm.notify();



        // if (target.target.innerText == "Add to Cart") {
        //     target.target.innerText = "Added";
        //     target.target.className = 'prd-dtl-add-btn-pressed';
        //     Ext.ComponentQuery.query('cart')[0].fireEvent('addToCart', findRecord);

        // } else {
        //     target.target.innerText = "Add to Cart";
        //     target.target.className = 'prd-dtl-add-btn';
        //     Ext.ComponentQuery.query('cart')[0].fireEvent('removeFromCart', findRecord);
        // }

    },

    loadProds: function (obj) {
        console.info('loadProds called');
        var me = this,
            vm = me.getViewModel(),
            prodStore = vm.getStore('products'),
            prodArray = [],
            cartVm = Ext.ComponentQuery.query('cart')[0].getViewModel(),
            selectedProdsStore = cartVm.getStore('selectedProds'),
            prodDv = me.getView(),
            deferred = Ext.create('Ext.Deferred');
        prodDv.setMasked({
            xtype: 'loadmask',
            message: 'Loading'
        });
        console.info(prodDv);
        console.info(cartVm);
        console.info(selectedProdsStore);
        // Clear the prodStore
        prodStore.removeAll();
        me.requestProdByCatId(obj).then(function (res) {
            console.info(res);
            if (res.success) {
                //load AddBtn text / class
                res.prods.forEach(function (e) {
                    if (selectedProdsStore.findRecord('SBITM', e.MODEL, 0, false, false, true)) {
                        console.info(e);
                        console.info(selectedProdsStore.findRecord('SBITM', e.MODEL, 0, false, false, true));
                        Ext.apply(e, {
                            addBtnClass: 'dv-prod-btn-selected',
                            addBtnText: 'Added'
                        });
                    } else {
                        Ext.apply(e, {
                            addBtnClass: 'dv-prod-btn-deSelected',
                            addBtnText: 'Add to Cart'
                        });
                    }

                    //console.info(e);
                    prodArray.push(e);
                });
                // prodStore.loadData(res.prods);
                prodStore.loadData(prodArray);

                // set the search bar text / ban text
                var searchField2 = me.lookupReference('searchField2');
                searchField2.setValue(res.searchText);
                if (!Ext.isEmpty(res.CATDESC)) {
                    vm.set('banText', res.CATDESC);
                }
                console.info(prodStore);
            } else {
                Ext.Msg.alert('Failed to load products', JSON.stringify(res), Ext.emptyFn);
            }
            prodDv.unmask();
            deferred.resolve();
        }, function (res) {
            Ext.Msg.alert('Server Error', JSON.stringify(res), Ext.emptyFn);
            prodDv.unmask();
            deferred.reject();
        });
        return deferred.promise;

    },

    loadDesign: function () {
        var me = this,
            vm = me.getViewModel(),
            designStore = vm.getStore('designs');
        console.info(designStore);
    },
    onSizeChange: function () {
        console.info('onSizeChange called');
        var me = this,
            view = me.getView(),
            cont = view.down('#card-2');
        console.info(cont);
        Ext.Msg.alert('Size changed', 'Size Size Size', Ext.emptyFn);

    },

    requestProdDtl: function (prodModel) {
        console.info('requestProdDtl called');

        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {},
            queryString = window.location.search;
        params = {
            pgm: 'EC1010',
            //sid: queryString.substring(queryString.indexOf("&sid=") + 5, queryString.indexOf("&env=")),
            //app: window.location.search.substring(5, 9),
            action: 'getProdDtl',
            prod: prodModel
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'POST',
            method: 'GET',
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


    requestCat: function (catId) {
        console.info('requestCat called');
        console.info(window.location.search.substring(5, 9));

        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {},
            queryString = window.location.search;
        params = {
            pgm: 'EC1010',
            action: 'getCats',
            //sid: queryString.substring(queryString.indexOf("&sid=") + 5, queryString.indexOf("&env=")),
            //app: window.location.search.substring(5, 9),
            CATID: catId
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'GET',
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

    requestProdByCatId: function (obj) {
        console.info('requestProd called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {},
            queryString = window.location.search;
        params = {
            pgm: 'EC1010',
            action: 'getProds',
            //sid: queryString.substring(queryString.indexOf("&sid=") + 5, queryString.indexOf("&env=")),
            //app: window.location.search.substring(5, 9),
            //cat: catId
        };
        Ext.apply(params, obj);
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            //url: "https://bae007bc-0ff1-418c-b4ce-693fc9ccd76c.mock.pstmn.io/getProds",
            method: 'GET',
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

    onToggleKpi: function (button) {
        if (button.pressed) {
            var view = this.getView();
            view.setActiveState(button.filter);
        }
    },

    updateActiveState: function (activeState) {
        console.log('updateActiveState called');
        console.info(activeState);
        // var refs = this.getReferences();
        // var viewModel = this.getViewModel();

        // refs[activeState].setPressed(true);
        // viewModel.set('kpiCategory', activeState);

        // this.fireEvent('changeroute', this, 'kpi/' + activeState);
    },

    onItemTap: function (dv, index, target, rec, e) {
        console.info('onItemTap called');
        var me = this,
            vm = me.getViewModel(),
            catDataview = me.lookupReference('catDataview'),
            prodDataview = me.lookupReference('prodDataview'),
            designDataview = me.lookupReference('designDataview'),
            catStore = vm.getStore('categories'),
            view = me.getView(),
            searchField2 = me.lookupReference('searchField2');
        //console.log('onItemTap called');
        console.info(dv);
        console.info(index);
        console.info(target);
        console.info(rec);
        console.info(e);
        // when the category has sub category
        console.info(rec.get('cats'));
        console.info(catStore);


        if (false) {
            console.info('has cats');
            console.info(rec.getData());
            var d = rec.getData();
            delete d.cats;
            catStore.loadData(rec.get('cats'), false);

            catDataview.hide();
            catDataview.show();
            // view.getLayout().setAnimation({
            //     type: 'slide',
            //     direction: 'right'
            // });
            vm.set('currentCatParent', vm.get('currentCat'));

            console.info(vm.get('currentCat'));
        } else {
            console.log('has no cats');


            // Load BanText
            //vm.set('banText', rec.get('BANTEXT'));


            // if has not sub cats than load the products
            //me.loadProds(rec.get('CATID'));

            vm.set('currentCatId', rec.get('CATID'));
            vm.set('currentCatDesc', rec.get('CATDESC'));
            //searchField2.reset();
            me.loadProds({ cat: rec.get('CATID') }).then(function () {
                console.info('load products success');
                me.doCardNavigation(1);
            }, function () {
                console.info('load products error');
            });


            //catDataview.hide();
            //designDataview.hide();
            //prodDataview.show();
            //console.info(view.getActiveItem().id);
            //view.setActiveItem(1);
            //console.info(view.getActiveItem());


            //me.doCardNavigation(1);
            //console.info(view.getActiveItem().id);



        }
    },

    onGoToCatPage: function () {
        console.info('onGoToCatPage called');
        var me = this,
            view = me.getView(),
            catDataview = me.lookupReference('catDataview');

        view.setActiveItem(0);


    },
    onGoBack: function () {
        console.info('onGoBack called');
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            currentCard = view.getActiveItem().id,
            catStore = vm.getStore('categories'),
            catDataview = me.lookupReference('catDataview');
        console.info(view.getActiveItem().id);


        console.info(vm.get('currentCatParent'));
        console.info(vm.get('currentCat'));
        //view.setActiveItem('#card-0');
        console.info(view.getActiveItem().id);

        // if in sub cate then go to main cate 
        if (currentCard == 'card-0') {
            catDataview.hide();
            catDataview.show();
        } else {
            if (currentCard == 'card-1') {
                vm.set('banText', 'Products');
            }
            me.doCardNavigation(-1);
        }
        vm.notify();

    },

    doCardNavigation: function (incr) {
        console.info('doCardNavigation called');
        var me = this,
            view = me.getView(),
            currentIdx = view.getActiveItem().id.split('card-')[1],
            next = parseInt(currentIdx, 10) + incr,
            vm = me.getViewModel();

        if (next == 0) {
            vm.set('hideCloseBtn', true);
            vm.set('currentCatId', 'CAT');
        } else {
            vm.set('hideCloseBtn', false);
        }
        console.info(view.getActiveItem());
        console.info(currentIdx);
        console.info(next);
        console.info(view);
        view.setActiveItem(next);
        //console.info(view.getActiveItem().id);

        //layout.setActiveItem(1);
        console.info(view.getActiveItem().id);
        vm.notify();
    },


    onShowDownload: function (target) {
        console.info('onShowDownload called');
        console.info(Ext.os);
        console.info(Ext.browser);
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            cartVm = Ext.ComponentQuery.query('cart')[0].getViewModel(),
            product = vm.get('product'),
            url = product.Downloads[0].URL;

        var link = target.target.getAttribute('data-link');
        //var link = '/Product/testdoc.docx';
        var downloadText = target.target.text;
        console.info(link);
        console.info(downloadText);
        // var overlay = Ext.Viewport.add({
        //     xtype: 'sheet',
        //     //floated: true,
        //     //modal: true,
        //     closable: true,
        //     hideOnMaskTap: true,
        //     animation: 'fadeIn',
        //     // showAnimation: {
        //     //     type: 'popIn',
        //     //     duration: 250,
        //     //     easing: 'ease-out'
        //     // },
        //     // hideAnimation: {
        //     //     type: 'popOut',
        //     //     duration: 250,
        //     //     easing: 'ease-out'
        //     // },
        //     centered: true,
        //     width: '80%',
        //     height: 700,
        //     layout: 'fit',
        //     //styleHtmlContent: true,
        //     // html: '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>',
        //     // header: {
        //     //     title: downloadText
        //     // },

        //     scrollable: true
        // });

        // overlay.show();



        Ext.Viewport.add({
            xtype: 'sheet',
            closable: true,
            hideOnMaskTap: true,
            showAnimation: {
                type: 'pop',
                // duration: 250,
                // easing: 'ease-out'
            },
            centered: true,
            width: '80%',
            height: 700,
            layout: 'fit',
            title: downloadText,
            items: [{
                xtype: 'component',
                cls: 'download-cmp',
                html: '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>',
            }]
        }).show();


        //window.open(link);
        //Ext.Msg.alert('Note', JSON.stringify(Ext.browser), Ext.emptyFn);
        //console.info(Ext.device);




        // var downloadUrl = link;

        // var downloading = browser.downloads.download({
        //     url: downloadUrl,
        //     filename: 'CPR115N.pdf',
        //     conflictAction: 'uniquify'
        // });

        // downloading.then(function (id) {
        //     console.log(`Started downloading: ${id}`);
        // }, function (error) {
        //     console.log(`Download failed: ${error}`);
        // });




    },

    // onStartedDownload: function (id) {
    //     console.log(`Started downloading: ${id}`);
    // },

    // onFailed: function (error) {
    //     console.log(`Download failed: ${error}`);
    // },
    // Mark selected products

    // Search products
    onSearchProds: function () {
        console.info('onSearchProds called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            prodStore = vm.getStore('products'),
            prodArray = [],
            cartVm = Ext.ComponentQuery.query('cart')[0].getViewModel(),
            selectedProdsStore = cartVm.getStore('selectedProds'),
            searchField = me.lookupReference('searchField'),
            searchField2 = me.lookupReference('searchField2'),
            searchString = searchField.getValue(),
            currentCatDesc = vm.get('currentCatDesc'),
            obj = {},
            currentCatId = vm.get('currentCatId'),
            currentIdx = view.getActiveItem().id;
        console.info(searchField.getValue());


        Ext.apply(obj, {
            searchText: searchString,
            cat: 'CAT'
        });


        me.loadProds(obj).then(function () {
            console.info(prodStore);
            if (currentIdx == 'card-0' && prodStore.getCount() > 0) {
                //searchField2.reset();
                me.doCardNavigation(1);
            }
            if (prodStore.getCount() == 0) {
                Ext.Msg.alert('Note', 'No products found', Ext.emptyFn);
            }

        }, function () {
            console.info('load product error');
        });



        //vm.set('banText', 'Search : ' + searchString + ' on ' + currentCatDesc);



        vm.notify();
        console.info(currentIdx);
        //view.getActiveItem().id
    },

    onSearchProds2: function () {
        console.info('onSearchProds2 called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            searchField = me.lookupReference('searchField2'),
            searchString = searchField.getValue(),
            currentCatId = vm.get('currentCatId'),
            obj = {},
            prodStore = vm.getStore('products');
        Ext.apply(obj, {
            searchText: searchString,
            cat: currentCatId
        });
        me.loadProds(obj).then(function () {

        }, function () {
            console.info('load products error');
        });
        //vm.set('banText', 'Search : ' + searchString + ' on ' + currentCatDesc);
        vm.notify();
    },

    requestSearch: function (queryString) {
        console.info('requestSearch called');

        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1010',
            action: 'getSearch',
            query: queryString
        };
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

    onClearIconTap: function (field, input, e) {
        console.info('onClearIconTap called');
        console.info(field);
        console.info(input);
        console.info(e);
        console.info(field.getReference());
        var me = this,
            vm = me.getViewModel(),
            view = me.getView();
        console.info(vm.get('currentCatId'));

        var searchField = me.lookupReference('searchField'),
            searchField2 = me.lookupReference('searchField2');
        searchField.reset();
        searchField2.reset();



        if (field.getReference() == 'searchField2') {
            if (vm.get('currentCatId') == 'CAT') {
                me.doCardNavigation(-1);
                vm.set('banText', 'Products');
            } else {
                me.onSearchProds2();
            }



        } else {
            // do nothing
        }
    },

    onSegBtnToggle: function (container, button, pressed) {
        //alert("User toggled the '" + button.getText() + "' button: " + (pressed ? 'on' : 'off'));
        //console.info('toggle called');
        // console.info(container);
        // console.info(button);
        // console.info(pressed);
        var me = this,
            view = me.getView(),
            catDataview = me.lookupReference('catDataview'),
            designDataview = me.lookupReference('designDataview'),
            prodDataview = me.lookupReference('prodDataview');
        console.info(catDataview);
        console.info(designDataview);
        if (pressed) {
            console.info('toggle called');
            console.info(button);

            // reload category
            if (button.id == 'byCat') {
                me.loadCat();
                catDataview.show();
                designDataview.hide();
                prodDataview.hide();


                // Only show category dataview, hide design dataview 

            } else if (button.id = 'byDesign') {
                //me.loadCat();
                me.loadDesign();
                catDataview.hide();
                designDataview.show();
            }


        }
    }
});
