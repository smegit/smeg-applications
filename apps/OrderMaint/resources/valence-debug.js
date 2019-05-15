//@define Valence-debug-js
//@define Valence.Wrapper
Ext.ns('Valence.Wrapper');
//this is only used so command will pull in this override
//
if (Ext && Ext.versions != undefined) {
    Ext.define('Valence.overrides.Ext', {
        override: 'ValencePlaceHolder'
    });
}
//add the get url param and get framework methods to Ext
//
Ext.apply(Ext, {
    getUrlParam: function(param) {
        var params = Ext.urlDecode(location.search.substring(1));
        return param ? params[param] : params;
    },
    getFramework: function() {
        var versions = Ext.versions || null,
            returnObj = {
                desktop: true,
                framework: 'Ext'
            };
        if (versions) {
            var v;
            if (!Ext.isEmpty(versions.touch) || !Ext.isEmpty(versions.modern)) {
                if (!Ext.isEmpty(versions.modern)) {
                    return Ext.apply(returnObj, {
                        desktop: false,
                        framework: 'Modern',
                        version: versions.modern.version.charAt(0)
                    });
                } else {
                    return Ext.apply(returnObj, {
                        desktop: false,
                        framework: 'Touch',
                        version: versions.touch.version.charAt(0)
                    });
                }
            } else {
                if (!Ext.isEmpty(versions.extjs.version)) {
                    v = versions.extjs.version.charAt(0);
                    if (!Ext.isEmpty(v)) {
                        return Ext.apply(returnObj, {
                            version: v
                        });
                    }
                }
                return Ext.apply(returnObj, {
                    version: 4
                });
            }
        } else {
            return {
                desktop: true,
                framework: 'Ext',
                version: 3
            };
        }
    }
});
Ext.define('Valence.Ajax', {
    singleton: true,
    constructor: function() {
        var me = this,
            fnc = function() {
                if (!Ext.isEmpty(Ext.Ajax)) {
                    Ext.apply(Ext.Ajax, {
                        vvPgmRegEx: new RegExp('((vvcall)|(vvvport)|(vvupload)|(vvlogin))', "i")
                    });
                    Ext.Ajax.on({
                        beforerequest: me.onBeforeAjaxRequest,
                        requestexception: me.onRequestAjaxException
                    });
                } else {
                    setTimeout(fnc, 20);
                }
            };
        fnc();
    },
    onBeforeAjaxRequest: function(c, options) {
        var me = this,
            framework = Ext.getFramework(),
            frameworkVersion = framework.version,
            isTouch = (framework.framework === 'Touch') ? true : false,
            sid = Valence.util.Helper.getSid(),
            env = Valence.util.Helper.getEnvironmentId(),
            appId = Ext.getUrlParam('app');
        if (Valence.mobile.Access.isNativePortal()) {
            env = null;
        }
        if (frameworkVersion >= 5 || isTouch) {
            if (isTouch) {
                if (Ext.isEmpty(options.disableCaching)) {
                    options.disableCaching = false;
                }
            }
            //todo this seems to be a bug in the current touch version should only apply if GET however its not checking the method anymore in Ext.data.Connection.setOptions
            if (!options.params) {
                options.params = {};
            }
            if (!options.isUpload && !options.omitPortalCredentials) {
                Ext.apply(options.params, {
                    sid: sid
                });
                if (!Ext.isEmpty(appId)) {
                    Ext.apply(options.params, {
                        app: appId
                    });
                }
                if (!Ext.isEmpty(env)) {
                    Ext.apply(options.params, {
                        env: env
                    });
                }
            }
        } else {
            if (!me.extraParams) {
                me.extraParams = {};
            }
            if (!options.isUpload && !options.omitPortalCredentials) {
                Ext.apply(me.extraParams, {
                    sid: sid
                });
                if (!Ext.isEmpty(appId)) {
                    Ext.apply(me.extraParams, {
                        app: appId
                    });
                }
                if (!Ext.isEmpty(env)) {
                    Ext.apply(me.extraParams, {
                        env: env
                    });
                }
            } else {
                me.extraParams = null;
            }
        }
        // todo = remove this for 3.3 or 4.0 as each call should be preceded by "/valence"             //!?
        //     if this code is left in place, Ext.log this condition...
        //
        if (me.vvPgmRegEx.test(options.url)) {
            if (options.url.indexOf('/valence/') === -1) {
                if (options.url.substring(0, 1) !== '/') {
                    options.url = '/valence/' + options.url;
                }
            }
        }
    },
    onRequestAjaxException: function(conn, r, opts) {
        if (!opts.vvSkip569 && r.status === 569) {
            var d = Ext.decode(r.responseText),
                title = (d) ? Valence.lang.lit[d.hdr] : null,
                body = (d) ? Valence.lang.lit[d.body] : null,
                action = (d) ? d.action : null,
                isPortalApp = (!Ext.isEmpty(parent.Portal)),
                showMessage = function(title, msg, portalApp) {
                    var msgObj = (isPortalApp) ? parent.Ext.Msg : Ext.Msg;
                    msgObj.show({
                        title: title,
                        msg: msg,
                        buttons: msgObj.OK,
                        closable: false,
                        fn: function() {
                            if (action === 'LOGOUT') {
                                if (portalApp) {
                                    portalApp.fireEvent('logout');
                                }
                            } else {
                                if (portalApp) {
                                    portalApp.fireEvent('resumepolling');
                                }
                            }
                        }
                    });
                },
                processVars = function() {
                    if (d.var1) {
                        body = body.replace('VAR1', Valence.util.Helper.decodeUTF16(d.var1));
                    }
                    if (d.var2) {
                        body = body.replace('VAR2', Valence.util.Helper.decodeUTF16(d.var2));
                    }
                    if (d.var3) {
                        body = body.replace('VAR3', Valence.util.Helper.decodeUTF16(d.var3));
                    }
                    if (d.vvid) {
                        body += '<p style="margin-top:16px;">' + Valence.lang.lit.errorLogId + ' <span style="font-weight: 500;opacity: 0.7;">' + d.vvid + '</span></p>';
                    }
                };
            // if "d" is null then this may be a binary ajax request...
            //
            if (Ext.isEmpty(d)) {
                var blob = new Blob([
                        r.responseBytes
                    ], {
                        type: r.getResponseHeader('Content-Type')
                    }),
                    reader = new window.FileReader();
                reader.readAsText(blob);
                reader.onloadend = function() {
                    d = Ext.decode(reader.result);
                    title = Valence.lang.lit[d.hdr];
                    body = Valence.lang.lit[d.body];
                    action = d.action;
                    processVars();
                };
            } else {
                processVars();
            }
            // suspend portal polling and show a message explaining the exception...
            //   ensure this message shows over any other messages by deferring...
            //
            setTimeout(function() {
                // suspend polling...
                //
                var portalApp = (isPortalApp) ? parent.Portal.getApplication() : (typeof Portal === 'object') ? Portal.getApplication() : null,
                    locked = Valence.util.Helper.isLocked();
                if (Ext.isEmpty(portalApp)) {
                    //check if running Valence.login
                    //
                    if (!Ext.isEmpty(Valence.login)) {
                        portalApp = Valence.login.config.Runtime.getApplication();
                    }
                }
                if (portalApp) {
                    portalApp.fireEvent('suspendpolling');
                    if (action === 'LOGOUT') {
                        portalApp.fireEvent('pending569logout');
                    }
                }
                if (locked) {
                    //hide locked
                    //
                    var lockedCmp = parent.Ext.ComponentQuery.query('lock')[0];
                    if (!Ext.isEmpty(lockedCmp)) {
                        lockedCmp.hide();
                    }
                    if (action === 'LOGOUT') {
                        showMessage(title, body, portalApp);
                    }
                } else {
                    showMessage(title, body, portalApp);
                }
            }, 1000);
        }
    }
});

/*
 html2canvas 0.5.0-beta3 <http://html2canvas.hertzen.com>
 Copyright (c) 2016 Niklas von Hertzen
 Released under  License
 */
!function(e) {
    if ("object" == typeof exports && "undefined" != typeof module)  {
        module.exports = e();
    }
    else if ("function" == typeof define && define.amd)  {
        define([], e);
    }
    else {
        var f;
        "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self) , f.html2canvas = e();
    }
}(function() {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a)  {
                        return a(o, !0);
                    }
                    
                    if (i)  {
                        return i(o, !0);
                    }
                    
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND" , f;
                }
                var l = n[o] = {
                        exports: {}
                    };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s;
    })({
        1: [
            function(_dereq_, module, exports) {
                (function(global) {
                    /*! http://mths.be/punycode v1.2.4 by @mathias */
                    
                    (function(root) {
                        /** Detect free variables */
                        var freeExports = typeof exports == 'object' && exports;
                        var freeModule = typeof module == 'object' && module && module.exports == freeExports && module;
                        var freeGlobal = typeof global == 'object' && global;
                        if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
                            root = freeGlobal;
                        }
                        /**
             * The `punycode` object.
             * @name punycode
             * @type Object
             */
                        var punycode,
                            /** Highest positive signed 32-bit float value */
                            maxInt = 2147483647,
                            // aka. 0x7FFFFFFF or 2^31-1
                            /** Bootstring parameters */
                            base = 36,
                            tMin = 1,
                            tMax = 26,
                            skew = 38,
                            damp = 700,
                            initialBias = 72,
                            initialN = 128,
                            // 0x80
                            delimiter = '-',
                            // '\x2D'
                            /** Regular expressions */
                            regexPunycode = /^xn--/,
                            regexNonASCII = /[^ -~]/,
                            // unprintable ASCII chars + non-ASCII chars
                            regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g,
                            // RFC 3490 separators
                            /** Error messages */
                            errors = {
                                'overflow': 'Overflow: input needs wider integers to process',
                                'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
                                'invalid-input': 'Invalid input'
                            },
                            /** Convenience shortcuts */
                            baseMinusTMin = base - tMin,
                            floor = Math.floor,
                            stringFromCharCode = String.fromCharCode,
                            /** Temporary variable */
                            key;
                        /*--------------------------------------------------------------------------*/
                        /**
             * A generic error utility function.
             * @private
             * @param {String} type The error type.
             * @returns {Error} Throws a `RangeError` with the applicable error message.
             */
                        function error(type) {
                            throw RangeError(errors[type]);
                        }
                        /**
             * A generic `Array#map` utility function.
             * @private
             * @param {Array} array The array to iterate over.
             * @param {Function} callback The function that gets called for every array
             * item.
             * @returns {Array} A new array of values returned by the callback function.
             */
                        function map(array, fn) {
                            var length = array.length;
                            while (length--) {
                                array[length] = fn(array[length]);
                            }
                            return array;
                        }
                        /**
             * A simple `Array#map`-like wrapper to work with domain name strings.
             * @private
             * @param {String} domain The domain name.
             * @param {Function} callback The function that gets called for every
             * character.
             * @returns {Array} A new string of characters returned by the callback
             * function.
             */
                        function mapDomain(string, fn) {
                            return map(string.split(regexSeparators), fn).join('.');
                        }
                        /**
             * Creates an array containing the numeric code points of each Unicode
             * character in the string. While JavaScript uses UCS-2 internally,
             * this function will convert a pair of surrogate halves (each of which
             * UCS-2 exposes as separate characters) into a single code point,
             * matching UTF-16.
             * @see `punycode.ucs2.encode`
             * @see <http://mathiasbynens.be/notes/javascript-encoding>
             * @memberOf punycode.ucs2
             * @name decode
             * @param {String} string The Unicode input string (UCS-2).
             * @returns {Array} The new array of code points.
             */
                        function ucs2decode(string) {
                            var output = [],
                                counter = 0,
                                length = string.length,
                                value, extra;
                            while (counter < length) {
                                value = string.charCodeAt(counter++);
                                if (value >= 55296 && value <= 56319 && counter < length) {
                                    // high surrogate, and there is a next character
                                    extra = string.charCodeAt(counter++);
                                    if ((extra & 64512) == 56320) {
                                        // low surrogate
                                        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
                                    } else {
                                        // unmatched surrogate; only append this code unit, in case the next
                                        // code unit is the high surrogate of a surrogate pair
                                        output.push(value);
                                        counter--;
                                    }
                                } else {
                                    output.push(value);
                                }
                            }
                            return output;
                        }
                        /**
             * Creates a string based on an array of numeric code points.
             * @see `punycode.ucs2.decode`
             * @memberOf punycode.ucs2
             * @name encode
             * @param {Array} codePoints The array of numeric code points.
             * @returns {String} The new Unicode string (UCS-2).
             */
                        function ucs2encode(array) {
                            return map(array, function(value) {
                                var output = '';
                                if (value > 65535) {
                                    value -= 65536;
                                    output += stringFromCharCode(value >>> 10 & 1023 | 55296);
                                    value = 56320 | value & 1023;
                                }
                                output += stringFromCharCode(value);
                                return output;
                            }).join('');
                        }
                        /**
             * Converts a basic code point into a digit/integer.
             * @see `digitToBasic()`
             * @private
             * @param {Number} codePoint The basic numeric code point value.
             * @returns {Number} The numeric value of a basic code point (for use in
             * representing integers) in the range `0` to `base - 1`, or `base` if
             * the code point does not represent a value.
             */
                        function basicToDigit(codePoint) {
                            if (codePoint - 48 < 10) {
                                return codePoint - 22;
                            }
                            if (codePoint - 65 < 26) {
                                return codePoint - 65;
                            }
                            if (codePoint - 97 < 26) {
                                return codePoint - 97;
                            }
                            return base;
                        }
                        /**
             * Converts a digit/integer into a basic code point.
             * @see `basicToDigit()`
             * @private
             * @param {Number} digit The numeric value of a basic code point.
             * @returns {Number} The basic code point whose value (when used for
             * representing integers) is `digit`, which needs to be in the range
             * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
             * used; else, the lowercase form is used. The behavior is undefined
             * if `flag` is non-zero and `digit` has no uppercase form.
             */
                        function digitToBasic(digit, flag) {
                            //  0..25 map to ASCII a..z or A..Z
                            // 26..35 map to ASCII 0..9
                            return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
                        }
                        /**
             * Bias adaptation function as per section 3.4 of RFC 3492.
             * http://tools.ietf.org/html/rfc3492#section-3.4
             * @private
             */
                        function adapt(delta, numPoints, firstTime) {
                            var k = 0;
                            delta = firstTime ? floor(delta / damp) : delta >> 1;
                            delta += floor(delta / numPoints);
                            for (/* no initialization */
                            ; delta > baseMinusTMin * tMax >> 1; k += base) {
                                delta = floor(delta / baseMinusTMin);
                            }
                            return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
                        }
                        /**
             * Converts a Punycode string of ASCII-only symbols to a string of Unicode
             * symbols.
             * @memberOf punycode
             * @param {String} input The Punycode string of ASCII-only symbols.
             * @returns {String} The resulting string of Unicode symbols.
             */
                        function decode(input) {
                            // Don't use UCS-2
                            var output = [],
                                inputLength = input.length,
                                out,
                                i = 0,
                                n = initialN,
                                bias = initialBias,
                                basic, j, index, oldi, w, k, digit, t, /** Cached calculation results */
                                baseMinusT;
                            // Handle the basic code points: let `basic` be the number of input code
                            // points before the last delimiter, or `0` if there is none, then copy
                            // the first basic code points to the output.
                            basic = input.lastIndexOf(delimiter);
                            if (basic < 0) {
                                basic = 0;
                            }
                            for (j = 0; j < basic; ++j) {
                                // if it's not a basic code point
                                if (input.charCodeAt(j) >= 128) {
                                    error('not-basic');
                                }
                                output.push(input.charCodeAt(j));
                            }
                            // Main decoding loop: start just after the last delimiter if any basic code
                            // points were copied; start at the beginning otherwise.
                            for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) /* no final expression */
                            {
                                // `index` is the index of the next character to be consumed.
                                // Decode a generalized variable-length integer into `delta`,
                                // which gets added to `i`. The overflow checking is easier
                                // if we increase `i` as we go, then subtract off its starting
                                // value at the end to obtain `delta`.
                                for (oldi = i , w = 1 , k = base; /* no condition */
                                ; k += base) {
                                    if (index >= inputLength) {
                                        error('invalid-input');
                                    }
                                    digit = basicToDigit(input.charCodeAt(index++));
                                    if (digit >= base || digit > floor((maxInt - i) / w)) {
                                        error('overflow');
                                    }
                                    i += digit * w;
                                    t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                                    if (digit < t) {
                                        break;
                                    }
                                    baseMinusT = base - t;
                                    if (w > floor(maxInt / baseMinusT)) {
                                        error('overflow');
                                    }
                                    w *= baseMinusT;
                                }
                                out = output.length + 1;
                                bias = adapt(i - oldi, out, oldi == 0);
                                // `i` was supposed to wrap around from `out` to `0`,
                                // incrementing `n` each time, so we'll fix that now:
                                if (floor(i / out) > maxInt - n) {
                                    error('overflow');
                                }
                                n += floor(i / out);
                                i %= out;
                                // Insert `n` at position `i` of the output
                                output.splice(i++, 0, n);
                            }
                            return ucs2encode(output);
                        }
                        /**
             * Converts a string of Unicode symbols to a Punycode string of ASCII-only
             * symbols.
             * @memberOf punycode
             * @param {String} input The string of Unicode symbols.
             * @returns {String} The resulting Punycode string of ASCII-only symbols.
             */
                        function encode(input) {
                            var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue,
                                output = [],
                                /** `inputLength` will hold the number of code points in `input`. */
                                inputLength, /** Cached calculation results */
                                handledCPCountPlusOne, baseMinusT, qMinusT;
                            // Convert the input in UCS-2 to Unicode
                            input = ucs2decode(input);
                            // Cache the length
                            inputLength = input.length;
                            // Initialize the state
                            n = initialN;
                            delta = 0;
                            bias = initialBias;
                            // Handle the basic code points
                            for (j = 0; j < inputLength; ++j) {
                                currentValue = input[j];
                                if (currentValue < 128) {
                                    output.push(stringFromCharCode(currentValue));
                                }
                            }
                            handledCPCount = basicLength = output.length;
                            // `handledCPCount` is the number of code points that have been handled;
                            // `basicLength` is the number of basic code points.
                            // Finish the basic string - if it is not empty - with a delimiter
                            if (basicLength) {
                                output.push(delimiter);
                            }
                            // Main encoding loop:
                            while (handledCPCount < inputLength) {
                                // All non-basic code points < n have been handled already. Find the next
                                // larger one:
                                for (m = maxInt , j = 0; j < inputLength; ++j) {
                                    currentValue = input[j];
                                    if (currentValue >= n && currentValue < m) {
                                        m = currentValue;
                                    }
                                }
                                // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
                                // but guard against overflow
                                handledCPCountPlusOne = handledCPCount + 1;
                                if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
                                    error('overflow');
                                }
                                delta += (m - n) * handledCPCountPlusOne;
                                n = m;
                                for (j = 0; j < inputLength; ++j) {
                                    currentValue = input[j];
                                    if (currentValue < n && ++delta > maxInt) {
                                        error('overflow');
                                    }
                                    if (currentValue == n) {
                                        // Represent delta as a generalized variable-length integer
                                        for (q = delta , k = base; /* no condition */
                                        ; k += base) {
                                            t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                                            if (q < t) {
                                                break;
                                            }
                                            qMinusT = q - t;
                                            baseMinusT = base - t;
                                            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                                            q = floor(qMinusT / baseMinusT);
                                        }
                                        output.push(stringFromCharCode(digitToBasic(q, 0)));
                                        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                                        delta = 0;
                                        ++handledCPCount;
                                    }
                                }
                                ++delta;
                                ++n;
                            }
                            return output.join('');
                        }
                        /**
             * Converts a Punycode string representing a domain name to Unicode. Only the
             * Punycoded parts of the domain name will be converted, i.e. it doesn't
             * matter if you call it on a string that has already been converted to
             * Unicode.
             * @memberOf punycode
             * @param {String} domain The Punycode domain name to convert to Unicode.
             * @returns {String} The Unicode representation of the given Punycode
             * string.
             */
                        function toUnicode(domain) {
                            return mapDomain(domain, function(string) {
                                return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
                            });
                        }
                        /**
             * Converts a Unicode string representing a domain name to Punycode. Only the
             * non-ASCII parts of the domain name will be converted, i.e. it doesn't
             * matter if you call it with a domain that's already in ASCII.
             * @memberOf punycode
             * @param {String} domain The domain name to convert, as a Unicode string.
             * @returns {String} The Punycode representation of the given domain name.
             */
                        function toASCII(domain) {
                            return mapDomain(domain, function(string) {
                                return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
                            });
                        }
                        /*--------------------------------------------------------------------------*/
                        /** Define the public API */
                        punycode = {
                            /**
                 * A string representing the current Punycode.js version number.
                 * @memberOf punycode
                 * @type String
                 */
                            'version': '1.2.4',
                            /**
                 * An object of methods to convert from JavaScript's internal character
                 * representation (UCS-2) to Unicode code points, and back.
                 * @see <http://mathiasbynens.be/notes/javascript-encoding>
                 * @memberOf punycode
                 * @type Object
                 */
                            'ucs2': {
                                'decode': ucs2decode,
                                'encode': ucs2encode
                            },
                            'decode': decode,
                            'encode': encode,
                            'toASCII': toASCII,
                            'toUnicode': toUnicode
                        };
                        /** Expose `punycode` */
                        // Some AMD build optimizers, like r.js, check for specific condition patterns
                        // like the following:
                        if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
                            define('punycode', function() {
                                return punycode;
                            });
                        } else if (freeExports && !freeExports.nodeType) {
                            if (freeModule) {
                                // in Node.js or RingoJS v0.8.0+
                                freeModule.exports = punycode;
                            } else {
                                // in Narwhal or RingoJS v0.7.0-
                                for (key in punycode) {
                                    punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
                                }
                            }
                        } else {
                            // in Rhino or a web browser
                            root.punycode = punycode;
                        }
                    }(this));
                }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
            },
            {}
        ],
        2: [
            function(_dereq_, module, exports) {
                var log = _dereq_('./log');
                function restoreOwnerScroll(ownerDocument, x, y) {
                    if (ownerDocument.defaultView && (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
                        ownerDocument.defaultView.scrollTo(x, y);
                    }
                }
                function cloneCanvasContents(canvas, clonedCanvas) {
                    try {
                        if (clonedCanvas) {
                            clonedCanvas.width = canvas.width;
                            clonedCanvas.height = canvas.height;
                            clonedCanvas.getContext("2d").putImageData(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height), 0, 0);
                        }
                    } catch (e) {
                        log("Unable to copy canvas content from", canvas, e);
                    }
                }
                function cloneNode(node, javascriptEnabled) {
                    var clone = node.nodeType === 3 ? document.createTextNode(node.nodeValue) : node.cloneNode(false);
                    var child = node.firstChild;
                    while (child) {
                        if (javascriptEnabled === true || child.nodeType !== 1 || child.nodeName !== 'SCRIPT') {
                            clone.appendChild(cloneNode(child, javascriptEnabled));
                        }
                        child = child.nextSibling;
                    }
                    if (node.nodeType === 1) {
                        clone._scrollTop = node.scrollTop;
                        clone._scrollLeft = node.scrollLeft;
                        if (node.nodeName === "CANVAS") {
                            cloneCanvasContents(node, clone);
                        } else if (node.nodeName === "TEXTAREA" || node.nodeName === "SELECT") {
                            clone.value = node.value;
                        }
                    }
                    return clone;
                }
                function initNode(node) {
                    if (node.nodeType === 1) {
                        node.scrollTop = node._scrollTop;
                        node.scrollLeft = node._scrollLeft;
                        var child = node.firstChild;
                        while (child) {
                            initNode(child);
                            child = child.nextSibling;
                        }
                    }
                }
                module.exports = function(ownerDocument, containerDocument, width, height, options, x, y) {
                    var documentElement = cloneNode(ownerDocument.documentElement, options.javascriptEnabled);
                    var container = containerDocument.createElement("iframe");
                    container.className = "html2canvas-container";
                    container.style.visibility = "hidden";
                    container.style.position = "fixed";
                    container.style.left = "-10000px";
                    container.style.top = "0px";
                    container.style.border = "0";
                    container.width = width;
                    container.height = height;
                    container.scrolling = "no";
                    // ios won't scroll without it
                    containerDocument.body.appendChild(container);
                    return new Promise(function(resolve) {
                        var documentClone = container.contentWindow.document;
                        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
             if window url is about:blank, we can assign the url to current by writing onto the document
             */
                        container.contentWindow.onload = container.onload = function() {
                            var interval = setInterval(function() {
                                    if (documentClone.body.childNodes.length > 0) {
                                        initNode(documentClone.documentElement);
                                        clearInterval(interval);
                                        if (options.type === "view") {
                                            container.contentWindow.scrollTo(x, y);
                                            if ((/(iPad|iPhone|iPod)/g).test(navigator.userAgent) && (container.contentWindow.scrollY !== y || container.contentWindow.scrollX !== x)) {
                                                documentClone.documentElement.style.top = (-y) + "px";
                                                documentClone.documentElement.style.left = (-x) + "px";
                                                documentClone.documentElement.style.position = 'absolute';
                                            }
                                        }
                                        resolve(container);
                                    }
                                }, 50);
                        };
                        documentClone.open();
                        documentClone.write("<!DOCTYPE html><html></html>");
                        // Chrome scrolls the parent document for some reason after the write to the cloned window???
                        restoreOwnerScroll(ownerDocument, x, y);
                        documentClone.replaceChild(documentClone.adoptNode(documentElement), documentClone.documentElement);
                        documentClone.close();
                    });
                };
            },
            {
                "./log": 13
            }
        ],
        3: [
            function(_dereq_, module, exports) {
                // http://dev.w3.org/csswg/css-color/
                function Color(value) {
                    this.r = 0;
                    this.g = 0;
                    this.b = 0;
                    this.a = null;
                    var result = this.fromArray(value) || this.namedColor(value) || this.rgb(value) || this.rgba(value) || this.hex6(value) || this.hex3(value);
                }
                Color.prototype.darken = function(amount) {
                    var a = 1 - amount;
                    return new Color([
                        Math.round(this.r * a),
                        Math.round(this.g * a),
                        Math.round(this.b * a),
                        this.a
                    ]);
                };
                Color.prototype.isTransparent = function() {
                    return this.a === 0;
                };
                Color.prototype.isBlack = function() {
                    return this.r === 0 && this.g === 0 && this.b === 0;
                };
                Color.prototype.fromArray = function(array) {
                    if (Array.isArray(array)) {
                        this.r = Math.min(array[0], 255);
                        this.g = Math.min(array[1], 255);
                        this.b = Math.min(array[2], 255);
                        if (array.length > 3) {
                            this.a = array[3];
                        }
                    }
                    return (Array.isArray(array));
                };
                var _hex3 = /^#([a-f0-9]{3})$/i;
                Color.prototype.hex3 = function(value) {
                    var match = null;
                    if ((match = value.match(_hex3)) !== null) {
                        this.r = parseInt(match[1][0] + match[1][0], 16);
                        this.g = parseInt(match[1][1] + match[1][1], 16);
                        this.b = parseInt(match[1][2] + match[1][2], 16);
                    }
                    return match !== null;
                };
                var _hex6 = /^#([a-f0-9]{6})$/i;
                Color.prototype.hex6 = function(value) {
                    var match = null;
                    if ((match = value.match(_hex6)) !== null) {
                        this.r = parseInt(match[1].substring(0, 2), 16);
                        this.g = parseInt(match[1].substring(2, 4), 16);
                        this.b = parseInt(match[1].substring(4, 6), 16);
                    }
                    return match !== null;
                };
                var _rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
                Color.prototype.rgb = function(value) {
                    var match = null;
                    if ((match = value.match(_rgb)) !== null) {
                        this.r = Number(match[1]);
                        this.g = Number(match[2]);
                        this.b = Number(match[3]);
                    }
                    return match !== null;
                };
                var _rgba = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;
                Color.prototype.rgba = function(value) {
                    var match = null;
                    if ((match = value.match(_rgba)) !== null) {
                        this.r = Number(match[1]);
                        this.g = Number(match[2]);
                        this.b = Number(match[3]);
                        this.a = Number(match[4]);
                    }
                    return match !== null;
                };
                Color.prototype.toString = function() {
                    return this.a !== null && this.a !== 1 ? "rgba(" + [
                        this.r,
                        this.g,
                        this.b,
                        this.a
                    ].join(",") + ")" : "rgb(" + [
                        this.r,
                        this.g,
                        this.b
                    ].join(",") + ")";
                };
                Color.prototype.namedColor = function(value) {
                    value = value.toLowerCase();
                    var color = colors[value];
                    if (color) {
                        this.r = color[0];
                        this.g = color[1];
                        this.b = color[2];
                    } else if (value === "transparent") {
                        this.r = this.g = this.b = this.a = 0;
                        return true;
                    }
                    return !!color;
                };
                Color.prototype.isColor = true;
                // JSON.stringify([].slice.call($$('.named-color-table tr'), 1).map(function(row) { return [row.childNodes[3].textContent, row.childNodes[5].textContent.trim().split(",").map(Number)] }).reduce(function(data, row) {data[row[0]] = row[1]; return data}, {}))
                var colors = {
                        "aliceblue": [
                            240,
                            248,
                            255
                        ],
                        "antiquewhite": [
                            250,
                            235,
                            215
                        ],
                        "aqua": [
                            0,
                            255,
                            255
                        ],
                        "aquamarine": [
                            127,
                            255,
                            212
                        ],
                        "azure": [
                            240,
                            255,
                            255
                        ],
                        "beige": [
                            245,
                            245,
                            220
                        ],
                        "bisque": [
                            255,
                            228,
                            196
                        ],
                        "black": [
                            0,
                            0,
                            0
                        ],
                        "blanchedalmond": [
                            255,
                            235,
                            205
                        ],
                        "blue": [
                            0,
                            0,
                            255
                        ],
                        "blueviolet": [
                            138,
                            43,
                            226
                        ],
                        "brown": [
                            165,
                            42,
                            42
                        ],
                        "burlywood": [
                            222,
                            184,
                            135
                        ],
                        "cadetblue": [
                            95,
                            158,
                            160
                        ],
                        "chartreuse": [
                            127,
                            255,
                            0
                        ],
                        "chocolate": [
                            210,
                            105,
                            30
                        ],
                        "coral": [
                            255,
                            127,
                            80
                        ],
                        "cornflowerblue": [
                            100,
                            149,
                            237
                        ],
                        "cornsilk": [
                            255,
                            248,
                            220
                        ],
                        "crimson": [
                            220,
                            20,
                            60
                        ],
                        "cyan": [
                            0,
                            255,
                            255
                        ],
                        "darkblue": [
                            0,
                            0,
                            139
                        ],
                        "darkcyan": [
                            0,
                            139,
                            139
                        ],
                        "darkgoldenrod": [
                            184,
                            134,
                            11
                        ],
                        "darkgray": [
                            169,
                            169,
                            169
                        ],
                        "darkgreen": [
                            0,
                            100,
                            0
                        ],
                        "darkgrey": [
                            169,
                            169,
                            169
                        ],
                        "darkkhaki": [
                            189,
                            183,
                            107
                        ],
                        "darkmagenta": [
                            139,
                            0,
                            139
                        ],
                        "darkolivegreen": [
                            85,
                            107,
                            47
                        ],
                        "darkorange": [
                            255,
                            140,
                            0
                        ],
                        "darkorchid": [
                            153,
                            50,
                            204
                        ],
                        "darkred": [
                            139,
                            0,
                            0
                        ],
                        "darksalmon": [
                            233,
                            150,
                            122
                        ],
                        "darkseagreen": [
                            143,
                            188,
                            143
                        ],
                        "darkslateblue": [
                            72,
                            61,
                            139
                        ],
                        "darkslategray": [
                            47,
                            79,
                            79
                        ],
                        "darkslategrey": [
                            47,
                            79,
                            79
                        ],
                        "darkturquoise": [
                            0,
                            206,
                            209
                        ],
                        "darkviolet": [
                            148,
                            0,
                            211
                        ],
                        "deeppink": [
                            255,
                            20,
                            147
                        ],
                        "deepskyblue": [
                            0,
                            191,
                            255
                        ],
                        "dimgray": [
                            105,
                            105,
                            105
                        ],
                        "dimgrey": [
                            105,
                            105,
                            105
                        ],
                        "dodgerblue": [
                            30,
                            144,
                            255
                        ],
                        "firebrick": [
                            178,
                            34,
                            34
                        ],
                        "floralwhite": [
                            255,
                            250,
                            240
                        ],
                        "forestgreen": [
                            34,
                            139,
                            34
                        ],
                        "fuchsia": [
                            255,
                            0,
                            255
                        ],
                        "gainsboro": [
                            220,
                            220,
                            220
                        ],
                        "ghostwhite": [
                            248,
                            248,
                            255
                        ],
                        "gold": [
                            255,
                            215,
                            0
                        ],
                        "goldenrod": [
                            218,
                            165,
                            32
                        ],
                        "gray": [
                            128,
                            128,
                            128
                        ],
                        "green": [
                            0,
                            128,
                            0
                        ],
                        "greenyellow": [
                            173,
                            255,
                            47
                        ],
                        "grey": [
                            128,
                            128,
                            128
                        ],
                        "honeydew": [
                            240,
                            255,
                            240
                        ],
                        "hotpink": [
                            255,
                            105,
                            180
                        ],
                        "indianred": [
                            205,
                            92,
                            92
                        ],
                        "indigo": [
                            75,
                            0,
                            130
                        ],
                        "ivory": [
                            255,
                            255,
                            240
                        ],
                        "khaki": [
                            240,
                            230,
                            140
                        ],
                        "lavender": [
                            230,
                            230,
                            250
                        ],
                        "lavenderblush": [
                            255,
                            240,
                            245
                        ],
                        "lawngreen": [
                            124,
                            252,
                            0
                        ],
                        "lemonchiffon": [
                            255,
                            250,
                            205
                        ],
                        "lightblue": [
                            173,
                            216,
                            230
                        ],
                        "lightcoral": [
                            240,
                            128,
                            128
                        ],
                        "lightcyan": [
                            224,
                            255,
                            255
                        ],
                        "lightgoldenrodyellow": [
                            250,
                            250,
                            210
                        ],
                        "lightgray": [
                            211,
                            211,
                            211
                        ],
                        "lightgreen": [
                            144,
                            238,
                            144
                        ],
                        "lightgrey": [
                            211,
                            211,
                            211
                        ],
                        "lightpink": [
                            255,
                            182,
                            193
                        ],
                        "lightsalmon": [
                            255,
                            160,
                            122
                        ],
                        "lightseagreen": [
                            32,
                            178,
                            170
                        ],
                        "lightskyblue": [
                            135,
                            206,
                            250
                        ],
                        "lightslategray": [
                            119,
                            136,
                            153
                        ],
                        "lightslategrey": [
                            119,
                            136,
                            153
                        ],
                        "lightsteelblue": [
                            176,
                            196,
                            222
                        ],
                        "lightyellow": [
                            255,
                            255,
                            224
                        ],
                        "lime": [
                            0,
                            255,
                            0
                        ],
                        "limegreen": [
                            50,
                            205,
                            50
                        ],
                        "linen": [
                            250,
                            240,
                            230
                        ],
                        "magenta": [
                            255,
                            0,
                            255
                        ],
                        "maroon": [
                            128,
                            0,
                            0
                        ],
                        "mediumaquamarine": [
                            102,
                            205,
                            170
                        ],
                        "mediumblue": [
                            0,
                            0,
                            205
                        ],
                        "mediumorchid": [
                            186,
                            85,
                            211
                        ],
                        "mediumpurple": [
                            147,
                            112,
                            219
                        ],
                        "mediumseagreen": [
                            60,
                            179,
                            113
                        ],
                        "mediumslateblue": [
                            123,
                            104,
                            238
                        ],
                        "mediumspringgreen": [
                            0,
                            250,
                            154
                        ],
                        "mediumturquoise": [
                            72,
                            209,
                            204
                        ],
                        "mediumvioletred": [
                            199,
                            21,
                            133
                        ],
                        "midnightblue": [
                            25,
                            25,
                            112
                        ],
                        "mintcream": [
                            245,
                            255,
                            250
                        ],
                        "mistyrose": [
                            255,
                            228,
                            225
                        ],
                        "moccasin": [
                            255,
                            228,
                            181
                        ],
                        "navajowhite": [
                            255,
                            222,
                            173
                        ],
                        "navy": [
                            0,
                            0,
                            128
                        ],
                        "oldlace": [
                            253,
                            245,
                            230
                        ],
                        "olive": [
                            128,
                            128,
                            0
                        ],
                        "olivedrab": [
                            107,
                            142,
                            35
                        ],
                        "orange": [
                            255,
                            165,
                            0
                        ],
                        "orangered": [
                            255,
                            69,
                            0
                        ],
                        "orchid": [
                            218,
                            112,
                            214
                        ],
                        "palegoldenrod": [
                            238,
                            232,
                            170
                        ],
                        "palegreen": [
                            152,
                            251,
                            152
                        ],
                        "paleturquoise": [
                            175,
                            238,
                            238
                        ],
                        "palevioletred": [
                            219,
                            112,
                            147
                        ],
                        "papayawhip": [
                            255,
                            239,
                            213
                        ],
                        "peachpuff": [
                            255,
                            218,
                            185
                        ],
                        "peru": [
                            205,
                            133,
                            63
                        ],
                        "pink": [
                            255,
                            192,
                            203
                        ],
                        "plum": [
                            221,
                            160,
                            221
                        ],
                        "powderblue": [
                            176,
                            224,
                            230
                        ],
                        "purple": [
                            128,
                            0,
                            128
                        ],
                        "rebeccapurple": [
                            102,
                            51,
                            153
                        ],
                        "red": [
                            255,
                            0,
                            0
                        ],
                        "rosybrown": [
                            188,
                            143,
                            143
                        ],
                        "royalblue": [
                            65,
                            105,
                            225
                        ],
                        "saddlebrown": [
                            139,
                            69,
                            19
                        ],
                        "salmon": [
                            250,
                            128,
                            114
                        ],
                        "sandybrown": [
                            244,
                            164,
                            96
                        ],
                        "seagreen": [
                            46,
                            139,
                            87
                        ],
                        "seashell": [
                            255,
                            245,
                            238
                        ],
                        "sienna": [
                            160,
                            82,
                            45
                        ],
                        "silver": [
                            192,
                            192,
                            192
                        ],
                        "skyblue": [
                            135,
                            206,
                            235
                        ],
                        "slateblue": [
                            106,
                            90,
                            205
                        ],
                        "slategray": [
                            112,
                            128,
                            144
                        ],
                        "slategrey": [
                            112,
                            128,
                            144
                        ],
                        "snow": [
                            255,
                            250,
                            250
                        ],
                        "springgreen": [
                            0,
                            255,
                            127
                        ],
                        "steelblue": [
                            70,
                            130,
                            180
                        ],
                        "tan": [
                            210,
                            180,
                            140
                        ],
                        "teal": [
                            0,
                            128,
                            128
                        ],
                        "thistle": [
                            216,
                            191,
                            216
                        ],
                        "tomato": [
                            255,
                            99,
                            71
                        ],
                        "turquoise": [
                            64,
                            224,
                            208
                        ],
                        "violet": [
                            238,
                            130,
                            238
                        ],
                        "wheat": [
                            245,
                            222,
                            179
                        ],
                        "white": [
                            255,
                            255,
                            255
                        ],
                        "whitesmoke": [
                            245,
                            245,
                            245
                        ],
                        "yellow": [
                            255,
                            255,
                            0
                        ],
                        "yellowgreen": [
                            154,
                            205,
                            50
                        ]
                    };
                module.exports = Color;
            },
            {}
        ],
        4: [
            function(_dereq_, module, exports) {
                var Support = _dereq_('./support');
                var CanvasRenderer = _dereq_('./renderers/canvas');
                var ImageLoader = _dereq_('./imageloader');
                var NodeParser = _dereq_('./nodeparser');
                var NodeContainer = _dereq_('./nodecontainer');
                var log = _dereq_('./log');
                var utils = _dereq_('./utils');
                var createWindowClone = _dereq_('./clone');
                var loadUrlDocument = _dereq_('./proxy').loadUrlDocument;
                var getBounds = utils.getBounds;
                var html2canvasNodeAttribute = "data-html2canvas-node";
                var html2canvasCloneIndex = 0;
                function html2canvas(nodeList, options) {
                    var index = html2canvasCloneIndex++;
                    options = options || {};
                    if (options.logging) {
                        log.options.logging = true;
                        log.options.start = Date.now();
                    }
                    options.async = typeof (options.async) === "undefined" ? true : options.async;
                    options.allowTaint = typeof (options.allowTaint) === "undefined" ? false : options.allowTaint;
                    options.removeContainer = typeof (options.removeContainer) === "undefined" ? true : options.removeContainer;
                    options.javascriptEnabled = typeof (options.javascriptEnabled) === "undefined" ? false : options.javascriptEnabled;
                    options.imageTimeout = typeof (options.imageTimeout) === "undefined" ? 10000 : options.imageTimeout;
                    options.renderer = typeof (options.renderer) === "function" ? options.renderer : CanvasRenderer;
                    options.strict = !!options.strict;
                    if (typeof (nodeList) === "string") {
                        if (typeof (options.proxy) !== "string") {
                            return Promise.reject("Proxy must be used when rendering url");
                        }
                        var width = options.width != null ? options.width : window.innerWidth;
                        var height = options.height != null ? options.height : window.innerHeight;
                        return loadUrlDocument(absoluteUrl(nodeList), options.proxy, document, width, height, options).then(function(container) {
                            return renderWindow(container.contentWindow.document.documentElement, container, options, width, height);
                        });
                    }
                    var node = ((nodeList === undefined) ? [
                            document.documentElement
                        ] : ((nodeList.length) ? nodeList : [
                            nodeList
                        ]))[0];
                    node.setAttribute(html2canvasNodeAttribute + index, index);
                    return renderDocument(node.ownerDocument, options, node.ownerDocument.defaultView.innerWidth, node.ownerDocument.defaultView.innerHeight, index).then(function(canvas) {
                        if (typeof (options.onrendered) === "function") {
                            log("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas");
                            options.onrendered(canvas);
                        }
                        return canvas;
                    });
                }
                html2canvas.CanvasRenderer = CanvasRenderer;
                html2canvas.NodeContainer = NodeContainer;
                html2canvas.log = log;
                html2canvas.utils = utils;
                var html2canvasExport = (typeof (document) === "undefined" || typeof (Object.create) !== "function" || typeof (document.createElement("canvas").getContext) !== "function") ? function() {
                        return Promise.reject("No canvas support");
                    } : html2canvas;
                module.exports = html2canvasExport;
                if (typeof (define) === 'function' && define.amd) {
                    define('html2canvas', [], function() {
                        return html2canvasExport;
                    });
                }
                function renderDocument(document, options, windowWidth, windowHeight, html2canvasIndex) {
                    return createWindowClone(document, document, windowWidth, windowHeight, options, document.defaultView.pageXOffset, document.defaultView.pageYOffset).then(function(container) {
                        log("Document cloned");
                        var attributeName = html2canvasNodeAttribute + html2canvasIndex;
                        var selector = "[" + attributeName + "='" + html2canvasIndex + "']";
                        document.querySelector(selector).removeAttribute(attributeName);
                        var clonedWindow = container.contentWindow;
                        var node = clonedWindow.document.querySelector(selector);
                        var oncloneHandler = (typeof (options.onclone) === "function") ? Promise.resolve(options.onclone(clonedWindow.document)) : Promise.resolve(true);
                        return oncloneHandler.then(function() {
                            return renderWindow(node, container, options, windowWidth, windowHeight);
                        });
                    });
                }
                function renderWindow(node, container, options, windowWidth, windowHeight) {
                    var clonedWindow = container.contentWindow;
                    var support = new Support(clonedWindow.document);
                    var imageLoader = new ImageLoader(options, support);
                    var bounds = getBounds(node);
                    var width = options.type === "view" ? windowWidth : documentWidth(clonedWindow.document);
                    var height = options.type === "view" ? windowHeight : documentHeight(clonedWindow.document);
                    var renderer = new options.renderer(width, height, imageLoader, options, document);
                    var parser = new NodeParser(node, renderer, support, imageLoader, options);
                    return parser.ready.then(function() {
                        log("Finished rendering");
                        var canvas;
                        if (options.type === "view") {
                            canvas = crop(renderer.canvas, {
                                width: renderer.canvas.width,
                                height: renderer.canvas.height,
                                top: 0,
                                left: 0,
                                x: 0,
                                y: 0
                            });
                        } else if (node === clonedWindow.document.body || node === clonedWindow.document.documentElement || options.canvas != null) {
                            canvas = renderer.canvas;
                        } else {
                            canvas = crop(renderer.canvas, {
                                width: options.width != null ? options.width : bounds.width,
                                height: options.height != null ? options.height : bounds.height,
                                top: bounds.top,
                                left: bounds.left,
                                x: 0,
                                y: 0
                            });
                        }
                        cleanupContainer(container, options);
                        return canvas;
                    });
                }
                function cleanupContainer(container, options) {
                    if (options.removeContainer) {
                        container.parentNode.removeChild(container);
                        log("Cleaned up container");
                    }
                }
                function crop(canvas, bounds) {
                    var croppedCanvas = document.createElement("canvas");
                    var x1 = Math.min(canvas.width - 1, Math.max(0, bounds.left));
                    var x2 = Math.min(canvas.width, Math.max(1, bounds.left + bounds.width));
                    var y1 = Math.min(canvas.height - 1, Math.max(0, bounds.top));
                    var y2 = Math.min(canvas.height, Math.max(1, bounds.top + bounds.height));
                    croppedCanvas.width = bounds.width;
                    croppedCanvas.height = bounds.height;
                    var width = x2 - x1;
                    var height = y2 - y1;
                    log("Cropping canvas at:", "left:", bounds.left, "top:", bounds.top, "width:", width, "height:", height);
                    log("Resulting crop with width", bounds.width, "and height", bounds.height, "with x", x1, "and y", y1);
                    croppedCanvas.getContext("2d").drawImage(canvas, x1, y1, width, height, bounds.x, bounds.y, width, height);
                    return croppedCanvas;
                }
                function documentWidth(doc) {
                    return Math.max(Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth), Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth), Math.max(doc.body.clientWidth, doc.documentElement.clientWidth));
                }
                function documentHeight(doc) {
                    return Math.max(Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight), Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight), Math.max(doc.body.clientHeight, doc.documentElement.clientHeight));
                }
                function absoluteUrl(url) {
                    var link = document.createElement("a");
                    link.href = url;
                    link.href = link.href;
                    return link;
                }
            },
            {
                "./clone": 2,
                "./imageloader": 11,
                "./log": 13,
                "./nodecontainer": 14,
                "./nodeparser": 15,
                "./proxy": 16,
                "./renderers/canvas": 20,
                "./support": 22,
                "./utils": 26
            }
        ],
        5: [
            function(_dereq_, module, exports) {
                var log = _dereq_('./log');
                var smallImage = _dereq_('./utils').smallImage;
                function DummyImageContainer(src) {
                    this.src = src;
                    log("DummyImageContainer for", src);
                    if (!this.promise || !this.image) {
                        log("Initiating DummyImageContainer");
                        DummyImageContainer.prototype.image = new Image();
                        var image = this.image;
                        DummyImageContainer.prototype.promise = new Promise(function(resolve, reject) {
                            image.onload = resolve;
                            image.onerror = reject;
                            image.src = smallImage();
                            if (image.complete === true) {
                                resolve(image);
                            }
                        });
                    }
                }
                module.exports = DummyImageContainer;
            },
            {
                "./log": 13,
                "./utils": 26
            }
        ],
        6: [
            function(_dereq_, module, exports) {
                var smallImage = _dereq_('./utils').smallImage;
                function Font(family, size) {
                    var container = document.createElement('div'),
                        img = document.createElement('img'),
                        span = document.createElement('span'),
                        sampleText = 'Hidden Text',
                        baseline, middle;
                    container.style.visibility = "hidden";
                    container.style.fontFamily = family;
                    container.style.fontSize = size;
                    container.style.margin = 0;
                    container.style.padding = 0;
                    document.body.appendChild(container);
                    img.src = smallImage();
                    img.width = 1;
                    img.height = 1;
                    img.style.margin = 0;
                    img.style.padding = 0;
                    img.style.verticalAlign = "baseline";
                    span.style.fontFamily = family;
                    span.style.fontSize = size;
                    span.style.margin = 0;
                    span.style.padding = 0;
                    span.appendChild(document.createTextNode(sampleText));
                    container.appendChild(span);
                    container.appendChild(img);
                    baseline = (img.offsetTop - span.offsetTop) + 1;
                    container.removeChild(span);
                    container.appendChild(document.createTextNode(sampleText));
                    container.style.lineHeight = "normal";
                    img.style.verticalAlign = "super";
                    middle = (img.offsetTop - container.offsetTop) + 1;
                    document.body.removeChild(container);
                    this.baseline = baseline;
                    this.lineWidth = 1;
                    this.middle = middle;
                }
                module.exports = Font;
            },
            {
                "./utils": 26
            }
        ],
        7: [
            function(_dereq_, module, exports) {
                var Font = _dereq_('./font');
                function FontMetrics() {
                    this.data = {};
                }
                FontMetrics.prototype.getMetrics = function(family, size) {
                    if (this.data[family + "-" + size] === undefined) {
                        this.data[family + "-" + size] = new Font(family, size);
                    }
                    return this.data[family + "-" + size];
                };
                module.exports = FontMetrics;
            },
            {
                "./font": 6
            }
        ],
        8: [
            function(_dereq_, module, exports) {
                var utils = _dereq_('./utils');
                var getBounds = utils.getBounds;
                var loadUrlDocument = _dereq_('./proxy').loadUrlDocument;
                function FrameContainer(container, sameOrigin, options) {
                    this.image = null;
                    this.src = container;
                    var self = this;
                    var bounds = getBounds(container);
                    this.promise = (!sameOrigin ? this.proxyLoad(options.proxy, bounds, options) : new Promise(function(resolve) {
                        if (container.contentWindow.document.URL === "about:blank" || container.contentWindow.document.documentElement == null) {
                            container.contentWindow.onload = container.onload = function() {
                                resolve(container);
                            };
                        } else {
                            resolve(container);
                        }
                    })).then(function(container) {
                        var html2canvas = _dereq_('./core');
                        return html2canvas(container.contentWindow.document.documentElement, {
                            type: 'view',
                            width: container.width,
                            height: container.height,
                            proxy: options.proxy,
                            javascriptEnabled: options.javascriptEnabled,
                            removeContainer: options.removeContainer,
                            allowTaint: options.allowTaint,
                            imageTimeout: options.imageTimeout / 2
                        });
                    }).then(function(canvas) {
                        return self.image = canvas;
                    });
                }
                FrameContainer.prototype.proxyLoad = function(proxy, bounds, options) {
                    var container = this.src;
                    return loadUrlDocument(container.src, proxy, container.ownerDocument, bounds.width, bounds.height, options);
                };
                module.exports = FrameContainer;
            },
            {
                "./core": 4,
                "./proxy": 16,
                "./utils": 26
            }
        ],
        9: [
            function(_dereq_, module, exports) {
                function GradientContainer(imageData) {
                    this.src = imageData.value;
                    this.colorStops = [];
                    this.type = null;
                    this.x0 = 0.5;
                    this.y0 = 0.5;
                    this.x1 = 0.5;
                    this.y1 = 0.5;
                    this.promise = Promise.resolve(true);
                }
                GradientContainer.TYPES = {
                    LINEAR: 1,
                    RADIAL: 2
                };
                // TODO: support hsl[a], negative %/length values
                // TODO: support <angle> (e.g. -?\d{1,3}(?:\.\d+)deg, etc. : https://developer.mozilla.org/docs/Web/CSS/angle )
                GradientContainer.REGEXP_COLORSTOP = /^\s*(rgba?\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*[0-9\.]+)?\s*\)|[a-z]{3,20}|#[a-f0-9]{3,6})(?:\s+(\d{1,3}(?:\.\d+)?)(%|px)?)?(?:\s|$)/i;
                module.exports = GradientContainer;
            },
            {}
        ],
        10: [
            function(_dereq_, module, exports) {
                function ImageContainer(src, cors) {
                    this.src = src;
                    this.image = new Image();
                    var self = this;
                    this.tainted = null;
                    this.promise = new Promise(function(resolve, reject) {
                        self.image.onload = resolve;
                        self.image.onerror = reject;
                        if (cors) {
                            self.image.crossOrigin = "anonymous";
                        }
                        self.image.src = src;
                        if (self.image.complete === true) {
                            resolve(self.image);
                        }
                    });
                }
                module.exports = ImageContainer;
            },
            {}
        ],
        11: [
            function(_dereq_, module, exports) {
                var log = _dereq_('./log');
                var ImageContainer = _dereq_('./imagecontainer');
                var DummyImageContainer = _dereq_('./dummyimagecontainer');
                var ProxyImageContainer = _dereq_('./proxyimagecontainer');
                var FrameContainer = _dereq_('./framecontainer');
                var SVGContainer = _dereq_('./svgcontainer');
                var SVGNodeContainer = _dereq_('./svgnodecontainer');
                var LinearGradientContainer = _dereq_('./lineargradientcontainer');
                var WebkitGradientContainer = _dereq_('./webkitgradientcontainer');
                var bind = _dereq_('./utils').bind;
                function ImageLoader(options, support) {
                    this.link = null;
                    this.options = options;
                    this.support = support;
                    this.origin = this.getOrigin(window.location.href);
                }
                ImageLoader.prototype.findImages = function(nodes) {
                    var images = [];
                    nodes.reduce(function(imageNodes, container) {
                        switch (container.node.nodeName) {
                            case "IMG":
                                return imageNodes.concat([
                                    {
                                        args: [
                                            container.node.src
                                        ],
                                        method: "url"
                                    }
                                ]);
                            case "svg":
                            case "IFRAME":
                                return imageNodes.concat([
                                    {
                                        args: [
                                            container.node
                                        ],
                                        method: container.node.nodeName
                                    }
                                ]);
                        }
                        return imageNodes;
                    }, []).forEach(this.addImage(images, this.loadImage), this);
                    return images;
                };
                ImageLoader.prototype.findBackgroundImage = function(images, container) {
                    container.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(images, this.loadImage), this);
                    return images;
                };
                ImageLoader.prototype.addImage = function(images, callback) {
                    return function(newImage) {
                        newImage.args.forEach(function(image) {
                            if (!this.imageExists(images, image)) {
                                images.splice(0, 0, callback.call(this, newImage));
                                log('Added image #' + (images.length), typeof (image) === "string" ? image.substring(0, 100) : image);
                            }
                        }, this);
                    };
                };
                ImageLoader.prototype.hasImageBackground = function(imageData) {
                    return imageData.method !== "none";
                };
                ImageLoader.prototype.loadImage = function(imageData) {
                    if (imageData.method === "url") {
                        var src = imageData.args[0];
                        if (this.isSVG(src) && !this.support.svg && !this.options.allowTaint) {
                            return new SVGContainer(src);
                        } else if (src.match(/data:image\/.*;base64,/i)) {
                            return new ImageContainer(src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, ''), false);
                        } else if (this.isSameOrigin(src) || this.options.allowTaint === true || this.isSVG(src)) {
                            return new ImageContainer(src, false);
                        } else if (this.support.cors && !this.options.allowTaint && this.options.useCORS) {
                            return new ImageContainer(src, true);
                        } else if (this.options.proxy) {
                            return new ProxyImageContainer(src, this.options.proxy);
                        } else {
                            return new DummyImageContainer(src);
                        }
                    } else if (imageData.method === "linear-gradient") {
                        return new LinearGradientContainer(imageData);
                    } else if (imageData.method === "gradient") {
                        return new WebkitGradientContainer(imageData);
                    } else if (imageData.method === "svg") {
                        return new SVGNodeContainer(imageData.args[0], this.support.svg);
                    } else if (imageData.method === "IFRAME") {
                        return new FrameContainer(imageData.args[0], this.isSameOrigin(imageData.args[0].src), this.options);
                    } else {
                        return new DummyImageContainer(imageData);
                    }
                };
                ImageLoader.prototype.isSVG = function(src) {
                    return src.substring(src.length - 3).toLowerCase() === "svg" || SVGContainer.prototype.isInline(src);
                };
                ImageLoader.prototype.imageExists = function(images, src) {
                    return images.some(function(image) {
                        return image.src === src;
                    });
                };
                ImageLoader.prototype.isSameOrigin = function(url) {
                    return (this.getOrigin(url) === this.origin);
                };
                ImageLoader.prototype.getOrigin = function(url) {
                    var link = this.link || (this.link = document.createElement("a"));
                    link.href = url;
                    link.href = link.href;
                    // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
                    return link.protocol + link.hostname + link.port;
                };
                ImageLoader.prototype.getPromise = function(container) {
                    return this.timeout(container, this.options.imageTimeout)['catch'](function() {
                        var dummy = new DummyImageContainer(container.src);
                        return dummy.promise.then(function(image) {
                            container.image = image;
                        });
                    });
                };
                ImageLoader.prototype.get = function(src) {
                    var found = null;
                    return this.images.some(function(img) {
                        return (found = img).src === src;
                    }) ? found : null;
                };
                ImageLoader.prototype.fetch = function(nodes) {
                    this.images = nodes.reduce(bind(this.findBackgroundImage, this), this.findImages(nodes));
                    this.images.forEach(function(image, index) {
                        image.promise.then(function() {
                            log("Succesfully loaded image #" + (index + 1), image);
                        }, function(e) {
                            log("Failed loading image #" + (index + 1), image, e);
                        });
                    });
                    this.ready = Promise.all(this.images.map(this.getPromise, this));
                    log("Finished searching images");
                    return this;
                };
                ImageLoader.prototype.timeout = function(container, timeout) {
                    var timer;
                    var promise = Promise.race([
                            container.promise,
                            new Promise(function(res, reject) {
                                timer = setTimeout(function() {
                                    log("Timed out loading image", container);
                                    reject(container);
                                }, timeout);
                            })
                        ]).then(function(container) {
                            clearTimeout(timer);
                            return container;
                        });
                    promise['catch'](function() {
                        clearTimeout(timer);
                    });
                    return promise;
                };
                module.exports = ImageLoader;
            },
            {
                "./dummyimagecontainer": 5,
                "./framecontainer": 8,
                "./imagecontainer": 10,
                "./lineargradientcontainer": 12,
                "./log": 13,
                "./proxyimagecontainer": 17,
                "./svgcontainer": 23,
                "./svgnodecontainer": 24,
                "./utils": 26,
                "./webkitgradientcontainer": 27
            }
        ],
        12: [
            function(_dereq_, module, exports) {
                var GradientContainer = _dereq_('./gradientcontainer');
                var Color = _dereq_('./color');
                function LinearGradientContainer(imageData) {
                    GradientContainer.apply(this, arguments);
                    this.type = GradientContainer.TYPES.LINEAR;
                    var hasDirection = LinearGradientContainer.REGEXP_DIRECTION.test(imageData.args[0]) || !GradientContainer.REGEXP_COLORSTOP.test(imageData.args[0]);
                    if (hasDirection) {
                        imageData.args[0].split(/\s+/).reverse().forEach(function(position, index) {
                            switch (position) {
                                case "left":
                                    this.x0 = 0;
                                    this.x1 = 1;
                                    break;
                                case "top":
                                    this.y0 = 0;
                                    this.y1 = 1;
                                    break;
                                case "right":
                                    this.x0 = 1;
                                    this.x1 = 0;
                                    break;
                                case "bottom":
                                    this.y0 = 1;
                                    this.y1 = 0;
                                    break;
                                case "to":
                                    var y0 = this.y0;
                                    var x0 = this.x0;
                                    this.y0 = this.y1;
                                    this.x0 = this.x1;
                                    this.x1 = x0;
                                    this.y1 = y0;
                                    break;
                                case "center":
                                    break;
                                // centered by default
                                // Firefox internally converts position keywords to percentages:
                                // http://www.w3.org/TR/2010/WD-CSS2-20101207/colors.html#propdef-background-position
                                default:
                                    // percentage or absolute length
                                    // TODO: support absolute start point positions (e.g., use bounds to convert px to a ratio)
                                    var ratio = parseFloat(position, 10) * 0.01;
                                    if (isNaN(ratio)) {
                                        // invalid or unhandled value
                                        break;
                                    };
                                    if (index === 0) {
                                        this.y0 = ratio;
                                        this.y1 = 1 - this.y0;
                                    } else {
                                        this.x0 = ratio;
                                        this.x1 = 1 - this.x0;
                                    };
                                    break;
                            }
                        }, this);
                    } else {
                        this.y0 = 0;
                        this.y1 = 1;
                    }
                    this.colorStops = imageData.args.slice(hasDirection ? 1 : 0).map(function(colorStop) {
                        var colorStopMatch = colorStop.match(GradientContainer.REGEXP_COLORSTOP);
                        var value = +colorStopMatch[2];
                        var unit = value === 0 ? "%" : colorStopMatch[3];
                        // treat "0" as "0%"
                        return {
                            color: new Color(colorStopMatch[1]),
                            // TODO: support absolute stop positions (e.g., compute gradient line length & convert px to ratio)
                            stop: unit === "%" ? value / 100 : null
                        };
                    });
                    if (this.colorStops[0].stop === null) {
                        this.colorStops[0].stop = 0;
                    }
                    if (this.colorStops[this.colorStops.length - 1].stop === null) {
                        this.colorStops[this.colorStops.length - 1].stop = 1;
                    }
                    // calculates and fills-in explicit stop positions when omitted from rule
                    this.colorStops.forEach(function(colorStop, index) {
                        if (colorStop.stop === null) {
                            this.colorStops.slice(index).some(function(find, count) {
                                if (find.stop !== null) {
                                    colorStop.stop = ((find.stop - this.colorStops[index - 1].stop) / (count + 1)) + this.colorStops[index - 1].stop;
                                    return true;
                                } else {
                                    return false;
                                }
                            }, this);
                        }
                    }, this);
                }
                LinearGradientContainer.prototype = Object.create(GradientContainer.prototype);
                // TODO: support <angle> (e.g. -?\d{1,3}(?:\.\d+)deg, etc. : https://developer.mozilla.org/docs/Web/CSS/angle )
                LinearGradientContainer.REGEXP_DIRECTION = /^\s*(?:to|left|right|top|bottom|center|\d{1,3}(?:\.\d+)?%?)(?:\s|$)/i;
                module.exports = LinearGradientContainer;
            },
            {
                "./color": 3,
                "./gradientcontainer": 9
            }
        ],
        13: [
            function(_dereq_, module, exports) {
                var logger = function() {
                        if (logger.options.logging && window.console && window.console.log) {
                            Function.prototype.bind.call(window.console.log, (window.console)).apply(window.console, [
                                (Date.now() - logger.options.start) + "ms",
                                "html2canvas:"
                            ].concat([].slice.call(arguments, 0)));
                        }
                    };
                logger.options = {
                    logging: false
                };
                module.exports = logger;
            },
            {}
        ],
        14: [
            function(_dereq_, module, exports) {
                var Color = _dereq_('./color');
                var utils = _dereq_('./utils');
                var getBounds = utils.getBounds;
                var parseBackgrounds = utils.parseBackgrounds;
                var offsetBounds = utils.offsetBounds;
                function NodeContainer(node, parent) {
                    this.node = node;
                    this.parent = parent;
                    this.stack = null;
                    this.bounds = null;
                    this.borders = null;
                    this.clip = [];
                    this.backgroundClip = [];
                    this.offsetBounds = null;
                    this.visible = null;
                    this.computedStyles = null;
                    this.colors = {};
                    this.styles = {};
                    this.backgroundImages = null;
                    this.transformData = null;
                    this.transformMatrix = null;
                    this.isPseudoElement = false;
                    this.opacity = null;
                }
                NodeContainer.prototype.cloneTo = function(stack) {
                    stack.visible = this.visible;
                    stack.borders = this.borders;
                    stack.bounds = this.bounds;
                    stack.clip = this.clip;
                    stack.backgroundClip = this.backgroundClip;
                    stack.computedStyles = this.computedStyles;
                    stack.styles = this.styles;
                    stack.backgroundImages = this.backgroundImages;
                    stack.opacity = this.opacity;
                };
                NodeContainer.prototype.getOpacity = function() {
                    return this.opacity === null ? (this.opacity = this.cssFloat('opacity')) : this.opacity;
                };
                NodeContainer.prototype.assignStack = function(stack) {
                    this.stack = stack;
                    stack.children.push(this);
                };
                NodeContainer.prototype.isElementVisible = function() {
                    return this.node.nodeType === Node.TEXT_NODE ? this.parent.visible : (this.css('display') !== "none" && this.css('visibility') !== "hidden" && !this.node.hasAttribute("data-html2canvas-ignore") && (this.node.nodeName !== "INPUT" || this.node.getAttribute("type") !== "hidden"));
                };
                NodeContainer.prototype.css = function(attribute) {
                    if (!this.computedStyles) {
                        this.computedStyles = this.isPseudoElement ? this.parent.computedStyle(this.before ? ":before" : ":after") : this.computedStyle(null);
                    }
                    return this.styles[attribute] || (this.styles[attribute] = this.computedStyles[attribute]);
                };
                NodeContainer.prototype.prefixedCss = function(attribute) {
                    var prefixes = [
                            "webkit",
                            "moz",
                            "ms",
                            "o"
                        ];
                    var value = this.css(attribute);
                    if (value === undefined) {
                        prefixes.some(function(prefix) {
                            value = this.css(prefix + attribute.substr(0, 1).toUpperCase() + attribute.substr(1));
                            return value !== undefined;
                        }, this);
                    }
                    return value === undefined ? null : value;
                };
                NodeContainer.prototype.computedStyle = function(type) {
                    return this.node.ownerDocument.defaultView.getComputedStyle(this.node, type);
                };
                NodeContainer.prototype.cssInt = function(attribute) {
                    var value = parseInt(this.css(attribute), 10);
                    return (isNaN(value)) ? 0 : value;
                };
                // borders in old IE are throwing 'medium' for demo.html
                NodeContainer.prototype.color = function(attribute) {
                    return this.colors[attribute] || (this.colors[attribute] = new Color(this.css(attribute)));
                };
                NodeContainer.prototype.cssFloat = function(attribute) {
                    var value = parseFloat(this.css(attribute));
                    return (isNaN(value)) ? 0 : value;
                };
                NodeContainer.prototype.fontWeight = function() {
                    var weight = this.css("fontWeight");
                    switch (parseInt(weight, 10)) {
                        case 401:
                            weight = "bold";
                            break;
                        case 400:
                            weight = "normal";
                            break;
                    }
                    return weight;
                };
                NodeContainer.prototype.parseClip = function() {
                    var matches = this.css('clip').match(this.CLIP);
                    if (matches) {
                        return {
                            top: parseInt(matches[1], 10),
                            right: parseInt(matches[2], 10),
                            bottom: parseInt(matches[3], 10),
                            left: parseInt(matches[4], 10)
                        };
                    }
                    return null;
                };
                NodeContainer.prototype.parseBackgroundImages = function() {
                    return this.backgroundImages || (this.backgroundImages = parseBackgrounds(this.css("backgroundImage")));
                };
                NodeContainer.prototype.cssList = function(property, index) {
                    var value = (this.css(property) || '').split(',');
                    value = value[index || 0] || value[0] || 'auto';
                    value = value.trim().split(' ');
                    if (value.length === 1) {
                        value = [
                            value[0],
                            isPercentage(value[0]) ? 'auto' : value[0]
                        ];
                    }
                    return value;
                };
                NodeContainer.prototype.parseBackgroundSize = function(bounds, image, index) {
                    var size = this.cssList("backgroundSize", index);
                    var width, height;
                    if (isPercentage(size[0])) {
                        width = bounds.width * parseFloat(size[0]) / 100;
                    } else if (/contain|cover/.test(size[0])) {
                        var targetRatio = bounds.width / bounds.height,
                            currentRatio = image.width / image.height;
                        return (targetRatio < currentRatio ^ size[0] === 'contain') ? {
                            width: bounds.height * currentRatio,
                            height: bounds.height
                        } : {
                            width: bounds.width,
                            height: bounds.width / currentRatio
                        };
                    } else {
                        width = parseInt(size[0], 10);
                    }
                    if (size[0] === 'auto' && size[1] === 'auto') {
                        height = image.height;
                    } else if (size[1] === 'auto') {
                        height = width / image.width * image.height;
                    } else if (isPercentage(size[1])) {
                        height = bounds.height * parseFloat(size[1]) / 100;
                    } else {
                        height = parseInt(size[1], 10);
                    }
                    if (size[0] === 'auto') {
                        width = height / image.height * image.width;
                    }
                    return {
                        width: width,
                        height: height
                    };
                };
                NodeContainer.prototype.parseBackgroundPosition = function(bounds, image, index, backgroundSize) {
                    var position = this.cssList('backgroundPosition', index);
                    var left, top;
                    if (isPercentage(position[0])) {
                        left = (bounds.width - (backgroundSize || image).width) * (parseFloat(position[0]) / 100);
                    } else {
                        left = parseInt(position[0], 10);
                    }
                    if (position[1] === 'auto') {
                        top = left / image.width * image.height;
                    } else if (isPercentage(position[1])) {
                        top = (bounds.height - (backgroundSize || image).height) * parseFloat(position[1]) / 100;
                    } else {
                        top = parseInt(position[1], 10);
                    }
                    if (position[0] === 'auto') {
                        left = top / image.height * image.width;
                    }
                    return {
                        left: left,
                        top: top
                    };
                };
                NodeContainer.prototype.parseBackgroundRepeat = function(index) {
                    return this.cssList("backgroundRepeat", index)[0];
                };
                NodeContainer.prototype.parseTextShadows = function() {
                    var textShadow = this.css("textShadow");
                    var results = [];
                    if (textShadow && textShadow !== 'none') {
                        var shadows = textShadow.match(this.TEXT_SHADOW_PROPERTY);
                        for (var i = 0; shadows && (i < shadows.length); i++) {
                            var s = shadows[i].match(this.TEXT_SHADOW_VALUES);
                            results.push({
                                color: new Color(s[0]),
                                offsetX: s[1] ? parseFloat(s[1].replace('px', '')) : 0,
                                offsetY: s[2] ? parseFloat(s[2].replace('px', '')) : 0,
                                blur: s[3] ? s[3].replace('px', '') : 0
                            });
                        }
                    }
                    return results;
                };
                NodeContainer.prototype.parseTransform = function() {
                    if (!this.transformData) {
                        if (this.hasTransform()) {
                            var offset = this.parseBounds();
                            var origin = this.prefixedCss("transformOrigin").split(" ").map(removePx).map(asFloat);
                            origin[0] += offset.left;
                            origin[1] += offset.top;
                            this.transformData = {
                                origin: origin,
                                matrix: this.parseTransformMatrix()
                            };
                        } else {
                            this.transformData = {
                                origin: [
                                    0,
                                    0
                                ],
                                matrix: [
                                    1,
                                    0,
                                    0,
                                    1,
                                    0,
                                    0
                                ]
                            };
                        }
                    }
                    return this.transformData;
                };
                NodeContainer.prototype.parseTransformMatrix = function() {
                    if (!this.transformMatrix) {
                        var transform = this.prefixedCss("transform");
                        var matrix = transform ? parseMatrix(transform.match(this.MATRIX_PROPERTY)) : null;
                        this.transformMatrix = matrix ? matrix : [
                            1,
                            0,
                            0,
                            1,
                            0,
                            0
                        ];
                    }
                    return this.transformMatrix;
                };
                NodeContainer.prototype.parseBounds = function() {
                    return this.bounds || (this.bounds = this.hasTransform() ? offsetBounds(this.node) : getBounds(this.node));
                };
                NodeContainer.prototype.hasTransform = function() {
                    return this.parseTransformMatrix().join(",") !== "1,0,0,1,0,0" || (this.parent && this.parent.hasTransform());
                };
                NodeContainer.prototype.getValue = function() {
                    var value = this.node.value || "";
                    if (this.node.tagName === "SELECT") {
                        value = selectionValue(this.node);
                    } else if (this.node.type === "password") {
                        value = Array(value.length + 1).join('\u2022');
                    }
                    // jshint ignore:line
                    return value.length === 0 ? (this.node.placeholder || "") : value;
                };
                NodeContainer.prototype.MATRIX_PROPERTY = /(matrix|matrix3d)\((.+)\)/;
                NodeContainer.prototype.TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g;
                NodeContainer.prototype.TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;
                NodeContainer.prototype.CLIP = /^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/;
                function selectionValue(node) {
                    var option = node.options[node.selectedIndex || 0];
                    return option ? (option.text || "") : "";
                }
                function parseMatrix(match) {
                    if (match && match[1] === "matrix") {
                        return match[2].split(",").map(function(s) {
                            return parseFloat(s.trim());
                        });
                    } else if (match && match[1] === "matrix3d") {
                        var matrix3d = match[2].split(",").map(function(s) {
                                return parseFloat(s.trim());
                            });
                        return [
                            matrix3d[0],
                            matrix3d[1],
                            matrix3d[4],
                            matrix3d[5],
                            matrix3d[12],
                            matrix3d[13]
                        ];
                    }
                }
                function isPercentage(value) {
                    return value.toString().indexOf("%") !== -1;
                }
                function removePx(str) {
                    return str.replace("px", "");
                }
                function asFloat(str) {
                    return parseFloat(str);
                }
                module.exports = NodeContainer;
            },
            {
                "./color": 3,
                "./utils": 26
            }
        ],
        15: [
            function(_dereq_, module, exports) {
                var log = _dereq_('./log');
                var punycode = _dereq_('punycode');
                var NodeContainer = _dereq_('./nodecontainer');
                var TextContainer = _dereq_('./textcontainer');
                var PseudoElementContainer = _dereq_('./pseudoelementcontainer');
                var FontMetrics = _dereq_('./fontmetrics');
                var Color = _dereq_('./color');
                var StackingContext = _dereq_('./stackingcontext');
                var utils = _dereq_('./utils');
                var bind = utils.bind;
                var getBounds = utils.getBounds;
                var parseBackgrounds = utils.parseBackgrounds;
                var offsetBounds = utils.offsetBounds;
                function NodeParser(element, renderer, support, imageLoader, options) {
                    log("Starting NodeParser");
                    this.renderer = renderer;
                    this.options = options;
                    this.range = null;
                    this.support = support;
                    this.renderQueue = [];
                    this.stack = new StackingContext(true, 1, element.ownerDocument, null);
                    var parent = new NodeContainer(element, null);
                    if (options.background) {
                        renderer.rectangle(0, 0, renderer.width, renderer.height, new Color(options.background));
                    }
                    if (element === element.ownerDocument.documentElement) {
                        // http://www.w3.org/TR/css3-background/#special-backgrounds
                        var canvasBackground = new NodeContainer(parent.color('backgroundColor').isTransparent() ? element.ownerDocument.body : element.ownerDocument.documentElement, null);
                        renderer.rectangle(0, 0, renderer.width, renderer.height, canvasBackground.color('backgroundColor'));
                    }
                    parent.visibile = parent.isElementVisible();
                    this.createPseudoHideStyles(element.ownerDocument);
                    this.disableAnimations(element.ownerDocument);
                    this.nodes = flatten([
                        parent
                    ].concat(this.getChildren(parent)).filter(function(container) {
                        return container.visible = container.isElementVisible();
                    }).map(this.getPseudoElements, this));
                    this.fontMetrics = new FontMetrics();
                    log("Fetched nodes, total:", this.nodes.length);
                    log("Calculate overflow clips");
                    this.calculateOverflowClips();
                    log("Start fetching images");
                    this.images = imageLoader.fetch(this.nodes.filter(isElement));
                    this.ready = this.images.ready.then(bind(function() {
                        log("Images loaded, starting parsing");
                        log("Creating stacking contexts");
                        this.createStackingContexts();
                        log("Sorting stacking contexts");
                        this.sortStackingContexts(this.stack);
                        this.parse(this.stack);
                        log("Render queue created with " + this.renderQueue.length + " items");
                        return new Promise(bind(function(resolve) {
                            if (!options.async) {
                                this.renderQueue.forEach(this.paint, this);
                                resolve();
                            } else if (typeof (options.async) === "function") {
                                options.async.call(this, this.renderQueue, resolve);
                            } else if (this.renderQueue.length > 0) {
                                this.renderIndex = 0;
                                this.asyncRenderer(this.renderQueue, resolve);
                            } else {
                                resolve();
                            }
                        }, this));
                    }, this));
                }
                NodeParser.prototype.calculateOverflowClips = function() {
                    this.nodes.forEach(function(container) {
                        if (isElement(container)) {
                            if (isPseudoElement(container)) {
                                container.appendToDOM();
                            }
                            container.borders = this.parseBorders(container);
                            var clip = (container.css('overflow') === "hidden") ? [
                                    container.borders.clip
                                ] : [];
                            var cssClip = container.parseClip();
                            if (cssClip && [
                                "absolute",
                                "fixed"
                            ].indexOf(container.css('position')) !== -1) {
                                clip.push([
                                    [
                                        "rect",
                                        container.bounds.left + cssClip.left,
                                        container.bounds.top + cssClip.top,
                                        cssClip.right - cssClip.left,
                                        cssClip.bottom - cssClip.top
                                    ]
                                ]);
                            }
                            container.clip = hasParentClip(container) ? container.parent.clip.concat(clip) : clip;
                            container.backgroundClip = (container.css('overflow') !== "hidden") ? container.clip.concat([
                                container.borders.clip
                            ]) : container.clip;
                            if (isPseudoElement(container)) {
                                container.cleanDOM();
                            }
                        } else if (isTextNode(container)) {
                            container.clip = hasParentClip(container) ? container.parent.clip : [];
                        }
                        if (!isPseudoElement(container)) {
                            container.bounds = null;
                        }
                    }, this);
                };
                function hasParentClip(container) {
                    return container.parent && container.parent.clip.length;
                }
                NodeParser.prototype.asyncRenderer = function(queue, resolve, asyncTimer) {
                    asyncTimer = asyncTimer || Date.now();
                    this.paint(queue[this.renderIndex++]);
                    if (queue.length === this.renderIndex) {
                        resolve();
                    } else if (asyncTimer + 20 > Date.now()) {
                        this.asyncRenderer(queue, resolve, asyncTimer);
                    } else {
                        setTimeout(bind(function() {
                            this.asyncRenderer(queue, resolve);
                        }, this), 0);
                    }
                };
                NodeParser.prototype.createPseudoHideStyles = function(document) {
                    this.createStyles(document, '.' + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ':before { content: "" !important; display: none !important; }' + '.' + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER + ':after { content: "" !important; display: none !important; }');
                };
                NodeParser.prototype.disableAnimations = function(document) {
                    this.createStyles(document, '* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; ' + '-webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}');
                };
                NodeParser.prototype.createStyles = function(document, styles) {
                    var hidePseudoElements = document.createElement('style');
                    hidePseudoElements.innerHTML = styles;
                    document.body.appendChild(hidePseudoElements);
                };
                NodeParser.prototype.getPseudoElements = function(container) {
                    var nodes = [
                            [
                                container
                            ]
                        ];
                    if (container.node.nodeType === Node.ELEMENT_NODE) {
                        var before = this.getPseudoElement(container, ":before");
                        var after = this.getPseudoElement(container, ":after");
                        if (before) {
                            nodes.push(before);
                        }
                        if (after) {
                            nodes.push(after);
                        }
                    }
                    return flatten(nodes);
                };
                function toCamelCase(str) {
                    return str.replace(/(\-[a-z])/g, function(match) {
                        return match.toUpperCase().replace('-', '');
                    });
                }
                NodeParser.prototype.getPseudoElement = function(container, type) {
                    var style = container.computedStyle(type);
                    if (!style || !style.content || style.content === "none" || style.content === "-moz-alt-content" || style.display === "none") {
                        return null;
                    }
                    var content = stripQuotes(style.content);
                    var isImage = content.substr(0, 3) === 'url';
                    var pseudoNode = document.createElement(isImage ? 'img' : 'html2canvaspseudoelement');
                    var pseudoContainer = new PseudoElementContainer(pseudoNode, container, type);
                    for (var i = style.length - 1; i >= 0; i--) {
                        var property = toCamelCase(style.item(i));
                        pseudoNode.style[property] = style[property];
                    }
                    pseudoNode.className = PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
                    if (isImage) {
                        pseudoNode.src = parseBackgrounds(content)[0].args[0];
                        return [
                            pseudoContainer
                        ];
                    } else {
                        var text = document.createTextNode(content);
                        pseudoNode.appendChild(text);
                        return [
                            pseudoContainer,
                            new TextContainer(text, pseudoContainer)
                        ];
                    }
                };
                NodeParser.prototype.getChildren = function(parentContainer) {
                    return flatten([].filter.call(parentContainer.node.childNodes, renderableNode).map(function(node) {
                        var container = [
                                node.nodeType === Node.TEXT_NODE ? new TextContainer(node, parentContainer) : new NodeContainer(node, parentContainer)
                            ].filter(nonIgnoredElement);
                        return node.nodeType === Node.ELEMENT_NODE && container.length && node.tagName !== "TEXTAREA" ? (container[0].isElementVisible() ? container.concat(this.getChildren(container[0])) : []) : container;
                    }, this));
                };
                NodeParser.prototype.newStackingContext = function(container, hasOwnStacking) {
                    var stack = new StackingContext(hasOwnStacking, container.getOpacity(), container.node, container.parent);
                    container.cloneTo(stack);
                    var parentStack = hasOwnStacking ? stack.getParentStack(this) : stack.parent.stack;
                    parentStack.contexts.push(stack);
                    container.stack = stack;
                };
                NodeParser.prototype.createStackingContexts = function() {
                    this.nodes.forEach(function(container) {
                        if (isElement(container) && (this.isRootElement(container) || hasOpacity(container) || isPositionedForStacking(container) || this.isBodyWithTransparentRoot(container) || container.hasTransform())) {
                            this.newStackingContext(container, true);
                        } else if (isElement(container) && ((isPositioned(container) && zIndex0(container)) || isInlineBlock(container) || isFloating(container))) {
                            this.newStackingContext(container, false);
                        } else {
                            container.assignStack(container.parent.stack);
                        }
                    }, this);
                };
                NodeParser.prototype.isBodyWithTransparentRoot = function(container) {
                    return container.node.nodeName === "BODY" && container.parent.color('backgroundColor').isTransparent();
                };
                NodeParser.prototype.isRootElement = function(container) {
                    return container.parent === null;
                };
                NodeParser.prototype.sortStackingContexts = function(stack) {
                    stack.contexts.sort(zIndexSort(stack.contexts.slice(0)));
                    stack.contexts.forEach(this.sortStackingContexts, this);
                };
                NodeParser.prototype.parseTextBounds = function(container) {
                    return function(text, index, textList) {
                        if (container.parent.css("textDecoration").substr(0, 4) !== "none" || text.trim().length !== 0) {
                            if (this.support.rangeBounds && !container.parent.hasTransform()) {
                                var offset = textList.slice(0, index).join("").length;
                                return this.getRangeBounds(container.node, offset, text.length);
                            } else if (container.node && typeof (container.node.data) === "string") {
                                var replacementNode = container.node.splitText(text.length);
                                var bounds = this.getWrapperBounds(container.node, container.parent.hasTransform());
                                container.node = replacementNode;
                                return bounds;
                            }
                        } else if (!this.support.rangeBounds || container.parent.hasTransform()) {
                            container.node = container.node.splitText(text.length);
                        }
                        return {};
                    };
                };
                NodeParser.prototype.getWrapperBounds = function(node, transform) {
                    var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
                    var parent = node.parentNode,
                        backupText = node.cloneNode(true);
                    wrapper.appendChild(node.cloneNode(true));
                    parent.replaceChild(wrapper, node);
                    var bounds = transform ? offsetBounds(wrapper) : getBounds(wrapper);
                    parent.replaceChild(backupText, wrapper);
                    return bounds;
                };
                NodeParser.prototype.getRangeBounds = function(node, offset, length) {
                    var range = this.range || (this.range = node.ownerDocument.createRange());
                    range.setStart(node, offset);
                    range.setEnd(node, offset + length);
                    return range.getBoundingClientRect();
                };
                function ClearTransform() {}
                NodeParser.prototype.parse = function(stack) {
                    // http://www.w3.org/TR/CSS21/visuren.html#z-index
                    var negativeZindex = stack.contexts.filter(negativeZIndex);
                    // 2. the child stacking contexts with negative stack levels (most negative first).
                    var descendantElements = stack.children.filter(isElement);
                    var descendantNonFloats = descendantElements.filter(not(isFloating));
                    var nonInlineNonPositionedDescendants = descendantNonFloats.filter(not(isPositioned)).filter(not(inlineLevel));
                    // 3 the in-flow, non-inline-level, non-positioned descendants.
                    var nonPositionedFloats = descendantElements.filter(not(isPositioned)).filter(isFloating);
                    // 4. the non-positioned floats.
                    var inFlow = descendantNonFloats.filter(not(isPositioned)).filter(inlineLevel);
                    // 5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
                    var stackLevel0 = stack.contexts.concat(descendantNonFloats.filter(isPositioned)).filter(zIndex0);
                    // 6. the child stacking contexts with stack level 0 and the positioned descendants with stack level 0.
                    var text = stack.children.filter(isTextNode).filter(hasText);
                    var positiveZindex = stack.contexts.filter(positiveZIndex);
                    // 7. the child stacking contexts with positive stack levels (least positive first).
                    negativeZindex.concat(nonInlineNonPositionedDescendants).concat(nonPositionedFloats).concat(inFlow).concat(stackLevel0).concat(text).concat(positiveZindex).forEach(function(container) {
                        this.renderQueue.push(container);
                        if (isStackingContext(container)) {
                            this.parse(container);
                            this.renderQueue.push(new ClearTransform());
                        }
                    }, this);
                };
                NodeParser.prototype.paint = function(container) {
                    try {
                        if (container instanceof ClearTransform) {
                            this.renderer.ctx.restore();
                        } else if (isTextNode(container)) {
                            if (isPseudoElement(container.parent)) {
                                container.parent.appendToDOM();
                            }
                            this.paintText(container);
                            if (isPseudoElement(container.parent)) {
                                container.parent.cleanDOM();
                            }
                        } else {
                            this.paintNode(container);
                        }
                    } catch (e) {
                        log(e);
                        if (this.options.strict) {
                            throw e;
                        }
                    }
                };
                NodeParser.prototype.paintNode = function(container) {
                    if (isStackingContext(container)) {
                        this.renderer.setOpacity(container.opacity);
                        this.renderer.ctx.save();
                        if (container.hasTransform()) {
                            this.renderer.setTransform(container.parseTransform());
                        }
                    }
                    if (container.node.nodeName === "INPUT" && container.node.type === "checkbox") {
                        this.paintCheckbox(container);
                    } else if (container.node.nodeName === "INPUT" && container.node.type === "radio") {
                        this.paintRadio(container);
                    } else {
                        this.paintElement(container);
                    }
                };
                NodeParser.prototype.paintElement = function(container) {
                    var bounds = container.parseBounds();
                    this.renderer.clip(container.backgroundClip, function() {
                        this.renderer.renderBackground(container, bounds, container.borders.borders.map(getWidth));
                    }, this);
                    this.renderer.clip(container.clip, function() {
                        this.renderer.renderBorders(container.borders.borders);
                    }, this);
                    this.renderer.clip(container.backgroundClip, function() {
                        switch (container.node.nodeName) {
                            case "svg":
                            case "IFRAME":
                                var imgContainer = this.images.get(container.node);
                                if (imgContainer) {
                                    this.renderer.renderImage(container, bounds, container.borders, imgContainer);
                                } else {
                                    log("Error loading <" + container.node.nodeName + ">", container.node);
                                };
                                break;
                            case "IMG":
                                var imageContainer = this.images.get(container.node.src);
                                if (imageContainer) {
                                    this.renderer.renderImage(container, bounds, container.borders, imageContainer);
                                } else {
                                    log("Error loading <img>", container.node.src);
                                };
                                break;
                            case "CANVAS":
                                this.renderer.renderImage(container, bounds, container.borders, {
                                    image: container.node
                                });
                                break;
                            case "SELECT":
                            case "INPUT":
                            case "TEXTAREA":
                                this.paintFormValue(container);
                                break;
                        }
                    }, this);
                };
                NodeParser.prototype.paintCheckbox = function(container) {
                    var b = container.parseBounds();
                    var size = Math.min(b.width, b.height);
                    var bounds = {
                            width: size - 1,
                            height: size - 1,
                            top: b.top,
                            left: b.left
                        };
                    var r = [
                            3,
                            3
                        ];
                    var radius = [
                            r,
                            r,
                            r,
                            r
                        ];
                    var borders = [
                            1,
                            1,
                            1,
                            1
                        ].map(function(w) {
                            return {
                                color: new Color('#A5A5A5'),
                                width: w
                            };
                        });
                    var borderPoints = calculateCurvePoints(bounds, radius, borders);
                    this.renderer.clip(container.backgroundClip, function() {
                        this.renderer.rectangle(bounds.left + 1, bounds.top + 1, bounds.width - 2, bounds.height - 2, new Color("#DEDEDE"));
                        this.renderer.renderBorders(calculateBorders(borders, bounds, borderPoints, radius));
                        if (container.node.checked) {
                            this.renderer.font(new Color('#424242'), 'normal', 'normal', 'bold', (size - 3) + "px", 'arial');
                            this.renderer.text("✔", bounds.left + size / 6, bounds.top + size - 1);
                        }
                    }, this);
                };
                NodeParser.prototype.paintRadio = function(container) {
                    var bounds = container.parseBounds();
                    var size = Math.min(bounds.width, bounds.height) - 2;
                    this.renderer.clip(container.backgroundClip, function() {
                        this.renderer.circleStroke(bounds.left + 1, bounds.top + 1, size, new Color('#DEDEDE'), 1, new Color('#A5A5A5'));
                        if (container.node.checked) {
                            this.renderer.circle(Math.ceil(bounds.left + size / 4) + 1, Math.ceil(bounds.top + size / 4) + 1, Math.floor(size / 2), new Color('#424242'));
                        }
                    }, this);
                };
                NodeParser.prototype.paintFormValue = function(container) {
                    var value = container.getValue();
                    if (value.length > 0) {
                        var document = container.node.ownerDocument;
                        var wrapper = document.createElement('html2canvaswrapper');
                        var properties = [
                                'lineHeight',
                                'textAlign',
                                'fontFamily',
                                'fontWeight',
                                'fontSize',
                                'color',
                                'paddingLeft',
                                'paddingTop',
                                'paddingRight',
                                'paddingBottom',
                                'width',
                                'height',
                                'borderLeftStyle',
                                'borderTopStyle',
                                'borderLeftWidth',
                                'borderTopWidth',
                                'boxSizing',
                                'whiteSpace',
                                'wordWrap'
                            ];
                        properties.forEach(function(property) {
                            try {
                                wrapper.style[property] = container.css(property);
                            } catch (e) {
                                // Older IE has issues with "border"
                                log("html2canvas: Parse: Exception caught in renderFormValue: " + e.message);
                            }
                        });
                        var bounds = container.parseBounds();
                        wrapper.style.position = "fixed";
                        wrapper.style.left = bounds.left + "px";
                        wrapper.style.top = bounds.top + "px";
                        wrapper.textContent = value;
                        document.body.appendChild(wrapper);
                        this.paintText(new TextContainer(wrapper.firstChild, container));
                        document.body.removeChild(wrapper);
                    }
                };
                NodeParser.prototype.paintText = function(container) {
                    container.applyTextTransform();
                    var characters = punycode.ucs2.decode(container.node.data);
                    var textList = (!this.options.letterRendering || noLetterSpacing(container)) && !hasUnicode(container.node.data) ? getWords(characters) : characters.map(function(character) {
                            return punycode.ucs2.encode([
                                character
                            ]);
                        });
                    var weight = container.parent.fontWeight();
                    var size = container.parent.css('fontSize');
                    var family = container.parent.css('fontFamily');
                    var shadows = container.parent.parseTextShadows();
                    this.renderer.font(container.parent.color('color'), container.parent.css('fontStyle'), container.parent.css('fontVariant'), weight, size, family);
                    if (shadows.length) {
                        // TODO: support multiple text shadows
                        this.renderer.fontShadow(shadows[0].color, shadows[0].offsetX, shadows[0].offsetY, shadows[0].blur);
                    } else {
                        this.renderer.clearShadow();
                    }
                    this.renderer.clip(container.parent.clip, function() {
                        textList.map(this.parseTextBounds(container), this).forEach(function(bounds, index) {
                            if (bounds) {
                                this.renderer.text(textList[index], bounds.left, bounds.bottom);
                                this.renderTextDecoration(container.parent, bounds, this.fontMetrics.getMetrics(family, size));
                            }
                        }, this);
                    }, this);
                };
                NodeParser.prototype.renderTextDecoration = function(container, bounds, metrics) {
                    switch (container.css("textDecoration").split(" ")[0]) {
                        case "underline":
                            // Draws a line at the baseline of the font
                            // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
                            this.renderer.rectangle(bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, container.color("color"));
                            break;
                        case "overline":
                            this.renderer.rectangle(bounds.left, Math.round(bounds.top), bounds.width, 1, container.color("color"));
                            break;
                        case "line-through":
                            // TODO try and find exact position for line-through
                            this.renderer.rectangle(bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, container.color("color"));
                            break;
                    }
                };
                var borderColorTransforms = {
                        inset: [
                            [
                                "darken",
                                0.6
                            ],
                            [
                                "darken",
                                0.1
                            ],
                            [
                                "darken",
                                0.1
                            ],
                            [
                                "darken",
                                0.6
                            ]
                        ]
                    };
                NodeParser.prototype.parseBorders = function(container) {
                    var nodeBounds = container.parseBounds();
                    var radius = getBorderRadiusData(container);
                    var borders = [
                            "Top",
                            "Right",
                            "Bottom",
                            "Left"
                        ].map(function(side, index) {
                            var style = container.css('border' + side + 'Style');
                            var color = container.color('border' + side + 'Color');
                            if (style === "inset" && color.isBlack()) {
                                color = new Color([
                                    255,
                                    255,
                                    255,
                                    color.a
                                ]);
                            }
                            // this is wrong, but
                            var colorTransform = borderColorTransforms[style] ? borderColorTransforms[style][index] : null;
                            return {
                                width: container.cssInt('border' + side + 'Width'),
                                color: colorTransform ? color[colorTransform[0]](colorTransform[1]) : color,
                                args: null
                            };
                        });
                    var borderPoints = calculateCurvePoints(nodeBounds, radius, borders);
                    return {
                        clip: this.parseBackgroundClip(container, borderPoints, borders, radius, nodeBounds),
                        borders: calculateBorders(borders, nodeBounds, borderPoints, radius)
                    };
                };
                function calculateBorders(borders, nodeBounds, borderPoints, radius) {
                    return borders.map(function(border, borderSide) {
                        if (border.width > 0) {
                            var bx = nodeBounds.left;
                            var by = nodeBounds.top;
                            var bw = nodeBounds.width;
                            var bh = nodeBounds.height - (borders[2].width);
                            switch (borderSide) {
                                case 0:
                                    // top border
                                    bh = borders[0].width;
                                    border.args = drawSide({
                                        c1: [
                                            bx,
                                            by
                                        ],
                                        c2: [
                                            bx + bw,
                                            by
                                        ],
                                        c3: [
                                            bx + bw - borders[1].width,
                                            by + bh
                                        ],
                                        c4: [
                                            bx + borders[3].width,
                                            by + bh
                                        ]
                                    }, radius[0], radius[1], borderPoints.topLeftOuter, borderPoints.topLeftInner, borderPoints.topRightOuter, borderPoints.topRightInner);
                                    break;
                                case 1:
                                    // right border
                                    bx = nodeBounds.left + nodeBounds.width - (borders[1].width);
                                    bw = borders[1].width;
                                    border.args = drawSide({
                                        c1: [
                                            bx + bw,
                                            by
                                        ],
                                        c2: [
                                            bx + bw,
                                            by + bh + borders[2].width
                                        ],
                                        c3: [
                                            bx,
                                            by + bh
                                        ],
                                        c4: [
                                            bx,
                                            by + borders[0].width
                                        ]
                                    }, radius[1], radius[2], borderPoints.topRightOuter, borderPoints.topRightInner, borderPoints.bottomRightOuter, borderPoints.bottomRightInner);
                                    break;
                                case 2:
                                    // bottom border
                                    by = (by + nodeBounds.height) - (borders[2].width);
                                    bh = borders[2].width;
                                    border.args = drawSide({
                                        c1: [
                                            bx + bw,
                                            by + bh
                                        ],
                                        c2: [
                                            bx,
                                            by + bh
                                        ],
                                        c3: [
                                            bx + borders[3].width,
                                            by
                                        ],
                                        c4: [
                                            bx + bw - borders[3].width,
                                            by
                                        ]
                                    }, radius[2], radius[3], borderPoints.bottomRightOuter, borderPoints.bottomRightInner, borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner);
                                    break;
                                case 3:
                                    // left border
                                    bw = borders[3].width;
                                    border.args = drawSide({
                                        c1: [
                                            bx,
                                            by + bh + borders[2].width
                                        ],
                                        c2: [
                                            bx,
                                            by
                                        ],
                                        c3: [
                                            bx + bw,
                                            by + borders[0].width
                                        ],
                                        c4: [
                                            bx + bw,
                                            by + bh
                                        ]
                                    }, radius[3], radius[0], borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner, borderPoints.topLeftOuter, borderPoints.topLeftInner);
                                    break;
                            }
                        }
                        return border;
                    });
                }
                NodeParser.prototype.parseBackgroundClip = function(container, borderPoints, borders, radius, bounds) {
                    var backgroundClip = container.css('backgroundClip'),
                        borderArgs = [];
                    switch (backgroundClip) {
                        case "content-box":
                        case "padding-box":
                            parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftInner, borderPoints.topRightInner, bounds.left + borders[3].width, bounds.top + borders[0].width);
                            parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightInner, borderPoints.bottomRightInner, bounds.left + bounds.width - borders[1].width, bounds.top + borders[0].width);
                            parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightInner, borderPoints.bottomLeftInner, bounds.left + bounds.width - borders[1].width, bounds.top + bounds.height - borders[2].width);
                            parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftInner, borderPoints.topLeftInner, bounds.left + borders[3].width, bounds.top + bounds.height - borders[2].width);
                            break;
                        default:
                            parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftOuter, borderPoints.topRightOuter, bounds.left, bounds.top);
                            parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightOuter, borderPoints.bottomRightOuter, bounds.left + bounds.width, bounds.top);
                            parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightOuter, borderPoints.bottomLeftOuter, bounds.left + bounds.width, bounds.top + bounds.height);
                            parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftOuter, borderPoints.topLeftOuter, bounds.left, bounds.top + bounds.height);
                            break;
                    }
                    return borderArgs;
                };
                function getCurvePoints(x, y, r1, r2) {
                    var kappa = 4 * ((Math.sqrt(2) - 1) / 3);
                    var ox = (r1) * kappa,
                        // control point offset horizontal
                        oy = (r2) * kappa,
                        // control point offset vertical
                        xm = x + r1,
                        // x-middle
                        ym = y + r2;
                    // y-middle
                    return {
                        topLeft: bezierCurve({
                            x: x,
                            y: ym
                        }, {
                            x: x,
                            y: ym - oy
                        }, {
                            x: xm - ox,
                            y: y
                        }, {
                            x: xm,
                            y: y
                        }),
                        topRight: bezierCurve({
                            x: x,
                            y: y
                        }, {
                            x: x + ox,
                            y: y
                        }, {
                            x: xm,
                            y: ym - oy
                        }, {
                            x: xm,
                            y: ym
                        }),
                        bottomRight: bezierCurve({
                            x: xm,
                            y: y
                        }, {
                            x: xm,
                            y: y + oy
                        }, {
                            x: x + ox,
                            y: ym
                        }, {
                            x: x,
                            y: ym
                        }),
                        bottomLeft: bezierCurve({
                            x: xm,
                            y: ym
                        }, {
                            x: xm - ox,
                            y: ym
                        }, {
                            x: x,
                            y: y + oy
                        }, {
                            x: x,
                            y: y
                        })
                    };
                }
                function calculateCurvePoints(bounds, borderRadius, borders) {
                    var x = bounds.left,
                        y = bounds.top,
                        width = bounds.width,
                        height = bounds.height,
                        tlh = borderRadius[0][0] < width / 2 ? borderRadius[0][0] : width / 2,
                        tlv = borderRadius[0][1] < height / 2 ? borderRadius[0][1] : height / 2,
                        trh = borderRadius[1][0] < width / 2 ? borderRadius[1][0] : width / 2,
                        trv = borderRadius[1][1] < height / 2 ? borderRadius[1][1] : height / 2,
                        brh = borderRadius[2][0] < width / 2 ? borderRadius[2][0] : width / 2,
                        brv = borderRadius[2][1] < height / 2 ? borderRadius[2][1] : height / 2,
                        blh = borderRadius[3][0] < width / 2 ? borderRadius[3][0] : width / 2,
                        blv = borderRadius[3][1] < height / 2 ? borderRadius[3][1] : height / 2;
                    var topWidth = width - trh,
                        rightHeight = height - brv,
                        bottomWidth = width - brh,
                        leftHeight = height - blv;
                    return {
                        topLeftOuter: getCurvePoints(x, y, tlh, tlv).topLeft.subdivide(0.5),
                        topLeftInner: getCurvePoints(x + borders[3].width, y + borders[0].width, Math.max(0, tlh - borders[3].width), Math.max(0, tlv - borders[0].width)).topLeft.subdivide(0.5),
                        topRightOuter: getCurvePoints(x + topWidth, y, trh, trv).topRight.subdivide(0.5),
                        topRightInner: getCurvePoints(x + Math.min(topWidth, width + borders[3].width), y + borders[0].width, (topWidth > width + borders[3].width) ? 0 : trh - borders[3].width, trv - borders[0].width).topRight.subdivide(0.5),
                        bottomRightOuter: getCurvePoints(x + bottomWidth, y + rightHeight, brh, brv).bottomRight.subdivide(0.5),
                        bottomRightInner: getCurvePoints(x + Math.min(bottomWidth, width - borders[3].width), y + Math.min(rightHeight, height + borders[0].width), Math.max(0, brh - borders[1].width), brv - borders[2].width).bottomRight.subdivide(0.5),
                        bottomLeftOuter: getCurvePoints(x, y + leftHeight, blh, blv).bottomLeft.subdivide(0.5),
                        bottomLeftInner: getCurvePoints(x + borders[3].width, y + leftHeight, Math.max(0, blh - borders[3].width), blv - borders[2].width).bottomLeft.subdivide(0.5)
                    };
                }
                function bezierCurve(start, startControl, endControl, end) {
                    var lerp = function(a, b, t) {
                            return {
                                x: a.x + (b.x - a.x) * t,
                                y: a.y + (b.y - a.y) * t
                            };
                        };
                    return {
                        start: start,
                        startControl: startControl,
                        endControl: endControl,
                        end: end,
                        subdivide: function(t) {
                            var ab = lerp(start, startControl, t),
                                bc = lerp(startControl, endControl, t),
                                cd = lerp(endControl, end, t),
                                abbc = lerp(ab, bc, t),
                                bccd = lerp(bc, cd, t),
                                dest = lerp(abbc, bccd, t);
                            return [
                                bezierCurve(start, ab, abbc, dest),
                                bezierCurve(dest, bccd, cd, end)
                            ];
                        },
                        curveTo: function(borderArgs) {
                            borderArgs.push([
                                "bezierCurve",
                                startControl.x,
                                startControl.y,
                                endControl.x,
                                endControl.y,
                                end.x,
                                end.y
                            ]);
                        },
                        curveToReversed: function(borderArgs) {
                            borderArgs.push([
                                "bezierCurve",
                                endControl.x,
                                endControl.y,
                                startControl.x,
                                startControl.y,
                                start.x,
                                start.y
                            ]);
                        }
                    };
                }
                function drawSide(borderData, radius1, radius2, outer1, inner1, outer2, inner2) {
                    var borderArgs = [];
                    if (radius1[0] > 0 || radius1[1] > 0) {
                        borderArgs.push([
                            "line",
                            outer1[1].start.x,
                            outer1[1].start.y
                        ]);
                        outer1[1].curveTo(borderArgs);
                    } else {
                        borderArgs.push([
                            "line",
                            borderData.c1[0],
                            borderData.c1[1]
                        ]);
                    }
                    if (radius2[0] > 0 || radius2[1] > 0) {
                        borderArgs.push([
                            "line",
                            outer2[0].start.x,
                            outer2[0].start.y
                        ]);
                        outer2[0].curveTo(borderArgs);
                        borderArgs.push([
                            "line",
                            inner2[0].end.x,
                            inner2[0].end.y
                        ]);
                        inner2[0].curveToReversed(borderArgs);
                    } else {
                        borderArgs.push([
                            "line",
                            borderData.c2[0],
                            borderData.c2[1]
                        ]);
                        borderArgs.push([
                            "line",
                            borderData.c3[0],
                            borderData.c3[1]
                        ]);
                    }
                    if (radius1[0] > 0 || radius1[1] > 0) {
                        borderArgs.push([
                            "line",
                            inner1[1].end.x,
                            inner1[1].end.y
                        ]);
                        inner1[1].curveToReversed(borderArgs);
                    } else {
                        borderArgs.push([
                            "line",
                            borderData.c4[0],
                            borderData.c4[1]
                        ]);
                    }
                    return borderArgs;
                }
                function parseCorner(borderArgs, radius1, radius2, corner1, corner2, x, y) {
                    if (radius1[0] > 0 || radius1[1] > 0) {
                        borderArgs.push([
                            "line",
                            corner1[0].start.x,
                            corner1[0].start.y
                        ]);
                        corner1[0].curveTo(borderArgs);
                        corner1[1].curveTo(borderArgs);
                    } else {
                        borderArgs.push([
                            "line",
                            x,
                            y
                        ]);
                    }
                    if (radius2[0] > 0 || radius2[1] > 0) {
                        borderArgs.push([
                            "line",
                            corner2[0].start.x,
                            corner2[0].start.y
                        ]);
                    }
                }
                function negativeZIndex(container) {
                    return container.cssInt("zIndex") < 0;
                }
                function positiveZIndex(container) {
                    return container.cssInt("zIndex") > 0;
                }
                function zIndex0(container) {
                    return container.cssInt("zIndex") === 0;
                }
                function inlineLevel(container) {
                    return [
                        "inline",
                        "inline-block",
                        "inline-table"
                    ].indexOf(container.css("display")) !== -1;
                }
                function isStackingContext(container) {
                    return (container instanceof StackingContext);
                }
                function hasText(container) {
                    return container.node.data.trim().length > 0;
                }
                function noLetterSpacing(container) {
                    return (/^(normal|none|0px)$/.test(container.parent.css("letterSpacing")));
                }
                function getBorderRadiusData(container) {
                    return [
                        "TopLeft",
                        "TopRight",
                        "BottomRight",
                        "BottomLeft"
                    ].map(function(side) {
                        var value = container.css('border' + side + 'Radius');
                        var arr = value.split(" ");
                        if (arr.length <= 1) {
                            arr[1] = arr[0];
                        }
                        return arr.map(asInt);
                    });
                }
                function renderableNode(node) {
                    return (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE);
                }
                function isPositionedForStacking(container) {
                    var position = container.css("position");
                    var zIndex = ([
                            "absolute",
                            "relative",
                            "fixed"
                        ].indexOf(position) !== -1) ? container.css("zIndex") : "auto";
                    return zIndex !== "auto";
                }
                function isPositioned(container) {
                    return container.css("position") !== "static";
                }
                function isFloating(container) {
                    return container.css("float") !== "none";
                }
                function isInlineBlock(container) {
                    return [
                        "inline-block",
                        "inline-table"
                    ].indexOf(container.css("display")) !== -1;
                }
                function not(callback) {
                    var context = this;
                    return function() {
                        return !callback.apply(context, arguments);
                    };
                }
                function isElement(container) {
                    return container.node.nodeType === Node.ELEMENT_NODE;
                }
                function isPseudoElement(container) {
                    return container.isPseudoElement === true;
                }
                function isTextNode(container) {
                    return container.node.nodeType === Node.TEXT_NODE;
                }
                function zIndexSort(contexts) {
                    return function(a, b) {
                        return (a.cssInt("zIndex") + (contexts.indexOf(a) / contexts.length)) - (b.cssInt("zIndex") + (contexts.indexOf(b) / contexts.length));
                    };
                }
                function hasOpacity(container) {
                    return container.getOpacity() < 1;
                }
                function asInt(value) {
                    return parseInt(value, 10);
                }
                function getWidth(border) {
                    return border.width;
                }
                function nonIgnoredElement(nodeContainer) {
                    return (nodeContainer.node.nodeType !== Node.ELEMENT_NODE || [
                        "SCRIPT",
                        "HEAD",
                        "TITLE",
                        "OBJECT",
                        "BR",
                        "OPTION"
                    ].indexOf(nodeContainer.node.nodeName) === -1);
                }
                function flatten(arrays) {
                    return [].concat.apply([], arrays);
                }
                function stripQuotes(content) {
                    var first = content.substr(0, 1);
                    return (first === content.substr(content.length - 1) && first.match(/'|"/)) ? content.substr(1, content.length - 2) : content;
                }
                function getWords(characters) {
                    var words = [],
                        i = 0,
                        onWordBoundary = false,
                        word;
                    while (characters.length) {
                        if (isWordBoundary(characters[i]) === onWordBoundary) {
                            word = characters.splice(0, i);
                            if (word.length) {
                                words.push(punycode.ucs2.encode(word));
                            }
                            onWordBoundary = !onWordBoundary;
                            i = 0;
                        } else {
                            i++;
                        }
                        if (i >= characters.length) {
                            word = characters.splice(0, i);
                            if (word.length) {
                                words.push(punycode.ucs2.encode(word));
                            }
                        }
                    }
                    return words;
                }
                function isWordBoundary(characterCode) {
                    return [
                        32,
                        // <space>
                        13,
                        // \r
                        10,
                        // \n
                        9,
                        // \t
                        45
                    ].// -
                    indexOf(characterCode) !== -1;
                }
                function hasUnicode(string) {
                    return (/[^\u0000-\u00ff]/).test(string);
                }
                module.exports = NodeParser;
            },
            {
                "./color": 3,
                "./fontmetrics": 7,
                "./log": 13,
                "./nodecontainer": 14,
                "./pseudoelementcontainer": 18,
                "./stackingcontext": 21,
                "./textcontainer": 25,
                "./utils": 26,
                "punycode": 1
            }
        ],
        16: [
            function(_dereq_, module, exports) {
                var XHR = _dereq_('./xhr');
                var utils = _dereq_('./utils');
                var log = _dereq_('./log');
                var createWindowClone = _dereq_('./clone');
                var decode64 = utils.decode64;
                function Proxy(src, proxyUrl, document) {
                    var supportsCORS = ('withCredentials' in new XMLHttpRequest());
                    if (!proxyUrl) {
                        return Promise.reject("No proxy configured");
                    }
                    var callback = createCallback(supportsCORS);
                    var url = createProxyUrl(proxyUrl, src, callback);
                    return supportsCORS ? XHR(url) : (jsonp(document, url, callback).then(function(response) {
                        return decode64(response.content);
                    }));
                }
                var proxyCount = 0;
                function ProxyURL(src, proxyUrl, document) {
                    var supportsCORSImage = ('crossOrigin' in new Image());
                    var callback = createCallback(supportsCORSImage);
                    var url = createProxyUrl(proxyUrl, src, callback);
                    return (supportsCORSImage ? Promise.resolve(url) : jsonp(document, url, callback).then(function(response) {
                        return "data:" + response.type + ";base64," + response.content;
                    }));
                }
                function jsonp(document, url, callback) {
                    return new Promise(function(resolve, reject) {
                        var s = document.createElement("script");
                        var cleanup = function() {
                                delete window.html2canvas.proxy[callback];
                                document.body.removeChild(s);
                            };
                        window.html2canvas.proxy[callback] = function(response) {
                            cleanup();
                            resolve(response);
                        };
                        s.src = url;
                        s.onerror = function(e) {
                            cleanup();
                            reject(e);
                        };
                        document.body.appendChild(s);
                    });
                }
                function createCallback(useCORS) {
                    return !useCORS ? "html2canvas_" + Date.now() + "_" + (++proxyCount) + "_" + Math.round(Math.random() * 100000) : "";
                }
                function createProxyUrl(proxyUrl, src, callback) {
                    return proxyUrl + "?url=" + encodeURIComponent(src) + (callback.length ? "&callback=html2canvas.proxy." + callback : "");
                }
                function documentFromHTML(src) {
                    return function(html) {
                        var parser = new DOMParser(),
                            doc;
                        try {
                            doc = parser.parseFromString(html, "text/html");
                        } catch (e) {
                            log("DOMParser not supported, falling back to createHTMLDocument");
                            doc = document.implementation.createHTMLDocument("");
                            try {
                                doc.open();
                                doc.write(html);
                                doc.close();
                            } catch (ee) {
                                log("createHTMLDocument write not supported, falling back to document.body.innerHTML");
                                doc.body.innerHTML = html;
                            }
                        }
                        // ie9 doesnt support writing to documentElement
                        var b = doc.querySelector("base");
                        if (!b || !b.href.host) {
                            var base = doc.createElement("base");
                            base.href = src;
                            doc.head.insertBefore(base, doc.head.firstChild);
                        }
                        return doc;
                    };
                }
                function loadUrlDocument(src, proxy, document, width, height, options) {
                    return new Proxy(src, proxy, window.document).then(documentFromHTML(src)).then(function(doc) {
                        return createWindowClone(doc, document, width, height, options, 0, 0);
                    });
                }
                exports.Proxy = Proxy;
                exports.ProxyURL = ProxyURL;
                exports.loadUrlDocument = loadUrlDocument;
            },
            {
                "./clone": 2,
                "./log": 13,
                "./utils": 26,
                "./xhr": 28
            }
        ],
        17: [
            function(_dereq_, module, exports) {
                var ProxyURL = _dereq_('./proxy').ProxyURL;
                function ProxyImageContainer(src, proxy) {
                    var link = document.createElement("a");
                    link.href = src;
                    src = link.href;
                    this.src = src;
                    this.image = new Image();
                    var self = this;
                    this.promise = new Promise(function(resolve, reject) {
                        self.image.crossOrigin = "Anonymous";
                        self.image.onload = resolve;
                        self.image.onerror = reject;
                        new ProxyURL(src, proxy, document).then(function(url) {
                            self.image.src = url;
                        })['catch'](reject);
                    });
                }
                module.exports = ProxyImageContainer;
            },
            {
                "./proxy": 16
            }
        ],
        18: [
            function(_dereq_, module, exports) {
                var NodeContainer = _dereq_('./nodecontainer');
                function PseudoElementContainer(node, parent, type) {
                    NodeContainer.call(this, node, parent);
                    this.isPseudoElement = true;
                    this.before = type === ":before";
                }
                PseudoElementContainer.prototype.cloneTo = function(stack) {
                    PseudoElementContainer.prototype.cloneTo.call(this, stack);
                    stack.isPseudoElement = true;
                    stack.before = this.before;
                };
                PseudoElementContainer.prototype = Object.create(NodeContainer.prototype);
                PseudoElementContainer.prototype.appendToDOM = function() {
                    if (this.before) {
                        this.parent.node.insertBefore(this.node, this.parent.node.firstChild);
                    } else {
                        this.parent.node.appendChild(this.node);
                    }
                    this.parent.node.className += " " + this.getHideClass();
                };
                PseudoElementContainer.prototype.cleanDOM = function() {
                    this.node.parentNode.removeChild(this.node);
                    this.parent.node.className = this.parent.node.className.replace(this.getHideClass(), "");
                };
                PseudoElementContainer.prototype.getHideClass = function() {
                    return this["PSEUDO_HIDE_ELEMENT_CLASS_" + (this.before ? "BEFORE" : "AFTER")];
                };
                PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before";
                PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after";
                module.exports = PseudoElementContainer;
            },
            {
                "./nodecontainer": 14
            }
        ],
        19: [
            function(_dereq_, module, exports) {
                var log = _dereq_('./log');
                function Renderer(width, height, images, options, document) {
                    this.width = width;
                    this.height = height;
                    this.images = images;
                    this.options = options;
                    this.document = document;
                }
                Renderer.prototype.renderImage = function(container, bounds, borderData, imageContainer) {
                    var paddingLeft = container.cssInt('paddingLeft'),
                        paddingTop = container.cssInt('paddingTop'),
                        paddingRight = container.cssInt('paddingRight'),
                        paddingBottom = container.cssInt('paddingBottom'),
                        borders = borderData.borders;
                    var width = bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight);
                    var height = bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom);
                    this.drawImage(imageContainer, 0, 0, imageContainer.image.width || width, imageContainer.image.height || height, bounds.left + paddingLeft + borders[3].width, bounds.top + paddingTop + borders[0].width, width, height);
                };
                Renderer.prototype.renderBackground = function(container, bounds, borderData) {
                    if (bounds.height > 0 && bounds.width > 0) {
                        this.renderBackgroundColor(container, bounds);
                        this.renderBackgroundImage(container, bounds, borderData);
                    }
                };
                Renderer.prototype.renderBackgroundColor = function(container, bounds) {
                    var color = container.color("backgroundColor");
                    if (!color.isTransparent()) {
                        this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, color);
                    }
                };
                Renderer.prototype.renderBorders = function(borders) {
                    borders.forEach(this.renderBorder, this);
                };
                Renderer.prototype.renderBorder = function(data) {
                    if (!data.color.isTransparent() && data.args !== null) {
                        this.drawShape(data.args, data.color);
                    }
                };
                Renderer.prototype.renderBackgroundImage = function(container, bounds, borderData) {
                    var backgroundImages = container.parseBackgroundImages();
                    backgroundImages.reverse().forEach(function(backgroundImage, index, arr) {
                        switch (backgroundImage.method) {
                            case "url":
                                var image = this.images.get(backgroundImage.args[0]);
                                if (image) {
                                    this.renderBackgroundRepeating(container, bounds, image, arr.length - (index + 1), borderData);
                                } else {
                                    log("Error loading background-image", backgroundImage.args[0]);
                                };
                                break;
                            case "linear-gradient":
                            case "gradient":
                                var gradientImage = this.images.get(backgroundImage.value);
                                if (gradientImage) {
                                    this.renderBackgroundGradient(gradientImage, bounds, borderData);
                                } else {
                                    log("Error loading background-image", backgroundImage.args[0]);
                                };
                                break;
                            case "none":
                                break;
                            default:
                                log("Unknown background-image type", backgroundImage.args[0]);
                        }
                    }, this);
                };
                Renderer.prototype.renderBackgroundRepeating = function(container, bounds, imageContainer, index, borderData) {
                    var size = container.parseBackgroundSize(bounds, imageContainer.image, index);
                    var position = container.parseBackgroundPosition(bounds, imageContainer.image, index, size);
                    var repeat = container.parseBackgroundRepeat(index);
                    switch (repeat) {
                        case "repeat-x":
                        case "repeat no-repeat":
                            this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + borderData[3], bounds.top + position.top + borderData[0], 99999, size.height, borderData);
                            break;
                        case "repeat-y":
                        case "no-repeat repeat":
                            this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + borderData[0], size.width, 99999, borderData);
                            break;
                        case "no-repeat":
                            this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + position.top + borderData[0], size.width, size.height, borderData);
                            break;
                        default:
                            this.renderBackgroundRepeat(imageContainer, position, size, {
                                top: bounds.top,
                                left: bounds.left
                            }, borderData[3], borderData[0]);
                            break;
                    }
                };
                module.exports = Renderer;
            },
            {
                "./log": 13
            }
        ],
        20: [
            function(_dereq_, module, exports) {
                var Renderer = _dereq_('../renderer');
                var LinearGradientContainer = _dereq_('../lineargradientcontainer');
                var log = _dereq_('../log');
                function CanvasRenderer(width, height) {
                    Renderer.apply(this, arguments);
                    this.canvas = this.options.canvas || this.document.createElement("canvas");
                    if (!this.options.canvas) {
                        this.canvas.width = width;
                        this.canvas.height = height;
                    }
                    this.ctx = this.canvas.getContext("2d");
                    this.taintCtx = this.document.createElement("canvas").getContext("2d");
                    this.ctx.textBaseline = "bottom";
                    this.variables = {};
                    log("Initialized CanvasRenderer with size", width, "x", height);
                }
                CanvasRenderer.prototype = Object.create(Renderer.prototype);
                CanvasRenderer.prototype.setFillStyle = function(fillStyle) {
                    this.ctx.fillStyle = typeof (fillStyle) === "object" && !!fillStyle.isColor ? fillStyle.toString() : fillStyle;
                    return this.ctx;
                };
                CanvasRenderer.prototype.rectangle = function(left, top, width, height, color) {
                    this.setFillStyle(color).fillRect(left, top, width, height);
                };
                CanvasRenderer.prototype.circle = function(left, top, size, color) {
                    this.setFillStyle(color);
                    this.ctx.beginPath();
                    this.ctx.arc(left + size / 2, top + size / 2, size / 2, 0, Math.PI * 2, true);
                    this.ctx.closePath();
                    this.ctx.fill();
                };
                CanvasRenderer.prototype.circleStroke = function(left, top, size, color, stroke, strokeColor) {
                    this.circle(left, top, size, color);
                    this.ctx.strokeStyle = strokeColor.toString();
                    this.ctx.stroke();
                };
                CanvasRenderer.prototype.drawShape = function(shape, color) {
                    this.shape(shape);
                    this.setFillStyle(color).fill();
                };
                CanvasRenderer.prototype.taints = function(imageContainer) {
                    if (imageContainer.tainted === null) {
                        this.taintCtx.drawImage(imageContainer.image, 0, 0);
                        try {
                            this.taintCtx.getImageData(0, 0, 1, 1);
                            imageContainer.tainted = false;
                        } catch (e) {
                            this.taintCtx = document.createElement("canvas").getContext("2d");
                            imageContainer.tainted = true;
                        }
                    }
                    return imageContainer.tainted;
                };
                CanvasRenderer.prototype.drawImage = function(imageContainer, sx, sy, sw, sh, dx, dy, dw, dh) {
                    if (!this.taints(imageContainer) || this.options.allowTaint) {
                        this.ctx.drawImage(imageContainer.image, sx, sy, sw, sh, dx, dy, dw, dh);
                    }
                };
                CanvasRenderer.prototype.clip = function(shapes, callback, context) {
                    this.ctx.save();
                    shapes.filter(hasEntries).forEach(function(shape) {
                        this.shape(shape).clip();
                    }, this);
                    callback.call(context);
                    this.ctx.restore();
                };
                CanvasRenderer.prototype.shape = function(shape) {
                    this.ctx.beginPath();
                    shape.forEach(function(point, index) {
                        if (point[0] === "rect") {
                            this.ctx.rect.apply(this.ctx, point.slice(1));
                        } else {
                            this.ctx[(index === 0) ? "moveTo" : point[0] + "To"].apply(this.ctx, point.slice(1));
                        }
                    }, this);
                    this.ctx.closePath();
                    return this.ctx;
                };
                CanvasRenderer.prototype.font = function(color, style, variant, weight, size, family) {
                    this.setFillStyle(color).font = [
                        style,
                        variant,
                        weight,
                        size,
                        family
                    ].join(" ").split(",")[0];
                };
                CanvasRenderer.prototype.fontShadow = function(color, offsetX, offsetY, blur) {
                    this.setVariable("shadowColor", color.toString()).setVariable("shadowOffsetY", offsetX).setVariable("shadowOffsetX", offsetY).setVariable("shadowBlur", blur);
                };
                CanvasRenderer.prototype.clearShadow = function() {
                    this.setVariable("shadowColor", "rgba(0,0,0,0)");
                };
                CanvasRenderer.prototype.setOpacity = function(opacity) {
                    this.ctx.globalAlpha = opacity;
                };
                CanvasRenderer.prototype.setTransform = function(transform) {
                    this.ctx.translate(transform.origin[0], transform.origin[1]);
                    this.ctx.transform.apply(this.ctx, transform.matrix);
                    this.ctx.translate(-transform.origin[0], -transform.origin[1]);
                };
                CanvasRenderer.prototype.setVariable = function(property, value) {
                    if (this.variables[property] !== value) {
                        this.variables[property] = this.ctx[property] = value;
                    }
                    return this;
                };
                CanvasRenderer.prototype.text = function(text, left, bottom) {
                    this.ctx.fillText(text, left, bottom);
                };
                CanvasRenderer.prototype.backgroundRepeatShape = function(imageContainer, backgroundPosition, size, bounds, left, top, width, height, borderData) {
                    var shape = [
                            [
                                "line",
                                Math.round(left),
                                Math.round(top)
                            ],
                            [
                                "line",
                                Math.round(left + width),
                                Math.round(top)
                            ],
                            [
                                "line",
                                Math.round(left + width),
                                Math.round(height + top)
                            ],
                            [
                                "line",
                                Math.round(left),
                                Math.round(height + top)
                            ]
                        ];
                    this.clip([
                        shape
                    ], function() {
                        this.renderBackgroundRepeat(imageContainer, backgroundPosition, size, bounds, borderData[3], borderData[0]);
                    }, this);
                };
                CanvasRenderer.prototype.renderBackgroundRepeat = function(imageContainer, backgroundPosition, size, bounds, borderLeft, borderTop) {
                    var offsetX = Math.round(bounds.left + backgroundPosition.left + borderLeft),
                        offsetY = Math.round(bounds.top + backgroundPosition.top + borderTop);
                    this.setFillStyle(this.ctx.createPattern(this.resizeImage(imageContainer, size), "repeat"));
                    this.ctx.translate(offsetX, offsetY);
                    this.ctx.fill();
                    this.ctx.translate(-offsetX, -offsetY);
                };
                CanvasRenderer.prototype.renderBackgroundGradient = function(gradientImage, bounds) {
                    if (gradientImage instanceof LinearGradientContainer) {
                        var gradient = this.ctx.createLinearGradient(bounds.left + bounds.width * gradientImage.x0, bounds.top + bounds.height * gradientImage.y0, bounds.left + bounds.width * gradientImage.x1, bounds.top + bounds.height * gradientImage.y1);
                        gradientImage.colorStops.forEach(function(colorStop) {
                            gradient.addColorStop(colorStop.stop, colorStop.color.toString());
                        });
                        this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, gradient);
                    }
                };
                CanvasRenderer.prototype.resizeImage = function(imageContainer, size) {
                    var image = imageContainer.image;
                    if (image.width === size.width && image.height === size.height) {
                        return image;
                    }
                    var ctx,
                        canvas = document.createElement('canvas');
                    canvas.width = size.width;
                    canvas.height = size.height;
                    ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height);
                    return canvas;
                };
                function hasEntries(array) {
                    return array.length > 0;
                }
                module.exports = CanvasRenderer;
            },
            {
                "../lineargradientcontainer": 12,
                "../log": 13,
                "../renderer": 19
            }
        ],
        21: [
            function(_dereq_, module, exports) {
                var NodeContainer = _dereq_('./nodecontainer');
                function StackingContext(hasOwnStacking, opacity, element, parent) {
                    NodeContainer.call(this, element, parent);
                    this.ownStacking = hasOwnStacking;
                    this.contexts = [];
                    this.children = [];
                    this.opacity = (this.parent ? this.parent.stack.opacity : 1) * opacity;
                }
                StackingContext.prototype = Object.create(NodeContainer.prototype);
                StackingContext.prototype.getParentStack = function(context) {
                    var parentStack = (this.parent) ? this.parent.stack : null;
                    return parentStack ? (parentStack.ownStacking ? parentStack : parentStack.getParentStack(context)) : context.stack;
                };
                module.exports = StackingContext;
            },
            {
                "./nodecontainer": 14
            }
        ],
        22: [
            function(_dereq_, module, exports) {
                function Support(document) {
                    this.rangeBounds = this.testRangeBounds(document);
                    this.cors = this.testCORS();
                    this.svg = this.testSVG();
                }
                Support.prototype.testRangeBounds = function(document) {
                    var range, testElement, rangeBounds, rangeHeight,
                        support = false;
                    if (document.createRange) {
                        range = document.createRange();
                        if (range.getBoundingClientRect) {
                            testElement = document.createElement('boundtest');
                            testElement.style.height = "123px";
                            testElement.style.display = "block";
                            document.body.appendChild(testElement);
                            range.selectNode(testElement);
                            rangeBounds = range.getBoundingClientRect();
                            rangeHeight = rangeBounds.height;
                            if (rangeHeight === 123) {
                                support = true;
                            }
                            document.body.removeChild(testElement);
                        }
                    }
                    return support;
                };
                Support.prototype.testCORS = function() {
                    return typeof ((new Image()).crossOrigin) !== "undefined";
                };
                Support.prototype.testSVG = function() {
                    var img = new Image();
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
                    try {
                        ctx.drawImage(img, 0, 0);
                        canvas.toDataURL();
                    } catch (e) {
                        return false;
                    }
                    return true;
                };
                module.exports = Support;
            },
            {}
        ],
        23: [
            function(_dereq_, module, exports) {
                var XHR = _dereq_('./xhr');
                var decode64 = _dereq_('./utils').decode64;
                function SVGContainer(src) {
                    this.src = src;
                    this.image = null;
                    var self = this;
                    this.promise = this.hasFabric().then(function() {
                        return (self.isInline(src) ? Promise.resolve(self.inlineFormatting(src)) : XHR(src));
                    }).then(function(svg) {
                        return new Promise(function(resolve) {
                            window.html2canvas.svg.fabric.loadSVGFromString(svg, self.createCanvas.call(self, resolve));
                        });
                    });
                }
                SVGContainer.prototype.hasFabric = function() {
                    return !window.html2canvas.svg || !window.html2canvas.svg.fabric ? Promise.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg")) : Promise.resolve();
                };
                SVGContainer.prototype.inlineFormatting = function(src) {
                    return (/^data:image\/svg\+xml;base64,/.test(src)) ? this.decode64(this.removeContentType(src)) : this.removeContentType(src);
                };
                SVGContainer.prototype.removeContentType = function(src) {
                    return src.replace(/^data:image\/svg\+xml(;base64)?,/, '');
                };
                SVGContainer.prototype.isInline = function(src) {
                    return (/^data:image\/svg\+xml/i.test(src));
                };
                SVGContainer.prototype.createCanvas = function(resolve) {
                    var self = this;
                    return function(objects, options) {
                        var canvas = new window.html2canvas.svg.fabric.StaticCanvas('c');
                        self.image = canvas.lowerCanvasEl;
                        canvas.setWidth(options.width).setHeight(options.height).add(window.html2canvas.svg.fabric.util.groupSVGElements(objects, options)).renderAll();
                        resolve(canvas.lowerCanvasEl);
                    };
                };
                SVGContainer.prototype.decode64 = function(str) {
                    return (typeof (window.atob) === "function") ? window.atob(str) : decode64(str);
                };
                module.exports = SVGContainer;
            },
            {
                "./utils": 26,
                "./xhr": 28
            }
        ],
        24: [
            function(_dereq_, module, exports) {
                var SVGContainer = _dereq_('./svgcontainer');
                function SVGNodeContainer(node, _native) {
                    this.src = node;
                    this.image = null;
                    var self = this;
                    this.promise = _native ? new Promise(function(resolve, reject) {
                        self.image = new Image();
                        self.image.onload = resolve;
                        self.image.onerror = reject;
                        self.image.src = "data:image/svg+xml," + (new XMLSerializer()).serializeToString(node);
                        if (self.image.complete === true) {
                            resolve(self.image);
                        }
                    }) : this.hasFabric().then(function() {
                        return new Promise(function(resolve) {
                            window.html2canvas.svg.fabric.parseSVGDocument(node, self.createCanvas.call(self, resolve));
                        });
                    });
                }
                SVGNodeContainer.prototype = Object.create(SVGContainer.prototype);
                module.exports = SVGNodeContainer;
            },
            {
                "./svgcontainer": 23
            }
        ],
        25: [
            function(_dereq_, module, exports) {
                var NodeContainer = _dereq_('./nodecontainer');
                function TextContainer(node, parent) {
                    NodeContainer.call(this, node, parent);
                }
                TextContainer.prototype = Object.create(NodeContainer.prototype);
                TextContainer.prototype.applyTextTransform = function() {
                    this.node.data = this.transform(this.parent.css("textTransform"));
                };
                TextContainer.prototype.transform = function(transform) {
                    var text = this.node.data;
                    switch (transform) {
                        case "lowercase":
                            return text.toLowerCase();
                        case "capitalize":
                            return text.replace(/(^|\s|:|-|\(|\))([a-z])/g, capitalize);
                        case "uppercase":
                            return text.toUpperCase();
                        default:
                            return text;
                    }
                };
                function capitalize(m, p1, p2) {
                    if (m.length > 0) {
                        return p1 + p2.toUpperCase();
                    }
                }
                module.exports = TextContainer;
            },
            {
                "./nodecontainer": 14
            }
        ],
        26: [
            function(_dereq_, module, exports) {
                exports.smallImage = function smallImage() {
                    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                };
                exports.bind = function(callback, context) {
                    return function() {
                        return callback.apply(context, arguments);
                    };
                };
                /*
     * base64-arraybuffer
     * https://github.com/niklasvh/base64-arraybuffer
     *
     * Copyright (c) 2012 Niklas von Hertzen
     * Licensed under the MIT license.
     */
                exports.decode64 = function(base64) {
                    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                    var len = base64.length,
                        i, encoded1, encoded2, encoded3, encoded4, byte1, byte2, byte3;
                    var output = "";
                    for (i = 0; i < len; i += 4) {
                        encoded1 = chars.indexOf(base64[i]);
                        encoded2 = chars.indexOf(base64[i + 1]);
                        encoded3 = chars.indexOf(base64[i + 2]);
                        encoded4 = chars.indexOf(base64[i + 3]);
                        byte1 = (encoded1 << 2) | (encoded2 >> 4);
                        byte2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
                        byte3 = ((encoded3 & 3) << 6) | encoded4;
                        if (encoded3 === 64) {
                            output += String.fromCharCode(byte1);
                        } else if (encoded4 === 64 || encoded4 === -1) {
                            output += String.fromCharCode(byte1, byte2);
                        } else {
                            output += String.fromCharCode(byte1, byte2, byte3);
                        }
                    }
                    return output;
                };
                exports.getBounds = function(node) {
                    if (node.getBoundingClientRect) {
                        var clientRect = node.getBoundingClientRect();
                        var width = node.offsetWidth == null ? clientRect.width : node.offsetWidth;
                        return {
                            top: clientRect.top,
                            bottom: clientRect.bottom || (clientRect.top + clientRect.height),
                            right: clientRect.left + width,
                            left: clientRect.left,
                            width: width,
                            height: node.offsetHeight == null ? clientRect.height : node.offsetHeight
                        };
                    }
                    return {};
                };
                exports.offsetBounds = function(node) {
                    var parent = node.offsetParent ? exports.offsetBounds(node.offsetParent) : {
                            top: 0,
                            left: 0
                        };
                    return {
                        top: node.offsetTop + parent.top,
                        bottom: node.offsetTop + node.offsetHeight + parent.top,
                        right: node.offsetLeft + parent.left + node.offsetWidth,
                        left: node.offsetLeft + parent.left,
                        width: node.offsetWidth,
                        height: node.offsetHeight
                    };
                };
                exports.parseBackgrounds = function(backgroundImage) {
                    var whitespace = ' \r\n\t',
                        method, definition, prefix, prefix_i, block,
                        results = [],
                        mode = 0,
                        numParen = 0,
                        quote, args;
                    var appendResult = function() {
                            if (method) {
                                if (definition.substr(0, 1) === '"') {
                                    definition = definition.substr(1, definition.length - 2);
                                }
                                if (definition) {
                                    args.push(definition);
                                }
                                if (method.substr(0, 1) === '-' && (prefix_i = method.indexOf('-', 1) + 1) > 0) {
                                    prefix = method.substr(0, prefix_i);
                                    method = method.substr(prefix_i);
                                }
                                results.push({
                                    prefix: prefix,
                                    method: method.toLowerCase(),
                                    value: block,
                                    args: args,
                                    image: null
                                });
                            }
                            args = [];
                            method = prefix = definition = block = '';
                        };
                    args = [];
                    method = prefix = definition = block = '';
                    backgroundImage.split("").forEach(function(c) {
                        if (mode === 0 && whitespace.indexOf(c) > -1) {
                            return;
                        }
                        switch (c) {
                            case '"':
                                if (!quote) {
                                    quote = c;
                                } else if (quote === c) {
                                    quote = null;
                                };
                                break;
                            case '(':
                                if (quote) {
                                    break;
                                } else if (mode === 0) {
                                    mode = 1;
                                    block += c;
                                    return;
                                } else {
                                    numParen++;
                                };
                                break;
                            case ')':
                                if (quote) {
                                    break;
                                } else if (mode === 1) {
                                    if (numParen === 0) {
                                        mode = 0;
                                        block += c;
                                        appendResult();
                                        return;
                                    } else {
                                        numParen--;
                                    }
                                };
                                break;
                            case ',':
                                if (quote) {
                                    break;
                                } else if (mode === 0) {
                                    appendResult();
                                    return;
                                } else if (mode === 1) {
                                    if (numParen === 0 && !method.match(/^url$/i)) {
                                        args.push(definition);
                                        definition = '';
                                        block += c;
                                        return;
                                    }
                                };
                                break;
                        }
                        block += c;
                        if (mode === 0) {
                            method += c;
                        } else {
                            definition += c;
                        }
                    });
                    appendResult();
                    return results;
                };
            },
            {}
        ],
        27: [
            function(_dereq_, module, exports) {
                var GradientContainer = _dereq_('./gradientcontainer');
                function WebkitGradientContainer(imageData) {
                    GradientContainer.apply(this, arguments);
                    this.type = imageData.args[0] === "linear" ? GradientContainer.TYPES.LINEAR : GradientContainer.TYPES.RADIAL;
                }
                WebkitGradientContainer.prototype = Object.create(GradientContainer.prototype);
                module.exports = WebkitGradientContainer;
            },
            {
                "./gradientcontainer": 9
            }
        ],
        28: [
            function(_dereq_, module, exports) {
                function XHR(url) {
                    return new Promise(function(resolve, reject) {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', url);
                        xhr.onload = function() {
                            if (xhr.status === 200) {
                                resolve(xhr.responseText);
                            } else {
                                reject(new Error(xhr.statusText));
                            }
                        };
                        xhr.onerror = function() {
                            reject(new Error("Network Error"));
                        };
                        xhr.send();
                    });
                }
                module.exports = XHR;
            },
            {}
        ]
    }, {}, [
        4
    ])(4);
});

/**
 * @class Valence.mobile.Access
 * Determine if running in the native mobile portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 */
Ext.define('Valence.mobile.Access', {
    alternateClassName: [
        'Valence.device.Access'
    ],
    singleton: true,
    /**
     * @method isNativePortal
     * Returns true if running in the native mobile iOS/Android portal
     * @return {boolean}
     *
     * ##Example
     *      Valence.mobile.Access.isNativePortal();
     *
     */
    isNativePortal: function() {
        return (typeof wizViewMessenger !== 'undefined' && !Ext.isEmpty(wizViewMessenger));
    },
    initiate: function(config) {
        var me = this,
            config = (!Ext.isEmpty(config)) ? config : {},
            scope = config.scope || window,
            callback = config.callback || null,
            callbackMandatory = !Ext.isEmpty(config.callbackMandatory) ? config.callbackMandatory : true,
            responseId = config.responseId || null,
            requestId = config.requestId || null,
            method = config.method || null,
            obj = {
                requestId: requestId,
                responseId: responseId,
                method: method
            },
            listenerObj = {
                scope: scope,
                single: true
            },
            rspFnc = function(d) {
                if (callback) {
                    if (typeof callback === 'function') {
                        Ext.callback(callback, scope, [
                            d
                        ]);
                    } else {
                        Ext.callback(eval(callback), scope, [
                            d
                        ]);
                    }
                }
            };
        // if a callback is mandatory, ensure one has been passed...
        //
        if (callbackMandatory && !callback) {
            Ext.Msg.alert('Error', 'This functionality requires that you provide a callback.');
            return;
        }
        // setup the callback if applicable...
        //
        if (!Ext.isEmpty(callback)) {
            listenerObj[responseId] = rspFnc;
            var viewport = window.Ext.ComponentQuery.query('viewport')[0];
            if (viewport) {
                viewport.on(listenerObj);
            }
        }
        // apply the config object...but first remove the scope and callback properties if they exist...
        //
        if (config.scope) {
            delete config.scope;
        }
        if (config.callback) {
            delete config.callback;
        }
        Ext.apply(obj, config);
        wizViewMessenger.postMessage(obj, 'mainView');
    }
});

/**
 * Access and modify the badge number of the Valence Portal app icon
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Set Badge Example
 *
 * You can use the {@link Valence.mobile.Badge#set} method to change the value of the badge:
 *
 *     Valence.mobile.Badge.set(4);
 *
 *    {@img ValenceBadge.png}
 *
 * ## Get Badge Example
 *
 * You can use the {@link Valence.mobile.Badge#get} method to get the value of the badge:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Badge.get({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             Ext.Msg.alert('Badge', response);
 *         }
 *     });
 *
 * ## Clear Badge Example
 *
 * You can use the {@link Valence.mobile.Badge#clear} method to clear the badge:
 *
 *     Valence.mobile.Badge.clear();
 *
 * **Note:** When requesting access to the badge the user must grant permission.
 */
Ext.define('Valence.mobile.Badge', {
    alternateClassName: [
        'Valence.device.Badge'
    ],
    singleton: true,
    /**
     * Clears the current value of the badge
     * @method
     */
    clear: function() {
        var config = {
                callbackMandatory: false,
                requestId: 'badge',
                method: 'clear'
            };
        Valence.mobile.Access.initiate(config);
    },
    /**
     * Get the current value of the badge
     *
     * @param {Object} config
     * The config to get the badge value.
     *
     * @param {Function} config.callback
     * The callback with the badge value.
     *
     * @param {Number} config.callback.response
     * Value of the badge.
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    get: function(config) {
        Ext.apply(config, {
            requestId: 'badge',
            responseId: 'badge',
            method: 'get'
        });
        Valence.mobile.Access.initiate(config);
    },
    /**
     * Set the value of the badge
     * @param {Number} value
     * @method
     */
    set: function(value) {
        var config = {};
        Ext.apply(config, {
            callbackMandatory: false,
            requestId: 'badge',
            method: 'set',
            value: value
        });
        Valence.mobile.Access.initiate(config);
    }
});

/**
 * Start and stop the barcode scanner
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Scan Barcode Example
 *
 * You can use the {@link Valence.mobile.Barcode#scan} method to start the barcode scanner:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Barcode.scan({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response.success) {
 *                 if (!response.data.cancelled) {
 *                     var info = '';
 *                     if (response.data.format) {
 *                         info += 'Format : ' + response.data.format + '<br>';
 *                     }
 *                     if (response.data.text) {
 *                         info += 'Text : ' + response.data.text;
 *                     }
 *                     Ext.Msg.alert('Barcode Scanned', info);
 *                 } else {
 *                     Ext.Msg.alert('Barcode Scan', 'Cancelled');
 *                 }
 *             }
 *         }
 *     });
 *
 *    {@img ValenceBarcode.png}
 *
 * ## Stop Barcode Scanner Example
 *
 * You can use the {@link Valence.mobile.Barcode#stop} method to stop the barcode scanner:
 *
 *     Valence.mobile.Barcode.stopScan();
 *
 * **Note:** By default the camera scanner will be used unless one of the Infinite Peripherals barcode
 * scanners is attached. [Infinite Peripherals](http://ipcprint.com)
 */
Ext.define('Valence.mobile.Barcode', {
    alternateClassName: [
        'Valence.device.Barcode'
    ],
    singleton: true,
    /**
     * Start the barcode scanner
     *
     * @param {Object} config
     * The config for scanning of a barcode.
     *
     * @param {Function} config.callback
     * The callback which is called when a barcode is scanned or canceled.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.success
     * Successfully started the scanner
     *
     * @param {Object} config.callback.response.data
     * Barcode information
     *
     * @param {Boolean} config.callback.response.data.cancelled
     * If the barcode scanner was canceled. <i>This is only valid for the camera barcode scanner.</i>
     *
     * @param {String} config.callback.response.data.format
     * The format of the scanned barcode. <i>This is only valid for the camera barcode scanner.</i>
     *
     * @param {String} config.callback.response.data.text
     * The value of the scanned barcode.
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    scan: function(config) {
        Ext.apply(config, {
            requestId: 'barcode',
            responseId: 'scanBarcode',
            method: 'scan'
        });
        Valence.mobile.Access.initiate(config);
    },
    /**
     * Stop Scanner - this is only valid for Infinite Peripheral hardware
     * @method
     */
    stopScan: function() {
        var config = {
                callbackMandatory: false,
                requestId: 'barcode',
                responseId: 'stopScanBarcode',
                method: 'stop'
            };
        Valence.mobile.Access.initiate(config);
    }
});

/**
 * Access the camera
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Cleanup Camera Example
 *
 * You can use the {@link Valence.mobile.Camera#cleanup} method to remove intermediate photos taken by the camera from temporary storage:
 *
 *     Valence.mobile.Camera.cleanup();
 *
 * ## Get Picture Example
 *
 * You can use the {@link Valence.mobile.Camera#getPicture} method to allow the user to either take a photo or retrieve a photo from the device's image gallery:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Camera.getPicture({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response.success) {
 *                 Ext.Msg.alert('Picture', '<img width="250px" height="250px" src="data:image/jpeg;base64,' + response.data + '"/>');
 *                 //clean up the camera
 *                 //
 *                 Valence.mobile.Camera.cleanup();
 *             } else {
 *                 Ext.Msg.alert('Picture Not Taken');
 *             }
 *         }
 *     });
 *
 *    {@img ValenceCamera.jpg}
 *
 * ## Get Picture with options Example
 *
 * Bring up the camera with the front camera active instead of the default back camera:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Camera.getPicture({
 *         options  : {
 *             cameraDirection : Valence.mobile.Camera.direction.FRONT
 *         },
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response.success) {
 *                 Ext.Msg.alert('Picture', '<img width="250px" height="250px" src="data:image/jpeg;base64,' + response.data + '"/>');
 *                 //clean up the camera
 *                 //
 *                 Valence.mobile.Camera.cleanup();
 *             } else {
 *                 Ext.Msg.alert('Picture Not Taken');
 *             }
 *         }
 *     });
 */
Ext.define('Valence.mobile.Camera', {
    alternateClassName: [
        'Valence.device.Camera'
    ],
    singleton: true,
    /**
     * @property {Object} return type
     *
     * @property {Number} destinationType.DATA_URL
     * Return image as base64-encoded string
     *
     * @property {Number} destinationType.FILE_URI
     * Return image file URI
     *
     * @property {Number} destinationType.NATIVE_URI
     * Return image native URI (e.g., assets-library:// on iOS or content:// on Android)
     */
    destinationType: {
        DATA_URL: 0,
        // Return image as base64-encoded string
        FILE_URI: 1,
        // Return image file URI
        NATIVE_URI: 2
    },
    // Return image native URI (e.g., assets-library:// on iOS or content:// on Android)
    /**
     * @property {Object} direction Camera to use (front- or back-facing)
     *
     * @property {Number} direction.BACK
     * Use the back-facing camera DEFAULT.
     *
     * @property {Number} direction.FRONT
     * Use the front-facing camera
     */
    direction: {
        BACK: 0,
        // Use the back-facing camera
        FRONT: 1
    },
    // Use the front-facing camera
    /**
     * @property {Object} encodingType Returned image file's encoding
     *
     * @property {Number} encodingType.JPEG
     * Return JPEG encoded image DEFAULT.
     *
     * @property {Number} encodingType.PNG
     * Return PNG encoded image
     */
    encodingType: {
        JPEG: 0,
        // Return JPEG encoded image
        PNG: 1
    },
    // Return PNG encoded image
    /**
     * @property {Object} mediaType Type of media to select from. Only works when PictureSourceType is PHOTOLIBRARY or SAVEDPHOTOALBUM
     *
     * @property {Number} mediaType.PICTURE
     * Allow selection of still pictures only. DEFAULT.
     *
     * @property {Number} mediaType.VIDEO
     * Allow selection of video only, WILL ALWAYS RETURN FILE_URI
     *
     * @property {Number} mediaType.ALLMEDIA
     * Allow selection from all media types
     */
    mediaType: {
        PICTURE: 0,
        // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
        VIDEO: 1,
        // allow selection of video only, WILL ALWAYS RETURN FILE_URI
        ALLMEDIA: 2
    },
    // allow selection from all media types
    /**
     * @property {Object} pictureSourceType The source of the picture
     *
     * @property {Number} pictureSourceType.PHOTOLIBRARY
     * Get photo from the photo library
     *
     * @property {Number} pictureSourceType.CAMERA
     * Get photo from the camera DEFAULT.
     *
     * @property {Number} pictureSourceType.SAVEDPHOTOALBUM
     * Get photo from the saved photo album
     */
    pictureSourceType: {
        PHOTOLIBRARY: 0,
        CAMERA: 1,
        SAVEDPHOTOALBUM: 2
    },
    /**
     * Cleanup - Removes intermediate photos taken by the camera from temporary storage.  Suggest calling this function after using the {@link Valence.mobile.Camera#getPicture} function.
     * @method
     */
    cleanup: function(config) {
        config = config || {};
        Ext.apply(config, {
            requestId: 'camera',
            responseId: 'cameraCleanup',
            method: 'cleanup',
            callbackMandatory: false
        });
        Valence.mobile.Access.initiate(config);
    },
    /**
     * Get Picture - Takes a photo using the camera, or retrieves a photo from the device's image gallery. The image is passed to the success callback as a base64-encoded String.
     *
     * @param {Object} config
     * The config for getting a picture
     *
     * @param {Object} [config.options]
     * Optional parameters to customize the camera settings.
     *
     * @param {Number} [config.options.quality]
     * Quality of the saved image, expressed as a range of 0-100, where 100 is typically full resolution with no loss from file compression. The default is 10.
     *
     * @param {Number} [config.options.sourceType]
     * Set the source of the picture. The default is CAMERA. Defined in {@link Valence.mobile.Camera#sourceType}
     *
     * @param {Boolean} [config.options.allowEdit]
     * Allow simple editing of image before selection. The default is false.
     *
     * @param {Number} [config.options.encodingType]
     * Choose the returned image file's encoding. Default is JPEG. Defined in {@link Valence.mobile.Camera#encodingType}
     *
     * @param {Number} [config.options.targetWidth]
     * Width in pixels to scale image. Must be used with <b>targetHeight</b>. Aspect ratio remains constant.
     *
     * @param {Number} [config.options.targetHeight]
     * Height in pixels to scale image. Must be used with <b>targetWidth</b>. Aspect ratio remains constant.
     *
     * @param {Number} [config.options.mediaType]
     * Set the type of media to select from. Only works when PictureSourceType is PHOTOLIBRARY or SAVEDPHOTOALBUM. Defined in {@link Valence.mobile.Camera#mediaType}
     *
     * @param {Boolean} [config.options.correctOrientation]
     * Rotate the image to correct for the orientation of the device during capture.
     *
     * @param {Boolean} [config.options.saveToPhotoAlbum]
     * Save the image to the photo album on the device after capture.
     *
     * @param {Number} [config.options.cameraDirection]
     * Choose the camera to use (front- or back-facing). The default is BACK. Defined in {@link Valence.mobile.Camera#cameraDirection}
     *
     * @param {Function} config.callback
     * The callback which is called when a picture is taken or canceled.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.success
     * Successfully captured a picture
     *
     * @param {Object} config.callback.response.data
     * Picture data if success is true.  If success is false then will contain the error message.
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    getPicture: function(config) {
        config = config || {};
        Ext.apply(config, {
            requestId: 'camera',
            responseId: 'cameraPicture',
            method: 'getPicture'
        });
        Valence.mobile.Access.initiate(config);
    }
});

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
    alternateClassName: [
        'Valence.device.Contacts'
    ],
    singleton: true,
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
    pick: function(config) {
        Ext.apply(config, {
            requestId: 'contacts',
            method: 'pickContact',
            responseId: 'selectedContact'
        });
        Valence.mobile.Access.initiate(config);
    }
});

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
    alternateClassName: [
        'Valence.device.Email'
    ],
    singleton: true,
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
    compose: function(config) {
        if (!Ext.isEmpty(config)) {
            Ext.apply(config, {
                options: Ext.clone(config)
            });
        } else {
            config = {};
        }
        Ext.apply(config, {
            requestId: 'emailComposer',
            responseId: 'emailComposer',
            callbackMandatory: false
        });
        Valence.mobile.Access.initiate(config);
    }
});

/**
 * Provides information about the device's location, such as latitude and longitude. Common sources of location information include Global Positioning System (GPS) and location inferred from network signals such as IP address, RFID, WiFi and Bluetooth MAC addresses, and GSM/CDMA cell IDs. There is no guarantee that the API returns the device's actual location.
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Get Current Position Example
 *
 * You can use the {@link Valence.mobile.Geolocation#getCurrentPosition} method to get the current geolocation:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Geolocation.getCurrentPosition({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response.success) {
 *                 if (response.coords) {
 *                     var info = '';
 *                     if (response.coords.latitude) {
 *                         info += 'Latitude : ' + response.coords.latitude + '<br>';
 *                     }
 *                     if (response.coords.longitude) {
 *                         info += 'Longitude : ' + response.coords.longitude;
 *                     }
 *                     Ext.Msg.alert('Current Position Info', info);
 *                 }
 *             } else {
 *                 Ext.Msg.alert('Error', response.message);
 *             }
 *         }
 *     });
 *
 * **Note:** When requesting the devices geoLocation the user must grant permission.
 */
Ext.define('Valence.mobile.Geolocation', {
    alternateClassName: [
        'Valence.device.Geolocation'
    ],
    singleton: true,
    /**
     * Returns the device's current position to the callback with a Position information.
     *
     * @param {Object} config
     * The config for getting the geoLocation
     *
     * @param {Function} config.callback
     * The callback which is called when geoLocation is captured or if an error occurred.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.success
     * Successfully retrieved the location information.
     *
     * @param {Object} config.callback.response.coords
     * A set of geographic coordinates.
     *
     * @param {Number} config.callback.response.coords.latitude
     * Latitude in decimal degrees.
     *
     * @param {Number} config.callback.response.coords.longitude
     * Height of the position in meters above the ellipsoid.
     *
     * @param {Number} config.callback.response.coords.accuracy
     * Accuracy level of the latitude and longitude coordinates in meters.
     *
     * @param {Number} config.callback.response.coords.altitudeAccuracy
     * Accuracy level of the altitude coordinate in meters.
     *
     * @param {Number} config.callback.response.coords.heading
     * Direction of travel, specified in degrees counting clockwise relative to the true north.
     *
     * @param {Number} config.callback.response.coords.speed
     * Current ground speed of the device, specified in meters per second.
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    getCurrentPosition: function(config) {
        Ext.apply(config, {
            requestId: 'geolocation',
            responseId: 'geolocationPosition',
            method: 'getCurrentPosition'
        });
        Valence.mobile.Access.initiate(config);
    }
});

/**
 * Display a window that behaves like a standard web browser.
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Show Example
 *
 * You can use the {@link Valence.mobile.InAppBrowser#show} method:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.InAppBrowser.show({
 *         url      : 'http://www.cnxcorp.com',
 *         options  : {
 *             closebuttoncaption : 'Close CNX Corp'
 *         }
 *         scope    : me,
 *         callback : function () {
 *             Ext.Viewport.unmask();
 *         }
 *     });
 *
 *    {@img ValenceInAppBrowser.jpeg}
 */
Ext.define('Valence.mobile.InAppBrowser', {
    alternateClassName: [
        'Valence.device.InAppBrowser'
    ],
    singleton: true,
    /**
     * Show a window that behaves like a browser with a valid url.
     *
     * @param {Object} config
     * The config for requesting the inAppBrowser
     *
     * @param {String} config.url
     * The URL to load
     *
     * @param {Object} [config.options]
     * Optional parameters to customize the inAppBrowser.
     *
     * @param {String} [config.options.location]
     * Set to yes or no to turn the InAppBrowser's location bar on or off.  DEFAULTS to `no`
     *
     * @param {String} [config.options.closebuttoncaption]
     * Set the close button text.  DEFAULTS to `Close` which is based of the current language selected by the user.
     *
     * @param {String} [config.options.enableosshare]
     * Enable/Disable the share button. To disable pass 'no'. DEFAULTS to `yes`
     *
     * @param {String} [config.options.disallowoverscroll]
     * Set to yes or no. DEFAULTS to `no` Turns on/off the UIWebViewBounce property.
     *
     * @param {String} [config.options.clearcache]
     * Set to yes to have the browser's cookie cache cleared before the new window is opened
     *
     * @param {String} [config.options.clearsessioncache]
     * Set to yes to have the session cookie cache cleared before the new window is opened
     *
     * @param {String} [config.options.toolbar]
     * Set to yes or no to turn the toolbar on or off for the InAppBrowser DEFAULTS to `yes`
     *
     * @param {String} [config.options.enableViewportScale]
     * Set to yes or no to prevent viewport scaling through a meta tag DEFAULTS to `yes`
     *
     * @param {String} [config.options.mediaPlaybackRequiresUserAction]
     * Set to yes or no to prevent HTML5 audio or video from autoplaying DEFAULTS to `no`
     *
     * @param {String} [config.options.allowInlineMediaPlayback]
     * Set to yes or no to allow in-line HTML5 media playback, displaying within the browser window rather than a device-specific playback interface. The HTML's video element must also include the webkit-playsinline attribute DEFAULTS to `no`
     *
     * @param {String} [config.options.keyboardDisplayRequiresUserAction]
     * Set to yes or no to open the keyboard when form elements receive focus via JavaScript's focus() call DEFAULTS to `yes`
     *
     * @param {String} [config.options.suppressesIncrementalRendering]
     * Set to yes or no to wait until all new view content is received before being rendered DEFAULTS to `no`
     *
     * @param {String} [config.options.presentationstyle]
     * Set to pagesheet, formsheet or fullscreen to set the presentation style DEFAULTS to `fullscreen`
     *
     * @param {String} [config.options.transitionstyle]
     * Set to fliphorizontal, crossdissolve or coververtical to set the transition style DEFAULTS to `coververtical`
     *
     * @param {String} [config.options.toolbarposition]
     * Set to top or bottom. DEFAULTS to `top` Causes the toolbar to be at the top or bottom of the window.
     *
     * @param {Function} config.callback
     * The callback which is called when the inAppBrowser is closed.
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    show: function(config) {
        Ext.apply(config, {
            callbackMandatory: false,
            requestId: 'showInAppBrowser',
            responseId: 'inAppBrowser'
        });
        Valence.mobile.Access.initiate(config);
    }
});

/**
 * Device Information
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Get Connection Type Example
 *
 * You can use the {@link Valence.mobile.Information#connectionType} method:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Information.connectionType({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response) {
 *                 Ext.Msg.alert('Current Connection', response);
 *             }
 *         }
 *     });
 *
 *    {@img ValenceConnectionType.png}
 *
 * ## Get Device Information Example
 *
 * You can use the {@link Valence.mobile.Information#get} method:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Information.get({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response) {
 *                 var info = '';
 *                 if (response.model) {
 *                     info += 'Model : ' + response.model + '<br>';
 *                 }
 *                 if (response.platform) {
 *                     info += 'Platform : ' + response.platform;
 *                 }
 *                 Ext.Msg.alert('Device Info', info);
 *             }
 *         }
 *     });
 *
 *    {@img ValenceDeviceInformation.png}
 */
Ext.define('Valence.mobile.Information', {
    alternateClassName: [
        'Valence.device.Information'
    ],
    singleton: true,
    /**
     * Returns the connection type
     *
     * @param {Object} config
     * The config for getting the connection type
     *
     * @param {Function} config.callback
     * The callback which is called with the connection type.
     *
     * @param {Object} config.callback.response
     * The value of the connection type
     *
     * - unknown
     * - ethernet
     * - wifi
     * - 2g
     * - 3g
     * - 4g
     * - cellular
     * - none
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    connectionType: function(config) {
        Ext.apply(config, {
            requestId: 'getConnectionType',
            responseId: 'connectionType'
        });
        Valence.mobile.Access.initiate(config);
    },
    /**
     * Returns the device information
     *
     * @param {Object} config
     * The config for getting the device information
     *
     * @param {Function} config.callback
     * The callback which is called with the device information.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.model
     * The name of the device's model or product. The value is set by the device manufacturer and may be different across versions of the same product.
     *
     * @param {Boolean} config.callback.response.platform
     * The device's operating system name.
     *
     * @param {Boolean} config.callback.response.uuid
     * The device's Universally Unique Identifier (UUID).
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    get: function(config) {
        Ext.apply(config, {
            requestId: 'getDeviceInformation',
            responseId: 'deviceInformation'
        });
        Valence.mobile.Access.initiate(config);
    }
});

/**
 * Notifications
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Beep Example
 *
 * You can use the {@link Valence.mobile.Notification#beep} method:
 *
 *     Valence.mobile.Notification.beep();
 */
Ext.define('Valence.mobile.Notification', {
    alternateClassName: [
        'Valence.device.Notification'
    ],
    singleton: true,
    /**
     * The device plays a beep sound.
     * @param {Number} [times] DEFAULTS to 1 beep
     * @method
     */
    beep: function(times) {
        var config = {
                callbackMandatory: false,
                requestId: 'beep'
            };
        if (!Ext.isEmpty(times)) {
            Ext.apply(config, {
                times: times
            });
        }
        Valence.mobile.Access.initiate(config);
    }
});

/**
 * Create full-quality printed output without the need to download or install drivers. Built in many printer models from most popular printer manufacturers. Just select an printer on your local network.
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Print Content Example
 *
 * You can use the {@link Valence.mobile.Print#content} method to send content to the printer:
 *
 *     Valence.mobile.Print.content({
 *         scope    : me,
 *         content  : '<b>Test Print</b><br><br>Valence Mobile Print',
 *         callback : function (response) {
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (!response.available) {
 *                 Ext.Msg.alert('Printer', 'Unavailable');
 *             }
 *         }
 *     });
 *
 *    {@img ValencePrintContent.jpg}
 *
 *
 * ## Is Available Example
 *
 * You can use the {@link Valence.mobile.Print#isAvailable} method to determine if printing is available on the device:
 *
 *     Valence.mobile.Print.isAvailable({
 *         scope    : me,
 *         callback : function (response) {
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response.available) {
 *                 Ext.Msg.alert('Printer', 'Available');
 *             } else {
 *                 Ext.Msg.alert('Printer', 'Unavailable');
 *             }
 *         }
 *     });
 *
 *    {@img ValencePrinterIsAvailable.png}
 */
Ext.define('Valence.mobile.Print', {
    alternateClassName: [
        'Valence.device.Print'
    ],
    singleton: true,
    /**
     * Print content to the printer. The method takes a string or a HTML DOM node. The string can contain HTML content. Optional parameters allows to specify the name of the document and a callback. The callback will be called if the user cancels.
     *
     * @param {Object} config
     * The config to send content to the printer.
     *
     * @param {Function} config.content
     * HTML string or DOM node
     *
     * @param {Function} config.callback
     * The callback which is called when printer is not available.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.available
     * false if the printer is not available
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    content: function(config) {
        Ext.apply(config, {
            requestId: 'print',
            method: 'sendContent',
            responseId: 'printSendContent'
        });
        Valence.mobile.Access.initiate(config);
    },
    /**
     * Find out if printing is available on the device
     *
     * @param {Object} config
     * The config to check if the printer is available.
     *
     * @param {Function} config.callback
     * The callback which is called when the information on printer availability.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.available
     * If the printer is available
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    isAvailable: function(config) {
        Ext.apply(config, {
            requestId: 'print',
            method: 'isAvailable',
            responseId: 'printAvailable'
        });
        Valence.mobile.Access.initiate(config);
    }
});

Ext.define('Valence.mobile.Runtime', {
    alternateClassName: [
        'Valence.device.Runtime'
    ],
    singleton: true,
    getData: function(config) {
        Ext.apply(config, {
            requestId: 'getRuntimeData',
            responseId: 'runtimeData'
        });
        Valence.mobile.Access.initiate(config);
    },
    removeData: function(keys) {
        var config = {
                callbackMandatory: false,
                requestId: 'removeRuntimeData',
                keys: keys
            };
        Valence.mobile.Access.initiate(config);
    },
    setData: function(data) {
        var config = {
                callbackMandatory: false,
                requestId: 'setRuntimeData'
            };
        Ext.apply(config, {
            data: data
        });
        Valence.mobile.Access.initiate(config);
    }
});

/**
 * @class Valence.util.App
 * Various methods to work with apps in the Portal.
 */
Ext.define('Valence.util.App', {
    singleton: true,
    /**
     * @method close
     * Close a running application
     *
     * @param {Number} appId
     *
     * ##Example -
     *
     * The following code snippet will close application id 1234
     *
     *     Valence.util.App.close(1234);
     *
     */
    close: function(appId) {
        var me = this;
        if (!Valence.mobile.Access.isNativePortal()) {
            var appRecord = me.getRunningApp(appId);
            if (!Ext.isEmpty(appRecord)) {
                var portal = me.getDesktopPortal();
                if (!Ext.isEmpty(portal)) {
                    portal.util.Helper.closeApp(appRecord);
                }
            } else {
                return false;
            }
        } else {
            //running in native mobile portal
            //
            var config = {
                    callbackMandatory: false,
                    nativeMandatory: false,
                    requestId: 'app',
                    method: 'close'
                };
            if (typeof appId === "object") {
                Ext.apply(config, appId);
            } else {
                Ext.apply(config, {
                    app: appId
                });
            }
            Valence.mobile.Access.initiate(config);
        }
    },
    getDesktopPortal: function() {
        var me = this,
            portal = parent.Portal;
        return portal;
    },
    getAvailableApp: function(appId) {
        var me = this,
            portal = me.getDesktopPortal();
        if (!Ext.isEmpty(portal) && !Ext.isEmpty(appId) && typeof portal.getApplication === 'function') {
            var store = portal.getApplication().getStore('Apps');
            if (!Ext.isEmpty(store)) {
                return store.findRecord('appId', appId, 0, false, true, true);
            }
        }
        return null;
    },
    getRunningApp: function(id) {
        var me = this,
            portal = me.getDesktopPortal();
        if (!Ext.isEmpty(portal) && !Ext.isEmpty(id) && typeof portal.getApplication === 'function') {
            var store = portal.getApplication().getStore('RunningApps');
            if (!Ext.isEmpty(store)) {
                //first check via key
                //
                var record = store.findRecord('key', id, 0, false, true, true);
                if (Ext.isEmpty(record)) {
                    //check via appId
                    //
                    record = store.findRecord('appId', id, 0, false, true, true);
                }
                return record;
            }
        }
        return null;
    },
    /**
     * @method isLaunched
     * Check if an application is currently running in the portal
     *
     * @param {Number} appId
     *
     * ##Example -
     *
     * The following code snippet will close application id 1234
     *
     *     Valence.util.App.isLaunched(1234);
     *
     */
    isLaunched: function(appId) {
        return this.isRunning(appId);
    },
    /**
     * @method isRunning
     *
     * ## Check if an application is currently running in the desktop portal:
     *
     *     Valence.util.App.isRunning(1234);
     *
     * ## Check if an application is currently running in the mobile portal:
     *
     *   You need to pass an object that contains a callback method.
     *
     *     Valence.util.App.isRunning({
     *         app      : 1234,
     *         callback : function(response){
     *             if (response){
     *                 Ext.Msg.alert('Is running');
     *             } else {
     *                 Ext.Msg.alert('Is not running');
     *             }
     *         }
     *     });
     */
    isRunning: function(appId) {
        var me = this;
        if (!Valence.mobile.Access.isNativePortal()) {
            var appRecord = me.getRunningApp(appId);
            if (!Ext.isEmpty(appRecord)) {
                return true;
            }
            return false;
        } else {
            //running in native mobile portal
            //
            var config = {
                    nativeMandatory: false,
                    responseId: 'isLaunched',
                    requestId: 'app',
                    method: 'isLaunched'
                };
            Ext.apply(config, appId);
            Valence.mobile.Access.initiate(config);
        }
    },
    /**
     * @method launch
     * Launch an application is in the portal
     *
     * @param {Object} obj Object containing the following config:
     *
     * - `app`  The app Id
     * - `params`  The parameters to be passed in url format to the called app.
     * - `forceNew`  boolean (optional) Force the creation of a new app instance, regardless if the app is already open.
     *
     */
    launch: function(obj) {
        var me = this,
            appId = obj.app || null,
            forceNew = obj.forceNew || false,
            additionalParms = obj.params || null;
        if (!Ext.isEmpty(appId)) {
            if (!Valence.mobile.Access.isNativePortal()) {
                var appRecord = me.getAvailableApp(appId);
                if (!Ext.isEmpty(appRecord)) {
                    var portal = me.getDesktopPortal();
                    if (!Ext.isEmpty(portal)) {
                        portal.util.Helper.launchApp(appRecord, additionalParms, forceNew);
                        return;
                    }
                }
            } else {
                var config = obj;
                Ext.apply(config, {
                    callbackMandatory: false,
                    nativeMandatory: false,
                    requestId: 'app',
                    method: 'launch'
                });
                Valence.mobile.Access.initiate(config);
                return;
            }
        }
        return false;
    },
    /**
     * @method print
     * Print the application - this will generate a cleaner print than the default browser print
     */
    print: function() {
        var me = this,
            destroyFrame = function() {
                var printFrame = Ext.ComponentQuery.query('uxiframe#vv-print-frame')[0];
                if (!Ext.isEmpty(printFrame)) {
                    printFrame.destroy();
                    printFrame = null;
                }
            },
            loadFrame = function(screenShot) {
                if (!Ext.isEmpty(Ext.ux.IFrame)) {
                    Ext.create('Ext.ux.IFrame', {
                        itemId: 'vv-print-frame',
                        height: '100%',
                        width: '100%',
                        renderTo: Ext.getBody(),
                        style: {
                            display: 'none',
                            visibility: 'hidden'
                        },
                        src: '/resources/printScreen.html',
                        listeners: {
                            single: true,
                            load: function(cmp) {
                                var frameWindow = cmp.getWin(),
                                    imageTag = frameWindow.document.getElementById('screenshot');
                                //load the screenshot
                                //
                                imageTag.setAttribute('src', screenShot);
                                frameWindow.print();
                                setTimeout(function() {
                                    destroyFrame();
                                }, 5000);
                            }
                        }
                    });
                } else {
                    Ext.global.console.error('Valence.util.App.print requires Ext.ux.IFrame');
                }
            };
        if (!Ext.isEmpty(html2canvas)) {
            html2canvas(document.body, {
                onrendered: function(canvas) {
                    if (!Valence.mobile.Access.isNativePortal()) {
                        loadFrame(canvas.toDataURL());
                    } else {
                        Valence.mobile.Print.content({
                            scope: me,
                            content: '<!DOCTYPE html><html><body><img src="' + canvas.toDataURL() + '" alt="Screenshot" width="100%" height="100%"></body></html>',
                            callback: function(response) {
                                if (Ext.isEmpty(response)) {
                                    return;
                                }
                                if (!response.available) {
                                    Valence.common.util.Dialog.show({
                                        msg: Valence.lang.lit.printerUnavailable,
                                        buttons: [
                                            '->',
                                            {
                                                text: Valence.lang.lit.ok
                                            }
                                        ]
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    },
    /**
     * @method setActive
     * Set a specific application to be the active application
     *
     * @param {Object} obj Object containing the following config:
     *
     * - `app`  The app Id or key
     *
     */
    setActive: function(obj) {
        var me = this,
            appId = obj.app || obj.appId || obj;
        if (!Valence.mobile.Access.isNativePortal()) {
            var appRecord = me.getRunningApp(appId);
            if (!Ext.isEmpty(appRecord)) {
                var portal = me.getDesktopPortal();
                if (!Ext.isEmpty(portal)) {
                    portal.util.Helper.activateApp(appRecord);
                    return;
                }
            }
        } else {
            var config = {
                    requestId: 'app',
                    method: 'show',
                    nativeMandatory: false,
                    callbackMandatory: false
                };
            if (typeof app === "object") {
                Ext.apply(config, obj);
            } else {
                Ext.apply(config, {
                    app: obj
                });
            }
            Valence.mobile.Access.initiate(config);
        }
    },
    /**
     * if set, prompts the user before closing an app in the Portal.
     * @param {string} key if not provided will pull the key from the url params
     * @param {Object} obj The object must contain the properties of:
     *
     * - `title`  The title of the Prompt the user receives when attempting to close the app.
     * - `msg`  The message text
     *
     * * @param {Boolean} active Defaults to true however if set to false will trun off prompt before close.
     *
     * ## Example
     *      var key = Ext.getUrlParam('key');
     *
     *      Valence.app.setPromptBeforeClose(key,{
     *          title : 'Are you sure?',
     *          msg : 'All unsaved changes will be lost'
     *      });
     *
     *
     *  When the user attempts to close the application, they will see a message similar to this:
     *
     * {@img app_setPromptBeforeClose.png before close Prompt}
     */
    setPromptBeforeClose: function(key, obj, active) {
        var me = this;
        if (!Valence.mobile.Access.isNativePortal()) {
            if (Ext.isEmpty(active)) {
                active = true;
            }
            //if key is not passed in pull it from the url
            //
            if (!Ext.isString(key)) {
                key = Ext.getUrlParam('key');
            }
            if (!Ext.isEmpty(key)) {
                //get the app record
                //
                var appRecord = me.getRunningApp(key);
                if (!Ext.isEmpty(appRecord)) {
                    var portal = me.getDesktopPortal();
                    if (!Ext.isEmpty(portal)) {
                        //notify the portal to set prompt before close
                        //
                        portal.util.Helper.setPromptBeforeClose(appRecord, active, obj);
                        return;
                    }
                }
            }
        }
        return false;
    }
});

/**
 * @class Valence.util.Helper
 * Various helper methods for working within the Portal.
 */
Ext.define('Valence.util.Helper', {
    singleton: true,
    currencies: (Ext.getFramework().version === 3) ? new Ext.util.MixedCollection() : Ext.create('Ext.util.MixedCollection'),
    isDb2i: null,
    constructor: function() {
        // setup literal object...
        //
        if (typeof Valence.lang !== 'object') {
            if (typeof parent.Valence.lang === 'object') {
                Ext.apply(Valence, {
                    lang: {
                        lit: parent.Valence.lang.lit
                    }
                });
                vlit = Valence.lang.lit;
            }
        }
    },
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
    addEventListener: function(event, cb, scope) {
        if (!Ext.isEmpty(Ext.isClassic) && Ext.isClassic) {
            var scope = scope || window,
                key = Ext.getUrlParam('key'),
                iframeCmp = (!Ext.isEmpty(key)) ? parent.Ext.ComponentQuery.query('uxiframe[key=' + key + ']')[0] : null;
            if (iframeCmp) {
                iframeCmp.mon(iframeCmp, event, cb, scope);
            }
        } else {
            Ext.global.console.warn('Valence.util.Helper.addEventListener only available for Classic/Desktop Applications');
            return false;
        }
    },
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
     * The following code snippet uses Valence.util.Helper.download to pass the RPG program called
     * EXSS01, a parameter for action (getCustRecSS), and a parameter for CUSTNO (the value
     * of the field CUSTNO in the currentRecord).
     *
     *     Valence.util.Helper.download({
     *             pgm : 'EXSS01',
     *             action: 'getCustRecSS',
	 *             CUSTNO: currentRecord.get('CUSTNO')
     *         });
     *
     */
    download: function(parms, returnSource) {
        var me = this;
        if (Ext.isEmpty(Valence.mobile) || !Valence.mobile.Access.isNativePortal()) {
            var url = '/valence/vvcall.pgm',
                sid = Ext.getUrlParam('customSid') || me.getSid(),
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
            Ext.iterate(parms, function(key, value) {
                src += '&' + key + '=' + escape(value);
            });
            if (Ext.isEmpty(returnSource) || !returnSource) {
                Ext.core.DomHelper.append(document.body, {
                    tag: 'iframe',
                    frameBorder: 0,
                    width: 0,
                    height: 0,
                    css: 'display:none;visibility:hidden;height:1px;',
                    src: src
                });
            } else {
                return src;
            }
        } else {
            Ext.global.console.warn('Valence.util.Helper.download only available for Classic/Desktop Applications');
            return false;
        }
    },
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
    fireEvent: function(event, o) {
        if (!Valence.mobile.Access.isNativePortal()) {
            var Portal = parent.Portal || Portal,
                parms = o || {};
            Ext.apply(parms, {
                event: event
            });
            Portal.getApplication().fireEvent('bubbledown', parms);
        } else {
            Ext.global.console.warn('Valence.util.Helper.fireEvent only available for Classic/Desktop Applications');
            return false;
        }
    },
    /**
     * Utility function format currency based off a currency code
     * @since Version 5.0
     * @param {String} code Currency code
     * @param {Number} value Value
     * @return {String} The formatted currency string
     */
    formatCurrency: function(code, value, config) {
        var me = this,
            extFormat = Ext.util.Format,
            commaDecimalSepartor = false;
        if (Ext.isEmpty(value)) {
            return value;
        }
        if (Ext.isEmpty(code)) {
            Ext.global.console.error('Valence.util.Helper.formatCurrency : Must pass a currency code');
            return null;
        } else {
            var currency = Ext.clone(me.getCurrency(code));
            if (Ext.isEmpty(currency)) {
                Ext.global.console.warn('Valence.util.Helper.formatCurrency : Currency code "' + code + '" not found defaulted to USD');
                currency = Ext.clone(me.getCurrency('USD'));
            }
            if (!Ext.isEmpty(config) && Ext.isObject(config)) {
                Ext.apply(currency, config);
            }
            if (!Ext.isEmpty(currency.commaDecimalSeparator)) {
                commaDecimalSepartor = currency.commaDecimalSeparator;
            }
            if (commaDecimalSepartor) {
                var orgThousandSeparator = extFormat.thousandSeparator,
                    orgDecimalSeparator = extFormat.decimalSeparator;
                extFormat.decimalSeparator = ',';
                extFormat.thousandSeparator = '.';
            }
            value = extFormat.currency(value, currency.sign, currency.decimals, currency.end);
            if (commaDecimalSepartor) {
                extFormat.decimalSeparator = orgDecimalSeparator;
                extFormat.thousandSeparator = orgThousandSeparator;
            }
        }
        return value;
    },
    /**
     * Utility function to return a formatted date based on the date format specified in "Portal Admin -> Settings".
     * @since Version 4.0
     * @param {String}  date The date in 'Y-m-d' / iso format
     * @return {String} The formatted date
     */
    formatDate: function(o) {
        var me = this;
        if (!Valence.mobile.Access.isNativePortal()) {
            var date = o,
                d = Ext.Date.parse(date, 'Y-m-d'),
                settings = me.getValenceSettings(),
                format = (!Ext.isEmpty(settings)) ? settings.getDateFormat() : 'Y-m-d';
            return (Ext.isEmpty(d)) ? date : Ext.util.Format.date(d, format);
        } else {
            Ext.global.console.warn('Valence.util.Helper.getValenceRuntime only available for Classic/Desktop Applications');
            return;
            //todo - this needs to be added to the mobile native portal
            var config = {
                    responseId: 'formatedDate',
                    requestId: 'formatDate'
                };
            Ext.apply(config, o);
            Valence.mobile.Access.initiate(config);
        }
    },
    /**
     * Utility function to convert legacy CYYMMDD dates to ISO
     * @since Version 5.0
     * @param {Number} Date
     * @return {String} ISO Date
     */
    formatDateCYMDToISO: function(v) {
        if (!Ext.isEmpty(v)) {
            var year = parseInt((v / 10000) + 1900) + '',
                month = parseInt((v % 10000) / 100) + '',
                day = parseInt((v % 100)) + '',
                formatFnc = function(v) {
                    var padding = '00';
                    return padding.substring(0, padding.length - v.length) + v;
                };
            return formatFnc(year) + '-' + formatFnc(month) + '-' + formatFnc(day);
        }
    },
    /**
     * Utility function format number with the option to have the decimal separator
     * @since Version 5.0
     * @param {Number} value Value
     * @param {String} format Format
     * @param {Boolean} [commaDecimalSeparator]
     * @return {String} The formatted number string
     */
    formatNumber: function(value, format, commaDecimalSeparator) {
        var me = this,
            extFormat = Ext.util.Format;
        if (Ext.isEmpty(commaDecimalSeparator)) {
            commaDecimalSepartor = false;
        }
        if (!commaDecimalSeparator) {
            return Ext.util.Format.number(value, format);
        } else {
            var orgThousandSeparator = extFormat.thousandSeparator,
                orgDecimalSeparator = extFormat.decimalSeparator,
                v;
            extFormat.decimalSeparator = ',';
            extFormat.thousandSeparator = '.';
            v = extFormat.number(value, format);
            extFormat.decimalSeparator = orgDecimalSeparator;
            extFormat.thousandSeparator = orgThousandSeparator;
            return v;
        }
    },
    /**
     * Utility function to get the app name for a particular app id.
     * @since Version 5.0
     * @param {Number} The app id.
     * @return {String} The app name.
     */
    getAppName: function(appId) {
        var proceed = typeof Portal === 'object' || typeof parent.Portal === 'object',
            str, rec;
        if (proceed) {
            str = (typeof Portal === 'object') ? Portal.util.Helper.getAppStore() : parent.Portal.util.Helper.getAppStore();
            if (str && !Ext.isEmpty(appId)) {
                rec = str.findRecord('appId', appId, 0, false, true, true);
            }
            if (rec) {
                return rec.get('name');
            }
        }
        return null;
    },
    /**
     * Utility function to get a specific currency object
     * @since Version 5.0
     * @param {String} code Currency code
     * @return {Object} Currency object
     */
    getCurrency: function(code) {
        var me = this,
            currencies = me.getCurrencies();
        if (!Ext.isEmpty(code)) {
            return currencies.get(code);
        } else {
            Ext.global.console.error('Valence.util.Helper.getCurrency : Must pass a currency code');
            return null;
        }
    },
    /**
     * Utility function to get avilable currencies
     * @since Version 5.0
     * @return {Ext.util.MixedCollection} Collection of the currencies
     */
    getCurrencies: function() {
        var me = this,
            currencies = me.currencies;
        if (currencies.getCount() === 0) {
            //load the currencies
            //
            currencies.add('AUD', {
                desc: 'Australia Dollar',
                decimals: 2,
                sign: 'AU$',
                end: false
            });
            currencies.add('CAD', {
                desc: 'Canada Dollar',
                decimals: 2,
                sign: 'C$',
                end: false
            });
            currencies.add('EUR', {
                desc: 'Euro Member Countries',
                decimals: 2,
                sign: '€',
                end: false
            });
            currencies.add('JPY', {
                desc: 'Japan Yen',
                decimals: 0,
                sign: '¥',
                end: false
            });
            currencies.add('USD', {
                desc: 'United States Dollar',
                decimals: 2,
                sign: '$',
                end: false
            });
        }
        return currencies;
    },
    /**
     * Utility function to get the specified (configured in Portal Admin -> Settings) date format.
     * @since Version 4.0
     *
     * ## Get the date format while running on Desktop:
     *
     *     var dateFormat = Valence.util.Helper.getDateFormat();
     *
     * ## Get the date format while running on Mobile:
     *
     *   You need to pass an object that contains a callback method.
     *
     *     Valence.util.Helper.getDateFormat({
     *         callback : function(response){
     *             Ext.Msg.alert('Date Format', response);
     *         }
     *     });
     */
    getDateFormat: function(o) {
        var me = this;
        if (!Valence.mobile.Access.isNativePortal()) {
            var settings = me.getValenceSettings(),
                format = (!Ext.isEmpty(settings)) ? settings.getDateFormat() : 'Y-m-d';
            return format;
        } else {
            var config = {
                    responseId: 'dateFormat',
                    requestId: 'getDateFormat'
                };
            Ext.apply(config, o);
            Valence.mobile.Access.initiate(config);
        }
    },
    /**
     * Utility function to get the current environment.
     * @since Version 3.2, update 3
     *
     * ## Get the environment while running on Desktop:
     *
     *     var environment = Valence.util.Helper.getEnvironment();
     *
     * ## Get the environment while running on Mobile:
     *
     *   You need to pass an object that contains a callback method.
     *
     *     Valence.util.Helper.getEnvironment({
     *         callback : function(response){
     *             Ext.Msg.alert('Environment', response);
     *         }
     *     });
     */
    getEnvironment: function(o) {
        var me = this;
        if (!Valence.mobile.Access.isNativePortal()) {
            var runtime = me.getValenceRuntime(),
                environment = (!Ext.isEmpty(runtime)) ? runtime.getLoginData().envName : null;
            return environment;
        } else {
            var config = {
                    responseId: 'currentEnvironment',
                    requestId: 'getEnvironment'
                };
            Ext.apply(config, o);
            Valence.mobile.Access.initiate(config);
        }
    },
    /**
     * Utility function to get the current environment Id
     * @since Version 5.0
     * @return {Integer} envId
     */
    getEnvironmentId: function() {
        var env = Ext.getUrlParam('env');
        if (env) {
            return env;
        }
        if (!Ext.isEmpty(Valence.login) && typeof Valence.login.config.Runtime.getLoginData === "function") {
            var data = Valence.login.config.Runtime.getLoginData();
            if (data && data.env) {
                return data.env;
            }
        }
        env = sessionStorage.getItem('env');
        if (!Ext.isEmpty(env)) {
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
    getLanguage: function() {
        var lang = Ext.getUrlParam('lang');
        if (!lang) {
            if (!Ext.isEmpty(Valence.login) && typeof Valence.login.config.Runtime.getLanguage === "function") {
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
    getMultiLingual: function(o) {
        var me = this;
        if (!Valence.mobile.Access.isNativePortal()) {
            var settings = me.getValenceSettings(),
                multiLingual = (!Ext.isEmpty(settings)) ? settings.getMultiLingual() : null;
            return multiLingual;
        } else {
            Ext.global.console.warn('Valence.util.Helper.getValenceRuntime only available for Classic/Desktop Applications');
            return;
            //todo - this needs to be added to the mobile natvie portal
            var config = {
                    responseId: 'multiLingual',
                    requestId: 'getMultiLingual'
                };
            Ext.apply(config, o);
            Valence.mobile.Access.initiate(config);
        }
    },
    /**
     * Get Random Color - could be used for chart colors etc.
     * @since Version 5.0
     * @return {String} Hex Color
     */
    getRandomColor: function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    /**
     * Utility function to get the current SID
     * @since Version 5.0
     * @return {String} SID
     */
    getSid: function() {
        var sid = Ext.getUrlParam('sid');
        if (sid) {
            return sid;
        }
        if (!Ext.isEmpty(Valence.login) && typeof Valence.login.config.Runtime.getLoginData === "function") {
            var data = Valence.login.config.Runtime.getLoginData();
            if (data && data.sid) {
                return data.sid;
            }
        }
        sid = localStorage.getItem('sid');
        if (!Ext.isEmpty(sid)) {
            return sid;
        }
        return sessionStorage.getItem('sid');
    },
    /**
     * Utility function to get the currently logged in user name.
     * @since Version 3.2, update 3
     *
     * ## Get the user while running on Desktop:
     *
     *     var user = Valence.util.Helper.getUserName();
     *
     * ## Get the user while running on Mobile:
     *
     *   You need to pass an object that contains a callback method.
     *
     *     Valence.util.Helper.getUserName({
     *         callback : function(response){
     *             Ext.Msg.alert('User', response);
     *         }
     *     });
     */
    getUserName: function(obj) {
        var me = this;
        if (!Valence.mobile.Access.isNativePortal()) {
            var runtime = me.getValenceRuntime(),
                user = (!Ext.isEmpty(runtime)) ? runtime.getUser() : null;
            return user;
        } else {
            var config = {
                    responseId: 'currentUser',
                    requestId: 'getUser'
                };
            Ext.apply(config, obj);
            Valence.mobile.Access.initiate(config);
        }
    },
    /**
     * @method getValenceRuntime
     * @since Version 5.0
     * Returns the active Valence settings
     * @return {object}
     */
    getValenceRuntime: function() {
        var me = this;
        //get the valence runtime for Desktop or Mobile
        //
        if (!Valence.mobile.Access.isNativePortal()) {
            if (!Ext.isEmpty(parent.Portal)) {
                return parent.Valence.login.config.Runtime;
            } else if (!Ext.isEmpty(Valence.login)) {
                return Valence.login.config.Runtime;
            }
        } else {
            Ext.global.console.warn('Valence.util.Helper.getValenceRuntime only available for Classic/Desktop Applications');
        }
        return null;
    },
    /**
     * @method getValenceSettings
     * @since Version 5.0
     * Returns the active Valence settings
     * @return {object}
     */
    getValenceSettings: function() {
        var me = this;
        //get the valence settings for Desktop or Mobile
        //
        if (!Valence.mobile.Access.isNativePortal()) {
            if (!Ext.isEmpty(parent.Portal)) {
                return parent.Valence.login.config.Settings;
            } else if (!Ext.isEmpty(Valence.login)) {
                return Valence.login.config.Settings;
            } else {
                return null;
            }
        } else {
            //todo - mobile need to call via messaging
            return null;
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
    getVersion: function(o) {
        var me = this;
        if (!Valence.mobile.Access.isNativePortal()) {
            var settings = me.getValenceSettings(),
                version = (!Ext.isEmpty(settings)) ? settings.getVersion() : null;
            return version;
        } else {
            Ext.global.console.warn('Valence.util.Helper.getValenceRuntime only available for Classic/Desktop Applications');
            return;
            //todo - this needs to be added to the mobile native portal
            var config = {
                    responseId: 'version',
                    requestId: 'getVersion'
                };
            Ext.apply(config, o);
            Valence.mobile.Access.initiate(config);
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
    execScriptFiles: function(config) {
        var scriptIndex = 0,
            scope = config.scope || window,
            callback = config.callback || null;
        var getFiles = function(scriptIndex) {
                config = config || {};
                Ext.apply(this, config);
                Ext.Ajax.request({
                    method: 'GET',
                    omitPortalCredentials: true,
                    disableCaching: false,
                    url: this.urls[scriptIndex],
                    callback: function(options, success, response) {
                        try {
                            var responseString = '';
                            responseString = response.responseText;
                            eval.call(window, response.responseText);
                        } catch (e) {}
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
     *         // the following code snippet uses Valence.util.Helper.encodeUTF16
     *         // to encode strings on two Ajax post parameters
     *         var saveGrp = function() {
     *           Ext.Ajax.request({
     *             url: 'vvcall.pgm',
     *             params: {
     *               pgm: 'vvgrps',
     *               action: 'saveGrp',
     *               grpname: Valence.util.Helper.encodeUTF16(Ext.getCmp('grpidx').getValue()),
     *               description: Valence.util.Helper.encodeUTF16(Ext.get('description').getValue())
     *             }
     *           });
     *         };
     */
    encodeUTF16: function(textString) {
        var haut = 0;
        var n = 0;
        var CPstring = '';
        var dec2hex = function(textString) {
                return (textString + 0).toString(16).toUpperCase();
            };
        try {
            for (var i = 0; i < textString.length; i++) {
                var b = textString.charCodeAt(i);
                if (b < 0 || b > 65535) {
                    CPstring += 'Error: byte out of range ' + dec2hex(b) + '!';
                }
                if (haut !== 0) {
                    if (56320 <= b && b <= 57343) {
                        CPstring += dec2hex(65536 + ((haut - 55296) << 10) + (b - 56320));
                        haut = 0;
                        
                        continue;
                    } else {
                        CPstring += 'Error in: surrogate out of range ' + dec2hex(haut) + '!';
                        haut = 0;
                    }
                }
                if (55296 <= b && b <= 56319) {
                    haut = b;
                } else {
                    cp = dec2hex(b);
                    while (cp.length < 4) {
                        cp = '0' + cp;
                    }
                    CPstring += cp;
                }
            }
        } catch (e) {}
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
     *            // the following example uses Valence.util.Helper.decodeUTF16
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
     *                 convert: Valence.util.Helper.decodeUTF16
     *               }, {
     *                name: 'VVVALUE',
     *                convert: Valence.util.Helper.decodeUTF16
     *               }]
     *            });
     *
     * Example 2 - automatically decoding a UTF16 hex-encoded string from an Ajax response while setting a textfield value:
     *
     *            // the following example uses Valence.util.Helper.decodeUTF16
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
     *                 Ext.getCmp('description').setValue(Valence.util.Helper.decodeUTF16(data.VVGRPDESC));
     *              }
     *           });
     *         };
     *
     */
    decodeUTF16: function(inStr) {
        try {
            inStr = inStr.replace(/([A-Fa-f0-9]{4})/g, function(matchstr, hex) {
                var result = '';
                var n = parseInt(hex, 16);
                if (n <= 65535) {
                    result += String.fromCharCode(n);
                } else {
                    if (n <= 1114111) {
                        n -= 65536;
                        result += String.fromCharCode(55296 | (n >> 10)) + String.fromCharCode(56320 | (n & 1023));
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
    getIsDb2i: function() {
        var me = Valence.util.Helper;
        if (Ext.isEmpty(me.isDb2i)) {
            var settings = me.getValenceSettings();
            if (!Ext.isEmpty(settings) && typeof settings.getDatabase === 'function' && settings.getDatabase() !== 'db2i') {
                me.isDb2i = false;
            } else {
                me.isDb2i = true;
            }
        }
        return me.isDb2i;
    },
    isLocked: function() {
        var me = this,
            isLocked = null;
        if (!Valence.mobile.Access.isNativePortal()) {
            var runtime = me.getValenceRuntime();
            if (!Ext.isEmpty(runtime)) {
                return runtime.getIsLocked();
            }
        }
        return isLocked;
    },
    /**
     * Depreicated - use showSnackbar
     */
    msg: function(parm1, parm2, parm3) {
        var me = this,
            text;
        if (!Ext.isEmpty(Ext.global) && !Ext.isEmpty(Ext.global.console) && !Ext.isEmpty(Ext.global.console.warn)) {
            Ext.global.console.warn('Valence.util.Helper.msg Depreicated, use showSnackbar instead.');
        } else {
            console.log('Valence.util.Helper.msg Depreicated, use showSnackbar instead.');
        }
        if (typeof arguments[0] !== 'object') {
            if (!Ext.isEmpty(parm1)) {
                text = parm1;
            } else if (!Ext.isEmpty(parm2)) {
                text = parm2;
            }
        } else {
            if (!Ext.isEmpty(parm1.title)) {
                text = parm1.title;
            } else if (!Ext.isEmpty(parm1.msg)) {
                text = parm1.msg;
            }
        }
        if (!Ext.isEmpty(text)) {
            me.showSnackbar(text);
        }
    },
    /**
     * @method popupUrl
     * @since Version 5.0
     * Used to show a user a pdf or any web url.
     *
     * `Desktop` - Render url in a window.
     *
     * `Mobile`  - Render url in the {@link Valence.mobile.InAppBrowser#show}.
     *
     * @param {Object} config
     *
     * Following config:
     *
     * - `title` [optional] Title of the window
     * - `width` Width of the window
     * - `height` Height of the window
     * - `src` URL address of the document
     *
     * ## Example
     *
     *     Valence.util.Helper.popupUrl({
     *         height : 500,
     *         width  : 500,
     *         src    : '/pdfDocuments/ABC.pdf',
     *     });
     */
    popupUrl: function(config) {
        var me = this,
            wdw;
        if (!Valence.mobile.Access.isNativePortal()) {
            var wdwConfig = {
                    width: 400,
                    height: 400,
                    title: null,
                    src: null
                };
            Ext.apply(wdwConfig, config);
            if (!Ext.isEmpty(wdwConfig.src)) {
                wdw = Ext.widget('window', {
                    layout: 'fit',
                    height: wdwConfig.height,
                    width: wdwConfig.width,
                    title: wdwConfig.title,
                    header: (Ext.isEmpty(wdwConfig.title)) ? false : null,
                    html: {
                        'tag': 'iframe',
                        'height': '100%',
                        'width': '100%',
                        'src': wdwConfig.src
                    },
                    buttons: [
                        {
                            text: Valence.lang.lit.close,
                            handler: function(btn) {
                                var pdfWin = btn.up('window');
                                if (!Ext.isEmpty(pdfWin) && typeof pdfWin.destroy === 'function') {
                                    pdfWin.destroy();
                                }
                            }
                        }
                    ]
                }).show();
            }
        } else {
            if (!Ext.isEmpty(config.src)) {
                var url = config.src,
                    validUrl = function(str) {
                        return /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(str);
                    };
                Valence.mobile.InAppBrowser.show({
                    url: (validUrl(url)) ? url : window.location.origin + url
                });
            }
        }
        return wdw;
    },
    /**
     * @method processTypedInputFilter
     * @since Version 5.0
     * Utility function to filter a store based off a value the user typed in.
     * @param {Ext.data.Store} store Store you would like filtered.
     * @param {Array} fields Array of fields to filter on.
     * @param {String} value Value to filter by.
     * @param {String} [filterId=typedinput] If passed will be the filter identifier.
     */
    processTypedInputFilter: function(str, flds, val, filterId) {
        var me = this,
            regEx = new RegExp(val, 'i');
        if (Ext.isEmpty(filterId)) {
            filterId = 'typedinput';
        }
        if (!Ext.isEmpty(str)) {
            str.removeFilter(filterId);
            if (!Ext.isEmpty(val)) {
                str.addFilter({
                    id: filterId,
                    filterFn: function(item) {
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
     * @since Version 5.0
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
     *      Valence.util.Helper.showSnackbar('Record Saved', 'Record for customer 12345 was saved');
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
    showSnackbar: function(config) {
        var me = this;
        if (Ext.isString(config)) {
            config = {
                text: config
            };
        }
        if (!Valence.mobile.Access.isNativePortal() && !Ext.isEmpty(config.text)) {
            var portal = parent.Portal,
                snackConfig = {
                    text: config.text
                };
            if (!Ext.isEmpty(portal)) {
                //check for snackbar button
                //
                if (!Ext.isEmpty(config.buttonText)) {
                    Ext.apply(snackConfig, {
                        buttonText: config.buttonText,
                        handler: config.handler
                    });
                    if (!Ext.isEmpty(config.scope)) {
                        Ext.apply(snackConfig, {
                            scope: config.scope
                        });
                    }
                }
                //check for duration override
                //
                if (!Ext.isEmpty(config.duration)) {
                    Ext.apply(snackConfig, {
                        duration: config.duration
                    });
                }
                portal.util.Helper.showSnackbar(snackConfig);
                return true;
            }
        }
        return false;
    },
    swapTheme: function(o) {
        var me = this,
            head = document.head,
            link = document.createElement('link'),
            path = (!Ext.isEmpty(Ext.isClassic) && Ext.isClassic) ? 'resources/themes/classic/' : 'resources/themes/modern/';
        Ext.util.CSS.removeStyleSheet('portaltheme');
        link.id = 'portaltheme';
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = path + o.theme + '.css';
        head.appendChild(link);
    },
    /**
     * Utility function to convert a standard timestamp string from DB2/400 to a JavaScript Date object.
     * This function is useful for converting DB2/400 timestamps to Date object for further date processing logic.
     * @param {string} DB2timeStamp String formatted as a timestamp in the format yyyy-mm-dd hh:mn:ss
     *
     */
    timestampToDate: function(v) {
        return new Date(v.substr(0, 4), parseInt(v.substr(5, 2) - 1, 10), v.substr(8, 2), v.substr(11, 2), v.substr(14, 2), v.substr(17, 2));
    }
});

Ext.define('Valence.util.Widget', {
    singleton: true,
    create: function(o) {
        // "o" must contain the following...
        //    id : the ID of the widget
        //
        // "o" may contain the following...
        //    callback : a callback function to process after the widget is created
        //    scope : the scope to run the callback function in
        //    postParms : an object to apply to the post
        //    widgetConfig : an object to apply to the widget config before instantiating
        //
        var options = o || {},
            scope = o.scope || window,
            callback = o.callback || null,
            widget = null,
            name = null;
        if (!options.id) {
            return;
        }
        // all widgets should be created through this process...
        //   first, package up the parameters to pass on to "getWidget"...
        //
        var config = {},
            parms = {
                pgm: 'vvwdgt',
                action: 'getWidget',
                vvId: options.id
            };
        // apply additional postParms if passed...
        //
        if (options.postParms) {
            parms = Ext.apply(parms, options.postParms);
        }
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: parms,
            scope: this,
            success: function(r) {
                var d = Ext.decode(r.responseText);
                if (d.SUCCESS === '1') {
                    // apply all VVWDG200 records to the config object...
                    //
                    Ext.iterate(d.VVWDG200, function(obj) {
                        config[obj.VVPROP] = obj.VVVALUE;
                    });
                    delete d.VVWDG200;
                    // next apply all other properties of the "d" object to the config...
                    //
                    Ext.iterate(d, function(property, value) {
                        config[property] = value;
                    });
                    // next, apply any additional widget configs if passed...
                    //
                    if (options.widgetConfig) {
                        config = Ext.apply(config, options.widgetConfig);
                        name = options.widgetConfig.VVNAME || null;
                    }
                    Ext.apply(config, {
                        VVNAME: name || Valence.util.Helper.decodeUTF16(d.VVNAME)
                    });
                    Ext.apply(config, {
                        VVDESC: Valence.util.Helper.decodeUTF16(d.VVDESC)
                    });
                    if (o.onlyCreateConfig) {
                        widget = Ext.apply(config, {
                            xtype: d.VVCRTXTP
                        });
                    } else {
                        widget = Ext.create(d.CMP, config);
                    }
                } else {
                    // SUCCESS = '0'
                    Ext.Msg.alert('Error creating Valence widget', 'Widget id ' + options.id + ' could not be created. Ensure it still exists.');
                }
                if (typeof (callback) === 'function') {
                    if (widget) {
                        Ext.callback(callback, scope, [
                            widget
                        ]);
                    } else {
                        Ext.callback(callback, scope, [
                            null
                        ]);
                    }
                }
                return widget;
            }
        });
    }
});

