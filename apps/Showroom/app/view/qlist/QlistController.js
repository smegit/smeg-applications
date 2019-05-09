Ext.define('Showroom.view.qlist.QlistController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.qlist',


    init: function (view) {
        console.info('initList called');
        console.info(view);


        // get the list of quotes(carts)
        this.control({
            "#ext-slider-1": {
                click: this.onPageChanged

            }
        });

        //console.info(view.getPlugin('qlist_pagingtool'));
        var pagingToolBar = Ext.ComponentQuery.query('pagingtoolbar')[0],
            pagingSlider = Ext.ComponentQuery.query('slider')[0],
            prevBtn = pagingToolBar.getPrevButton(),
            nextBtn = pagingToolBar.getNextButton();


        console.info(prevBtn);
        console.info(pagingSlider);
        prevBtn.on({
            //scope: 
            tap: 'onPageChange'
        });
        nextBtn.on({
            tap: 'onPageChange'
        })
        pagingSlider.on({
            scope: this,
            change: 'onPageChange'
        });

        view.add({
            xtype: 'titlebar',
            docked: 'top',
            title: 'Product Selections',
            items: [
                // {
                //     align: 'left',
                //     text: 'This button has a super long title'
                // },
                {
                    xtype: 'textfield',
                    id: 'cartSearchField',
                    align: 'left',
                    clearIcon: false,
                    listeners: {
                        action: 'onCartSearch',
                    }
                },
                {
                    //xtype: 'button',
                    align: 'left',
                    iconCls: 'x-fa fa-search',
                    handler: 'onCartSearch'
                },
                {
                    //xtype: 'button',
                    align: 'left',
                    iconCls: 'x-fa fa-refresh',
                    handler: 'onCartRefresh'
                    // handler: function (btn, e, opts) {
                    //     var grid = btn.up('grid').down('#quoteList');
                    //     console.info(grid);
                    //     grid.getStore().sorters.clear();
                    //     grid.refresh();
                    // }
                },
            ]
        });


    },

    onCartRefresh: function () {
        console.info('onCartRefresh called');


        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            quotesStore = vm.getStore('qoutes'),
            pagingTool = view.getPlugin('qlist_pagingtool'),
            cartSearchField = view.down('#cartSearchField'),
            cartsGrid = view.down('grid'),
            sorter = quotesStore.getSorters().getAt(0),
            sortedCol = Ext.isEmpty(sorter) ? null : sorter.config.property;


        console.info(cartSearchField);
        console.info(cartsGrid);
        console.info(quotesStore);
        // 


        //qoutesStore.sorters.clear();


        //quotesStore.sort('SADATE', 'DESC');
        //console.info(sorter.config.property);
        // var colIndex = sorter.config.property,
        //     sortedCol = cartsGrid.down('[dataIndex=' + colIndex + ']');

        // console.info(sortedCol);





        //cartsGrid.refresh();
        //view.refresh();
        //cartsGrid.removeCls('x-sorted-asc');
        //console.info(cartsGrid.getColumns().child('#SAOSTS'));

        // remove sort icon from grid
        if (sortedCol) {
            var cols = cartsGrid.getColumns();
            cols.forEach(function (e) {
                console.info(e);
                var el, sortedCls;
                if (e.id == sortedCol) {
                    el = e.element;
                    sortedCls = e.sortedCls;
                    el.removeCls([sortedCls, sortedCls + '-' + 'desc']);
                    el.removeCls([sortedCls, sortedCls + '-' + 'asc']);
                }
            });

        }

        // remove sort from store
        if (cartsGrid.getStore().sorters) {
            cartsGrid.getStore().sorters.clear();
        }

        // reload the carts
        me.onGetQouteList(1, 0, 20);
        pagingTool.setCurrentPage(1);
        cartSearchField.reset();

        // var ordKeyCol = cartsGrid.getColumns()[1],
        //     el = ordKeyCol.element,
        //     sortedCls = ordKeyCol.sortedCls;

        // // ordKeyCol.setSortable(false);
        // // //ordKeyCol.setSortable(true);

        // console.info(ordKeyCol.element);
        // console.info(ordKeyCol.sortedCls);
        // el.removeCls([sortedCls, sortedCls + '-' + 'desc']);
        // el.removeCls([sortedCls, sortedCls + '-' + 'asc']);

        // // console.info(cartsGrid.sortClasses);
        // // cartsGrid.refresh();




    },

    onCartSearch: function (cmp, evt, three) {
        console.info('onCartSearch called');
        console.info(cmp);
        console.info(evt);
        console.info(three);
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            searchField = cmp.up().down('textfield'),
            searchString = searchField.getValue(),
            pagingTool = view.getPlugin('qlist_pagingtool'),
            qoutesStore = vm.getStore('qoutes'),
            sorter = qoutesStore.getSorters().getAt(0),
            sort = [];
        console.info(searchString);
        console.info(sorter);

        if (!Ext.isEmpty(sorter)) {
            // var obj = sorter.config;
            // delete obj.root;
            var obj = {
                direction: sorter.getDirection(),
                property: sorter.getProperty()
            }
            sort.push(obj);

        }
        console.info(sort);


        // reset the paging slider 
        me.onGetQouteList(1, 0, 20, searchString, JSON.stringify(sort));
        pagingTool.setCurrentPage(1);

        console.info(view);
        //view.refresh();

    },

    onPageChange: function () {
        console.info('onPageChanged called');
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            pagingTool = view.getPlugin('qlist_pagingtool'),
            searchField = view.down('textfield'),
            searchString = searchField.getValue(),
            page, start, limit = 20,
            qoutesStore = vm.getStore('qoutes'),
            sorter = qoutesStore.getSorters().getAt(0),
            sort = [];
        console.info(pagingTool);
        console.info(sorter);
        page = pagingTool.getCurrentPage();
        start = (page - 1) * limit;
        if (!Ext.isEmpty(sorter)) {
            // var obj = sorter.config;
            // delete obj.root;

            var obj = {
                direction: sorter.getDirection(),
                property: sorter.getProperty()
            }
            sort.push(obj);

        }

        me.onGetQouteList(page, start, limit, searchString, JSON.stringify(sort));
    },
    requestGetCarts: function (page, start, limit, searchString, sort) {
        console.info('requestGetCarts called');
        console.info(page + start + limit);
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC3050',
            action: 'getCarts',
            page: page,
            start: start,
            limit: limit,
            searchText: searchString,
            sort: sort
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
    requestGetCartDetails: function (orderKey) {
        console.info('requestCartDetails called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC3050',
            action: 'getCartDetails',
            SAORDKEY: orderKey,
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

    onGridSelectionChange: function () {
        console.info('onGridSelectionChange called');
        //return false;

    },

    hasValueObj: function (obj) {
        for (var key in obj) {
            // if (obj[key] != null || obj[key] != '')
            //     return true;
            if (!Ext.isEmpty(obj[key])) return true;
            //console.info();
        }
        return false
    },

    onGridSelect: function (dv, rec) {
        console.info('onGridSelect called');
        console.info(dv);
        console.info(rec);
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            cartView = Ext.ComponentQuery.query('cart')[0],
            cartVm = cartView.getViewModel(),
            selectedProdsStore = cartVm.getStore('selectedProds'),
            tabPanel = Ext.ComponentQuery.query('app-main')[0],
            orderKey = rec.get('SAORDKEY');
        console.info(selectedProdsStore);
        console.info(vm);
        console.info(cartVm);


        console.info(cartView.down('formpanel').getValues());
        console.info(me.hasValueObj(cartView.down('formpanel').getValues()));
        // check if there is cart open 
        if (selectedProdsStore.getCount() > 0 || me.hasValueObj(cartView.down('formpanel').getValues())) {
            // Non empty cart 
        } else {
            // Empty cart

        }


        // Load selects products
        // console.info(rec.get('products'));
        // selectedProdsStore.loadRawData(rec.get('products'), true);
        // console.info(selectedProdsStore);


        me.requestGetCartDetails(orderKey).then(
            function (res) {
                console.info(res);
                cartVm.set('theQoute', res.CartHdr[0]);
                selectedProdsStore.loadRawData(res.CartDtl, true);

                console.info(cartView.down('grid'));
                var qDate = 'Date: ' + Ext.util.Format.date(res.CartHdr[0].SADATE, 'd/m/Y'),
                    oKey = 'Qoute: ' + res.CartHdr[0].SAORDKEY;

                console.info(cartVm.get('titleText'));
                //cartVm.set('titleText', oKey + '  ' + qDate);
                cartView.down('grid').setTitle(oKey + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + qDate);
            },
            function (res) {
                console.info(res);
                console.info('Server Error: loading cart details');
            }
        );


        // Set Active tab 
        console.info(tabPanel);
        tabPanel.setActiveItem(1);
    },

    onGetQouteList: function (page, start, limit, searchString, sort) {
        console.info('onGetQouteList called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            qoutesStore = vm.getStore('qoutes'),
            pagingTool = view.getPlugin('qlist_pagingtool'),
            page = page,
            limit = limit,
            limit = limit,
            searchString = searchString,
            sort = sort;
        console.info(pagingTool);

        if (typeof page != 'number') {
            page = 1
        }
        if (typeof start != 'number') {
            start = 0;
        }
        if (typeof limit != 'number') {
            limit = 20
        }
        if (typeof searchString != 'string') {
            searchString = ''
        }
        if (typeof sort != 'string' || sort == '[]') {
            sort = ''
        }

        me.requestGetCarts(page, start, limit, searchString, sort).then(
            function (res) {
                console.info(res);
                if (res.success) {
                    qoutesStore.loadData(res.Carts, false);
                } else {
                    console.info('loading carts error');
                }
                pagingTool.setTotalCount(res.totalCount);
                // pagingTool.setPageSize(10);
                // pagingTool.setCurrentPage(2);
                pagingTool.setTotalPages(Math.ceil(res.totalCount / limit));
                console.info(pagingTool.getTotalCount());
            },
            function (res) {
                console.info(res);
                console.info('Server error: loading carts');
            }
        );
    },

    onBeforeSort: function () {
        console.info('onBeforeSort called');
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            quotesStore = vm.getStore('qoutes'),
            searchField = view.down('textfield'),
            searchString = searchField.getValue(),
            sorter = quotesStore.getSorters().getAt(0),
            pagingTool = view.getPlugin('qlist_pagingtool'),
            sort = [];
        if (!Ext.isEmpty(sorter)) {
            // var obj = sorter.config;
            // delete obj.root;
            var obj = {
                direction: sorter.getDirection(),
                property: sorter.getProperty()
            }
            sort.push(obj);

        }

        me.onGetQouteList(1, 0, 20, searchString, JSON.stringify(sort));
        pagingTool.setCurrentPage(1);

    }




});