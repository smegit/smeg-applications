Ext.define('Ext.overrides.view.View', {
    override        : 'Ext.view.View',
    emptyTextPlugin : true,
    initComponent   : function () {
        var me        = this,
            emptyText = me.emptyText;

        if (me.emptyTextPlugin) {
            if (!emptyText) {
                me.emptyText = Valence.common.util.Helper.buildEmptyText({
                    heading : Valence.lang.lit.noResults
                });
            } else {
                if (Ext.isObject(emptyText)) {
                    me.emptyText = Valence.common.util.Helper.buildEmptyText(emptyText);
                }
            }

            me.deferEmptyText = false;
            me.on({
                scope  : me,
                render : me.onRenderCommonView
            });
        }

        me.callParent(arguments);

    },

    onClickCommonView : function (e, element) {
        var me    = this,
            el    = Ext.get(e.getTarget()),
            event = el.getAttribute('data-event');

        if (event) {
            me.fireEvent(event, me);
        }
    },

    onRenderCommonView : function () {
        var me = this;
        me.el.mon(me.el, {
            scope    : me,
            delegate : 'div.vv-empty-text-wrap',
            click    : me.onClickCommonView
        });
    }

});