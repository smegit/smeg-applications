// Ext.define('Shopping.view.products.Categories', {
//     extend          : 'Ext.view.View',
//     alias           : 'widget.categories',
//     cls             : 'category',
//     reference       : 'cats',
//     bind            : {
//         store : '{categories}'
//     },
//     emptyText       : 'No Categories',
//     itemSelector    : 'div.cat-wrap',
//     overItemCls     : 'cat-wrap-over',
//     selectedItemCls : 'cat-wrap-sel',
//     tpl             : [
//         '<div class = "cat-title">Product Categories</div>',
//         '<tpl for=".">',
//         '<div class="cat-wrap">{[fm.uppercase(values.CATDESC)]}</div>',
//         '</tpl>'
//     ]
// });



// Change view to tree panel
Ext.define('Shopping.view.products.Categories', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.categories',
    cls: 'category',
    reference: 'cats',
    bind: {
        store: '{categories}'
    },
    title: 'Product',
    rootVisible: false,
    useArrows: true,
    emptyText: 'No Categories',
    itemSelector: 'div.cat-wrap',
    overItemCls: 'cat-wrap-over',
    selectedItemCls: 'cat-wrap-sel',

    listeners: {
        // select: function () {
        //     console.info('click called');
        // }
    },

    // Add Global Search Button to the title
    // tools: [{
    //     type: 'search',
    //     tooltip: 'Search all products',
    //     handler: 'onSearchAll'
    // }],
    columns: [
        {
            xtype: 'treecolumn',
            //text: 'Name',
            dataIndex: 'CATDESC',
            flex: 1,
            sortable: true,
            // renderer: function (v, metaData, record) {
            //     metaData.glyph = record.glyph;
            //     return v;
            // }
        },
        // {
        //     xtype: 'actioncolumn',
        //     glyph: 'xf002@FontAwesome',
        //     width: 35,
        // }
    ]
});