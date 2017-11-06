Ext.define('Valence.common.view.filevalidator.Filevalidator', {
    extend        : 'Ext.form.Panel',
    requires      : [
        'Valence.common.view.filevalidator.FilevalidatorModel',
        'Valence.common.view.filevalidator.FilevalidatorController'
    ],
    xtype         : 'filevalidator',
    viewModel     : {
        type : 'filevalidator'
    },
    controller    : 'filevalidator',
    defaults      : {
        labelAlign     : 'top',
        labelSeparator : '',
        width          : '100%'
    },
    bodyPadding   : '8 24',
    initComponent : function () {
        var me = this;

        if (Ext.isEmpty(me.title)) {
            Ext.apply(me, {
                title : Valence.lang.lit.addFile
            });
        }

        Ext.apply(me, {
            items : me.buildItems()
        });
        me.callParent(arguments);
    },

    buildItems : function () {
        var me = this;
        return [{
            xtype : 'hiddenfield',
            name  : 'member',
            bind  : {
                value : '{member}'
            }
        }, {
            xtype            : 'textfield',
            reference        : 'filefield',
            forceUppercase   : true,
            name             : 'file',
            preventMark      : true,
            maxLength        : 10,
            enforceMaxLength : true,
            allowBlank       : false,
            fieldLabel       : Valence.lang.lit.file,
            bind             : {
                value : '{filename}'
            },
            listeners        : {
                specialkey : 'onSpecialkeyFile'
            }
        }, {
            xtype          : 'combo',
            value          : '*LIBL',
            bind           : {
                store  : '{Libraries}',
                hidden : '{filevalidator_hideLibrary}'
            },
            name           : 'lib',
            queryMode      : 'local',
            displayField   : 'VVOBJECT',
            valueField     : 'VVOBJECT',
            forceSelection : true,
            fieldLabel     : Valence.lang.lit.library,
            triggerAction  : 'all',
            listeners      : {
                specialkey : 'onSpecialkeyFile'
            }
        }, {
            xtype    : 'button',
            ui       : 'primary',
            formBind : true,
            margin   : '8 0 0 0',
            text     : (Ext.isEmpty(me.actionButton)) ? Valence.lang.lit.add : me.actionButton,
            handler  : 'onClickAddFile',
            bind     : {
                hidden : '{filevalidator_hideActionButton}'
            }
        }];
    }
});