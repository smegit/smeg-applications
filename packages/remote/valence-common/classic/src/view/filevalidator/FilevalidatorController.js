Ext.define('Valence.common.view.filevalidator.FilevalidatorController', {
    extend         : 'Ext.app.ViewController',
    alias          : 'controller.filevalidator',
    requires       : [
        'Valence.common.view.filevalidator.Select',
        'Valence.common.view.filevalidator.SelectMember'
    ],
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
        var me = this,
            vm = me.getViewModel();

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
        } else if (e.getKey() === e.ENTER){
            var view = me.getView();
            view.fireEvent('enterkey', view, fld);
        }
    },

    processAddFile : function (content) {
        var me   = content.scope,
            view = me.getView(),
            member = (!Ext.isEmpty(content.params.member)) ? content.params.member : ''

        me.fireViewEvent('filevalid', view, Ext.apply(content, {
            FILE   : view.lookupReference('filefield').getValue(),
            MEMBER : member
        }));

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
                Valence.common.util.Snackbar.show(Valence.common.util.Helper.getLit({
                    lit  : 'fileNotFound',
                    var1 : content.params.file
                }));
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
                action   : 'getFileFields',
                fileData : vm.get('includeFileData')
            };

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
            }
        });

        return deferred.promise;
    }
});