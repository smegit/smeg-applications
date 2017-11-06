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

Ext.define('Valence.common.widget.Loadmask', {
    extend: 'Ext.Component',
    xtype: 'widget_loadmask',
    cls: 'w-mask-outer',
    type: 'spinner',
    stopDestory: true,
    tpl: new Ext.XTemplate('<div class="w-mask-inner rect">', '<div class="rect1"></div>', '<div class="rect2"></div>', '<div class="rect3"></div>', '<div class="rect4"></div>', '<div class="rect5"></div>', '<p class="w-mask-title">{text}</p>', '</div>')
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

Ext.define('Valence.common.grid.plugin.PagingToolbar', {
    extend: 'Ext.grid.plugin.PagingToolbar',
    alias: 'plugin.gridremotepagingtoolbar',
    updateGrid: function(grid, oldGrid) {
        var me = this;
        me.callParent(arguments);
        me.unbindHook(grid, 'onScrollBinder', 'checkPageChange');
        if (!Ext.isEmpty(oldGrid)) {
            var oldStore = oldGrid.getStore();
            if (!Ext.isEmpty(store)) {
                store.un({
                    load: 'onStoreLoad',
                    scope: me
                });
            }
        }
        if (!Ext.isEmpty(grid)) {
            var store = grid.getStore();
            if (!Ext.isEmpty(store)) {
                store.on({
                    scope: me,
                    load: 'onStoreLoad'
                });
            }
        }
    },
    onStoreLoad: function() {
        var me = this,
            store = me.getGrid().getStore(),
            pageSize = store.getPageSize(),
            totalPages = Math.ceil(store.getTotalCount() / pageSize);
        //set the total pages, page size, current page and total pages
        //
        me.setTotalPages(totalPages);
        me.setPageSize(pageSize);
        me.setCurrentPage(store.currentPage);
        me.updateTotalPages(totalPages);
    },
    onUpdateVisibleCount: function(grid) {
        return;
    },
    onNextPageTap: function() {
        var me = this,
            grid = me.getGrid(),
            store = grid.getStore(),
            currentPage = store.currentPage;
        if (currentPage * store.getPageSize() < store.getTotalCount()) {
            var pageTopRecord = me.getPageTopRecord(currentPage);
            if (grid && !me.preventGridScroll && pageTopRecord) {
                grid.scrollToRecord(pageTopRecord);
            }
            var page = store.currentPage + 1;
            this.setCurrentPage(page);
        }
    },
    onPreviousPageTap: function() {
        var me = this,
            grid = me.getGrid(),
            store = me.getGrid().getStore(),
            currentPage = store.currentPage;
        if (currentPage > 1) {
            var pageTopRecord = me.getPageTopRecord(currentPage);
            if (grid && !me.preventGridScroll && pageTopRecord) {
                grid.scrollToRecord(pageTopRecord);
            }
            var page = store.currentPage - 1;
            me.setCurrentPage(page);
        }
    },
    onPageChange: function(field, page) {
        var me = this,
            grid = me.getGrid();
        grid.getStore().loadPage(page, {
            scope: me,
            callback: function(recs) {
                var topRecord = (!Ext.isEmpty(recs)) ? recs[0] : null;
                if (!Ext.isEmpty(topRecord)) {
                    grid.scrollToRecord(topRecord);
                }
                me.setCurrentPage(page);
            }
        });
    },
    updatePageButtons: function() {},
    // do nothing
    onTotalCountChange: function(store) {
        this.setTotalCount(store.getCount());
    },
    updateTotalPages: function(totalPages) {
        var me = this;
        // Ensure the references are set
        me.getToolbar();
        me.totalPages.setData({
            totalPages: totalPages
        });
        me.pageSlider.setMaxValue(totalPages || 1);
        me.updatePageInfo(me.getCurrentPage());
    },
    updateCurrentPage: function(currentPage) {
        this.updatePageInfo(currentPage);
    },
    updateTotalCount: function(totalCount) {
        var totalPages;
        if (totalCount !== null && totalCount !== undefined) {
            if (totalCount === 0) {
                totalPages = 1;
            } else {
                totalPages = Math.ceil(totalCount / this.getPageSize());
            }
            this.setTotalPages(totalPages);
        }
    }
});

/**
 *  Utility class for displaying a dialog.
 *  Dialogs contain text focused on a specific task. They inform users about critical information and require users to make a decision.
 */
Ext.define('Valence.common.util.Dialog', {
    singleton: true,
    requires: [
        'Ext.Sheet'
    ],
    config: {
        fnc: null,
        cmp: null,
        scope: null,
        waitToClose: null
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
     * @param {Array} config.buttons Specify the buttons to display. Upon clicking a button, the handler will be
     *                               called passing the lowercased button text as the parameter. If the button
     *                               has a property labeled "parmText" then that will be passed instead.
     * @param {Fuction} [config.handler] Function to call if the button is clicked.
     * @param {Object} [config.scope=this] Specify the scope for the function handler.
     * @param {Object} [config.cfg] Additional configs to apply to the dialog window.
     */
    show: function(o) {
        var me = this,
            msg = o.msg || null,
            buttons = o.buttons || null,
            title = o.title || null,
            addlCfg = o.cfg || null,
            fnc = o.handler || null,
            minWidth = o.minWidth || null,
            buttonAlign = o.buttonAlign || 'center',
            cfg = {
                ui: 'dialog',
                minWidth: minWidth,
                maxWidth: 500,
                title: title,
                autoDestroy: true
            },
            cfgItems, toolbar, cmp;
        if (!buttons) {
            Ext.log('An array of buttons must be passed');
        } else {
            if (addlCfg) {
                Ext.apply(cfg, addlCfg);
            }
            for (var ii = 0; ii < buttons.length; ii++) {
                buttons[ii].scope = me;
                buttons[ii].handler = me.onClickButton;
            }
            if (buttons[0] != '->' && buttonAlign == 'right') {
                buttons.splice(0, 0, '->');
            }
        }
        if (!Ext.isEmpty(o.waitToClose)) {
            me.setWaitToClose(o.waitToClose);
        }
        cfgItems = [
            {
                xtype: 'component',
                html: msg
            }
        ];
        if (!Ext.isEmpty(cfg.items)) {
            cfgItems = Ext.Array.merge(cfgItems, cfg.items);
        }
        cfgItems.push({
            xtype: 'toolbar',
            itemId: 'btmtlbr',
            docked: 'bottom',
            items: buttons
        });
        cfg['items'] = cfgItems;
        me.setFnc(fnc);
        cmp = Ext.Viewport.add(Ext.widget('sheet', cfg));
        me.setCmp(cmp);
        return cmp;
    },
    onClickButton: function(btn) {
        var me = this,
            fnc = me.getFnc(),
            scope = me.getScope(),
            waitToClose = me.getWaitToClose(),
            cmp = me.getCmp(),
            resp;
        if (!waitToClose) {
            cmp.setHidden(true);
        }
        if (fnc) {
            resp = Ext.callback(fnc, scope, [
                btn.parmText || Ext.util.Format.lowercase(btn.getText()),
                btn
            ]);
            if (waitToClose) {
                if (Ext.isEmpty(resp) || resp) {
                    cmp.setHidden(true);
                    me.setFnc(null);
                    me.setScope(this);
                }
                return;
            }
            me.setFnc(null);
            me.setScope(this);
            cmp.destroy();
        }
    }
});

/**
 *  Utility class for displaying a dialog this is a list of choices.
 *  Picker List contains multiple values (in the form one-dimenionsal array) that result in some kind of action. An example would be a filter based on specific values.
 */
Ext.define('Valence.common.util.PickerList', {
    singleton: true,
    requires: [
        'Ext.Sheet'
    ],
    config: {
        cmp: null,
        scope: this,
        fnc: null,
        displayField: null,
        listArray: [],
        subMenu: false,
        cardIndex: 0,
        subLists: null
    },
    /**
     * Show the picker list.
     *
     * ## Example usage
     *     Valence.common.util.PickerList.showPickerList({
                title     : 'Select an Environment:',
                handler   : me.onTapEnvironmentFilter,
                listArray : envs,
                scope     : me
            });
     *
     * @param {String} [title]
     * @param {Array|Store} listArray Specify the buttons to display. Upon clicking a button, the handler will be
     *                               called passing the lowercased button text as the parameter. If the button
     *                               has a property labeled "parmText" then that will be passed instead.
     * @param {Fuction} [handler] Function to call if an item is tapped.
     * @param {Object} [scope] Specify the scope for the function handler.
     * @param {Object} [cfg] Additional configs to apply to the dialog window.
     */
    showPickerList: function(o) {
        var me = this,
            listStore = o.listArray || null,
            title = o.title || null,
            addlCfg = o.cfg || null,
            fnc = o.handler || null,
            minWidth = o.minWidth || null,
            maxHeight = o.maxHeight || null,
            displayField = o.displayField || 'field1',
            textAlign = o.textAlign || 'center',
            scope = o.scope,
            subLists = o.subLists,
            cfg = {
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                width: '80%',
                height: '80%',
                modal: true,
                hideOnMaskTap: true,
                scrollable: true,
                //  all styling is being done via the dialog ui currently
                ui: 'dialog',
                cls: 'vv-pickerlist',
                hideAnimation: {
                    type: 'fadeOut',
                    duration: 250
                },
                minWidth: minWidth,
                maxWidth: 500,
                maxHeight: maxHeight,
                title: title
            },
            cancel = {
                xtype: 'toolbar',
                docked: 'bottom',
                itemId: 'cncltlbr',
                layout: {
                    type: 'hbox',
                    align: 'stretch',
                    pack: 'center'
                },
                height: 60,
                items: [
                    {
                        text: 'Cancel',
                        cls: 'vv-btn-non-primary',
                        handler: me.onTapCancel,
                        scope: me
                    }
                ]
            },
            items, list, subList, subListArray, subListItem, cmp;
        me.setDisplayField(displayField);
        if (!listStore) {
            Ext.log('An array of options or store must be passed');
        } else if (Ext.isEmpty(scope)) {
            Ext.log('Scope must be passed.');
        } else {
            if (addlCfg) {
                Ext.apply(cfg, addlCfg);
            }
            list = {
                xtype: 'list',
                width: '100%',
                selectedCls: 'dummy',
                flex: 1,
                itemTpl: [
                    '<div style="display:inline-block;text-align:left;width:90%;overflow-x:hidden;text-overflow:ellipsis;" class="vv-picker-list-item">{' + displayField + '}</div>',
                    '<tpl if="menu">',
                    '<div style="position:absolute;right:0;display:inline-block;"><span style="font-size: 30px;" class="vvicon-arrow-right4"></span></div>',
                    '</tpl>'
                ],
                store: listStore,
                listeners: {
                    itemtap: me.onTapList,
                    scope: me
                }
            };
            items = [
                list
            ];
            cfg['items'] = items;
            if (!Ext.isEmpty(subLists)) {
                subListArray = [];
                me.setSubMenu(true);
                me.setCardIndex(0);
                for (var i = 0; i < subLists.length; i++) {
                    subList = Ext.clone(list);
                    subListItem = subLists[i];
                    Ext.apply(subList, {
                        itemTpl: [
                            '<div style="display:inline-block;text-align:left;width:90%;overflow-x:hidden;text-overflow:ellipsis;" class="vv-picker-list-item">{' + displayField + '}</div>',
                            '<tpl if="menu">',
                            '<div style="position:absolute;right:0;display:inline-block;"><span style="font-size: 30px;" class="vvicon-arrow-right4"></span></div>',
                            '</tpl>'
                        ],
                        store: subListItem.store
                    });
                    subListArray.push(subList);
                }
                me.setSubLists(subListArray);
                cfg['items'] = [
                    {
                        xtype: 'toolbar',
                        itemId: 'toptlbr',
                        cls: 'vv-sublistpicker',
                        docked: 'top',
                        height: 60,
                        hidden: true,
                        items: [
                            {
                                text: 'Back',
                                cls: 'vv-btn-non-primary',
                                handler: me.onTapBack,
                                scope: me
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        flex: 1,
                        layout: {
                            type: 'card',
                            animation: 'slide'
                        },
                        itemId: 'pickernavcnt',
                        items: items
                    },
                    cancel
                ];
            } else {
                me.setSubMenu(false);
                items.push(cancel);
            }
            if (Ext.isEmpty(cfg.maxHeight)) {
                if ((Ext.isArray(listStore) && listStore.length < 5) || (!Ext.isString(listStore) && Ext.getStore(listStore).getCount() < 5) && Ext.isEmpty(subLists)) {
                    cfg['maxHeight'] = 240;
                } else {
                    cfg['maxHeight'] = '80%';
                }
            }
        }
        me.setFnc(fnc);
        me.setScope(scope);
        cmp = Ext.Viewport.add(Ext.widget('sheet', cfg));
        me.setCmp(cmp);
        return cmp;
    },
    onTapList: function(list, index, el, rec) {
        var me = this,
            fnc = me.getFnc(),
            scope = me.getScope(),
            subLists = me.getSubLists(),
            picker = me.getCmp(),
            cmp, animation, cardIndex, card;
        if (me.getSubMenu() && rec.get('menu')) {
            card = picker.down('#pickernavcnt');
            animation = card.getLayout().getAnimation();
            animation.setDirection('left');
            cardIndex = me.getCardIndex() + 1;
            picker.down('#toptlbr').show();
            cmp = card.add(subLists[cardIndex - 1]);
            me.setCardIndex(cardIndex);
            card.setActiveItem(cmp);
            return;
        }
        if (me.getSubMenu()) {
            picker.down('#toptlbr').destroy();
        }
        picker.down('#cncltlbr').destroy();
        picker.destroy();
        if (fnc) {
            Ext.callback(fnc, scope, [
                list,
                me.getDisplayField() === 'field1' ? rec.get('field1') : rec
            ]);
            me.setFnc(null);
            me.setScope(this);
        }
    },
    onTapBack: function() {
        var me = this,
            cmp = me.getCmp(),
            card = cmp.down('#pickernavcnt'),
            animation = card.getLayout().getAnimation(),
            cardIndex = me.getCardIndex() - 1,
            activeItem = card.getActiveItem();
        animation.setDirection('right');
        me.setCardIndex(cardIndex);
        card.setActiveItem(cardIndex);
        if (cardIndex == 0) {
            cmp.down('#toptlbr').hide();
        }
        setTimeout(function() {
            activeItem.destroy();
        }, 300);
    },
    onTapCancel: function() {
        var me = this;
        me.getCmp().destroy();
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
    extend: 'Ext.Toolbar',
    xtype: 'widget_appbar',
    cls: 'x-toolbar-appbar',
    config: {
        fireFilterEvtOnly: false,
        inSearchMode: false,
        searchComponent: null
    },
    bind: {
        inSearchMode: '{appBarMblSearch}',
        fireFilterEvtOnly: '{appBarFireFilterEvtOnly}',
        searchComponent: '{appBarSearchCmp}',
        ui: '{appBarUI}'
    },
    initialize: function() {
        var me = this;
        me.callParent(arguments);
        me.add({
            xtype: 'button',
            bind: {
                text: '{appBarTitleText}',
                iconAlign: '{appBarTitleIconAlign}',
                iconCls: '{appBarTitleIconCls}',
                hidden: '{appBarMblSearch}'
            },
            cls: Ext.os.is.Phone ? 'appbar-title appbar-title-phone' : 'appbar-title',
            event: 'titletap',
            listeners: {
                scope: me,
                tap: me.onTapCmp
            }
        });
        me.add('->');
        me.add({
            xtype: 'textfield',
            cls: 'vv-appbar-filter-modern',
            reference: 'filterfield',
            listeners: {
                change: me.onChangeFilter,
                scope: me
            },
            bind: {
                value: '{appBarMblSearchValue}',
                cls: '{appBarMblSearchCls}'
            }
        });
        me.add({
            xtype: 'button',
            cls: 'vv-appbar-filter-btn-modern',
            width: 40,
            event: 'filtertap',
            bind: {
                iconCls: '{appBarMblSearchIconCls}',
                hidden: '{appBarMblSearchIcon}'
            },
            listeners: {
                tap: me.onTapCmp,
                scope: me
            }
        });
    },
    getSearchComponent: function() {
        var me = this,
            sc = me.callParent(arguments);
        if (!Ext.isEmpty(sc)) {
            if (!Ext.isArray(sc)) {
                return [
                    sc
                ];
            }
        }
        return sc;
    },
    onChangeFilter: function(fld, val) {
        var me = this;
        me.fireEvent('filterchange', fld, val);
        // if this appbar has a "searchComponent"...then automatically perform the filtering...
        //
        if (!Ext.isEmpty(me.getSearchComponent())) {
            me.performSearch(val);
        }
    },
    onTapCmp: function(cmp, item) {
        var me = this,
            event = cmp.event;
        //searchCmps = me.getSearchComponent(),
        //filterCtrl;
        if (event) {
            me.fireEvent(event, cmp);
        }
    },
    // wait to see if the cmp sets appBarMblSearch
    //setTimeout(function(){
    //    if (me.getInSearchMode() && !Ext.isEmpty(searchCmps)){
    //        if (searchCmps.length > 0){
    //            filterCtrl = new Ext.create({
    //                xtype : 'component',
    //                data : {
    //                    cmp : searchCmps
    //                },
    //                itemId : 'filterTag',
    //                reference : 'filterTag',
    //                cls : 'filter-banner filter-banner-show',
    //                tpl : me.buildFilterCtrl(),
    //                listeners : {
    //                    el : {
    //                        scope : me,
    //                        click : 'onClickFilterCntrl'
    //                    }
    //                },
    //                width : '80%',
    //                floating : true,
    //                alignTarget : Ext.get('textfield.vv-appbar-filter-modern'),
    //                defaultAlign : 't-b',
    //                renderTo : Ext.getBody()
    //            });
    //        }
    //    }
    //},300);
    buildFilterCtrl: function() {
        return new Ext.XTemplate('<tpl for="cmp">', '<div class="filter-cont">', '<div class="filter-text">{.}</div>', '</div>', '</tpl>');
    },
    performSearch: function(val, index) {
        var me = this,
            cmp = me.getSearchComponent(),
            str, view;
        if (Ext.isEmpty(index)) {
            index = 0;
        }
        cmp = cmp[index];
        if (Ext.isString(cmp)) {
            view = Ext.ComponentQuery.query('app-main')[0];
            cmp = view.lookupReference(cmp);
        }
        str = Ext.isFunction(cmp.getStore) ? cmp.getStore() : null;
        // maybe this is a store...
        //
        if (Ext.isFunction(cmp.filterBy)) {
            str = cmp;
        }
        if (!str) {
            Ext.log({
                msg: 'Appbar search component does not have a getStore method'
            });
            return;
        }
        var srchRegEx = new RegExp(val, "i"),
            srchFlds = cmp.appBarSearchFields;
        if (!srchFlds) {
            srchFlds = str.getModel().getFields().map(function(fld) {
                return fld.name;
            });
        }
        if (!me.getFireFilterEvtOnly()) {
            str.clearFilter();
            //filter recent store all fields based on search field value
            //
            str.filterBy(function(rec) {
                for (var i = 0; i < srchFlds.length; i++) {
                    if (srchRegEx.test(rec.get(srchFlds[i]))) {
                        return true;
                    }
                }
                return false;
            });
        }
    }
});
//onClickFilterCntrl : function(){
//    console.log('click');
//}

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
    cls: 'x-btn-floating-action',
    /**
     * @cfg {String} [position] The position in which to render the button. Possible values are:
     *
     * - "br" - bottom right
     */
    position: null,
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
    //bottom : 24,
    //right :20,
    hide: function() {
        var me = this;
        if (!Ext.isEmpty(me.element)) {
            me.element.removeCls('x-btn-scale-in');
        }
        me.callParent(arguments);
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
                if (!Ext.isEmpty(me.element)) {
                    me.element.addCls('x-btn-scale-in');
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
            if (!Ext.isEmpty(me.element)) {
                scaleIn();
            }
        }
    }
});

Ext.define('Valence.common.widget.MatTabs', {
    extend: 'Ext.tab.Panel',
    xtype: 'widget_mattabs',
    initialize: function() {
        var me = this,
            tabBar = me.getTabBar(),
            scroller = tabBar.getScrollable();
        me.callParent(arguments);
        me.activeEl = Ext.DomHelper.append(tabBar.el, {
            tag: 'div',
            cls: 'mattabs-active-div'
        }, true);
        me.on({
            scope: me,
            activeitemchange: me.onTabChange
        });
        if (scroller) {
            scroller.on({
                scroll: function() {
                    me.onTabChange(me, me.getActiveItem());
                }
            });
        }
        setTimeout(function() {
            me.onTabChange(me, me.getActiveItem());
        }, 500);
    },
    onTabChange: function(cmp, activeItem) {
        var me = this,
            tab = activeItem.tab,
            box = tab.el.getBox(),
            position = cmp.getTabBarPosition();
        me.activeEl.applyStyles({
            width: box.width + 'px'
        });
        if (position === 'bottom') {
            me.activeEl.setXY([
                box.left,
                box.top - 4
            ]);
        } else if (position === 'top') {
            me.activeEl.setXY([
                box.left,
                box.bottom + 2
            ]);
        }
    },
    destroy: function() {
        var me = this,
            el = me.activeEl;
        if (el) {
            el.destroy();
        }
        me.callParent(arguments);
    }
});

/**
 * allows for the simple sliding to new view and "back" to home view
 */
Ext.define('Valence.common.widget.NavContainer', {
    extend: 'Ext.Container',
    xtype: 'widget_navcontainer',
    layout: {
        type: 'card',
        animation: 'slide'
    },
    bind: {
        activeItem: '{activeItem}'
    },
    cls: 'vv-navcnt',
    /**
     * Animates back to the 0 index card unless specified otherwise and resets the slide direction.
     * @param {Number} [activeItem] (optional) The card to animate.
     * @param {String} [slideDirection] (optional) `right` or 'left' are acceptable parameters. Generally, you will want to use the default.
     * @param {boolean} [destroy] (optional) destroy the the component that is being hidden
     */
    animateBackToView: function(activeCard, slideDirection, destroy) {
        var me = this,
            activeItem = me.getActiveItem(),
            animation = me.getLayout().getAnimation(),
            defaultDirection = animation.getDirection();
        animation.setDirection(Ext.isEmpty(slideDirection) ? 'right' : slideDirection);
        me.setActiveItem(Ext.isEmpty(activeCard) ? 0 : activeCard);
        setTimeout(function() {
            if (destroy) {
                activeItem.destroy();
            }
            animation.setDirection(defaultDirection);
        }, 300);
    }
});

Ext.define('Valence.common.widget.NavDrawer', {
    extend: 'Ext.Container',
    xtype: 'widget_navdrawer',
    config: {
        open: false,
        bottom: 0,
        cls: 'mainmenu',
        docked: 'left',
        left: 0,
        top: 0,
        width: 266,
        zIndex: 0,
        layout: 'vbox'
    },
    setParent: function(parent) {
        var me = this;
        me.callParent(arguments);
        if (!Ext.isEmpty(parent)) {
            //mask the viewport when displaying the menu
            //
            me.maskCmp = parent.add({
                xtype: 'component',
                cls: 'valence-menu-mask',
                top: 0,
                zIndex: 900,
                hidden: true,
                width: 9999,
                left: me.getWidth(),
                bottom: 0
            });
            //autohide the menu when the user taps the mask
            //
            me.maskCmp.element.on({
                scope: this,
                touchend: 'onMaskRelease'
            });
        }
    },
    onMaskRelease: function(e) {
        e.preventDefault();
        this.setOpen(false);
    },
    onDestroy: function() {
        var me = this;
        me.maskCmp.destroy();
        delete me.maskCmp;
        me.callParent(arguments);
    },
    toggle: function() {
        var me = this;
        me.setOpen(!me.getOpen());
    },
    updateOpen: function(open) {
        var me = this,
            parentCt = me.up(),
            baseMenu = Ext.ComponentQuery.query('#valencemenubutton')[0],
            actionMenu = Ext.ComponentQuery.query('#valenceactionmenubutton')[0],
            menuBtn = (!Ext.isEmpty(baseMenu)) ? baseMenu : actionMenu,
            menuIconEl, targetEl, extTargetEl;
        if (!parentCt) {
            return;
        }
        targetEl = Ext.Viewport.innerElement;
        extTargetEl = Ext.get(targetEl);
        if (!Ext.isEmpty(menuBtn)) {
            menuIconEl = menuBtn.element.down('.x-button-icon');
        }
        if (open) {
            extTargetEl.setLeft(me.getWidth() + 'px');
            //display the menu
            //
            //targetEl.translate(me.getWidth(), 0, 0);
            if (!Ext.isEmpty(menuIconEl)) {
                menuIconEl.addCls('valence-menu-rotate');
            }
            //show the mask
            //
            setTimeout(function() {
                me.maskCmp.show();
                me.fireEvent('show', me);
            }, 100);
        } else {
            extTargetEl.setLeft(0 + 'px');
            //hide the menu
            //
            //targetEl.translate(0, 0, 0);
            if (!Ext.isEmpty(menuIconEl)) {
                menuIconEl.removeCls('valence-menu-rotate');
            }
            //hide the mask
            //
            setTimeout(function() {
                me.maskCmp.hide();
                me.fireEvent('hide', me);
            }, 0);
        }
    }
});
/**
 * Navdrawer - todo
 */
//Ext.define('Valence.common.widget.NavDrawer', {
//    extend              : 'Ext.Container',
//    requires            : [
//        'Ext.list.Tree'
//    ],
//    xtype               : 'widget_navdrawer',
//    width               : 300,
//    config              : {
//        /**
//         * @cfg {String} Specify the title.
//         */
//        title : null
//    },
//    /**
//     * @cfg {Boolean} [sliding=true] Navdrawer will slide in and out. This must be done via {@link #method-show} and {@link #method-hide}.
//     */
//    sliding             : true,
//    /**
//     * @cfg {Boolean} [hideOnSelection=true] Automatically hide the navdrawer when a user selects an item from the nav list.
//     */
//    hideOnSelection     : true,
//    /**
//     * @cfg {Boolean} [navIcon=false] Include a navigation drawer icon. When clicked, it will automatically hide the navdrawer.
//     */
//    navIcon             : false, /**
//     * @cfg {Boolean} [maskBodyOnShow=true] Mask the body of the document when this navdrawer is showing.
//     */
//    maskBodyOnShow      : true,
//    /**
//     * @cfg {Array} [navItems] A list of items for navigation of the app.
//     *
//     * ## Example usage
//     *     [{
//     *         text  : 'Home',
//     *         leaf  : true,    // meaning there are no sub-categories beneath this
//     *         event : 'home'   // if an item has an "event", it will be fired
//     *     },{
//     *         text : 'Clearance',
//     *         children : [{
//     *             text  : 'Outdoor',
//     *             event : 'outdoor',
//     *             leaf  : true
//     *         },{
//     *             text  : 'Seasonal',
//     *             event : 'seasonal',
//     *             leaf  : true
//     *         }]
//     *     },{
//     *         text  : 'New Items',
//     *         event : 'newitems',
//     *         leaf  : true
//     *     }]
//     *
//     */
//    navItems            : null,
//    /**
//     * @cfg {Object} [navStore] An Ext.data.TreeStore object. This would be used in place of navItems.
//     */
//    navStore            : null,
//    height              : '100%',
//    layout              : {
//        type  : 'vbox',
//        align : 'stretch'
//    },
//    /**
//     * @cfg {Object} [renderTo=Ext.getBody()] Specify the element to render this component to.
//     */
//    renderTo            : null,
//    /**
//     * @cfg {Object} [headerCfg] Component configuration that will be inserted at the top of this component.
//     */
//    headerCfg           : null,
//    /**
//     * @cfg {Boolean} [collapseOnBodyClick=true] Automatically collapse/hide this component if the user clicks anywhere on the document body (outside of this element).
//     */
//    /**
//     * @cfg {String} [treeListCls="w-navdrawer-tree] The class to apply to the tree.
//     */
//    treeCls             : 'w-navdrawer-tree',
//    /**
//     * @cfg {String} [treeListCls="w-navdrawer-treebody] The class to apply to the tree body.
//     */
//    treeBodyCls         : 'w-navdrawer-treebody',
//    collapseOnBodyClick : true,
//    clickListenerActive : false,
//    clickListenerSet    : false,
//    initComponent       : function () {
//        var me = this;
//        if (me.sliding) {
//            Ext.apply(me, {
//                x        : 0,
//                cls      : 'w-navdrawer',
//                floating : true,
//                renderTo : me.renderTo || Ext.getBody(),
//                shadow   : false
//            });
//        } else {
//            Ext.apply(me, {
//                cls : 'w-navdrawer is-active'
//            });
//        }
//        Ext.apply(me, {
//            items : me.buildItems()
//        });
//        me.callParent(arguments);
//    },
//
//    buildColumns : function(){
//        var me = this;
//        return me.columns || [{
//            xtype     : 'treecolumn',
//            dataIndex : 'text',
//            flex      : 1,
//            renderer  : function(v,cell,rec){
//                var icon  = rec.get('icon') + ' w-navdrawer-icon',
//                    style = rec.get('style'),
//                    s     = '<span class="{0}" style="{1}"></span>{2}';
//
//                return Ext.String.format(s,icon,style,v);
//            }
//        }];
//    },
//
//    buildItems : function () {
//        var me       = this,
//            i        = [],
//            navStore = (me.navItems) ? me.buildStore() : me.navStore;
//
//        if (me.navIcon || me.title) {
//            i.push({
//                xtype : 'toolbar',
//                cls   : 'navdrawer-header',
//                items : []
//            });
//            if (me.navIcon) {
//                i[0].items.push({
//                    iconCls : 'vvicon-menu7',
//                    ui      : 'plain',
//                    scope   : me,
//                    handler : me.onClickNavIcon
//                });
//            }
//            if (me.title) {
//                i[0].items.push({
//                    xtype : 'tbtext',
//                    cls   : 'navdrawer-title',
//                    text  : me.title
//                });
//            }
//        }
//
//        if (me.headerCfg) {
//            i.push(me.headerCfg);
//        }
//
//        i.push({
//            xtype        : 'treelist',
//            flex         : 1,
//            cls          : me.treeCls,
//            bodyCls      : me.treeBodyCls,
//            store        : navStore,
//            rootVisible  : false,
//            hideHeaders  : true,
//            scrollable   : 'y',
//            columns      : me.buildColumns(),
//            listeners    : {
//                scope     : me,
//                cellclick : me.onCellClickTreeList
//            }
//        });
//        return i;
//    },
//
//    buildStore : function () {
//        var me = this;
//        return Ext.create('Ext.data.TreeStore', {
//            root : {
//                expanded : true,
//                children : me.navItems
//            }
//        });
//    },
//
//    applyTitle : function (title) {
//        return title;
//    },
//
//    /**
//     * Hide the navdrawer.
//     */
//    hide : function () {
//        var me = this;
//        me.el.removeCls('is-active');
//        if (me.maskBodyOnShow) {
//            Ext.Viewport.unmask();
//            //Ext.getBody().unmask();
//        }
//        me.clickListenerActive = false;
//    },
//
//    onBodyClick : function(e){
//        var me = this;
//        if (me.clickListenerActive && !e.within(me.el)){
//            me.hide();
//        }
//    },
//
//    onClickNavIcon : function () {
//        var me = this;
//        me.hide();
//    },
//
//    onCellClickTreeList : function (view, td, cellIndex,rec, tr, rowIndex, e) {
//        var me       = this,
//            leaf     = rec.isLeaf(),
//            el       = Ext.get(e.getTarget()),
//            elTarget = el.getAttribute('data-event'),
//            event    = (leaf) ? rec.get('event') : null;
//
//        if (elTarget){
//            me.fireEvent(elTarget,rec);
//        } else {
//            if (event) {
//                if (view.getSelection() !== rec) {
//                    me.fireEvent(event, rec);
//                }
//
//                if (me.hideOnSelection) {
//                    me.hide();
//                }
//            } else {
//                me.clickListenerActive = false;
//                rec[ rec.isExpanded() ? 'collapse' : 'expand']();
//                setTimeout(function(){
//                    me.clickListenerActive = true;
//                },200);
//            }
//        }
//    },
//
//    /**
//     * Show the navdrawer.
//     */
//    show : function () {
//        var me = this;
//        me.callParent(arguments);
//        if (me.maskBodyOnShow) {
//            Ext.Viewport.mask({});
//            //Ext.getBody().mask();
//            //me.toFront();
//        }
//        me.el.addCls('is-active');
//
//        if (me.collapseOnBodyClick && !me.clickListenerSet) {
//            Ext.getBody().on({
//                scope  : me,
//                buffer : 150,
//                click  : me.onBodyClick
//            });
//            me.clickListenerSet = true;
//        }
//        setTimeout(function(){
//            me.clickListenerActive = true;
//            debugger;
//        },500);
//
//    }
//});

