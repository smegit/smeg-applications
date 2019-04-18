Ext.define('EC1022.controller.Window', {
    extend: 'Ext.app.Controller',

    onAddShow: function (component, eOpts) {
        var me = this,
            app = me.getApplication(),
            windowform = component.down('#editwindowform').getForm(),
            VVRRN;

        if (component.mode == 'copy') {
            component.getEl().mask('Loading...');
            VVRRN = component.rec.get('VVRRN');
            Ext.Ajax.request({
                url: '/valence/vvcall.pgm',
                params: {
                    pgm: 'EC1022',
                    action: 'getRec',
                    VVRRN: VVRRN
                },
                success: function (response) {
                    component.getEl().unmask();
                    var r = Ext.decode(response.responseText);
                    r.rec = app.encodeProperties(r.rec);
                    if (r.success) {
                        windowform.setValues(r.rec);
                    } else {
                        Valence.util.Helper.showSnackbar('Error', 'Could not load record');
                    }
                }
            });
        }
    },

    onShow: function (component, eOpts) {
        console.info('onShow called');
        var me = this,
            app = me.getApplication(),
            windowform = component.down('#editwindowform').getForm();

        if (component.mode == 'copy') {
            component.getEl().mask('Loading...');
            VVRRN = component.rec.get('VVRRN');
            Ext.Ajax.request({
                url: '/valence/vvcall.pgm',
                params: {
                    pgm: 'EC1022',
                    action: 'getRec',
                    VVRRN: VVRRN
                },
                success: function (response) {
                    component.getEl().unmask();
                    var r = Ext.decode(response.responseText);
                    r.rec = app.encodeProperties(r.rec);
                    if (r.success) {
                        windowform.setValues(r.rec);
                    } else {
                        Valence.util.Helper.showSnackbar('Error', 'Could not load record');
                    }
                }
            });
        }

        if (component.mode == 'edit') {
            component.getEl().mask('Loading...');
            VVRRN = component.rec.get('VVRRN');
            Ext.Ajax.request({
                url: '/valence/vvcall.pgm',
                params: {
                    pgm: 'EC1022',
                    action: 'getRec',
                    VVRRN: VVRRN
                },
                success: function (response) {
                    component.getEl().unmask();
                    var r = Ext.decode(response.responseText);
                    r.rec = app.encodeProperties(r.rec);
                    if (r.success) {
                        windowform.setValues(r.rec);
                    } else {
                        Valence.util.Helper.showSnackbar('Error', 'Could not load record');
                    }
                }
            });
        }
    },

    onSaveButtonClick: function (button, e, eOpts) {
        var me = this,
            app = me.getApplication(),
            windowvar = button.previousNode('window'),
            windowform = button.previousNode('form').getForm(),
            VVRRN = 0,
            VVUSRID = 0,
            action,
            d;

        windowvar.getEl().mask('Saving...');

        if (windowvar.mode == 'edit') {
            VVRRN = windowvar.rec.get('VVRRN');
            VVUSRID = windowvar.rec.get('A1USRID');
        }
        d = {
            pgm: 'EC1022',
            action: 'validateRec',
            mode: windowvar.mode,
            VVRRN: VVRRN
        };
        Ext.apply(d, app.decodeProperties(windowform.getValues()));

        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: d,
            scope: me,
            success: function (response) {
                var r = Ext.decode(response.responseText);
                if (r.success) {
                    valUser = {
                        pgm: 'vvadm_usrs',
                        action: 'saveUser',
                        VVUSRID: VVUSRID,
                        VVLOGINID: Valence.util.Helper.encodeUTF16(r.W1LOGIN),
                        VVIBMIUSER: '',
                        VVACTIV: d.A1USRSTS == 'A' || d.A1USRSTS == 'a' ? 'on' : 'off',
                        VVFNAME: d.A1USRNAM,
                        VVMIDINIT: '',
                        VVLNAME: Valence.util.Helper.encodeUTF16(d.A1CN),
                        VVPASSWD: VVUSRID == 0 ? d.A1LOGIN : '',
                        VVDESC: '00410042',
                        VVEMAIL: d.A1USREML,
                        VVPWEXDATE: VVUSRID == 0 ? new Date() : '',
                        envs: '1',
                        grps: 1001
                    };

                    Ext.Ajax.request({
                        url: '/valence/vvcall.pgm',
                        params: valUser,
                        scope: me,
                        success: function (response) {
                            var r = Ext.decode(response.responseText);
                            if (r.success) {
                                d.action = 'updateRec';
                                d.A1LOGIN = r.var1;
                                d.A1USRID = r.VVUSRID;
                                Ext.Ajax.request({
                                    url: '/valence/vvcall.pgm',
                                    params: d,
                                    scope: me,
                                    success: function (response) {
                                        windowvar.getEl().unmask();
                                        var r = Ext.decode(response.responseText);
                                        if (r.success) {
                                            Valence.util.Helper.showSnackbar('Record saved.');
                                            Ext.ComponentQuery.query('#filegrid')[0].getStore().load();
                                            windowvar.close();
                                        } else {
                                            if (r.fld) {
                                                Ext.ComponentQuery.query('#' + r.fld)[0].markInvalid(r.msg);
                                            } else {
                                                Valence.util.Helper.showSnackbar('ERROR: ' + r.msg);
                                            }
                                        }
                                    }
                                });
                            } else {
                                windowvar.getEl().unmask();
                                if (r.fld) {
                                    Ext.ComponentQuery.query('#' + r.fld)[0].markInvalid(r.msg);
                                } else {
                                    Valence.util.Helper.showSnackbar('ERROR: ' + r.msg);
                                }
                            }
                        }
                    });
                } else {
                    windowvar.getEl().unmask();
                    if (r.fld) {
                        Ext.ComponentQuery.query('#' + r.fld)[0].markInvalid(r.msg);
                    } else {
                        Valence.util.Helper.showSnackbar('ERROR: ' + r.msg);
                    }
                }
            }
        });
    },

    onEnable: function (button) {
        console.info('onEnable called');
        var me = this,
            windowform = button.previousNode('form'),
            windowformValues = windowform.getForm().getValues(),
            saveBtn = button.up().down('#save'),
            params = {};
        //windowform.down('#VVACTIV').setValue('1');
        console.info(windowform.getForm().getValues());
        console.info(saveBtn);
        //me.onSaveButtonClick(saveBtn);
        params = {
            pgm: 'EC1022',
            action: 'enable',
            A1USRID: windowformValues.A1USRID,
            //WUSRID: windowformValues.A1USRID
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: params,
            success: function (response) {
                var res = Ext.decode(response.responseText);
                if (res.success) {
                    windowform.down('#VVACTIV').setValue('1');
                } else {
                    Ext.Msg.alert('Error', res.msg, Ext.emptyFn);
                }
            },
            failure: function (response) {
                var res = Ext.decode(response.responseText);
                console.info('enable failed');
                Ext.Msg.alert('Server Error', res.msg, Ext.emptyFn);
            }
        })





    },

    onCancel: function (btn, evt) {
        console.info('onCancel called');
        var editWin = btn.up('editwindow');
        editWin.close();
    },

    init: function (application) {
        this.control({
            "editwindow": {
                show: this.onShow
            },
            "addwindow": {
                show: this.onShow
            },
            "#save": {
                click: this.onSaveButtonClick
            },
            "#enableBtnId": {
                click: this.onEnable
            },
            "#cancelBtnId": {
                click: this.onCancel
            }
        });
    }

});