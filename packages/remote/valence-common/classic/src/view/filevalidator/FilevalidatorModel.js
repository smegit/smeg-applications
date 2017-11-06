Ext.define('Valence.common.view.filevalidator.FilevalidatorModel', {
    extend   : 'Ext.app.ViewModel',
    alias    : 'viewmodel.filevalidator',
    stores   : {
        Libraries : {
            fields    : ['VVOBJECT'],
            autoLoad  : true,
            proxy     : {
                type        : 'ajax',
                url         : '/valence/vvcall.pgm',
                reader      : {
                    type         : 'json',
                    rootProperty : 'VVDSUTIL3'
                },
                extraParams : {
                    action : 'getLibraries',
                    pgm    : 'vvdatasrc'
                }
            },
            listeners : {
                load : function (str){
                    str.insert(0, {
                        VVOBJECT : '*LIBL'
                    });
                }
            }
        },
        Databases : {
            fields : ['VVDBID', 'VVNAME', 'VVDRVR', 'VVURL', 'VVUSER', 'VVPWD', 'VVFSLOC'],
            proxy  : {
                type        : 'ajax',
                url         : '/valence/vvcall.pgm',
                extraParams : {
                    pgm    : 'VVDATASRC',
                    action : 'getRmtDatabases'
                },
                reader      : {
                    type          : 'json',
                    rootProperty  : 'VVRMTDB01',
                    totalProperty : 'totalCount'
                }
            }
        },
        Schemas   : {
            fields : ['VVSCHEMA'],
            proxy  : {
                type        : 'ajax',
                url         : '/valence/vvcall.pgm',
                extraParams : {
                    pgm    : 'VVDATASRC',
                    action : 'getRmtSchemas'
                },
                reader      : {
                    type          : 'json',
                    rootProperty  : 'VVRMTDB02',
                    totalProperty : 'totalCount'
                }
            }
        }
    },
    data     : {
        allowRemote               : false,
        filevalidator_hideLibrary : false,
        includeFileData           : 1,
        isRemote400               : false,
        isRemoteDbSelected        : false,
        isRemoteRequest           : false,
        isSchemaSelected          : false,
        locked                    : false,
        showSchema                : false,
        showTable                 : false
    },
    formulas : {
        disableRemoteDb                : function (get){
            return (!get('isRemoteRequest'));
        },
        disableSchema                  : function (get){
            return (!get('showSchema'));
        },
        filevalidator_hideLibraryCombo : {
            bind : {
                hideLibrary     : '{filevalidator_hideLibrary}',
                isRemoteRequest : '{isRemoteRequest}'
            },
            get  : function (data){
                return (data.isRemoteRequest || data.hideLibrary);
            }
        },
        hideRemoteDbCheckbox           : function (get){
            return (!get('allowRemote') || get('locked'));
        },
        schemaFieldLabel               : function (get){
            return (get('isRemote400')) ? Valence.lang.lit.library : Valence.lang.lit.schema;
        },
        showSchema                     : function (get){
            return (get('isRemoteRequest') && get('isRemoteDbSelected'));
        },
        showTable                      : function (get){
            return (get('isRemoteRequest') && get('isSchemaSelected'));
        },
        tableEmptyText                 : function (get){
            return (get('isRemote400')) ? '' : Valence.lang.lit.caseSensitive;
        }
    }
});