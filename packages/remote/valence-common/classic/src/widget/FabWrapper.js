Ext.define('Valence.common.widget.FabWrapper', {
    extend         : 'Ext.Container',
    xtype          : 'widget_fabwrapper',
    width          : 96,
    cls            : 'vv-fabwrapper',
    positionPrefix : 'vv-fabwrapper-',
    position       : 'br',
    initComponent  : function () {
        var me = this;
        if (me.position) {
            me.cls += ' ' + me.positionPrefix + me.position;
        }
        Ext.apply(me, {
            layout       : {
                type  : 'vbox',
                align : 'middle'
            },
            shadow       : false,
            floating     : true,
            defaults     : {
                floating  : false,
                margin    : '16 0 0 0',
                xtype     : 'widget_floatingactionbutton',
                position  : null,
                inFabWrapper : true,
                listeners : {
                    scope : me,
                    click : me.hideSubActions
                }
            }
        });
        me.callParent(arguments);
    },

    hideSubActions : function () {
        var me       = this,
            hideCmps = me.query('[subAction]');

        for (var ii = 0; ii < hideCmps.length; ii++) {
            hideCmps[ii].hide();
        }
    },

    onParentLayout : function(){
        var me = this;
        me.el.alignTo(me.floatParent,me.position + '-' + me.position,[0,-32]);
    },

    onRender : function () {
        var me = this;
        me.callParent(arguments);

        me.el.on({
            scope      : me,
            mouseenter : me.showSubActions,
            mouseleave : me.hideSubActions
        });

        setTimeout(function(){
            me.el.alignTo(me.floatParent,me.position + '-' + me.position,[0,-32]);
            me.mon(me.floatParent,'afterlayout',me.onParentLayout, me);
        },100);

    },

    showSubActions : function () {
        var me       = this,
            showCmps = me.query('[subAction]');

        for (var ii = 0; ii < showCmps.length; ii++) {
            showCmps[ii].show();
        }
    }

});