Ext.define('Shopping.view.products.Heading', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'Valence.common.ux.plugin.form.field.ClearValue'
    ],
    xtype: 'heading',
    ui: 'primary-dark',
    layout: {
        type: 'hbox'
    },
    // listeners: {
    //     action: function () {
    //         console.info('onSearchAction called');
    //     }
    // },
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: me.buildItems()
        });
        me.callParent(arguments);
    },

    buildItems: function () {
        console.info(this);
        var me = this,
            agencyStore = Ext.data.StoreManager.lookup('Agency');
        console.info(agencyStore.getCount());
        return [
            // {
            //     xtype: 'combo',
            //     cls: 'fld-in-header',
            //     queryMode: 'local',
            //     width: 305,
            //     labelWidth: 95,
            //     height: 32,
            //     editable: false,
            //     valueField: 'STKCOD',
            //     displayField: 'STKDSC',
            //     reference: 'stocklocs',
            //     fieldLabel: 'Stock Location',
            //     forceSelection: true,
            //     listeners: {
            //         select: 'onSelectStockLocation',
            //         change: 'onChangeStockLocation'
            //     },
            //     bind: {
            //         store: '{StockLocations}',
            //         value: '{currentStockLoc}'
            //         //value: '{STKLOC}'
            //     }
            // },
            {
                xtype: 'tbfill'
            },
            {
                xtype: 'component',
                html: 'Shopping',
                style: {
                    'font-size': '18px',
                    'color': 'white',
                    'font-weight': 'bolder'
                }
            },
            { xtype: 'tbfill' },

            {
                xtype: 'textfield',
                cls: 'fld-in-header',
                reference: 'searchField',
                itemId: 'search',
                id: 'searchFieldId',
                width: 200,
                height: 32,
                emptyText: 'SEARCH PRODUCTS',
                margin: '0 8 0 0',
                enableKeyEvents: true,
                plugins: [{
                    ptype: 'formfieldclearvalue'
                }],
                listeners: {
                    clear: 'onClearSearch',
                    keyup: {
                        buffer: 1000,
                        fn: 'onKeyupSearch'
                    },
                    // action: {
                    //     fn: function () {
                    //         console.info('onSearchAction called');
                    //     }
                    // },

                }
            },
            {
                xtype: 'combo',
                //cls: 'smeg-agency-sel',
                height: 32,
                width: 300,
                itemId: 'smegAgencySelector',
                store: Ext.data.StoreManager.lookup('Agency'),
                bind: {
                    value: '{agent}'
                },
                grow: true,
                hideLabel: true,
                valueField: 'ACCOUNT',
                displayField: 'NAME',
                queryMode: 'local',
                allowBlank: false,
                forceSelection: true,
                anyMatch: true,
                caseSensitive: false,
                readOnly: (agencyStore.getCount() === 1) ? true : false,
                hidden: (agencyStore.getCount() === 0) ? true : false,
                // value: me.activeAgent,
                listConfig: {
                    cls: 'smeg-agency-sel-list'
                },
                // beforeQuery: function (plan) {
                //     //overriding the query plan so we can filter agents by words entered
                //     //
                //     var originalQuery = plan.query;
                //     if (!Ext.isEmpty(originalQuery)) {
                //         var items = Ext.Array.clean(originalQuery.split(' '));
                //         plan.query = new RegExp('(?=.*' + items.join(')(?=.*') + ')', 'gi');
                //         // plan.query = new RegExp('(.*' + items.join(')(.*') + ')', 'gi');
                //     }
                //     return plan;
                // },
                listeners: {
                    afterrender: 'onAfterRenderAgencySel',
                    focus: function (cmp, evt) {
                        console.info('focus called');
                        cmp.selectText();
                    },
                    // scope: me,
                    afterrender: function (cmp) {
                        cmp.agentTip = Ext.create('Ext.tip.ToolTip', {
                            showDelay: 800,
                            target: cmp.el,
                            html: '',
                            listeners: {
                                scope: me,
                                beforeshow: function (cmp) {
                                    var sel = Ext.ComponentQuery.query('#smegAgencySelector')[0],
                                        selectedRec = (!Ext.isEmpty(sel)) ? sel.getSelection() : null;
                                    if (!Ext.isEmpty(selectedRec)) {
                                        cmp.setHtml('<div class="smeg-agency-sel-tip"><span class="label">Agent #: </span><span class="code">' + selectedRec.get('ACCOUNT') + '</span></div>')
                                        return true;
                                    }
                                    return false;
                                }
                            }
                        });
                    },
                    // select: function (cmp, rec) {
                    //     var me = this;
                    //     if (rec.get('ACCOUNT') !== me.activeAgent) {
                    //         me.setAgent(rec);
                    //         cmp.blur();
                    //     }
                    // },
                    select: 'setAgent'
                }
            },
            {
                xtype: 'button',
                action: 'existingcarts',
                // text: 'Saved Orders',
                cls: 'toolbar-btn',
                text: 'Saved Orders',
                iconCls: 'x-fa fa-list',
                bind: {
                    hidden: '{!hideClearCart}'
                },
                // listeners: {
                //     afterrender: function (cmp) {
                //         console.info(cmp);
                //         cmp.text = 'Saved Orders';
                //     }
                // }
            },
            // {
            //     xtype: 'container',
            //     //width: 130,
            //     items: [
            //         {
            //             xtype: 'component',
            //             height: '100%',
            //             itemId: 'cart',
            //             width: 50,
            //             margin: '8 0 0 0',
            //             bind: {
            //                 data: {
            //                     cartCount: '{cartCount}'
            //                 },
            //                 hidden: '{hideClearCart}'
            //             },
            //             listeners: {
            //                 el: {
            //                     //click: 'onViewCart',
            //                     click: 'onUpdateCartAndShow'
            //                 }
            //             },
            //             tpl: me.buildTpl()
            //             //commenting out the reset cart since its available inside the cart but can easily be added back
            //             // if users request it
            //             // }, {
            //             //     xtype  : 'button',
            //             //     text   : 'Clear',
            //             //     action : 'resetcart',
            //             //     itemId : 'newOrderBtn',
            //             //     hidden : true,
            //             //     bind   : {
            //             //         hidden : '{hideClearCart}'
            //             //     }
            //         }
            //     ]
            // },
            {
                xtype: 'component',
                height: '100%',
                itemId: 'cart',
                //width: 50,
                width: 140,
                margin: '8 0 0 0',
                style: {
                    'display': 'relative'
                },
                bind: {
                    data: {
                        cartCount: '{cartCount}'
                    },
                    hidden: '{hideClearCart}'
                },
                listeners: {
                    el: {
                        //click: 'onViewCart',
                        click: 'onUpdateCartAndShow'
                    }
                },
                tpl: me.buildTpl()
                //commenting out the reset cart since its available inside the cart but can easily be added back
                // if users request it
                // }, {
                //     xtype  : 'button',
                //     text   : 'Clear',
                //     action : 'resetcart',
                //     itemId : 'newOrderBtn',
                //     hidden : true,
                //     bind   : {
                //         hidden : '{hideClearCart}'
                //     }
            }
        ];
    },

    buildTpl: function () {
        var me = this;
        return Ext.create('Ext.XTemplate',
            '<div data-event="viewcart" class="vvicon-cart4 cart-size" style="position: absolute;right:50px;">',
            '<div data-event="viewcart" class="cart-num">{cartCount}</div>',
            // '<div data-event="updatecartandshow" class="vvicon-cart4 cart-size">',
            // '<div data-event="updatecartandshow" class="cart-num">{cartCount}</div>',
            '</div>'
        );
    }
});