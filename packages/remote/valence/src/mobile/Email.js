/**
 * Provide access to the standard interface that manages the editing and sending of an email message.  You can use this to display a standard email view inside your application and populate the fields of that view with initial values, such as the subject, email recipients, body text, and attachments. The user can edit the initial contents you specify and choose to send the email or cancel the operation.
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Compose Email Example
 *
 * You can use the {@link Valence.mobile.Email#compose} method to allow the composing and sending of an email:
 *
 *     Valence.mobile.Email.compose({
 *         to      : ['sales@cnxcorp.com'],
 *         cc      : ['john.doe@mycompany.com'],
 *         bcc     : ['jane.doe@cnxcorp.com'],
 *         subject : 'License',
 *         body    : 'I would like to purchase a Valence License.'
 *     });
 *
 *    {@img ValenceEmail.jpg}
 */
Ext.define('Valence.mobile.Email', {
    alternateClassName : ['Valence.device.Email'],
    singleton          : true,

    /**
     * Compose email with optional predefined values.
     *
     * @param {Object} [options]
     * Optional parameters to customize the email.
     *
     * @param {Array} [options.to]
     * Email address for TO field.
     *
     * @param {Array} [options.cc]
     * Email address for CC field.
     *
     * @param {Array} [options.bcc]
     * Email address for BCC field.
     *
     * @param {Array} [options.attachments]
     * base64 data streams
     *
     * @param {String} [options.subject]
     * Subject of the email
     *
     * @param {String} [options.body]
     * Body of the email (for HTML, set isHtml to true)
     *
     * @param {Boolean} [options.isHtml]
     * If the body of the email is HTML or plain text
     */
    compose : function (config) {
        if (!Ext.isEmpty(config)) {
            Ext.apply(config, {
                options : Ext.clone(config)
            });
        } else {
            config = {};
        }
        Ext.apply(config, {
            requestId         : 'emailComposer',
            responseId        : 'emailComposer',
            callbackMandatory : false
        });
        Valence.mobile.Access.initiate(config);
    }
});