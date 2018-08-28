Ext.define('Shopping.view.cart.notes.NotesController', {
    extend        : 'Ext.app.ViewController',
    requires      : [
        'Shopping.model.Note',
        'Shopping.view.cart.notes.Update'
    ],
    alias         : 'controller.notes',
    initViewModel : function (vm) {
        vm.set({
            disableAddButton    : true,
            disableUpdateButton : true
        });
    },

    onChangeNote : function (cmp, value) {
        var me = this,
            vm = me.getViewModel();

        vm.set('disableAddButton', Ext.isEmpty(value));
    },

    onChangeUpdateText : function (cmp, value) {
        var me = this,
            vm = me.getViewModel();

        vm.set('disableUpdateButton', Ext.isEmpty(value));
    },

    onClickAdd : function () {
        var me      = this,
            vm      = me.getViewModel(),
            addNote = me.lookupReference('noteText');

        me.processNote(Ext.clone({
            OFNOTE : addNote.getValue()
        }, 'Updating'))
            .then(function (data) {
                if (!Ext.isEmpty(data.success)){
                    delete data.success;
                }
                Ext.apply(data,{
                    OFTYPE : 'U',
                    OFCRTTIME : data.OFCRTTIME.replace(/\./g,':')
                });
                vm.getStore('Notes').add(Ext.create('Shopping.model.Note', data));
                addNote.reset();
                Valence.util.Helper.showSnackbar('Added');
            });
    },

    onClickUpdate : function () {
        var me             = this,
            vm             = me.getViewModel(),
            rec            = vm.get('selectedRec'),
            closeUpdateWin = function () {
                me.lookupReference('updatenote').close();
            };

        if (rec.dirty) {
            me.processNote(Ext.clone(rec.data, 'Updating'))
                .then(function () {
                    rec.commit();
                    Valence.util.Helper.showSnackbar('Updated');
                    closeUpdateWin();
                });
        } else {
            closeUpdateWin();
        }
    },

    onBeforeCloseUpdate : function () {
        var me  = this,
            vm  = me.getViewModel(),
            rec = vm.get('selectedRec');

        rec.reject();

        me.lookupReference('noteText').focus();
    },

    onItemClick : function (cmp, rec) {
        var me   = this,
            vm   = me.getViewModel(),
            view = me.getView();

        if (rec.get('OFTYPE') === 'U') {
            vm.set('selectedRec', rec);
            view.add({
                xtype     : 'notes-update',
                reference : 'updatenote'
            }).show();
        }
    },

    processNote : function (data, maskMessage) {
        var me       = this,
            deferred = Ext.create('Ext.Deferred'),
            vm       = me.getViewModel(),
            params   = {
                pgm      : 'EC1050',
                action   : 'saveNote',
                OAORDKEY : vm.get('orderKey')
            };

        Ext.apply(params, data);
        if (!Ext.isEmpty(params.dateTime)) {
            delete params.dateTime;
        }
        if (!Ext.isEmpty(params.id)) {
            delete params.id;
        }

        Valence.common.util.Helper.loadMask(maskMessage);

        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : params,
            success : function (r) {
                var d = Ext.decode(r.responseText);
                Valence.common.util.Helper.destroyLoadMask();
                if (d.success) {
                    deferred.resolve(d);
                } else {
                    Valence.common.util.Dialog.show({
                        minWidth : 300,
                        msg      : (!Ext.isEmpty(d.msg)) ? d.msg : 'Not able to process at this time.',
                        buttons  : [{
                            text : 'Ok'
                        }]
                    });
                    deferred.reject(d);
                }
            },
            failure : function () {
                Valence.common.util.Helper.destroyLoadMask();
                Valence.common.util.Dialog.show({
                    title    : 'Error',
                    minWidth : 300,
                    msg      : 'Not able to process at this time.',
                    buttons  : [{
                        text : 'Ok'
                    }]
                });
                deferred.reject();
            }
        });

        return deferred.promise;
    }
});