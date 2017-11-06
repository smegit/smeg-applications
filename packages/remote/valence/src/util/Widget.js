Ext.define('Valence.util.Widget', {
    singleton : true,
    create    : function (o) {
        // "o" must contain the following...
        //    id : the ID of the widget
        //
        // "o" may contain the following...
        //    callback : a callback function to process after the widget is created
        //    scope : the scope to run the callback function in
        //    postParms : an object to apply to the post
        //    widgetConfig : an object to apply to the widget config before instantiating
        //
        var options  = o || {},
            scope    = o.scope || window,
            callback = o.callback || null,
            widget   = null,
            name     = null;

        if (!options.id) {
            return;
        }

        // all widgets should be created through this process...
        //   first, package up the parameters to pass on to "getWidget"...
        //
        var config = {},
            parms  = {
                pgm    : 'vvwdgt',
                action : 'getWidget',
                vvId   : options.id
            };
        // apply additional postParms if passed...
        //
        if (options.postParms) {
            parms = Ext.apply(parms, options.postParms);
        }


        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : parms,
            scope   : this,
            success : function (r) {
                var d = Ext.decode(r.responseText);

                if (d.SUCCESS === '1') {
                    // apply all VVWDG200 records to the config object...
                    //
                    Ext.iterate(d.VVWDG200, function (obj) {
                        config[obj.VVPROP] = obj.VVVALUE;
                    });
                    delete d.VVWDG200;

                    // next apply all other properties of the "d" object to the config...
                    //
                    Ext.iterate(d, function (property, value) {
                        config[property] = value;
                    });
                    // next, apply any additional widget configs if passed...
                    //
                    if (options.widgetConfig) {
                        config = Ext.apply(config, options.widgetConfig);
                        name = options.widgetConfig.VVNAME || null;
                    }

                    Ext.apply(config,{
                        VVNAME : name || Valence.util.Helper.decodeUTF16(d.VVNAME)
                    });
                    Ext.apply(config, {
                        VVDESC : Valence.util.Helper.decodeUTF16(d.VVDESC)
                    });

                    if (o.onlyCreateConfig) {
                        widget = Ext.apply(config, {
                            xtype : d.VVCRTXTP
                        });
                    } else {
                        widget = Ext.create(d.CMP, config);
                    }
                } else {   // SUCCESS = '0'
                    Ext.Msg.alert('Error creating Valence widget', 'Widget id ' + options.id + ' could not be created. Ensure it still exists.');
                }

                if (typeof(callback) === 'function') {
                    if (widget) {
                        Ext.callback(callback, scope, [widget]);
                    } else {
                        Ext.callback(callback, scope, [null]);
                    }
                }
                return widget;
            }
        });
    }
});
