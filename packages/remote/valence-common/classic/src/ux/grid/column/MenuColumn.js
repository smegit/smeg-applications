Ext.define('Valence.common.ux.grid.column.MenuColumn', {
    extend       : 'Ext.grid.column.Column',
    xtype        : 'menucolumn',
    width        : 40,
    dataIndex    : 'menuColumn',
    showMenu     : true,
    draggable    : false,
    sortable     : false,
    menuDisabled : true,
    renderer     : function () {
        return '<div class ="vvicon-more2 menu-column"></div>';
    }
});