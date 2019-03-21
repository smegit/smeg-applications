Ext.define('Showroom.view.category.Category', {
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
        'Showroom.view.category.CategoryController',
        'Showroom.view.category.CategoryModel',
        //'Showroom.view.category.List',
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
    // header: {
    //     //cls: 'header-cls',
    //     height: 50,
    //     title: {
    //         //cls: 'header-title-cls',
    //         text: 'Products',
    //         centered: true
    //         //left: '50%'
    //     },
    //     style: 'background:#5fa2dd'
    // },
    tools: [{
        //itemId: 'goBack',
        type: 'prev',
        handler: 'onGoBack',
        //hidden: true,
    }],
    // scrollable: 'y',
    // autoScroll: true,
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



    // {

    //     xtype: 'dataview',
    //     inline: true,
    //     ui: 'default',
    //     //cls: 'dataview-catalogue-outer',
    //     autoScroll: true,
    //     reference: 'catDataview',
    //     showAnimation: {
    //         type: 'fade',
    //     },
    //     //flex: 1,
    //     itemTpl: '<div class="dataview-catalogue-inner">' +
    //         '<img draggable="false" src={CATICON} />' +
    //         '<div class="centered">{CATDESC}</div>' +
    //         '</div>',
    //     bind: {
    //         store: '{categories}'
    //     },
    //     listeners: {
    //         itemtap: 'onItemTap'
    //     }
    // },
    items: [
        // {
        //     xtype: 'toolbar',
        //     docked: 'top',
        //     scrollable: {
        //         y: false
        //     },
        //     style: 'background:#5fa2dd',
        //     items: [
        //         {
        //             text: 'Back',
        //             handler: 'onGoBack'
        //         },
        //         {
        //             xtype: 'spacer'
        //         },
        //         {
        //             xtype: 'panel',
        //             //html: 'Product',
        //             title: 'Product',
        //             cls: 'panel-title'
        //         },
        //         {
        //             xtype: 'spacer'
        //         },
        //         // {
        //         //     xtype: 'segmentedbutton',
        //         //     allowDepress: true,
        //         //     items: [
        //         //         {
        //         //             text: 'Option 1',
        //         //             pressed: true
        //         //         },
        //         //         {
        //         //             text: 'Option 2'
        //         //         }
        //         //     ]
        //         // },
        //         // {
        //         //     xtype: 'spacer'
        //         // },
        //         // {
        //         //     text: 'Action',
        //         //     ui: 'action'
        //         // }
        //     ]
        // },
        {
            id: 'card-0',


            xtype: 'dataview',
            inline: true,
            ui: 'default',
            cls: 'dataview-catalogue-outer',
            autoScroll: true,
            reference: 'catDataview',
            showAnimation: {
                type: 'fade',
            },
            //flex: 1,
            itemTpl: '<div class="dataview-catalogue-inner">' +
                '<img draggable="false" src={CATICON} />' +
                '<div class="centered">{CATDESC}</div>' +
                '</div>',
            bind: {
                store: '{categories}'
            },
            listeners: {
                itemtap: 'onItemTap'
            }


        },

        //items: [
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

        // {
        //     xtype: 'dataview',
        //     inline: true,
        //     ui: 'default',
        //     cls: 'dataview-catalogue-outer',
        //     reference: 'designDataview',
        //     showAnimation: {
        //         type: 'fade',
        //     },
        //     itemTpl: '<div class="dataview-catalogue-inner">' +
        //         '<img draggable="false" src="./resources/images/portofino.jpg" />' +
        //         '<div class="centered">{name}</div>' +
        //         '</div>',
        //     hidden: true,
        //     bind: {
        //         store: '{designs}'
        //     },

        // },




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
                //'<p><button class="dv-prod-btn">Add to Cart</button></p>' +
                '<p><button class="{addBtnClass}">{addBtnText}</button></p>' +
                '</div>',
            //hidden: true,
            selectionModel: {
                mode: 'MULTI'
            },
            listeners: {
                itemtap: 'onProdItemTap',
                selectionchange: function (dv, nodes) {
                    console.info('selectionchange called');
                },
                beforeshow: 'onBeforeShow'

            },
            bind: {
                store: '{products}',
                //selection: '{selections}'
            },
            //selection: '{selections}'


        }, {
            id: 'card-2',
            xtype: 'container',
            style: 'background-color: #fff',

            listeners: {
                //resize: 'onSizeChange'
            },
            // plugins: 'responsive',
            // responsiveConfig: {
            //     wide: {
            //         layout: {
            //             type: 'box',
            //             vertical: false
            //         }
            //     },
            //     tall: {
            //         layout: {
            //             type: 'box',
            //             vertical: true,
            //             align: 'stretch'
            //         }
            //     },
            // },

            // items: [{
            //     xtype: '',
            // },
            // {
            //     xtype: 'carousel',
            //     id: 'prod-dtl-image',
            //     title: 'Center',
            //     // height: 100,
            //     //fullscreen: true,
            //     defaults: {
            //         styleHtmlContent: true
            //     },
            //     flex: 1,
            //     border: '1px solid blue',
            //     // html: 'Body Text',
            //     items: [
            //         {
            //             html: 'Item 1',
            //             style: 'background-color: #5E99CC;'
            //         },
            //         {
            //             html: 'Item 2',
            //             style: 'background-color: #759E60'
            //         },
            //         {
            //             html: 'Item 3',
            //             style: 'background-color: #759E60'
            //         }
            //     ]
            // }, {
            //     xtype: 'panel',
            //     id: 'prod-dtl-text',
            //     title: 'Side/Bottom Content',
            //     minWidth: 500
            // }]

            bind: {
                data: '{product}'
            },
            tpl: [
                '<div class="prd-dtl-wrap">',
                //'<div class="prd-dtl-desc">',
                '<div class="prd-dtl-desc-left">',
                '<h1>{[values.Product[0].PRODDESC]}</h1>',
                '<h1>MODEL: {[values.Product[0].MODEL]}</h1>',
                '<h1>EAN: {[values.Product[0].EAN]}</h1>',
                '<div class="prd-img-wrap">',
                '<img data-event="showlargerimage" src="{[values.Product[0].SMALLPIC]}">',
                '</div>',
                '<h3>Features</h3>',
                '<ul>',
                '<tpl for="values.Features">',
                '<li>{FEATURE}</li>',
                '</tpl>',
                '</ul>',

                '</div>',



                '<div class=prd-dtl-desc-right>',
                '<h1>${[values.Product[0].PRICE]}</h1>',
                '<button type="button" >Add to Cart!</button>',

                '<h3>Downloads</h3>',
                '<div class="prd-files-list">',
                '<ul>',
                '<tpl for="values.Downloads">',
                '<li>',
                '<span class="{ICONCLASS}" style="color: {ICONCOL}">&nbsp</span>',
                '<a href="{URL}" target="_blank">{DOWNLDSC}</a>' +
                '</li>',
                '</tpl>',
                '</ul>',
                '</div>',
                '</div>',



                //'</div>',

                '</div>'
            ]
        }
    ]
});