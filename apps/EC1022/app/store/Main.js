Ext.define('EC1022.store.Main', {
    extend: 'Ext.data.Store',

    requires: [
        'EC1022.model.Main',
        'Ext.util.Sorter'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: true,
            model: 'EC1022.model.Main',
            remoteSort: true,
            storeId: 'Main',
            sorters: {
                direction: 'ASC',
                property: 'A1USRNAM'
            }
        }, cfg)]);
    }
});