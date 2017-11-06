Ext.define('Ext.overrides.classic.button.Button',{
    override      : 'Ext.button.Button',
    depth         : false,
    depthOnHover  : true,
    uppercase     : true,
    initComponent : function(){
        var me  = this,
            cls = '';

        me.cls = me.cls || '';
        if (me.uppercase && me.text){
            me.text = Ext.util.Format.uppercase(me.text);
        }
        if ((me.ui.search('transparent') == -1 && me.ui.search('plain') == -1)){
            if (me.depth){
                if (!Ext.isEmpty(me.cls)){
                    cls += ' depth-1 depth-init';
                } else {
                    cls = 'depth-1 depth-init';
                }
            }
            if (me.depthOnHover){
                if (!me.depth){
                    if (!Ext.isEmpty(me.cls)){
                        cls += ' depth-on-hover';
                    } else {
                        cls = 'depth-on-hover';
                    }
                }
            }
        }

        me.cls += cls;
        me.callParent(arguments);

        me.on({
            scope      : me,
            textchange : me.onButtonTextChange
        });
    },

    onButtonTextChange : function(btn,oldText,newText){
        if (this.uppercase){
            btn.suspendEvents(false);
            btn.setText(Ext.util.Format.uppercase(newText));
            btn.resumeEvents(true);
        }
    }
});