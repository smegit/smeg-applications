Ext.define('Wrapper.store.Apps', {
    extend   : 'Ext.data.Store',
    storeId  : 'Apps',
    requires : [
        'Wrapper.model.App'
    ],
    model    : 'Wrapper.model.App'
});