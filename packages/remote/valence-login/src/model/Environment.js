Ext.define('Valence.login.model.Environment', {
    extend : 'Ext.data.Model',
    fields : ['envId', 'current',{
        name    : 'envName',
        convert : Valence.util.Helper.decodeUTF16
    }],
    proxy  : {
        type   : 'memory',
        reader : {
            type : 'json'
        }
    }
});