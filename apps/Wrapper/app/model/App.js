Ext.define('Wrapper.model.App', {
    extend : 'Ext.data.Model',
    fields : ['appId', {
        name    : 'name',
        convert : Valence.util.Helper.decodeUTF16
    }],
    proxy  : {
        type        : 'ajax',
        url         : '/valence/vvvport.pgm',
        extraParams : {
            action         : 'getApps',
            overrideFormat : 'list'
        },
        reader      : {
            type         : 'json',
            rootProperty : 'apps'
        }
    }
});