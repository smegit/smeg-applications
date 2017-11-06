Ext.define('Valence.login.config.Runtime', {
    singleton : true,
    config    : {
        activeWindows       : [],
        allowChangePassword : false,
        appContainer        : 'canvas',
        autoLogin           : false,
        environment         : null,
        language            : null,
        isConnected         : null,
        isMobile            : false,
        isDesktop           : false,
        isLocked            : false,
        isLoggingOut        : false,
        logoutTaskReset     : false,
        loginData           : null,
        reloadApps          : false,
        namespace           : null,
        theme               : null,
        urlParms            : Ext.getUrlParam(),
        user                : null
    },

    constructor : function(){
        this.initConfig(this.config);
    },

    applyAppContainer : function(v){
        var me = this;
        if (me.getUrlParms().tabbed){
            return 'canvastabs';
        } else {
            return (v == '1') ? 'canvastabs' : 'canvas';
        }
    },

    applyIsConnected : function (v) {
        var me = this,
            masked;
        if (v === false) {
            if (Ext.isClassic) {
                Ext.MessageBox.wait(Valence.lang.lit.reconnectBody, '<p style="font-size:11pt";>' + Valence.lang.lit.reconnectHeader + '</p>');
            } else {
                Valence.login.config.Runtime.getApplication().fireEvent('disconnected');
                Ext.Viewport.mask({
                    indicator : true,
                    xtype   : 'loadmask',
                    message : Valence.lang.lit.reconnectBody,
                    zIndex : 1000
                });
            }

        } else if (v === true) {
            if (!me.getIsConnected()) {
                if (Ext.isClassic && Ext.Msg.isVisible()) {
                    Ext.Msg.hide();
                } else if (Ext.isModern) {
                    masked = Ext.Viewport.getMasked();
                    if (!Ext.isEmpty(masked) || masked){
                        Valence.login.config.Runtime.getApplication().fireEvent('connected');
                        Ext.Viewport.unmask();
                    }
                }
            }
        }
        return v;
    },

    applyLoginData : function(o){
        var me = this,
            eObj;
        if (!o){
            return;
        }
        o.envName = '???';
        if (!Ext.isEmpty(o.loginId)){
            o.loginId   = Ext.util.Format.uppercase(o.loginId);
            o.initial   = o.loginId.substr(0,1);
        } else {
            o.loginId    = '???';
            o.initial =  o.loginId.substr(0,1) || '?';
        }
        if (!Ext.isEmpty(o.firstname && !Ext.isEmpty(o.lastname))){
            o.initial = o.firstname.substr(0,1) + o.lastname.substr(0,1);
        }
        if (!Ext.isEmpty(o.envs)){
            o.alwChgEnv = (o.envs.length > 1);

            if (!Ext.isEmpty(o.env)){
                // retrieve the proper object...
                //
                for (var ii=0;ii< o.envs.length;ii++){
                    eObj = o.envs[ii];
                    if (o.env == eObj.envId){
                        o.envName = Valence.util.Helper.decodeUTF16(eObj.envName);
                    }
                }
            }
        } else {
            o.alwChgEnv = false;
        }

        if (!Ext.isEmpty(o.theme)){
            me.setTheme(o.theme);
        }

        if (!Ext.isEmpty(o.layout)){
            me.setAppContainer(o.layout);
        }

        return o;
    },

    getApplication : function(){
        var me = this,
            ns = me.getNamespace();

        if (ns && !Ext.isEmpty(window[ns]) && typeof window[ns].getApplication === "function") {
            return window[ns].getApplication();
        }
        return null;

    }

});