Ext.define('Shopping.view.cart.CustomerDetail', {
    extend : 'Ext.Container',
    xtype  : 'cart-customerdetail',

    requires : [
        'Ext.form.FieldContainer',
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox'
    ],

    layout         : {
        type  : 'hbox',
        align : 'stretch'
    },
    margin         : 0,
    release        : false,
    baseLabelWidth : 90,
    initComponent  : function () {
        var me = this;

        Ext.apply(me, {
            items : me.buildItems(me.cartOptions)
        });
        me.callParent(arguments);
    },
    buildItems     : function () {
        var me = this;
        return [{
            xtype       : 'fieldset',
            title       : 'Customer Details',
            cls         : 'cart-fieldset',
            flex        : 1,
            itemId      : 'customerfieldset',
            defaultType : 'textfield',
            margin      : '0 10 0 0',
            padding     : '0 20',
            defaults    : {
                labelAlign : 'left',
                labelWidth : me.baseLabelWidth,
                readOnly   : me.release,
                disabled   : me.release,
                width      : '100%'
            },
            items       : [{
                name       : 'OACSTNAM',
                fieldLabel : 'Name',
                allowBlank : false,
                readOnly   : me.release,
                disabled   : me.release,
                bind       : {
                    value : '{cartValues.OACSTNAM}'
                }
            }, {
                itemId       : 'customerSearch',
                name         : 'OACSTST1',
                gApiAddrType : 'baseAddressLine1',
                fieldLabel   : 'Address',
                emptyText    : 'Street Address 2',
                allowBlank   : false,
                bind         : {
                    value : '{cartValues.OACSTST1}'
                },
                listeners    : {
                    afterrender : 'onAfterRenderAddressSearch'
                }
            }, {
                name           : 'OACSTST2',
                fieldLabel     : '&nbsp;',
                labelSeparator : '',
                addressLine2   : true,
                emptyText      : 'Street Address 2',
                bind           : {
                    value : '{cartValues.OACSTST2}'
                }
            }, {
                xtype          : 'fieldcontainer',
                labelWidth     : me.baseLabelWidth,
                labelSeparator : '',
                fieldLabel     : '&nbsp;',
                readOnly       : false,
                disabled       : false,
                layout         : {
                    type  : 'hbox',
                    align : 'stretch'
                },
                defaults       : {
                    xtype     : 'textfield',
                    hideLabel : true,
                    readOnly  : me.release,
                    disabled  : me.release
                },
                items          : [{
                    name         : 'OACSTCTY',
                    allowBlank   : false,
                    margin       : '0 8 0 0',
                    gApiAddrType : 'locality',
                    gApiAddrAttr : 'long_name',
                    emptyText    : 'City',
                    flex         : 1,
                    bind         : {
                        value : '{cartValues.OACSTCTY}'
                    }
                }, {
                    name         : 'OACSTSTA',
                    allowBlank   : false,
                    margin       : '0 8 0 0',
                    gApiAddrType : 'administrative_area_level_1',
                    gApiAddrAttr : 'short_name',
                    emptyText    : 'State',
                    width        : 50,
                    bind         : {
                        value : '{cartValues.OACSTSTA}'
                    }
                }, {
                    name         : 'OACSTPST',
                    allowBlank   : false,
                    gApiAddrType : 'postal_code',
                    gApiAddrAttr : 'long_name',
                    emptyText    : 'Post Code',
                    width        : 73,
                    bind         : {
                        value : '{cartValues.OACSTPST}'
                    }
                }]
            }, {
                name           : 'OACSTCOU',
                gApiAddrType   : 'country',
                gApiAddrAttr   : 'long_name',
                fieldLabel     : '&nbsp;',
                labelSeparator : '',
                emptyText      : 'Country',
                bind           : {
                    value : '{cartValues.OACSTCOU}'
                }
            }, {
                xtype      : 'fieldcontainer',
                fieldLabel : 'Phone',
                layout     : {
                    type  : 'hbox',
                    align : 'stretch'
                },
                readOnly   : false,
                disabled   : false,
                defaults   : {
                    xtype     : 'textfield',
                    hideLabel : true,
                    readOnly  : me.release,
                    disabled  : me.release,
                    flex      : 1
                },
                items      : [{
                    name       : 'OACSTPH1',
                    allowBlank : false,
                    margin     : '0 8 0 0',
                    bind       : {
                        value : '{cartValues.OACSTPH1}'
                    }
                }, {
                    name : 'OACSTPH2',
                    bind : {
                        value : '{cartValues.OACSTPH2}'
                    }
                }]
            }, {
                name       : 'OACSTEML',
                fieldLabel : 'Email Address',
                vtype      : 'email',
                margin     : '0 0 8 0',
                allowBlank : false,
                bind       : {
                    value : '{cartValues.OACSTEML}'
                }
            }]
        }, {
            xtype          : 'fieldset',
            title          : 'Delivery Address (if different delivery)',
            cls            : 'cart-fieldset',
            flex           : 1,
            itemId         : 'deliveryfieldset',
            reference      : 'deliveryfieldset',
            defaultType    : 'textfield',
            defaults       : {
                labelAlign : 'left',
                labelWidth : me.baseLabelWidth,
                anchor     : '100%',
                disabled   : true
            },
            margin         : '0 0 0 10',
            padding        : '0 20',
            checkboxToggle : true,
            collapsable    : true,
            checkbox       : {
                listeners : {
                    scope  : me,
                    change : function (cmp, value) {
                        this.down('#deliveryfieldset').setExpanded(value);
                    }
                }
            },
            items          : [{
                name       : 'OADELNAM',
                fieldLabel : 'Name',
                bind       : {
                    value : '{cartValues.OADELNAM}'
                }
            }, {
                itemId       : 'deliverySearch',
                name         : 'OADELST1',
                gApiAddrType : 'baseAddressLine1',
                fieldLabel   : 'Address',
                emptyText    : 'Street Address 1',
                allowBlank   : false,
                bind         : {
                    value : '{cartValues.OADELST1}'
                },
                listeners    : {
                    afterrender : 'onAfterRenderAddressSearch'
                }
            }, {
                name           : 'OADELST2',
                fieldLabel     : '&nbsp;',
                labelSeparator : '',
                addressLine2   : true,
                emptyText      : 'Street Address 2',
                bind           : {
                    value : '{cartValues.OADELST2}'
                }
            }, {
                xtype          : 'fieldcontainer',
                labelWidth     : me.baseLabelWidth,
                labelSeparator : '',
                fieldLabel     : '&nbsp;',
                layout         : {
                    type  : 'hbox',
                    align : 'stretch'
                },
                defaults       : {
                    xtype     : 'textfield',
                    hideLabel : true
                },
                items          : [{
                    name         : 'OADELCTY',
                    allowBlank   : false,
                    margin       : '0 8 0 0',
                    gApiAddrType : 'locality',
                    gApiAddrAttr : 'long_name',
                    emptyText    : 'City',
                    flex         : 1,
                    bind         : {
                        value : '{cartValues.OADELCTY}'
                    }
                }, {
                    name         : 'OADELSTA',
                    allowBlank   : false,
                    margin       : '0 8 0 0',
                    gApiAddrType : 'administrative_area_level_1',
                    gApiAddrAttr : 'short_name',
                    emptyText    : 'State',
                    width        : 50,
                    bind         : {
                        value : '{cartValues.OADELSTA}'
                    }
                }, {
                    name         : 'OADELPST',
                    allowBlank   : false,
                    gApiAddrType : 'postal_code',
                    gApiAddrAttr : 'long_name',
                    emptyText    : 'Post Code',
                    width        : 73,
                    bind         : {
                        value : '{cartValues.OADELPST}'
                    }
                }]
            }, {
                name           : 'OADELCOU',
                gApiAddrType   : 'country',
                gApiAddrAttr   : 'long_name',
                fieldLabel     : '&nbsp;',
                labelSeparator : '',
                emptyText      : 'Country',
                bind           : {
                    value : '{cartValues.OADELCOU}'
                }
            }, {
                xtype     : 'fieldcontainer',
                hideLabel : true,
                layout    : {
                    type  : 'hbox',
                    align : 'stretch'
                },
                defaults  : {
                    xtype     : 'textfield',
                    hideLabel : true,
                    flex      : 1
                },
                items     : [{
                    name       : 'OADELPH1',
                    emptyText  : 'Daytime',
                    hideLabel  : false,
                    fieldLabel : 'Phone',
                    labelWidth : me.baseLabelWidth,
                    allowBlank : false,
                    margin     : '0 16 0 0',
                    bind       : {
                        value : '{cartValues.OADELPH1}'
                    }
                }, {
                    name      : 'OADELPH2',
                    emptyText : 'After Hours',
                    bind      : {
                        value : '{cartValues.OADELPH2}'
                    }
                }]
            }, {
                name       : 'OADELEML',
                fieldLabel : 'Email Address',
                margin     : '0 0 8 0',
                vtype      : 'email',
                bind       : {
                    value : '{cartValues.OADELEML}'
                }
            }],
            listeners      : {
                afterrender    : function (cmp) {
                    cmp.setExpanded(false);
                },
                beforecollapse : function (cmp) {
                    var fields     = cmp.query('field'),
                        containers = cmp.query('fieldcontainer'),
                        regex      = new RegExp('checkbox', "i"),
                        field;

                    for (var i = 0; i < fields.length; i++) {
                        field = fields[i];
                        if (!regex.test(field.xtype)) {
                            fields[i].setDisabled(true);
                        }
                    }

                    for (var ii = 0; ii < containers.length; ii++) {
                        containers[ii].setDisabled(false);
                    }
                    return false;
                },
                beforeexpand   : function (cmp) {
                    var fields = cmp.query('field'),
                        regex  = new RegExp('checkbox', "i"),
                        field;
                    for (var i = 0; i < fields.length; i++) {
                        field = fields[i];
                        if (!regex.test(field.xtype)) {
                            field.setDisabled(false);
                        }
                    }
                    return false;
                }
            }
        }];
    }
});