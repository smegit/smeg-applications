Ext.define('Valence.common.view.filevalidator.FilevalidatorController', {
    extend   : 'Ext.app.ViewController',
    alias    : 'controller.filevalidator',
    requires : [
        'Valence.common.view.filevalidator.Select',
        'Valence.common.view.filevalidator.SelectMember'
    ],
    init     : function () {
        var me        = this,
            vm        = me.getViewModel(),
            fileLabel = vm.get('fileFieldLabel');

        //if the file field label isn't set set it
        //
        if (Ext.isEmpty(fileLabel)) {
            vm.set('fileFieldLabel', Valence.lang.lit.file);
        }

        // load the remote database store if remote functionality active...
        //
        if (vm.get('allowRemote')){
            vm.getStore('Databases').load({
                callback : function(recs){
                    // set off if no records exist...
                    //
                    if (recs.length === 0){
                        vm.set('allowRemote',false);
                    }
                }
            });
        }
    },

    onClickAddFile : function (btn) {
        var me   = this,
            view = me.getView();

        if (view.isValid()) {
            view.el.mask();
            me.processValidateFile()
                .then(me.processAddFile)
                .then(null, me.processAddFileReject);
        }
    },

    onItemclickFileSelection : function (rec, wdw) {
        var me   = this,
            vm   = me.getViewModel(),
            view = me.getView();

        view.down('[name=file]').setValue(rec.get('FILE'));
        vm.set({
            filename : rec.get('FILE'),
            member   : ''
        });
        vm.notify();
        me.onClickAddFile();
        wdw.destroy();
    },

    onItemclickFileSelectionMember : function (rec, wdw) {
        var me = this,
            vm = me.getViewModel();

        vm.set({
            member : rec.get('MEMBER')
        });
        vm.notify();
        me.onClickAddFile();
        wdw.destroy();
    },

    onSpecialkeyFile : function (fld, e) {
        var me = this,
            vm = me.getViewModel();
        if (e.getKey() === e.ENTER && !vm.get('filevalidator_hideActionButton')) {
            me.onClickAddFile();
        } else if (e.getKey() === e.ENTER) {
            var view = me.getView();
            view.fireEvent('enterkey', view, fld);
        }
    },

    onRemoteDbSelected : function (cmp, selected) {
        var me         = this,
            vm         = me.getViewModel(),
            selectedDb = selected.get('VVDBID'),
            schemaStr  = vm.getStore('Schemas'),
            view       = me.getView(),
            dbType     = selected.get('VVTYPE');

        vm.set('isRemote400', (dbType === 'DB2/400'));
        Valence.common.util.Helper.loadMask({
            renderTo : view.el,
            text     : Valence.lang.lit.loading
        });
        schemaStr.load({
            params   : {
                remoteDb : selectedDb
            },
            callback : function (records, operation, success) {
                Valence.common.util.Helper.destroyLoadMask(view.el);
                if (success) {
                    vm.set('isRemoteDbSelected', true);
                    if (dbType === 'DB2/400'){
                        schemaStr.insert(0,{
                            VVSCHEMA : '*LIBL'
                        });
                    }
                } else {
                    vm.set('isRemoteDbSelected', false);
                    cmp.reset();
                    Valence.common.util.Snackbar.show(Valence.common.util.Helper.getLit({
                        lit        : 'remoteDbTimeout',
                        var1       : selectedDb,
                        skipDecode : true
                    }));
                }
            }
        });
    },

    onRemoteSchemaSelect : function (cmp, selected) {
        var me = this,
            vm = me.getViewModel();

        vm.set('isSchemaSelected', true);
    },

    onRemoteDbChange : function (cmp, checked) {
        var me = this,
            vm = me.getViewModel();

        vm.set('isRemoteRequest', checked);
    },

    processAddFile : function (content) {
        var me     = content.scope,
            view   = me.getView(),
            member = (!Ext.isEmpty(content.params.member)) ? content.params.member : ''

        if (content.REMOTE) {

            me.fireViewEvent('filevalid', view, Ext.apply(content, {
                REMOTEDB : content.params.remoteDb,
                LIBRARY  : content.params.remoteSchema,
                FILE     : content.params.remoteTable
            }));
            view.lookupReference('tablefield').reset();
        } else {
            me.fireViewEvent('filevalid', view, Ext.apply(content, {
                FILE   : view.lookupReference('filefield').getValue(),
                MEMBER : member
            }));
            view.lookupReference('filefield').reset();
        }

        view.el.unmask();
    },

    processAddFileReject : function (content) {
        var me   = content.scope,
            view = me.getView();

        if (!Ext.isEmpty(content.VVDSDATA04)) {
            Ext.widget('filevalidator-select', {
                title     : content.totalCount + ' File(s) Found',
                renderTo  : Ext.getBody(),
                content   : content,
                listeners : {
                    scope     : me,
                    itemclick : 'onItemclickFileSelection'
                }
            }).show();
        } else if (!Ext.isEmpty(content.VVDSDATA06)) {
            Ext.widget('filevalidator-selectmember', {
                title     : content.totalCount + ' Member(s) Found',
                renderTo  : Ext.getBody(),
                content   : content,
                listeners : {
                    scope     : me,
                    itemclick : 'onItemclickFileSelectionMember'
                }
            }).show();
        } else {
            me.fireViewEvent('fileinvalid');
            if (content.success === '3') {
                Valence.common.util.Snackbar.show(Valence.lang.lit.noResults);
            } else {
                if (content.params.action == 'getRmtFileFields') {
                    Valence.common.util.Snackbar.show(Valence.common.util.Helper.getLit({
                        lit        : 'fileNotFound',
                        var1       : content.params.remoteSchemaAndTable,
                        skipDecode : true
                    }));
                    view.el.unmask();
                } else {
                    Valence.common.util.Snackbar.show(Valence.common.util.Helper.getLit({
                        lit        : 'fileNotFound',
                        var1       : content.params.file,
                        skipDecode : true
                    }));
                }
            }
        }
        view.el.unmask();
    },


    processValidateFile : function () {
        var me       = this,
            deferred = Ext.create('Ext.Deferred'),
            vm       = me.getViewModel(),
            view     = me.getView(),
            vals     = view.getValues(),
            params   = {
                pgm      : 'vvdatasrc',
                action   : vm.get('isRemoteRequest') ? 'getRmtFileFields' : 'getFileFields',
                fileData : vm.get('includeFileData')
            };

        if (vm.get('isRemoteRequest')) {
            vals.remoteSchemaAndTable = vals.remoteSchema + "." + vals.remoteTable;
        }

        Ext.apply(params, vals);
        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : params,
            success : function (r) {
                var d = Ext.decode(r.responseText);
                if (d.success === true) {
                    deferred.resolve(Ext.apply(d, {
                        scope  : me,
                        params : params
                    }));
                } else {
                    deferred.reject(Ext.apply(d, {
                        scope  : me,
                        params : params
                    }));
                }
            },
            failure : function () {
                deferred.reject({
                    scope  : me,
                    params : params
                });
            }
        });

        return deferred.promise;
    },

    setLocked : function (val, remoteDetails) {
        var me    = this,
            vm    = me.getViewModel(),
            view  = me.getView(),
            dbStr = vm.getStore('Databases'),
            rmtDb = view.down('[name=remoteDb]');

        vm.set('locked', val);
        if (val) {
            if (remoteDetails) {
                vm.set({
                    isRemoteRequest    : true,
                    isRemoteDbSelected : true
                });

                if (dbStr.getCount() === 0){
                    dbStr.on({
                        single : true,
                        load   : function(){
                            rmtDb.setValue(remoteDetails.get('VVRMT'));
                            rmtDb.fireEvent('select',rmtDb,rmtDb.getSelectedRecord());
                        }
                    });
                } else {
                    rmtDb.setValue(remoteDetails.get('VVRMT'));
                    rmtDb.fireEvent('select',rmtDb,rmtDb.getSelectedRecord());
                }
                vm.getStore('Schemas').load({
                    params   : {
                        remoteDb : remoteDetails.get('VVRMT')
                    },
                    callback : function (records, operation, success) {
                        if (success) {
                            view.down('[name=remoteSchema]').setValue(remoteDetails.get('VVLIB'));
                            vm.set('isSchemaSelected', true);
                        }
                    }
                });
            }
        } else {
            view.reset();
            vm.set({
                isRemoteRequest    : false,
                isRemoteDbSelected : false,
                isSchemaSelected   : false
            });
        }
    }
});