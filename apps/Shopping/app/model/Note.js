Ext.define('Shopping.model.Note', {
    extend: 'Ext.data.Model',
    fields: ['OFNOTE', 'OFCRTUSER', 'OFCRTDATE', 'OFCRTTIME', 'OFSEQ', 'OFTYPE', 'OFFUPDET', 'OFFUPACT', {
        name: 'dateTime',
        convert: function (v, rec) {
            //console.info(rec);
            return new Date(rec.get('OFCRTDATE') + ' ' + rec.get('OFCRTTIME'));

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
        }, {
            name: 'OFFUPDAT',
            convert: function (v, rec) {
                console.info(v);
                if (v === '0001-01-01')
                    return null;
            }
        }]
});