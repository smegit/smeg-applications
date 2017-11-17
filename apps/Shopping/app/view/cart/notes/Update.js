Ext.define('Shopping.view.cart.notes.Update', {
    extend        : 'Ext.window.Window',
    xtype         : 'notes-update',
    requires      : [
        'Ext.button.Button',
        'Ext.form.field.Display',
        'Ext.form.field.TextArea',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill'
    ],
    header        : false,
    layout        : {
        type  : 'vbox',
        align : 'stretch'
    },
    height        : 220,
    width         : 420,
    modal         : true,
    defaultFocus  : 'textarea',
    bodyPadding   : '16 16 0 16',
    listeners     : {
        beforeclose : 'onBeforeCloseUpdate'
    },
    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            items : me.buildItems(),
            bbar  : me.buildBBar()
        });
        me.callParent(arguments);
    },
    buildItems    : function () {
        return [{
            xtype     : 'displayfield',
            hideLabel : true,
            bind      : {
                value : '{selectedRec.friendlyDate}'
            }
        }, {
            xtype     : 'textarea',
            flex      : 1,
            maxLength : 200,
            bind      : {
                value : '{selectedRec.OFNOTE}'
            },
            listeners : {
                change : 'onChangeUpdateText'
            }
        }];
    },
    buildBBar     : function () {
        var me = this;
        return {
            items : ['->', {
                text      : 'Cancel',
                itemId    : 'cancelButton',
                listeners : {
                    scope : me,
                    click : function () {
                        me.onEsc();
                    }
                }
            }, {
                xtype     : 'button',
                ui        : 'blue',
                text      : 'Update',
                bind      : {
                    disabled : '{disableUpdateButton}'
                },
                listeners : {
                    click : 'onClickUpdate'
                }
            }]
        };
    }
});