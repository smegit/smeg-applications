Ext.define('Welcome.Application', {
    extend : 'Ext.app.Application',
    name   : 'Welcome',

    onAppUpdate : function () {
        window.location.reload();
    }
});
