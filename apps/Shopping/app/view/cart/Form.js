Ext.define('Shopping.view.cart.Form', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.form.field.Date',
        'Ext.form.field.ComboBox',
        'Ext.layout.container.Table',
        'Shopping.view.cart.CustomerDetail',
        'Shopping.view.cart.SpecialInstructions',
        'Shopping.view.cart.FollowUp',
        'Shopping.view.cart.DeliveryOptions',

        //'Shopping.view.cart.NoteList'
    ],
    xtype: 'cartform',
    release: false,
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: me.buildItems()
        });
        me.callParent(arguments);
    },

    buildItems: function () {
        var me = this,
            getRepComponent = function () {
                var repConfig = {
                    xtype: 'combo',
                    cls: 'sales-rep',
                    margin: '0 32 0 0',
                    labelWidth: 90,
                    bind: {
                        store: '{cartReps}',
                        value: '{cartValues.OAREP}'
                    },
                    queryMode: 'local',
                    reference: 'cartrepscombo',
                    itemId: 'cartrepscombo',
                    displayField: 'REP',
                    valueField: 'REP',
                    name: 'OAREP',
                    forceSelection: true,
                    fieldLabel: 'Sales Person',
                    allowBlank: false,
                    minWidth: 200,
                    anyMatch: true
                };

                if (me.release) {
                    Ext.apply(repConfig, {
                        readOnly: true,
                        disabled: true
                    });
                } else {
                    Ext.apply(repConfig.bind, {
                        disabled: '{disableSalesPerson}'
                    });
                }
                return repConfig;
            },
            baseItems = [{
                xtype: 'fieldset',
                title: 'Order Info',
                defaultType: 'textfield',
                cls: 'cart-fieldset',
                itemId: 'orderInfoFieldSet',
                margin: 0,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    flex: 1
                },
                items: [{
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    padding: '0 32 4 32',
                    defaults: {
                        labelAlign: 'left',
                        flex: 1
                    },
                    items: [{
                        xtype: 'textfield',
                        name: 'OAORDKEY',
                        hidden: true,
                        bind: {
                            value: '{activeCartNumber}'
                        }
                    }, {
                        xtype: 'textfield',
                        margin: '0 32 0 0',
                        labelWidth: 75,
                        name: 'OACSTREF',
                        fieldLabel: 'Reference',
                        allowBlank: false,
                        reference: 'reffield',
                        itemId: 'reffield',
                        bind: {
                            value: {
                                single: me.release,
                                bindTo: '{cartValues.OACSTREF}'
                            }
                        }
                    }, getRepComponent(), {
                        xtype: 'datefield',
                        name: 'OADELD',
                        allowBlank: false,
                        fieldLabel: 'Preferred Delivery Date',
                        labelWidth: 150,
                        flex: 0,
                        width: 280,
                        minValue: new Date(),
                        maxValue: Ext.Date.add(new Date(), Ext.Date.YEAR, 1), //1 Year from the current date
                        format: 'd/m/Y',
                        submitFormat: 'Y-m-d',
                        disabledDatesText: 'Delivery not available on holidays',
                        disabledDaysText: 'Delivery not available on weekends',
                        bind: {
                            disabledDates: '{deliveryDisabledDates}',
                            disabledDays: '{deliveryDisabledDays}',
                            value: {
                                single: me.release,
                                bindTo: '{cartValues.OADELD}'
                            }
                        }
                    }]
                }]
            }, {
                xtype: 'cart-customerdetail',
                release: me.release
            }];

        if (me.release) {
            var options = me.lookupViewModel(true).get('deliveryOptions');
            if (!Ext.isEmpty(options)) {
                baseItems.push({
                    xtype: 'deliveryoptions'
                });
            }
        }

        baseItems.push({
            xtype: 'specialinstructions',
            release: me.release
        });


        if (!me.release) {
            baseItems.push({
                xtype: 'followup'
            });
        }

        // baseItems.push({
        //     xtype: 'notelist'
        // });
        return baseItems;
    }
});
