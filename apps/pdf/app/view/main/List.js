/**
 * This view is an example list of people.
 */
Ext.define('pdf.view.main.List', {
    // extend: 'Ext.grid.Panel',
    // xtype: 'mainlist',

    // requires: [
    //     'pdf.store.Personnel'
    // ],

    // title: 'PDF',

    // store: {
    //     type: 'personnel'
    // },

    // // columns: [
    // //     { text: 'Name',  dataIndex: 'name' },
    // //     { text: 'Email', dataIndex: 'email', flex: 1 },
    // //     { text: 'Phone', dataIndex: 'phone', flex: 1 }
    // // ],

    // listeners: {
    //     select: 'onItemSelected'
    // }
    extend: 'Ext.Panel',
    xtype: 'mainlist',
    //closable: true,
    hideOnMaskTap: true,
    showAnimation: {
        type: 'pop',
        // duration: 250,
        // easing: 'ease-out'
    },
    cls: 'pdf-panel',
    centered: true,
    width: '100%',
    height: '100%',
    layout: 'fit',
    title: 'PDF',
    items: [{
        xtype: 'component',
        cls: 'download-cmp',
        height: '100%',
        //html: '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>',
        //html: '<iframe src="/PRODUCT/DEL20001428.pdf" width="100%" height="100%" >This is iframe</iframe>',
        bind: {
            html: '{iframeHTML}'
        }
    }]
});
