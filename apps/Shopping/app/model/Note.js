Ext.define('Shopping.model.Note', {
    extend: 'Ext.data.Model',
    fields: ['OFNOTE', 'OFCRTUSER', 'OFCRTDATE', 'OFCRTTIME', 'OFSEQ', 'OFTYPE', 'OFFUPCMP', {
        name: 'dateTime',
        convert: function (v, rec) {
            return Ext.util.Format.date(new Date(rec.get('OFCRTDATE') + ' ' + rec.get('OFCRTTIME')), 'd/m/Y H:i');
        }
    }]
});