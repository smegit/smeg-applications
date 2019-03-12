Ext.define('ShowroomApp.view.category.Category', {
    extend: 'Ext.panel.Panel',
    xtype: 'category',
    itemId: 'category',
    //title: 'Category',

    requires: [
        //'Ext.view.View',
        'Ext.grid.*',
        'ShowroomApp.view.category.CategoryController',
        'ShowroomApp.view.category.CategoryModel',
        //'ShowroomApp.view.category.List',
        'Ext.SegmentedButton',
        'Ext.fx.Animation',
        //'Ext.ux.DataView.Animated '

    ],
    scrollable: 'y',
    controller: 'category',

    config: {
        activeState: null,
        defaultActiveState: 'clicks'
    },

    viewModel: {
        type: 'category'
    },
    //controller: 'category',
    //bind: {
    //store: 'categories',
    //},

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    //layout: 'center',

    items: [
        {
            xtype: 'container',
            //height: 100,
            //centered: true,
            //border: true,
            cls: 'segBtn',
            //height: 50,
            //margin: '10',
            items: [{
                xtype: 'segmentedbutton',
                // listeners: {
                //     click: 'onSegBtnClick',
                // },
                items: [{
                    text: 'By Category',
                    id: 'byCat',
                    pressed: true
                }, {
                    text: 'By Design',
                    id: 'byDesgin'
                }],
                listeners: {
                    toggle: 'onSegBtnToggle'
                }
            }]
        },

        {

            xtype: 'dataview',
            inline: true,
            ui: 'default',
            cls: 'dataview-catalogue-outer',
            reference: 'cateDataview',
            showAnimation: {
                type: 'fade',
            },
            //flex: 1,
            itemTpl: '<div class="dataview-catalogue-inner">' +
                '<img draggable="false" src="./resources/images/DSN.jpg" />' +
                '<div class="centered">{CATDESC}</div>' +
                '</div>',
            bind: {
                store: '{categories}'
            },
            listeners: {
                itemtap: 'onItemTap'
            }
        },
        // {
        //     xtype: 'grid',
        //     title: 'This is title',
        //     height: '400',
        //     bind: {
        //         store: '{categories}',
        //     },
        //     columns: [{
        //         text: 'CatId', dataIndex: 'CATID', width: 200
        //     },
        //     {
        //         text: 'CatDesc', dataIndex: 'CATDESC', width: 200
        //     }]
        // },
        {
            xtype: 'dataview',
            inline: true,
            ui: 'default',
            cls: 'dataview-catalogue-outer',
            reference: 'designDataview',
            showAnimation: {
                type: 'fade',
            },
            itemTpl: '<div class="dataview-catalogue-inner">' +
                '<img draggable="false" src="./resources/images/portofino.jpg" />' +
                '<div class="centered">{name}</div>' +
                '</div>',
            hidden: true,
            bind: {
                store: '{designs}'
            },

        },
        {
            xtype: 'dataview',
            inline: true,
            ui: 'default',
            cls: 'dataview-products-outer',
            reference: 'prodDataview',
            itemTpl: '<div class="dataview-catalogue-inner">' +
                '<img draggable="false" src={SMALLPIC} />' +
                '<div class="centered">{MODEL}</div>' +
                '</div>',
            hidden: true,
            bind: {
                store: '{products}'
            },

        }
    ]
});