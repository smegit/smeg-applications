/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 *
 * TODO - Replace the content of this view to suit the needs of your application.
 */
Ext.define('Showroom.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',
    //title: 'Category',

    requires: [
        'Ext.MessageBox',

        'Showroom.view.*',
        // 'Showroom.view.main.MainController',
        // 'Showroom.view.main.MainModel',
        //'Showroom.view.cart.Cart',
        // 'Showroom.view.cart.CartController',
        // 'Showroom.view.cart.CartModel',
        //'Showroom.view.category.Category',
        //'Showroom.view.qlist.Qlist',


    ],

    controller: 'main',
    viewModel: 'main',

    defaults: {
        tab: {
            iconAlign: 'top'
        },
        styleHtmlContent: true
    },

    tabBarPosition: 'bottom',



    listeners: {
        activeItemchange: 'onActiveItemChange'
    },

    items: [
        {
            title: 'Products',
            iconCls: 'x-fa fa-home',
            layout: 'fit',
            // The following grid shares a store with the classic version's grid as well!
            items: [{
                //xtype: 'mainlist'
                xtype: 'category'
            }]
        }, {
            title: 'Cart',
            iconCls: 'x-fas fa-shopping-cart',


            // bind: {
            //     html: '{loremIpsum}'
            // }
            items: [{
                xtype: 'cart',
            }]
        },
        {
            title: 'List',
            iconCls: 'x-fas fa-list',
            id: 'QouteList',
            //disabled: true,
            items: [{
                xtype: 'qlist',
            }]
        },
        //{
        //     title: 'Settings',
        //     iconCls: 'x-fa fa-cog',
        //     bind: {
        //         html: '{loremIpsum}'
        //     }
        // }
    ]
});
