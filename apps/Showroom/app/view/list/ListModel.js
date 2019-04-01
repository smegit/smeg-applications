Ext.define('Showroom.view.list.ListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.list',

    requires: [
        'Showroom.model.Qoute'
    ],

    stores: {
        qoutes: {
            model: 'Showroom.model.Qoute',
            autoLoad: false,
            data: [
                {
                    referringAgent: 'agent1', name: 'First Last1',
                    address: {
                        address: '1 Pitt Street',
                        suburb: 'Sydney',
                        state: 'NSW',
                        postCode: '2000'
                    },
                    email: '1@qq.com',
                    contactNumber: '0451234567'
                },
                {
                    referringAgent: 'agent2', name: 'First Last2', address: { address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000' }, email: '2@qq.com',
                    contactNumber: '0451234567'
                },
                {
                    referringAgent: 'agent3', name: 'First Last3', address: { address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000' }, email: '3@qq.com',
                    contactNumber: '0451234567'
                },
                {
                    referringAgent: 'agent4', name: 'First Last4', address: { address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000' }, email: '4@qq.com', contactNumber: '0451234567'
                },
                {
                    referringAgent: 'agent1', name: 'First Last5', address: { address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000' }, email: '5@qq.com', contactNumber: '0451234567'
                },
                {
                    referringAgent: 'agent2', name: 'First Last6', address: { address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000' }, email: '6@qq.com', contactNumber: '0451234567'
                },
                {
                    referringAgent: 'agent3', name: 'First Last7', address: { address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000' }, email: '7@qq.com', contactNumber: '0451234567'
                },
                {
                    referringAgent: 'agent4', name: 'First Last8', address: { address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000' }, email: '8@qq.com', contactNumber: '0451234567'
                }

            ]
        }
    }
});