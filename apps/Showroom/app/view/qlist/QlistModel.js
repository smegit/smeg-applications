Ext.define('Showroom.view.qlist.QlistModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.qlist',

    requires: [
        'Showroom.model.Qoute'
    ],

    stores: {
        qoutes: {
            model: 'Showroom.model.Qoute',
            autoLoad: false,
            pageSize: 10,
            listeners: {
                beforesort: 'onBeforeSort'
            }
            //     data: [
            //         {
            //             referringAgent: 'agent1', name: 'First Last1',

            //             address: '1 Pitt Street',
            //             suburb: 'Sydney',
            //             state: 'NSW',
            //             postCode: '2000',
            //             email: '1@qq.com',
            //             contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent2', name: 'First Last2', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '2@qq.com',
            //             contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent3', name: 'First Last3', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '3@qq.com',
            //             contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent4', name: 'First Last4', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '4@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent1', name: 'First Last5', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '5@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             }]
            //         },
            //         {
            //             referringAgent: 'agent2', name: 'First Last6', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '6@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent3', name: 'First Last7', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '7@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent4', name: 'First Last8', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '8@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent1', name: 'First Last1',

            //             address: '1 Pitt Street',
            //             suburb: 'Sydney',
            //             state: 'NSW',
            //             postCode: '2000',
            //             email: '1@qq.com',
            //             contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent2', name: 'First Last2', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '2@qq.com',
            //             contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent3', name: 'First Last3', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '3@qq.com',
            //             contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent4', name: 'First Last4', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '4@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent1', name: 'First Last5', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '5@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             }]
            //         },
            //         {
            //             referringAgent: 'agent2', name: 'First Last6', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '6@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent3', name: 'First Last7', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '7@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent4', name: 'First Last8', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '8@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent1', name: 'First Last1',

            //             address: '1 Pitt Street',
            //             suburb: 'Sydney',
            //             state: 'NSW',
            //             postCode: '2000',
            //             email: '1@qq.com',
            //             contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent2', name: 'First Last2', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '2@qq.com',
            //             contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent3', name: 'First Last3', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '3@qq.com',
            //             contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent4', name: 'First Last4', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '4@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent1', name: 'First Last5', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '5@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'

            //             }]
            //         },
            //         {
            //             referringAgent: 'agent2', name: 'First Last6', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '6@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent3', name: 'First Last7', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '7@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         },
            //         {
            //             referringAgent: 'agent4', name: 'First Last8', address: '1 Pitt Street', suburb: 'Sydney', state: 'NSW', postCode: '2000', email: '8@qq.com', contactNumber: '0451234567',
            //             products: [{
            //                 MODEL: 'CPRA115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,490.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEAR-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPRA315X',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,718.18',
            //                 PRODGROUP: 'F25',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPRA315X_200x200.jpg',
            //                 PRODDESC: '60cm Classic Warming Drawer, 15cm h'
            //             },
            //             {
            //                 MODEL: 'CPR115N',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,690.00',
            //                 PRODGROUP: 'F30',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR115N_200x200.jpg',
            //                 PRODDESC: '15CM WARMING DRAWER-LINEA-BLACK'
            //             },
            //             {
            //                 MODEL: 'CPR615NX',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,163.50',
            //                 PRODGROUP: 'C80',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR615NX_200x200.jpg',
            //                 PRODDESC: '15cm Dolce Stil Novo Warming Drawer - Stainless steel'
            //             },
            //             {
            //                 MODEL: 'CPR915B',
            //                 PRICEOLD: 0,
            //                 PRICE: '$1,900.00',
            //                 PRODGROUP: 'F35',
            //                 QUANTY: 1,
            //                 SMALLPIC: '/Product/Images/CPR915B_200x200.jpg',
            //                 PRODDESC: '15CM WHITE WARMING DRAWER-VICTORIA'
            //             }]
            //         }

            //     ]
        }
    }
});