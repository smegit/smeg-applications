/**
 * @class Valence.util.Helper
 * Various helper methods for working within the Portal.
 */
Ext.define('Valence.util.Helper', {
    singleton           : true,
    constructor         : function () {
        // setup literal object...
        //
        if (typeof Valence.lang !== 'object'){
            if (typeof parent.Valence.lang === 'object'){
                Ext.apply(Valence,{
                    lang : {
                        lit : parent.Valence.lang.lit
                    }
                });
                vlit = Valence.lang.lit;
            }
        }
    },
    //<if modern=false>
    /**
     * @method addEventListeners
     * A helper function to add an event listener to the iframe that is wrapping the application.
     * For a list of valid events, see Ext.ux.IFrame documentation.
     *
     * @param {String} event
     * @param {Function} fn function The callback
     * @param {Object} object
     *
     * ##Example -
     *
     * The following code snippet will call a "cleanup" method when the application is closed.
     *
     *     Valence.util.Helper.addEventListener('beforedestroy',function(){
     *         this.cleanup();
     *     },this);
     *
     */
    addEventListener    : function (event, cb, scope) {
        if (!Ext.isEmpty(Ext.isClassic) && Ext.isClassic){
            var scope     = scope || window,
                key       = Ext.getUrlParam('key'),
                iframeCmp = (!Ext.isEmpty(key)) ? parent.Ext.ComponentQuery.query('uxiframe[key=' + key + ']')[0] : null;
            if (iframeCmp) {
                iframeCmp.mon(iframeCmp, event, cb, scope);
            }
        } else {
            Ext.global.console.warn('Valence.util.Helper.addEventListener only available for Classic/Desktop Applications');
            return false;
        }
    },
    //</if>
    //<if modern=false>
    /**
     * @method download
     * A helper function that performs an Ajax call to the server, passes the parameters
     * provided in the object, and creates a frame to allow the browser to save the returned
     * contents (the data to be downloaded).
     *
     * @param {object} parameters
     * the parameter object to be passed with the Ajax call. The parameters should be specified
     * in key:value pairs, with the parameter key `pgm:` and the name of the RPG program
     * required.  The parameter keys of `sid:` and `app:` are automatically included
     * for authentication.
     *
     * ##Example - Valence download
     *
     * The following code snippet uses Valence.util.download to pass the RPG program called
     * EXSS01, a parameter for action (getCustRecSS), and a parameter for CUSTNO (the value
     * of the field CUSTNO in the currentRecord).
     *
     *     Valence.util.download({
     *             pgm : 'EXSS01',
     *             action: 'getCustRecSS',
	 *             CUSTNO: currentRecord.get('CUSTNO')
     *         });
     *
     */

    download            : function (parms, returnSource) {
        if (!Valence.device.Access.isNativePortal()){
            var url = '/valence/vvcall.pgm',
                sid = Ext.getUrlParam('customSid') || localStorage.getItem('sid') || Ext.getUrlParam('sid'),
                src;

            if (!Ext.isEmpty(parms.url)) {
                url = parms.url;
            }
            if (!Ext.isEmpty(parms.sid)) {
                sid = parms.sid;
            }
            if (Ext.isEmpty(parms.omitPortalCredentials)) {
                src = url + '?sid=' + sid + '&app=' + Ext.getUrlParam('app');
            } else {
                src = url + '?vv=true';
            }
            Ext.iterate(parms, function (key, value) {
                src += '&' + key + '=' + escape(value);
            });

            if (Ext.isEmpty(returnSource) || !returnSource){
                Ext.core.DomHelper.append(document.body, {
                    tag         : 'iframe',
                    frameBorder : 0,
                    width       : 0,
                    height      : 0,
                    css         : 'display:none;visibility:hidden;height:1px;',
                    src         : src
                });
            } else {
                return src;
            }
        } else {
            Ext.global.console.warn('Valence.util.Helper.download only available for Classic/Desktop Applications');
            return false;
        }
    },
    //</if>
    //<if modern=false>
    /**
     * @method fireEvent
     * A helper function to fire a Portal level event.  Any application that uses
     * Valence.util.Helper.addEventListener may then listen for this event.
     * This is helpful for cross application communication.
     *
     * @param {String} event
     * @param {Object} object - parameters
     *
     * ##Example -
     *
     * The following code snippet will call a "cleanup" method when the application is closed.
     *
     *     Valence.util.Helper.fireEvent('orderselected',{
     *         orderNumber : 1234
     *     });
     *
     */
    fireEvent           : function (event, o) {
        if (!Valence.device.Access.isNativePortal()){
            var Portal = parent.Portal || Portal,
                parms  = o || {};

            Ext.apply(parms, {
                event : event
            });

            Portal.getApplication().fireEvent('bubbledown', parms);
        } else {
            Ext.global.console.warn('Valence.util.Helper.fireEvent only available for Classic/Desktop Applications');
            return false;
        }
    },
    //</if>
    /**
     * Utility function to return a formatted date based on the date format specified in "Portal Admin -> Settings".
     * @since Version 4.0
     * @param {String}  date The date in 'Y-m-d' / iso format
     * @return {String} The formatted date
     */
    formatDate : function (o) {
        var me = this;
        if (!Valence.device.Access.isNativePortal()){
            var date     = o,
                d        = Ext.Date.parse(date, 'Y-m-d'),
                settings = me.getValenceSettings(),
                format   = (!Ext.isEmpty(settings)) ? settings.getDateFormat() : 'Y-m-d';

            return (Ext.isEmpty(d)) ? date : Ext.util.Format.date(d, format);
        } else {
            var config = {
                responseId      : 'formatedDate', //todo - this needs to be added to the mobile portal
                requestId       : 'formatDate'
            };
            Ext.apply(config, o);
            Valence.device.Access.initiate(config);
        }
    },

    /**
     * Utility function to get the app name for a particular app id.
     * @since Version 5.0
     * @param {Number} The app id.
     * @return {String} The app name.
     */
    getAppName : function(appId){
        var proceed = typeof Portal === 'object' || typeof parent.Portal === 'object',
            str,rec;

        if (proceed){
            str = (typeof Portal === 'object') ? Portal.util.Helper.getAppStore() : parent.Portal.util.Helper.getAppStore();

            if (str && !Ext.isEmpty(appId)){
                rec = str.findRecord('appId',appId,0,false,true,true);
            }

            if (rec){
                return rec.get('name');
            }
        }
        return null;
    },

    /**
     * Utility function to get the specified (configured in Portal Admin -> Settings) date format.
     * @since Version 4.0
     * @return {String} The date format.
     */
    getDateFormat : function (o) {
        var me = this;
        if (!Valence.device.Access.isNativePortal()){
            var settings = me.getValenceSettings(),
                format   = (!Ext.isEmpty(settings)) ? settings.getDateFormat() : 'Y-m-d';
            return format;
        } else {
            var config = {
                responseId      : 'dateFormat', //todo - this needs to be added to the mobile portal
                requestId       : 'getDateFormat'
            };
            Ext.apply(config, o);
            Valence.device.Access.initiate(config);
        }
    },

    /**
     * Utility function to get the current environment.
     * @since Version 3.2, update 3
     * @return {String} The environment name for this session.
     */
    getEnvironment      : function (o) {
        var me = this;
        if (!Valence.device.Access.isNativePortal()) {
            var runtime     = me.getValenceRuntime(),
                environment = (!Ext.isEmpty(runtime)) ? runtime.getLoginData().envName : null;
            return environment;
        } else {
            var config = {
                responseId : 'currentEnvironment',
                requestId  : 'getEnvironment'
            };
            Ext.apply(config, o);
            Valence.device.Access.initiate(config);
        }
    },
    /**
     * Utility function to get the current environment Id
     * @return {Integer} envId
     */
    getEnvironmentId : function(){
        var env = Ext.getUrlParam('env');

        if (env){
            return env;
        }

        if (!Ext.isEmpty(Valence.login) && typeof Valence.login.config.Runtime.getLoginData === "function"){
            var data = Valence.login.config.Runtime.getLoginData();
            if (data && data.env){
                return data.env;
            }
        }

        env = sessionStorage.getItem('env');

        if (!Ext.isEmpty(env)){
            return env;
        }
        return null;
    },

    /**
     * @method getLanguage
     * Gets the current language selected by the user by parsing out the language code
     * from the url. For example, if the url contains /valence-ja/ this means the current
     * language is Japanese. If no language code is specified in the url this method
     * returns "en" to denote English. The language code is automatically changed by the
     * Valence portal when the user selects a language in the drop-down selector at login.
     * @return {string} language
     *
     * ##Example - Valence.util.Helper.getLanguage() as part of the path to a language file
     *
     * Notice in the code below the use of Valence.util.Helper.getLanguage() as part of the
     * path name to the appropriate locale file to include in a multilingual application
     *
     *     Ext.onReady(function(){
     *         Valence.util.Helper.execScriptFiles({
     *             urls: ['/extjs/src/locale/ext-lang-' + Valence.util.Helper.getLanguage() + '.js'],
     *             callback: vvsettings
     *         });
     *
     */
    getLanguage         : function () {
        var lang = Ext.getUrlParam('lang');

        if (!lang){
            if (!Ext.isEmpty(Valence.login) && typeof Valence.login.config.Runtime.getLanguage === "function"){
                lang = Valence.login.config.Runtime.getLanguage();
            }
        }

        return lang;
    },
    /**
     * @method getMultiLingual
     * Determines if the portal instance has multilingual capability.
     * @return {string} boolean
     *
     * ##Example - Valence.util.Helper.getMultiLingual()
     *
     */
    getMultiLingual     : function (o) {
        var me = this;
        if (!Valence.device.Access.isNativePortal()){
            var settings = me.getValenceSettings(),
                multiLingual = (!Ext.isEmpty(settings)) ? settings.getMultiLingual() : null;
            return multiLingual;
        } else {
            var config = {
                responseId      : 'multiLingual', //todo - this needs to be added to the mobile portal
                requestId       : 'getMultiLingual'
            };
            Ext.apply(config, o);
            Valence.device.Access.initiate(config);
        }
    },
    /**
     * Get Random Color - could be used for chart colors etc.
     * @return {String} Hex Color
     */
    getRandomColor : function(){
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    /**
     * Utility function to get the current SID
     * @return {String} SID
     */
    getSid : function(){
        var sid = Ext.getUrlParam('sid');

        if (sid){
            return sid;
        }

        if (!Ext.isEmpty(Valence.login) && typeof Valence.login.config.Runtime.getLoginData === "function"){
            var data = Valence.login.config.Runtime.getLoginData();
            if (data && data.sid){
                return data.sid;
            }
        }
        return localStorage.getItem('sid');
    },
    /**
     * Utility function to get the currently logged in user name.
     * @since Version 3.2, update 3
     * @return {String} The user name for this session.
     */
    getUserName         : function (obj) {
        var me = this;
        if (!Valence.device.Access.isNativePortal()) {
            var runtime = me.getValenceRuntime(),
                user    = (!Ext.isEmpty(runtime)) ? runtime.getUser() : null;
            return user;
        } else {
            var config = {
                responseId : 'currentUser',
                requestId  : 'getUser'
            };
            Ext.apply(config, obj);
            Valence.device.Access.initiate(config);
        }
    },
    /**
     * @method getValenceRuntime
     * Returns the active Valence settings
     * @return {object}
     */
    getValenceRuntime : function(){
        var me = this;

        //get the valence runtime for Desktop or Mobile
        //
        if (!Valence.device.Access.isNativePortal()){
            if (!Ext.isEmpty(parent.Portal)){
                return parent.Valence.login.config.Runtime;
            } else if (!Ext.isEmpty(Valence.login)){
                return Valence.login.config.Runtime;
            }
        } else {
            //todo - mobile need to call via messaging
        }
        return null;
    },
    /**
     * @method getValenceSettings
     * Returns the active Valence settings
     * @return {object}
     */
    getValenceSettings : function(){
        var me = this;

        //get the valence settings for Desktop or Mobile
        //
        if (!Valence.device.Access.isNativePortal()){
            if (!Ext.isEmpty(parent.Portal)){
                return parent.Valence.login.config.Settings;
            } else if (!Ext.isEmpty(Valence.login)){
                return Valence.login.config.Settings;
            }
        } else {
            //todo - mobile need to call via messaging
        }
    },
    /**
     * @method getVersion
     * Returns the current version of the Valence portal.
     * @return {object}
     *
     * ##Example - Valence.util.Helper.getVersion()
     *
     */
    getVersion          : function (o) {
        var me = this;
        if (!Valence.device.Access.isNativePortal()) {
            var settings = me.getValenceSettings(),
                version  = (!Ext.isEmpty(settings)) ? settings.getVersion() : null;
            return version;
        } else {
            var config = {
                responseId : 'version', //todo - this needs to be added to the mobile portal
                requestId  : 'getVersion'
            };
            Ext.apply(config, o);
            Valence.device.Access.initiate(config);
        }
    },
    /**
     * Utility function to dynamically insert JavaScript files that can be linked to by direct url call (i.e., not through an RPG program). This function is useful for adding locale files for multilingual applications or any other situation where JavaScript should be loaded dynamically and where that script is directly accessible by url.
     * @param {Object} Config object
     * of the following properties:
     *
     *  - `urls`: (required) An array of url pathnames that specify the location of JavaScript files to load and execute into the page. At least one url must be specified.
     *  - `callback`: (optional) Function to call once all script files have been loaded and executed.
     */
    execScriptFiles     : function (config) {
        var scriptIndex = 0,
            scope       = config.scope || window,
            callback    = config.callback || null;
        var getFiles    = function (scriptIndex) {
            config = config ||
                {};
            Ext.apply(this, config);
            Ext.Ajax.request({
                method                : 'GET',
                omitPortalCredentials : true,
                disableCaching        : false,
                url                   : this.urls[scriptIndex],
                callback              : function (options, success, response) {
                    try {
                        var responseString = '';
                        responseString     = response.responseText;
                        eval.call(window, response.responseText);
                    } catch (e) {
                    }
                    if (this.urls.length - 1 > scriptIndex) {
                        scriptIndex++;
                        getFiles(scriptIndex);
                    } else {
                        if (callback) {
                            if (typeof this.callback === 'function') {
                                Ext.callback(callback, scope);
                            } else {
                                Ext.callback(eval(callback), scope);
                            }
                        }
                    }
                }
            });
        };
        getFiles(scriptIndex);
    },
    /**
     * Utility function to encode a string to UTF16 hex-encoded format prior to posting to an RPG program. RPG program must use vvIn_UTF16 to retrive and decode the field into a graphic field defined with CCSID 1208 or 13488.
     * @param {String} string
     *
     * @return {String} UTF16 hex-encoded
     *
     * Example:
     *
     *         // the following code snippet uses Valence.util.encodeUTF16
     *         // to encode strings on two Ajax post parameters
     *         var saveGrp = function() {
     *           Ext.Ajax.request({
     *             url: 'vvcall.pgm',
     *             params: {
     *               pgm: 'vvgrps',
     *               action: 'saveGrp',
     *               grpname: Valence.util.encodeUTF16(Ext.getCmp('grpidx').getValue()),
     *               description: Valence.util.encodeUTF16(Ext.get('description').getValue())
     *             }
     *           });
     *         };
     */
    encodeUTF16         : function (textString) {
        var haut     = 0;
        var n        = 0;
        var CPstring = '';
        var dec2hex  = function (textString) {
            return (textString + 0).toString(16).toUpperCase();
        };
        try {
            for (var i = 0; i < textString.length; i++) {
                var b = textString.charCodeAt(i);
                if (b < 0 || b > 0xFFFF) {
                    CPstring += 'Error: byte out of range ' + dec2hex(b) + '!';
                }
                if (haut !== 0) {
                    if (0xDC00 <= b && b <= 0xDFFF) {
                        CPstring += dec2hex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00));
                        haut = 0;
                        continue;
                    } else {
                        CPstring += 'Error in: surrogate out of range ' + dec2hex(haut) + '!';
                        haut = 0;
                    }
                }
                if (0xD800 <= b && b <= 0xDBFF) {
                    haut = b;
                } else {
                    cp = dec2hex(b);
                    while (cp.length < 4) {
                        cp = '0' + cp;
                    }
                    CPstring += cp;
                }
            }
        } catch (e) {
        }
        return CPstring;
    },
    /**
     * Utility function to decode UTF16 hex-encoded strings sent from an RPG program. String must already have been encoded by vvUtility_encodeUTF16 procedure or by using vvOut_toJSON or vvOut_execSQLtoJSON with the vvOut.encodeUTF16 property set to Y. This methodology for encoding/decoding UTF16 strings is only valid for database and RPG described graphic fields using CCSID 1208 or 13488.
     * @param {String} hex-encoded string
     *
     * @return {String} UTF8 encoded
     *
     * Example 1 - automatically decoding a UTF16 hex-encoded string when loading a JsonStore:
     *
     *            // the following example uses Valence.util.decodeUTF16
     *            // within a convert config option on a store field definition
     *            // to automatically convert UTF16 hex-encoded strings from
     *            // the RPG program to standard UTF8 strings for the browser.
     *            //
     *            // environment store
     *            var dsVVenv = new Ext.data.JsonStore({
     *               autoLoad: false,
     *               url: 'vvlogin.pgm',
     *               root: 'EnvList',
     *              fields: [{
     *                 name: 'VVREC',
     *                 convert: Valence.util.decodeUTF16
     *               }, {
     *                name: 'VVVALUE',
     *                convert: Valence.util.decodeUTF16
     *               }]
     *            });
     *
     * Example 2 - automatically decoding a UTF16 hex-encoded string from an Ajax response while setting a textfield value:
     *
     *            // the following example uses Valence.util.decodeUTF16
     *            // to decode a description string while setting a textfield
     *            // value using Ext.getCmp().setValue()
     *            //
     *            var getGrp = function() {
     *            Ext.Ajax.request({
     *              url: 'vvcall.pgm',
     *              params: {
     *                 pgm: 'vvgrps',
     *                 action: 'getGrp',
     *                 grpid: grpid
     *              },
     *              success: function(response, options) {
     *                 var data = Ext.decode(response.responseText);
     *                 Ext.getCmp('description').setValue(Valence.util.decodeUTF16(data.VVGRPDESC));
     *              }
     *           });
     *         };
     *
     */
    decodeUTF16         : function (inStr) {
        try {
            inStr = inStr.replace(/([A-Fa-f0-9]{4})/g, function (matchstr, hex) {
                var result = '';
                var n      = parseInt(hex, 16);
                if (n <= 0xFFFF) {
                    result += String.fromCharCode(n);
                } else {
                    if (n <= 0x10FFFF) {
                        n -= 0x10000;
                        result += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
                    } else {
                        result += 'hex2Char error: Code point out of range: ' + Valence.util.dec2hex(n);
                    }
                }
                return result;
            });
            return inStr;
        } catch (e) {
            return inStr;
        }
    },
    isLocked            : function () {
        var me       = this,
            isLocked = null;
        if (!Valence.device.Access.isNativePortal()) {
            var runtime = me.getValenceRuntime();

            if (!Ext.isEmpty(runtime)){
                return runtime.getIsLocked();
            }
        }
        return isLocked;
    },

    /**
     * Depreicated - use showSnackbar
     */
    msg                     : function (parm1, parm2, parm3) {
        var me = this,
            text;

        if (!Ext.isEmpty(Ext.global) && !Ext.isEmpty(Ext.global.console) && !Ext.isEmpty(Ext.global.console.warn)){
            Ext.global.console.warn('Valence.util.Helper.msg Depreicated, use showSnackbar instead.');
        } else {
            console.log('Valence.util.Helper.msg Depreicated, use showSnackbar instead.');
        }

        if (typeof arguments[0] !== 'object') {
            if (!Ext.isEmpty(parm1)){
                text = parm1;
            } else if (!Ext.isEmpty(parm2)){
                text = parm2
            }
        } else {
            if (!Ext.isEmpty(parm1.title)){
                text = parm1.title;
            } else if (!Ext.isEmpty(parm1.msg)){
                text = parm1.msg;
            }
        }

        if (!Ext.isEmpty(text)){
            me.showSnackbar(text);
        }
    },
    /**
     * Utility function to filter a store based off a value the user typed in.
     *
     */
    processTypedInputFilter : function(str, flds, val, filterId){
        var me    = this,
            regEx = new RegExp(val, 'i');

        if (Ext.isEmpty(filterId)){
            filterId = 'typedinput';
        }

        if (!Ext.isEmpty(str)){
            str.removeFilter(filterId);
            if (!Ext.isEmpty(val)) {
                str.addFilter({
                    id       : filterId,
                    filterFn : function (item) {
                        for (var i = 0; i < flds.length; i++) {
                            if (regEx.test(item.data[flds[i]])) {
                                return true;
                            }
                        }
                    }
                });
            }
        }
    },

    /**
     * Snackbar - Utility function to show a momentary informational message to the user. Message will appear for
     * the number of milliseconds and then disappear automatically.
     *
     * @param {Object/String} config
     *
     * if passed as object,then uses the following config:
     *
     * - `text` The Message
     * - `buttonText` Text of the button if the user can perform an action.
     * - `handler` The method that is ran when the user clicks the button.
     * - `duration` Duration the snackbar shows before it disappears automatically.
     * - `scope` Scope of the handler method
     *
     * ## Example - show a momentary informational message to the user
     *
     *      Valence.util.msg('Record Saved', 'Record for customer 12345 was saved');
     *
     * ## Example - show a message to the user from the bottom of MyGrid
     *
     * The following JavaScript code displays a message from the MyGrid element body,
     * and shows the message for 1 second from the bottom
     *
     *     Valence.util.Helper.showSnackbar({
     *         text : 'Information was saved'
     *     });
     *
     */
    showSnackbar : function(config){
        var me = this;

        if (Ext.isString(config)){
            config = {
                text : config
            };
        }

        if (!Valence.device.Access.isNativePortal() && !Ext.isEmpty(config.text)) {
            var portal      = parent.Portal,
                snackConfig = {
                text : config.text
            };

            if (!Ext.isEmpty(portal)){
                //check for snackbar button
                //
                if (!Ext.isEmpty(config.buttonText)){
                    Ext.apply(snackConfig,{
                        buttonText : config.buttonText,
                        handler    : config.handler
                    });

                    if (!Ext.isEmpty(config.scope)){
                        Ext.apply(snackConfig,{
                            scope : config.scope
                        });
                    }
                }

                //check for duration override
                //
                if (!Ext.isEmpty(config.duration)){
                    Ext.apply(snackConfig,{
                        duration : config.duration
                    });
                }
                portal.util.Helper.showSnackbar(snackConfig);
                return true;
            }
        }
        return false;
    },

    swapTheme : function(o){
        var me   = this,
            head = document.head,
            link = document.createElement('link'),
            path = (!Ext.isEmpty(Ext.isClassic) && Ext.isClassic) ? 'resources/themes/classic/' : 'resources/themes/modern/';

        Ext.util.CSS.removeStyleSheet('portaltheme');
        link.id   = 'portaltheme';
        link.type = 'text/css';
        link.rel  = 'stylesheet';
        link.href = path + o.theme + '.css';
        head.appendChild(link);
    },

    /**
     * Utility function to convert a standard timestamp string from DB2/400 to a JavaScript Date object.
     * This function is useful for converting DB2/400 timestamps to Date object for further date processing logic.
     * @param {string} DB2timeStamp String formatted as a timestamp in the format yyyy-mm-dd hh:mn:ss
     *
     */
    timestampToDate         : function (v) {
        return new Date(v.substr(0, 4), parseInt(v.substr(5, 2) - 1, 10), v.substr(8, 2), v.substr(11, 2), v.substr(14, 2), v.substr(17, 2));
    }
});