Ext.define('Ext.overrides.classic.grid.feature.Summary', {
    override : 'Ext.grid.feature.Summary',

    onViewRefresh: function(view) {
        var me = this,
            record, row;

        // Only add this listener if in buffered mode, if there are no rows then
        // we won't have anything rendered, so we need to push the row in here
        if (!me.disabled && me.showSummaryRow && view.getStore().isLoaded() && !view.all.getCount()) {
            record = me.createSummaryRecord(view);
            row = Ext.fly(view.getNodeContainer()).createChild({
                tag: 'table',
                cellpadding: 0,
                cellspacing: 0,
                cls: me.summaryItemCls,
                style: 'table-layout: fixed; width: 100%'
            }, false, true);
            row.appendChild(Ext.fly(view.createRowElement(record, -1)).down(me.summaryRowSelector, true));
        }
    }
});

