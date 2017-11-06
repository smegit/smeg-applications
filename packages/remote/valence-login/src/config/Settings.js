Ext.define('Valence.login.config.Settings',{
    singleton : true,
    config    : {
        aboutPage                    : '/desktop/about/index.html',
        browserTitle                 : 'Valence',
        closeAppsOnEnvironmentChange : true,
        database                     : null,
        dateFormat                   : 'Y-m-d',
        defaultLanguage              : 'en',
        displayLaunchpad             : true,
        favicon                      : '/resources/images/favicon.ico',
        iconOnTab                    : true,
        lockTimeout                  : 120,
        lockConnections : false,
        logoutOnUnload               : false,
        maxAutoStartApps             : null,
        maxAppsOpen                  : 15,
        maxFavorites                 : 24,
        menuTextMode                 : 'USER',
        multiLingual                 : null,
        pathVariables                : null,
        pollInterval                 : 30,
        promptBeforeCloseMsg         : null,
        promptBeforeCloseTitle       : null,
        sessionTimeoutWarning        : null,      //todo - to be implemented
        sessionTimeout               : null,
        setUserCookie                : null,
        showChangePassword           : false,
        showForgotPassword           : false,
        standaloneV03                : false,
        tabShortcutKeys              : true,
        tourDisabled                 : false,
        version                      : null,
        welcomePage                  : null,
        zoom5250                     : 1.5
    },

    applyLockTimeout : function(v){
        return v  * 60000;
    },

    applyPollInterval : function(v){
        return v  * 1000;
    },

    applySessionTimeout : function(v){
        var me      = this,
            num     = v,
            warning = (num > 2) ? (num - (num -2)) : null;
        // set the warning timeout 2 minutes before this...
        //
        if (warning){
            me.setSessionTimeoutWarning(warning * 60000);
        }
        return v * 60000;
    },

    constructor : function(){
        this.initConfig(this.config);
    }

});