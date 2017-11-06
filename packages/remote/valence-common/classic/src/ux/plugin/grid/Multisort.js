Ext.define('Valence.common.ux.plugin.grid.Multisort', {
    extend   : 'Ext.plugin.Abstract',
    requires : [
        'Ext.ux.BoxReorderer'
    ],
    alias    : 'plugin.gridmultisort',
    config   : {
        /**
         * @cfg {Array} additionalItems they will be automatically set with reorderable : false if not already set.
         * They will be automatically right aligned.
         */
        additionalItems      : [],
        boundCmp             : null,
        dock                 : 'bottom',
        height               : 39,
        hideWhenEmpty        : true,
        useColumnDescription : true,
        ui                   : 'default',
        cls                  : null,
        removeSingleSort     : false
    },
    init     : function (grid) {
        var me              = this,
            cls             = 'p-multisort-bar',
            additionalItems = me.getAdditionalItems(),
            hideWhenEmpty   = me.getHideWhenEmpty(),
            items           = [{
                xtype       : 'tbtext',
                itemId      : 'sortText',
                text        : Valence.lang.lit.sort,
                reorderable : false,
                hidden      : !hideWhenEmpty,
                margin      : 0
            }], bar;

        //check for additional items and if passed make sure they
        // have reorderable : false set
        //
        if (additionalItems.length > 0) {
            items.push({
                xtype       : 'tbfill',
                reorderable : false
            });

            //add additional items
            for (var ii = 0; ii < additionalItems.length; ii++) {
                items.push(Ext.apply(additionalItems[ii], {
                    reorderable : false
                }));
            }
        }

        grid.multiColumnSort = true;

        if (me.getCls()) {
            cls += ' ' + me.getCls();
        }

        bar = grid.addDocked({
            xtype     : 'toolbar',
            ui        : me.getUi(),
            style     : {
                opacity : (hideWhenEmpty) ? 0 : 1
            },
            hidden    : hideWhenEmpty,
            dock      : me.getDock(),
            height    : me.getHeight(),
            itemId    : 'multisort_bar',
            cls       : cls,
            defaults  : {
                reorderable : true
            },
            plugins   : Ext.create('Ext.ux.BoxReorderer', {
                listeners : {
                    scope : me,
                    drop  : me.onDropItem
                }
            }),
            items     : items,
            listeners : {
                scope : me,
                el    : {
                    scope    : me,
                    delegate : 'div.p-multisort-item',
                    click    : me.onClickBarItem
                }
            }
        });

        grid.on({
            scope      : me,
            sortchange : me.onSortChangeGrid
        });
        me.setBoundCmp(grid);
        setTimeout(function(){
            me.onSortChangeGrid();
        },750);
    },

    onClickBarItem : function (e, element) {
        var me     = this,
            cmp    = Ext.getCmp(element.id),
            target = Ext.get(e.getTarget());

        if (target.hasCls('multisort-remove')) {
            cmp.el.fadeOut({
                callback : function () {
                    cmp.destroy();
                    me.onDropItem();
                }
            });
        } else {
            //change the sort direction
            //
            var grid          = me.getBoundCmp(),
                store         = grid.getStore(),
                sorters       = store.getSorters(),
                getNewSorters = function () {
                    var newSorters = [];
                    for (var ii = 0; ii < sorters.items.length; ii++) {
                        newSorters.push(sorters.items[ii]);
                    }
                    return newSorters;
                },
                colSort;

            if (!Ext.isEmpty(cmp) && !Ext.isEmpty(cmp.property)) {
                colSort = sorters.get(cmp.property)

                if (!Ext.isEmpty(colSort)) {
                    colSort.toggle();
                    store.setSorters(getNewSorters());
                }
            }
        }
    },

    onClickRemove : function (e, element) {
        var me      = this,
            el      = Ext.get(element),
            cmpElId = el.up('div.p-multisort-item').id,
            cmp     = Ext.getCmp(cmpElId);

        cmp.el.fadeOut({
            callback : function () {
                cmp.destroy();
                me.onDropItem();
                me.onSortChangeGrid();
            }
        });
    },

    onDropItem : function () {
        var me      = this,
            grid    = me.getBoundCmp(),
            str     = grid.getStore(),
            bar     = grid.down('#multisort_bar'),
            cmps    = bar.query('[removable]'),
            sorters = [];

        //for some reason if not wrapped in a timeout we were getting an error in the box reorderer.
        //
        setTimeout(function(){
            for (var ii = 0; ii < cmps.length; ii++) {
                sorters.push({
                    property  : cmps[ii].property,
                    direction : cmps[ii].direction
                });
            }

            str.sort(sorters);

            if (Ext.isEmpty(sorters)){
                if (!Ext.isEmpty(grid)){
                    grid.getView().refresh();
                }
                if (!Ext.isEmpty(str.reload) && typeof str.reload === 'function'){
                    str.reload();
                }
            }

            me.onSortChangeGrid();

            //fire drop event
            //
            grid.fireEvent('multisortdropitem', grid, me);
        },0);
    },

    onSortChangeGrid : function () {
        var me            = this,
            grid          = me.getBoundCmp(),
            str           = grid.getStore(),
            sorters       = str.getSorters(),
            bar           = grid.down('#multisort_bar'),
            fm            = Ext.util.Format,
            markup        = '<b>{0}</b> {1}<div class="multisort-remove vvicon-cancel-circle"></div>',
            markup2       = '<b>{0}</b> {1}',
            hideWhenEmpty = me.getHideWhenEmpty(),
            sorter, cmps, text, index, col;

        cmps = (bar) ? bar.query('[removable]') : [];
        Ext.suspendLayouts();
        for (var ii = 0; ii < cmps.length; ii++) {
            cmps[ii].destroy();
        }
        cmps.length = 0;
        for (var ii = 0; ii < sorters.items.length; ii++) {
            sorter = sorters.items[ii];
            if (me.getUseColumnDescription()) {
                index = grid.headerCt.items.findIndex('dataIndex', sorter.getProperty());
                if (index !== -1) {
                    col  = grid.headerCt.items.getAt(index);
                    text = col.text || col.header || fm.uppercase(sorter.getProperty());
                }
            } else {
                text = fm.uppercase(sorter.getProperty());
            }
            cmps.push({
                xtype     : 'component',
                cls       : 'p-multisort-item',
                margin    : '0 5 0 0',
                html      : Ext.String.format((ii === 0 && !me.removeSingleSort) ? markup2 : markup, text, fm.lowercase(sorter.getDirection())),
                removable : true,
                property  : sorter.getProperty(),
                direction : sorter.getDirection()
            });
        }

        bar.insert(1, cmps);
        if (sorters.items.length > 0) {
            bar.show();
            bar.el.fadeIn();
            if (!hideWhenEmpty) {
                bar.down('#sortText').show();
            }
        } else if (hideWhenEmpty) {
            if (!Ext.isEmpty(bar.el)){
                bar.el.fadeOut({
                    callback : function () {
                        bar.hide();
                    }
                });
            }
        }
        Ext.resumeLayouts(true);
    }
});