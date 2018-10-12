Ext.define('Shopping.view.cart.notes.NotesController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'Ext.*',
        'Shopping.model.Note',
        'Shopping.view.cart.notes.Update',

        'Shopping.view.cart.notes.NoteList',
        'Shopping.view.cart.notes.NoteForm'
    ],
    alias: 'controller.notes',
    initViewModel: function (vm) {
        vm.set({
            disableAddButton: true,
            disableUpdateButton: true
        });
    },

    init: function () {
        this.setCurrentView('notelist');
    },

    onChangeNote: function (cmp, value) {
        var me = this,
            vm = me.getViewModel();

        vm.set('disableAddButton', Ext.isEmpty(value));
    },

    onChangeUpdateText: function (cmp, value) {
        var me = this,
            vm = me.getViewModel();

        vm.set('disableUpdateButton', Ext.isEmpty(value));
    },

    // onClickAdd: function () {
    //     console.log('debug onClickAdd called');
    //     var me = this,
    //         vm = me.getViewModel(),
    //         addNote = me.lookupReference('noteText');
    //     var noteType = me.lookupReference('noteType'),
    //         noteAction = me.lookupReference('noteAction'),
    //         noteDetail = me.lookupReference('noteDetail'),
    //         noteFollowUpDate = me.lookupReference('noteFollowUpDate');

    //     // Need add the attributes above to  processNote()

    //     me.processNote(Ext.clone({
    //         OFNOTE: addNote.getValue()
    //     }), 'Updating')
    //         .then(function (data) {
    //             console.info(data);
    //             if (!Ext.isEmpty(data.success)) {
    //                 delete data.success;
    //             }
    //             Ext.apply(data, {
    //                 OFTYPE: 'U',
    //                 OFCRTTIME: data.OFCRTTIME.replace(/\./g, ':')
    //             });
    //             vm.getStore('Notes').add(Ext.create('Shopping.model.Note', data));
    //             noteType.reset();
    //             addNote.reset();
    //             Valence.util.Helper.showSnackbar('Added');
    //         });
    // },

    // onClickUpdate: function () {
    //     var me = this,
    //         vm = me.getViewModel(),
    //         rec = vm.get('selectedRec'),
    //         closeUpdateWin = function () {
    //             me.lookupReference('updatenote').close();
    //         };

    //     if (rec.dirty) {
    //         console.info(rec.data);
    //         me.processNote(Ext.clone(rec.data, 'Updating'))
    //             .then(function () {
    //                 rec.commit();
    //                 Valence.util.Helper.showSnackbar('Updated');
    //                 closeUpdateWin();
    //             });
    //     } else {
    //         closeUpdateWin();
    //     }
    // },

    // onBeforeCloseUpdate: function () {
    //     var me = this,
    //         vm = me.getViewModel(),
    //         rec = vm.get('selectedRec');

    //     rec.reject();

    //     me.lookupReference('noteText').focus();
    // },

    onItemClick: function (cmp, rec, item, index, e) {
        console.log('onItemDblClick called');
        console.info(rec);
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            addBtn = view.up().down('#add2');
        console.info(rec);
        console.info(addBtn);
        me.setCurrentView('noteform');
        addBtn.setText('Update');
        // won't need after upgrade
        e.stopPropagation();
    },

    // onItemClick: function (cmp, rec) {
    //     console.log('onItemDblClick called');
    //     var me = this,
    //         vm = me.getViewModel(),
    //         view = me.getView(),
    //         addBtn = view.up().down('#add2');
    //     console.info(rec);
    //     console.info(addBtn);

    //     if (rec.get('OFTYPE') === 'U') {
    //         vm.set('selectedRec', rec);
    //         view.add({
    //             xtype: 'notes-update',
    //             reference: 'updatenote'
    //         }).show();
    //     }
    // },

    processNote: function (data, maskMessage) {
        // console.log('debugy processNote called');
        // console.log('data => ');
        // console.info(data);
        // console.info(maskMessage);
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            vm = me.getViewModel(),
            params = {
                pgm: 'EC1050',
                action: 'saveNote',
                OAORDKEY: vm.get('orderKey')
            };

        Ext.apply(params, data);
        console.log('params => ');
        console.info(params);
        if (!Ext.isEmpty(params.dateTime)) {
            delete params.dateTime;
        }
        if (!Ext.isEmpty(params.id)) {
            delete params.id;
        }

        Valence.common.util.Helper.loadMask(maskMessage);

        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: params,
            success: function (r) {
                // console.log('r => ');
                // console.info(r);
                var d = Ext.decode(r.responseText);
                Valence.common.util.Helper.destroyLoadMask();
                if (d.success) {
                    deferred.resolve(d);
                } else {
                    Valence.common.util.Dialog.show({
                        minWidth: 300,
                        msg: (!Ext.isEmpty(d.msg)) ? d.msg : 'Not able to process at this tim.',
                        buttons: [{
                            text: 'Ok'
                        }]
                    });
                    deferred.reject(d);
                }
            },
            failure: function (response, opts) {
                // console.info(response);
                // console.info(opts);
                Valence.common.util.Helper.destroyLoadMask();
                Valence.common.util.Dialog.show({
                    title: 'Error',
                    minWidth: 300,
                    msg: 'Not able to process at this time.',
                    buttons: [{
                        text: 'Ok'
                    }]
                });
                deferred.reject();
            }
        });

        return deferred.promise;
    },

    setCurrentView: function (view, params) {
        //console.log('setCurrentView called');
        var me = this,
            vm = me.getViewModel(),
            contentPanel = me.getView().down('#contentPanel');

        // console.info(!contentPanel);
        // console.info(view);
        //console.info(contentPanel.down());
        //console.info(contentPanel.down().xtype === view);
        if (!contentPanel || view === '' || (contentPanel.down() && contentPanel.down().xtype === view)) {
            //console.log('before returning false');
            return false;
        }

        Ext.suspendLayouts();
        contentPanel.removeAll(true);
        contentPanel.add(
            Ext.apply({
                xtype: view
            }, params)
        );
        Ext.resumeLayouts(true);
    },

    onClickCancel: function (e) {
        console.log('onClickCancel called');
        //console.info(e);
        var me = this,
            contentPanel = me.getView().down('#contentPanel').down().xtype;
        var addBtn = me.getView().up().down('#add2');
        console.info(addBtn);
        console.info(contentPanel);
        if (contentPanel === 'noteform') {
            me.setCurrentView('notelist');
            addBtn.setText('Add');
        } else {
            me.getView().close();
        }

    },

    onClickAdd2: function (btn, e) {
        console.log('onClickAdd2 called');
        // on list page then show note form
        var me = this,
            contentPanel = me.getView().down('#contentPanel').down().xtype,
            vm = me.getViewModel();
        var noteType = me.lookupReference('noteType'),
            noteAction = me.lookupReference('noteAction'),
            noteDetail = me.lookupReference('noteDetail'),
            noteComplete = me.lookupReference('noteComplete'),
            noteFollowUpDate = me.lookupReference('noteFollowUpDate'),
            noteText = me.lookupReference('noteText'),
            theNote = vm.get('theNote');



        if (contentPanel === 'noteform') {
            console.log('save the record or update the record');
            console.info(noteType.getValue());
            console.info(noteAction.getValue());
            console.info(noteDetail.getValue());
            console.info(noteFollowUpDate.getValue());
            console.info(noteComplete.getValue());


            // validate data - email
            if (noteAction.getValue() === 'E') {
                var ereg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                var testResult = ereg.test(noteDetail.getRawValue());
                if (!testResult) {
                    noteDetail.markInvalid('Invalid Email Address');
                    Valence.util.Helper.showSnackbar('Please enter a valid email address.');
                    return false;
                }
            }

            // validate data - phone number
            if (noteAction.getValue() === 'P') {
                var phoneReg = /^\d+$/;
                var phoneNumber = noteDetail.getRawValue();
                var testResult = phoneReg.test(phoneNumber);
                if (!testResult) {
                    noteDetail.markInvalid('Phone number should contain numbers only.');
                    Valence.util.Helper.showSnackbar('Phone number should contain numbers only.');
                    return false;
                }
            }

            // validate data -  follow up date
            if (noteType.getValue() == 'F') {
                if (noteAction.getValue() == null || noteDetail.getValue() == null || noteFollowUpDate.getValue() == null) {
                    if (noteAction.getValue() == null) {
                        noteAction.markInvalid('Follow up note must have an action');
                        //Valence.util.Helper.showSnackbar('Follow up note must have a date');
                    }
                    if (noteDetail.getValue() == '') {
                        noteDetail.markInvalid('Follow up note must have detail');
                    }
                    if (noteFollowUpDate.getValue() == null) {
                        noteFollowUpDate.markInvalid('Follow up note must have a date');
                        // Valence.util.Helper.showSnackbar('Follow up note must have a date');
                    }
                    Valence.util.Helper.showSnackbar('Follow up note must have action, detail and date.');
                    return false;
                }

            }

            // validate data - Neither note type nor note text should be empty.
            if (noteType.getValue() == null || noteText.getValue() == '') {
                if (noteType.getValue() == null) {
                    me.lookupReference('noteType').markInvalid('Note type cannot be empty.');
                }
                if (noteText.getValue() == '') {
                    me.lookupReference('noteText').markInvalid('Note content cannot be empty.');
                }
                Valence.util.Helper.showSnackbar('Please enter note type and note.');
                return false;
            }


            // // save new note
            // console.info(Ext.Object.getKeys(theNote.data));
            if (!(Ext.Object.getKeys(theNote.data).indexOf('OFCRTDATE') > -1)) {
                console.log('saving new note');
                // Need to add more attributes when back end is ready
                me.processNote(Ext.clone({
                    OFTYPE: noteType.getValue(),
                    OFFUPACT: noteAction.getValue(),
                    OFFUPCMP: noteComplete.getValue(),
                    OFFUPDET: noteDetail.getRawValue(),
                    OFFUPDAT: noteFollowUpDate.getValue(),
                    OFNOTE: noteText.getValue(),
                }), 'Saving')
                    .then(function (data) {
                        console.info(data);
                        if (!Ext.isEmpty(data.success)) {
                            delete data.success;
                        }
                        me.setCurrentView('notelist');
                        btn.setText('Add');
                    });
            } else {
                // Update the existing note
                console.log('updating existing note');
                if (theNote.dirty) {
                    console.info(theNote.data);
                    me.processNote(Ext.clone(theNote.data), 'updating')
                        .then(function (data) {
                            console.info(data);
                            theNote.commit();
                            Valence.util.Helper.showSnackbar('Updated');
                            me.setCurrentView('notelist');
                            btn.setText('Add');
                        })
                } else {
                    me.setCurrentView('notelist');
                    btn.setText('Add');
                }
            }
        } else {
            this.setCurrentView('noteform');

            // Clear the form cache 
            vm.set('theNote', {});

            // change text add to 'save'
            btn.setText('Save');
        }
    },
    // onClickDatePicker: function () {
    //     console.log('onClickDatePicker called');
    //     //var todayBtn =
    //     console.info(Ext.get('fuDatePicker').query('a'))
    // }
});