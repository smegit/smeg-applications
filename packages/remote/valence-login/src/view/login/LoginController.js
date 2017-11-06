Ext.define('Valence.login.view.login.LoginController', {
    extend         : 'Ext.app.ViewController',
    alias          : 'controller.login',
    requires       : [
        'Valence.common.util.Dialog',
        'Valence.login.view.changepassword.Changepassword',
        'Valence.login.store.Connections',
        'Valence.common.util.Snackbar',
        'Valence.login.util.Helper'
    ],

    init : function(){
        var me = this;
        me.listen({
            global : {
                vvonline : 'onNetworkChangeOnline',
                vvoffline : 'onNetworkChangeOffline'
            }
        });
    },

    initViewModel : function (vm) {
        var me   = this,
            view = me.getView(),
            connection,
            rec,
            store;

        vm.set({
            forgotPasswordText : Valence.lang.lit.forgotPassword,
            connectionsText    : Valence.lang.lit.noConnections,
            showForgotPassword : Valence.login.config.Settings.getShowForgotPassword()
        });

        if (Ext.isModern) {
            vm.bind('{loginValidation}', function (loginValidation) {
                Ext.each(view.query('field'), function (item) {
                    if (/field/.test(item.getXTypes())) {
                        item.toggleCls('vv-field-invalid', !loginValidation);
                    }
                    return true;
                });
            });
        }
    },

    afterRender    : function (cmp) {
        var me       = this,
            user     = cmp.lookupReference('user'),
            password = cmp.lookupReference('password');

        setTimeout(function(){
            var uVal, pVal;
            if (!Ext.isEmpty(user)){
                uVal = user.getValue();
            }
            if (!Ext.isEmpty(password)){
                pVal = password.getValue();
            }

            if (user && Ext.isEmpty(uVal)) {
                user.focus();
            } else {
                password.focus();
            }
            if (!Ext.isEmpty(uVal) && !Ext.isEmpty(pVal)){
                me.onLogin();
            }
        },200);

    },

    // Used for modern to check if the login package is running from the mobile portal
    //
    onAfterRenderLogin : function(){
        var me = this,
            vm = me.getViewModel(),
            connection,rec,store,find;
        if (vm.get('connectionRequired')) {
            store = me.getConnectionStore();
            find = function(rec){
                if (rec.get('selected') && rec.get('invalid')){
                    return true;
                }
                return false;
            }
            rec = store.getAt(store.findBy(find));
            if (!Ext.isEmpty(rec)) {
                vm.set({
                    hasConnection : false,
                    connectionsText : rec.get('desc') + ' !',
                    loginDisabled : true
                });
                Valence.common.util.Dialog.show({
                    title : Valence.lang.lit.invalidConnection,
                    msg : 'Cannot connect to ' + rec.get('desc'),
                    buttons : ['->',{
                        text : Valence.lang.lit.ok
                    }],
                    handler : function(){
                        me.connectionHandler(false);
                    }
                });
                return;
            }
            rec = store.findRecord('selected',true);
            if (store.getCount() > 0) {
                if (Ext.isEmpty(rec)){
                    rec = store.getAt(0);
                    rec.set('selected',true);
                    rec.commit();
                    store.sync();
                }
                connection = {
                    hasConnection : true,
                    connectionsText : rec.get('desc'),
                    hostUrl : rec.get('url') + ":" + rec.get('port')
                };
                Ext.apply(connection,rec.getData());
            } else {
                connection = {
                    hasConnection : false,
                    loginDisabled : true,
                    connectionsText    : Valence.lang.lit.noConnections
                }
            }
            vm.set(connection);
            // added timeout to ensure the viewport is unmasked
            //
            setTimeout(function(){
                Ext.Viewport.unmask();
            },300);
        }
    },

    getConnectionStore : function(){
        var str = Ext.getStore('Connections');

        if (Ext.isEmpty(str)){
            str = Ext.create('Valence.login.store.Connections');
        }

        return str;
    },

    onClickConnectionMenuAdd : function(){
        var me = this,
            vm = me.getViewModel();
        vm.set('inConnectionEditMode',false);
        me.connectionHandler(true);
    },

    onClickConnectionMenuBtn : function(btn){
        var me = this,
            vm = me.getViewModel(),
            rec = btn.rec,
            connName = rec.get('desc'),
            url = rec.get('url') + ':' + rec.get('port'),
            loginPkgOpts = Valence.login.Processor.getOptions(),
            connStr = me.getConnectionStore(),
            prevSel = connStr.findRecord('selected', true);

        if (!Ext.isEmpty(prevSel)) {
            prevSel.set({
                selected : false
            });
        }
        rec.set('selected',true);
        connStr.sync();

        Valence.login.Processor.setOptions(Ext.apply(loginPkgOpts,{
            hostUrl : url
        }));
        Valence.login.Processor.setHostUrl(url);
        me.fireEvent('changeconnection',url);

        if (vm.get('inConnectionEditMode')) {
            if (!Ext.isEmpty(rec)){
                vm.set({
                    connRec : rec
                });
            }
            me.connectionHandler(true);
            return;
        }
        vm.set({
            hasConnection : true,
            loginDisabled : false,
            connectionsText : connName
        });
        Ext.Viewport.hideMenu('left');
    },

    onClickConnectionMenuEdit : function(){
        var me = this,
            vm = me.getViewModel();
        vm.set('inConnectionEditMode',!vm.get('inConnectionEditMode'));
    },

    onClickCancelForgotPassword : function () {
        var me = this,
            vm = me.getViewModel();

        vm.set({
            forgotPasswordPrompt : false,
            forgotPasswordText   : Valence.lang.lit.forgotPassword,
            loginValidation : true
        });
    },

    connectionHandler : function(fromMenu) {
        var me = this,
            view = me.getView(),
            vm = me.getViewModel(),
            footer = {
                xtype : 'container',
                docked : 'bottom',
                layout : {
                    type : 'hbox'
                },
                defaults : {
                    height : 40,
                    ui : 'transparent',
                    flex : 1
                },
                items : [{
                    xtype : 'button',
                    bind : {
                        iconCls : '{connectionFtrEditIconCls}'
                    },
                    listeners : {
                        tap : 'onClickConnectionMenuEdit',
                        scope : me
                    }
                }, {
                    xtype : 'button',
                    iconCls : 'fa fa-plus',
                    listeners : {
                        tap : 'onClickConnectionMenuAdd',
                        scope : me
                    }
                }]
            },
            header  = {
                xtype : 'component',
                cls   : 'vv-connections-menu-hdr',
                html  : Valence.lang.lit.connections
            },
            store, menu,connectionBtns = [],btnTxt,menuItems,lock;

        store = Ext.getStore('Connections');

        if (store.getCount() == 0 || fromMenu){
            if (fromMenu){
                Ext.Viewport.hideMenu('left');
            }
            view.setActiveItem(1);
        } else {
            store.each(function(rec){
                btnTxt = rec.get('desc');
                if (rec.get('invalid')){
                    btnTxt += '<span style="padding-left:8px; position:relative; top:1px;" class="vvicon vvicon-notification2"></span>';
                }
                connectionBtns.push({
                    text : btnTxt,
                    rec : rec,
                    bind : {
                        iconCls : '{editConnectionBtnIconCls}'
                    }
                });
            });
            menuItems = [header,{
                xtype : 'container',
                cls   : 'vv-connections-menu-body',
                defaultType : 'button',
                defaults : {
                    ui : 'transparent',
                    listeners : {
                        tap : 'onClickConnectionMenuBtn',
                        scope : me
                    },
                    cls : 'vv-connections-menu-body-btn',
                    iconAlign : 'right'
                },
                items : connectionBtns
            }];
            lock = Valence.login.config.Settings.getLockConnections();
            if (Ext.isString(lock)){
                lock = (lock == 'true');
            }
            if (!lock){
                menuItems.push(footer);
            }
            menu = Ext.create('Ext.Menu', {
                cls : 'vv-login-connections-menu',
                viewModel : vm,
                listeners : {
                    hide : 'onHideConnectionMenu',
                    scope : me
                },
                items: menuItems
            });
            Ext.Viewport.setMenu(menu,{
                side: 'left',
                cover : false
            });

            Ext.Viewport.showMenu('left');
        }
    },


    onClickConnection : function(){
        var me = this;
        me.connectionHandler();
    },

    onClickForgotPassword : function () {
        var me = this,
            vm = me.getViewModel();

        vm.set({
            forgotPasswordPrompt : true,
            forgotPasswordText   : Valence.lang.lit.tempPasswordPrompt,
            loginValidation : true
        });
    },

    onClickSelectLanguage : function () {
        var me = this,
            view,viewEl;

        if (Ext.isClassic) {
            view = me.getView();

            view.el.down('.x-box-inner').addCls('vv-login-show-select-lng');

            Ext.widget('window', {
                title     : Valence.lang.lit.selectLanguage,
                layout    : 'fit',
                autoShow  : true,
                width     : 300,
                modal     : true,
                closable  : true,
                items     : [{
                    xtype       : 'grid',
                    store       : 'Languages',
                    hideHeaders : true,
                    columns     : [{
                        flex      : 1,
                        text      : Valence.lang.lit.language,
                        dataIndex : 'VVLNGNAME'
                    }],
                    listeners   : {
                        scope     : me,
                        itemclick : 'onSelectLanguage'
                    }
                }],
                listeners : {
                    scope   : me,
                    destroy : 'onDestroyLanguageSelection'
                }
            });
        } else {
            Valence.common.util.PickerList.showPickerList({
                title        : 'Select a Language:',
                handler      : me.onSelectLanguage,
                listArray    : 'Languages',
                displayField : 'VVLNGNAME',
                scope        : me
            });
        }

    },

    onDestroyChangepassword : function (cmp) {
        var me   = this,
            view = me.getView();

        view.el.down('.x-box-inner').removeCls('vv-login-show-chg-password');
    },

    onDestroyLanguageSelection : function (cmp) {
        var me   = this,
            view = me.getView();

        view.el.down('.x-box-inner').removeCls('vv-login-show-select-lng');
    },

    onHideConnectionMenu : function(){
        var me = this,
            view = me.getView(),
            vm = me.getViewModel();
        if (/login/.test(view.getActiveItem().getXTypes())){
            vm.set('inConnectionEditMode',false);
        }
    },

    onLogin : function () {
        var me     = this,
            vm     = me.getViewModel(),
            view   = me.getView(),
            form   = view.lookupReference('form'),
            values = form.getValues(),
            user   = values.user,
            appId  = Valence.login.Processor.getAppId(),
            app    = Valence.login.config.Runtime.getApplication(),
            hostUrl = Valence.login.Processor.getHostUrl(),
            mobilePortal = Valence.login.Processor.getNamespace() == 'Portal' && Ext.isModern && (Ext.os.name == 'iOS' || Ext.os.name == 'Android'),
            url,
            parms  = {
                action  : 'login',
                lng     : vm.get('language'),
                display : vm.get('mode'),
                version : vm.get('version'),
                forceEnv : Valence.login.config.Runtime.getUrlParms().environment
            }, invalid,connStr,find,rec;

        if (Ext.isModern) {
            if (Ext.isEmpty(values.user)) {
                view.lookupReference('user').toggleCls('vv-field-invalid', true);
                vm.set('loginValidation', false);
                invalid = true;
            } else {
                view.lookupReference('user').toggleCls('vv-field-invalid', false);
            }
            if (Ext.isEmpty(values.password)) {
                view.lookupReference('password').toggleCls('vv-field-invalid', true);
                vm.set('loginValidation', false);
                invalid = true;
            } else {
                view.lookupReference('password').toggleCls('vv-field-invalid', false);
            }
            if (invalid){
                vm.set('loginValidationText',Valence.lang.lit.canNotBeBlank);
                return;
            }
        }

        // encode the form values...
        //
        values.user     = Valence.util.Helper.encodeUTF16(values.user);
        values.password = Valence.util.Helper.encodeUTF16(values.password);

        Ext.apply(parms, values);

        //if appId exists then pass it to validate authorization
        //
        if (!Ext.isEmpty(appId)){
            Ext.apply(parms,{
                validateAppId : appId
            });
        }

        if (mobilePortal){
            Valence.login.Processor.setHostUrl(hostUrl);
            Ext.Viewport.mask({
                indicator : true,
                xtype   : 'loadmask',
                message : Valence.lang.lit.loading
            });
        } else {
            if (Ext.isModern) {
                Ext.Viewport.mask({
                    indicator : true,
                    xtype   : 'loadmask',
                    message : Valence.lang.lit.loading
                });
            } else {
                Valence.common.util.Helper.loadMask(Valence.lang.lit.validatingLogin);
            }
        }

        if (!app || app.fireEvent('beforelogin', parms) !== false) {
            url = hostUrl + '/valence/vvlogin.pgm';

            Ext.Ajax.request({
                url     : url,
                params  : parms,
                scope   : me,
                success : function (r) {
                    Valence.common.util.Helper.destroyLoadMask();
                    var d = Ext.decode(r.responseText);
                    if (mobilePortal) {
                        Ext.Viewport.unmask();
                    } else {
                        Valence.common.util.Helper.destroyLoadMask();
                    }
                    if (d.success) {
                        // login was successful...
                        //   - set the sid in localStorage
                        //   - set the env in sessionStorage (if desktop)
                        //   - create and load the "Environments" store
                        //   - set the user runtime value
                        //   - decode applicable fields
                        //   - fire off an application and view level event
                        //
                        localStorage.setItem('sid', d.sid);

                        // for backward compatibility (pre Valence 5) set the sessionStorage as well...
                        //
                        sessionStorage.setItem('sid', d.sid);

                        if (Valence.login.config.Runtime.getIsDesktop()) {
                            sessionStorage.setItem('env', d.env);
                        }
                        Ext.create('Valence.login.store.Login_Environments', {
                            data : d.envs
                        });
                        Valence.login.config.Runtime.setUser(user);

                        // set the IBM i user....
                        //
                        if (d.ibmiUser){
                            Valence.login.config.Runtime.setIbmiUser(d.ibmiUser);
                        }

                        if (app) {
                            app.fireEvent('login', user, d.sid);
                            app.fireEvent('environmentset', user, d.env);
                        }

                        d.firstname = Valence.util.Helper.decodeUTF16(d.firstname);
                        d.lastname = Valence.util.Helper.decodeUTF16(d.lastname);

                        if (Ext.isModern && Valence.login.Processor.isPortal()){
                            connStr = me.getConnectionStore();
                            find = function(rec){
                                return rec.get('selected') && rec.get('invalid');
                            };
                            rec = connStr.getAt(connStr.findBy(find));

                            if (!Ext.isEmpty(rec)) {
                                rec.set('invalid',false);
                                rec.commit();
                                connStr.sync();
                            }
                        }

                        me.fireViewEvent('loggedin', me.getView(), Ext.apply(d, {
                            loginId : user
                        }));
                    } else {
                        if (app) {
                            app.fireEvent('loginfailure', parms, d);
                        }
                        // login has failed...
                        //   this can be any number of reasons:
                        //
                        //  1.) change password required (sts === "changepassword")
                        //  2.) too many sessions for non Enterprise installation with option to kill session (sts === "killsession")
                        //  3.) too many sessions for non Enterprise (sts === "exceededlimit")
                        //  4.) invalid credentials
                        //
                        var sts = d.sts || null;
                        if (!sts) {
                            if (Ext.isEmpty(d.fld) && !Ext.isEmpty(d.lit)){
                                var image    = view.down('image'),
                                    imageSrc = (!Ext.isEmpty(image) && !Ext.isEmpty(image.src)) ? image.src : null;

                                Valence.login.util.Helper.showImageDialog(Valence.common.util.Helper.getLit(d), imageSrc);

                                view.hide();
                            } else {
                                if (Ext.isClassic) {
                                    view.lookupReference(d.fld).markInvalid(Valence.common.util.Helper.getLit(d));
                                } else {
                                    view.lookupReference(d.fld).toggleCls('vv-field-invalid', true);
                                    vm.set({
                                        loginValidation : false,
                                        loginValidationText : Valence.lang.lit.invalidLogin.toLowerCase()
                                    });
                                }
                            }
                        } else if (sts === 'changepassword') {
                            if (app && app.fireEvent('beforeshowchangepassword') !== false){
                                //clear sid from localStorage & sessionStorage
                                //
                                if (!Ext.isEmpty(localStorage)){
                                    localStorage.removeItem('sid');
                                }
                                if (!Ext.isEmpty(sessionStorage)){
                                    sessionStorage.removeItem('sid');
                                }

                                if (Valence.login.config.Runtime.getIsDesktop()) {
                                    view.el.down('.x-box-inner').addCls('vv-login-show-chg-password');
                                    Ext.widget('changepassword',{
                                        listeners : {
                                            scope   : me,
                                            destroy : 'onDestroyChangepassword',
                                            success : 'onSuccessChangepassword'
                                        },
                                        viewModel : {
                                            data : {
                                                user : view.lookupReference('user').getValue()
                                            }
                                        }
                                    });
                                }
                                // login for mobile portal is handle by the app after login
                            }
                        } else if (sts === 'killsession' || sts === 'exceededlimit') {
                            if (Valence.login.config.Runtime.getIsDesktop()){
                                Valence.common.util.Dialog.show({
                                    msg     : Valence.common.util.Helper.getLit(d),
                                    buttons : [{
                                        text : Valence.lang.lit.ok
                                    }]
                                });
                            } else {
                                // todo - mobile logic for "killsession" or "exceededlimit"
                            }
                        } else {
                            Valence.common.util.Snackbar.show(Valence.lang.lit.serverError);
                        }
                    }
                    if (Ext.isModern){
                        Ext.Viewport.unmask();
                    }
                },
                failure : function(){
                    Ext.log({
                        msg : 'login failure'
                    });
                    if (Ext.isModern){
                        Ext.Viewport.unmask();
                    } else {
                        Valence.common.util.Helper.destroyLoadMask();
                    }
                    Valence.common.util.Dialog.show({
                        title : Valence.lang.lit.error,
                        msg : Valence.lang.lit.noResponseFromServer,
                        buttonAlign : 'right',
                        buttons : [{
                            text : Valence.lang.lit.ok
                        }]
                    });
                }

            });
        }
    },

    onKeyupLogin : function(fld,e){
        var me = this,
            view = me.getView(),
            name, pwFld;
        if (e.keyCode == 13) {
            name = fld.getName();
            if (name == 'user'){
                pwFld = view.lookupReference('password');
                pwFld.focus();
            } else if (name == 'password') {
                me.onLogin();
            }
        }
    },

    onNetworkChangeOnline : function(){
        if (Ext.os.name == 'iOS' || Ext.os.name == 'Android') {
            var me = this,
                disable = false,
                connStr = Ext.getStore('Connections');
            if (Ext.isEmpty(connStr) || connStr.getCount() == 0){
                disable = true;
            }
            me.getViewModel().set('loginDisabled',disable);
        }
    },

    onNetworkChangeOffline : function(){
        if (Ext.os.name == 'iOS' || Ext.os.name == 'Android') {
            var me = this;
            me.getViewModel().set('loginDisabled',true);
        }
    },

    onRenderLogin : function (cmp) {
        cmp.getLayout().onContentChange();
    },

    onSelectLanguage : function (view, rec) {
        var me  = this,
            lng = rec.get('VVLNG');

        if (Valence.login.config.Runtime.getIsDesktop()) {
            var wl  = window.location,
                newPath = wl.pathname + '?lang=' + lng;
            if (Ext.isModern) {
                newPath += '&modern';
            }
            wl.href = newPath
        } else {
            // todo - onSelectLanguage mobile
        }
    },

    onSendPassword : function () {
        var me     = this,
            vm     = me.getViewModel(),
            view   = me.getView(),
            form   = view.lookupReference('form'),
            values = form.getValues(),
            user   = values.user,
            app    = Valence.login.config.Runtime.getApplication(),
            parms  = {
                action : 'sendPassword',
                user   : Valence.util.Helper.encodeUTF16(user),
                text0  : Valence.util.Helper.encodeUTF16(Valence.lang.lit.tempPassword),
                text1  : Valence.util.Helper.encodeUTF16(Valence.lang.lit.tempPasswordEmail1),
                text2  : Valence.util.Helper.encodeUTF16(Valence.lang.lit.tempPasswordEmail2),
                text3  : Valence.util.Helper.encodeUTF16(Valence.lang.lit.tempPasswordEmail3)
            };

        if (Ext.isEmpty(user)) {
            if (Ext.isModern) {
                view.lookupReference('user').toggleCls('vv-field-invalid', true);
                vm.set('loginValidation', false);
            }
            return;
        }
        if (app && app.fireEvent('beforesendpassword', parms) !== false) {
            // todo -- set mask for mobile
            form.el.mask();
            Ext.Ajax.request({
                url     : Valence.login.Processor.getHostUrl() + '/valence/vvlogin.pgm',
                params  : parms,
                scope   : me,
                success : me.onSendPasswordSuccess
            });
        }
    },

    onSendPasswordSuccess : function (r) {
        var me   = this,
            d    = Ext.decode(r.responseText),
            form = me.getView().lookupReference('form');

        form.el.unmask();
        if (d.success) {
            me.onClickCancelForgotPassword();
            Valence.common.util.Snackbar.show(Valence.lang.lit.tempPasswordSent)
        } else {
            var fld = me.getView().lookupReference(d.fld);
            if (fld){
                fld.markInvalid(Valence.common.util.Helper.getLit(d));
                fld.focus();
            }
        }
    },

    onSpecialKeyPassword : function (fld, e) {
        var me   = this,
            view = me.getView(),
            form = view.lookupReference('form');
        if (e.getKey() === e.ENTER && form.isValid()) {
            if (view.getXType() === 'login') {
                me.onLogin();
            } else {
                me.onUnlock();
            }
        }
    },

    onSuccessChangepassword : function(view,pwd){
        var me       = this,
            password = me.getView().lookupReference('password');

        password.setValue(pwd);
        me.onLogin();
    },

    onUnlock : function () {
        var me   = this,
            vm   = me.getViewModel(),
            view = me.getView(),
            pw   = view.lookupReference('password').getValue();

        Ext.Ajax.request({
            url     : vm.get('hostUrl') + '/valence/vvlogin.pgm',
            params  : {
                action   : 'unlock',
                password : Valence.util.Helper.encodeUTF16(pw)
            },
            scope   : me,
            success : me.onUnlockSuccess
        });
    },

    onUnlockSuccess : function (r) {
        var me   = this,
            view = me.getView(),
            app  = Valence.login.config.Runtime.getApplication(),
            d    = Ext.decode(r.responseText);

        if (d.success) {
            view.el.fadeOut({
                callback : function () {
                    view.destroy();
                }
            });
            Valence.login.config.Runtime.setIsLocked(false);

            if (app) {
                app.fireEvent('unlock');
                app.fireEvent('resumelock');
            }
        } else {
            view.lookupReference('password').markInvalid(Valence.common.util.Helper.getLit(d));
        }

    }

});