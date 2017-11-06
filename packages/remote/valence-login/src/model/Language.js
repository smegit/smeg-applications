Ext.define('Valence.login.model.Language', {
    extend : 'Ext.data.Model',
    fields : [{
        name    : 'VVLNGNAME',
        type    : 'string',
        convert : Valence.util.Helper.decodeUTF16
    }, {
        name : 'VVLNG',
        type : 'string'
    }],
    proxy  : {
        type        : 'ajax',
        url         : '',           // set by "Processor"
        extraParams : {
            action : 'getLanguages'
        },
        reader      : {
            type         : 'json',
            rootProperty : 'VVLNGS'
        }
    }
});