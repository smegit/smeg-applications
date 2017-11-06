Ext.define('Valence.common.ux.grid.column.RemoveColumn', {
    extend       : 'Ext.grid.column.Column',
    xtype        : 'removecolumn',
    width        : 40,
    dataIndex    : 'removeColumn',
    removeColumn : true,
    draggable    : false,
    sortable     : false,
    menuDisabled : true,
    renderer     : function () {
        return '<div class ="vvicon-cancel-circle menu-column"></div>';
    }
});