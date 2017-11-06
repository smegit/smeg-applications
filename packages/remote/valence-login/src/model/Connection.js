Ext.define('Valence.login.model.Connection', {
    extend : 'Ext.data.Model',

    requires : [
        'Ext.data.proxy.LocalStorage'
    ],

    fields : [{
        name         : 'desc',
        defaultValue : ''
    }, {
        name         : 'url',
        defaultValue : ''
    }, {
        name         : 'port',
        defaultValue : ''
    }, {
        name         : 'autostartappid',
        defaultValue : ''
    }, {
        name         : 'invalid',
        type         : 'boolean',
        defaultValue : false
    }, {
        name : 'selected',
        type : 'boolean',
        defaultValue : false
    }, {
        name : 'lastLoggedInUser',
        type : 'string',
        defaultValue : ''
    }],
    proxy  : {
        autoLoad : false,
        autoSync : true,
        type     : 'localstorage',
        id       : 'valence-connections'
    }
});
