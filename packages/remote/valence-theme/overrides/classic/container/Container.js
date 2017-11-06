Ext.define('Ext.overrides.classic.container.Container', {
    override : 'Ext.container.Container',

    initComponent : function () {
        var me = this;

        if(!Ext.isEmpty(me.plugins)){
            if (Ext.Array.indexOf(me.plugins, 'viewport') !== -1 || !Ext.isEmpty(me.getPlugin('viewport'))){
                if (Ext.isEmpty(me.minWidth)){
                    Ext.apply(me,{
                        minWidth   : 1280
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