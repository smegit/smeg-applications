Ext.define('Wrapper.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data : {
        appBarBackIcon             : false,
        appBarMoreIcon             : false,
        appBarNavIcon              : false,
        appBarSearchIcon           : false,
        appBarSearch               : false,
        appBarSearchEmptyText      : '',
        appBarTitleMenuHide        : true,
        appBarTitleMenuShowOnClick : true,
        appBarTitle                : '',
        appBarTitleHide            : false,
        appBarUI                   : 'primary-dark',
    }
});
