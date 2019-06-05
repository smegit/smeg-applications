Ext.define('Showroom.view.category.Category', {
    extend: 'Ext.Panel',
    xtype: 'category',
    itemId: 'category',
    // title: {
    //     text: 'Category',
    //     //centered: true
    //     style: 'background:red'
    // },
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
        'Ext.mixin.Responsive',
        //'Ext.Button'
        'Ext.field.Search'

    ],
    listeners: {
        //resize: 'onSizeChange'
        goToCatPage: 'onGoToCatPage',
        loadCategory: 'onLoadCategory'
    },
    header: {
        //cls: 'header-cls',
        //height: 50,
        // title: {
        //     //cls: 'header-title-cls',
        //     text: 'Products',
        //     centered: true
        //     //left: '50%'
        // },
        //style: 'background:#5fa2dd'
        titleAlign: 'center',
        titlePosition: 0,
        bind: {
            title: '{banText}'
        },
        items: [
            {
                xtype: 'container',
                cls: 'search-container',
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: 'textfield',
                        id: 'prodSearchField',
                        align: 'left',
                        clearIcon: false,
                        listeners: {
                            action: 'onProdSearch',
                        }
                    },
                    {
                        xtype: 'paneltool',
                        //itemId: 'goBack',
                        margin: '10 5 10 10',
                        type: 'search',
                        handler: 'onProdSearch',
                    },
                    {
                        xtype: 'paneltool',
                        //itemId: 'goBack',
                        margin: '10 10 10 10',
                        align: 'left',
                        type: 'refresh',
                        handler: 'onRefresh',
                    },

                ]
            },

            {
                xtype: 'paneltool',
                type: 'gear',
                handler: 'onChangeShowroom',
                tooltip: 'Change showroom here',
                bind: {
                    hidden: '{!hideCloseBtn || hideGear}'
                }
                //html: 'Switch'
            },


            {
                xtype: 'paneltool',
                //itemId: 'goBack',
                type: 'close',
                handler: 'onGoBack',
                bind: {
                    hidden: '{hideCloseBtn}'
                }
            },
            // {
            //     xtype: 'paneltitle',
            //     //cls: 'header-title-cls',
            //     text: 'Products',
            //     //centered: true
            //     //left: '50%'
            // },
            // {
            //     xtype: 'button',
            //     text: 'test',
            //     cls: 'lefty'
            // }
        ]
    },

    // tools: [
    //     {
    //         //itemId: 'goBack',
    //         type: 'prev',
    //         handler: 'onGoBack',
    //         style: 'left:0'
    //         //hidden: true,
    //     },

    // ],
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

            xtype: 'container',
            //autoScroll: true,
            scrollable: 'y',
            margin: 20,
            items: [
                // {
                //     xtype: 'container',
                //     //inline: true,
                //     layout: 'hbox',
                //     cls: 'category-search-box',
                //     width: '50%',
                //     items: [{
                //         xtype: 'searchfield',
                //         ui: 'solo',
                //         reference: 'searchField',
                //         margin: 'auto',
                //         flex: 1,

                //         placeholder: 'Search the Sencha Forums',
                //         listeners: {
                //             buffer: 500,
                //             //change: 'doSearch'
                //             action: 'onSearchProds',
                //             clearicontap: 'onClearIconTap'
                //         }
                //     },
                //     {
                //         xtype: 'button',
                //         text: 'Search',
                //         handler: 'onSearchProds'
                //     }]
                // },

                // {
                //     xtype: 'searchfield',
                //     ui: 'solo',
                //     width: '30%',
                //     margin: 'auto',

                //     placeholder: 'Search the Sencha Forums',
                //     listeners: {
                //         buffer: 500,
                //         //change: 'doSearch'
                //         action: function (field) {
                //             console.info('start searching');
                //         }
                //     }
                // },


                {
                    xtype: 'dataview',
                    //inline: true,
                    ui: 'default',
                    cls: 'dataview-catalogue-outer',
                    scrollable: false,
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
                }

            ]

            // xtype: 'dataview',
            // inline: true,
            // ui: 'default',
            // cls: 'dataview-catalogue-outer',
            // autoScroll: true,
            // reference: 'catDataview',
            // showAnimation: {
            //     type: 'fade',
            // },
            // //flex: 1,
            // itemTpl: '<div class="dataview-catalogue-inner">' +
            //     '<img draggable="false" src={CATICON} />' +
            //     '<div class="centered">{CATDESC}</div>' +
            //     '</div>',
            // bind: {
            //     store: '{categories}'
            // },
            // listeners: {
            //     itemtap: 'onItemTap'
            // }


        },

        {
            id: 'card-1',

            xtype: 'container',
            //autoScroll: true,
            scrollable: 'y',
            margin: 20,
            items: [
                // {
                //     xtype: 'container',
                //     //inline: true,
                //     layout: 'hbox',
                //     cls: 'category-search-box',
                //     width: '50%',
                //     items: [{
                //         xtype: 'searchfield',
                //         ui: 'solo',
                //         reference: 'searchField2',
                //         margin: 'auto',
                //         flex: 1,

                //         placeholder: 'Search the Sencha Forums',
                //         listeners: {
                //             buffer: 500,
                //             //change: 'doSearch'
                //             action: 'onSearchProds2',
                //             clearicontap: 'onClearIconTap'

                //         }
                //     },
                //     {
                //         xtype: 'button',
                //         text: 'Search',
                //         handler: 'onSearchProds2'
                //     }]
                // },
                {
                    xtype: 'dataview',
                    inline: true,
                    ui: 'default',
                    cls: 'dataview-products-outer',
                    reference: 'prodDataview',
                    emptyText: 'No products found',
                    deferEmptyText: false,
                    itemId: 'prodDv',
                    itemSelector: 'div.dv-prod-card',
                    itemTpl: '<div class="dv-prod-card">' +
                        '<div class="dv-prod-image">' +
                        //'<img draggable="true" onerror="this.src={SMALLPICALT}" src={SMALLPIC} />' +
                        "<img draggable='true' onerror='this.src=\"/Product/Images/missing.png\"' src={SMALLPIC} />" +
                        '</div>' +
                        '<h1">{MODEL}</h1>' +
                        '<p class="dv-prod-price">{formatedPrice}</p>' +
                        '<p class="dv-prod-desc">{PRODDESC}</p>' +
                        //'<p><button class="dv-prod-btn">Add to Cart</button></p>' +
                        '<p><button class="{addBtnClass}">{addBtnText}</button></p>' +
                        '</div>',
                    // {
                    //     showAtl: function (name) {
                    //         console.info('showshow')
                    //         //return Ext.String.ellipsis(name,4,false);
                    //     }
                    // }


                    //hidden: true,
                    selectionModel: {
                        mode: 'MULTI'
                    },
                    listeners: {
                        itemsingletap: 'onProdItemTap',
                        selectionchange: function (dv, nodes) {
                            //console.info('selectionchange called');
                        },
                        beforeshow: 'onBeforeShow',
                        show: function () {
                            console.info('show card-1 called');
                        }

                    },
                    bind: {
                        store: '{products}',
                        //selection: '{selections}'
                    },
                    //selection: '{selections}'

                }

            ],



            // id: 'card-1',
            // xtype: 'dataview',
            // inline: true,
            // ui: 'default',
            // cls: 'dataview-products-outer',
            // reference: 'prodDataview',

            // itemId: 'prodDv',
            // itemSelector: 'div.dv-prod-card',
            // itemTpl: '<div class="dv-prod-card">' +
            //     '<div class="dv-prod-image">' +
            //     //'<img draggable="true" onerror="this.src={SMALLPICALT}" src={SMALLPIC} />' +
            //     "<img draggable='true' onerror='this.src=\"/Product/Images/FAB10HLR_200x200.jpg\"' src={SMALLPIC} />" +
            //     '</div>' +
            //     '<h1">{MODEL}</h1>' +
            //     '<p class="dv-prod-price">{PRICE}</p>' +
            //     '<p class="dv-prod-desc">{PRODDESC}</p>' +
            //     //'<p><button class="dv-prod-btn">Add to Cart</button></p>' +
            //     '<p><button class="{addBtnClass}">{addBtnText}</button></p>' +
            //     '</div>',
            // // {
            // //     showAtl: function (name) {
            // //         console.info('showshow')
            // //         //return Ext.String.ellipsis(name,4,false);
            // //     }
            // // }


            // //hidden: true,
            // selectionModel: {
            //     mode: 'MULTI'
            // },
            // listeners: {
            //     itemtap: 'onProdItemTap',
            //     selectionchange: function (dv, nodes) {
            //         console.info('selectionchange called');
            //     },
            //     beforeshow: 'onBeforeShow',
            //     show: function () {
            //         console.info('show card-1 called');
            //     }

            // },
            // bind: {
            //     store: '{products}',
            //     //selection: '{selections}'
            // },
            // //selection: '{selections}'


        }, {
            id: 'card-2',
            xtype: 'container',
            style: 'background-color: #fff',
            itemSelector: 'div.prd-dtl-wrap',

            listeners: {
                initialize: function (cmp) {
                    console.info('render called');
                    cmp.el.on('click', function (e, target) {
                        e.stopEvent();
                        console.info('click called');
                        console.info(target);
                        var me = this,
                            attr = target.getAttribute('data-event');

                        console.info(attr);
                        if (attr) {
                            cmp.fireEvent(attr, { target: target });
                        }
                    });
                }

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
                '<h1 class="prd-dtl-desc-text">{[values.Product[0].PRODDESC]}</h1>',
                '<h1 class="prd-dtl-model">MODEL: {[values.Product[0].MODEL]}</h1>',
                '<h1 class="prd-dtl-ean">EAN: {[values.Product[0].EAN]}</h1>',
                '<div class="prd-img-wrap">',
                '<img data-event="showlargerimage" src="{[values.Product[0].SMALLPIC]}">',
                '</div>',
                '<h3 class="prd-dtl-feature">Features</h3>',
                '<ul class="prd-dtl-feature-list">',
                '<tpl for="values.Features">',
                '<li>{FEATURE}</li>',
                '</tpl>',
                '</ul>',

                '</div>',



                '<div class=prd-dtl-desc-right>',
                '<div class=prd-dtl-price>',
                //'<h1>${[values.Product[0].PRICE]}</h1>',
                '<h1>',
                '{[this.getFormatedPrice(values.Product[0].PRICE)]}',
                '</h1>',
                '</div>',
                '<div class=prd-dtl-btn>',
                //'<button type="button" class="addBtn" >Add to Cart</button>',
                //'<div class="testbutton" id="renderbutton"></div>',
                '<p><button data-event="addtocartfromdetail" class="{addBtnClass}">{addBtnText}</button></p>' +
                '</div>',


                '<div class="prd-dtl-downloads">',
                '<h1>Downloads</h1>',
                '<div class="prd-files-list">',
                '<ul>',
                '<tpl for="values.Downloads">',
                '<li>',
                //'<span class="{ICONCLASS}" style="color: {ICONCOL}"></span>',
                '<span class="{ICONCLASS}" style="color: {ICONCOL}">&nbsp</span>',
                //'<a href="{URL}" data-event="showdownload" target="_blank" download>{DOWNLDSC}</a>' +
                '<a data-link={URL} data-event="showdownload" target="_blank" style="text-decoration: underline;">{DOWNLDSC}</a>' +
                // '<form method="get" action="/Product/Techspecs/CPRA115N.pdf">',
                // '<button type="submit">Download!</button>',
                // '</form>',
                '</li>',
                '</tpl>',
                '</ul>',
                '</div>',
                '</div>',
                '</div>',



                //'</div>',

                '</div>',
                {
                    getFormatedPrice: function (value) {
                        console.info(value);
                        return Ext.util.Format.usMoney(value);
                    }
                }
            ]
        }, {
            id: 'card-3',
            xtype: 'container',

        }
    ]
});