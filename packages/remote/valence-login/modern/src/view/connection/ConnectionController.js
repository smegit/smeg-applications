Ext.define('Valence.login.view.connection.ConnectionController', {
    extend : 'Ext.app.ViewController',
    alias  : 'controller.connection',

    requires : [
        'Valence.common.util.Dialog'
    ],

    // only called from the connection phone container
    //
    onConnectionKeyup : function (fld, e) {
        var me   = this,
            view = me.getView(),
            connCnt, nxtFld, fldName;

        if (e.keyCode == 13) {
            fldName = fld.getName();
            if (fldName == 'desc') {
                nxtFld = view.lookupReference('connectionUrl');
                if (Ext.isEmpty(nxtFld.getValue())) {
                    nxtFld.setValue('http://');
                }
            } else if (fldName == 'url') {
                nxtFld = view.lookupReference('port');
            } else if (fldName == 'port') {
                nxtFld = view.lookupReference('autostartappid');
            } else if (fldName == 'autostartappid') {
                me.onTapSaveConnection();
                return;
            }
            if (!Ext.isEmpty(nxtFld)) {
                nxtFld.focus();
            }
        }
    },

    onFocusUrl : function (fld) {
        var me      = this,
            view    = me.getView(),
            connCnt = view.down(Ext.os.is.Phone ? 'connection-phone' : 'connection-tablet');

        if (Ext.isEmpty(fld.getValue())) {
            fld.setValue('http://');
        }

        // at least in Android the scroll position moves to different positions after each function
        // focus brings it into view and then after this function is ran something else moves it back
        // out of view
        //
        if (Ext.os.is.Phone) {
            setTimeout(function () {
                connCnt.getScrollable().scrollIntoView(fld.element);
            }, 300);
        }
    },

    onFocusPhoneField : function (fld) {
        var me      = this,
            view    = me.getView(),
            connCnt = view.down('connection-phone');

        // at least in Android the scroll position moves to different positions after each function
        // focus brings it into view and then after this function is ran something else moves it back
        // out of view
        //
        if (Ext.os.is.Phone) {
            setTimeout(function () {
                connCnt.getScrollable().scrollIntoView(fld.element);
            }, 300);
        }
    },

    onTapTitle : function () {
        var me    = this,
            view  = me.getView(),
            form  = view.lookupReference('connectionform'),
            login = view.up('login'),
            loginVM;

        // login will not existing if the login processor does not find a connection
        // for the mobile portal
        //
        if (!Ext.isEmpty(login)) {
            loginVM = login.getViewModel();
            if (loginVM.get('hasConnection')) {
                if (loginVM.get('inConnectionEditMode')) {
                    loginVM.set({
                        conn                 : {},
                        inConnectionEditMode : false
                    });
                }
                me.removeValidationErrors();
            }
            form.reset();
            login.animateBackToView();
        }
    },

    onShowConnection : function () {
        var me    = this,
            view  = me.getView(),
            vm    = me.getViewModel(),
            form  = Ext.ComponentQuery.query('connection formpanel')[0],
            login = view.up('login'),
            loginVM, formData, rec;

        vm.set('connectionValidation', true);

        if (!Ext.isEmpty(login)) {
            loginVM = login.getViewModel();
            vm.set('appBarTitleText',Valence.lang.lit.newConnection);
            // if multiple edits form visibly shows no data, but still holds the values
            // this was the only way to truly reset the data
            //
            form.setValues({
                desc           : '',
                url            : '',
                port           : '',
                autostartappid : ''
            });
            if (loginVM.get('inConnectionEditMode')) {
                rec = loginVM.get('connRec');
                if (!Ext.isEmpty(rec)) {
                    formData = rec.getData();
                    form.setValues(formData);
                    vm.set('appBarTitleText',rec.get('desc'));
                }
            }
        }
    },

    onTapSaveConnection : function () {
        var me             = this,
            view           = me.getView(),
            vm             = me.getViewModel(),
            login          = view.up('login'),
            form           = view.lookupReference('connectionform'),
            fields         = form.getFields(),
            values         = form.getValues(),
            store          = Ext.getStore('Connections'),
            connName       = values.desc,
            sameName       = false,
            sameNameDialog = {
                title   : Valence.lang.lit.invalidRequest,
                msg     : Valence.lang.lit.connectionSameName,
                buttons : ['->', {
                    text : Valence.lang.lit.ok
                }]
            },
            edit, loginVM, prevSel, rec, recData, recName, invalid, field,loginPkgOpts,hostUrl;

        // validate form

        for (var i in fields) {
            field = fields[i];
            if (field.getRequired() && Ext.isEmpty(field.getValue())) {
                invalid = true;
                field.toggleCls('vv-field-invalid', true);
                vm.set('connectionValidation', false);
            } else {
                field.toggleCls('vv-field-invalid', false);
            }
        }

        if (invalid) {
            return;
        }

        // login will not exist if the login processor does not find a connection
        // for the mobile portal
        //
        if (!Ext.isEmpty(login)) {
            loginVM = login.getViewModel();
            edit = loginVM.get('inConnectionEditMode');
            if (edit) {
                rec     = loginVM.get('connRec');
                recName = rec.get('desc');
                // check for same name
                if (connName != recName) {
                    store.each(function (r) {
                        if (r.get('id') != rec.get('id') && r.get('desc') == recName) {
                            sameName = true;
                            Valence.common.util.Dialog.show(sameNameDialog);
                            return false;
                        }
                        return true
                    });
                    if (sameName) {
                        return;
                    }
                }
                rec.set(values);
                rec.commit();
            } else {
                store.each(function (r) {
                    if (r.get('desc') == connName) {
                        sameName = true;
                        Valence.common.util.Dialog.show(sameNameDialog);
                        return false;
                    }
                    return true
                });
                if (sameName) {
                    return;
                }
            }

            Ext.Viewport.mask({
                indicator : true,
                xtype   : 'loadmask',
                message : Valence.lang.lit.checking.replace('VAR1',connName)
            });

            hostUrl = values.url + ':' + values.port;

            Ext.Ajax.request({
                url     : hostUrl + '/valence/vvlogin.pgm',
                params  : {
                    action : 'getSettings'
                },
                success : function () {
                    if (!edit){
                        prevSel = store.findRecord('selected', true);
                        if (!Ext.isEmpty(prevSel)) {
                            prevSel.set('selected', false);
                            prevSel.commit();
                        }
                        values.selected = true;
                        store.add(values);
                    } else {
                        store.remove(rec);
                        recData = rec.getData();
                        delete recData.id;
                        store.add(recData);
                    }

                    store.sync();
                    form.setValues({
                        desc           : '',
                        url            : '',
                        port           : '',
                        autostartappid : ''
                    });
                    login.animateBackToView();
                    loginVM.set({
                        conn                 : {},
                        loginDisabled        : false,
                        hasConnection        : true,
                        inConnectionEditMode : false,
                        connectionsText      : values.desc
                    });
                    loginPkgOpts = Valence.login.Processor.getOptions();
                    Valence.login.Processor.setOptions(Ext.apply(loginPkgOpts,{
                        hostUrl : hostUrl
                    }));
                    Valence.login.Processor.setHostUrl(hostUrl);
                    Ext.Viewport.unmask();
                },
                failure : function () {
                    Valence.common.util.Dialog.show({
                        title   : Valence.lang.lit.invalidConnection,
                        msg     : Valence.lang.lit.canNotConnect.replace('VAR1', values.desc),
                        buttons : ['->', {
                            text : Valence.lang.lit.ok
                        }]
                    });
                    Ext.Viewport.unmask();
                }
            });
        } else {
            values.selected = true;
            me.fireViewEvent('connectionadded', view, values);
        }
        me.removeValidationErrors();
    },

    onTapRemoveConnection  : function () {
        var me    = this,
            view  = me.getView(),
            login = view.up('login'),
            vm    = login.getViewModel(),
            str   = Ext.getStore('Connections');

        Valence.common.util.Dialog.show({
            title       : Valence.lang.lit.removeConnection,
            buttonAlign : 'right',
            buttons     : [{
                text     : Valence.lang.lit.cancel,
                parmText : 'no'
            }, {
                text     : Valence.lang.lit.yes,
                parmText : 'yes'
            }],
            handler     : function (btnText, btn) {
                if (btnText == 'yes') {
                    str.remove(vm.get('connRec'));
                    str.sync();
                    vm.set({
                        hasConnection   : false,
                        connRec         : null,
                        connectionsText : Valence.lang.lit.noConnections
                    });
                    me.onTapTitle();
                    if (str.getCount() == 0) {
                        vm.set('loginDisabled', true);
                        setTimeout(function () {
                            Valence.common.util.Dialog.show({
                                title       : Valence.lang.lit.noConnections,
                                msg         : Valence.lang.lit.setConnection,
                                buttonAlign : 'right',
                                buttons     : [{
                                    text : Valence.lang.lit.ok
                                }]
                            });
                        }, 500);
                    }
                }
            }
        })
    },
    removeValidationErrors : function () {
        var me   = this,
            view = me.getView();

        view.lookupReference('description').toggleCls('vv-field-invalid', false);
        view.lookupReference('port').toggleCls('vv-field-invalid', false);
        view.lookupReference('connectionUrl').toggleCls('vv-field-invalid', false);

        me.getViewModel().set('connectionValidation', true);
    }


});
