/**
 * Runtime - this class holds various properites of the application that may change durning the use of the application.
 */
Ext.define('Wrapper.config.Runtime', {
    singleton              : true,
    config                 : {
        apps               : null
    },
    constructor            : function (config) {
        var me = this;
        me.initConfig(config);
    }
});