/**
 * Toolbar with full width search field
 */
Ext.define('Valence.common.widget.DockedSearch', {
    extend   : 'Ext.toolbar.Toolbar',
    requires : [
        'Ext.form.field.Text',
        'Valence.common.ux.plugin.form.field.ClearValue'
    ],
    xtype    : 'widget_dockedsearch',
    padding  : 0,
    dock     : 'top',

    config : {
        /**
         * @cfg {Ext.data.Store} store
         * The store to automatically filter
         */
        store             : null,
        /**
         * @cfg {Array} fields
         * The fields to filter on
         */
        fields            : null,
        /**
         * @cfg {Object} searchFieldConfig
         * Config object that will be applied to the search field
         */
        searchFieldConfig : null
    },

    /**
     * @event searchchanged
     * If no store is provided and or fields this event will fire when the search is chagned
     *
     * @param {Valence.common.widget.DockedSearch} this
     * @param {String} value
     * @param {Ext.form.field.Text} search field
     *
     */

    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            items : me.buildItems()
        });

        me.callParent(arguments);
    },

    buildItems : function () {
        var me                = this,
            searchFieldConfig = me.getSearchFieldConfig(),
            item              = {
                xtype       : 'textfield',
                itemId      : 'dockedSearchField',
                emptyText   : Valence.lang.lit.search,
                formItemCls : 'vv-form-item-full-width',
                plugins     : [{
                    ptype : 'formfieldclearvalue'
                }],
                listeners   : {
                    scope  : me,
                    change : {
                        buffer : 300,
                        fn     : me.onChangeSearch
                    }
                }
            };

        if (!Ext.isEmpty(searchFieldConfig)) {
            item = Ext.apply(searchFieldConfig, item);
        }

        return [item];
    },

    getSearchValue : function () {
        var me  = this,
            fld = me.down('#dockedSearchField');

        if (!Ext.isEmpty(fld)) {
            return fld.getValue();
        }
        return '';
    },

    onChangeSearch : function (fld, value) {
        var me     = this,
            store  = me.getStore(),
            fields = me.getFields(),
            grid   = me.up('grid'),
            gridView;

        if (!Ext.isEmpty(grid)) {
            gridView = grid.getView();
        }

        //if store and fields are provided automatically process the input
        //
        if (!Ext.isEmpty(store) && !Ext.isEmpty(fields)) {
            Valence.util.Helper.processTypedInputFilter(store, fields, value, 'dockedsearch');
            if (!Ext.isEmpty(gridView)) {
                gridView.refresh();
            }
        } else {
            //since store and or fields were not provided assume the typed input will
            // be processed manually
            //
            me.fireEvent('searchchanged', me, value, fld);
        }
    }
});