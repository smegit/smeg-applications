/**
 * Provides access to the device contacts database.
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Pick Contact Example
 *
 * You can use the {@link Valence.mobile.Contacts#pick} method to allow the user select a single contact:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Contacts.pick({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response.name.formatted) {
 *                 Ext.Msg.alert('You Selected', response.name.formatted);
 *             }
 *         }
 *     });
 */
Ext.define('Valence.mobile.Contacts', {
    alternateClassName : ['Valence.device.Contacts'],
    singleton          : true,

    /**
     * pick - Launch the Contact Picker to select a single contact. The resulting contact object is passed to the callback:
     *
     * @param {Object} config
     * The config for picking a contact
     *
     * @param {Function} config.callback
     * The callback which is called when a contact is selected or canceled.
     *
     * @param {Object} config.callback.response
     * Object that contains the contact information
     *
     * @param {Number} config.callback.response.id
     * A globally unique identifier. -1 if the user canceled picking a contact.
     *
     * @param {String} config.callback.response.displayName
     * The name of this Contact, suitable for display to end users.
     *
     * @param {Object} config.callback.response.name
     * An object containing all components of a persons name.
     *
     * @param {String} config.callback.response.name.formatted
     * The complete name of the contact.
     *
     * @param {String} config.callback.response.name.familyName
     * The contact's family name.
     *
     * @param {String} config.callback.response.name.givenName
     * The contact's given name.
     *
     * @param {String} config.callback.response.name.middleName
     * The contact's middle name.
     *
     * @param {String} config.callback.response.name.honorificPrefix
     * The contact's prefix (example Mr. or Dr.)
     *
     * @param {String} config.callback.response.name.honorificSuffix
     * The contact's suffix (example Esq.)
     *
     * @param {String} config.callback.response.nickname
     * A casual name by which to address the contact.
     *
     * @param {Array} config.callback.response.phoneNumbers
     * An array of all the contact's phone numbers.
     *
     * @param {String} config.callback.response.phoneNumbers.type
     * A string that indicates what type of number it is.
     *
     * @param {String} config.callback.response.phoneNumbers.value
     * The value of the phone number.
     *
     * @param {Boolean} config.callback.response.phoneNumbers.pref
     * Set to true if this ContactField contains the user's preferred value.
     *
     * @param {Array} config.callback.response.emails
     * An array of all the contact's email addresses.
     *
     * @param {String} config.callback.response.emails.type
     * A string that indicates what type of email it is.
     *
     * @param {String} config.callback.response.emails.value
     * The value of the email.
     *
     * @param {Array} config.callback.response.addresses
     * An array of all the contact's addresses.
     *
     * @param {Boolean} config.callback.response.addresses.pref
     * Set to true if this ContactAddress contains the user's preferred value.
     *
     * @param {String} config.callback.response.addresses.type
     * Type of field this is, home for example.
     *
     * @param {String} config.callback.response.addresses.formatted
     * The full address formatted for display.
     *
     * @param {String} config.callback.response.addresses.streetAddress
     * The full street address.
     *
     * @param {String} config.callback.response.addresses.locality
     * The city or locality.
     *
     * @param {String} config.callback.response.addresses.region
     * The state or region.
     *
     * @param {String} config.callback.response.addresses.postalCode
     * The zip code or postal code.
     *
     * @param {String} config.callback.response.addresses.country
     * The country name.
     *
     * @param {Array} config.callback.response.ims
     * An array of all the contact's IM addresses.
     *
     * @param {String} config.callback.response.ims.type
     * A string that indicates what type of IM address.
     *
     * @param {String} config.callback.response.ims.value
     * The value of the IM address.
     *
     * @param {Boolean} config.callback.response.ims.pref
     * Set to true if this ContactField contains the user's preferred value.
     *
     * @param {Array} config.callback.response.organizations
     * An array of all the contact's organizations.
     *
     * @param {Boolean} config.callback.response.organizations.pref
     * Set to true if this Organization contains the user's preferred value.
     *
     * @param {String} config.callback.response.organizations.type
     * A string that indicates what type of field this is, home for example.
     *
     * @param {String} config.callback.response.organizations.name
     * The name of the organization.
     *
     * @param {String} config.callback.response.organizations.department
     * The department the contract works for.
     *
     * @param {String} config.callback.response.organizations.title
     * The contact's title at the organization.
     *
     * @param {Date} config.callback.response.birthday
     * The birthday of the contact. `Create new date from the date - var birthdayDate = new Date(birthday);`
     *
     * @param {String} config.callback.response.note
     * A note about the contact.
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    pick : function (config) {
        Ext.apply(config, {
            requestId  : 'contacts',
            method     : 'pickContact',
            responseId : 'selectedContact'
        });
        Valence.mobile.Access.initiate(config);
    }
});