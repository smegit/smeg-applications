Ext.define('EC1022.view.ContextMenu', {
    extend: 'Ext.menu.Menu',

    requires: [
        'Ext.menu.Item'
    ],

    itemId: 'contextmenu',
    width: 120,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'menuitem',
                    itemId: 'contextmenuedit',
                    text: 'Edit',
                    hideOnClick: false
                },
                {
                    xtype: 'menuitem',
                    itemId: 'contextmenucopy',
                    text: 'Copy',
                    hideOnClick: false
                }
            ]
        });

        me.callParent(arguments);
    }

});