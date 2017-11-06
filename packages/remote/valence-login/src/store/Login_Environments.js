Ext.define('Valence.login.store.Login_Environments', {
    extend   : 'Ext.data.Store',
    requires : [
        'Valence.login.model.Environment'
    ],
    storeId  : 'Login_Environments',
    model    : 'Valence.login.model.Environment'
});