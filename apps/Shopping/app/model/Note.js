Ext.define('Shopping.model.Note', {
    extend: 'Ext.data.Model',
    fields: ['OFNOTE', 'OFCRTUSER', 'OFCRTDATE', 'OFCRTTIME', 'OFSEQ', 'OFTYPE', 'OFFUPDET', 'OFFUPACT', {
        name: 'dateTime',
        convert: function (v, rec) {
            return Ext.util.Format.date(new Date(rec.get('OFCRTDATE') + ' ' + rec.get('OFCRTTIME')), 'd/m/Y H:i');
        }
    }, {
            name: 'OFFUPCMP',
            convert: function (v, rec) {
                if (v === "t" || v === true) {
                    return true
                } else if (v === "f" || v === false) {
                    return false
                }
            }
        }]
});