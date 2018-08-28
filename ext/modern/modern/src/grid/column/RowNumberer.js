/**
 * A special type of Grid {@link Ext.grid.column.Column} that provides automatic
 * row numbering.
 *
 * Usage:
 *
 *     columns: [
 *         {xtype: 'rownumberer'},
 *         ...
 *     ]
 *
 */
Ext.define('Ext.grid.column.RowNumberer', {
    extend: 'Ext.grid.column.Column',
    xtype: 'rownumberer',

    align: 'right',
    ignoreExport: true,

    sortable: false,

    cell: {
        xtype: 'rownumberercell'
    },

    onAdded: function(parent, instanced) {
        var me = this,
            grid;

        me.callParent([parent, instanced]);

        grid = me.grid;

        me.gridListeners = grid.on({
            storechange: 'attachStoreListeners',
            scope: me,
            destroyable: true
        })
        me.attachStoreListeners(grid.getStore());
    },

    onRemoved: function(destroying) {
        Ext.destroy(this.gridListeners, this.storeListeners);
        this.callParent([destroying]);
    },

    checkWidth: function() {
        var store = this.grid.getStore(),
            size = 0;

        if (store) {
            size = String(store.getCount()).length;
        }
        this.setWidth((size + 1) + 'em');
    },

    applyWidth: function(w) {
        return w;
    },

     privates: {
        attachStoreListeners: function(store) {
            Ext.destroy(this.storeListeners);

            if(store) {
                this.storeListeners = store.on({
                    datachanged: 'checkWidth',
                    scope: this,
                    destroyable: true
                });
            }
            this.checkWidth();
        }
     }
});
