Ext.define('Shopping.view.cart.Print', {
    extend        : 'Ext.window.Window',
    requires      : [
        'Ext.layout.container.Fit',
        'Ext.toolbar.Fill',
        'Ext.ux.IFrame'
    ],
    xtype         : 'print',
    height        : '90%',
    width         : '70%',
    layout        : 'fit',
    closable      : true,
    modal         : true,
    defaultFocus  : '#cancelButton',
    initComponent : function () {
        var me = this;

        Ext.apply(me, {
            items : me.buildItems(),
            bbar  : me.buildBBar()
        });
        me.callParent(arguments);
    },
    buildItems    : function () {
        var me = this;
        return [{
            xtype : 'uxiframe',
            src   : me.iframeSource
        }];
    },
    buildBBar     : function () {
        var me = this;
        return {
            items : ['->', {
                text      : 'Cancel',
                itemId    : 'cancelButton',
                listeners : {
                    scope : me,
                    click : function () {
                        me.onEsc();
                    }
                }
            }, {
                text    : 'Email',
                ui      : 'blue',
                scope   : me,
                handler : me.onClickEmail
            }]
        };
    },

    onClickEmail : function () {
        var me          = this,
            emailWindow = Ext.create('Ext.window.Window', {
                header       : false,
                layout       : 'fit',
                height       : 255,
                width        : 500,
                modal        : true,
                defaultFocus : '[name=to]',
                bodyPadding  : '16 32 0 32',
                items        : [{
                    xtype    : 'form',
                    itemId   : 'emailForm',
                    layout   : {
                        type  : 'vbox',
                        align : 'stretch'
                    },
                    defaults : {
                        xtype      : 'textfield',
                        labelWidth : 65
                    },
                    items    : [{
                        fieldLabel : 'To',
                        name       : 'to',
                        allowBlank : false,
                        value      : me.orderData.OACSTEML
                    }, {
                        fieldLabel : 'Cc',
                        name       : 'cc'
                    }, {
                        fieldLabel : 'Subject',
                        name       : 'subject',
                        value      : 'Order ' + me.orderData.OAORDKEY
                    }, {
                        xtype      : 'textarea',
                        fieldLabel : 'Message',
                        name       : 'message'
                    }]
                }],
                bbar         : {
                    items : ['->', {
                        text      : 'Cancel',
                        listeners : {
                            scope : me,
                            click : function (cmp) {
                                emailWindow.close();
                            }
                        }
                    }, {
                        text      : 'Send',
                        ui        : 'blue',
                        listeners : {
                            scope : me,
                            click : function (cmp) {
                                var form = emailWindow.down('#emailForm');
                                if (form.isValid()) {
                                    me.onEmailOrder(emailWindow, form.getValues());
                                }
                            }
                        }
                    }]
                }
            }).show();
    },
    onEmailOrder : function (emailWindow, emailInfo) {
        var me        = this,
            params    = {
                pgm      : 'EC1050',
                action   : 'emailOrder',
                OAORDKEY : me.orderData.OAORDKEY
            },
            showError = function (d) {
                Valence.common.util.Dialog.show({
                    title    : 'Error',
                    minWidth : 300,
                    msg      : Ext.isEmpty(d.msg) ? 'Error' : d.msg,
                    buttons  : [{
                        text : 'Ok'
                    }]
                });
            };

        Ext.apply(params, emailInfo);
        console.log('would send : ', params);
        emailWindow.close();

        // Valence.common.util.Helper.loadMask('Emailing');
        //
        // Ext.Ajax.request({
        //     url     : '/valence/vvcall.pgm',
        //     params  : params,
        //     scope   : me,
        //     success : function (r) {
        //         var d = Ext.decode(r.responseText);
        //         if (d.success) {
        //             emailWindow.close();
        //             Valence.util.Helper.showSnackbar('Email sent');
        //         } else {
        //             showError(d);
        //             Valence.common.util.Helper.destroyLoadMask();
        //         }
        //     },
        //     failure : function (r) {
        //         var d = Ext.decode(r.responseText);
        //         Valence.common.util.Helper.destroyLoadMask();
        //         showError(d);
        //     }
        // });
    }
});