Ext.define('Shopping.view.products.Search', {
    extend: 'Ext.container.Container',
    xtype: 'search',
    requires: [
        'Ext.form.Panel',
        //'Ext.tree.*'
    ],

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    //scrollable: 'y',

    items: [
        {
            xtype: 'treepanel',
            bind: {
                store: '{categories}'
            },
            cls: 'category',

            title: 'Search',
            rootVisible: false,
            useArrows: true,
            emptyText: 'No Categories',
            itemSelector: 'div.cat-wrap',
            overItemCls: 'cat-wrap-over',
            selectedItemCls: 'cat-wrap-sel',
            tools: [{
                type: 'close',
                //glyph: 'xf0d5@FontAwesome',
                tooltip: 'Go back to main catalogue',
                handler: 'onBackToCata'
            }],
        },
        {
            xtype: 'form',
            reference: 'searchForm',
            bodyPadding: 10,
            //maxWidth: 280,
            //maxHeight: '500',
            flex: 1,
            scrollable: 'y',
            fieldDefaults: {
                labelAlign: 'center',
                labelWidth: 90,
                anchor: '100%',
            },
            defaults: {
                listeners: {
                    change: 'onSearchFormChange'
                },
                enableKeyEvents: true
            },
            items: [
                // {
                //     xtype: 'textfield',
                //     name: 'cat',
                //     fieldLabel: 'cat',
                //     bind: {
                //         value: '{catId}'
                //     }
                // }
            ],
            buttons: [
                // {
                //     text: 'Back',
                //     handler: 'onBackToCata'
                // },
                // '->',
                // {
                //     text: 'Search',
                //     formBind: true,
                //     listeners: {
                //         click: 'onSearchRequestClick'
                //     }
                // },
            ]
        }
    ]
});