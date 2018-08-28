Ext.define('Valence.device.Contacts', {
    singleton : true,

    pick : function (config) {
        Ext.apply(config, {
            requestId  : 'contacts',
            method     : 'pickContact',
            responseId : 'selectedContact'
        });
        Valence.device.Access.initiate(config);
    }
});