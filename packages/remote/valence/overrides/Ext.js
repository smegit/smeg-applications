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
    getUrlParam : function (param) {
        var params = Ext.urlDecode(location.search.substring(1));
        return param ? params[param] : params;
    },
    getFramework : function () {
        var versions  = Ext.versions || null,
            returnObj = {
                desktop   : true,
                framework : 'Ext'
            };

        if (versions){
            var v;
            if (!Ext.isEmpty(versions.touch) || !Ext.isEmpty(versions.modern)){
                if (!Ext.isEmpty(versions.modern)){
                    return Ext.apply(returnObj,{
                        desktop   : false,
                        framework : 'Modern',
                        version   : versions.modern.version.charAt(0)
                    });
                } else {
                    return Ext.apply(returnObj,{
                        desktop   : false,
                        framework : 'Touch',
                        version   : versions.touch.version.charAt(0)
                    });
                }
            } else {
                if (!Ext.isEmpty(versions.extjs.version)){
                    v = versions.extjs.version.charAt(0);
                    if (!Ext.isEmpty(v)){
                        return Ext.apply(returnObj,{
                            version : v
                        });
                    }
                }
                return Ext.apply(returnObj,{
                    version : 4
                });
            }
        } else {
            return {
                desktop : true,
                framework : 'Ext',
                version   : 3
            };
        }
    }
});

Ext.define('Valence.Ajax',{
//<if packageBuild=false>
    requires : ['Ext.Ajax','Valence.mobile.Access'],
//</if>
    singleton   : true,
    constructor : function(){
        var me  = this,
            fnc = function(){
                if (!Ext.isEmpty(Ext.Ajax)){
                    Ext.apply(Ext.Ajax,{
                        vvPgmRegEx : new RegExp('((vvcall)|(vvvport)|(vvupload)|(vvlogin))',"i")
                    });
                    Ext.Ajax.on({
                        beforerequest    : me.onBeforeAjaxRequest,
                        requestexception : me.onRequestAjaxException
                    });
                } else {
                    setTimeout(fnc,20);
                }
            };
        fnc();
    },

    onBeforeAjaxRequest : function(c,options){
        var me               = this,
            framework        = Ext.getFramework(),
            frameworkVersion = framework.version,
            isTouch          = (framework.framework === 'Touch') ? true : false,
            sid              = Valence.util.Helper.getSid(),
            env              = Valence.util.Helper.getEnvironmentId(),
            appId            = Ext.getUrlParam('app');

        if (Valence.mobile.Access.isNativePortal()){
            env = null;
        }

        if (frameworkVersion >= 5 || isTouch){
            if (isTouch){
                if (Ext.isEmpty(options.disableCaching)) {
                    options.disableCaching = false;   //todo this seems to be a bug in the current touch version should only apply if GET however its not checking the method anymore in Ext.data.Connection.setOptions
                }
            }

            if (!options.params) {
                options.params = {};
            }
            if (!options.isUpload  && !options.omitPortalCredentials) {
                Ext.apply(options.params,{
                    sid : sid
                });
                if (!Ext.isEmpty(appId)){
                    Ext.apply(options.params,{
                        app : appId
                    });
                }
                if (!Ext.isEmpty(env)){
                    Ext.apply(options.params,{
                        env : env
                    });
                }
            }
        } else {
            if (!me.extraParams) {
                me.extraParams = {};
            }
            if (!options.isUpload  && !options.omitPortalCredentials) {
                Ext.apply(me.extraParams,{
                    sid : sid
                });
                if (!Ext.isEmpty(appId)){
                    Ext.apply(me.extraParams,{
                        app : appId
                    });
                }
                if (!Ext.isEmpty(env)){
                    Ext.apply(me.extraParams,{
                        env : env
                    });
                }
            } else {
                me.extraParams = null;
            }
        }

        // todo = remove this for 3.3 or 4.0 as each call should be preceded by "/valence"             //!?
        //     if this code is left in place, Ext.log this condition...
        //
        if (me.vvPgmRegEx.test(options.url)){
            if (options.url.indexOf('/valence/') === -1){
                if (options.url.substring(0, 1) !== '/'){
                    options.url = '/valence/' + options.url;
                }
            }
        }
    },

    onRequestAjaxException : function(conn,r,opts){
        if (!opts.vvSkip569 && r.status === 569){
            var d           = Ext.decode(r.responseText),
                title       = (d) ? Valence.lang.lit[d.hdr] : null,
                body        = (d) ? Valence.lang.lit[d.body] : null,
                action      = (d) ? d.action : null,
                isPortalApp = (!Ext.isEmpty(parent.Portal)),
                showMessage = function(title, msg, portalApp){
                    var msgObj = (isPortalApp) ? parent.Ext.Msg : Ext.Msg;

                    msgObj.show({
                        title    : title,
                        msg      : msg,
                        buttons  : msgObj.OK,
                        closable : false,
                        fn       : function(){
                            if (action === 'LOGOUT'){
                                if (portalApp){
                                    portalApp.fireEvent('logout');
                                }
                            } else {
                                if (portalApp){
                                    portalApp.fireEvent('resumepolling');
                                }
                            }
                        }
                    });
                },
                processVars = function(){
                    if (d.var1) {
                        body = body.replace('VAR1',Valence.util.Helper.decodeUTF16(d.var1));
                    }
                    if (d.var2) {
                        body = body.replace('VAR2',Valence.util.Helper.decodeUTF16(d.var2));
                    }
                    if (d.var3) {
                        body = body.replace('VAR3',Valence.util.Helper.decodeUTF16(d.var3));
                    }

                    if (d.vvid){
                        body += '<p style="margin-top:16px;">' + Valence.lang.lit.errorLogId + ' <span style="font-weight: 500;opacity: 0.7;">' + d.vvid + '</span></p>';
                    }
                };

            // if "d" is null then this may be a binary ajax request...
            //
            if (Ext.isEmpty(d)){
                var blob = new Blob([r.responseBytes], {type : r.getResponseHeader('Content-Type')}),
                    reader = new window.FileReader();

                reader.readAsText(blob);
                reader.onloadend = function () {
                    d      = Ext.decode(reader.result);
                    title  = Valence.lang.lit[d.hdr];
                    body   = Valence.lang.lit[d.body];
                    action = d.action;
                    processVars();
                }
            } else {
                processVars();
            }

            // suspend portal polling and show a message explaining the exception...
            //   ensure this message shows over any other messages by deferring...
            //
            setTimeout(function(){
                // suspend polling...
                //
                var portalApp = (isPortalApp) ? parent.Portal.getApplication() : (typeof Portal === 'object') ? Portal.getApplication() : null,
                    locked    = Valence.util.Helper.isLocked();

                if (Ext.isEmpty(portalApp)){
                    //check if running Valence.login
                    //
                    if (!Ext.isEmpty(Valence.login)){
                        portalApp = Valence.login.config.Runtime.getApplication();
                    }
                }

                if (portalApp){
                    portalApp.fireEvent('suspendpolling');
                    if (action === 'LOGOUT'){
                        portalApp.fireEvent('pending569logout');
                    }
                }

                if (locked){
                    //hide locked
                    //
                    var lockedCmp = parent.Ext.ComponentQuery.query('lock')[0];
                    if (!Ext.isEmpty(lockedCmp)){
                        lockedCmp.hide();
                    }

                    if (action === 'LOGOUT'){
                        showMessage(title, body, portalApp);
                    }
                } else {
                    showMessage(title, body, portalApp);
                }
            },1000);
        }
    }
});