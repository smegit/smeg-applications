Ext.define('Valence.common.widget.MatTabs', {
    extend     : 'Ext.tab.Panel',
    xtype      : 'widget_mattabs',
    initialize : function(){
        var me       = this,
            tabBar   = me.getTabBar(),
            scroller = tabBar.getScrollable();

        me.callParent(arguments);

        me.activeEl = Ext.DomHelper.append(tabBar.el, {
            tag : 'div',
            cls : 'mattabs-active-div'
        }, true);

        me.on({
            scope            : me,
            activeitemchange : me.onTabChange
        });

        if (scroller){
            scroller.on({
                scroll : function(){
                    me.onTabChange(me,me.getActiveItem());
                }
            });
        }

        setTimeout(function(){
            me.onTabChange(me,me.getActiveItem());
        },500);

    },
    onTabChange : function(cmp,activeItem){
        var me       = this,
            tab      = activeItem.tab,
            box      = tab.el.getBox(),
            position = cmp.getTabBarPosition();

        me.activeEl.applyStyles({
            width : box.width + 'px'
        });

        if (position === 'bottom'){
            me.activeEl.setXY([box.left,box.top-4]);
        } else if (position === 'top'){
            me.activeEl.setXY([box.left,box.bottom+2]);
        }
    },
    destroy : function () {
        var me = this,
            el = me.activeEl;

        if (el) {
            el.destroy();
        }
        me.callParent(arguments);
    }
});