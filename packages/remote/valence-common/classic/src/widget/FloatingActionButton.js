/**
 * Floating action buttons are used for a promoted action.
 * They are distinguished by a circled icon floating above the UI.
 */
Ext.define('Valence.common.widget.FloatingActionButton', {
    extend         : 'Ext.Button',
    xtype          : 'widget_floatingactionbutton',
    /**
     * @cfg {String} [iconCls=vvicon-plus2]
     */
    iconCls        : 'vvicon-plus2',
    /**
     * @cfg {String} [position] The position in which to render the button. Possible values are:
     *
     * - "br" - bottom right
     */
    position       : 'br',
    /**
     * @cfg {String} positionPrefix position class prefix
     */
    positionPrefix : 'x-btn-position-',
    /**
     * @cfg {Array} positionOffset xy offsets
     */
    positionOffset : null,
    floating       : true,
    /** @cfg {Boolean} [subAction=false] Set to true to create this button as a "sub action" type. It will be smaller and is
     * meant to be hidden and shown only when the floating action button is hovered. Use this with the widget_fabwrapper component.
     */
    subAction      : false,
    initComponent  : function () {
        var me = this;
        if (!Ext.isEmpty(me.position)) {
            me.cls = me.positionPrefix + me.position;
        }
        if (me.subAction){
            me.cls += ' x-btn-floating-action-sub';
        }

        Ext.apply(me, {
            ui       : 'floating-action',
            height   : (!me.subAction) ? 56 : 40,
            width    : (!me.subAction) ? 56 : 40,
            shadow   : false
        });
        me.callParent(arguments);

        setTimeout(function(){
            if (me.inFabWrapper && !me.subAction){
                me.show();
            }
        },500);

    },
    hide           : function () {
        var me = this;
        if (!Ext.isEmpty(me.el)) {
            me.el.removeCls('x-btn-scale-in');
        }
    },
    applyOffsets   : function () {
        var me      = this,
            offsets = me.positionOffset;

        if (!Ext.isEmpty(me.position) && !Ext.isEmpty(offsets) && offsets.length === 2) {
            var positionRule = me.positionPrefix + me.position,
                rule         = Ext.util.CSS.getRule('.' + positionRule);

            if (!Ext.isEmpty(rule)) {
                var regText      = new RegExp(/[a-zA-Z]+/g),
                    regNumbers   = new RegExp(/\d+/),
                    bottom       = rule.style.getPropertyValue('bottom'),
                    bottomNumber = (!Ext.isEmpty(bottom)) ? regNumbers.exec(bottom) : null,
                    bottomPx     = (!Ext.isEmpty(bottom)) ? regText.exec(bottom) : null,
                    right        = rule.style.getPropertyValue('right'),
                    rightNumber  = (!Ext.isEmpty(right)) ? regNumbers.exec(right) : null,
                    rightPx      = (!Ext.isEmpty(right)) ? regText.exec(right) : null;

                //apply x offset
                //
                if (!Ext.isEmpty(bottomNumber) && !Ext.isEmpty(bottomPx)) {
                    bottomNumber = parseInt(bottomNumber[0]) + offsets[0];
                    me.setStyle('bottom', bottomNumber + bottomPx);
                }
                //apply y offset
                //
                if (!Ext.isEmpty(rightNumber) && !Ext.isEmpty(rightPx)) {
                    rightNumber = parseInt(rightNumber[0]) + offsets[1];
                    me.setStyle('right', rightNumber + rightPx);
                }
            }
        }
    },
    show           : function () {
        var me      = this,
            scaleIn = function () {
                if (!Ext.isEmpty(me.el)) {
                    me.el.addCls('x-btn-scale-in');
                }
            };
        me.callParent(arguments);

        if (!Ext.isEmpty(me.positionOffset)) {
            me.applyOffsets();
            me.positionOffset = null;
            setTimeout(function () {
                scaleIn();
            }, 150);
        } else {
            if (!Ext.isEmpty(me.el)) {
                scaleIn();
            }
        }
    }
});