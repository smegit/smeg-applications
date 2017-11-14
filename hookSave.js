Ext.define('Valence.Hook', {
    singleton              : true,
    portalSettingOverrides : {
        favicon : '/resources/images/smeg/smeg_favicon.ico'
    },
    activeAgent            : null,
    agencies               : [],
    allowAutoStart         : false,
    basicView              : false,
    agencyFields           : ['ACCOUNT', 'NAME'],
    ui                     : {
        /*
         Change the image used for the Portal login. One may be specified for each theme or the "default" will be used for all.

             Examples:
             1.)Same image used for all themes:
                 loginLogoUrl : {
                     "default" : "path_to_my_company_image.png",
                     "dracula" : null,
                     "metal"   : null
                 }

             2.)Different image for each theme:
                 loginLogoUrl : {
                     "default" : "path_to_my_company_image.png",
                     "dracula" : "path_to_another_image.png",
                     "metal"   : "yet_another_path.png"
                 }
         */
        loginLogoUrl  : {
            "default" : '/resources/images/smeg/smeg_logo.png',
            "dracula" : null,
            "metal"   : null
        },
        /*
         Change the image used for the Portal control bar.  Same rules apply as loginLogoUrl above.
         */
        portalLogoUrl : {
            "default" : '/resources/images/smeg/smeg_logo.png',
            "dracula" : null,
            "metal"   : null
        },
        /*
         Change the image used for the Portal lock window.  Same rules apply as loginLogoUrl above.
         */
        lockLogoUrl   : {
            "default" : '/resources/images/smeg/smeg_logo.png',
            "dracula" : null,
            "metal"   : null
        },

        /*
         Add footer items here. If the footer object is not empty, Valence will apply the footer as a
         config to a container.  A sample footer may look as follows:

            footer : {
                layout : {
                    type : 'hbox'
                },
                cls    : 'my-footer',    // css could be provided at resources/themes/css/Portal/overrides.css
                items  : [{
                    xtype : 'component',
                    html  : 'My Company Name'
                },{
                    xtype : 'component',
                    html  : '<a href="http://www.mycompany.com" target="_blank">Company Website</a>
                }]
            }
         */
        footer : {
            // layout : {
            //     type  : 'vbox',
            //     align : 'middle'
            // },
            // cls    : 'smeg-footer',
            // items  : [{
            //     xtype : 'component',
            //     html  : '<div class="base">&copy; ' + Ext.Date.format(new Date(), 'Y') + ' Smeg Australia Pty Ltd Smeg  2-8 Baker Street 2019 Botany Au</div>'
            // }]
        }
    },
    constructor            : function () {
        var me        = this,
            ns        = Valence.login.Processor.getNamespace(),
            app       = (typeof window[ns].getApplication === 'function') ? window[ns].getApplication() : null,
            basicView = Ext.getUrlParam('basic');

        //don't allow user to launch previous running apps
        //
        sessionStorage.setItem('valence-last-running-apps', '');

        //check if this is smeg basic view
        // if true then we will override the launchpad and if the user clicks on initials
        // instead of going into user settings just show the change password window.
        //
        if (!Ext.isEmpty(basicView) && basicView === 'true') {
            me.basicView = true;
            me.overrideLaunchpad();
        }

        if (app) {
            app.on({
                scope                    : me,
                activateapp              : function (app) {
                },
                afterautostart           : function (apps) {
                },
                appsloaded               : function (appStore) {
                    // fired after the "Apps" store has been loaded...
                },
                beforeactivateapp        : function (app) {
                    // return false to prevent the app from activating...
                },
                beforeautostart          : function () {
                    return me.allowAutoStart;
                },
                beforechangepassword     : function (params) {
                    // return false to prevent call...
                },
                beforecloseapp           : function (app) {
                    // return false to prevent closing the app...
                },
                beforeenvironmentset     : function (user, env) {
                    // return false to prevent setting of environment...
                },
                beforelaunchapp          : function (app) {
                    // return false to prevent the app from launching
                },
                beforelock               : function () {
                    // return false to prevent the lock attempt
                },
                beforelogin              : function (params) {
                    // return false to prevent login attempt...
                },
                beforelogout             : function (user, params) {
                    // return false to prevent logout...
                },
                beforepoll               : function (params) {
                },
                beforesendpassword       : function (params) {
                    // return false to prevent call to sendpassword...
                },
                beforeshowappcircles     : function (apps) {
                    // return false to prevent showing...
                },
                beforeshowchangepassword : function () {
                    // return false to prevent showing...
                },
                beforeusersettings       : function (el) {
                    //if basic view show the change password instead of the
                    // base functionality of showing the user settings section
                    //
                    if (me.basicView) {
                        Portal.getApplication().fireEvent('changepassword', el);
                        return false;
                    }
                },
                closeapp                 : function (app) {
                },
                componentrender          : function (cmp) {
                    var me = this;

                    //get the controlbar and add the agency selection
                    //
                    if (cmp.xtype === 'controlbar') {
                        me.setupControlbar(cmp);
                    }
                },
                environmentset           : function (user, env) {
                },
                launchapp                : function (app) {
                },
                lock                     : function () {
                },
                login                    : function (user, sid) {
                    if (!Ext.isEmpty(window.Portal)){
                        this.checkAgencies(user, sid);

                        window['smegGetCurrentAgent'] = Ext.bind(me.getCurrentAgent,me);
                    }
                },
                loginfailure             : function (parms, response) {
                },
                loggedout                : function (user) {
                },
                passwordchanged          : function (user, pwd) {
                },
                poll                     : function (rsp) {
                },
                portalsearchshow         : function () {
                    var me = this;
                    me.showHideAgencySelector('hide');
                },
                portalsearchinactive     : function () {
                    var me = this;
                    me.showHideAgencySelector('show');
                },
                settingsapplied          : function () {
                    var me = this,
                        fnc;
                    for (var i in me.portalSettingOverrides) {
                        fnc = 'set' + Ext.util.Format.capitalize(i);
                        if (typeof Valence.login.config.Settings[fnc] === "function") {
                            Valence.login.config.Settings[fnc](me.portalSettingOverrides[i]);
                        } else {
                            Valence.login.config.Settings[i] = me.portalSettingOverrides[i];
                        }
                    }
                },
                smegagentchanged : function(agent){
                    if (!Ext.isEmpty(agent)){
                        me.activeAgent = agent;
                        me.silentlySetAgent();
                    }
                }
            });
        }
    },

    /**
     * checkAgencies - check to see if the user has access to more than one agency and if so ask them
     *   which agency they would like to work with.
     * @param user
     * @param sid
     */
    checkAgencies : function (user, sid) {
        var me = this;
        Valence.common.util.Helper.loadMask('Loading');
        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : {
                pgm    : 'EC1000',
                action : 'getAgencies'
            },
            scope   : me,
            success : function (r) {
                var me = this,
                    d  = Ext.decode(r.responseText);
                Valence.common.util.Helper.destroyLoadMask();

                if (!Ext.isEmpty(d)) {
                    me.agencies = d.agencies;

                    if (!Ext.isEmpty(me.agencies) && me.agencies.length > 1) {
                        me.requestAgency();
                    } else if (!Ext.isEmpty(me.agencies)) {
                        me.activeAgent = me.agencies[0].ACCOUNT;
                        me.silentlySetAgent();
                    }
                }
            },
            failure : function () {
                Valence.common.util.Helper.destroyLoadMask();
                me.startAutoStartApps();
            }
        });
    },

    /**
     * getCurrentAgent - get the current active agent
     */
    getCurrentAgent : function(){
        return this.activeAgent;
    },

    /**
     * overrideLaunchpad - override the launchpad with the SMEG welcome application
     */
    overrideLaunchpad : function () {
        //override the launch pad with an iframe that loads the SMEG welcome page
        //
        Ext.define('Portal.view.launchpad.Launchpad', {
            extend : 'Ext.container.Container',
            xtype  : 'launchpad',
            title  : 'Welcome',
            layout : 'fit',
            items  : [{
                xtype     : 'uxiframe',
                src       : '/SmegApps/build/production/Welcome/index.html?app=1020&sid=' + Valence.util.Helper.getSid() + '&lng=' + Valence.util.Helper.getLanguage(),
                listeners : {
                    render : {
                        single : true,
                        fn     : function (cmp) {
                            Valence.common.util.Helper.loadMask({
                                renderTo : cmp.el,
                                text     : 'Welcome'
                            });
                        }
                    },
                    load   : function (cmp) {
                        Valence.common.util.Helper.destroyLoadMask(cmp.el);
                    }
                }
            }]
        });
    },

    /**
     * requestAgency - request the user select an agency
     */
    requestAgency : function () {
        var me           = this,
            store        = Ext.create('Ext.data.Store', {
                fields : me.agencyFields,
                data   : Ext.clone(me.agencies)
            }),
            agencyWindow = Ext.create('Ext.window.Window', {
                title    : 'Select Agency',
                renderTo : Ext.getBody(),
                closable : false,
                modal    : true,
                width    : 500,
                height   : 400,
                allowEsc : false,
                cls      : 'smeg-agency-sel-win',
                layout   : 'fit',
                items    : [{
                    xtype       : 'grid',
                    store       : store,
                    dockedItems : [{
                        xtype  : 'toolbar',
                        cls    : 'smeg-agency-sel-win-sch-tb',
                        dock   : 'top',
                        style  : {
                            'z-index' : 11
                        },
                        layout : 'fit',
                        items  : [{
                            xtype     : 'textfield',
                            emptyText : 'Search',
                            listeners : {
                                scope       : me,
                                afterrender : function (cmp) {
                                    setTimeout(function () {
                                        cmp.focus();
                                    }, 100);
                                },
                                change      : {
                                    buffer : 350,
                                    fn     : function (cmp, value) {
                                        Valence.util.Helper.processTypedInputFilter(store, ['ACCOUNT', 'NAME'], value, 'smegAgentFilter');
                                    }
                                },
                                specialkey  : function (cmp, e) {
                                    if (e.getKey() == e.ENTER) {
                                        var grid  = cmp.up('grid'),
                                            store = grid.getStore();
                                        if (store.count() === 1) {
                                            me.setAgent(store.getAt(0));
                                            agencyWindow.destroy();
                                        }
                                    }
                                }
                            }
                        }]
                    }],
                    hideHeaders : true,
                    columns     : [{
                        flex      : 3,
                        dataIndex : 'NAME'
                    }, {
                        flex      : 1,
                        dataIndex : 'ACCOUNT',
                        align     : 'right'
                    }],
                    listeners   : {
                        scope     : me,
                        itemclick : function (cmp, rec) {
                            me.setAgent(rec);
                            agencyWindow.destroy();
                        }
                    },
                    onEsc       : function () {
                        return;
                    }
                }]
            }).show();
    },

    /**
     * setAgent - set the agent selected from the window or the combo
     * @param rec
     */
    setAgent : function (rec) {
        var me         = this,
            agent      = rec.get('ACCOUNT'),
            resetAgent = function () {
                if (!Ext.isEmpty(me.activeAgent)) {
                    me.silentlySetAgent();
                }
            };

        Valence.common.util.Helper.loadMask('Setting Agent');

        Ext.Ajax.request({
            url     : '/valence/vvcall.pgm',
            params  : {
                pgm    : 'EC1000',
                action : 'setAgent',
                agent  : agent
            },
            scope   : me,
            success : function (r) {
                var me = this,
                    d  = Ext.decode(r.responseText);

                Valence.common.util.Helper.destroyLoadMask()

                if (!d.success) {
                    Valence.common.util.Dialog.show({
                        msg     : d.msg || 'Not able to set agency at this time.',
                        buttons : [{
                            text : Valence.lang.lit.ok
                        }],
                        scope   : me,
                        handler : resetAgent
                    });
                } else {
                    var apps = Ext.ComponentQuery.query('uxiframe'),
                        frameWindow;

                    me.activeAgent = agent;
                    me.silentlySetAgent();

                    //loop through the applications and notify them agent has changed
                    // this would be a method on the window if the application cares the
                    // agent has changed
                    //
                    for (var ii = 0; ii < apps.length; ii++) {
                        frameWindow = apps[ii].getWin();
                        if (!Ext.isEmpty(frameWindow.smegAgentChanged) && typeof frameWindow.smegAgentChanged === 'function') {
                            frameWindow.smegAgentChanged(agent);
                        }
                    }
                }
            },
            failure : function () {
                Valence.common.util.Helper.destroyLoadMask();
                resetAgent();
            }
        });
    },

    /**
     * setupControlbar - add the current agency and if they have more than one give them the ability
     *   to change the agent.
     * @param cmp
     */
    setupControlbar : function (cmp) {
        var me       = this,
            items    = cmp.items.items,
            agencies = (!Ext.isEmpty(me.agencies)) ? me.agencies : [],
            store    = Ext.create('Ext.data.Store', {
                fields : me.agencyFields,
                data   : agencies,
                type   : 'memory',
                reader : {
                    type : 'json'
                }
            }),
            insertIndex;

        //first find the search button
        //
        for (var ii = 0; ii < items.length; ii++) {
            if (items[ii].cls === 'vv-ctrlbar-search-btn') {
                insertIndex = ii;
            }
        }

        if (Ext.isEmpty(insertIndex)) {
            insertIndex = items.length;
        } else {
            insertIndex += 1;
        }

        cmp.insert(insertIndex, {
            xtype          : 'combo',
            cls            : 'smeg-agency-sel',
            itemId         : 'smegAgencySelector',
            store          : store,
            grow           : true,
            hideLabel      : true,
            valueField     : 'ACCOUNT',
            displayField   : 'NAME',
            queryMode      : 'local',
            allowBlank     : false,
            forceSelection : true,
            anyMatch       : true,
            readOnly       : (!Ext.isEmpty(agencies) && agencies.length === 1) ? true : false,
            hidden         : (Ext.isEmpty(agencies)) ? true : false,
            value          : me.activeAgent,
            listConfig     : {
                cls : 'smeg-agency-sel-list'
            },
            listeners      : {
                scope       : me,
                afterrender : function (cmp) {
                    cmp.agentTip = Ext.create('Ext.tip.ToolTip', {
                        showDelay : 800,
                        target    : cmp.el,
                        html      : '',
                        listeners : {
                            scope      : me,
                            beforeshow : function (cmp) {
                                var sel         = Ext.ComponentQuery.query('#smegAgencySelector')[0],
                                    selectedRec = (!Ext.isEmpty(sel)) ? sel.getSelection() : null;
                                if (!Ext.isEmpty(selectedRec)) {
                                    cmp.setHtml('<div class="smeg-agency-sel-tip"><span class="label">Agent #: </span><span class="code">' + selectedRec.get('ACCOUNT') + '</span></div>')
                                    return true;
                                }
                                return false;
                            }
                        }
                    });
                },
                select      : function (cmp, rec) {
                    var me = this;
                    if (rec.get('ACCOUNT') !== me.activeAgent) {
                        me.setAgent(rec);
                        cmp.blur();
                    }
                }
            }
        });
    },

    /**
     * showHideAgencySelector - show/hide the agency selector in the top controlbar
     * @param action
     */
    showHideAgencySelector : function (action) {
        var me               = this,
            agenciesSelector = Ext.ComponentQuery.query('#smegAgencySelector')[0];

        if (action === 'show') {
            if (!Ext.isEmpty(me.agencies)) {
                agenciesSelector.show();
            }
        } else {
            agenciesSelector.hide();
        }
    },

    silentlySetAgent : function () {
        var me            = this,
            agentSelector = Ext.ComponentQuery.query('#smegAgencySelector')[0];

        if (!Ext.isEmpty(agentSelector)) {
            if (!Ext.isEmpty(me.activeAgent)) {
                agentSelector.suspendEvents();
                agentSelector.setValue(me.activeAgent);
                agentSelector.resumeEvents();
            }

            if (me.agencies.length < 2) {
                agentSelector.setReadOnly(true);
            } else {
                agentSelector.setReadOnly(false);
            }
        }

        if (!me.allowAutoStart) {
            me.startAutoStartApps();
        }
    },

    /**
     * startAutoStartApps - start the auto start apps if needed. We stop them initially because
     *  we need to check if the user has access to multiple agents.
     */
    startAutoStartApps : function () {
        var me      = this,
            main    = Ext.ComponentQuery.query('main')[0],
            mainCtl = (!Ext.isEmpty(main)) ? main.getController() : null;

        //set the auto start is allow to be performed
        //
        me.allowAutoStart = true;
        setTimeout(function () {
            //call the portal autostart method
            //
            if (!Ext.isEmpty(mainCtl)) {
                Ext.bind(mainCtl.autoStartApps, mainCtl)();
            }
        }, 150);

    }
});