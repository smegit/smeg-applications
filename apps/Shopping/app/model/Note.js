Ext.define('Shopping.model.Note', {
    extend : 'Ext.data.Model',
    fields : ['NOTE', 'CRTUSER', 'CRTDATE', 'CRTTIME', 'SEQ', 'TYPE', {
        name    : 'friendlyDate',
        convert : function (v, rec) {
            return Ext.util.Format.date(Ext.Date.parse(rec.get('CRTDATE'), 'Y-m-d'), 'd/m/Y');
        }
    }],
    proxy  : {
        type        : 'ajax',
        url         : '/valence/vvcall.pgm',
        extraParams : {
            pgm    : 'EC1050',
            action : 'getNotes'
        },
        reader      : {
            type         : 'json',
            rootProperty : 'notes'
        }
    }
});