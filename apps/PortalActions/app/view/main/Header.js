Ext.define('PortalActions.view.main.Header', {
    extend     : 'Ext.Container',
    xtype      : 'header',
    initialize : function () {
        var me = this;

        me.setHtml('<div class="headerText">' + Valence.lang.lit.examplePortalActionsNativeMobile + '</div>');
        me.callParent(arguments);
    }
});