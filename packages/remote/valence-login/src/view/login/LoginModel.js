Ext.define('Valence.login.view.login.LoginModel', {
    extend   : 'Ext.app.ViewModel',
    alias    : 'viewmodel.login',
    data     : {
        appBarTitleIconAlign : 'left',
        appBarTitleIconCls   : 'x-fa fa-bars',
        appBarTitleHide      : false,
        appBarTitleMenuHide  : true,
        appBarUI             : 'primary-dark',
        appBarSearch         : false,
        appBarSearchIcon     : false,
        connectionsCls       : '',
        forgotPasswordCls    : 'vv-login-forgot-pwd',
        forgotPasswordPrompt : false,
        hasConnection        : false,
        inConnectionEditMode : false,
        loginValidation      : true,
        loginValidationText : Valence.lang.lit.canNotBeBlank,
        loginDisabled        : false,
        mobilePortal         : false
    },
    formulas : {
        connectionRequired       : function (get) {
            // get('mode') is kind of redundant but included it so this value would get updated due to timing and mode possibly
            // being set after the viewmodel is created
            //
            return Valence.login.Processor.isPortal() && get('mode') !== 'desktop' && (Ext.os.name == 'iOS' || Ext.os.name == 'Android');
        },
        showNoConnection         : function (get) {
            return get('connectionRequired') && !get('hasConnection');
        },
        showExistingConnection   : function (get) {
            return get('connectionRequired') && get('hasConnection');
        },
        connectionsCls           : function (get) {
            return (get('hasConnection') ? 'vv-login-connections' : 'vv-login-connections vv-login-connections-none');
        },
        loginValidationHTML      : function (get) {
            return (get('loginValidation') ? '' : get('loginValidationText'));
        },
        editConnectionBtnIconCls : function (get) {
            return (get('inConnectionEditMode') ? 'vvicon vvicon-pencil6' : '');
        },
        connectionFtrEditIconCls : function (get) {
            return (get('inConnectionEditMode') ? 'fa fa-times' : 'vvicon vvicon-pencil6');
        }
    }
});