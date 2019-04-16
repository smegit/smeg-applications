/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('PortalActions.view.main.MainModel', {
    extend : 'Ext.app.ViewModel',

    alias : 'viewmodel.main',

    data : {
        activeItem          : 0,
        cardIndex           : 0,
        appBarUI            : '',
        appBarTitleText     : '',
        appBarBackIcon      : false,
        appBarMblSearch     : false,
        appBarMblSearchCls  : 'vv-appbar-filter-modern',
        appBarMblSearchIcon : true
    }
});
