Ext.define('Welcome.view.main.apps.Apps', {
    extend        : 'Ext.tree.Panel',
    requires      : [
        'Welcome.view.main.apps.AppsController'
    ],
    xtype         : 'apps',
    controller    : 'apps',
    title         : 'Sections',
    frame         : true,
    rootVisible   : false,
    hideHeaders   : true,
    scrollable    : 'y',
    columns       : [{
        xtype     : 'treecolumn',
        dataIndex : 'text',
        flex      : 1,
        renderer  : function (v, cell, rec) {
            var appIcon = rec.get('appIcon'),
                icon    = (!Ext.isEmpty(appIcon)) ? rec.get('appIcon') + ' app-icon' : '',
                style   = rec.get('iconStyle'),
                s       = '<span class="{0}" style="{1}"></span>{2}';

            return Ext.String.format(s, icon, style, v);
        }
    }],
    listeners : {
        itemclick : 'onItemClick'
    },
    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            store : me.buildStore(),
            cls   : 'welcome-apps' + ' ' + me.cls
        });
        me.callParent(arguments);
    },
    /**
     * buildStore - get the navigation store from the portal and use it
     * @returns {*}
     */
    buildStore    : function () {
        var me = this;
        return parent.Valence.apps.Processor.getNavStore();
    }
});