Ext.define('Shopping.view.cart.CustomerDetail', {
    extend: 'Ext.Container',
    xtype: 'cart-customerdetail',

    requires: [
        'Ext.form.FieldContainer',
        'Ext.form.FieldSet',
        'Ext.form.Label',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox'
    ],

    controller: 'cart',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    margin: 0,
    release: false,
    baseLabelWidth: 90,
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: me.buildItems(me.cartOptions)
        });
        me.callParent(arguments);
    },
    buildItems: function () {
        var me = this;
        return [{
            xtype: 'fieldset',
            title: 'Customer Details',
            cls: 'cart-fieldset',
            flex: 1,
            itemId: 'customerfieldset',
            defaultType: 'textfield',
            margin: '0 10 0 0',
            padding: '0 20',
            defaults: {
                labelAlign: 'left',
                labelWidth: me.baseLabelWidth,
                readOnly: me.release,
                disabled: me.release,
                width: '100%'
            },
            items: [{
                name: 'OACSTNAM',
                fieldLabel: 'Name',
                allowBlank: false,
                readOnly: me.release,
                disabled: me.release,
                bind: {
                    value: '{cartValues.OACSTNAM}'
                }
            }, {
                itemId: 'customerSearch',
                name: 'OACSTST1',
                gApiAddrType: 'baseAddressLine1',
                fieldLabel: 'Address',
                allowBlank: false,
                bind: {
                    value: '{cartValues.OACSTST1}'
                },
                listeners: {
                    afterrender: 'onAfterRenderAddressSearch'
                }
            }, {
                name: 'OACSTST2',
                fieldLabel: '&nbsp;',
                labelSeparator: '',
                addressLine2: true,
                bind: {
                    value: '{cartValues.OACSTST2}'
                }
            }, {
                xtype: 'fieldcontainer',
                labelWidth: me.baseLabelWidth,
                labelSeparator: '',
                fieldLabel: '&nbsp;',
                readOnly: false,
                disabled: false,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    xtype: 'textfield',
                    hideLabel: true,
                    readOnly: me.release,
                    disabled: me.release
                },
                items: [{
                    name: 'OACSTCTY',
                    allowBlank: false,
                    margin: '0 8 0 0',
                    gApiAddrType: 'locality',
                    gApiAddrAttr: 'long_name',
                    emptyText: 'City',
                    flex: 1,
                    bind: {
                        value: '{cartValues.OACSTCTY}'
                    }
                }, {
                    name: 'OACSTSTA',
                    allowBlank: false,
                    margin: '0 8 0 0',
                    gApiAddrType: 'administrative_area_level_1',
                    gApiAddrAttr: 'short_name',
                    emptyText: 'State',
                    width: 50,
                    bind: {
                        value: '{cartValues.OACSTSTA}'
                    }
                }, {
                    name: 'OACSTPST',
                    allowBlank: false,
                    gApiAddrType: 'postal_code',
                    gApiAddrAttr: 'long_name',
                    emptyText: 'Post Code',
                    width: 73,
                    bind: {
                        value: '{cartValues.OACSTPST}'
                    }
                }]
            }, {
                name: 'OACSTCOU',
                gApiAddrType: 'country',
                gApiAddrAttr: 'long_name',
                fieldLabel: '&nbsp;',
                labelSeparator: '',
                emptyText: 'Country',
                bind: {
                    value: '{cartValues.OACSTCOU}'
                }
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: 'Phone',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                readOnly: false,
                disabled: false,
                defaults: {
                    xtype: 'textfield',
                    hideLabel: true,
                    readOnly: me.release,
                    disabled: me.release,
                    flex: 1
                },
                items: [{
                    name: 'OACSTPH1',
                    allowBlank: false,
                    margin: '0 8 0 0',
                    bind: {
                        value: '{cartValues.OACSTPH1}'
                    }
                }, {
                    name: 'OACSTPH2',
                    bind: {
                        value: '{cartValues.OACSTPH2}'
                    }
                }]
            }, {
                name: 'OACSTEML',
                fieldLabel: 'Email',
                vtype: 'email',
                margin: '0 0 8 0',
                allowBlank: false,
                bind: {
                    value: '{cartValues.OACSTEML}'
                }
            }]
        }, {
            xtype: 'fieldset',
            title: 'Delivery Address (if different delivery)',
            cls: 'cart-fieldset',
            flex: 1,
            itemId: 'deliveryfieldset',
            reference: 'deliveryfieldset',
            defaultType: 'textfield',
            defaults: {
                labelAlign: 'left',
                labelWidth: me.baseLabelWidth,
                anchor: '100%',
                disabled: false
            },
            margin: '0 0 0 10',
            padding: '0 20',
            checkboxToggle: true,
            collapsable: true,
            checkbox: {
                itemId: 'deliveryChkbox',
                value: false,
                listeners: {
                    scope: me,
                    change: function (cmp, value) {
                        //console.log('checkbox changed' + value);
                        this.down('#deliveryfieldset').setExpanded(value);
                        //this.down('#deliveryfieldset').down('checkbox').setValue(value);
                    }
                    //change: 'onDelBoxChk'
                }
            },
            items: [{
                name: 'OADELNAM',
                fieldLabel: 'Name',
                bind: {
                    value: {
                        single: me.release,
                        bindTo: '{cartValues.OADELNAM}'
                    }
                }
            }, {
                itemId: 'deliverySearch',
                name: 'OADELST1',
                gApiAddrType: 'baseAddressLine1',
                fieldLabel: 'Address',
                allowBlank: false,
                bind: {
                    value: {
                        single: me.release,
                        bindTo: '{cartValues.OADELST1}'
                    }
                },
                listeners: {
                    afterrender: 'onAfterRenderAddressSearch'
                }
            }, {
                name: 'OADELST2',
                fieldLabel: '&nbsp;',
                labelSeparator: '',
                addressLine2: true,
                bind: {
                    value: {
                        single: me.release,
                        bindTo: '{cartValues.OADELST2}'
                    }
                }
            }, {
                xtype: 'fieldcontainer',
                labelWidth: me.baseLabelWidth,
                labelSeparator: '',
                fieldLabel: '&nbsp;',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    xtype: 'textfield',
                    hideLabel: true
                },
                items: [{
                    name: 'OADELCTY',
                    allowBlank: false,
                    margin: '0 8 0 0',
                    gApiAddrType: 'locality',
                    gApiAddrAttr: 'long_name',
                    emptyText: 'City',
                    flex: 1,
                    bind: {
                        value: {
                            single: me.release,
                            bindTo: '{cartValues.OADELCTY}'
                        }
                    }
                }, {
                    name: 'OADELSTA',
                    allowBlank: false,
                    margin: '0 8 0 0',
                    gApiAddrType: 'administrative_area_level_1',
                    gApiAddrAttr: 'short_name',
                    emptyText: 'State',
                    width: 50,
                    bind: {
                        value: {
                            single: me.release,
                            bindTo: '{cartValues.OADELSTA}'
                        }
                    }
                }, {
                    name: 'OADELPST',
                    allowBlank: false,
                    gApiAddrType: 'postal_code',
                    gApiAddrAttr: 'long_name',
                    emptyText: 'Post Code',
                    width: 73,
                    bind: {
                        value: {
                            single: me.release,
                            bindTo: '{cartValues.OADELPST}'
                        }
                    }
                }]
            }, {
                name: 'OADELCOU',
                gApiAddrType: 'country',
                gApiAddrAttr: 'long_name',
                fieldLabel: '&nbsp;',
                labelSeparator: '',
                emptyText: 'Country',
                bind: {
                    value: {
                        single: me.release,
                        bindTo: '{cartValues.OADELCOU}'
                    }
                }
            }, {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                hideLabel: true,
                defaults: {
                    xtype: 'textfield',
                    hideLabel: true,
                    flex: 1
                },
                items: [
                    {
                        flex: 0,
                        xtype: 'label',
                        text: 'Phone:',
                        cls: 'x-form-item-label x-form-item-label-default',
                        width: me.baseLabelWidth + 5
                    },
                    {
                        name: 'OADELPH1',
                        allowBlank: false,
                        margin: '0 16 0 0',
                        bind: {
                            value: {
                                single: me.release,
                                bindTo: '{cartValues.OADELPH1}'
                            }
                        }
                    }, {
                        name: 'OADELPH2',
                        bind: {
                            value: {
                                single: me.release,
                                bindTo: '{cartValues.OADELPH2}'
                            }
                        }
                    }]
            }, {
                name: 'OADELEML',
                fieldLabel: 'Email',
                margin: '0 0 8 0',
                vtype: 'email',
                bind: {
                    value: {
                        single: me.release,
                        bindTo: '{cartValues.OADELEML}'
                    }
                }
            }],
            listeners: {
                scope: me,
                afterrender: function (cmp) {
                    var cartValues = this.lookupViewModel().get('cartValues'),
                        checkbox = this.down('#deliveryChkbox');

                    if (!Ext.isEmpty(cartValues) && !Ext.isEmpty(cartValues.OADELST1)) {
                        checkbox.setValue(true);
                        cmp.setExpanded(true);
                    } else {
                        checkbox.setValue(false);
                        cmp.setExpanded(false);
                    }
                },
                beforecollapse: function (cmp) {
                    var fields = cmp.query('field'),
                        containers = cmp.query('fieldcontainer'),
                        labels = cmp.query('label'),
                        regex = new RegExp('checkbox', "i"),
                        field;

                    for (var i = 0; i < fields.length; i++) {
                        field = fields[i];
                        if (!regex.test(field.xtype)) {
                            fields[i].setDisabled(true);
                        }
                    }

                    for (var ii = 0; ii < labels.length; ii++) {
                        labels[ii].addCls('cart-del-lbl-disabled');
                    }

                    for (var ii = 0; ii < containers.length; ii++) {
                        containers[ii].setDisabled(false);
                    }
                    return false;
                },
                beforeexpand: function (cmp) {
                    var fields = cmp.query('field'),
                        containers = cmp.query('fieldcontainer'),
                        labels = cmp.query('label'),
                        regex = new RegExp('checkbox', "i"),
                        field;
                    for (var i = 0; i < fields.length; i++) {
                        field = fields[i];
                        if (!regex.test(field.xtype)) {
                            field.setDisabled(false);
                        }
                    }
                    for (var ii = 0; ii < labels.length; ii++) {
                        labels[ii].removeCls('cart-del-lbl-disabled');
                    }
                    for (var ii = 0; ii < containers.length; ii++) {
                        containers[ii].setDisabled(false);
                    }
                    return false;
                }
            }
        }];
    }
});