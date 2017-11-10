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
    editCustomer  : true,
    initComponent : function () {
        var me = this;

        Ext.apply(me, {
            items : me.buildItems(me.cartOptions)
        });
        me.callParent(arguments);
    },
    buildItems    : function () {
        var me = this,
            customerReadOnly = (!Ext.isEmpty(me.editCustomer) && me.editCustomer === true) ? false : true;

        return [{
            xtype         : 'fieldset',
            title         : 'Customer Details',
            cls           : 'cart-fieldset',
            flex          : 1,
            itemId        : 'customerfieldset',
            defaultType   : 'textfield',
            defaults      : {
                anchor : '100%'
            },
            margin        : '0 18 0 0',
            padding       : '0 20',
            fieldDefaults : {
                labelAlign : 'left',
                labelWidth : 150,
                readOnly   : customerReadOnly
            },
            items         : [{
                name       : 'OACSTNAM',
                fieldLabel : 'Name',
                required   : true
            }, {
                itemId     : 'customerSearch',
                name       : 'customerSearch',
                fieldLabel : 'Address Search',
                hidden     : customerReadOnly
            }, {
                name         : 'OACSTST1',
                gApiAddrType : 'baseAddressLine1',
                fieldLabel   : 'Street Address 1',
                required     : true
            }, {
                name       : 'OACSTST2',
                fieldLabel : 'Street Address 2'
            }, {
                name         : 'OACSTCTY',
                required     : true,
                gApiAddrType : 'locality',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'City'
            }, {
                name         : 'OACSTSTA',
                required     : true,
                gApiAddrType : 'administrative_area_level_1',
                gApiAddrAttr : 'short_name',
                fieldLabel   : 'State'
            }, {
                name         : 'OACSTPST',
                required     : true,
                gApiAddrType : 'postal_code',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'Post Code'
            }, {
                name         : 'OACSTCOU',
                gApiAddrType : 'country',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'Country'
            }, {
                name       : 'OACSTPH1',
                fieldLabel : 'Daytime Phone',
                required   : true
            }, {
                name       : 'OACSTPH2',
                fieldLabel : 'After Hours Phone'
            }, {
                name       : 'OACSTEML',
                fieldLabel : 'Email Address',
                vtype      : 'email',
                required   : true
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
                anchor   : '100%',
                disabled : true
            },
            margin         : '0 0 0 20',
            padding        : '0 20',
            fieldDefaults  : {
                labelAlign : 'left',
                labelWidth : 150
            },
            checkboxName   : 'dlvychbx',
            checkboxToggle : true,
            collapsable    : true,
            items          : [{
                name       : 'OADELNAM',
                fieldLabel : 'Name'
            }, {
                itemId     : 'deliverySearch',
                name       : 'deliverySearch',
                fieldLabel : 'Address Search'
            }, {
                name         : 'OADELST1',
                gApiAddrType : 'baseAddressLine1',
                fieldLabel   : 'Street Address 1',
                required     : true
            }, {
                name       : 'OADELST2',
                fieldLabel : 'Street Address 2'
            }, {
                name         : 'OADELCTY',
                required     : true,
                gApiAddrType : 'locality',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'City'
            }, {
                name         : 'OADELSTA',
                required     : true,
                gApiAddrType : 'administrative_area_level_1',
                gApiAddrAttr : 'short_name',
                fieldLabel   : 'State'
            }, {
                name         : 'OADELPST',
                required     : true,
                gApiAddrType : 'postal_code',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'Post Code'
            }, {
                name         : 'OADELCOU',
                gApiAddrType : 'country',
                gApiAddrAttr : 'long_name',
                fieldLabel   : 'Country'
            }, {
                name       : 'OADELPH1',
                fieldLabel : 'Daytime Phone'
            }, {
                name       : 'OADELPH2',
                fieldLabel : 'After Hours Phone'
            }, {
                name       : 'OADELEML',
                fieldLabel : 'Email Address',
                vtype      : 'email'
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