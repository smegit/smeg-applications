Ext.define('Valence.common.util.Helper', {
    singleton                 : true,
    requires                  : [
        'Ext.util.MixedCollection',
        'Ext.XTemplate',
        'Valence.common.widget.Background',
        'Valence.common.widget.Loadmask'
    ],
    loadMaskMC                : Ext.create('Ext.util.MixedCollection'),
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
    buildEmptyText            : function (emptyText) {
        var me                   = this,
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
        if (!Ext.isEmpty(emptyText.hideImage) && emptyText.hideImage){
            imageAdditionalStyle = 'display:none;'
        }

        if (Ext.isEmpty(emptyText.iconCls)){
            emptyText.iconCls = 'vvicon-cloud';
        }

        tpl = new Ext.XTemplate(
            '<div class="vv-empty-text-wrap">',
                '<div class="vv-empty-text-cnt">',
                    '<div style="' + imageAdditionalStyle + '"><span class="vvicon {iconCls}"></div>',
                    '<div class="vv-empty-text">',
                        '{heading}',
                    '</div>',
                    '<tpl if="subText">',
                        '<div class="vv-empty-subtext">',
                            '<tpl if="events.length == 0">',
                                '{subText}',
                            '<tpl else>',
                            '{[this.buildSubText(values)]}',
                            '</tpl>',
                        '</div>',
                    '</tpl>',
                '</div>',
            '</div>',
            {
                buildSubText : function (vals) {
                    var eventSpanArray = [vals.subText],
                        events         = vals.events,
                        event;
                    for (var i = 0; i < events.length; i++) {
                        event = events[i];
                        eventSpanArray.push(Ext.util.Format.format('<span data-event="{0}" class="vv-empty-text-event">{1}</span>', event.event, event.text));
                    }
                    return Ext.bind(Ext.util.Format.format, null, eventSpanArray)();
                }
            }
        );
        return tpl.applyTemplate(emptyText);
    },
    destroyInitialLoadingMask : function () {
        var me      = this,
            loading = Ext.fly('spinner');

        //destroy the initial loading mask defined in the index
        // if found
        //
        if (!Ext.isEmpty(loading)) {
            loading.fadeOut({
                callback : function () {
                    loading.destroy();
                }
            });
        }
    },
    destroyLoadMask           : function (renderTo) {
        var me   = this,
            el   = renderTo || Ext.getBody(),
            mask = me.loadMaskMC.get(el.id);

        if (mask) {
            if (Ext.isClassic){
                mask.el.fadeOut({
                    callback : function(){
                        me.loadMaskMC.remove(mask);
                        mask.destroy();
                    }
                });
            } else {
                mask.element.hide();
                setTimeout(function(){
                    me.loadMaskMC.remove(mask);
                    mask.destroy();
                },300);
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

    download : function(parms){
        var url = '/valence/vvcall.pgm',
            sid = localStorage.getItem('sid'),
            src;

        if (!Ext.isEmpty(parms.url)){
            url = parms.url;
        }
        if (!Ext.isEmpty(parms.sid)){
            sid = parms.sid;
        }
        if (Ext.isEmpty(parms.omitPortalCredentials)){
            src = url + '?sid=' + sid + '&app='+Ext.getUrlParam('app');
        } else {
            src = url + '?vv=true';
        }
        Ext.iterate(parms,function(key,value){
            src += '&' + key + '=' + encodeURI(value);
        });

        Ext.core.DomHelper.append(document.body, {
            tag         : 'iframe',
            frameBorder : 0,
            width       : 0,
            height      : 0,
            css         : 'display:none;visibility:hidden;height:1px;',
            src         : src
        });
    },

    formatErrorMessage : function (d) {
        var eMsg = '',
            vTxt = '';
        if (!Ext.isEmpty(d.MSG)) {
            eMsg = Valence.lang.lit[d.MSG];
            if (Ext.isEmpty(eMsg)){
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

    getDynamicFieldWidth : function (fieldInfo, view, fieldNameAsLabel, bothFieldDesc) {
        var me              = this,
            getInputMetrics = function () {
                var tm = view.measurer,
                    el;
                if (Ext.isEmpty(tm)) {
                    el = view.el.createChild();
                    el.addCls('x-form-field x-form-text x-form-text-default').applyStyles({
                        display : 'none'
                    });

                    view.measurer = tm = new Ext.util.TextMetrics(el);

                    //listen for the destroy of the view so we can destroy the textMetrics
                    //
                    view.on({
                        scope         : me,
                        beforedestroy : function (view) {
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
            getLabelMetrics = function () {
                var tm = view.labelMeasurer,
                    el;
                if (Ext.isEmpty(tm)) {
                    el = view.el.createChild();
                    el.addCls('x-form-item-label-inner-default').applyStyles({
                        display : 'none'
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
            var placeholderId    = (fieldInfo.TYPE === 'Numeric' || fieldInfo.TYPE === 'N') ? 8 : 'w',
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
            width      : (width >= labelWidth) ? width : labelWidth,
            labelWidth : labelWidth,
            inputWidth : (width < labelWidth) ? width + 20 : width
        }
    },

    getLit                    : function(o){
        var isObj = Ext.isObject(o),
            lit   = !isObj ? o : o.lit,
            text;

        if (lit){
            text = Valence.lang.lit[lit];

            if (text && isObj && o.var1){
                text = text.replace('VAR1', Valence.util.Helper.decodeUTF16(o.var1 + ''));
            }
            if (text && isObj && o.var2){
                text = text.replace('VAR2', Valence.util.Helper.decodeUTF16(o.var2 + ''));
            }
            if (text && isObj && o.var3){
                text = text.replace('VAR3', Valence.util.Helper.decodeUTF16(o.var3 + ''));
            }
        } else {
            if (!Ext.isEmpty(o.msg)){
                text = o.msg;
            } else if (!Ext.isEmpty(o.MSG)){
                text = o.MSG;
            }
        }
        return text;
    },
    loadMask                  : function (o) {
        var me   = this,
            obj  = Ext.isObject(o) ? o : {text : o},
            text = obj.text,
            type = obj.type || 'rect',
            el   = obj.renderTo || Ext.getBody(),
            cmp;

        // ensure a mask does not already exist for this el...
        //
        if (Ext.isEmpty(me.loadMaskMC.get(el.id))){
            if (Ext.isClassic){
                cmp = Ext.create('Valence.common.widget.Loadmask', {
                    text     : text || '&nbsp;',
                    renderTo : el,
                    type     : type
                });
            } else {
                cmp = Ext.create('Valence.common.widget.Loadmask', {
                    data     : {
                        text     : text || '&nbsp;'
                    },
                    renderTo : el,
                    type     : type
                });
            }


            me.loadMaskMC.add(el.id,cmp);
        }
    },
    showBgTransition : function(o){
        var me      = this,
            obj     = o || {},
            pos     = obj.position || [1,1],
            style   = obj.style || {},
            scale   = (Ext.getBody().getWidth()/20) + 50,
            text    = 'scale(' + scale + ')',
            cmp;

        cmp = Ext.widget('widget_background',{
            renderTo : Ext.getBody()
        });
        cmp.el.setStyle(Ext.apply(style,{
            'transform'         : text,
            '-webkit-transform' : text,
            '-ms-transform'     : text
        }));
        cmp.showAt(pos);
        return cmp;
    },

    uppercaseFirstCharOnly : function (v) {
        if (!Ext.isEmpty(v)) {
            return v.substring(0, 1).toUpperCase() + v.substring(1).toLowerCase();
        }
        return '';
    }
});