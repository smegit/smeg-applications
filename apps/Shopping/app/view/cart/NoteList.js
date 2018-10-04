// Ext.define('Shopping.view.cart.NoteList', {
//     extend: 'Ext.grid.Panel',
//     xtype: 'notelist',
//     requires: [
//         'Ext.grid.feature.Summary',
//     ],

//     title: 'Notes',
//     ui: 'background',
//     features: [{
//         ftype: 'summary'
//     }],
//     cls: 'cart-list',
//     overCls: 'cart-list-over',
//     viewConfig: {
//         emptyText: 'No Items have been added to this Order'
//     },


//     initComponent: function () {
//         // var me = this,
//         //     vm = me.getViewModel();
//         // console.log('initComponent called' + 'orderKey => ' + vm.get('activeCartNumber'));
//         // console.info(vm);
//         // Ext.apply(me, {
//         //     columns: me.buildColumns()
//         // });
//         // me.callParent(arguments);

//     },

//     columns: {
//         items: [{
//             text: 'Date / Time',
//             dataIndex: 'OFNOTE',
//             align: 'center',
//             width: 150
//         }, {
//             text: 'Note',
//             dataIndex: 'OFNOTE',
//             cellWrap: true,
//             flex: 1,
//             // renderer: function (v) {
//             //     return v.replace(new RegExp('\r?\n', 'g'), '<br/>');
//             // }
//         }, {
//             text: 'By',
//             align: 'center',
//             dataIndex: 'OFNOTE',
//             width: 100
//         }]
//     }


//     // buildColumns: function () {
//     //     var me = this,
//     //         cols = [{
//     //             text: 'Date / Time',
//     //             dataIndex: 'OFNOTE',
//     //             align: 'center',
//     //             width: 150
//     //         }, {
//     //             text: 'Note',
//     //             dataIndex: 'OFNOTE',
//     //             cellWrap: true,
//     //             flex: 1,
//     //             // renderer: function (v) {
//     //             //     return v.replace(new RegExp('\r?\n', 'g'), '<br/>');
//     //             // }
//     //         }, {
//     //             text: 'By',
//     //             align: 'center',
//     //             dataIndex: 'OFNOTE',
//     //             width: 100
//     //         }]
//     // }



// })