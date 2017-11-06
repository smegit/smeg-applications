Ext.define('Ext.overrides.classic.button.Button',{
    override      : 'Ext.button.Button',
    depth         : true,
    uppercase     : true,
    initComponent : function(){
        var me  = this,
            cls = '';

        me.cls = me.cls || '';
        if (me.uppercase && me.text){
            me.text = Ext.util.Format.uppercase(me.text);
        }
        if (me.depth && (me.ui.search('transparent') == -1 && me.ui.search('plain') == -1)){
            if (!Ext.isEmpty(me.cls)){
                cls += ' depth-1';
            } else {
                cls = 'depth-1';
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