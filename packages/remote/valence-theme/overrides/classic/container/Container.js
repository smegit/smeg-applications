Ext.define('Ext.overrides.classic.container.Container', {
    override : 'Ext.container.Container',

    initComponent : function () {
        var me = this;

        if(!Ext.isEmpty(me.plugins)){
            if (Ext.Array.indexOf(me.plugins, 'viewport') !== -1 || !Ext.isEmpty(me.getPlugin('viewport'))){
                //apply the min width if this is the applications viewport and it doesn't already have a min width defined
                // Also, check the component doesn't have applyVpMinWidth = false. If it does dont apply min width.
                //
                if (Ext.isEmpty(me.minWidth) && (Ext.isEmpty(me.applyVpMinWidth) || me.applyVpMinWidth)){
                    Ext.apply(me,{
                        minWidth   : 900
                    });
                    
                    if (!Ext.isIE && Ext.isEmpty(me.scrollable)){
                        if (!Ext.isEmpty(me.cls)){
                            me.cls += ' vv-overflow-x';
                        } else {
                            me.cls = ' vv-overflow-x';
                        }
                    }
                }
            }
        }

        me.callParent(arguments);
    }
});