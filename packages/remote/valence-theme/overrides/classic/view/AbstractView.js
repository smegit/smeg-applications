Ext.define('Ext.overrides.view.AbstractView', {
    override : 'Ext.view.AbstractView',

    addEmptyText : function () {
        var me    = this,
            store = me.getStore(),
            view  = me.up('grid'),
            emptyText = me.emptyText,
            parentGrid,
            locked,
            dom;

        if (Ext.isDefined(me.emptyTextPlugin) && !me.emptyTextPlugin) {
            return;
        }

        // get the correct dom to place emptyText over grid including headers and columns
        //

        if (Ext.isEmpty(view)) {
            dom = me.getTargetEl().dom;
        } else if (/grid/.test(me.getXTypes())){
            // check for locked grid
            //
            locked = view.hasCls('x-grid-inner-locked');
            if (locked) {
                // if exists do not create empty text because locked columns
                // technically create two grids
                //
                return;
            } else {
                // if not locked checked to be sure grid is not nested inside another grid
                parentGrid = view.up('grid');
                if (!Ext.isEmpty(parentGrid)) {
                    // if there is a parent, replace view with parent and then recreate the emptyText
                    // bc the nested grids will have the default emptytext
                    view = parentGrid;
                    emptyText = view.emptyText;
                    emptyText = Valence.common.util.Helper.buildEmptyText(Ext.isObject(emptyText) ? emptyText : {heading : Valence.lang.lit.noResults});
                }
            }
            dom = view.getEl().dom;
        }

        if (!Ext.isEmpty(emptyText) && dom && !store.isLoading() && (!me.deferEmptyText || me.refreshCounter > 1 || store.isLoaded())) {
            me.emptyEl = Ext.core.DomHelper.insertHtml('beforeEnd', dom, emptyText);
        }
    }
});