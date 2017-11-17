Ext.define('Shopping.model.Note', {
    extend : 'Ext.data.Model',
    fields : ['OFNOTE', 'OFCRTUSER', 'OFCRTDATE', 'OFCRTTIME', 'OFSEQ', 'OFTYPE', {
        name    : 'friendlyDate',
        convert : function (v, rec) {
            return Ext.util.Format.date(Ext.Date.parse(rec.get('OFCRTDATE'), 'Y-m-d'), 'd/m/Y');
        }
    }]
});