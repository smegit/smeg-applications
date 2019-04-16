Ext.define('PortalActions.view.main.ActionList',{
    extend : 'Ext.List',
    xtype : 'actionlist',
    disableSelection : true,

    scrollable       : true,
    height           : 'auto',
    itemTpl          : [
        '<div class="{icon} valence-menu-list-action-icon"></div><div class="valence-menu-list-action-item">{desc}</div>'
    ],
    store     : 'Actions',
    listeners : {
        itemtap : 'onItemTapList'
    }
});
