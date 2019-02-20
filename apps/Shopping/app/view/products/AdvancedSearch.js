Ext.define('Shopping.view.products.AdvancedSearch', {
    extend: 'Ext.window.Window',
    xtype: 'advancedsearch',

    requires: [
        'Ext.form.Panel'
    ],

    modal: true,
    closable: true,
    //title: 'Advanced Search',
    bind: {
        title: 'Search in ' + '{catDesc}'
    },
    //bodyPadding: 10,


    listeners: {
        beforeshow: 'onSearchFormBeforeShow',
    },
    items: {
        xtype: 'form',
        reference: 'advancedSearchForm',
        bodyPadding: 10,
        items: [
            {
                xtype: 'textfield',
                name: 'cat',
                fieldLabel: 'cat',
                bind: {
                    value: '{catId}'
                },
                hidden: true
            },
            // {
            //     xtype: 'textfield',
            //     name: 'password',
            //     inputType: 'password',
            //     fieldLabel: 'Password',
            //     allowBlank: false
            // }
        ],
        buttons: [
            {
                text: 'Cancel',
                handler: function () { this.up('window').close(); }
            },
            {
                text: 'Search',
                formBind: true,
                listeners: {
                    click: 'onSearchRequestClick'
                }
            },]
    }

})