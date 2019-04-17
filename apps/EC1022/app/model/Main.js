Ext.define('EC1022.model.Main', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.Field',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    fields: [
        {
            name: 'VVRRN'
        },
		{
            name: 'A1USRID'
        },
        {
            name: 'A1LOGIN'
        },
        {
            name: 'A1USRSTS'
		},
		{
            name: 'A1CN'
        },
        {
            name: 'A1USRNAM'
        },
        {
            name: 'A1USRCOD'
        },
        {
            name: 'A1USREML'
        }
    ],

    proxy: {
        type: 'ajax',
        extraParams: {
            pgm: 'EC1022',
            action: 'getRecs'
        },
        url: '/valence/vvcall.pgm',
        reader: {
            type: 'json',
            rootProperty: 'recs',
            totalProperty: 'totalCount'
        }
    }
});