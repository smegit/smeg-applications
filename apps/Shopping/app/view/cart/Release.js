Ext.define('Shopping.view.cart.Release', {
    extend        : 'Ext.window.Window',
    requires      : [
        'Ext.layout.container.Anchor',
        'Ext.toolbar.Fill',
        'Shopping.view.cart.List',
        'Shopping.view.cart.Form'
    ],
    title         : 'Release',
    height        : '90%',
    maxWidth      : 1060,
    xtype         : 'cartrelease',
    bodyPadding   : '8 20',
    closable      : true,
    modal         : true,
    scrollable    : true,
    layout        : 'anchor',
    defaultFocus  : '[name=OACSTREF]',
    initComponent : function () {
        var me        = this,
            bodyWidth = Ext.getBody().getWidth();

        //set the width based of the body width
        //
        if (bodyWidth > me.maxWidth) {
            me.width = me.maxWidth;
        } else {
            me.width = '95%';
        }

        Ext.apply(me, {
            items : me.buildItems(),
            bbar  : me.buildBBar()
        });

        me.callParent(arguments);
    },
    buildBBar     : function () {
        var me = this;
        return {
            ui    : 'white-bordered',
            items : ['->', {
                text      : 'Cancel',
                listeners : {
                    scope : me,
                    click : me.onEsc
                }
            }, {
                text     : 'Confirm',
                cls      : 'btn-checkout',
                overCls  : 'btn-checkout-over',
                focusCls : 'btn-checkout'
            }]
        }
    },
    buildItems    : function () {
        return [{
            xtype     : 'cartlist',
            release   : true,
            minHeight : 100
        }, {
            xtype   : 'cartform',
            release : true
        }];
    }
});