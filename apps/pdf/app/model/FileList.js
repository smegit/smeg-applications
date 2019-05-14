Ext.define('pdf.model.FileList', {
    extend: 'Ext.data.Model',
    fields: [{
        //name: 'date',
        // type: 'date',
        //dateFormat: 'dd/mm/YYYY',
        // convert: function (v) {
        //     console.info(v);
        //     //var d = 
        //     console.info(Ext.Date.format(new Date(v), 'j/n/Y'));
        //     //return Ext.Date.parse(v, 'd/m/Y');
        //     return Ext.Date.format(new Date(v), 'j/n/Y');
        // }
    },
    {
        name: 'timestamp',
        type: 'date',
        //sortType: 'asDate',
        // dateFormat: 'Y-m-d H:i:s',
        // convert: function (v, rec) {
        //     // var t = rec.get('OFCRTTIME').replace(/\./g, ":");
        //     return new Date(rec.get('timestamp'));
        // },

    }
    ],
    reader: {
        type: 'json'
    },
});