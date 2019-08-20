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
            // rootProperty: 'recs',
            totalProperty: 'totalCount',
            rootProperty: function (data) {
                console.info(data);
                // var agencyStore = Ext.data.StoreManager.lookup('Agency');
                // console.info(data.agent);
                // agencyStore.loadData(data.agent);
                // console.info(agencyStore);
                var agCombo = Ext.ComponentQuery.query('#smegAgency')[0],
                    agentArray = data.agent;

                if (Array.isArray(agentArray) && agentArray.length == 1) {
                    agentName = data.agent[0].AGENTNAME;
                    agentNo = data.agent[0].AGENTNO;
                } else {
                    agentName = null;
                    agentNo = null;
                }

                agCombo.setValue(agentName);
                agCombo.agentNo = agentNo;
                console.info(agCombo);

                // console.info(agCombo.getStore());

                //console.info(agencyStore.getAt(0).getData().AGENTNAME);

                return data.recs;
            }
        },
        listeners: {
            'metachange': function (store, meta) {
                console.info('metachange called');
                // myGrid.reconfigure(store, meta.columns);
                console.info(store);
            }
        }
    }
});