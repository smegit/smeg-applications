Ext.define('Shopping.view.cart.PaymentForm', {
    extend        : 'Ext.form.Panel',
    requires      : [
        'Ext.container.Container',
        'Ext.form.FieldContainer',
        'Ext.form.FieldSet',
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
        'Ext.form.field.Display',
        'Ext.form.field.Number',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox'
    ],
    xtype         : 'cartpayment',
    reference     : 'cartpayform',
    listeners     : {
        hideCreditInfo : 'onHideCreditInfo'
    },
    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            defaults : {
                anchor : '100%'
            },
            items    : me.buildItems()
        });
        me.callParent(arguments);
    },

    buildItems : function () {
        var me       = this,
            cartInfo = me.cartInfo,
            terms    = '/Product/Smegtermsandconditions.pdf';
        return [
            {
                xtype    : 'fieldset',
                title    : 'Summary',
                padding  : '5 5 10 18',
                defaults : {
                    anchor : '98%'
                },
                items    : [{
                    xtype     : 'container',
                    data      : me.cartInfo,
                    reference : 'payamountcnt',
                    tpl       : new Ext.XTemplate(
                        '<div class="payment-table">',
                        '  <tpl for="PaySum">',
                        '    <div class="payment-line {[this.getItemClass(values)]}">',
                        '      <div class="payment-field">{LABEL}</div>',
                        '      <div class="payment-amount">{[Ext.util.Format.currency(values.AMOUNT)]}</div>',
                        '      <div class="payment-desc">{NOTE}</div>',
                        '    </div>',
                        '  </tpl>',
                        '</div>', {
                            getItemClass : function (values) {
                                var total   = new RegExp('total', 'i'),
                                    balance = new RegExp('balance', 'i'),
                                    minimum = new RegExp('minimum', 'i'),
                                    label   = values.LABEL;
                                if (total.test(label) || minimum.test(label)) {
                                    return 'payment-line-total';
                                } else if (balance.test(label)) {
                                    return 'payment-line-balance';
                                }
                                return 'payment-line-item';
                            }
                        })
                }]
            }, {
                xtype    : 'fieldset',
                title    : 'Payment',
                padding  : '5 5 10 20',
                defaults : {
                    margin : '10 0 10 0',
                    width  : 324
                },
                items    : [{
                    xtype           : 'combo',
                    margin          : '0 0 10 0',
                    name            : 'OAPAYM',
                    itemId          : 'payMethCombo',
                    labelWidth      : 120,
                    minValue        : 0,
                    maxValue        : cartInfo.maxpay[0].maxpay,
                    fieldLabel      : 'Payment Method',
                    bind            : {
                        store : '{PaymentOptions}'
                    },
                    queryMode       : 'local',
                    forceSelection  : true,
                    displayField    : 'PAYMDSC',
                    valueField      : 'PAYMCOD',
                    enableKeyEvents : true,
                    listeners       : {
                        scope  : me,
                        change : function (combo, value) {
                            var me             = this,
                                ccInfo         = me.down('#ccInfo'),
                                approvalNumber = me.down('#approvalNumber');

                            if (value === 'FIN') {
                                approvalNumber.show();
                            } else {
                                approvalNumber.hide();
                                approvalNumber.reset();
                            }

                            if (value === 'CC') {
                                if (!ccInfo.isVisible()) {
                                    me.fireEvent('showCreditInfo', me);
                                    ccInfo.show();
                                }
                            } else {
                                if (ccInfo.isVisible()) {
                                    me.fireEvent('hideCreditInfo', me);
                                    ccInfo.hide();
                                }
                            }
                        },
                        select : function (cmp) {
                            var me      = this,
                                payment = me.down('#payAmtFld');
                            if (!Ext.isEmpty(payment)) {
                                payment.focus();
                            }
                        }
                    }
                }, {
                    xtype            : 'numberfield',
                    fieldLabel       : 'Payment Amount',
                    name             : 'OAPAYAMT',
                    allowBlank       : false,
                    allowDecimals    : true,
                    hideTrigger      : true,
                    itemId           : 'payAmtFld',
                    decimalPrecision : 2,
                    labelWidth       : 120,
                    listeners        : {
                        specialkey : 'onSpecialKeyPaymentForm'
                    }
                }, {
                    xtype      : 'textfield',
                    fieldLabel : 'Approval Number',
                    allowBlank : false,
                    name       : 'OAPAYAPN',
                    hidden     : true,
                    disabled   : true,
                    itemId     : 'approvalNumber',
                    labelWidth : 120,
                    listeners  : {
                        hide       : function (cmp) {
                            cmp.disable();
                        },
                        show       : function (cmp) {
                            cmp.enable();
                        },
                        specialkey : 'onSpecialKeyPaymentForm'
                    }
                }, {
                    xtype     : 'container',
                    margin    : 0,
                    hidden    : true,
                    defaults  : {
                        xtype      : 'textfield',
                        margin     : '5 0 5 0',
                        labelWidth : 120
                    },
                    listeners : {
                        hide : function (fieldset) {
                            var fields = fieldset.query('field');
                            for (var i = 0; i < fields.length; i++) {
                                fields[i].setDisabled(true);
                                fields[i].resetOriginalValue();
                            }

                        },
                        show : function (fieldset) {
                            var fields = fieldset.query('field');
                            for (var i = 0; i < fields.length; i++) {
                                fields[i].setDisabled(false);
                            }
                        }
                    },
                    itemId    : 'ccInfo',
                    items     : [{
                        name            : 'CCNAME',
                        fieldLabel      : 'Name on Credit Card',
                        width           : '100%',
                        enableKeyEvents : true,
                        listeners       : {
                            specialkey : 'onSpecialKeyPaymentForm'
                        }
                    }, {
                        name            : 'CCNUM',
                        fieldLabel      : 'Credit Card Number',
                        width           : '100%',
                        enableKeyEvents : true,
                        listeners       : {
                            specialkey : 'onSpecialKeyPaymentForm'
                        }
                    }, {
                        xtype      : 'fieldcontainer',
                        fieldLabel : 'Expiration (Month/Year)',
                        layout     : 'hbox',
                        defaults   : {
                            enableKeyEvents : true,
                            listeners       : {
                                specialkey : 'onSpecialKeyPaymentForm'
                            }
                        },
                        items      : [{
                            xtype     : 'numberfield',
                            name      : 'CCEM',
                            reference : 'ccmonth',
                            minValue  : 1,
                            maxValue  : 12,
                            value     : new Date().getMonth() + 1,
                            width     : 70,
                            margin    : '0 5 0 0',
                            listeners       : {
                                specialkey : 'onSpecialKeyPaymentForm'
                            }
                        }, {
                            xtype     : 'numberfield',
                            name      : 'CCEY',
                            reference : 'ccyear',
                            minValue  : new Date().getFullYear(),
                            maxValue  : 9999,
                            value     : new Date().getFullYear(),
                            width     : 95,
                            listeners       : {
                                specialkey : 'onSpecialKeyPaymentForm'
                            }
                        }]
                    }, {
                        name            : 'CVS',
                        fieldLabel      : 'CCV',
                        width           : 195,
                        maxLength       : 4,
                        maxLengthText   : 'This field is limited to 4 characters.',
                        enableKeyEvents : true,
                        listeners       : {
                            specialkey : 'onSpecialKeyPaymentForm'
                        }
                    }]
                }]
            }, {
                xtype     : 'checkbox',
                boxLabel  : 'Confirm acceptance of <a href="' + window.location.origin + terms + '" target="_blank">terms and conditions</a>.',
                name      : 'OAPAYCHKBX',
                reference : 'tacchbx',
                margin    : '10 0 10 0',
                listeners        : {
                    specialkey : 'onSpecialKeyPaymentForm'
                }
            }, {
                xtype       : 'fieldset',
                hidden      : true,
                defaultType : 'textfield',
                items       : [{
                    name  : 'OAORDTOTAL',
                    value : me.cartInfo.OAORDTOT
                }, {
                    name  : 'OAORDNET',
                    value : me.cartInfo.OAORDNET
                }, {
                    name  : 'OAORDTAX',
                    value : me.cartInfo.OAORDTAX
                }, {
                    name  : 'OAORDKEY',
                    value : me.cartInfo.OAORDKEY
                }]
            }];
    }
});