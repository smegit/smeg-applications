/**
 * This view is an example list of people.
 */
Ext.define('OrderMaint.view.main.List', {
    // extend: 'Ext.grid.Panel',
    // xtype: 'mainlist',

    // requires: [
    //     'OrderMaint.store.Personnel'
    // ],

    // title: 'Personnel',

    // store: {
    //     type: 'personnel'
    // },

    // layout: 'fit',
    // columns: [
    //     { text: 'Name', dataIndex: 'name' },
    //     { text: 'Email', dataIndex: 'email', flex: 1 },
    //     { text: 'Phone', dataIndex: 'phone', flex: 1 }
    // ],

    // listeners: {
    //     select: 'onItemSelected'
    // }

    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.Panel',
        'Ext.grid.View',
        'Ext.form.field.Trigger',
        'Ext.toolbar.Fill',
        'Ext.button.Button',
        'Ext.toolbar.Paging',
        'Ext.grid.column.Column'
    ],
    xtype: 'orderlist',
    itemId: 'ordergrid',
    cls: 'orderlist-panel',

    //title: 'Orders',
    scroable: true,
    frame: true,

    bind: {
        store: '{orderList}'
    },
    dockedItems: [

        {
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            itemId: 'pagingtoolbar',
            inputItemWidth: 50,
            displayInfo: true,
            //store: 'Main'
            bind: {
                store: '{orderList}'
            },
        }
    ],
    //layout: 'fit',

    height: 800,

    columns: [
        {
            text: 'Date',
            dataIndex: 'OAMNTD',
            flex: 0,
            width: 100,
            renderer: function (v) {
                if (!Ext.isEmpty(v)) {
                    return Ext.util.Format.date(Ext.Date.parse(v, 'Y-m-d'), 'd-m-Y');
                }
                return '';
            }
        }, {
            text: 'Time',
            dataIndex: 'OAMNTT',
            flex: 0,
            align: 'center',
            width: 60,
            renderer: function (v) {
                if (!Ext.isEmpty(v)) {
                    return Ext.util.Format.date(Ext.Date.parse(v, 'H:i:s'), 'H:i');
                }
                return '';
            }
        }, {
            text: 'Order #',
            dataIndex: 'OAORDKEY',
            flex: 0,
            width: 90
        }, {
            text: 'Name',
            cellWrap: true,
            flex: 1,
            dataIndex: 'OACSTNAM'
        }, {
            text: 'Reference',
            cellWrap: true,
            dataIndex: 'OACSTREF'
        }, {
            text: 'Rep Code',
            cellWrap: true,
            dataIndex: 'OAREP',
            flex: 1
        }, {
            text: 'Status',
            align: 'center',
            dataIndex: 'OAOSTS',
            flex: 0,
            width: 60
        },
    ],

});
