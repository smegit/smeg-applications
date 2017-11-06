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
    initComponent : function (){
        var me = this;

        if (Ext.isEmpty(me.title)){
            Ext.apply(me, {
                title : Valence.lang.lit.addFile
            });
        }

        Ext.apply(me, {
            items : me.buildItems()
        });
        me.callParent(arguments);
    },

    buildItems : function (){
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
            hidden           : false,
            bind             : {
                fieldLabel : '{fileFieldLabel}',
                hidden     : '{isRemoteRequest}',
                disabled   : '{isRemoteRequest}'
            },
            listeners        : {
                specialkey : 'onSpecialkeyFile',
                show       : {
                    delay : 200,
                    fn    : function (cmp){
                        cmp.focus();
                    }
                }
            }
        }, {
            xtype          : 'combo',
            reference      : 'libfield',
            value          : '*LIBL',
            bind           : {
                store    : '{Libraries}',
                hidden   : '{filevalidator_hideLibraryCombo}',
                disabled : '{filevalidator_hideLibraryCombo}'
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
            xtype                : 'combo',
            name                 : 'remoteDb',
            bind                 : {
                store    : '{Databases}',
                hidden   : '{!isRemoteRequest}',
                disabled : '{disableRemoteDb}',
                readOnly : '{locked}'
            },
            queryMode            : 'local',
            displayField         : 'VVNAME',
            valueField           : 'VVDBID',
            forceSelection       : true,
            fieldLabel           : Valence.lang.lit.remoteDbs,
            allowBlank           : false,
            triggerAction        : 'all',
            hidden               : true,
            disabled             : true,
            hideBorderOnReadOnly : true,
            listeners            : {
                select : 'onRemoteDbSelected',
                show   : {
                    delay : 200,
                    fn    : function (cmp){
                        cmp.focus();
                    }
                }
            }
        }, {
            xtype                : 'combo',
            name                 : 'remoteSchema',
            bind                 : {
                store      : '{Schemas}',
                hidden     : '{!showSchema}',
                disabled   : '{disableSchema}',
                fieldLabel : '{schemaFieldLabel}'
            },
            queryMode            : 'local',
            displayField         : 'VVSCHEMA',
            valueField           : 'VVSCHEMA',
            forceSelection       : true,
            allowBlank           : false,
            triggerAction        : 'all',
            hidden               : true,
            disabled             : true,
            hideBorderOnReadOnly : true,
            listeners            : {
                select : 'onRemoteSchemaSelect',
                show   : {
                    delay : 200,
                    fn    : function (cmp){
                        cmp.focus();
                    }
                }
            }
        }, {
            xtype            : 'textfield',
            name             : 'remoteTable',
            reference        : 'tablefield',
            emptyText        : Valence.lang.lit.caseSensitive,
            preventMark      : true,
            maxLength        : 30,
            enforceMaxLength : true,
            allowBlank       : false,
            fieldLabel       : Valence.lang.lit.table,
            hidden           : true,
            disabled         : true,
            bind             : {
                disabled       : '{!showTable}',
                hidden         : '{!showTable}',
                emptyText      : '{tableEmptyText}',
                forceUppercase : '{isRemote400}'
            },
            listeners        : {
                specialkey : 'onSpecialkeyFile',
                show       : {
                    delay : 200,
                    fn    : function (cmp){
                        cmp.focus();
                    }
                }
            }
        }, {
            xtype     : 'checkboxfield',
            name      : 'remotedbchk',
            boxLabel  : 'Remote Database',
            checked   : false,
            listeners : {
                change : 'onRemoteDbChange'
            },
            bind      : {
                hidden : '{hideRemoteDbCheckbox}'
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