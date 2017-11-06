Ext.define('Ext.overrides.classic.window.Window', {
    override      : 'Ext.window.Window',
    cls           : 'depth-5',
    shadow        : false,
    buttonAlign   : 'right',
    closable      : false,
    modal         : true,
    resizable     : false,
    initComponent : function () {
        var me = this;
        if (me.buttons) {
            Ext.each(me.buttons, function (btn) {
                if (Ext.isEmpty(btn.ui)) {
                    btn.ui = 'transparent-action-blue';
                }
                if (Ext.isEmpty(btn.scale)) {
                    btn.scale = 'medium';
                }
                btn.ripple = false;
            });
        }
        me.callParent(arguments);

        me.on({
            scope : me,
            show  : me.onShowWindown
        });
    },

    close : function () {
        var me = this;
        if (me.fireEvent('beforeclose', me) !== false) {
            if (Ext.isEmpty(me.animateTarget)) {
                me.el.fadeOut({
                    callback : function () {
                        me.doClose();
                    }
                });
            } else {
                me.doClose();
            }
        }
    },

    onShowWindown : function () {
        var me = this,
            el = me.getEl();

        if (el.getStyleValue('opacity') === '0') {
            el.fadeIn();
        }
    }
});