Ext.define('Valence.login.store.Connections', {
    extend   : 'Ext.data.Store',
    requires : [
        'Valence.login.model.Connection'
    ],
    storeId  : 'Connections',
    model    : 'Valence.login.model.Connection'
});
