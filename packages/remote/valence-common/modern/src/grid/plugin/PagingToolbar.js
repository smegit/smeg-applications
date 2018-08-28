Ext.define('Valence.common.grid.plugin.PagingToolbar', {
    extend : 'Ext.grid.plugin.PagingToolbar',
    alias  : 'plugin.gridremotepagingtoolbar',

    updateGrid : function (grid, oldGrid) {
        var me = this;
        me.callParent(arguments);
        me.unbindHook(grid, 'onScrollBinder', 'checkPageChange');

        if (!Ext.isEmpty(oldGrid)){
            var oldStore = oldGrid.getStore();
            if (!Ext.isEmpty(store)){
                store.un({
                    load: 'onStoreLoad',
                    scope: me
                });
            }
        }
        if (!Ext.isEmpty(grid)){
            var store = grid.getStore();
            if (!Ext.isEmpty(store)){
                store.on({
                    scope : me,
                    load : 'onStoreLoad'
                });
            }
        }
    },

    onStoreLoad : function(){
        var me         = this,
            store      = me.getGrid().getStore(),
            pageSize   = store.getPageSize(),
            totalPages = Math.ceil(store.getTotalCount() / pageSize);

        //set the total pages, page size, current page and total pages
        //
        me.setTotalPages(totalPages);
        me.setPageSize(pageSize);
        me.setCurrentPage(store.currentPage);
        me.updateTotalPages(totalPages);
    },

    onUpdateVisibleCount : function (grid) {
        return;
    },


    onNextPageTap : function () {
        var me          = this,
            grid        = me.getGrid(),
            store       = grid.getStore(),
            currentPage = store.currentPage;
        if (currentPage * store.getPageSize() < store.getTotalCount()) {
            var pageTopRecord = me.getPageTopRecord(currentPage);
            if (grid && !me.preventGridScroll && pageTopRecord) {
                grid.scrollToRecord(pageTopRecord);
            }

            var page = store.currentPage + 1;
            this.setCurrentPage(page);
        }
    },


    onPreviousPageTap : function () {
        var me          = this,
            grid        = me.getGrid(),
            store       = me.getGrid().getStore(),
            currentPage = store.currentPage;
        if (currentPage > 1) {
            var pageTopRecord = me.getPageTopRecord(currentPage);
            if (grid && !me.preventGridScroll && pageTopRecord) {
                grid.scrollToRecord(pageTopRecord);
            }

            var page = store.currentPage - 1;
            me.setCurrentPage(page);
        }
    },


    onPageChange : function (field, page) {
        var me   = this,
            grid = me.getGrid();
        grid.getStore().loadPage(page, {
            scope    : me,
            callback : function (recs) {
                var topRecord = (!Ext.isEmpty(recs)) ? recs[0] : null;
                if (!Ext.isEmpty(topRecord)) {
                    grid.scrollToRecord(topRecord);
                }
                me.setCurrentPage(page);
            }
        });
    },


    updatePageButtons : function () {
        // do nothing
    },

    onTotalCountChange : function (store) {
        this.setTotalCount(store.getCount());
    },

    updateTotalPages : function (totalPages) {
        var me = this;

        // Ensure the references are set
        me.getToolbar();

        me.totalPages.setData({
            totalPages : totalPages
        });

        me.pageSlider.setMaxValue(totalPages || 1);

        me.updatePageInfo(me.getCurrentPage());
    },

    updateCurrentPage : function (currentPage) {
        this.updatePageInfo(currentPage);
    },

    updateTotalCount : function (totalCount) {
        var totalPages;

        if (totalCount !== null && totalCount !== undefined) {
            if (totalCount === 0) {
                totalPages = 1;
            } else {
                totalPages = Math.ceil(totalCount / this.getPageSize());
            }
            this.setTotalPages(totalPages);
        }
    }
});