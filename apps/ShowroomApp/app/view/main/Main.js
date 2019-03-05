/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 *
 * TODO - Replace the content of this view to suit the needs of your application.
 */
Ext.define('ShowroomApp.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',
    //title: 'Category',

    requires: [
        'Ext.MessageBox',

        'ShowroomApp.view.main.MainController',
        'ShowroomApp.view.main.MainModel',
        'ShowroomApp.view.main.List',
        'ShowroomApp.view.product.Product',
        'ShowroomApp.view.product.ProductController',
        'ShowroomApp.view.product.ProductModel',
        'ShowroomApp.view.category.Category'
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




    items: [
        {
            title: 'Home',
            iconCls: 'x-fa fa-home',
            layout: 'fit',
            // The following grid shares a store with the classic version's grid as well!
            items: [{
                //xtype: 'mainlist'
                xtype: 'category'
            }]
        }, {
            title: 'Products',
            iconCls: 'x-fa fa-user',
            // bind: {
            //     html: '{loremIpsum}'
            // }
            items: [{
                xtype: 'product'
            }]
        }, {
            title: 'Groups',
            iconCls: 'x-fa fa-users',
            bind: {
                html: '{loremIpsum}'
            }
        }, {
            title: 'Settings',
            iconCls: 'x-fa fa-cog',
            bind: {
                html: '{loremIpsum}'
            }
        }
    ]
});
