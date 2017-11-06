Ext.define('Valence.login.store.Languages', {
    extend   : 'Ext.data.Store',
    requires : [
        'Valence.login.model.Language'
    ],
    storeId  : 'Languages',
    model    : 'Valence.login.model.Language'
});