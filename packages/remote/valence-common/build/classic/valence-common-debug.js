Ext.define('Valence.common.util.Format', {
    singleton: true,
    durationTextSinceDate: function(v, format, returnedUnits, numbersOnly) {
        var me = this,
            f = format || 'Y-m-d-H.i.s.u',
            tsDate = Ext.Date.parse(v, f),
            now = new Date(),
            minute = 60,
            hour = 3600,
            day = 86400,
            year = 31536000,
            // 365 days
            diff = Math.abs((tsDate.getTime() - now.getTime()) / 1000),
            // in seconds
            formatArgs, measure, t;
        if (Ext.isEmpty(tsDate) || Ext.util.Format.date(tsDate, 'Y') === '0001') {
            return '';
        }
        if (Ext.isEmpty(returnedUnits)) {
            if (diff < minute) {
                return Valence.lang.lit.secondsAgo;
            } else if (diff < hour) {
                formatArgs = me.getDurationText(Valence.lang.lit.minutesAgo, diff, minute);
            } else if (diff < day) {
                formatArgs = me.getDurationText(Valence.lang.lit.hoursAgo, diff, hour);
            } else if (diff > year) {
                formatArgs = me.getDurationText(Valence.lang.lit.yearsAgo, diff, year);
            } else {
                formatArgs = me.getDurationText(Valence.lang.lit.daysAgo, diff, day);
            }
        } else {
            if (returnedUnits == 'minute') {
                measure = minute;
            } else if (returnedUnits == 'hour') {
                measure = hour;
            } else if (returnedUnits == 'day') {
                measure = day;
            } else if (returnedUnits == 'year') {
                measure = year;
            }
            formatArgs = me.getDurationText(numbersOnly ? '{0}' : '{0} ' + returnedUnits + '{1} ago', diff, measure, numbersOnly);
        }
        // t = Ext.bind(Ext.String.format, null, formatArgs)();
        return Ext.util.Format.format('<span data-qtip="{0}">{1}</span>', Ext.util.Format.date(tsDate, format), formatArgs);
    },
    // if (Ext.isClassic){
    //     return Ext.util.Format.format('<span data-qtip="{0}">{1}</span>',Ext.util.Format.date(tsDate,format),formatArgs);
    // }
    // return Ext.util.Format.date(tsDate,format);
    getDurationText: function(fStr, diffInSeconds, timeUnit, numbersOnly) {
        var val = Math.floor(diffInSeconds / timeUnit),
            minute = 60,
            hour = 3600,
            day = 86400,
            year = 31536000,
            // 365 days
            lit = Valence.lang.lit,
            plural = val > 1 ? 's' : '',
            result = [
                fStr,
                val
            ];
        if (val === 1) {
            if (timeUnit === minute) {
                return lit.minuteAgo;
            } else if (timeUnit === hour) {
                return lit.hourAgo;
            } else if (timeUnit === day) {
                return lit.dayAgo;
            } else if (timeUnit === year) {
                return lit.yearAgo;
            }
        }
        if (fStr.indexOf('VAR1') !== -1) {
            return fStr.replace('VAR1', val);
        }
        if (numbersOnly) {
            result.push(plural);
        }
        return result;
    },
    phone: function(v) {
        if (Ext.isEmpty(v)) {
            return '';
        }
        if (Ext.isNumber(v)) {
            v += '';
        }
        v = v.trim();
        if (v.length === 10) {
            return v.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } else if (v.length === 11) {
            if (v[10] != 0) {
                return v.replace(/(\d{3})(\d{3})(\d{4})(\d{1})/, '$1-$2-$3-$4');
            } else {
                return v.substring(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }
        } else if (v.length === 1) {
            return '';
        }
        return v;
    },
    ssn: function(v) {
        if (Ext.isNumber(v)) {
            v += '';
        }
        v = v.trim();
        if (v.length === 9) {
            return v.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
        }
        return v;
    },
    ssnmask: function(v) {
        if (Ext.isNumber(v)) {
            v += '';
        }
        v = v.trim();
        if (v.length === 9) {
            return v.replace(/(\d{3})(\d{2})(\d{4})/, 'XXX-XX-$3');
        }
        return v;
    },
    zip: function(v) {
        if (Ext.isNumber(v)) {
            v += '';
        }
        if (v.trim().length === 9) {
            return v.replace(/(\d{5})(\d{4})/, '$1-$2');
        }
        return v;
    }
});

Ext.define('Valence.common.widget.Background', {
    extend: 'Ext.Component',
    xtype: 'widget_background',
    cls: 'w-bg'
});

/**
 * loadmask
 */
Ext.define('Valence.common.widget.Loadmask', {
    extend: 'Ext.Component',
    xtype: 'widget_loadmask',
    cls: 'w-mask-outer',
    type: 'spinner',
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            renderTpl: me.buildRenderTpl(),
            stopDestroy: true
        });
        if (Ext.isEmpty(me.renderTo)) {
            Ext.apply(me, {
                renderTo: Ext.getBody()
            });
        }
        me.callParent(arguments);
        me.on({
            scope: me,
            beforedestroy: me.onBeforeDestroy
        });
    },
    buildRenderTpl: function() {
        var me = this;
        if (me.type === 'pbar') {
            return [
                '<div class="w-mask-inner">',
                '<div class="w-mask-title">{text}</div>',
                '<div class="w-mask-pbar">',
                '<span class="w-mask-pbar-full">',
                '<span class="w-mask-pbar-fill"></span>',
                '</span>',
                '</div>',
                '</div>'
            ];
        } else if (me.type === 'rect') {
            return [
                '<div class="w-mask-inner rect">',
                '<div class="ui rect1"></div>',
                '<div class="ui rect2"></div>',
                '<div class="ui rect3"></div>',
                '<div class="ui rect4"></div>',
                '<div class="ui rect5"></div>',
                '<p class="w-mask-title">{text}</p>',
                '</div>'
            ];
        } else if (me.type === 'spinner') {
            return [
                '<div class="w-mask-inner w-spinner">',
                '<div class="circle1 child"></div>',
                '<div class="circle2 child"></div>',
                '<div class="circle3 child"></div>',
                '<div class="circle4 child"></div>',
                '<div class="circle5 child"></div>',
                '<div class="circle6 child"></div>',
                '<div class="circle7 child"></div>',
                '<div class="circle8 child"></div>',
                '<div class="circle9 child"></div>',
                '<div class="circle10 child"></div>',
                '<div class="circle11 child"></div>',
                '<div class="circle12 child"></div>',
                '<p class="w-mask-title">{text}</p>',
                '</div>'
            ];
        }
    },
    initiateDestroy: function() {
        var me = this;
        //me.el.down('div.w-mask-bar').addCls('w-mask-bar-shrink');
        //me.el.down('div.w-mask-title').addCls('w-mask-title-fade');
        me.el.fadeOut({
            duration: 600,
            callback: function() {
                me.destroy();
            }
        });
    },
    initRenderData: function() {
        var me = this;
        return Ext.apply(me.callParent(), {
            text: me.text
        });
    },
    onBeforeDestroy: function() {
        var me = this;
        if (me.stopDestroy) {
            me.stopDestroy = false;
            me.initiateDestroy();
        }
        return false;
    }
});

Ext.define('Valence.common.util.Helper', {
    singleton: true,
    requires: [
        'Ext.util.MixedCollection',
        'Ext.XTemplate',
        'Valence.common.widget.Background',
        'Valence.common.widget.Loadmask'
    ],
    loadMaskMC: Ext.create('Ext.util.MixedCollection'),
    /**
     * function buildEmptyText returns {String}
     * @param emptyText {Object} : {
     *     heading : {String} Provides the main text for the emptyText
     *     subText : {String} (optional) Provides additional options for the users
     *     events  : {Array of "event" Objects} (requires subText to be provided as a formatted string.
     *     See Ext.util.Format.format()) Provide links for the user to perform other actions
     *     [{
     *          text    : {String}
     *          event   : {String} (lowercase) is used as the data-event property
     *     }]
     * }
     */
    buildEmptyText: function(emptyText) {
        var me = this,
            imageAdditionalStyle = '',
            tpl;
        if (Ext.isEmpty(emptyText.heading)) {
            emptyText.heading = Valence.lang.lit.noResults;
        }
        if (Ext.isEmpty(emptyText.events)) {
            emptyText.events = [];
        }
        //check for hide image
        //
        if (!Ext.isEmpty(emptyText.hideImage) && emptyText.hideImage) {
            imageAdditionalStyle = 'display:none;';
        }
        if (Ext.isEmpty(emptyText.iconCls)) {
            emptyText.iconCls = 'vvicon-cloud';
        }
        tpl = new Ext.XTemplate('<div class="vv-empty-text-wrap">', '<div class="vv-empty-text-cnt">', '<div style="' + imageAdditionalStyle + '"><span class="vvicon {iconCls}"></div>', '<div class="vv-empty-text">', '{heading}', '</div>', '<tpl if="subText">', '<div class="vv-empty-subtext">', '<tpl if="events.length == 0">', '{subText}', '<tpl else>', '{[this.buildSubText(values)]}', '</tpl>', '</div>', '</tpl>', '</div>', '</div>', {
            buildSubText: function(vals) {
                var eventSpanArray = [
                        vals.subText
                    ],
                    events = vals.events,
                    event;
                for (var i = 0; i < events.length; i++) {
                    event = events[i];
                    eventSpanArray.push(Ext.util.Format.format('<span data-event="{0}" class="vv-empty-text-event">{1}</span>', event.event, event.text));
                }
                return Ext.bind(Ext.util.Format.format, null, eventSpanArray)();
            }
        });
        return tpl.applyTemplate(emptyText);
    },
    destroyInitialLoadingMask: function() {
        var me = this,
            loading = Ext.fly('spinner');
        //destroy the initial loading mask defined in the index
        // if found
        //
        if (!Ext.isEmpty(loading)) {
            loading.fadeOut({
                callback: function() {
                    loading.destroy();
                }
            });
        }
    },
    destroyLoadMask: function(renderTo) {
        var me = this,
            el = renderTo || Ext.getBody(),
            mask = me.loadMaskMC.get(el.id);
        if (mask) {
            if (Ext.isClassic) {
                mask.el.fadeOut({
                    callback: function() {
                        me.loadMaskMC.remove(mask);
                        mask.destroy();
                    }
                });
            } else {
                mask.element.hide();
                setTimeout(function() {
                    me.loadMaskMC.remove(mask);
                    mask.destroy();
                }, 300);
            }
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
    download: function(parms) {
        var url = '/valence/vvcall.pgm',
            sid = localStorage.getItem('sid'),
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
            src += '&' + key + '=' + encodeURI(value);
        });
        Ext.core.DomHelper.append(document.body, {
            tag: 'iframe',
            frameBorder: 0,
            width: 0,
            height: 0,
            css: 'display:none;visibility:hidden;height:1px;',
            src: src
        });
    },
    formatErrorMessage: function(d) {
        var eMsg = '',
            vTxt = '';
        if (!Ext.isEmpty(d.MSG)) {
            eMsg = Valence.lang.lit[d.MSG];
            if (Ext.isEmpty(eMsg)) {
                return d.MSG;
            }
            if (eMsg.indexOf('VAR1') !== -1) {
                vTxt = d.VAR1;
                vTxt = Ext.isEmpty(vTxt) ? '' : vTxt;
                eMsg = eMsg.replace('VAR1', vTxt);
            }
            if (eMsg.indexOf('VAR2') !== -1) {
                vTxt = d.VAR2;
                vTxt = Ext.isEmpty(vTxt) ? '' : vTxt;
                eMsg = eMsg.replace('VAR2', vTxt);
            }
            if (eMsg.indexOf('VAR3') !== -1) {
                vTxt = d.VAR3;
                vTxt = Ext.isEmpty(vTxt) ? '' : vTxt;
                eMsg = eMsg.replace('VAR3', vTxt);
            }
        }
        return eMsg;
    },
    getDynamicFieldWidth: function(fieldInfo, view, fieldNameAsLabel, bothFieldDesc) {
        var me = this,
            getInputMetrics = function() {
                var tm = view.measurer,
                    el;
                if (Ext.isEmpty(tm)) {
                    el = view.el.createChild();
                    el.addCls('x-form-field x-form-text x-form-text-default').applyStyles({
                        display: 'none'
                    });
                    view.measurer = tm = new Ext.util.TextMetrics(el);
                    //listen for the destroy of the view so we can destroy the textMetrics
                    //
                    view.on({
                        scope: me,
                        beforedestroy: function(view) {
                            //check for input text metrics
                            //
                            if (!Ext.isEmpty(view.measurer)) {
                                view.measurer.destroy();
                                view.measurer = null;
                            }
                            //check for label text metrics
                            //
                            if (!Ext.isEmpty(view.labelMeasurer)) {
                                view.labelMeasurer.destroy();
                                view.labelMeasurer = null;
                            }
                        }
                    });
                }
                return tm;
            },
            getLabelMetrics = function() {
                var tm = view.labelMeasurer,
                    el;
                if (Ext.isEmpty(tm)) {
                    el = view.el.createChild();
                    el.addCls('x-form-item-label-inner-default').applyStyles({
                        display: 'none'
                    });
                    view.labelMeasurer = tm = new Ext.util.TextMetrics(el);
                }
                return tm;
            },
            width, label, labelWidth;
        if (Ext.isEmpty(bothFieldDesc)) {
            bothFieldDesc = false;
        } else if (bothFieldDesc) {
            label = fieldInfo.FLD + ' - ' + fieldInfo.TXT;
        }
        if (Ext.isEmpty(label)) {
            if (fieldNameAsLabel) {
                label = fieldInfo.FLD;
            } else {
                label = fieldInfo.TXT;
            }
        }
        if (Ext.isEmpty(fieldNameAsLabel)) {
            fieldNameAsLabel = false;
        }
        if (fieldInfo.LEN >= 750) {
            width = 750;
        } else {
            var placeholderId = (fieldInfo.TYPE === 'Numeric' || fieldInfo.TYPE === 'N') ? 8 : 'w',
                placeholderArray = new Array(fieldInfo.LEN + 1),
                inputPlaceholder = placeholderArray.join(placeholderId);
            if (fieldInfo.TYPE === 'Date' || fieldInfo.TYPE === 'L') {
                width = 80;
            } else {
                width = getInputMetrics().getWidth(inputPlaceholder);
                //make sure its not larger than 750
                //
                if (width > 750) {
                    width = 750;
                }
            }
        }
        labelWidth = getLabelMetrics().getWidth(label) + 10;
        return {
            width: (width >= labelWidth) ? width : labelWidth,
            labelWidth: labelWidth,
            inputWidth: (width < labelWidth) ? width + 20 : width
        };
    },
    getLit: function(o) {
        var isObj = Ext.isObject(o),
            lit = !isObj ? o : o.lit,
            text;
        if (lit) {
            text = Valence.lang.lit[lit];
            if (text && isObj && o.var1) {
                text = text.replace('VAR1', Valence.util.Helper.decodeUTF16(o.var1 + ''));
            }
            if (text && isObj && o.var2) {
                text = text.replace('VAR2', Valence.util.Helper.decodeUTF16(o.var2 + ''));
            }
            if (text && isObj && o.var3) {
                text = text.replace('VAR3', Valence.util.Helper.decodeUTF16(o.var3 + ''));
            }
        } else {
            if (!Ext.isEmpty(o.msg)) {
                text = o.msg;
            } else if (!Ext.isEmpty(o.MSG)) {
                text = o.MSG;
            }
        }
        return text;
    },
    loadMask: function(o) {
        var me = this,
            obj = Ext.isObject(o) ? o : {
                text: o
            },
            text = obj.text,
            type = obj.type || 'rect',
            el = obj.renderTo || Ext.getBody(),
            cmp;
        // ensure a mask does not already exist for this el...
        //
        if (Ext.isEmpty(me.loadMaskMC.get(el.id))) {
            if (Ext.isClassic) {
                cmp = Ext.create('Valence.common.widget.Loadmask', {
                    text: text || '&nbsp;',
                    renderTo: el,
                    type: type
                });
            } else {
                cmp = Ext.create('Valence.common.widget.Loadmask', {
                    data: {
                        text: text || '&nbsp;'
                    },
                    renderTo: el,
                    type: type
                });
            }
            me.loadMaskMC.add(el.id, cmp);
        }
    },
    showBgTransition: function(o) {
        var me = this,
            obj = o || {},
            pos = obj.position || [
                1,
                1
            ],
            style = obj.style || {},
            scale = (Ext.getBody().getWidth() / 20) + 50,
            text = 'scale(' + scale + ')',
            cmp;
        cmp = Ext.widget('widget_background', {
            renderTo: Ext.getBody()
        });
        cmp.el.setStyle(Ext.apply(style, {
            'transform': text,
            '-webkit-transform': text,
            '-ms-transform': text
        }));
        cmp.showAt(pos);
        return cmp;
    },
    uppercaseFirstCharOnly: function(v) {
        if (!Ext.isEmpty(v)) {
            return v.substring(0, 1).toUpperCase() + v.substring(1).toLowerCase();
        }
        return '';
    }
});

/**
 * Utility class for displaying a "snackbar".
 * Snackbars provide lightweight feedback about an operation by showing a brief message at the bottom of the screen. Snackbars can contain an action.
 */
Ext.define('Valence.common.util.Snackbar', {
    singleton: true,
    config: {
        cmp: null,
        queue: [],
        active: false,
        anchor: null
    },
    buildComponent: function() {
        var me = this;
        return Ext.create('Ext.Component', {
            cls: Ext.Classic ? 'w-snackbar-outer' : 'w-snackbar-outer w-snackbar-full',
            renderTo: Ext.getBody(),
            tpl: [
                '<div class="w-snackbar-text">',
                '<span>{text}</span>',
                '<tpl if="buttonText">',
                '<span class="w-snackbar-btn">{[fm.uppercase(values.buttonText)]}</span>',
                '</tpl>',
                '</div>'
            ],
            listeners: {
                scope: me,
                render: me.onRenderCmp
            }
        });
    },
    onClickButton: function() {
        var me = this,
            obj = me.getActive();
        if (obj && typeof obj.handler === "function") {
            Ext.callback(obj.handler, obj.scope || me);
            me.processHide();
        }
    },
    onDestroyCmp: function(cmp) {
        var me = this;
        cmp.el.un('click', me.onClickButton, me);
    },
    onRenderCmp: function(cmp) {
        var me = this;
        cmp.el.on({
            scope: me,
            delegate: 'span.w-snackbar-btn',
            click: me.onClickButton,
            destroy: me.onDestroyCmp
        });
    },
    processHide: function() {
        var me = this,
            cmp = me.getCmp(),
            active = me.getActive(),
            push = active.push || false,
            queue = me.getQueue();
        me.setActive(false);
        cmp.el.removeCls('is-active');
        if (push || !Ext.isClassic) {
            Ext.getBody().down('div').removeCls('is-active');
        }
        if (queue && queue.length > 0) {
            setTimeout(function() {
                me.show(queue[0], true);
            }, 300);
        }
    },
    /**
     * Show the snackbar. If the snackbar is already being shown, it will queue this call and process when it is its turn.
     *
     * ## Example usage
     *      Valence.common.util.Snackbar.show('User has been deleted');
     *
     * ## Example usage - with button
     *     Valence.common.util.Snackbar.show({
     *         text       : 'User has been deleted',
     *         buttonText : 'Undo',
     *         scope      : me,
     *         handler    : me.onUndoDeleteUser
     *     });
     *
     * @param {Object} config The following config values are supported:
     * @param {String} config.text
     * @param {Number} [config.duration=4000] The amount of time (in milliseconds) before the snackbar is automatically hidden.
     * @param {String} [config.buttonText]
     * @param {Object} [config.scope=this] Specify the scope for the handler.
     * @param {Fuction} [config.handler] Function to call if the button is clicked.
     * @param {Boolean} [config.push=false] Specify true to have the snackbar push up the body (as opposed to float above it)
     */
    show: function(o, queue) {
        var me = this,
            obj = Ext.isObject(o) ? o : {
                text: o,
                duration: 4000
            },
            push = obj.push || false,
            cmp;
        if (!me.getActive()) {
            if (Ext.isClassic) {
                me.setActive(obj);
            }
            // get a reference to the component, create it if it does not exist:
            //   update its contents
            //
            cmp = me.getCmp();
            if (!cmp) {
                cmp = me.buildComponent();
                me.setCmp(cmp);
            }
            if (Ext.isClassic) {
                cmp.update(obj);
            } else {
                cmp.setData(obj);
                me.setActive(obj);
            }
            // if pushing the body up, add the appropriate classes
            //
            if (push) {
                Ext.getBody().down('div').addCls('w-snackbar-push is-active');
                cmp.el.addCls('w-snackbar-full');
                if (Ext.isClassic) {
                    if (me.getAnchor() !== 'tl-bl') {
                        cmp.el.anchorTo(Ext.getBody(), 'tl-bl');
                        me.setAnchor('tl-bl');
                    }
                } else {
                    cmp.el.alignTo(Ext.getBody(), 'tl-bl');
                }
            } else {
                cmp.el.removeCls('w-snackbar-full');
                if (Ext.isClassic) {
                    if (me.getAnchor() !== 't-b') {
                        cmp.el.anchorTo(Ext.getBody(), 't-b');
                        me.setAnchor('t-b');
                    }
                } else {
                    cmp.el.alignTo(Ext.getBody(), 't-b');
                }
            }
            // show the component and set a timeout to auto hide it...
            //
            cmp.show().el.addCls('is-active');
            setTimeout(function() {
                me.processHide();
            }, obj.duration || 4000);
            // if this was a queued up show then remove it from the queue...
            //
            if (queue) {
                Ext.Array.removeAt(me.getQueue(), 0);
            }
        } else {
            me.getQueue() ? me.getQueue().push(obj) : me.setQueue([
                obj
            ]);
        }
    }
});

/**
 *  Utility class for displaying a dialog.
 *  Dialogs contain text focused on a specific task. They inform users about critical information and require users to make a decision.
 */
Ext.define('Valence.common.util.Dialog', {
    singleton: true,
    config: {
        cmp: null,
        scope: this,
        fnc: null
    },
    /**
     * Show the dialog.
     *
     * ## Example usage
     *      Valence.common.util.Dialog.show({
     *          title   : 'Are You Sure?',
     *          msg     : 'Please confirm that you are a jock.',
     *          buttons : [{
     *              text : 'Yes'
     *          },{
     *              text : 'No'
     *          }],
     *          handler     : function(btn){
     *              if (btn === 'yes'){
     *                  // do something...
     *                  //
     *              }
     *          }
     *      });
     *
     * ## Example usage - with button parmText and additional configs
     *     Valence.common.util.Dialog.show({
     *         msg      : 'Confirm that you are a jock',
     *         buttons : [{
     *             text     : 'Yes, I Am',
     *             parmText : 'yes'
     *         },{
     *             text     : 'No, I Am Not',
     *             parmText : 'no'
     *         }],
     *         handler     : function(btn){
     *             if (btn === 'yes'){
     *             }
     *         }
     *     });
     *
     * @param {Object} config The following config values are supported:
     * @param {String} [config.title]
     * @param {String} [config.msg] The body of the dialog.
     * @param {Boolean} [config.noButtons] If no buttons are wanted pass `true`.
     * @param {Array} config.buttons Specify the buttons to display. Upon clicking a button, the handler will be
     *                               called passing the lowercased button text as the parameter. If the button
     *                               has a property labeled "parmText" then that will be passed instead. If the
     *                               button has a property of "focusOnShow" set to true it will be focused after
     *                               showing the dialog.
     * @param {Fuction} [config.handler] Function to call if the button is clicked.
     * @param {Number} [config.minWidth] The minimum width of the dialog.
     * @param {Object} [config.scope=this] Specify the scope for the function handler.
     * @param {Object} [config.cfg] Additional configs to apply to the dialog window.
     */
    show: function(o) {
        var me = this,
            title = o.title || null,
            msg = o.msg || null,
            buttons = o.buttons || null,
            addlCfg = o.cfg || null,
            scope = o.scope || this,
            fnc = o.handler || null,
            minWidth = o.minWidth || null,
            minHeight = o.minHeight || null,
            noButtons = o.noButtons || false,
            focusButton = false,
            cfg = {
                ui: 'dialog',
                scrollable: 'y',
                autoWidth: true,
                minHeight: minHeight,
                maxHeight: 450,
                minWidth: minWidth,
                maxWidth: 600,
                resizable: false,
                closeAction: 'destroy',
                closable: false,
                title: title,
                header: (title !== null),
                buttonAlign: 'right',
                modal: true,
                html: msg,
                autoShow: true
            };
        if (!buttons && !noButtons) {
            Ext.log('An array of buttons must be passed');
        } else {
            if (addlCfg) {
                Ext.apply(cfg, addlCfg);
            }
            if (!noButtons) {
                for (var ii = 0; ii < buttons.length; ii++) {
                    buttons[ii].scope = me;
                    buttons[ii].handler = me.onClickButton;
                    if (buttons[ii].focusOnShow) {
                        focusButton = true;
                    }
                }
                cfg.buttons = buttons;
            } else {
                cfg.buttons = [];
            }
            //if focus on a button is requested listen to after render
            //
            if (focusButton) {
                Ext.apply(cfg, {
                    listeners: {
                        scope: me,
                        afterrender: me.onAfterRender
                    }
                });
            }
            me.setCmp(Ext.widget('window', cfg));
            me.setScope(scope);
            me.setFnc(fnc);
        }
    },
    onAfterRender: function(cmp) {
        var me = this,
            focusButton = cmp.down('button[focusOnShow=true]');
        if (!Ext.isEmpty(focusButton)) {
            setTimeout(function() {
                focusButton.focus();
            }, 150);
        }
    },
    onClickButton: function(btn) {
        var me = this,
            fnc = me.getFnc(),
            scope = me.getScope();
        me.getCmp().destroy();
        if (fnc) {
            Ext.callback(fnc, scope, [
                btn.parmText || Ext.util.Format.lowercase(btn.getText())
            ]);
            me.setFnc(null);
            me.setScope(this);
        }
    }
});

Ext.define('Valence.common.ux.grid.Renderer', {
    singleton: true,
    tick: function(v) {
        if (v === 'Y' || v === true || v == 1) {
            return '<div class="vvicon-in-cell vvicon-checkmark"></div>';
        }
    }
});

Ext.define('Valence.common.ux.grid.column.MenuColumn', {
    extend: 'Ext.grid.column.Column',
    xtype: 'menucolumn',
    width: 40,
    dataIndex: 'menuColumn',
    showMenu: true,
    draggable: false,
    sortable: false,
    menuDisabled: true,
    renderer: function() {
        return '<div class ="vvicon-more2 menu-column"></div>';
    }
});

Ext.define('Valence.common.ux.grid.column.RemoveColumn', {
    extend: 'Ext.grid.column.Column',
    xtype: 'removecolumn',
    width: 40,
    dataIndex: 'removeColumn',
    removeColumn: true,
    draggable: false,
    sortable: false,
    menuDisabled: true,
    renderer: function() {
        return '<div class ="vvicon-cancel-circle menu-column"></div>';
    }
});

/**
 * The Common.plugin.EmptyText plugin injects empty text on the component. It relies on the component
 * to provide emptyText either as a string or an object.  It will add a setIsEmpty method on the component
 * so the component can notify the plugin to show or hide the empty text. It looks at isEmpty on the component
 * to determine if it should show/hide the empty text.
 *
 * If you the empty text to show when the component is created just set the isEmpty to true. If isEmpty is not
 * found it assumes the component is not empty.
 *
 * ## Example emptyText as an object
 *     @example
 *     Ext.create('Common.form.Panel', {
 *         plugins : [{
 *             ptype : 'emptytext',
 *         }],
 *         isEmpty   : false,
 *         emptyText :   {
 *             heading     :   'No orders matched your search.',
 *             subText     :   'Try another search combination or run one of your previously {0}.',
 *             events      :   [{
 *                 text    :   'saved searches',
 *                 event   :   'savedsearch'
 *             }]
 *          }
 *     });
 *
 * Runtime showing or hiding the empty text
 *     @example
 *     component.setIsEmpty(true);
 *     component.setIsEmpty(false);
 *
 * ## Example emptyText as an object
 * emptyText {Object} : {
 *     heading : {String} Provides the main text for the emptyText
 *     subText : {String} (optional) Provides additional options for the users
 *     events  : {Array of "event" Objects} (requires subText to be provided as a formatted string.
 *     See Ext.util.Format.format()) Provide links for the user to perform other actions
 *     [{
 *          text    : {String}
 *          event   : {String} (lowercase) is used as the data-event property
 *     }]
 * }
 */
Ext.define('Valence.common.ux.plugin.EmptyText', {
    alias: 'plugin.emptytext',
    extend: 'Ext.plugin.Abstract',
    requires: [
        'Ext.dom.Helper',
        'Valence.common.util.Helper'
    ],
    pluginId: 'emptytext',
    config: {
        parentComponent: null,
        emptyElement: null,
        hiddenClass: 'vv-plugin-empty-text-hidden'
    },
    init: function(cmp) {
        var me = this;
        //store the component
        //
        me.setParentComponent(cmp);
        //start the setup of the empty text
        //
        me.setup(cmp);
    },
    /**
     * Create the empty text
     */
    createEmptyElement: function(cmp) {
        var me = this,
            cls = 'vv-plugin-empty-text',
            emptyText = cmp.emptyText,
            cmpEl = cmp.getEl();
        //if empty text is just a string set it as an object with
        // the value in the heading
        //
        if (Ext.isString(emptyText)) {
            emptyText = {
                heading: emptyText
            };
        }
        //default to not empty if isEmpty is not provided
        //
        if (Ext.isEmpty(cmp.isEmpty)) {
            cmp.isEmpty = false;
        }
        //check if we should default the empty text to hidden
        //
        if (!cmp.isEmpty) {
            cls += ' ' + me.getHiddenClass();
        }
        //add the empty text to the parent
        //
        me.setEmptyElement(Ext.get(Ext.dom.Helper.insertFirst(cmpEl, {
            tag: 'div',
            cls: cls,
            cn: [
                Valence.common.util.Helper.buildEmptyText(emptyText)
            ]
        })));
        //set the click listener on the component
        //
        cmpEl.mon(cmpEl, {
            scope: me,
            delegate: 'span.vv-empty-text-event',
            click: me.onClickParentComponent
        });
    },
    /**
     * Fire event when user clicks on empty text items if available
     */
    onClickParentComponent: function(e) {
        var me = this,
            el = Ext.get(e.getTarget()),
            event = el.getAttribute('data-event'),
            cmp = me.getParentComponent();
        //fire the empty text events when passed in
        //
        if (event && !Ext.isEmpty(cmp)) {
            cmp.fireEvent(event, cmp);
        }
    },
    /**
     * Set isEmpty and show/hide the empty text
     */
    setIsEmpty: function(value) {
        var me = this,
            cmp = me.getParentComponent(),
            el = me.getEmptyElement();
        cmp.isEmpty = value;
        if (el) {
            if (!value) {
                //hide the empty text
                //
                el.addCls(me.getHiddenClass());
            } else {
                //show the empty text
                //
                el.removeCls(me.getHiddenClass());
            }
        }
    },
    /**
     * Setup the empty text.
     */
    setup: function(cmp) {
        var me = this;
        //make sure the component doesn't already have a method of `setIsEmpty` and provides
        // emptyText
        //
        if (Ext.isEmpty(cmp.setIsEmpty) && !Ext.isEmpty(cmp.emptyText)) {
            //add the setIsEmpty method on the component
            // that will show and hide empty text
            //
            cmp.setIsEmpty = Ext.bind(me.setIsEmpty, me);
            //create the empty text once we have the components element
            //
            if (!Ext.isEmpty(cmp.getEl())) {
                me.createEmptyElement(cmp);
            } else {
                cmp.on({
                    scope: me,
                    afterrender: me.createEmptyElement
                });
            }
        } else {
            if (Ext.isEmpty(cmp.setIsEmpty)) {
                Ext.log({
                    msg: 'Valence.common.plugin.EmptyText not able to act on component because it already has a setIsEmpty method.'
                });
            } else {
                Ext.log({
                    msg: 'Valence.common.plugin.EmptyText is attached but emptyText is not set.'
                });
            }
        }
    }
});

Ext.define('Valence.common.ux.plugin.form.field.ClearValue', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.formfieldclearvalue',
    config: {
        boundCmp: null,
        triggerKey: 'clear'
    },
    pluginId: 'clearvalue',
    disabled: false,
    verbose: false,
    hideOnBlur: false,
    init: function(field) {
        if (!field.isFormField) {
            if (this.verbose) {
                console.log('Must be a form field');
            }
            return;
        }
        var me = this,
            triggers = field.getTriggers(),
            key = me.getTriggerKey(),
            fieldListeners = {
                scope: me,
                change: me.onChange,
                reset: me.onReset,
                render: me.onRender
            };
        me.setBoundCmp(field);
        if (!triggers) {
            triggers = {};
        }
        if (triggers[key] !== undefined) {
            if (me.verbose) {
                console.error('Component ' + field.getId() + ' already has a trigger with the key "' + key + '". Will not initialize "formfieldclearvalue" on this field.');
            }
            return;
        }
        triggers[key] = me.defineTrigger();
        //be sure keyEvents are turned on; then listen for keyup
        field.enableKeyEvents = true;
        if (me.hideOnBlur) {
            //add additional listeners for blur/focus
            //
            Ext.apply(fieldListeners, {
                blur: me.onBlur,
                focus: me.onFocus
            });
        }
        field.on(fieldListeners);
        field.setTriggers(triggers);
        me.callParent(arguments);
    },
    disable: function() {
        var me = this,
            fld = me.getCmp(),
            triggers = fld.getTriggers();
        if (!Ext.isEmpty(triggers.clear)) {
            triggers.clear.hide();
            triggers.clear.el.fadeOut();
        }
        me.disabled = true;
        me.callParent(arguments);
    },
    enable: function() {
        var me = this,
            fld = me.getCmp(),
            triggers = fld.getTriggers();
        me.disabled = false;
        if (!Ext.isEmpty(triggers.clear)) {
            if (Ext.isEmpty(fld.getValue()) || fld.readOnly) {
                triggers.clear.setHidden(true);
                triggers.clear.el.fadeOut();
            }
        }
        me.callParent(arguments);
    },
    onClickClearInput: function() {
        var me = this,
            fld = me.getCmp(),
            key = me.getTriggerKey(),
            trigger = fld.triggers[key];
        fld.setValue('');
        trigger.hide();
        fld.fireEvent('clear', fld);
    },
    onChange: function(cmp) {
        var me = this,
            val = cmp.getValue(),
            key = me.getTriggerKey(),
            trigger = cmp.triggers[key];
        if (cmp.hasFocus) {
            if (!me.disabled && !cmp.readOnly) {
                trigger[!Ext.isEmpty(val) ? 'show' : 'hide']();
            } else {
                trigger.el['fadeOut']();
            }
        }
    },
    onReset: function(cmp) {
        var me = this,
            key = me.getTriggerKey(),
            trigger = cmp.triggers[key];
        trigger.hide();
    },
    onBlur: function(cmp) {
        var me = this,
            key = me.getTriggerKey(),
            clearTrigger = cmp.triggers[key];
        if (!Ext.isEmpty(clearTrigger)) {
            clearTrigger.hide();
        }
    },
    onFocus: function(cmp) {
        var me = this,
            key = me.getTriggerKey(),
            clearTrigger = cmp.triggers[key];
        if (!Ext.isEmpty(clearTrigger) && !Ext.isEmpty(cmp.getValue())) {
            clearTrigger.show();
        }
    },
    onRender: function(cmp) {
        var me = this,
            val = cmp.getValue(),
            key = me.getTriggerKey();
        if (!me.disabled && !cmp.readOnly) {
            if (!Ext.isEmpty(val)) {
                cmp.triggers[key].el['fadeIn']();
            }
        } else //cmp.triggers[key].el[!Ext.isEmpty(val) ? 'fadeIn' : 'fadeOut']();
        {
            cmp.triggers[key].el['fadeOut']();
        }
    },
    defineTrigger: function() {
        var me = this;
        return {
            scope: me,
            weight: 1,
            //place after existing triggers
            hidden: true,
            cls: 'vvicon-cancel-circle vv-icon-trigger-medium',
            handler: me.onClickClearInput,
            style: 'display:none;'
        };
    }
});

Ext.define('Valence.common.ux.plugin.grid.Multisort', {
    extend: 'Ext.plugin.Abstract',
    requires: [
        'Ext.ux.BoxReorderer'
    ],
    alias: 'plugin.gridmultisort',
    config: {
        /**
         * @cfg {Array} additionalItems they will be automatically set with reorderable : false if not already set.
         * They will be automatically right aligned.
         */
        additionalItems: [],
        boundCmp: null,
        dock: 'bottom',
        height: 39,
        hideWhenEmpty: true,
        useColumnDescription: true,
        ui: 'default',
        cls: null
    },
    init: function(grid) {
        var me = this,
            cls = 'p-multisort-bar',
            additionalItems = me.getAdditionalItems(),
            hideWhenEmpty = me.getHideWhenEmpty(),
            items = [
                {
                    xtype: 'tbtext',
                    itemId: 'sortText',
                    text: Valence.lang.lit.sort,
                    reorderable: false,
                    hidden: !hideWhenEmpty,
                    margin: 0
                }
            ],
            bar;
        //check for additional items and if passed make sure they
        // have reorderable : false set
        //
        if (additionalItems.length > 0) {
            items.push({
                xtype: 'tbfill',
                reorderable: false
            });
            //add additional items
            for (var ii = 0; ii < additionalItems.length; ii++) {
                items.push(Ext.apply(additionalItems[ii], {
                    reorderable: false
                }));
            }
        }
        grid.multiColumnSort = true;
        if (me.getCls()) {
            cls += ' ' + me.getCls();
        }
        bar = grid.addDocked({
            xtype: 'toolbar',
            ui: me.getUi(),
            style: {
                opacity: (hideWhenEmpty) ? 0 : 1
            },
            hidden: hideWhenEmpty,
            dock: me.getDock(),
            height: me.getHeight(),
            itemId: 'multisort_bar',
            cls: cls,
            defaults: {
                reorderable: true
            },
            plugins: Ext.create('Ext.ux.BoxReorderer', {
                listeners: {
                    scope: me,
                    drop: me.onDropItem
                }
            }),
            items: items,
            listeners: {
                scope: me,
                el: {
                    scope: me,
                    delegate: 'div.p-multisort-item',
                    click: me.onClickBarItem
                }
            }
        });
        grid.on({
            scope: me,
            sortchange: me.onSortChangeGrid
        });
        me.setBoundCmp(grid);
    },
    onClickBarItem: function(e, element) {
        var me = this,
            cmp = Ext.getCmp(element.id),
            target = Ext.get(e.getTarget());
        if (target.hasCls('multisort-remove')) {
            cmp.el.fadeOut({
                callback: function() {
                    cmp.destroy();
                    me.onDropItem();
                }
            });
        } else {
            //change the sort direction
            //
            var grid = me.getBoundCmp(),
                store = grid.getStore(),
                sorters = store.getSorters(),
                getNewSorters = function() {
                    var newSorters = [];
                    for (var ii = 0; ii < sorters.items.length; ii++) {
                        newSorters.push(sorters.items[ii]);
                    }
                    return newSorters;
                },
                colSort;
            if (!Ext.isEmpty(cmp) && !Ext.isEmpty(cmp.property)) {
                colSort = sorters.get(cmp.property);
                if (!Ext.isEmpty(colSort)) {
                    colSort.toggle();
                    store.setSorters(getNewSorters());
                }
            }
        }
    },
    onClickRemove: function(e, element) {
        var me = this,
            el = Ext.get(element),
            cmpElId = el.up('div.p-multisort-item').id,
            cmp = Ext.getCmp(cmpElId);
        cmp.el.fadeOut({
            callback: function() {
                cmp.destroy();
                me.onDropItem();
                me.onSortChangeGrid();
            }
        });
    },
    onDropItem: function() {
        var me = this,
            grid = me.getBoundCmp(),
            str = grid.getStore(),
            bar = grid.down('#multisort_bar'),
            cmps = bar.query('[removable]'),
            sorters = [];
        for (var ii = 0; ii < cmps.length; ii++) {
            sorters.push({
                property: cmps[ii].property,
                direction: cmps[ii].direction
            });
        }
        str.sort(sorters);
        me.onSortChangeGrid();
        //fire drop event
        //
        grid.fireEvent('multisortdropitem', grid, me);
    },
    onSortChangeGrid: function() {
        var me = this,
            grid = me.getBoundCmp(),
            str = grid.getStore(),
            sorters = str.getSorters(),
            bar = grid.down('#multisort_bar'),
            fm = Ext.util.Format,
            markup = '<b>{0}</b> {1}<div class="multisort-remove vvicon-cancel-circle"></div>',
            markup2 = '<b>{0}</b> {1}',
            hideWhenEmpty = me.getHideWhenEmpty(),
            sorter, cmps, text, index, col;
        cmps = (bar) ? bar.query('[removable]') : [];
        Ext.suspendLayouts();
        for (var ii = 0; ii < cmps.length; ii++) {
            cmps[ii].destroy();
        }
        cmps.length = 0;
        for (var ii = 0; ii < sorters.items.length; ii++) {
            sorter = sorters.items[ii];
            if (me.getUseColumnDescription()) {
                index = grid.headerCt.items.findIndex('dataIndex', sorter.getProperty());
                if (index !== -1) {
                    col = grid.headerCt.items.getAt(index);
                    text = col.text || col.header || fm.uppercase(sorter.getProperty());
                }
            } else {
                text = fm.uppercase(sorter.getProperty());
            }
            cmps.push({
                xtype: 'component',
                cls: 'p-multisort-item',
                margin: '0 5 0 0',
                html: Ext.String.format((ii === 0) ? markup2 : markup, text, fm.lowercase(sorter.getDirection())),
                removable: true,
                property: sorter.getProperty(),
                direction: sorter.getDirection()
            });
        }
        bar.insert(1, cmps);
        if (sorters.items.length > 0) {
            bar.show();
            bar.el.fadeIn();
            if (!hideWhenEmpty) {
                bar.down('#sortText').show();
            }
        } else if (hideWhenEmpty) {
            bar.el.fadeOut({
                callback: function() {
                    bar.hide();
                }
            });
        }
        Ext.resumeLayouts(true);
    }
});

Ext.define('Valence.common.view.filevalidator.FilevalidatorModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.filevalidator',
    stores: {
        Libraries: {
            fields: [
                'VVOBJECT'
            ],
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '/valence/vvcall.pgm',
                reader: {
                    type: 'json',
                    rootProperty: 'VVDSUTIL3'
                },
                extraParams: {
                    action: 'getLibraries',
                    pgm: 'vvdatasrc'
                }
            },
            listeners: {
                load: function(str) {
                    str.insert(0, {
                        VVOBJECT: '*LIBL'
                    });
                }
            }
        }
    },
    data: {
        includeFileData: 1
    }
});

Ext.define('Valence.common.view.filevalidator.Select', {
    extend: 'Ext.window.Window',
    xtype: 'filevalidator-select',
    layout: 'fit',
    height: 350,
    width: 600,
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            buttons: me.buildButtons(),
            items: me.buildItems()
        });
        me.callParent(arguments);
    },
    buildButtons: function() {
        var me = this;
        return [
            {
                text: Valence.lang.lit.cancel,
                scope: me,
                handler: 'onEsc'
            }
        ];
    },
    buildItems: function() {
        var me = this;
        return [
            {
                xtype: 'grid',
                ui: 'background',
                margin: '8 16 16 16',
                store: Ext.create('Ext.data.Store', {
                    autoDestroy: true,
                    proxy: {
                        type: 'memory'
                    },
                    data: me.content.VVDSDATA04
                }),
                columns: {
                    defaults: {
                        menuDisabled: true,
                        flex: 1
                    },
                    items: [
                        {
                            text: Valence.lang.lit.file,
                            dataIndex: 'FILE'
                        },
                        {
                            text: Valence.lang.lit.library,
                            dataIndex: 'LIB'
                        },
                        {
                            text: Valence.lang.lit.description,
                            dataIndex: 'TEXT',
                            flex: 2
                        }
                    ]
                },
                listeners: {
                    scope: me,
                    itemclick: 'onItemclick'
                }
            }
        ];
    },
    onItemclick: function(view, rec) {
        this.fireEvent('itemclick', rec, this);
    }
});

Ext.define('Valence.common.view.filevalidator.SelectMember', {
    extend: 'Ext.window.Window',
    xtype: 'filevalidator-selectmember',
    layout: 'fit',
    height: 350,
    width: 450,
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            buttons: me.buildButtons(),
            items: me.buildItems()
        });
        me.callParent(arguments);
    },
    buildButtons: function() {
        var me = this;
        return [
            {
                text: Valence.lang.lit.cancel,
                scope: me,
                handler: 'onEsc'
            }
        ];
    },
    buildItems: function() {
        var me = this;
        return [
            {
                xtype: 'grid',
                ui: 'background',
                margin: '8 16 16 16',
                store: Ext.create('Ext.data.Store', {
                    autoDestroy: true,
                    proxy: {
                        type: 'memory'
                    },
                    data: me.content.VVDSDATA06
                }),
                columns: {
                    defaults: {
                        menuDisabled: true,
                        flex: 1
                    },
                    items: [
                        {
                            text: Valence.lang.lit.member,
                            dataIndex: 'MEMBER'
                        },
                        {
                            text: Valence.lang.lit.description,
                            dataIndex: 'TEXT',
                            flex: 2
                        }
                    ]
                },
                listeners: {
                    scope: me,
                    itemclick: 'onItemclick'
                }
            }
        ];
    },
    onItemclick: function(view, rec) {
        this.fireEvent('itemclick', rec, this);
    }
});

Ext.define('Valence.common.view.filevalidator.FilevalidatorController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filevalidator',
    requires: [
        'Valence.common.view.filevalidator.Select',
        'Valence.common.view.filevalidator.SelectMember'
    ],
    onClickAddFile: function(btn) {
        var me = this,
            view = me.getView();
        if (view.isValid()) {
            view.el.mask();
            me.processValidateFile().then(me.processAddFile).then(null, me.processAddFileReject);
        }
    },
    onItemclickFileSelection: function(rec, wdw) {
        var me = this,
            vm = me.getViewModel();
        vm.set({
            filename: rec.get('FILE'),
            member: ''
        });
        vm.notify();
        me.onClickAddFile();
        wdw.destroy();
    },
    onItemclickFileSelectionMember: function(rec, wdw) {
        var me = this,
            vm = me.getViewModel();
        vm.set({
            member: rec.get('MEMBER')
        });
        vm.notify();
        me.onClickAddFile();
        wdw.destroy();
    },
    onSpecialkeyFile: function(fld, e) {
        var me = this,
            vm = me.getViewModel();
        if (e.getKey() === e.ENTER && !vm.get('filevalidator_hideActionButton')) {
            me.onClickAddFile();
        } else if (e.getKey() === e.ENTER) {
            var view = me.getView();
            view.fireEvent('enterkey', view, fld);
        }
    },
    processAddFile: function(content) {
        var me = content.scope,
            view = me.getView(),
            member = (!Ext.isEmpty(content.params.member)) ? content.params.member : '';
        me.fireViewEvent('filevalid', view, Ext.apply(content, {
            FILE: view.lookupReference('filefield').getValue(),
            MEMBER: member
        }));
        view.el.unmask();
    },
    processAddFileReject: function(content) {
        var me = content.scope,
            view = me.getView();
        if (!Ext.isEmpty(content.VVDSDATA04)) {
            Ext.widget('filevalidator-select', {
                title: content.totalCount + ' File(s) Found',
                renderTo: Ext.getBody(),
                content: content,
                listeners: {
                    scope: me,
                    itemclick: 'onItemclickFileSelection'
                }
            }).show();
        } else if (!Ext.isEmpty(content.VVDSDATA06)) {
            Ext.widget('filevalidator-selectmember', {
                title: content.totalCount + ' Member(s) Found',
                renderTo: Ext.getBody(),
                content: content,
                listeners: {
                    scope: me,
                    itemclick: 'onItemclickFileSelectionMember'
                }
            }).show();
        } else {
            me.fireViewEvent('fileinvalid');
            if (content.success === '3') {
                Valence.common.util.Snackbar.show(Valence.lang.lit.noResults);
            } else {
                Valence.common.util.Snackbar.show(Valence.common.util.Helper.getLit({
                    lit: 'fileNotFound',
                    var1: content.params.file
                }));
            }
        }
        view.el.unmask();
    },
    processValidateFile: function() {
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            vm = me.getViewModel(),
            view = me.getView(),
            vals = view.getValues(),
            params = {
                pgm: 'vvdatasrc',
                action: 'getFileFields',
                fileData: vm.get('includeFileData')
            };
        Ext.apply(params, vals);
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            params: params,
            success: function(r) {
                var d = Ext.decode(r.responseText);
                if (d.success === true) {
                    deferred.resolve(Ext.apply(d, {
                        scope: me,
                        params: params
                    }));
                } else {
                    deferred.reject(Ext.apply(d, {
                        scope: me,
                        params: params
                    }));
                }
            }
        });
        return deferred.promise;
    }
});

Ext.define('Valence.common.view.filevalidator.Filevalidator', {
    extend: 'Ext.form.Panel',
    requires: [
        'Valence.common.view.filevalidator.FilevalidatorModel',
        'Valence.common.view.filevalidator.FilevalidatorController'
    ],
    xtype: 'filevalidator',
    viewModel: {
        type: 'filevalidator'
    },
    controller: 'filevalidator',
    defaults: {
        labelAlign: 'top',
        labelSeparator: '',
        width: '100%'
    },
    bodyPadding: '8 24',
    initComponent: function() {
        var me = this;
        if (Ext.isEmpty(me.title)) {
            Ext.apply(me, {
                title: Valence.lang.lit.addFile
            });
        }
        Ext.apply(me, {
            items: me.buildItems()
        });
        me.callParent(arguments);
    },
    buildItems: function() {
        var me = this;
        return [
            {
                xtype: 'hiddenfield',
                name: 'member',
                bind: {
                    value: '{member}'
                }
            },
            {
                xtype: 'textfield',
                reference: 'filefield',
                forceUppercase: true,
                name: 'file',
                preventMark: true,
                maxLength: 10,
                enforceMaxLength: true,
                allowBlank: false,
                fieldLabel: Valence.lang.lit.file,
                bind: {
                    value: '{filename}'
                },
                listeners: {
                    specialkey: 'onSpecialkeyFile'
                }
            },
            {
                xtype: 'combo',
                value: '*LIBL',
                bind: {
                    store: '{Libraries}',
                    hidden: '{filevalidator_hideLibrary}'
                },
                name: 'lib',
                queryMode: 'local',
                displayField: 'VVOBJECT',
                valueField: 'VVOBJECT',
                forceSelection: true,
                fieldLabel: Valence.lang.lit.library,
                triggerAction: 'all',
                listeners: {
                    specialkey: 'onSpecialkeyFile'
                }
            },
            {
                xtype: 'button',
                ui: 'primary',
                formBind: true,
                margin: '8 0 0 0',
                text: (Ext.isEmpty(me.actionButton)) ? Valence.lang.lit.add : me.actionButton,
                handler: 'onClickAddFile',
                bind: {
                    hidden: '{filevalidator_hideActionButton}'
                }
            }
        ];
    }
});

/**
 * The app bar is a "special" toolbar that’s used for branding, navigation, search, and actions.
 * The nav icon at the left side of the app bar can be:
 *
 * - A control to open a navigation drawer {@link Valence.common.widget.NavDrawer}.
 * - An up arrow for navigating upward through your app’s hierarchy.
 * - Omitted entirely if no navigation is required.
 *
 */
Ext.define('Valence.common.widget.Appbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'Ext.menu.Menu',
        'Ext.button.Cycle',
        'Valence.common.ux.plugin.form.field.ClearValue'
    ],
    xtype: 'widget_appbar',
    cls: 'x-toolbar-appbar',
    icons: null,
    noFill: false,
    endItems: [],
    bind: {
        hideDepth: '{appBarHideDepth}',
        UI: '{appBarUI}',
        searchActionsLength: '{appBarSearchActionsLength}',
        // fireFilterEvtOnly is primarily for action search in order to add filter text
        fireFilterEvtOnly: '{appBarFireFilterEvtOnly}',
        searchComponent: '{appBarSearchCmp}',
        appBarTitleMenuShowOnClick: '{appBarTitleMenuShowOnClick}'
    },
    config: {
        appBarTitleMenuShowOnClick: false,
        fireFilterEvtOnly: false,
        fireFilterEnterKeyOnEmpty: false,
        searchAction: false,
        searchActionValue: null,
        searchActionsLength: 3,
        searchActionStore: null,
        searchComponent: null,
        searchText: ''
    },
    /**
     * @event navigation
     * Fires when the navigation icon is clicked.
     *
     * @param {Valence.common.widget.Appbar} this
     * @param {Ext.button.Button} button
     *
     * @event back
     * Fires when the back icon is clicked.
     *
     * @param {Valence.common.widget.Appbar} this
     * @param {Ext.button.Button} button
     */
    initComponent: function() {
        var me = this;
        me.items = me.items || [];
        me.items.splice(0, 0, {
            ui: 'plain',
            iconCls: 'vvicon-arrow-left8',
            itemId: 'backbutton',
            bind: {
                hidden: '{!appBarBackIcon}'
            },
            scope: me,
            handler: me.onClickBack
        }, {
            ui: 'plain',
            iconCls: 'vvicon-menu7',
            bind: {
                hidden: '{!appBarNavIcon}'
            },
            scope: me,
            itemId: 'navbutton',
            handler: me.onClickNavigation
        }, {
            xtype: 'tbtext',
            itemId: 'title',
            cls: 'appbar-title',
            hidden: true,
            bind: {
                text: '{appBarTitle}',
                hidden: '{appBarTitleHide}'
            },
            listeners: {
                el: {
                    scope: me,
                    click: me.onClickTitle
                }
            }
        }, {
            xtype: 'cycle',
            showText: true,
            itemId: 'title_menu',
            cls: 'appbar-title',
            _focusCls: null,
            _menuActiveCls: null,
            _pressedCls: null,
            overCls: null,
            depth: false,
            scale: 'large',
            uppercase: false,
            bind: {
                hidden: '{appBarTitleMenuHide}',
                menu: '{appBarTitleMenu}'
            },
            listeners: {
                scope: me,
                change: me.onChangeTitleMenu,
                click: me.onClickTitleMenu
            }
        });
        if (!me.noFill) {
            me.items.push('->');
        }
        if (me.icons) {
            for (var ii = 0; ii < me.icons.length; ii++) {
                me.items.push(me.icons[ii]);
            }
        }
        if (me.searchAction) {
            me.setSearchActionStore(Ext.create('Ext.data.Store', {
                fields: [
                    'searchname',
                    'searchevent',
                    'searchcmptitle',
                    'searchfieldname',
                    'searchcmprec'
                ],
                data: [
                    {
                        searchname: 'Looking for records',
                        searchevent: null,
                        searchcmptitle: null,
                        searchfieldname: null,
                        searchcmprec: null
                    }
                ]
            }));
            me.items.push({
                xtype: 'combo',
                reference: 'searchField',
                width: 300,
                minChars: 2,
                hideLabel: true,
                hideTrigger: true,
                clearValuePlugin: false,
                forceSelection: false,
                store: me.getSearchActionStore(),
                displayField: 'name',
                tpl: [
                    '<tpl for=".">',
                    '<tpl if="searchcmptitle">',
                    '<div class="x-boundlist-item">',
                    '<div style="width:100%;padding:8px;display:table;">',
                    '<div style="display:table-cell;vertical-align:middle;">',
                    '<div style="font-size:16px;font-weight:500;color:rgba(0,0,0,.87)">{searchname}</div>',
                    '<div style="font-size:13px;font-weight:400;color:rgba(0,0,0,.54)">Select from {searchcmptitle}</div>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '<tpl elseif="searchevent == \'filter-0\'">',
                    '<div class="x-boundlist-item" style="border-top: 1px solid #ddd">',
                    '<div style="width:100%;padding:8px;display:table;">',
                    '<div style="display:table-cell;vertical-align:middle;">',
                    '<div style="line-height:16px; font-size:14px;font-weight:500;color:rgba(0,0,0,.54); text-align:center;"><span style="position: relative; top:1px;line-height:14px; font-size:14px; padding-right:16px;" class="vvicon-filter3"></span>{searchname}</div>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '<tpl else>',
                    '<div class="x-boundlist-item" style="border-top: 1px solid #ddd">',
                    '<div style="width:100%;padding:8px;display:table;">',
                    '<div style="display:table-cell;vertical-align:middle;">',
                    '<tpl if="searchevent">',
                    '<div style="line-height:16px;font-size:14px;font-weight:500;color:rgba(0,0,0,.54);text-align:center;">',
                    '<span style="position: relative; top:1px;line-height:14px; font-size:14px; padding-right:16px;" class="vvicon-filter3"></span>',
                    '{searchname}',
                    '</div>',
                    '<tpl else>',
                    '<div style="font-size:14px;font-weight:500;color:rgba(0,0,0,.54)">',
                    '{searchname}',
                    '</div>',
                    '</tpl>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '</tpl>',
                    '</tpl>'
                ],
                plugins: [
                    {
                        ptype: 'formfieldclearvalue',
                        hideOnBlur: true
                    }
                ],
                listeners: {
                    focus: function() {
                        me.oldUI = me.ui;
                        me.setUI('background');
                    },
                    blur: function() {
                        me.setUI(me.oldUI);
                    },
                    change: {
                        fn: me.onChangeSearchCmp,
                        buffer: 500
                    },
                    select: me.onSelectSearchCmp,
                    scope: me
                },
                bind: {
                    hidden: '{!appBarSearch}',
                    emptyText: '{appBarSearchEmptyText}'
                }
            });
        } else {
            me.items.push({
                xtype: 'textfield',
                reference: 'searchField',
                width: 300,
                itemId: 'filterfield',
                hideLabel: true,
                clearValuePlugin: false,
                hideMode: 'offsets',
                plugins: [
                    {
                        ptype: 'formfieldclearvalue',
                        hideOnBlur: true
                    }
                ],
                listeners: {
                    focus: function() {
                        me.oldUI = me.ui;
                        me.setUI('background');
                        me.fireEvent('focussearch', me);
                    },
                    blur: function() {
                        me.setUI(me.oldUI);
                        me.fireEvent('blursearch', me);
                    },
                    change: me.onChangeFilter,
                    clear: me.onClearFilterTrigger,
                    specialkey: me.onSpecialKeyFilter,
                    scope: me
                },
                bind: {
                    hidden: '{!appBarSearch}',
                    emptyText: '{appBarSearchEmptyText}',
                    value: '{appBarSearchValue}'
                }
            });
        }
        me.items.push({
            ui: 'plain',
            iconCls: 'vvicon-search2',
            hideMode: 'offsets',
            bind: {
                hidden: '{!appBarSearchIcon}'
            }
        }, {
            ui: 'plain',
            iconCls: 'vvicon-more2',
            hideMode: 'offsets',
            bind: {
                hidden: '{!appBarMoreIcon}'
            }
        });
        if (!Ext.isEmpty(me.endItems) && Ext.isArray(me.endItems)) {
            me.items = Ext.Array.merge(me.items, me.endItems);
        }
        me.callParent(arguments);
    },
    onClickTitleMenu: function(cmp) {
        var me = this;
        if (me.getAppBarTitleMenuShowOnClick()) {
            cmp.showMenu();
        }
    },
    getSearchComponent: function() {
        var me = this,
            sc = me.searchComponent;
        if (!Ext.isEmpty(sc)) {
            if (!Ext.isArray(sc)) {
                return [
                    sc
                ];
            }
        }
        return sc;
    },
    onChangeTitleMenu: function(cmp, item) {
        var me = this,
            event = item.event;
        if (event) {
            me.fireEvent(event, me, item);
        }
    },
    onChangeFilter: function(fld, val) {
        var me = this;
        me.fireEvent('filterchange', fld, val);
        // if this appbar has a "searchComponent"...then automatically perform the filtering...
        //
        if (!Ext.isEmpty(me.getSearchComponent())) {
            me.performSearch(val, fld);
        }
    },
    onChangeSearchCmp: function(fld, val) {
        var me = this;
        me.performActionSearch(val);
        me.setSearchActionValue(val);
    },
    //me.fireEvent('filterchange', fld, val);
    onClearFilterTrigger: function(fld) {
        var me = this;
        me.fireEvent('cleartrigger', fld);
    },
    onClickBack: function(btn) {
        var me = this,
            backBtn = btn || me.down('#backbutton');
        me.fireEvent('back', me, backBtn);
    },
    onClickNavigation: function(btn) {
        var me = this;
        me.fireEvent('navigation', me, btn);
    },
    onClickTitle: function(el) {
        var me = this;
        me.fireEvent('titleclick', me, el);
    },
    onSelectSearchCmp: function(combo, rec) {
        var me = this,
            event = rec.get('searchevent');
        if (/filter/.test(event)) {
            me.performSearch(me.getSearchActionValue(), null, event.split('-')[1]);
            return;
        }
        me.fireEvent(rec.get('searchevent'), combo, rec);
    },
    onSpecialKeyFilter: function(fld, e) {
        var me = this,
            value = fld.getValue();
        if (e.getKey() == e.ENTER) {
            if (!Ext.isEmpty(value) || me.getFireFilterEnterKeyOnEmpty()) {
                me.fireEvent('filterenterkey', fld, value);
            }
        }
    },
    setAppBarTitleMenu: function(menu) {
        var me = this,
            title = me.down('#title'),
            tMenu = me.down('#title_menu'),
            item;
        if (Ext.isEmpty(menu)) {
            title.show();
            tMenu.hide();
        } else {
            title.hide();
            // Convert all items to CheckItems
            for (i = 0; i < menu.items; i++) {
                item = menu.items[i];
                item = Ext.applyIf({
                    group: me.id,
                    itemIndex: i,
                    checked: item.checked || false
                }, item);
                menu.items.push(item);
            }
            tMenu.setMenu(menu);
            tMenu.show();
        }
    },
    setHideDepth: function(noDepth) {
        var me = this;
        if (noDepth) {
            me.el.addCls('x-toolbar-appbar-no-depth');
        } else {
            me.el.removeCls('x-toolbar-appbar-no-depth');
        }
    },
    performActionSearch: function(val) {
        var me = this,
            srchRegEx = new RegExp(val, "i"),
            cmps = me.getSearchComponent(),
            srchActStr = me.getSearchActionStore(),
            maxLength = me.getSearchActionsLength() || 3,
            results = [],
            filters = [],
            length, cmp, str, rec, recs, cmpEvent, cmpTitle, srchFlds, primaryFld, cmpRsltCnt;
        srchActStr.removeAll();
        for (var i = 0; i < cmps.length; i++) {
            cmp = cmps[i];
            srchFlds = cmp.appBarSearchFields;
            cmpRsltCnt = 0;
            if (typeof srchFlds === 'undefined') {
                // todo -- add logic to handle all fields
                Ext.log({
                    msg: 'Appbar search component does not have any search fields'
                });
                
                continue;
            }
            primaryFld = srchFlds[0];
            str = (typeof cmp.getStore === "function") ? cmp.getStore() : null;
            if (!str) {
                Ext.log({
                    msg: 'Appbar search component does not have a getStore method'
                });
                
                continue;
            }
            cmpEvent = cmp.appBarSearchEvent;
            if (Ext.isEmpty(cmpEvent)) {
                Ext.log({
                    msg: 'Appbar search component does not have a search event'
                });
                
                continue;
            }
            cmpTitle = cmp.getTitle === 'function' ? cmp.getTitle() : cmp.getHeader().getTitle().text;
            if (cmpTitle.indexOf('(') > 0) {
                cmpTitle = cmpTitle.split('(')[0];
            }
            // todo -- handle missing title
            recs = str.queryBy(function(rec) {
                for (var i = 0; i < srchFlds.length; i++) {
                    if (srchRegEx.test(rec.get(srchFlds[i]))) {
                        return true;
                    }
                }
                return false;
            });
            recs = recs.items;
            length = recs.length < maxLength ? recs.length : maxLength;
            for (var j = 0; j < recs.length; j++) {
                rec = recs[j];
                cmpRsltCnt++;
                if (str.isFiltered() && str.findExact('id', rec.get('id')) == -1) {
                    
                    continue;
                }
                results.push({
                    searchfieldname: primaryFld,
                    searchname: rec.get(primaryFld),
                    searchevent: cmpEvent,
                    searchcmptitle: cmpTitle,
                    searchcmprec: rec
                });
                if (results.length == length) {
                    break;
                }
            }
            if (cmpRsltCnt > 0) {
                filters.push({
                    searchfieldname: null,
                    searchname: Ext.util.Format.format('Filter <i>{0}</i> for "{1}"', cmpTitle, val),
                    searchevent: 'filter-' + i,
                    searchcmptitle: null,
                    searchcmprec: null
                });
            }
        }
        results = Ext.Array.merge(results, filters);
        srchActStr.loadRawData(results);
    },
    performSearch: function(val, fld, index) {
        var me = this,
            cmp = me.getSearchComponent(),
            str;
        if (Ext.isEmpty(index)) {
            index = 0;
        }
        cmp = cmp[index];
        str = Ext.isFunction(cmp.getStore) ? cmp.getStore() : null;
        // maybe this is a store...
        //
        if (typeof cmp.filterBy === "function") {
            str = cmp;
        }
        if (!str) {
            Ext.log({
                msg: 'Appbar search component does not have a getStore method'
            });
        } else {
            var srchRegEx = new RegExp(val, "i"),
                srchFlds = cmp.appBarSearchFields;
            if (!srchFlds) {
                srchFlds = str.getModel().getFields().map(function(fld) {
                    return fld.name;
                });
            }
            if (Ext.isFunction(cmp.showFilterBar)) {
                //todo add this in 5.1
                cmp.showFilterBar(val, fld);
            }
            if (!me.getFireFilterEvtOnly()) {
                Valence.util.Helper.processTypedInputFilter(str, srchFlds, val, 'appbarsearch');
            } else {
                me.fireEvent('searchcmpchange', cmp, val);
            }
        }
    },
    buildFilterTag: function() {
        return new Ext.XTemplate('<div class="filter-cont">', '<div class="filter-label"><span data-event="clearfilter" class="vvicon-cross"></span>Filtered by: "{filter}"</div>', '</div>');
    },
    onClickFilterTag: function(e, el, o) {
        var me = this,
            d = el.getAttribute('data-event'),
            cmp = o.cmp,
            fld;
        if (!Ext.isEmpty(d) && d == 'clearfilter') {
            cmp.filterTag.hide();
            cmp.getStore().clearFilter();
            cmp.fireEvent(d, cmp);
        }
    }
});

/**
 * Toolbar with full width search field
 */
Ext.define('Valence.common.widget.DockedSearch', {
    extend: 'Ext.toolbar.Toolbar',
    requires: [
        'Ext.form.field.Text',
        'Valence.common.ux.plugin.form.field.ClearValue'
    ],
    xtype: 'widget_dockedsearch',
    padding: 0,
    dock: 'top',
    config: {
        /**
         * @cfg {Ext.data.Store} store
         * The store to automatically filter
         */
        store: null,
        /**
         * @cfg {Array} fields
         * The fields to filter on
         */
        fields: null
    },
    /**
     * @event searchchanged
     * If no store is provided and or fields this event will fire when the search is chagned
     *
     * @param {Valence.common.widget.DockedSearch} this
     * @param {String} value
     * @param {Ext.form.field.Text} search field
     *
     */
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            items: me.buildItems()
        });
        me.callParent(arguments);
    },
    buildItems: function() {
        var me = this;
        return [
            {
                xtype: 'textfield',
                itemId: 'dockedSearchField',
                emptyText: Valence.lang.lit.search,
                formItemCls: 'vv-form-item-full-width',
                plugins: [
                    {
                        ptype: 'formfieldclearvalue'
                    }
                ],
                listeners: {
                    scope: me,
                    change: me.onChangeSearch
                }
            }
        ];
    },
    getSearchValue: function() {
        var me = this,
            fld = me.down('#dockedSearchField');
        if (!Ext.isEmpty(fld)) {
            return fld.getValue();
        }
        return '';
    },
    onChangeSearch: function(fld, value) {
        var me = this,
            store = me.getStore(),
            fields = me.getFields();
        //if store and fields are provided automatically process the input
        //
        if (!Ext.isEmpty(store) && !Ext.isEmpty(fields)) {
            Valence.util.Helper.processTypedInputFilter(store, fields, value, 'dockedsearch');
        } else {
            //since store and or fields were not provided assume the typed input will
            // be processed manually
            //
            me.fireEvent('searchchanged', me, value, fld);
        }
    }
});

Ext.define('Valence.common.widget.FabWrapper', {
    extend: 'Ext.Container',
    xtype: 'widget_fabwrapper',
    width: 96,
    cls: 'vv-fabwrapper',
    positionPrefix: 'vv-fabwrapper-',
    position: 'br',
    initComponent: function() {
        var me = this;
        if (me.position) {
            me.cls += ' ' + me.positionPrefix + me.position;
        }
        Ext.apply(me, {
            layout: {
                type: 'vbox',
                align: 'middle'
            },
            shadow: false,
            floating: true,
            defaults: {
                floating: false,
                margin: '16 0 0 0',
                xtype: 'widget_floatingactionbutton',
                position: null,
                inFabWrapper: true,
                listeners: {
                    scope: me,
                    click: me.hideSubActions
                }
            }
        });
        me.callParent(arguments);
    },
    hideSubActions: function() {
        var me = this,
            hideCmps = me.query('[subAction]');
        for (var ii = 0; ii < hideCmps.length; ii++) {
            hideCmps[ii].hide();
        }
    },
    onParentLayout: function() {
        var me = this;
        me.el.alignTo(me.floatParent, me.position + '-' + me.position, [
            0,
            -32
        ]);
    },
    onRender: function() {
        var me = this;
        me.callParent(arguments);
        me.el.on({
            scope: me,
            mouseenter: me.showSubActions,
            mouseleave: me.hideSubActions
        });
        setTimeout(function() {
            me.el.alignTo(me.floatParent, me.position + '-' + me.position, [
                0,
                -32
            ]);
            me.mon(me.floatParent, 'afterlayout', me.onParentLayout, me);
        }, 100);
    },
    showSubActions: function() {
        var me = this,
            showCmps = me.query('[subAction]');
        for (var ii = 0; ii < showCmps.length; ii++) {
            showCmps[ii].show();
        }
    }
});

/**
 * Floating action buttons are used for a promoted action.
 * They are distinguished by a circled icon floating above the UI.
 */
Ext.define('Valence.common.widget.FloatingActionButton', {
    extend: 'Ext.Button',
    xtype: 'widget_floatingactionbutton',
    /**
     * @cfg {String} [iconCls=vvicon-plus2]
     */
    iconCls: 'vvicon-plus2',
    /**
     * @cfg {String} [position] The position in which to render the button. Possible values are:
     *
     * - "br" - bottom right
     */
    position: 'br',
    /**
     * @cfg {String} positionPrefix position class prefix
     */
    positionPrefix: 'x-btn-position-',
    /**
     * @cfg {Array} positionOffset xy offsets
     */
    positionOffset: null,
    floating: true,
    /** @cfg {Boolean} [subAction=false] Set to true to create this button as a "sub action" type. It will be smaller and is
     * meant to be hidden and shown only when the floating action button is hovered. Use this with the widget_fabwrapper component.
     */
    subAction: false,
    initComponent: function() {
        var me = this;
        if (!Ext.isEmpty(me.position)) {
            me.cls = me.positionPrefix + me.position;
        }
        if (me.subAction) {
            me.cls += ' x-btn-floating-action-sub';
        }
        Ext.apply(me, {
            ui: 'floating-action',
            height: (!me.subAction) ? 56 : 40,
            width: (!me.subAction) ? 56 : 40,
            shadow: false
        });
        me.callParent(arguments);
        setTimeout(function() {
            if (me.inFabWrapper && !me.subAction) {
                me.show();
            }
        }, 500);
    },
    hide: function() {
        var me = this;
        if (!Ext.isEmpty(me.el)) {
            me.el.removeCls('x-btn-scale-in');
        }
    },
    applyOffsets: function() {
        var me = this,
            offsets = me.positionOffset;
        if (!Ext.isEmpty(me.position) && !Ext.isEmpty(offsets) && offsets.length === 2) {
            var positionRule = me.positionPrefix + me.position,
                rule = Ext.util.CSS.getRule('.' + positionRule);
            if (!Ext.isEmpty(rule)) {
                var regText = new RegExp(/[a-zA-Z]+/g),
                    regNumbers = new RegExp(/\d+/),
                    bottom = rule.style.getPropertyValue('bottom'),
                    bottomNumber = (!Ext.isEmpty(bottom)) ? regNumbers.exec(bottom) : null,
                    bottomPx = (!Ext.isEmpty(bottom)) ? regText.exec(bottom) : null,
                    right = rule.style.getPropertyValue('right'),
                    rightNumber = (!Ext.isEmpty(right)) ? regNumbers.exec(right) : null,
                    rightPx = (!Ext.isEmpty(right)) ? regText.exec(right) : null;
                //apply x offset
                //
                if (!Ext.isEmpty(bottomNumber) && !Ext.isEmpty(bottomPx)) {
                    bottomNumber = parseInt(bottomNumber[0]) + offsets[0];
                    me.setStyle('bottom', bottomNumber + bottomPx);
                }
                //apply y offset
                //
                if (!Ext.isEmpty(rightNumber) && !Ext.isEmpty(rightPx)) {
                    rightNumber = parseInt(rightNumber[0]) + offsets[1];
                    me.setStyle('right', rightNumber + rightPx);
                }
            }
        }
    },
    show: function() {
        var me = this,
            scaleIn = function() {
                if (!Ext.isEmpty(me.el)) {
                    me.el.addCls('x-btn-scale-in');
                }
            };
        me.callParent(arguments);
        if (!Ext.isEmpty(me.positionOffset)) {
            me.applyOffsets();
            me.positionOffset = null;
            setTimeout(function() {
                scaleIn();
            }, 150);
        } else {
            if (!Ext.isEmpty(me.el)) {
                scaleIn();
            }
        }
    }
});

Ext.define('Valence.common.widget.MatTabs', {
    extend: 'Ext.tab.Panel',
    xtype: 'widget_mattabs',
    stretchTabs: true,
    pack: 'start',
    centerTabs: false,
    initComponent: function() {
        var me = this;
        me.cls += ' mattabs';
        me.callParent(arguments);
    },
    applyTabBar: function(tabBar) {
        var me = this,
            // if we are rendering the tabbar into the panel header, use same alignment
            // as header position, and ignore tabPosition.
            dock = (me.tabBarHeaderPosition != null) ? me.getHeaderPosition() : me.getTabPosition();
        if (me.centerTabs) {
            me.pack = 'center';
        }
        return new Ext.tab.Bar(Ext.apply({
            ui: me.ui,
            dock: dock,
            tabRotation: me.getTabRotation(),
            vertical: (dock === 'left' || dock === 'right'),
            plain: me.plain,
            tabStretchMax: me.getTabStretchMax(),
            tabPanel: me,
            layout: {
                type: 'hbox',
                pack: me.pack
            },
            defaults: {
                flex: (me.stretchTabs) ? 1 : null,
                listeners: {
                    delay: 250,
                    scope: me,
                    activate: me.onActivateTab,
                    resize: me.onResizeTab
                }
            },
            listeners: {
                scope: me,
                render: me.onRenderTabbar,
                destroy: me.onDestroyTabbar
            }
        }, tabBar));
    },
    onActivateTab: function(tab) {
        if (Ext.isEmpty(tab) || Ext.isEmpty(tab.el)) {
            return;
        }
        var me = this,
            box = tab.el.getBox();
        if (box.y < 0) {
            Ext.Function.defer(me.onActivateTab, 50, me, [
                tab
            ]);
        } else {
            me.activeEl.animate({
                duration: 300,
                to: {
                    width: box.width,
                    x: box.x,
                    y: box.y + box.height - 1
                }
            });
        }
    },
    destroy: function() {
        var me = this,
            el = me.activeEl;
        if (el) {
            el.destroy();
        }
        me.callParent(arguments);
    },
    onRenderTabbar: function(cmp) {
        var me = this;
        me.activeEl = Ext.DomHelper.append(cmp.el, {
            tag: 'div',
            cls: 'mattabs-active-div'
        }, true);
        Ext.on({
            resize: {
                fn: me.onResponsiveTab,
                scope: me,
                buffer: 250
            }
        });
    },
    onResponsiveTab: function() {
        var me = this,
            activeTab = me.getActiveTab();
        if (activeTab) {
            me.onResizeTab(activeTab.tab);
        }
    },
    onDestroyTabbar: function() {
        var me = this;
        Ext.un('resize', me.onResponsiveTab);
    },
    onResizeTab: function(tab) {
        var me = this,
            activeTab = me.getActiveTab(),
            box;
        if (tab === activeTab.tab) {
            box = tab.el.getBox();
            me.activeEl.animate({
                duration: 300,
                to: {
                    width: box.width,
                    x: box.x,
                    y: box.y + box.height - 1
                }
            });
        }
    }
});

/**
 * Navdrawer - todo
 */
Ext.define('Valence.common.widget.NavDrawer', {
    extend: 'Ext.Container',
    requires: [
        'Ext.tree.Panel'
    ],
    xtype: 'widget_navdrawer',
    width: 300,
    config: {
        /**
         * @cfg {String} Specify the title.
         */
        title: null
    },
    /**
     * @cfg {Boolean} [sliding=true] Navdrawer will slide in and out. This must be done via {@link #method-show} and {@link #method-hide}.
     */
    sliding: true,
    /**
     * @cfg {Boolean} [hideOnSelection=true] Automatically hide the navdrawer when a user selects an item from the nav list.
     */
    hideOnSelection: true,
    /**
     * @cfg {Boolean} [navIcon=false] Include a navigation drawer icon. When clicked, it will automatically hide the navdrawer.
     */
    navIcon: true,
    /**
     * @cfg {Boolean} [maskBodyOnShow=true] Mask the body of the document when this navdrawer is showing.
     */
    maskBodyOnShow: true,
    /**
     * @cfg {Array} [navItems] A list of items for navigation of the app.
     *
     * ## Example usage
     *     [{
     *         text  : 'Home',
     *         leaf  : true,    // meaning there are no sub-categories beneath this
     *         event : 'home'   // if an item has an "event", it will be fired
     *     },{
     *         text : 'Clearance',
     *         children : [{
     *             text  : 'Outdoor',
     *             event : 'outdoor',
     *             leaf  : true
     *         },{
     *             text  : 'Seasonal',
     *             event : 'seasonal',
     *             leaf  : true
     *         }]
     *     },{
     *         text  : 'New Items',
     *         event : 'newitems',
     *         leaf  : true
     *     }]
     *
     */
    navItems: null,
    /**
     * @cfg {Object} [navStore] An Ext.data.TreeStore object. This would be used in place of navItems.
     */
    navStore: null,
    height: '100%',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    /**
     * @cfg {Object} [renderTo=Ext.getBody()] Specify the element to render this component to.
     */
    renderTo: null,
    /**
     * @cfg {Object} [headerCfg] Component configuration that will be inserted at the top of this component.
     */
    headerCfg: null,
    /**
     * @cfg {Boolean} [collapseOnBodyClick=true] Automatically collapse/hide this component if the user clicks anywhere on the document body (outside of this element).
     */
    /**
     * @cfg {String} [treeListCls="w-navdrawer-tree] The class to apply to the tree.
     */
    treeCls: 'w-navdrawer-tree',
    /**
     * @cfg {String} [treeListCls="w-navdrawer-treebody] The class to apply to the tree body.
     */
    treeBodyCls: 'w-navdrawer-treebody',
    /**
     * @cfg {Object} [treeCfg] Configuration object that will be applied to the treepanel.
     */
    treeCfg: {},
    collapseOnBodyClick: true,
    clickListenerActive: false,
    clickListenerSet: false,
    initComponent: function() {
        var me = this;
        if (me.sliding) {
            Ext.apply(me, {
                x: 0,
                cls: 'w-navdrawer',
                floating: true,
                renderTo: me.renderTo || Ext.getBody(),
                shadow: false,
                height: Ext.getBody().getHeight()
            });
        } else {
            Ext.apply(me, {
                cls: 'w-navdrawer is-active'
            });
        }
        Ext.apply(me, {
            items: me.buildItems()
        });
        me.callParent(arguments);
        Ext.getBody().on({
            scope: me,
            buffer: 200,
            resize: 'onResizeBody'
        });
    },
    buildColumns: function() {
        var me = this;
        return me.columns || [
            {
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                renderer: function(v, cell, rec) {
                    var icon = rec.get('icon') + ' w-navdrawer-icon',
                        style = rec.get('style'),
                        s = '<span class="{0}" style="{1}"></span>{2}';
                    return Ext.String.format(s, icon, style, v);
                }
            }
        ];
    },
    buildItems: function() {
        var me = this,
            i = [],
            navStore = (me.navItems) ? me.buildStore() : me.navStore;
        if (me.navIcon || me.title) {
            i.push({
                xtype: 'toolbar',
                cls: 'w-navdrawer-header',
                items: []
            });
            if (me.navIcon) {
                i[0].items.push({
                    iconCls: 'vvicon-menu7',
                    ui: 'plain',
                    scope: me,
                    handler: me.onClickNavIcon
                });
            }
            if (me.title) {
                i[0].items.push({
                    xtype: 'tbtext',
                    cls: 'w-navdrawer-title',
                    text: me.title
                });
            }
        }
        if (me.headerCfg) {
            i.push(me.headerCfg);
        }
        i.push(Ext.apply(me.treeCfg, {
            xtype: 'treepanel',
            flex: 1,
            cls: me.treeCls,
            bodyCls: me.treeBodyCls,
            store: navStore,
            rootVisible: false,
            hideHeaders: true,
            scrollable: 'y',
            columns: me.buildColumns(),
            listeners: {
                scope: me,
                cellclick: me.onCellClickTreeList
            }
        }));
        return i;
    },
    buildStore: function() {
        var me = this;
        return Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true,
                children: me.navItems
            }
        });
    },
    applyTitle: function(title) {
        return title;
    },
    /**
     * Hide the navdrawer.
     */
    hide: function() {
        var me = this;
        me.el.removeCls('is-active');
        if (me.maskBodyOnShow) {
            Ext.getBody().unmask();
        }
        me.clickListenerActive = false;
    },
    /**
     * Mimic the click of an item on the nav tree.
     * @param p {String/Numeric} Either the index number of the store record or the name of the event attached to the record.
     */
    mimicClick: function(p) {
        var me = this,
            tp = me.down('treepanel'),
            str = tp.getStore(),
            rec;
        if (Ext.isNumber(p)) {
            rec = str.getAt(p);
        } else if (Ext.isString(p)) {
            rec = str.findRecord('event', p, 0, false);
        }
        if (rec) {
            tp.getSelectionModel().select(rec);
            me.fireEvent(rec.get('event'), rec);
        }
    },
    onBodyClick: function(e) {
        var me = this;
        if (me.clickListenerActive && !e.within(me.el)) {
            me.hide();
        }
    },
    onClickNavIcon: function() {
        var me = this;
        me.hide();
    },
    onCellClickTreeList: function(view, td, cellIndex, rec, tr, rowIndex, e) {
        var me = this,
            leaf = rec.isLeaf(),
            el = Ext.get(e.getTarget()),
            elTarget = el.getAttribute('data-event'),
            event = (leaf) ? rec.get('event') : null;
        if (elTarget) {
            me.fireEvent(elTarget, rec);
        } else {
            if (event) {
                if (view.getSelection() !== rec) {
                    me.fireEvent(event, rec);
                }
                if (me.hideOnSelection) {
                    me.hide();
                }
            } else {
                me.clickListenerActive = false;
                rec[rec.isExpanded() ? 'collapse' : 'expand']();
                setTimeout(function() {
                    me.clickListenerActive = true;
                }, 200);
            }
        }
    },
    onResizeBody: function(body, o) {
        var me = this;
        me.setHeight(o.height);
    },
    /**
     * Show the navdrawer.
     */
    show: function() {
        var me = this;
        me.callParent(arguments);
        if (me.maskBodyOnShow) {
            Ext.getBody().mask();
            me.toFront();
        }
        me.el.addCls('is-active');
        if (me.collapseOnBodyClick && !me.clickListenerSet) {
            Ext.getBody().on({
                scope: me,
                buffer: 150,
                click: me.onBodyClick
            });
            me.clickListenerSet = true;
        }
        setTimeout(function() {
            me.clickListenerActive = true;
        }, 500);
    }
});

Ext.define('Valence.common.widget.Selector', {
    extend: 'Ext.view.View',
    xtype: 'widget_selector',
    store: null,
    valueField: 'value',
    itemCls: 'w-selector-item',
    overItemCls: 'w-selector-item-over',
    selectedItemCls: 'w-selector-item-sel',
    deselectOnClick: false,
    trackMouse: true,
    displayField: 'desc',
    cls: 'x-field x-form-item w-selector-wrap',
    autoSelect: -1,
    manualSet: false,
    itemStyle: null,
    tooltipField: null,
    isFormField: true,
    height: 27,
    initComponent: function() {
        var me = this;
        if (!Ext.isEmpty(me.additionalCls)) {
            me.cls = me.cls + ' ' + me.additionalCls;
        }
        Ext.applyIf(me, {
            itemSelector: 'div.' + me.itemCls,
            tpl: this.buildTpl()
        });
        me.callParent(arguments);
        me.on({
            scope: me,
            afterrender: me.onAfterRender,
            beforeitemclick: me.onBeforeItemClick,
            selectionchange: me.onSelectionChangeList
        });
    },
    buildTpl: function() {
        var me = this;
        return Ext.create('Ext.XTemplate', '<tpl for=".">', '<div {[this.getItemStyle(xindex)]} {[this.getTooltip(values)]} class="' + me.itemCls + '">', '{[this.getValue(values)]}', '</div>', '</tpl>', {
            getItemStyle: function(i) {
                var style = me.itemStyle;
                if (me.itemStyle) {
                    if (i > 1) {
                        style += 'border-left:none;';
                    }
                    return 'style="' + style + '"';
                } else if (i > 1) {
                    return 'style="border-left:none;' + '"';
                }
            },
            getTooltip: function(v) {
                if (me.tooltipField) {
                    return 'data-qtip="' + v[me.tooltipField] + '"';
                }
            },
            getValue: function(v) {
                return v[me.displayField];
            }
        });
    },
    deselectSelected: function() {
        var me = this,
            recs = me.getSelectionModel().getSelection();
        for (var ii = 0; ii < recs.length; ii++) {
            me.selModel.deselect(recs[ii], true);
        }
    },
    getDisplayValue: function() {
        var me = this,
            recs = me.getSelectionModel().getSelection();
        if (recs.length === 0) {
            return null;
        } else if (recs.length === 1) {
            return recs[0].get(me.displayField);
        } else {
            var r = [];
            for (var ii = 0; ii < recs.length; ii++) {
                r.push(recs[ii].get(me.displayField));
            }
            return r;
        }
    },
    getSubmitData: function() {
        var me = this,
            o = {};
        o[me.name] = me.getValue();
        return o;
    },
    getSubmitValue: function() {
        var me = this;
        return me.getValue();
    },
    getValue: function() {
        var me = this,
            recs = me.getSelectionModel().getSelection();
        if (recs.length === 0) {
            return null;
        } else if (recs.length === 1) {
            return recs[0].get(me.valueField);
        } else {
            var r = [];
            for (var ii = 0; ii < recs.length; ii++) {
                r.push(recs[ii].get(me.valueField));
            }
            return r;
        }
    },
    isDirty: function() {
        return false;
    },
    isFileUpload: function() {
        return false;
    },
    isValid: function() {
        return true;
    },
    setValue: function(v) {
        var me = this,
            vals = [],
            rec,
            sm = me.getSelectionModel(),
            str = me.store;
        me.manualSet = true;
        if (!Ext.isArray(v)) {
            vals.push(v);
        } else {
            vals = v;
        }
        for (var ii = 0; ii < vals.length; ii++) {
            rec = str.findRecord(me.valueField, vals[ii]);
            if (rec) {
                me.getSelectionModel().select(str.indexOf(rec));
                me.fireEvent('change', me, rec);
            }
        }
        me.manualSet = false;
    },
    validate: function() {
        return true;
    },
    onAfterRender: function() {
        var me = this;
        if (me.autoSelect !== -1) {
            if (me.store.getCount() > 0) {
                me.getSelectionModel().select(me.autoSelect);
            } else {
                me.store.on({
                    scope: me,
                    single: true,
                    load: me.onAfterRender
                });
            }
        }
    },
    onBeforeItemClick: function(rec, view) {
        var me = this;
        if (!me.manualSet && me.deselectOnClick && me.selModel.isSelected(rec)) {
            me.selModel.deselect(rec, true);
            me.fireEvent('itemunclick', view, rec);
            return false;
        }
    },
    onSelectionChangeList: function(view, recs) {
        var me = this;
        me.fireEvent('change', me, recs);
    },
    reset: function() {
        var me = this;
        if (me.autoSelect !== -1) {
            if (me.store.getCount() > 0) {
                me.getSelectionModel().select(me.autoSelect);
            }
        }
    }
});

Ext.define('Valence.common.widget.VideoInvite', {
    extend: 'Ext.toolbar.Toolbar',
    ui: 'secondary-dark',
    xtype: 'widget_videoinvite',
    storageItem: null,
    url: null,
    text: null,
    autoHideSeconds: 30,
    cls: 'w-video-invite',
    layout: {
        type: 'hbox',
        pack: 'middle'
    },
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            floating: true,
            shadow: false,
            renderTo: me.renderTo || Ext.getBody(),
            style: {
                opacity: 0
            },
            width: '40%'
        });
        me.callParent(arguments);
        me.on({
            scope: me,
            delay: 500,
            afterrender: me.onAfterRender,
            viewvideo: me.onClickClose
        });
    },
    buildItems: function() {
        var me = this;
        return [
            {
                xtype: 'tbtext',
                flex: 1,
                text: Ext.String.format('{0}<a data-event="viewvideo" href="{1}" target="_blank">{2}</a>', me.text, me.url, Ext.util.Format.uppercase(Valence.lang.lit.viewVideo)),
                listeners: {
                    el: {
                        scope: me,
                        click: me.onClickText
                    }
                }
            },
            {
                ui: 'plain',
                scope: me,
                iconCls: 'close-icon vvicon-cancel-circle',
                handler: me.onClickClose
            }
        ];
    },
    onAfterRender: function(cmp) {
        var me = this;
        if (!me.storageItem || !me.url || !me.text) {
            me.destroy();
        } else if (localStorage.getItem(me.storageItem) === 'true') {
            me.destroy();
        } else if (Valence.util.Helper.getLanguage() !== 'en') {
            me.destroy();
        } else {
            me.add(me.buildItems());
            // anchorTo is supposed to handle repositioning upon scrolling but is not...
            //   set our own scroll listener...
            //
            me.el.anchorTo(me.renderTo, 'bc-bc');
            me.renderTo.on({
                scope: me,
                scroll: me.onScrollRenderTo
            });
            me.show();
            me.el.fadeIn({
                duration: 500
            });
            me.interval = setTimeout(function() {
                me.el.fadeOut({
                    callback: function() {
                        me.destroy();
                    }
                });
            }, me.autoHideSeconds * 1000);
        }
    },
    onClickClose: function() {
        var me = this;
        localStorage.setItem(me.storageItem, true);
        me.el.fadeOut({
            callback: function() {
                me.destroy();
            }
        });
    },
    onClickText: function(e) {
        var me = this,
            el = Ext.get(e.getTarget()),
            event = el.getAttribute('data-event');
        if (event) {
            me.fireEvent(event);
        }
    },
    onDestroy: function() {
        var me = this;
        clearInterval(me.interval);
        me.renderTo.un('scroll', me.onScrollRenderTo, me);
        me.callParent(arguments);
    },
    onScrollRenderTo: function() {
        var me = this;
        me.el.anchorTo(me.renderTo, 'bc-bc');
    }
});

Ext.define('Valence.common.widget.hsteps.HStepsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.hsteps'
});

Ext.define('Valence.common.widget.hsteps.HStepsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.hsteps',
    onAfterrender: function() {
        var me = this,
            view = me.getView();
        if (!Ext.isEmpty(view.autoSelect)) {
            view.getSelectionModel().select(view.autoSelect);
        }
    },
    onBeforeselectStep: function(cmp, rec) {
        var me = this,
            view = me.getView(),
            event = rec.get('event'),
            currentSel = view.selection,
            currentEvent = (currentSel) ? currentSel.get('event') : null,
            str, cnt, index, obj;
        if (event) {
            if (currentEvent) {
                if (me.fireViewEvent('beforeleave' + currentEvent, currentSel, rec) === false) {
                    return false;
                }
            }
            if (me.fireViewEvent('before' + event) === false) {
                return false;
            }
            // determine if there is a previous and next step...
            //
            str = view.getStore();
            cnt = str.getCount();
            index = str.indexOf(rec);
            obj = {
                index: index,
                previous: (index > 0),
                next: (index < (cnt - 1))
            };
            me.fireViewEvent(event, rec, obj);
        }
    }
});

Ext.define('Valence.common.widget.hsteps.HSteps', {
    extend: 'Ext.view.View',
    requires: [
        'Valence.common.widget.hsteps.HStepsModel',
        'Valence.common.widget.hsteps.HStepsController'
    ],
    xtype: 'widget_hsteps',
    viewModel: {
        type: 'hsteps'
    },
    controller: 'hsteps',
    itemSelector: 'div.hs-step-wrap',
    selectedItemCls: 'hs-selected',
    cls: 'hs-wrap',
    autoSelect: 0,
    tpl: [
        '<div class="hs-inner">',
        '<tpl for=".">',
        '<div class="hs-step-wrap {[this.getAdditionalCls(values)]}">',
        '<div class="hs-step">',
        '<tpl if="sts == \'C\'">',
        '<div class="hs-step-circle"><div class="vvicon-checkmark hs-step-cmpl"></div></div>',
        '<tpl elseif="sts == \'I\'">',
        '<div class="hs-step-circle"><div class="vvicon-warning hs-step-incmpl"></div></div>',
        '<tpl else>',
        '<div class="hs-step-circle">{[this.getStepValue(values, xindex)]}</div>',
        '</tpl>',
        '<div class="hs-step-text">{text}</div>',
        '<tpl if="subtext">',
        '<div class="hs-step-subtext">{subtext}</div>',
        '</tpl>',
        '</div>',
        '<div class="hs-step-line"></div>',
        '</div>',
        '</tpl>',
        '</div>',
        {
            getAdditionalCls: function(v) {
                if (v.sts && v.sts === 'C') {
                    return 'hs-complete';
                } else if (v.sts && v.sts === 'I') {
                    return 'hs-incomplete';
                }
            },
            getStepValue: function(v, index) {
                if (!Ext.isEmpty(v.step)) {
                    return v.step;
                }
                return index;
            }
        }
    ],
    listeners: {
        beforeselect: 'onBeforeselectStep',
        afterrender: {
            delay: 200,
            fn: 'onAfterrender'
        }
    },
    first: function() {
        var me = this,
            str = me.getStore(),
            rec = str.getAt(0);
        if (!Ext.isEmpty(rec)) {
            me.getSelectionModel().select(rec);
        }
    },
    getCurrentStep: function() {
        var me = this,
            selection = me.getSelection();
        if (!Ext.isEmpty(selection)) {
            return me.getSelection()[0];
        }
        return null;
    },
    next: function(setComplete) {
        var me = this,
            str = me.getStore(),
            count = str.getCount() - 1,
            rec = me.getSelection()[0],
            index;
        if (rec) {
            if (setComplete) {
                rec.set('sts', 'C');
            }
            index = str.indexOf(rec);
            index += 1;
            if (index <= count) {
                me.getSelectionModel().select(str.getAt(index));
            }
        }
    },
    previous: function(setNotComplete) {
        var me = this,
            str = me.getStore(),
            rec = me.getSelection()[0],
            index;
        if (rec) {
            index = str.indexOf(rec);
            index -= 1;
            if (index >= 0) {
                if (setNotComplete) {
                    str.getAt(index).set('sts', '');
                }
                me.getSelectionModel().select(str.getAt(index));
            }
        }
    },
    setActive: function(stepRec) {
        var me = this,
            str = me.getStore();
        if (!Ext.isEmpty(stepRec)) {
            me.getSelectionModel().select(stepRec);
        }
    }
});

