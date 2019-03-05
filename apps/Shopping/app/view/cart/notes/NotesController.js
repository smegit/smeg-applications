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
    id: 'notes',
    initViewModel: function (vm) {
        var cartVm = this.getView().up().down('shoppingstore').getViewModel();
        // console.info(cartVm);
        // console.log('initViewModel called');
        vm.set({
            disableAddButton: true,
            disableUpdateButton: true,
            orderKey: cartVm.get('activeCartNumber')
        });
    },

    init: function () {
        //this.setCurrentView('notelist');
    },
    getNotesStore: function () {
        var me = this,
            view = me.getView();
        return view.lookupViewModel().getStore('Notes');
    },
    // onLoadNotes: function () {
    //     console.log('onLoadNotes called');
    // },

    onChangeNote: function (cmp, value) {
        //console.log('onChangeNote called');
        var me = this,
            vm = me.getViewModel(),
            theNote = vm.get('theNote');

        // trick part, if don't setTimeout, then theNote.dirty cannot be captured at the first key strike.
        setTimeout(function () {
            //me.lookupReference('saveBtn').setDisabled(true);
            //console.info(theNote);
            if (!Ext.Object.isEmpty(theNote)) {
                //console.log('debugy');
                if (theNote.hasOwnProperty('data')) {
                    //console.log('has data');
                    if (theNote.dirty) {
                        //console.log('has dirty');
                        me.lookupReference('saveBtn').setDisabled(false);
                        me.lookupReference('saveBtn').setHidden(false);
                        me.lookupReference('addNoteBtn').setHidden(true);
                        me.lookupReference('exitBtn').setText('Cancel');
                        //console.log('dirty end');
                    }
                } else {
                    //console.log('not dirty');
                    me.lookupReference('saveBtn').setDisabled(false);
                    me.lookupReference('saveBtn').setHidden(false);
                    me.lookupReference('addNoteBtn').setHidden(true);
                    me.lookupReference('exitBtn').setText('Cancel');
                    //console.log('not dirty end');
                }

            }
        }, 100);


        //vm.set('disableAddButton', Ext.isEmpty(value));
    },
    // onSelectTypeChange: function () {
    //     console.log('onSelectTypeChange');
    //     var me = this,
    //         vm = me.getViewModel(),
    //         theNote = vm.get('theNote');
    //     console.info(theNote);
    //     setTimeout(function () {
    //         if (theNote.dirty) {
    //             console.log('debugy');
    //             me.lookupReference('saveBtn').setDisabled(false);
    //         }
    //     }, 200);

    // },

    // enable the save button
    onTypeSelect: function (cmp, newValue, oldValue) {
        // console.log('onTypeSelect');
        // console.info(cmp);
        // console.info(newValue);
        // console.info(oldValue);
        var me = this,
            vm = me.getViewModel(),
            theNote = vm.get('theNote');
        //console.info(theNote);
        setTimeout(function () {
            if (!Ext.Object.isEmpty(theNote)) {
                //console.log('debugy');
                if (theNote.hasOwnProperty('data')) {
                    if (theNote.dirty) {
                        me.lookupReference('saveBtn').setDisabled(false);
                        me.lookupReference('saveBtn').setHidden(false);
                        me.lookupReference('addNoteBtn').setHidden(true);
                        me.lookupReference('exitBtn').setText('Cancel');
                    }
                } else {
                    //console.log('has note data');
                    me.lookupReference('saveBtn').setDisabled(false);
                    me.lookupReference('saveBtn').setHidden(false);
                    me.lookupReference('addNoteBtn').setHidden(true);
                    me.lookupReference('exitBtn').setText('Cancel');
                }
            }
        }, 200);


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
        //console.log('onItemDblClick called');
        //console.info(rec);
        var me = this,
            vm = me.getViewModel(),
            view = me.getView();

        //me.lookupReference('noteText').focus();
        //addBtn = view.up().down('#add2');
        //console.info(rec);
        //console.info(addBtn);
        //me.setCurrentView('noteform');
        //addBtn.setText('Save');
        // won't need after upgrade
        //e.stopPropagation();
    },


    // onDeactivate: function () {
    //     console.log('deactivate called');
    // },

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
        //console.info(params);
        if (!Ext.isEmpty(params.dateTime)) {
            delete params.dateTime;
        }
        if (!Ext.isEmpty(params.id)) {
            delete params.id;
        }

        if (!Ext.isEmpty(params)) {
            if (params.hasOwnProperty('OFFUPCMP')) {
                if (params.OFFUPCMP == true) {
                    params.OFFUPCMP = '1';
                } else {
                    params.OFFUPCMP = '0';
                }
            }

        }
        //console.info(params);
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

    // setCurrentView: function (view, params) {
    //     //console.log('setCurrentView called');
    //     var me = this,
    //         vm = me.getViewModel(),
    //         contentPanel = me.getView().down('#contentPanel');

    //     // console.info(!contentPanel);
    //     //console.info(vm.getStore('Notes'));
    //     //console.info(contentPanel.down());
    //     //console.info(contentPanel.down().xtype === view);
    //     if (!contentPanel || view === '' || (contentPanel.down() && contentPanel.down().xtype === view)) {
    //         //console.log('before returning false');
    //         return false;
    //     }


    //     Ext.suspendLayouts();
    //     contentPanel.removeAll(true);
    //     contentPanel.add(
    //         Ext.apply({
    //             xtype: view
    //         }, params)
    //     );
    //     Ext.resumeLayouts(true);
    //     if (view == 'notelist' && vm.getStore('Notes') != null) {
    //         // console.log('setting notelist');
    //         // console.info(vm.getStore('Notes'));
    //         // console.info(Ext.getCmp('notelist').getView());
    //         // // console.info(me.lookupReference('noteslist').down('tableview'));
    //         // Ext.getCmp('notelist').getView().setStore(vm.getStore('Notes'));
    //         // Ext.getCmp('notelist').getView().gird.reload();
    //         // console.info(Ext.getCmp('notelist').getView());

    //         // console.info(me.lookupReference('noteslist').down('tableview'));
    //         //vm.getStore('Notes').load();


    //     }

    // },

    onClickCancel: function (e) {
        //console.log('onClickCancel called');
        //console.info(e);
        var me = this,
            vm = me.getViewModel(),
            theNote = vm.get('theNote');
        if (!Ext.Object.isEmpty(theNote)) {
            // if the form has unsaved selected value
            if (theNote.hasOwnProperty('data')) {
                if (theNote.dirty) {
                    // Ext.MessageBox.show({
                    //     title: 'Save Changes?',
                    //     msg: 'You are closing a page that has unsaved changes.<br />Would you like to save your changes?',
                    //     buttons: Ext.MessageBox.YESNO,
                    //     scope: me,
                    //     fn: function (btn) {
                    //         console.info(btn);
                    //         if (btn == 'yes') {
                    //             console.log('you pressed yes');
                    //             me.onClickSave()
                    //                 .then(function (data) {
                    //                     if (data.success) {
                    //                         console.log('saved and exit');
                    //                         me.lookupReference('notelist').setDisabled(false);
                    //                         //me.getView().close();
                    //                         me.lookupReference('addNoteBtn').setHidden(false);
                    //                         me.lookupReference('saveBtn').setHidden(true);
                    //                     }
                    //                 });
                    //         } else {
                    //             console.log('you pressed no');
                    //             theNote.reject();
                    //             me.lookupReference('notelist').setDisabled(false);
                    //             me.lookupReference('exitBtn').setText('Exit');
                    //             me.lookupReference('saveBtn').setDisabled(true);
                    //             me.lookupReference('saveBtn').setHidden(true);
                    //             me.lookupReference('noteText').focus();
                    //             me.lookupReference('addNoteBtn').setHidden(false);
                    //             //me.getView().close();
                    //         }
                    //     },
                    //     //animateTarget: btn,
                    //     icon: Ext.MessageBox.QUESTION,
                    // });
                    theNote.reject();
                    me.lookupReference('notelist').setDisabled(false);
                    me.lookupReference('exitBtn').setText('Exit');
                    me.lookupReference('saveBtn').setDisabled(true);
                    me.lookupReference('saveBtn').setHidden(true);
                    //me.lookupReference('noteText').focus();
                    me.lookupReference('addNoteBtn').setHidden(false);
                    //me.getView().close();
                } else {
                    me.getView().close();
                }
            } else {
                // if the form has unsaved and newly added value
                // Ext.MessageBox.show({
                //     title: 'Save Changes?',
                //     msg: 'You are closing a page that has unsaved changes.<br />Would you like to save your changes?',
                //     buttons: Ext.MessageBox.YESNO,
                //     scope: me,
                //     fn: function (btn) {
                //         console.info(btn);
                //         if (btn == 'yes') {
                //             console.log('you pressed yes');
                //             me.onClickSave()
                //                 .then(function (data) {
                //                     if (data.success) {
                //                         me.lookupReference('notelist').setDisabled(false);
                //                         //me.getView().close();
                //                     }
                //                 });

                //         } else {
                //             console.log('you pressed no');
                //             me.lookupReference('exitBtn').setText('Exit');
                //             me.lookupReference('notelist').setDisabled(false);
                //             me.lookupReference('notelist').getSelectionModel().select(0);
                //             me.lookupReference('notelist').getView().focusRow(0);
                //             me.lookupReference('noteText').focus();
                //             me.lookupReference('saveBtn').setHidden(true);
                //             me.lookupReference('addNoteBtn').setHidden(false);

                //             //vm.set('theNote', {});
                //             //me.lookupReference('noteType').focus();
                //             //theNote.reject();
                //             //me.getView().close();
                //         }
                //     },
                //     //animateTarget: btn,
                //     icon: Ext.MessageBox.QUESTION,
                // });
                vm.set('theNote', {});
                me.lookupReference('exitBtn').setText('Exit');
                me.lookupReference('notelist').setDisabled(false);
                //console.info(me.lookupReference('notelist').getStore().getCount());
                if (me.lookupReference('notelist').getStore().getCount() > 0) {
                    me.lookupReference('notelist').getSelectionModel().select(0);
                    me.lookupReference('notelist').getView().focusRow(0);
                    //me.lookupReference('noteText').focus();
                } else {
                    //me.lookupReference('noteType').focus();
                }

                me.lookupReference('saveBtn').setHidden(true);
                me.lookupReference('addNoteBtn').setHidden(false);
            }
        } else {
            //console.log('getcalled');
            me.lookupReference('exitBtn').setText('Exit');
            me.lookupReference('notelist').setDisabled(false);
            if (me.lookupReference('notelist').getStore().getCount() > 0) {
                me.lookupReference('notelist').getSelectionModel().select(0);
                me.lookupReference('notelist').getView().focusRow(0);
                //me.lookupReference('noteText').focus();
            } else {
                //me.lookupReference('noteType').focus();
                me.getView().close();
            }
            me.lookupReference('addNoteBtn').setHidden(false);
            me.lookupReference('saveBtn').setHidden(true);
            if (me.lookupReference('exitBtn').getText() == 'EXIT') {
                //me.getView().close();
            }
            //me.getView().close();
        }
    },

    detailValidation: function () {
        //console.log('detailValidation called');
        var me = this,
            noteAction = me.lookupReference('noteAction'),
            noteDetail = me.lookupReference('noteDetail'),
            vm = me.getViewModel(),
            mainVm = Ext.getCmp('app-main').getViewModel(),
            noteDetailOpts = me.getViewModel().getStore('NoteDetailOpts');
        //console.info(noteDetailOpts);
        // validate data - email
        if (noteAction.getValue() === 'E') {
            var ereg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            var v = noteDetail.getRawValue();
            if (noteDetailOpts.find('EMLDSC', v, 0, false, true, true) < 0 || v == 'Enter email address') {
                var testResult = ereg.test(noteDetail.getRawValue());
                if (!testResult) {
                    noteDetail.markInvalid('Invalid Email Address');
                    Valence.util.Helper.showSnackbar('Please enter a valid email address.');
                    return false;
                }
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
        return true;
    },
    dateValidation: function () {
        //console.log('dateValidation called');
        var me = this,
            noteAction = me.lookupReference('noteAction'),
            noteFollowUpDate = me.lookupReference('noteFollowUpDate');
        // validate date - date
        if (noteAction.getValue() === 'E') {
            var fuDate = noteFollowUpDate.getValue();
            if (!fuDate) {
                noteFollowUpDate.markInvalid('Date is required for sending email');
                Valence.util.Helper.showSnackbar('Date is required.');
                return false;
            }
        }
        return false;
    },


    onClickSave: function (btn, e) {

        var deferred = new Ext.Deferred(); // create the Ext.Deferred object
        //console.log('onSave called');
        if (btn == 'no') return false;
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
        // console.log('save the record or update the record');
        // console.info(noteType.getValue());
        // console.info(noteAction.getValue());
        // console.info(noteDetail);
        // console.info(noteFollowUpDate.getValue());
        // console.info(noteComplete.getValue());
        // console.info(noteForm);

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

            deferred.reject({ 'success': false });
            return false;
        }

        // validate data - If follow_up = 'email' then date cannot be empty
        if (noteAction.getValue() == 'E') {
            //console.log('Email selected');
            if (noteDetail.getValue() == null || noteDetail.getValue() == '') {
                noteDetail.markInvalid('Email is required');
            }
            if (noteFollowUpDate.getValue() == null || noteFollowUpDate.getValue() == '') {
                noteFollowUpDate.markInvalid('Follow up date is required');
            }
            if (noteDetail.getValue() == null || noteDetail.getValue() == '' || noteFollowUpDate.getValue() == null || noteFollowUpDate.getValue() == '') {
                //return false;
                Valence.util.Helper.showSnackbar('Please enter follow up date and email.');
                deferred.reject({ 'success': false });
                return false;
            }
        }
        //console.info(noteDetail);
        if (!me.detailValidation()) {
            deferred.reject({ 'success': false });
            return false;
        }


        // // save new note
        // console.info(Ext.Object.getKeys(theNote.data));
        if (!(Ext.Object.getKeys(theNote.data).indexOf('OFCRTDATE') > -1)) {

            var offupcode = noteDetail.getValue();
            var ereg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            var phoneReg = /^\d+$/;
            if (ereg.test(offupcode)) {
                offupcode = '*EMAIL'
            }
            if (phoneReg.test(offupcode)) {
                offupcode = '*PHONE'
            }

            //console.log('saving new note');
            // Need to add more attributes when back end is ready
            me.processNote(Ext.clone({
                OFTYPE: noteType.getValue(),
                OFFUPACT: noteAction.getValue(),
                OFFUPCMP: noteComplete.getValue(),
                OFFUPDET: noteDetail.getRawValue(),
                OFFUPDAT: noteFollowUpDate.getValue(),
                OFNOTE: noteText.getValue(),
                //OFFUPCOD: noteDetail.getValue()
                OFFUPCOD: offupcode
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
                    var ut = data.OFCHGTIME.replace(/\./g, ":");
                    Ext.apply(data, {
                        OFCRTTIME: t,
                        OFCHGTIME: ut
                    });
                    //console.info(data);
                    //console.log(data.OFCRTDATE + ' ' + data.OFCRTTIME + ' ' + data.dateTime);
                    //console.info(Ext.create('Shopping.model.Note', data));
                    vm.getStore('Notes').add(Ext.create('Shopping.model.Note', data));
                    console.info(vm.getStore('Notes'));
                    //console.info(me.lookupReference('notelist'));
                    //vm.set('justsaved', true);
                    me.lookupReference('saveBtn').setDisabled(true);
                    me.lookupReference('saveBtn').setHidden(true);
                    me.lookupReference('notelist').setDisabled(false);
                    me.lookupReference('addNoteBtn').setHidden(false);
                    me.lookupReference('exitBtn').setText('Exit');
                    me.lookupReference('notelist').getSelectionModel().select(0);
                    me.lookupReference('notelist').getView().focusRow(0);
                    //me.lookupReference('noteText').focus();
                    Valence.util.Helper.showSnackbar('Saved');



                    //return true;
                    deferred.resolve({ 'success': true });


                    // Ext.getCmp('notelist').getView().setStore(vm.getStore('Notes'));
                });
        } else {
            // Update the existing note
            if (theNote.dirty) {
                //console.log('updating existing note');
                //console.info(theNote);

                var record = theNote.data;
                if (record.OFFUPACT == 'P') {
                    Ext.apply(record, { OFFUPCOD: '*PHONE' })
                }
                // unkown reason: theNote.data has 'OFFUPDAT' undefined
                Ext.apply(record, { "OFFUPDAT": noteFollowUpDate.getValue(), OFFUPDET: noteDetail.getRawValue() })
                //console.info(record);
                me.processNote(record, 'updating')
                    .then(function (data) {
                        //console.info(data);
                        //theNote.commit();
                        var ut = data.OFCHGTIME.replace(/\./g, ":");
                        var rec = vm.getStore('Notes').findRecord('OFSEQ', data.OFSEQ);
                        rec.set('OFCHGDATE', data.OFCHGDATE);
                        rec.set('OFCHGTIME', ut);
                        rec.set('OFCHGUSER', data.OFCHGUSER);
                        rec.set('updatedRender', ut);
                        rec.set('OFFUPDET', data.OFFUPDET);
                        //console.info(vm.getStore('Notes'));
                        theNote.commit();
                        //me.lookupReference('noteText').focus();
                        me.lookupReference('saveBtn').setDisabled(true);
                        me.lookupReference('saveBtn').setHidden(true);
                        me.lookupReference('addNoteBtn').setHidden(false);
                        me.lookupReference('notelist').setDisabled(false);
                        me.lookupReference('exitBtn').setText('Exit');
                        Valence.util.Helper.showSnackbar('Saved');
                        //return true;

                        deferred.resolve({ 'success': true });

                    })
            } else {
                //console.log('nothing should be done.');
                //me.lookupReference('noteText').focus();
                me.lookupReference('saveBtn').setDisabled(true);
                me.lookupReference('saveBtn').setHidden(true);
                me.lookupReference('addNoteBtn').setHidden(false);
                me.lookupReference('notelist').setDisabled(false);
                me.lookupReference('exitBtn').setText('Exit');
                //return true;
            }
        }
        // Clear the form cache 
        //vm.set('theNote', {});
        return deferred.promise;
    },
    // onClickDatePicker: function () {
    //     console.log('onClickDatePicker called');
    //     //var todayBtn =
    //     console.info(Ext.get('fuDatePicker').query('a'))
    // }
    // onClose: function () {
    //     var me = this;
    //     var noteWin = Ext.ComponentQuery.query('window[title*="Notes"]')[0];
    //     var notesWindow = me.lookupReference('notesWin');
    //     console.log('onClose called');
    //     // console.info(noteWin);
    //     // console.info(me.getView());
    //     // me.getView().show();
    // },
    // onLoad: function () {
    //     console.log('onLoad called');
    // },
    onClickAddNote: function () {
        console.log('onClickAddNote called');
        var me = this,
            vm = me.getViewModel(),
            notelist = me.lookupReference('notelist'),
            noteType = me.lookupReference('noteType'),
            noteAction = me.lookupReference('noteAction'),
            noteFollowUpDate = me.lookupReference('noteFollowUpDate'),
            noteComplete = me.lookupReference('noteComplete'),
            noteDetail = me.lookupReference('noteDetail'),
            noteText = me.lookupReference('noteText');

        // Reset form fields
        noteType.setDisabled(false);
        noteAction.setDisabled(false);
        noteComplete.setDisabled(false);
        noteFollowUpDate.setDisabled(false);
        noteDetail.setDisabled(false);
        noteText.setDisabled(false);;
        me.lookupReference('exitBtn').setText('Cancel');
        me.lookupReference('addNoteBtn').setHidden(true);
        me.lookupReference('saveBtn').setHidden(false);
        // console.info(vm);
        // console.info(notelist);

        var theNote = vm.get('theNote');
        // console.info(theNote);
        // console.info(Ext.Object.isEmpty(theNote));
        vm.set('theNote', {});
        me.lookupReference('noteDetail').setHidden(true);
        me.lookupReference('noteFollowUpDate').setHidden(true);
        me.lookupReference('noteCreated').setValue(null);
        me.lookupReference('noteUpdated').setValue(null);
        //me.lookupReference('noteType').focus();
        //console.info(me.lookupReference('notelist').getSelectionModel());
        notelist.getSelectionModel().deselectAll();
        //notelist.setDisableSelection(true);
        // if unsaved note
        // if (!Ext.Object.isEmpty(theNote)) {
        //     console.info(theNote.hasOwnProperty('data'));
        //     console.info(theNote.dirty);
        //     if (theNote.hasOwnProperty('data')) {
        //         if (theNote.dirty) {
        //             Ext.MessageBox.show({
        //                 title: 'Save Changes?',
        //                 msg: 'You are closing a page that has unsaved changes.<br />Would you like to save your changes?',
        //                 buttons: Ext.MessageBox.YESNO,
        //                 scope: me,
        //                 fn: function (btn) {
        //                     console.info(btn);
        //                     if (btn == 'yes') {
        //                         console.log('you pressed yes');
        //                         me.onClickSave()
        //                             .then(function (data) {
        //                                 if (data.success) {
        //                                     vm.set('theNote', {});
        //                                     me.lookupReference('noteType').focus();
        //                                     console.info(me.lookupReference('notelist').getSelectionModel());
        //                                     notelist.getSelectionModel().deselectAll();
        //                                 }
        //                             });
        //                     } else {
        //                         console.log('you pressed no');
        //                         theNote.reject();
        //                         vm.set('theNote', {});
        //                         me.lookupReference('noteType').focus();
        //                         console.info(me.lookupReference('notelist').getSelectionModel());
        //                         notelist.getSelectionModel().deselectAll();
        //                         //return true;
        //                     }
        //                 },
        //                 //animateTarget: btn,
        //                 icon: Ext.MessageBox.QUESTION,
        //             });
        //         } else {
        //             vm.set('theNote', {});
        //             me.lookupReference('noteType').focus();
        //             console.info(me.lookupReference('notelist').getSelectionModel());
        //             notelist.getSelectionModel().deselectAll();
        //         }
        //     } else {
        //         Ext.MessageBox.show({
        //             title: 'Save Changes?',
        //             msg: 'You are closing a page that has unsaved changes.<br />Would you like to save your changes?',
        //             buttons: Ext.MessageBox.YESNO,
        //             scope: me,
        //             fn: function (btn) {
        //                 console.info(btn);
        //                 if (btn == 'yes') {
        //                     console.log('you pressed yes');
        //                     me.onClickSave()
        //                         .then(function (data) {
        //                             if (data.success) {
        //                                 vm.set('theNote', {});
        //                                 me.lookupReference('noteType').focus();
        //                                 console.info(me.lookupReference('notelist').getSelectionModel());
        //                                 notelist.getSelectionModel().deselectAll();
        //                             }
        //                         });
        //                 } else {
        //                     console.log('you pressed no');
        //                     //theNote.reject();
        //                     vm.set('theNote', {});
        //                     me.lookupReference('noteType').focus();
        //                     console.info(me.lookupReference('notelist').getSelectionModel());
        //                     notelist.getSelectionModel().deselectAll();
        //                     //return true;
        //                 }
        //             },
        //             //animateTarget: btn,
        //             icon: Ext.MessageBox.QUESTION,
        //         });
        //     }
        // } else {
        //     vm.set('theNote', {});
        //     me.lookupReference('noteType').focus();
        //     //console.info(me.lookupReference('notelist').getSelectionModel());
        //     notelist.getSelectionModel().deselectAll();
        // }
    },

    onBeforeShowWindow: function () {
        console.log('onBeforeShow called');
        var me = this,
            vm = me.getViewModel();
        //console.info(vm);
        vm.set('theNote', {});
    },

    onBeforeSelect: function (rowModel, rec, index) {
        console.log('onBeforeSelect called');
        // console.info(rowModel);
        // console.info(rec);
        // console.info(index);
        var me = this,
            vm = me.getViewModel(),
            theNote = vm.get('theNote'),
            justsaved = vm.get('justsaved'),
            noteType = me.lookupReference('noteType'),
            noteAction = me.lookupReference('noteAction'),
            noteFollowUpDate = me.lookupReference('noteFollowUpDate'),
            noteComplete = me.lookupReference('noteComplete'),
            noteDetail = me.lookupReference('noteDetail'),
            noteText = me.lookupReference('noteText');


        if (me.lookupReference('exitBtn').getText() == 'CANCEL') {
            noteType.setDisabled(false);
            noteAction.setDisabled(false);
            noteFollowUpDate.setDisabled(false);
            noteDetail.setDisabled(false);
            noteText.setDisabled(false);
            //noteComplete.setDisabled(false);
            Ext.MessageBox.alert('Note', 'You are editing a note, please SAVE or CANCEL before viewing another one.');

            return false;
        }
        //console.info(theNote);
        // console.log(justsaved);

        // Disable form fields
        noteType.setDisabled(true);
        noteAction.setDisabled(true);
        noteFollowUpDate.setDisabled(true);
        noteDetail.setDisabled(true);
        noteText.setDisabled(true);
        noteComplete.setDisabled(true);
        //me.lookupReference('noteDetail').setDisabled(false);

        console.info(noteFollowUpDate);
        console.info(noteDetail);




        console.info(rec);
        if (rec.hasOwnProperty('data')) {
            if (rec.data.OFFUPACT == 'E') {
                me.lookupReference('noteDetail').setFieldLabel('Email');
                me.lookupReference('noteDetail').setHidden(false);
                //me.lookupReference('noteDetail').setDisabled(true);
                me.lookupReference('noteFollowUpDate').setHidden(false);
                //me.lookupReference('noteFollowUpDate').setDisabled(true);
                //me.lookupReference('noteComplete').setDisabled(true);
                noteDetail.setHideTrigger(false);
                console.info(rec.data.OFFUPCMP);
                // if (rec.data.OFFUPCMP == '1') {
                // if (true) {
                //     //me.lookupReference('noteForm').setDisabled(true);
                //     //console.info(me.lookupReference('noteForm'));
                //     console.info(noteFollowUpDate);
                //     noteType.setDisabled(true);
                //     noteAction.setDisabled(true);
                //     //noteFollowUpDate.enabled();
                //     //me.lookupReference('noteFollowUpDate').setDisabled(true);
                //     noteDetail.setDisabled(true);
                //     //noteText.setDisabled(true);
                //     console.info(noteText);
                //     console.info(noteFollowUpDate);

                // }
            } else if (rec.data.OFFUPACT == 'P') {
                me.lookupReference('noteDetail').setFieldLabel('Phone');
                me.lookupReference('noteDetail').setHidden(false);
                noteDetail.setHideTrigger(true);
                me.lookupReference('noteFollowUpDate').setHidden(false);
            } else if (rec.data.OFFUPACT == 'V') {
                me.lookupReference('noteDetail').setFieldLabel('Detail');
                me.lookupReference('noteDetail').setHidden(true);
                me.lookupReference('noteFollowUpDate').setHidden(false);
            } else {
                me.lookupReference('noteDetail').setFieldLabel('Detail');
                me.lookupReference('noteDetail').setHidden(true);
                me.lookupReference('noteFollowUpDate').setHidden(true);
            }
        }

        // if (me.lookupReference('exitBtn').getText() == 'CANCEL') {
        //     noteType.setDisabled(false);
        //     noteAction.setDisabled(false);
        //     noteFollowUpDate.setDisabled(false);
        //     noteDetail.setDisabled(false);
        //     noteText.setDisabled(false);
        //     //noteComplete.setDisabled(false);
        //     Ext.MessageBox.alert('Note', 'You are editing a note, please SAVE or CANCEL before viewing another one.');

        //     return false;
        // }

        console.info(noteFollowUpDate);
        // if (!Ext.Object.isEmpty(theNote)) {
        //     if (theNote.hasOwnProperty('data')) {
        //         if (theNote.dirty) {
        //             //console.log('theNote dirty');
        //             // Todo - confirm window to save data
        //             Ext.MessageBox.show({
        //                 title: 'Save Changes?',
        //                 msg: 'You are closing a page that has unsaved changes.<br />Would you like to save your changes?',
        //                 buttons: Ext.MessageBox.YESNO,
        //                 scope: me,
        //                 fn: function (btn) {
        //                     //console.info(btn);
        //                     if (btn == 'yes') {
        //                         //console.log('you pressed yes');
        //                         me.onClickSave()
        //                             .then(function (data) {
        //                                 if (data.success) {
        //                                     console.log('hello world');
        //                                     me.lookupReference('notelist').getSelectionModel().select(index);
        //                                     me.lookupReference('addNoteBtn').setHidden(false);
        //                                     me.lookupReference('saveBtn').setHidden(true);
        //                                     me.lookupReference('exitBtn').setText('Exit');
        //                                 }
        //                             });
        //                     } else {
        //                         //console.log('you pressed no');
        //                         theNote.reject();
        //                         me.lookupReference('notelist').getSelectionModel().select(index);
        //                         me.lookupReference('addNoteBtn').setHidden(false);
        //                         me.lookupReference('saveBtn').setHidden(true);
        //                         me.lookupReference('exitBtn').setText('Exit');
        //                         return true;
        //                     }
        //                 },
        //                 //animateTarget: btn,
        //                 icon: Ext.MessageBox.QUESTION,
        //             });
        //             return false;
        //         }

        //     } else {

        //         me.lookupReference('addNoteBtn').setHidden(false);
        //         me.lookupReference('saveBtn').setHidden(true);
        //         me.lookupReference('exitBtn').setText('Exit');
        //     }
        //     me.lookupReference('addNoteBtn').setHidden(false);
        //     me.lookupReference('saveBtn').setHidden(true);
        //     me.lookupReference('exitBtn').setText('Exit');
        // } else {
        //     me.lookupReference('saveBtn').setHidden(true);
        //     me.lookupReference('addNoteBtn').setHidden(false);
        //     me.lookupReference('exitBtn').setText('Exit');
        // }
    },
    // onBeforeItemClick: function () {
    //     console.log('onBeforeItemClick');
    // },

    // onMessageBoxClick: function (btn) {
    //     var me = this;
    //     console.log('onMessageBoxClick called');
    //     if (btn == 'yes') {
    //         console.log('you pressed yes');
    //         //me.onClickSave;
    //     } else {
    //         console.log('you pressed no');
    //     }
    // },
    // onLoadNoteList: function () {
    //     console.log('onLoadNoteList called');
    // },
    // onAfterRenderNoteList: function (cmp) {
    //     console.log('onAfterRenderNotesList called');
    // },
    // onFormShow: function () {
    //     console.log('onFormShow called');
    // },
    onNoteListSelect: function (d, rec) {
        //console.log('onNoteListSelect called');
        // console.info(d);
        // console.info(rec);
        var me = this,
            vm = me.getViewModel(),
            theNote = vm.get('theNote');

        //console.info(theNote);
        // me.lookupReference('noteCreated').setValue(null);
        // me.lookupReference('noteUpdated').setValue(null);


        //me.lookupReference('noteText').focus();
        // if (!Ext.Object.isEmpty(rec)) {
        //     if (rec.hasOwnProperty('data')) {
        //         console.info(rec.data.OFCRTDATE);

        //         var createdDateTime = Ext.Date.format(new Date(rec.data.dateTime), 'j/n/Y H:i');
        //         //me.lookupReference('noteCreated').setValue(createdDateTime + ' ' + rec.data.OFCRTUSER);

        //         if (rec.data.hasOwnProperty('OFCHGDATE') && rec.data.hasOwnProperty('OFCHGTIME')) {
        //             //if (rec.data.OFCHGDATE != '0001-01-01' && rec.data.OFCHGTIME != '00:00:00') {
        //             var updateDateTime = Ext.Date.format(new Date(rec.data.OFCHGDATE + ' ' + rec.data.OFCHGTIME), 'j/n/Y H:i');
        //             //me.lookupReference('noteUpdated').setValue(updateDateTime + ' ' + rec.data.OFCHGUSER);
        //             console.info(updateDateTime);
        //             //}
        //         }
        //     }
        // }



    },

    onSelectNoteAction: function (combo, record) {
        // Change the detail lable
        //console.log('onSelectNoteAction called');
        var me = this,
            vm = me.getViewModel(),
            theNote = vm.get('theNote'),
            noteDetail = me.lookupReference('noteDetail'),
            noteFollowUpDate = me.lookupReference('noteFollowUpDate'),
            noteComplete = me.lookupReference('noteComplete'),
            mainVm = Ext.getCmp('app-main').getViewModel(),
            noteDetailOpts = me.getViewModel().getStore('NoteDetailOpts');;

        //console.info(record);
        if (!Ext.isEmpty(record)) {
            if (record.data.NOTEACTC == 'P') {
                noteDetail.setFieldLabel('Phone');
                noteFollowUpDate.setHidden(false);
                noteDetail.setHidden(false);
                //noteDetail.unselectable();
                Ext.get('noteDetail').unselectable();
                noteComplete.setDisabled(false);
                noteDetail.setHideTrigger(true);



            } else if (record.data.NOTEACTC == 'E') {
                //console.log('NOTEACTC == E')
                noteDetail.setFieldLabel('Email');
                noteFollowUpDate.setHidden(false);
                noteDetail.setHidden(false);
                noteDetail.setHideTrigger(false);
                noteComplete.setDisabled(true);
            } else if (record.data.NOTEACTC == 'V') {
                noteFollowUpDate.setHidden(false);
                noteDetail.setHidden(true);
                noteComplete.setDisabled(false);
            } else {
                noteFollowUpDate.setHidden(true);
                noteDetail.setHidden(true);
                noteComplete.setHidden(true);
            }
        }
        //console.info(theNote);
        if (!Ext.isEmpty(theNote)) {
            if (theNote.hasOwnProperty('data')) {
                if (theNote.dirty) {
                    //console.log('debugy');
                    me.lookupReference('saveBtn').setDisabled(false);
                    me.lookupReference('saveBtn').setHidden(false);
                    me.lookupReference('addNoteBtn').setHidden(true);
                    me.lookupReference('exitBtn').setText('Cancel');
                }
            }
        }
    },

    onFormDirtyChange: function () {
        //console.log('onFormDirtyChange called');
    },

    onExpand: function () {
        //console.log('onExpand called');
        var me = this,
            noteFollowUpDate = me.lookupReference('noteFollowUpDate');
        noteFollowUpDate.setMinValue(new Date());
        // console.info(me.lookupReference('noteFollowUpDate').getValue());
        // if (noteFollowUpDate.getValue() != null) {
        //     noteFollowUpDate.setValue(noteFollowUpDate.getValue());
        // }
    },

    onDetailSelect: function (cmp, rec) {
        var me = this,
            noteDetail = me.lookupReference('noteDetail'),
            vm = me.getViewModel(),
            theNote = vm.get('theNote');
        //console.info(rec);
        //console.log(theNote);
        if (!Ext.isEmpty(theNote)) {
            if (theNote.hasOwnProperty('data')) {
                theNote.set('OFFUPCOD', rec.get('EMLCOD'));
            } else {
                Ext.apply(theNote, {
                    OFFUPCOD: rec.get('EMLCOD')
                })
            }
        }
        // console.info(rec.get('EMLCOD'));
        //console.log(theNote);
        if (rec.get('EMLCOD') == "*EMAIL") {
            noteDetail.selectText();
        }
    },

    onShow: function () {
        console.log('onShow called');
    }
});