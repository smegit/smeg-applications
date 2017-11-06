Ext.define('Valence.common.view.filevalidator.FilevalidatorModel', {
    extend : 'Ext.app.ViewModel',
    alias  : 'viewmodel.filevalidator',
    stores : {
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
                load : function (str) {
                    str.insert(0, {
                        VVOBJECT : '*LIBL'
                    });
                }
            }
        }
    },
    data   : {
        includeFileData : 1
    }
});