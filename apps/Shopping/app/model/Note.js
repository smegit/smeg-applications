Ext.define('Shopping.model.Note', {
    extend: 'Ext.data.Model',
    fields: ['OFNOTE', 'OFCRTUSER', 'OFCRTDATE', 'OFCRTTIME', 'OFSEQ', 'OFTYPE', 'OFFUPDET', 'OFFUPACT', 'OFFUPCOD', 'OFCHGDATE', 'OFCHGTIME', 'OFCHGUSER', {
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
                //console.info(v);
                if (v === '0001-01-01')
                    return null;
            }
        }, {
            name: 'OFTYPERENDER',
            convert: function (v, rec) {
                //console.info(rec.get('OFTYPE'));
                var mainVm = Ext.getCmp('app-main').getViewModel(),
                    typeStore = mainVm.getStore('NoteTypeOptions'),
                    index = typeStore.find('NOTETYPEC', rec.get('OFTYPE')),
                    record = typeStore.getAt(index);
                if (record) {
                    return record.get('NOTETYPES');
                }
                // if (rec.get('OFTYPE') == 'O') {
                //     return 'Order';
                // } else if (rec.get('OFTYPE') == 'S') {
                //     return 'Service';
                // } else if (rec.get('OFTYPE') == 'U') {
                //     return 'General';
                // } else if (rec.get('OFTYPE') == 'I') {
                //     return 'Info';
                // }
            }
        }, {
            name: 'createdRender',
            convert: function (v, rec) {
                // var t = rec.get('OFCRTTIME').replace(/\./g, ":");
                return Ext.Date.format(new Date(rec.get('OFCRTDATE') + ' ' + rec.get('OFCRTTIME')), 'j/n/Y H:i');
            },
        }, {
            name: 'updatedRender',
            convert: function (v, rec) {
                if (rec.get('OFCHGDATE') != null && rec.get('OFCHGDATE') != '0001-01-01') {
                    return Ext.Date.format(new Date(rec.get('OFCHGDATE') + ' ' + rec.get('OFCHGTIME')), 'j/n/Y H:i');
                } else {
                    return null;
                }
            }
        }]
});