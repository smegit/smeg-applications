Ext.define('Ext.overrides.classic.grid.column.Column', {
    override        : 'Ext.grid.column.Column',
    //compatability   : '5.1.1',

    sort : function (direction) {
        var me                    = this,
            grid                  = me.up('tablepanel'),
            store                 = grid.store,
            sorter                = me.getSorter(),
            multiSortPluginActive = (!Ext.isEmpty(grid.findPlugin('gridmultisort'))) ? true : false;

        // Maintain backward compatibility.
        // If the grid is NOT configured with multi column sorting, then specify "replace".
        // Only if we are doing multi column sorting do we insert it as one of a multi set.
        // Suspend layouts in case multiple views depend upon this grid's store (eg lockable assemblies)
        Ext.suspendLayouts();
        me.sorting = true;
        if (!multiSortPluginActive) {
            if (sorter) {
                if (direction) {
                    sorter.setDirection(direction);
                }
                store.sort(sorter, grid.multiColumnSort ? 'multi' : 'replace');
            } else {
                store.sort(me.getSortParam(), direction, grid.multiColumnSort ? 'multi' : 'replace');
            }
        } else {
            // Since Multiple Sort Plugin is active we want to maintain the sorters a bit different
            // because we are displaying them. First when a column sort is set if active sorts exist
            // add the new sort to the end not the begining of the sorts.
            //
            var multiSortLimit = (!Ext.isEmpty(store.multiSortLimit)) ? store.multiSortLimit : store.data.getMultiSortLimit(),
                activeSorters  = store.getSorters(),
                property       = me.getSortParam(),
                sorter         = activeSorters.get(property),
                root           = 'data',
                getNewSorters  = function () {
                    var newSorters = [];
                    for (var ii = 0; ii < activeSorters.items.length; ii++) {
                        newSorters.push(activeSorters.items[ii]);
                    }
                    return newSorters;
                },
                newSorters;
            if (sorter) {
                if (direction) {
                    sorter.setDirection(direction);
                } else {
                    sorter.toggle();
                }
                store.setSorters(getNewSorters());
            } else {
                if (Ext.isEmpty(activeSorters) || activeSorters.length === 0) {
                    sorter = new Ext.util.Sorter({
                        direction : direction,
                        property  : property,
                        root      : root
                    });
                    store.setSorters(sorter);
                } else {
                    if (activeSorters.items.length < multiSortLimit){
                        newSorters = getNewSorters();

                        newSorters.push(new Ext.util.Sorter({
                            direction : direction,
                            property  : property,
                            root      : root
                        }));
                        store.setSorters(newSorters);
                    } else {
                        var lit = Valence.lang.lit;
                        try {
                            Valence.common.util.Snackbar.show({
                                text : lit.maximumnSortedColumnsLimited.replace('VAR1', multiSortLimit)
                            });
                        } catch(e){
                            Ext.Msg.show({
                                title   : lit.sort,
                                message : lit.maximumnSortedColumnsLimited.replace('VAR1', multiSortLimit),
                                buttons : Ext.Msg.OK,
                                icon    : Ext.Msg.WARN
                            });
                        }
                    }
                }
            }
        }
        delete me.sorting;
        Ext.resumeLayouts(true);
    },

    // this appears to be broken in 6.0.1...
    //   the call to "this.sort" passes no parameter thus causing the visual on the column
    //   not to change and the "sortchange" event is not always fired...
    //
    toggleSortState : function() {
        var sst = this.sortState;
        if (this.isSortable()) {
            this.sort( (sst) ? (sst === 'ASC') ? 'DESC': 'ASC': '' );
        }
    }

});