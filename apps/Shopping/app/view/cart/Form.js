Ext.define('Shopping.view.cart.Form', {
    extend   : 'Ext.form.Panel',
    requires : [
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.form.field.Date',
        'Ext.form.field.ComboBox',
        'Ext.layout.container.Table'
    ],
    xtype    : 'cartform',

    initComponent : function () {
        var me = this;

        Ext.apply(me, {
            items : me.buildItems(me.cartOptions)
        });
        me.callParent(arguments);
    },

    buildItems : function (opts) {
        var ninety    = new Date(),
            optItems = [],
            optItem;
        ninety.setDate(ninety.getDate() + 90);

        for (var i = 0; i < opts.length; i++) {
            optItem = opts[i];
            optItems.push({
                xtype : 'checkbox',
                boxLabel : optItem.DELOPTD,
                uncheckedValue : '0',
                inputValue : '1',
                name : optItem.DELOPTC,
                width :'100%'
            });
        }

        return [
            {
                xtype         : 'fieldset',
                title         : 'Order Info',
                defaultType   : 'textfield',
                cls           : 'cart-fieldset',
                itemId        : 'orderInfoFieldSet',
                fieldDefaults : {
                    labelAlign     : 'top',
                    labelSeparator : '',
                    padding        : 5,
                    width          : '22%'
                },
                margin : 0,
                padding       : '0 20',
                layout        : {
                    type  : 'hbox',
                    align : 'stretch'
                },
                defaults      : {
                    flex : 1
                },
                items         : [
                    {
                        xtype    : 'container',
                        layout   : {
                            type  : 'vbox',
                            align : 'stretch'
                        },
                        minWidth : 250,
                        defaults : {
                            labelAlign : 'left',
                            labelWidth   : 150
                        },
                        items    : [{
                            xtype : 'textfield',
                            name  : 'OAORDKEY',
                            hidden : true
                        }, {
                            xtype      : 'textfield',
                            name       : 'OACSTREF',
                            fieldLabel : 'Reference *',
                            allowBlank : false,
                            reference : 'reffield',
                        }, {
                            xtype          : 'combo',
                            bind           : {
                                store : '{cartReps}'
                            },
                            queryMode      : 'local',
                            reference : 'cartrepscombo',
                            displayField   : 'REP',
                            valueField     : 'REP',
                            name           : 'OAREP',
                            forceSelection : true,
                            fieldLabel     : 'Sales Person *',
                            allowBlank     : false,
                            minWidth       : 200,
                            anyMatch : true
                        }, {
                            xtype        : 'datefield',
                            name         : 'OADELD',
                            required     : true,
                            fieldLabel   : 'Preferred Delivery Date',
                            minValue     : new Date(),
                            maxValue     : ninety,
                            format       : 'd/m/Y',
                            submitFormat : 'Y-m-d',
                            minWidth     : 135
                        }]
                    }, {
                        xtype  : 'panel',
                        title : 'Delivery Options',
                        cls : 'delopts-panel',
                        ui : 'inset',
                        margin : '2 8 20 24',
                        bodyPadding : '4 24 4 48',
                        scrollable : 'y',
                        flex : 2,
                        maxHeight : 122,
                        border : '1px solid black',
                        layout : {
                            type  : 'table',
                            columns : 3
                        },
                        items  : optItems
                    }
                ]
            },
            {
                xtype  : 'container',
                layout : {
                    type  : 'hbox',
                    align : 'stretch'
                },
                margin : 0,
                items  : [
                    {
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
                            labelWidth : 150
                        },
                        items         : [
                            {
                                name       : 'OACSTNAM',
                                fieldLabel : 'Name',
                                required   : true
                            },
                            {
                                itemId     : 'customerSearch',
                                name       : 'customerSearch',
                                fieldLabel : 'Address Search'
                            },
                            {
                                name         : 'OACSTST1',
                                gApiAddrType : 'baseAddressLine1',
                                fieldLabel   : 'Street Address 1',
                                required     : true
                            },
                            {
                                name       : 'OACSTST2',
                                fieldLabel : 'Street Address 2'
                            },
                            {
                                name         : 'OACSTCTY',
                                required     : true,
                                gApiAddrType : 'locality',
                                gApiAddrAttr : 'long_name',
                                fieldLabel   : 'City'
                            },
                            {
                                name         : 'OACSTSTA',
                                required     : true,
                                gApiAddrType : 'administrative_area_level_1',
                                gApiAddrAttr : 'short_name',
                                fieldLabel   : 'State'
                            },
                            {
                                name         : 'OACSTPST',
                                required     : true,
                                gApiAddrType : 'postal_code',
                                gApiAddrAttr : 'long_name',
                                fieldLabel   : 'Post Code'
                            },
                            {
                                name         : 'OACSTCOU',
                                gApiAddrType : 'country',
                                gApiAddrAttr : 'long_name',
                                fieldLabel   : 'Country'
                            },
                            {
                                name       : 'OACSTPH1',
                                fieldLabel : 'Daytime Phone',
                                required   : true
                            },
                            {
                                name       : 'OACSTPH2',
                                fieldLabel : 'After Hours Phone'
                            },
                            {
                                name       : 'OACSTEML',
                                fieldLabel : 'Email Address',
                                vtype      : 'email',
                                required   : true
                            }
                        ]
                    },
                    {
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
                        items          : [
                            {
                                name       : 'OADELNAM',
                                fieldLabel : 'Name'
                            },
                            {
                                itemId     : 'deliverySearch',
                                name       : 'deliverySearch',
                                fieldLabel : 'Address Search'
                            },
                            {
                                name         : 'OADELST1',
                                gApiAddrType : 'baseAddressLine1',
                                fieldLabel   : 'Street Address 1',
                                required     : true
                            },
                            {
                                name       : 'OADELST2',
                                fieldLabel : 'Street Address 2'
                            },
                            {
                                name         : 'OADELCTY',
                                required     : true,
                                gApiAddrType : 'locality',
                                gApiAddrAttr : 'long_name',
                                fieldLabel   : 'City'
                            },
                            {
                                name         : 'OADELSTA',
                                required     : true,
                                gApiAddrType : 'administrative_area_level_1',
                                gApiAddrAttr : 'short_name',
                                fieldLabel   : 'State'
                            },
                            {
                                name         : 'OADELPST',
                                required     : true,
                                gApiAddrType : 'postal_code',
                                gApiAddrAttr : 'long_name',
                                fieldLabel   : 'Post Code'
                            },
                            {
                                name         : 'OADELCOU',
                                gApiAddrType : 'country',
                                gApiAddrAttr : 'long_name',
                                fieldLabel   : 'Country'
                            },
                            {
                                name       : 'OADELPH1',
                                fieldLabel : 'Daytime Phone'
                            },
                            {
                                name       : 'OADELPH2',
                                fieldLabel : 'After Hours Phone'
                            },
                            {
                                name       : 'OADELEML',
                                fieldLabel : 'Email Address',
                                vtype      : 'email'
                            }
                        ],
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
                                    regex = new RegExp('checkbox',"i"),
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
                                    regex = new RegExp('checkbox',"i"),
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
                    }
                ]
            },
            {
                xtype   : 'fieldset',
                title   : 'Special Instructions',
                cls     : 'cart-fieldset',
                padding : '5 18 5 15',
                items   : [
                    {
                        xtype         : 'textareafield',
                        name          : 'OASPI',
                        anchor        : '100%',
                        maxLength     : 160,
                        maxLengthText : 'This field is limited to 160 characters.'
                    }
                ]
            }
        ];
    }
});
