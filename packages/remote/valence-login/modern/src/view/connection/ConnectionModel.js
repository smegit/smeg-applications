Ext.define('Valence.login.view.connection.ConnectionModel', {
    extend : 'Ext.app.ViewModel',
    alias  : 'viewmodel.connection',
    data   : {
        appBarBackIcon       : true,
        appBarTitleText      : 'New Connection',
        appBarTitleIconAlign : 'left',
        appBarTitleIconCls   : 'x-fa fa-caret-left',
        appBarTitleHide      : false,
        appBarTitleMenuHide  : true,
        appBarUI             : 'primary-dark',
        appBarSearch         : false,
        appBarSearchIcon     : false,
        conn : {},
        connectionValidation : true
    },
    formulas : {
        connectionValidationText : function(get){
            return (get('connectionValidation') ? '' : '<div><span class="vvicon vvicon-notification2"></span>Fields cannot be blank.</div>');
        }
    }
});
