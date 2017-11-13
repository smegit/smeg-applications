Ext.define('Shopping.view.cart.CustomerDetail', {
    extend : 'Ext.Container',
    xtype  : 'cart-customerdetail',

    requires : [
        'Ext.form.FieldSet'
    ],

    layout        : {
        type  : 'hbox',
        align : 'stretch'
    },
    margin        : 0,
    release       : false,
    initComponent : function () {
        var me = this;

        Ext.apply(me, {
            items : me.buildItems(me.cartOptions)
        });
        me.callParent(arguments);
    },
    buildItems    : function () {
        var me = this;
        return [{
            xtype       : 'fieldset',
            title       : 'Customer Details',
            cls         : 'cart-fieldset',
            flex        : 1,
            itemId      : 'customerfieldset',
            defaultType : 'textfield',
            margin      : '0 18 0 0',
            padding     : '0 20',
            defaults    : {
                labelAlign : 'left',
                labelWidth : 150,
                readOnly   : me.release,
                width      : '100%'
            },
            items       : [{
                name       : 'OACSTNAM',
                fieldLabel : 'Name',
                required   : true,
                readOnly   : me.release,
                bind       : {
                    value : '{cartValues.OACSTNAM}'
                }
            }, {
                itemId     : 'customerSearch',
                name       : 'customerSearch',
                fieldLabel : 'Address Search',
                hidden     : me.release
            }, {
                name         : 'OACSTST1',
                gApiAddrType : 'baseAddressLine1',
                fieldLabel   : 'Street Address 1',
                required     : true,
                bind         : {
                    value : '{cartValues.OACSTST1}'
                }
            }, {
                name       : 'OACSTST2',
                fieldLabel : 'Street Address 2',
                bind       : {
                    value : '{cartValues.OACSTST2}'
                }
            }, {
                name         : 'OACSTCTY',
                required     : true,
                gApiAddrType : 'locality',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'City',
                bind         : {
                    value : '{cartValues.OACSTCTY}'
                }
            }, {
                name         : 'OACSTSTA',
                required     : true,
                gApiAddrType : 'administrative_area_level_1',
                gApiAddrAttr : 'short_name',
                fieldLabel   : 'State',
                bind         : {
                    value : '{cartValues.OACSTSTA}'
                }
            }, {
                name         : 'OACSTPST',
                required     : true,
                gApiAddrType : 'postal_code',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'Post Code',
                bind         : {
                    value : '{cartValues.OACSTPST}'
                }
            }, {
                name         : 'OACSTCOU',
                gApiAddrType : 'country',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'Country',
                bind         : {
                    value : '{cartValues.OACSTCOU}'
                }
            }, {
                name       : 'OACSTPH1',
                fieldLabel : 'Daytime Phone',
                required   : true,
                bind       : {
                    value : '{cartValues.OACSTPH1}'
                }
            }, {
                name       : 'OACSTPH2',
                fieldLabel : 'After Hours Phone',
                bind       : {
                    value : '{cartValues.OACSTPH2}'
                }
            }, {
                name       : 'OACSTEML',
                fieldLabel : 'Email Address',
                vtype      : 'email',
                required   : true,
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
                labelWidth : 150,
                anchor     : '100%',
                disabled   : true
            },
            margin         : '0 0 0 20',
            padding        : '0 20',
            checkboxName   : 'dlvychbx',
            checkboxToggle : true,
            collapsable    : true,
            items          : [{
                name       : 'OADELNAM',
                fieldLabel : 'Name',
                bind       : {
                    value : '{cartValues.OADELNAM}'
                }
            }, {
                itemId     : 'deliverySearch',
                name       : 'deliverySearch',
                fieldLabel : 'Address Search'
            }, {
                name         : 'OADELST1',
                gApiAddrType : 'baseAddressLine1',
                fieldLabel   : 'Street Address 1',
                required     : true,
                bind         : {
                    value : '{cartValues.OADELST1}'
                }
            }, {
                name       : 'OADELST2',
                fieldLabel : 'Street Address 2',
                bind       : {
                    value : '{cartValues.OADELST2}'
                }
            }, {
                name         : 'OADELCTY',
                required     : true,
                gApiAddrType : 'locality',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'City',
                bind         : {
                    value : '{cartValues.OADELCTY}'
                }
            }, {
                name         : 'OADELSTA',
                required     : true,
                gApiAddrType : 'administrative_area_level_1',
                gApiAddrAttr : 'short_name',
                fieldLabel   : 'State',
                bind         : {
                    value : '{cartValues.OADELSTA}'
                }
            }, {
                name         : 'OADELPST',
                required     : true,
                gApiAddrType : 'postal_code',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'Post Code',
                bind         : {
                    value : '{cartValues.OADELPST}'
                }
            }, {
                name         : 'OADELCOU',
                gApiAddrType : 'country',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'Country',
                bind         : {
                    value : '{cartValues.OADELCOU}'
                }
            }, {
                name       : 'OADELPH1',
                fieldLabel : 'Daytime Phone',
                bind       : {
                    value : '{cartValues.OADELPH1}'
                }
            }, {
                name       : 'OADELPH2',
                fieldLabel : 'After Hours Phone',
                bind       : {
                    value : '{cartValues.OADELPH2}'
                }
            }, {
                name       : 'OADELEML',
                fieldLabel : 'Email Address',
                vtype      : 'email',
                bind       : {
                    value : '{cartValues.OADELEML}'
                }
            }],
            listeners      : {
                afterrender    : function (cmp) {
                    var checkbox = cmp.down('checkbox');
                    if (!Ext.isEmpty(checkbox) && !Ext.isEmpty(checkbox.getEl())) {
                        checkbox.setValue(false);
                    } else {
                        checkbox.on({
                            afterrender : function (cmp) {
                                cmp.setValue(false);
                            }
                        });
                    }
                },
                beforecollapse : function (cmp) {
                    var fields = cmp.query('field'),
                        regex  = new RegExp('checkbox', "i"),
                        field;

                    for (var i = 0; i < fields.length; i++) {
                        field = fields[i];
                        if (!regex.test(field.xtype)) {
                            fields[i].setDisabled(true);
                        }
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