Ext.define('valence-theme.plugin.Ripple', {
    alias: 'plugin.ripple',

    init: function(component) {
        var me = this;

        // only proceed for chrome and firefox
        //
        if (Ext.isChrome || Ext.isGecko) {
            me.component = component;
            if (component.ripple) {
                if (component.xtype === 'button' || component.xtype === 'tab') {
                    component.on({
                        click : me.onButtonClick,
                        scope : me
                    });
                    //} else if (component.xtypesMap.grid || component.xtypesMap.treepanel){
                } else if (component.xtype === 'widget_selector') {
                    component.on({
                        itemclick : me.onWidgetSelectorItemClick,
                        scope     : me
                    });
                } else {
                    Ext.global.console.warn('Unsupported : ', component, component.config.xtype);
                }
            }
        }
    },

    onButtonClick : function(cmp,e) {
        var element    = this.component.el,
            offsetLeft, offsetTop, x, y;

        offsetLeft = parseInt(element.dom.getBoundingClientRect().left);
        offsetTop = parseInt(element.dom.getBoundingClientRect().top);
        x = parseInt(e.pageX - offsetLeft);
        y = parseInt(e.pageY - offsetTop);

        Ext.DomHelper.append(element, '<div class="ripple-effect" style="position: absolute; top:' + y + 'px; left:' + x + 'px;"></div>');

        setTimeout(function() {
            var ripple = Ext.DomQuery.select('div[class=ripple-effect')[0];
            if (ripple) {
                ripple.remove();
            }
        }, 500);
    },

    onWidgetSelectorItemClick : function(cmp, rec, el, index, e){
        var element    = Ext.get(el),
            elementXY  = e.getXY(),
            parentXY   = cmp.getEl().getXY(),
            x, y;

        x = parseInt(elementXY[0] - parentXY[0]);
        y = parseInt(elementXY[1] - parentXY[1]);

        Ext.DomHelper.append(element, '<div class="ripple-effect" style="position: absolute!important; top:' + y + 'px; left:' + x + 'px;"></div>');

        setTimeout(function() {
            var ripple = Ext.DomQuery.select('div[class=ripple-effect')[0];
            if (ripple) {
                ripple.remove();
            }
        }, 500);
    }
});