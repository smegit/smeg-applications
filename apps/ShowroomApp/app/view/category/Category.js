Ext.define('ShowroomApp.view.category.Category', {
    extend: 'Ext.Panel',
    xtype: 'category',
    itemId: 'category',
    //title: 'Category',
    //header: 'header',
    //ui: 'blue',
    //fullscreen: true,

    requires: [
        //'Ext.view.View',
        'Ext.grid.*',
        'ShowroomApp.view.category.CategoryController',
        'ShowroomApp.view.category.CategoryModel',
        //'ShowroomApp.view.category.List',
        'Ext.SegmentedButton',
        'Ext.fx.Animation',
        //'Ext.ux.DataView.Animated '
        //'Ext.layout.container.Card'
        'Ext.layout.Card',
        'Ext.form.*',
        //'Ext.field.ComboBox',
        'Ext.plugin.Responsive',
        'Ext.mixin.Responsive'
    ],
    listeners: {
        //resize: 'onSizeChange'
    },
    header: {
        //cls: 'header-cls',
        height: 50,
        title: {
            //cls: 'header-title-cls',
            text: 'Products',
            centered: true
            //left: '50%'
        },
        style: 'background:#5fa2dd'
    },
    tools: [{
        //itemId: 'goBack',
        type: 'prev',
        handler: 'onGoBack',
        //hidden: true,
    }],
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
        type: 'card',
        //align: 'stretch'
    },

    //layout: 'center',

    items: [
        {
            id: 'card-0',
            xtype: 'container',
            //height: 100,
            //centered: true,
            //border: true,
            cls: 'segBtn',
            //height: 50,
            //margin: '10',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            items: [
                //     {
                //     xtype: 'segmentedbutton',
                //     // listeners: {
                //     //     click: 'onSegBtnClick',
                //     // },
                //     items: [{
                //         text: 'By Category',
                //         id: 'byCat',
                //         pressed: true
                //     }, {
                //         text: 'By Design',
                //         id: 'byDesgin'
                //     }],
                //     listeners: {
                //         toggle: 'onSegBtnToggle'
                //     }
                // },
                {

                    xtype: 'dataview',
                    inline: true,
                    ui: 'default',
                    cls: 'dataview-catalogue-outer',
                    reference: 'catDataview',
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

                },]
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
            id: 'card-1',
            xtype: 'dataview',
            inline: true,
            ui: 'default',
            cls: 'dataview-products-outer',
            reference: 'prodDataview',

            itemId: 'prodDv',
            itemSelector: 'div.dv-prod-card',
            itemTpl: '<div class="dv-prod-card">' +
                '<div class="dv-prod-image">' +
                '<img draggable="true"  src={SMALLPIC} />' +
                '</div>' +
                '<h1">{MODEL}</h1>' +
                '<p class="dv-prod-price">{PRICE}</p>' +
                '<p class="dv-prod-desc">{PRODDESC}</p>' +
                '<p><button class="dv-prod-btn">Add to Cart</button></p>' +
                '</div>',

            //hidden: true,
            selectionModel: {
                mode: 'MULTI'
            },
            listeners: {
                itemtap: 'onProdItemTap',
                selectionchange: function (dv, nodes) {
                    console.info('selectionchange called');
                }
            },
            bind: {
                store: '{products}',
                //selection: '{selections}'
            },
            //selection: '{selections}'


        }, {
            id: 'card-2',
            xtype: 'container',
            // defaults: {
            //     xtype: 'panel',
            //     frame: true,
            //     margin: 5,
            //     html: 'Body Text'
            // },
            // layout: {
            //     type: 'box',
            //     align: 'stretch',
            //     vertical: false
            // },
            // listeners: {
            //     beforewidthchange: 'beforeWidthChange'
            // },
            listeners: {
                //resize: 'onSizeChange'
            },
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    layout: {
                        type: 'box',
                        vertical: false
                    }
                },
                tall: {
                    layout: {
                        type: 'box',
                        vertical: true,
                        align: 'stretch'
                    }
                },
            },

            items: [{
                xtype: 'carousel',
                id: 'prod-dtl-image',
                title: 'Center',
                // height: 100,
                //fullscreen: true,
                defaults: {
                    styleHtmlContent: true
                },
                flex: 1,
                border: '1px solid blue',
                html: 'Body Text',
                items: [
                    {
                        html: 'Item 1',
                        style: 'background-color: #5E99CC;'
                    },
                    {
                        html: 'Item 2',
                        style: 'background-color: #759E60'
                    },
                    {
                        html: 'Item 3'
                    }
                ]
            }, {
                xtype: 'panel',
                id: 'prod-dtl-text',
                title: 'Side/Bottom Content',
                minWidth: 400
            }]

        }
    ]
});