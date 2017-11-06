Ext.define('Valence.common.widget.MatTabs', {
    extend        : 'Ext.tab.Panel',
    xtype         : 'widget_mattabs',
    stretchTabs   : true,
    pack          : 'start',
    centerTabs    : false,
    initComponent : function () {
        var me = this;
        me.cls += ' mattabs';
        me.callParent(arguments);
    },
    applyTabBar   : function (tabBar) {
        var me   = this,
            // if we are rendering the tabbar into the panel header, use same alignment
            // as header position, and ignore tabPosition.
            dock = (me.tabBarHeaderPosition != null) ? me.getHeaderPosition() : me.getTabPosition();

        if (me.centerTabs) {
            me.pack = 'center';
        }
        return new Ext.tab.Bar(Ext.apply({
            ui            : me.ui,
            dock          : dock,
            tabRotation   : me.getTabRotation(),
            vertical      : (dock === 'left' || dock === 'right'),
            plain         : me.plain,
            tabStretchMax : me.getTabStretchMax(),
            tabPanel      : me,
            layout        : {
                type : 'hbox',
                pack : me.pack
            },
            defaults      : {
                flex      : (me.stretchTabs) ? 1 : null,
                listeners : {
                    delay    : 250,
                    scope    : me,
                    activate : me.onActivateTab,
                    resize   : me.onResizeTab
                }
            },
            listeners     : {
                scope   : me,
                render  : me.onRenderTabbar,
                destroy : me.onDestroyTabbar
            }
        }, tabBar));
    },

    onActivateTab : function (tab) {
        if (Ext.isEmpty(tab) || Ext.isEmpty(tab.el)) {
            return;
        }

        var me  = this,
            box = tab.el.getBox();

        if (box.y < 0) {
            Ext.Function.defer(me.onActivateTab, 50, me, [tab]);
        } else {
            me.activeEl.animate({
                duration : 300,
                to       : {
                    width : box.width,
                    x     : box.x,
                    y     : box.y + box.height - 1
                }
            });
        }
    },

    destroy : function () {
        var me = this,
            el = me.activeEl;

        if (el) {
            el.destroy();
        }
        me.callParent(arguments);
    },

    onRenderTabbar : function (cmp) {
        var me = this;

        me.activeEl = Ext.DomHelper.append(cmp.el, {
            tag : 'div',
            cls : 'mattabs-active-div'
        }, true);

        Ext.on({
            resize : {
                fn     : me.onResponsiveTab,
                scope  : me,
                buffer : 250
            }
        });
    },

    onResponsiveTab : function () {
        var me        = this,
            activeTab = me.getActiveTab();
        if (activeTab) {
            me.onResizeTab(activeTab.tab);
        }
    },

    onDestroyTabbar : function () {
        var me = this;
        Ext.un('resize', me.onResponsiveTab)
    },

    onResizeTab : function (tab) {
        var me        = this,
            activeTab = me.getActiveTab(),
            box;
        if (tab === activeTab.tab) {
            box = tab.el.getBox();
            me.activeEl.animate({
                duration : 300,
                to       : {
                    width : box.width,
                    x     : box.x,
                    y     : box.y + box.height - 1
                }
            });
        }
    }

});