Ext.define('Shopping.view.cart.Form', {
    extend   : 'Ext.form.Panel',
    requires : [
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.form.field.Date',
        'Ext.form.field.ComboBox',
        'Ext.layout.container.Table',
        'Shopping.view.cart.CustomerDetail'
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
        //removing delivery options from the main cart
        // johnny
        // var optItems = [],
        //     optItem;
        //
        // for (var i = 0; i < opts.length; i++) {
        //     optItem = opts[i];
        //     optItems.push({
        //         xtype          : 'checkbox',
        //         fieldLabel     : optItem.DELOPTD,
        //         uncheckedValue : '0',
        //         inputValue     : '1',
        //         name           : optItem.DELOPTC,
        //         width          : '100%',
        //         colspan        : (optItem.DELOPTD === 'Switch door open on dryer') ? 2 : 1
        //     });
        // }

        return [
            {
                xtype       : 'fieldset',
                title       : 'Order Info',
                defaultType : 'textfield',
                cls         : 'cart-fieldset',
                itemId      : 'orderInfoFieldSet',
                margin      : 0,
                layout      : {
                    type  : 'hbox',
                    align : 'stretch'
                },
                defaults    : {
                    flex : 1
                },
                items       : [
                    {
                        xtype    : 'container',
                        layout   : {
                            type  : 'hbox',
                            align : 'stretch'
                        },
                        padding  : '0 32 4 32',
                        defaults : {
                            labelAlign : 'left',
                            flex       : 1
                        },
                        items    : [{
                            xtype  : 'textfield',
                            name   : 'OAORDKEY',
                            hidden : true
                        }, {
                            xtype      : 'textfield',
                            margin     : '0 32 0 0',
                            labelWidth : 75,
                            name       : 'OACSTREF',
                            fieldLabel : 'Reference *',
                            allowBlank : false,
                            reference  : 'reffield'
                        }, {
                            xtype          : 'combo',
                            margin         : '0 32 0 0',
                            labelWidth     : 90,
                            bind           : {
                                store : '{cartReps}'
                            },
                            queryMode      : 'local',
                            reference      : 'cartrepscombo',
                            displayField   : 'REP',
                            valueField     : 'REP',
                            name           : 'OAREP',
                            forceSelection : true,
                            fieldLabel     : 'Sales Person *',
                            allowBlank     : false,
                            minWidth       : 200,
                            anyMatch       : true
                        }, {
                            xtype             : 'datefield',
                            name              : 'OADELD',
                            required          : true,
                            fieldLabel        : 'Preferred Delivery Date',
                            labelWidth        : 150,
                            flex              : 0,
                            width             : 270,
                            minValue          : new Date(),
                            maxValue          : Ext.Date.add(new Date(), Ext.Date.YEAR, 1), //1 Year from the current date
                            format            : 'd/m/Y',
                            submitFormat      : 'Y-m-d',
                            disabledDatesText : 'Delivery not available on holidays',
                            disabledDaysText  : 'Delivery not available on weekends',
                            bind              : {
                                disabledDates : '{deliveryDisabledDates}',
                                disabledDays  : '{deliveryDisabledDays}'
                            }
                        }]
                        // }, {
                        //     xtype       : 'panel',
                        //     title       : 'Delivery Options',
                        //     cls         : 'delopts-panel',
                        //     ui          : 'inset',
                        //     margin      : '0 0 0 32',
                        //     bodyPadding : 8,
                        //     flex        : 2,
                        //     maxHeight   : 155,
                        //     border      : '1px solid black',
                        //     layout      : {
                        //         type    : 'table',
                        //         columns : 4
                        //     },
                        //     defaults    : {
                        //         labelAlign    : 'top',
                        //         labelSepartor : ''
                        //     },
                        //     items       : optItems
                    }
                ]
            }, {
                xtype : 'cart-customerdetail'
            }, {
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
