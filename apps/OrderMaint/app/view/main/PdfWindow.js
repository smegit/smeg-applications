Ext.define('OrderMaint.view.main.PdfWindow', {
    extend: 'Ext.window.Window',

    requires: [
        // 'Ext.form.Panel',
        // 'Ext.form.field.HtmlEditor',
        // 'Ext.form.field.Text',
        // 'Ext.layout.container.Fit',
        // 'Ext.layout.container.VBox',
        // 'Ext.toolbar.Fill',
        // 'Ext.ux.IFrame',
        'Ext.window.Window',
        'Ext.panel.Panel'
    ],
    xtype: 'pdfWindow',
    // height: '90%',
    // width: '70%',
    layout: 'fit',
    closable: true,
    modal: true,
    initComponent: function () {
        console.info('initComponent123 called');
        var me = this;

        Ext.apply(me, {
            items: me.buildItems(),
            //bbar: me.buildBBar()
        });
        me.callParent(arguments);
    },
    buildItems: function () {
        var me = this;
        console.info(me);
        return [{
            xtype: 'panel',
            width: '80%',
            //height: 700,
            layout: 'fit',
            html: me.iframeSource
        }];
    },
})