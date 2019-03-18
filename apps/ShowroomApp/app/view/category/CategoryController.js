Ext.define('ShowroomApp.view.category.CategoryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.category',

    init: function (view) {
        // We provide the updater for the activeState config of our View.
        console.log('init called');
        console.info(view);
        view.updateActiveState = this.updateActiveState.bind(this);
        var me = this;

        // me.control({
        //     'category dataview': {
        //         addtocart: me.onAddToCart,
        //         //itemTap: me.onAddToCart
        //     }
        // });
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

        //me.loadCat('CAT');
        me.loadCat();


    },

    onProdItemTap: function (dv, index, target, rec, e) {
        console.info(dv);
        console.info(index);
        console.info(target);
        console.info(rec);
        console.info(e);
        var me = this,
            prodModel = rec.get('MODEL'),
            vm = me.getViewModel(),
            selectedProdsStore = vm.getStore('selectedProds');
        console.info(prodModel);
        if (e.target.localName === 'button') {
            if (e.target.innerText == 'Add to Cart') {
                e.target.innerText = 'Added'
                e.target.className = 'dv-prod-btn-selected';

                // Add product to the selection store
                console.info(selectedProdsStore);
                console.info(vm);

                // fire event 
                console.info(Ext.ComponentQuery.query('cart')[0].fireEvent('addToCart', rec));


            } else {
                e.target.innerText = 'Add to Cart';
                e.target.className = 'dv-prod-btn-deSelected';

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

                    } else {
                        Ext.Msg.alert('Failed to get product info', JSON.stringify(res), Ext.emptyFn);

                    }
                }, function (res) {
                    Ext.Msg.alert('Server Error', JSON.stringify(res), Ext.emptyFn);
                });



            me.doCardNavigation(1);
        }

    },
    loadCat: function (catId) {
        var me = this,
            vm = me.getViewModel(),
            catStore = vm.getStore('categories');
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
                Ext.Msg.alert('Error', JSON.stringify(res), Ext.emptyFn);
            }
        }, function (res) {
            Ext.Msg.alert('Error', JSON.stringify(res), Ext.emptyFn);
        });
    },


    onAddToCart: function () {
        console.info('onAddToCart called');
    },

    loadProds: function (id) {
        var me = this,
            vm = me.getViewModel(),
            prodStore = vm.getStore('products');
        me.requestProdByCatId(id).then(function (res) {
            console.info(res);
            if (res.success) {
                prodStore.loadData(res.prods);
            } else {
                Ext.Msg.alert('Failed to load products', JSON.stringify(res), Ext.emptyFn);
            }
        }, function (res) {
            Ext.Msg.alert('Server Error', JSON.stringify(res), Ext.emptyFn);
        });
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
            params = {};
        params = {
            pgm: 'EC1010',
            action: 'getProdDtl',
            prod: prodModel
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


    requestCat: function (catId) {
        console.info('requestCat called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1010',
            action: 'getCats',
            //sid: localStorage.getItem('sid'),
            //app: 1014,
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

    requestProdByCatId: function (catId) {
        console.info('requestProd called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1010',
            action: 'getProds',
            cat: catId
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
            view = me.getView();
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


            // if has not sub cats than load the products
            me.loadProds(rec.get('CATID'));
            //catDataview.hide();
            //designDataview.hide();
            //prodDataview.show();
            console.info(view.getActiveItem().id);
            //view.setActiveItem(1);
            //console.info(view.getActiveItem());

            me.doCardNavigation(1);
            console.info(view.getActiveItem().id);



        }
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
            me.doCardNavigation(-1);
        }

    },

    doCardNavigation: function (incr) {
        var me = this,
            view = me.getView(),
            currentIdx = view.getActiveItem().id.split('card-')[1],
            next = parseInt(currentIdx, 10) + incr;
        //console.info(view.getActiveItem());
        console.info(currentIdx);
        console.info(next);
        console.info(view);
        view.setActiveItem(next);
        console.info(view.getActiveItem().id);

        //layout.setActiveItem(1);
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