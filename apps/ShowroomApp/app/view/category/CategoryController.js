Ext.define('ShowroomApp.view.category.CategoryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.category',

    init: function (view) {
        // We provide the updater for the activeState config of our View.
        console.log('init called');
        console.info(view);
        view.updateActiveState = this.updateActiveState.bind(this);
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

        me.loadCat();


    },

    loadCat: function () {
        var me = this,
            vm = me.getViewModel(),
            catStore = vm.getStore('categories');
        me.requestCat().then(function (res) {
            console.info(res);
            if (res.success) {
                catStore.loadData(res.cats);
            } else {
                Ext.Msg.alert('Error', JSON.stringify(res), Ext.emptyFn);
            }
        }, function (res) {
            Ext.Msg.alert('Error', JSON.stringify(res), Ext.emptyFn);
        });
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

    requestCat: function () {
        console.info('requestCat called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1010',
            action: 'getCats',
            //sid: localStorage.getItem('sid'),
            //app: 1014,
            //cat: 'catId'
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
            cateDataview = me.lookupReference('cateDataview'),
            prodDataview = me.lookupReference('prodDataview'),
            designDataview = me.lookupReference('designDataview'),
            cateStore = vm.getStore('categories'),
            view = me.getView();
        //console.log('onItemTap called');
        console.info(dv);
        console.info(index);
        console.info(target);
        console.info(rec);
        console.info(e);
        // when the category has sub category
        console.info(rec.get('cats'));
        console.info(cateStore);
        if (rec.get('cats')) {
            console.info('has cats');
            cateStore.loadData(rec.get('cats'), false);
            cateDataview.hide();
            cateDataview.show();
            // view.getLayout().setAnimation({
            //     type: 'slide',
            //     direction: 'right'
            // });
            console.info(view);
        } else {
            console.log('has no cats');

            // if has not sub cats than load the products
            me.loadProds(rec.get('CATID'));
            cateDataview.hide();
            designDataview.hide();
            prodDataview.show();



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
            cateDataview = me.lookupReference('cateDataview'),
            designDataview = me.lookupReference('designDataview'),
            prodDataview = me.lookupReference('prodDataview');
        console.info(cateDataview);
        console.info(designDataview);
        if (pressed) {
            console.info('toggle called');
            console.info(button);

            // reload category
            if (button.id == 'byCat') {
                me.loadCat();
                cateDataview.show();
                designDataview.hide();
                prodDataview.hide();


                // Only show category dataview, hide design dataview 

            } else if (button.id = 'byDesign') {
                //me.loadCat();
                me.loadDesign();
                cateDataview.hide();
                designDataview.show();
            }


        }
    }
});
