Ext.define('Ext.overrides.classic.grid.Panel', {
    override : 'Ext.grid.Panel',

    columnLines       : false,
    headerBorders     : false,
    countInTitle      : true,
    autoFocusFirstRow : false,
    config            : {
        recCount    : 0,
        orgTitle    : null,
        orgHdrTitle : null
    },

    initComponent : function () {
        var me         = this,
            viewConfig = me.viewConfig,
            emptyText, emptyTextPlugin;

        if (Ext.isEmpty(viewConfig)) {
            me.viewConfig = {
                emptyText       : Valence.lang.lit.noResults,
                emptyTextPlugin : false,
                deferEmptyText  : false
            };
        } else {
            emptyTextPlugin = viewConfig.emptyTextPlugin;
            if (emptyTextPlugin) {
                emptyText = viewConfig.emptyText;
                if (Ext.isObject(emptyText)) {
                    viewConfig.emptyText      = Valence.common.util.Helper.buildEmptyText(emptyText);
                    viewConfig.deferEmptyText = false;
                }
            } else {
                viewConfig.emptyTextPlugin = false;
            }
        }

        me.callParent(arguments);

        me.on({
            scope  : me,
            render : me.onRenderBaseGrid
        });
    },

    checkUpdateTitle : function () {
        var me    = this,
            cnt   = me.getStore().getCount(),
            title = me.getOrgTitle() || me.title,
            hdr;

        if (!me.countInTitle){
            return;
        }

        if (!Ext.isEmpty(title)) {
            me.setTitle(title);
            return;
        }

        // Check if original header title has been set
        //
        hdr = me.getHeader();

        title = me.getOrgHdrTitle();
        if (!Ext.isEmpty(title)) {
            hdr.setTitle(cnt > 0 ? Ext.util.Format.format('{0} ({1})', title, cnt) : title);
            return;
        }

        // If title and original header title have not been set check if there is a header and it has a title
        // set original header title if it exists
        //
        if (!Ext.isEmpty(hdr) && Ext.isFunction(hdr.getTitle)) {

            title = hdr.getTitle().text;
            // header was adding a blank space when title is left empty
            //
            if (!Ext.isEmpty(title) && Ext.String.htmlDecode(title).length > 1) {
                me.setOrgHdrTitle(title);
                hdr.setTitle(cnt > 0 ? Ext.util.Format.format('{0} ({1})', title, cnt) : title);
            }

        }
    },

    setStore : function (str) {
        var me = this;
        me.callParent(arguments);

        if (!Ext.isEmpty(str)) {
            str.on({
                scope       : me,
                datachanged : me.onDatachangedGrid
            });
            me.onDatachangedGrid(str);
        }
    },
    setTitle : function (title) {
        var me       = this,
            orgTitle = me.getOrgTitle();

        if (me.countInTitle && title) {
            if (title !== orgTitle) {
                me.setOrgTitle(title);
            }
            if (me.getRecCount() > 0) {
                title = title + ' (' + me.getRecCount() + ')';
            }
        }
        me.callParent(arguments);
    },

    onDatachangedGrid : function (str) {
        var me            = this,
            hasTotalCount = (typeof str.getTotalCount === "function"),
            cnt           = (hasTotalCount) ? str.getTotalCount() : str.getCount(),
            storeCount    = str.getCount();

        if (!Ext.isEmpty(storeCount) && str.isFiltered()){
            cnt = storeCount;
        }

        //auto focus first row
        //
        if (me.autoFocusFirstRow) {
            var appBarFilterField = Ext.ComponentQuery.query('widget_appbar #filterfield')[0],
                filterHasFocus    = (!Ext.isEmpty(appBarFilterField)) ? appBarFilterField.hasFocus : false;

            if (!filterHasFocus) {
                var view = me.getView();
                if (cnt > 0 && view.isVisible()) {
                    setTimeout(function () {
                        rec = str.getAt(0);
                        if (!Ext.isEmpty(rec)) {
                            view.focusRow(rec);
                        }
                    }, 0);
                }
            }
        }

        me.setRecCount(cnt);

        // Check if title has been set
        //
        me.checkUpdateTitle();
    },

    onClickGridPanel : function (e, element) {
        var me    = this,
            el    = Ext.get(e.getTarget()),
            event = el.getAttribute('data-event');

        if (event) {
            me.fireEvent(event, me);
        }
    },

    onRenderBaseGrid : function () {
        var me = this;
        me.el.mon(me.el, {
            scope    : me,
            delegate : 'div.vv-empty-text-wrap',
            click    : me.onClickGridPanel
        });
    }
});