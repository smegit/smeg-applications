Ext.define('Shopping.view.cart.notes.NotesController', {
    extend: 'Ext.app.ViewController',
    requires: [
        'Ext.*',
        'Shopping.model.Note',
        'Shopping.view.cart.notes.Update',
        //'Shopping.view.cart.notes.Notes',
        'Shopping.view.cart.notes.NoteList',
        'Shopping.view.cart.notes.NoteForm'
    ],
    alias: 'controller.notes',
    initViewModel: function (vm) {
        var cartVm = this.getView().up().down('shoppingstore').getViewModel();
        console.info(cartVm);
        console.log('initViewModel called');
        vm.set({
            disableAddButton: true,
            disableUpdateButton: true,
            orderKey: cartVm.get('activeCartNumber')
        });
    },

    init: function () {
        this.setCurrentView('notelist');
    },
    getNotesStore: function () {
        var me = this,
            view = me.getView();
        return view.lookupViewModel().getStore('Notes');
    },
    onLoadNotes: function () {
        console.log('onLoadNotes called');
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
        console.log('onItemClick called');
        console.info(rec);
        var me = this,
            vm = me.getViewModel(),
            view = me.getView();

        //me.lookupReference('noteText').focus();

        //addBtn = view.up().down('#add2');
        console.info(rec);
        //console.info(addBtn);
        //me.setCurrentView('noteform');
        //addBtn.setText('Save');
        // won't need after upgrade
        //e.stopPropagation();
    },


    onDeactivate: function () {
        console.log('deactivate called');
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
        console.info(vm.getStore('Notes'));
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
        if (view == 'notelist' && vm.getStore('Notes') != null) {
            // console.log('setting notelist');
            // console.info(vm.getStore('Notes'));
            // console.info(Ext.getCmp('notelist').getView());
            // // console.info(me.lookupReference('noteslist').down('tableview'));
            // Ext.getCmp('notelist').getView().setStore(vm.getStore('Notes'));
            // Ext.getCmp('notelist').getView().gird.reload();
            // console.info(Ext.getCmp('notelist').getView());

            // console.info(me.lookupReference('noteslist').down('tableview'));
            //vm.getStore('Notes').load();


        }

    },

    onClickCancel: function (e) {
        console.log('onClickCancel called');
        //console.info(e);
        var me = this,
            vm = me.getViewModel(),
            theNote = vm.get('theNote');
        if (theNote) {
            if (theNote.dirty) {
                Ext.MessageBox.show({
                    title: 'Save Changes?',
                    msg: 'You are closing a page that has unsaved changes.<br />Would you like to save your changes?',
                    buttons: Ext.MessageBox.YESNO,
                    scope: me,
                    fn: function (btn) {
                        console.info(btn);
                        if (btn == 'yes') {
                            console.log('you pressed yes');
                            me.onClickSave();
                        } else {
                            console.log('you pressed no');
                            theNote.reject();
                            me.getView().close();
                        }
                    },
                    //animateTarget: btn,
                    icon: Ext.MessageBox.QUESTION,
                });
            } else {
                me.getView().close();
            }
        } else {
            me.getView().close();
        }





    },

    detailValidation: function () {
        console.log('detailValidation called');
        var me = this,
            noteAction = me.lookupReference('noteAction'),
            noteDetail = me.lookupReference('noteDetail');
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
        return false;
    },
    dateValidation: function () {
        console.log('dateValidation called');
        var me = this,
            noteAction = me.lookupReference('noteAction'),
            noteFollowUpDate = me.lookupReference('noteFollowUpDate');
        // validate date - date
        if (noteAction.getValue() === 'E') {
            var fuDate = noteFollowUpDate.getValue();
            if (!fuDate) {
                noteFollowUpDate.markInvalid('Date is required for sending email');
                return false;
            }
        }
        return false;
    },


    onClickSave: function (btn, e) {
        console.log('onSave called');
        // on list page then show note form
        var me = this,
            //contentPanel = me.getView().down('#contentPanel').down().xtype,
            vm = me.getViewModel(),
            noteForm = me.getView().down('noteform'),
            newRecord;
        var noteType = me.lookupReference('noteType'),
            noteAction = me.lookupReference('noteAction'),
            noteDetail = me.lookupReference('noteDetail'),
            noteComplete = me.lookupReference('noteComplete'),
            noteFollowUpDate = me.lookupReference('noteFollowUpDate'),
            noteText = me.lookupReference('noteText'),
            theNote = vm.get('theNote');
        console.log('save the record or update the record');
        console.info(noteType.getValue());
        console.info(noteAction.getValue());
        console.info(noteDetail.getValue());
        console.info(noteFollowUpDate.getValue());
        console.info(noteComplete.getValue());
        console.info(noteForm);

        // // validate data -  follow up date
        // if (noteType.getValue() == 'F') {
        //     if (noteAction.getValue() == null || noteDetail.getValue() == null || noteFollowUpDate.getValue() == null) {
        //         if (noteAction.getValue() == null) {
        //             noteAction.markInvalid('Follow up note must have an action');
        //             //Valence.util.Helper.showSnackbar('Follow up note must have a date');
        //         }
        //         if (noteDetail.getValue() == '') {
        //             noteDetail.markInvalid('Follow up note must have detail');
        //         }
        //         if (noteFollowUpDate.getValue() == null) {
        //             noteFollowUpDate.markInvalid('Follow up note must have a date');
        //             // Valence.util.Helper.showSnackbar('Follow up note must have a date');
        //         }
        //         Valence.util.Helper.showSnackbar('Follow up note must have action, detail and date.');
        //         return false;
        //     }
        // }


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

        // validate data - If follow_up = 'email' then date cannot be empty
        if (noteAction.getValue() == 'E') {
            if (noteDetail.getValue() == null) {
                noteDetail.markInvalid('Note detail is required');
            }
            if (noteDetail.getValue() == null) {
                noteFollowUpDate.markInvalid('Note follow up date is required');
            }
            if (noteDetail.getValue() == null || noteDetail.getValue() == null) {
                return false;
            }
        }
        if (!noteDetail.isValid) return false;


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
                    var resp = data;
                    console.info(data);
                    if (!Ext.isEmpty(data.success)) {
                        delete data.success;
                    }
                    //data.dateTime = new Date(date.OFCRTDATE + ' ' + data.OFCRTTIME);
                    //var dt = new Date(date.OFCRTDATE + ' ' + data.OFCRTTIME);
                    if (!Ext.isEmpty(data.dateTime)) {
                        delete data.dateTime;
                    }

                    var t = data.OFCRTTIME.replace(/\./g, ":");
                    Ext.apply(data, {
                        OFCRTTIME: t
                    });
                    console.info(data);
                    //console.log(data.OFCRTDATE + ' ' + data.OFCRTTIME + ' ' + data.dateTime);
                    console.info(Ext.create('Shopping.model.Note', data));
                    vm.getStore('Notes').add(Ext.create('Shopping.model.Note', data));
                    console.info(vm.getStore('Notes'));
                    console.info(me.lookupReference('notelist'));
                    me.lookupReference('notelist').getSelectionModel().select(0);
                    me.lookupReference('notelist').getView().focusRow(0);
                    me.lookupReference('noteText').focus();

                    // Ext.getCmp('notelist').getView().setStore(vm.getStore('Notes'));
                });
        } else {
            // Update the existing note
            if (theNote.dirty) {
                console.log('updating existing note');
                console.info(theNote.data);
                me.processNote(Ext.clone(theNote.data), 'updating')
                    .then(function (data) {
                        console.info(data);
                        theNote.commit();
                        me.lookupReference('noteText').focus();
                        Valence.util.Helper.showSnackbar('Updated');
                    })
            } else {
                console.log('nothing should be done.');
            }
        }
        // Clear the form cache 
        vm.set('theNote', {});
    },
    // onClickDatePicker: function () {
    //     console.log('onClickDatePicker called');
    //     //var todayBtn =
    //     console.info(Ext.get('fuDatePicker').query('a'))
    // }
    onBeforeShow: function () {
        console.log('onBeforeShow called');
        var me = this,
            vm = me.getViewModel();
        console.info(vm);
    },
    onClose: function () {
        var me = this;
        var noteWin = Ext.ComponentQuery.query('window[title*="Notes"]')[0];
        var notesWindow = me.lookupReference('notesWin');
        console.log('onClose called');
        // console.info(noteWin);
        // console.info(me.getView());
        // me.getView().show();
    },
    onLoad: function () {
        console.log('onLoad called');
    },
    onClickAddNote: function () {
        console.log('onClickAddNote called');
        var me = this,
            vm = me.getViewModel(),
            notelist = me.lookupReference('notelist');
        console.info(vm);

        var theNote = vm.get('theNote');
        console.info(theNote);
        console.info(Ext.Object.isEmpty(theNote));

        // if unsaved note
        if (!Ext.Object.isEmpty(theNote)) {
            console.info(theNote.hasOwnProperty('data'));
            console.info(theNote.dirty);
            if (theNote.hasOwnProperty('data')) {
                if (theNote.dirty) {
                    Ext.MessageBox.show({
                        title: 'Save Changes?',
                        msg: 'You are closing a page that has unsaved changes.<br />Would you like to save your changes?',
                        buttons: Ext.MessageBox.YESNO,
                        scope: me,
                        fn: function (btn) {
                            console.info(btn);
                            if (btn == 'yes') {
                                console.log('you pressed yes');
                                me.onClickSave();
                            } else {
                                console.log('you pressed no');
                                theNote.reject();
                                vm.set('theNote', {});
                                me.lookupReference('noteType').focus();
                                console.info(me.lookupReference('notelist').getSelectionModel());
                                notelist.getSelectionModel().deselectAll();
                                //return true;
                            }
                        },
                        //animateTarget: btn,
                        icon: Ext.MessageBox.QUESTION,
                    });
                } else {
                    vm.set('theNote', {});
                    me.lookupReference('noteType').focus();
                    console.info(me.lookupReference('notelist').getSelectionModel());
                    notelist.getSelectionModel().deselectAll();
                }
            } else {
                Ext.MessageBox.show({
                    title: 'Save Changes?',
                    msg: 'You are closing a page that has unsaved changes.<br />Would you like to save your changes?',
                    buttons: Ext.MessageBox.YESNO,
                    scope: me,
                    fn: function (btn) {
                        console.info(btn);
                        if (btn == 'yes') {
                            console.log('you pressed yes');
                            me.onClickSave();
                        } else {
                            console.log('you pressed no');
                            //theNote.reject();
                            vm.set('theNote', {});
                            me.lookupReference('noteType').focus();
                            console.info(me.lookupReference('notelist').getSelectionModel());
                            notelist.getSelectionModel().deselectAll();
                            //return true;
                        }
                    },
                    //animateTarget: btn,
                    icon: Ext.MessageBox.QUESTION,
                });
            }
        } else {
            vm.set('theNote', {});
            me.lookupReference('noteType').focus();
            //console.info(me.lookupReference('notelist').getSelectionModel());
            notelist.getSelectionModel().deselectAll();
        }
    },

    onBeforeShow: function () {
        console.log('onBeforeShow called');
        var me = this,
            vm = me.getViewModel();
        console.info(vm);


        //vm.set('theNote', {});
    },
    onBeforeSelect: function (rowModel, rec, index) {
        console.log('onBeforeSelect called');
        console.info(rowModel);
        console.info(rec);
        console.info(index);
        var me = this,
            vm = me.getViewModel(),
            theNote = vm.get('theNote');
        console.info(theNote);
        if (theNote.dirty) {
            console.log('theNote dirty');
            // Todo - confirm window to save data
            Ext.MessageBox.show({
                title: 'Save Changes?',
                msg: 'You are closing a page that has unsaved changes.<br />Would you like to save your changes?',
                buttons: Ext.MessageBox.YESNO,
                scope: me,
                fn: function (btn) {
                    console.info(btn);
                    if (btn == 'yes') {
                        console.log('you pressed yes');
                        me.onClickSave();
                    } else {
                        console.log('you pressed no');
                        theNote.reject();
                        me.lookupReference('notelist').getSelectionModel().select(index);

                        return true;
                    }
                },
                //animateTarget: btn,
                icon: Ext.MessageBox.QUESTION,
            });
            return false;
        }
        //return false;
    },
    // onBeforeItemClick: function () {
    //     console.log('onBeforeItemClick');
    // },

    onMessageBoxClick: function (btn) {
        var me = this;
        console.log('onMessageBoxClick called');
        if (btn == 'yes') {
            console.log('you pressed yes');
            me.onClickSave;
        } else {
            console.log('you pressed no');
        }
    },
    onLoadNoteList: function () {
        console.log('onLoadNoteList called');
    },
    onAfterRenderNoteList: function (cmp) {
        console.log('onAfterRenderNotesList called');
    },
    onFormShow: function () {
        console.log('onFormShow called');
    },
    onNoteListSelect: function () {
        console.log('noNoteListSelect called');
        var me = this;
        me.lookupReference('noteText').focus();
    },

    onNoteActionItemClick: function (evt) {
        console.log('onNoteActionItemClick called');
        console.info(evt);
        var me = this;
        console.info(me.lookupReference('noteAction'));
    },

    onSelectNoteAction: function (combo, record) {
        // Change the detail lable
        var me = this,
            noteDetail = me.lookupReference('noteDetail');
        console.info(record);
        if (!Ext.isEmpty(record)) {
            if (record.data.NOTEACTC == 'P') {
                noteDetail.setFieldLabel('Phone')
            } else if (record.data.NOTEACTC == 'E') {
                noteDetail.setFieldLabel('Email');
            } else if (record.data.NOTEACTC == 'V') {
                noteDetail.setHidden(true);
            }
        }


    }

        me.lookupReference('notelist').getSelectionModel().select(0);

    }


});