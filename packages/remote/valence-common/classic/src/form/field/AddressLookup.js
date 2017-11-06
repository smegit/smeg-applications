Ext.define('Valence.common.form.field.AddressLookup', {
    extend : 'Ext.form.field.Text',
    xtype  : 'addresslookup',
    config : {
        /**
         * @cfg {Boolean} autoPopulateForm
         * If true will look up from the address lookup component for a form then
         *  loop through those form fields and applying data that has the property of 'gmapFormat'
         */
        autoPopulateForm : false,
        /**
         * @cfg {String} backgroundColor
         * Background color of the input field
         */
        backgroundColor  : null,
        /**
         * @cfg {Boolean} clearAfterSelect
         * Clear the field after they select a address.
         */
        clearAfterSelect : true,
        /**
         * @cfg {String} placeHolder
         * Placeholder of the input field
         */
        placeHolder      : null,
        /**
         * @cfg {String} gmapKey
         * Google Maps Javascript Key - https://developers.google.com/maps/documentation/javascript/get-api-key
         */
        gmapKey          : null,
        /**
         * @cfg {Boolean} countryCode
         * If true then use the country code instead of country name
         */
        countryCode      : false
    },

    initComponent : function () {
        var me          = this,
            setupLookup = true;

        if (!me.isGoogleAvaliable() && Ext.isEmpty(me.getGmapKey())) {
            //if google map api isn't already loaded and key was not supplied
            // mark read only and set empty text
            //
            Ext.apply(me, {
                readOnly  : true,
                emptyText : 'Not available'
            });

            Ext.global.console.warn('Need to supply google maps javascript key. You can create one at the following location https://developers.google.com/maps/documentation/javascript/get-api-key');

            setupLookup = false;
        }

        me.callParent(arguments);

        if (setupLookup) {
            me.on({
                scope       : me,
                afterrender : me.onAfterRenderLookup
            });
        }
    },

    addAutoComplete : function () {
        var me              = this,
            input           = me.el.down('input'),
            placeHolder     = me.getPlaceHolder(),
            backgroundColor = me.getBackgroundColor();



        if (!Ext.isEmpty(placeHolder)) {
            //google automatically places placeholder override/remove
            //
            input.dom.placeholder = placeHolder;
        }

        if (!Ext.isEmpty(backgroundColor)) {
            input.setStyle('background-color', backgroundColor);
        }

        // Create the address auto complete object
        //
        me.autoComplete = new google.maps.places.Autocomplete(
            document.getElementById(input.id), {
                types : ['geocode']
            });

        // When the user selects an address from the dropdown, fire off event with address information
        //
        me.autoComplete.addListener('place_changed', Ext.bind(me.onClickAddress, me));
    },

    onAfterRenderLookup : function () {
        var me = this,
            gmapScript;

        if (!me.isGoogleAvaliable()) {
            initvvGoogleLookup = Ext.bind(me.addAutoComplete, me);

            //get the google maps api
            //
            gmapScript = document.createElement('script');
            gmapScript.setAttribute('type', 'text/javascript');
            gmapScript.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?libraries=places&key=' + me.getGmapKey() + '&callback=initvvGoogleLookup');

            (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(gmapScript);
        } else {
            //google api already avaliable
            //
            me.addAutoComplete();
        }
    },

    isGoogleAvaliable : function () {
        var me = this;
        return typeof google !== 'undefined';
    },

    onClickAddress : function () {
        var me               = this,
            place            = me.autoComplete.getPlace(),
            autoPopulateForm = me.getAutoPopulateForm(),
            addressObj       = {},
            value;

        //get the address information
        //
        if (!Ext.isEmpty(place.address_components)) {
            for (ii = 0; ii < place.address_components.length; ii++) {
                type = place.address_components[ii].types[0];

                if (type === 'country' && me.countryCode){
                    addressObj[type] = place.address_components[ii].short_name;
                } else {
                    if (type === 'administrative_area_level_1') {
                        addressObj[type] = place.address_components[ii].short_name;
                    } else {
                        addressObj[type] = place.address_components[ii].long_name;
                    }
                }
            }
        }

        me.fireEvent('selected', me, addressObj, place);

        if (!Ext.isEmpty(autoPopulateForm) && autoPopulateForm) {
            //auto populate the form this component lives in with fields that have
            // the property gmapFormat populated
            //
            me.populateForm(addressObj, place);
        }

        if (me.getClearAfterSelect()) {
            me.setValue(null);
        }
    },

    populateForm : function (address, place) {
        var me     = this,
            form   = me.up('form'),
            fields = (!Ext.isEmpty(form)) ? form.query('[gmapFormat]') : [],
            fld, template;

        //apply the address information to the fields
        //
        for (var ii = 0; ii < fields.length; ii++) {
            fld      = fields[ii];
            template = new Ext.XTemplate(fld.gmapFormat);
            fld.setValue(template.apply(address));
        }

        if (!Ext.isEmpty(fields)) {
            fields[0].focus(true, 150);
        }
    }
});