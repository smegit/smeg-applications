Ext.define('Ext.overrides.classic.window.Window', {
    override: 'Ext.window.Window',
    // closeOnBodyClick : false,
    // initComponent    : function () {
    //     var me = this;
    //     me.callParent(arguments);
    //     if (me.closeOnBodyClick || me.closable) {
    //         me.on({
    //             scope : me,
    //             show  : function () {
    //                 setTimeout(function () {
    //                     Ext.getBody().on({
    //                         scope : me,
    //                         click : function (event) {
    //                             var me = this;
    //                             if (Ext.WindowManager.getActive() === me && !me.el.contains(event.target)) {
    //                                 me.close();
    //                             }
    //                         }
    //                     });
    //                 }, 200);
    //             }
    //         });
    //     }
    // }
});