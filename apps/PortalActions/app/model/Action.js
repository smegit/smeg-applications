Ext.define('PortalActions.model.Action', {
    extend : 'Ext.data.Model',
    fields : [{
        name : 'desc',
        type : 'string'
    },{
        name : 'action',
        type : 'string'
    },{
        name : 'icon',
        type : 'string'
    },{
        name : 'style',
        type : 'string'
    },{
        name : 'actionType',
        type : 'string',
        defaultValue : ''
    }]
});