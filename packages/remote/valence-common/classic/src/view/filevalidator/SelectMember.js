Ext.define('Valence.common.view.filevalidator.SelectMember', {
    extend        : 'Ext.window.Window',
    xtype         : 'filevalidator-selectmember',
    layout        : 'fit',
    height        : 350,
    width         : 450,
    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            buttons : me.buildButtons(),
            items   : me.buildItems()
        });
        me.callParent(arguments);
    },

    buildButtons : function () {
        var me = this;
        return [{
            text    : Valence.lang.lit.cancel,
            scope   : me,
            handler : 'onEsc'
        }];
    },

    buildItems : function () {
        var me = this;
        return [{
            xtype   : 'grid',
            ui      : 'background',
            margin  : '8 16 16 16',
            store   : Ext.create('Ext.data.Store', {
                autoDestroy : true,
                proxy       : {
                    type : 'memory'
                },
                data        : me.content.VVDSDATA06
            }),
            columns : {
                defaults : {
                    menuDisabled : true,
                    flex         : 1
                },
                items    : [{
                    text      : Valence.lang.lit.member,
                    dataIndex : 'MEMBER'
                }, {
                    text      : Valence.lang.lit.description,
                    dataIndex : 'TEXT',
                    flex      : 2
                }]
            },
            listeners : {
                scope     : me,
                itemclick : 'onItemclick'
            }
        }];
    },

    onItemclick : function(view,rec){
        this.fireEvent('itemclick',rec,this);
    }

});