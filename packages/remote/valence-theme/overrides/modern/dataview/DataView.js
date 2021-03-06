Ext.define('Ext.overrides.dataview.DataView', {
    override      : 'Ext.dataview.DataView',

    deferEmptyText : false,

    initialize : function(){
        var me = this;
        me.callParent(arguments);
        if (me.emptyTextPlugin) {
            me.setEmptyText({});
        }
    },

    updateEmptyText : function(newEmptyText, oldEmptyText) {
        var me = this,
            store;

        if (me.emptyTextPlugin || (!Ext.isEmpty(newEmptyText) && Ext.isObject(newEmptyText))){
            me.emptyTextPlugin = true;
            if (!Ext.isEmpty(newEmptyText)) {
                if (Ext.isObject(newEmptyText)) {
                    newEmptyText = Valence.common.util.Helper.buildEmptyText(newEmptyText);
                } else {
                    newEmptyText = Valence.common.util.Helper.buildEmptyText({
                        heading : newEmptyText
                    });
                }
            } else {
                newEmptyText = Valence.common.util.Helper.buildEmptyText({
                    heading : Valence.lang.lit.noResults
                });
            }
        }

        if (oldEmptyText && me.emptyTextCmp) {
            me.remove(me.emptyTextCmp, true);
            delete me.emptyTextCmp;
        }

        if (newEmptyText) {
            me.emptyTextCmp = me.add({
                xtype: 'component',
                cls: me.getBaseCls() + '-emptytext' + (me.emptyTextPlugin ? ' vv-emptytext-cnt' : ''),
                html: newEmptyText,
                hidden: true
            });
            store = me.getStore();
            if (store && me.hasLoadedStore && !store.getCount() || !me.deferEmptyText) {
                me.showEmptyText();
            }
        }
    }

    // config : {
    //     // could not set using valence lit
    //     // an empty object will trigger updateEmptyText
    //     //
    //     emptyText : {}
    // },
    //
    //
    // updateEmptyText : function(newEmptyText, oldEmptyText) {
    //     var me = this,
    //         store;
    //
    //     if (Ext.isDefined(me.emptyTextPlugin) && !me.emptyTextPlugin){
    //         return;
    //     }
    //
    //     if (Ext.isEmpty(newEmptyText) || (Ext.isObject(newEmptyText) && !Ext.isEmpty(newEmptyText.heading))) {
    //         newEmptyText = Valence.common.util.Helper.buildEmptyText({
    //             heading : Valence.lang.lit.noResults
    //         });
    //     } else {
    //         if (Ext.isObject(newEmptyText)) {
    //             newEmptyText = Valence.common.util.Helper.buildEmptyText(newEmptyText);
    //         } else {
    //             newEmptyText = Valence.common.util.Helper.buildEmptyText({
    //                 heading : newEmptyText
    //             });
    //         }
    //     }
    //
    //     if (oldEmptyText && me.emptyTextCmp) {
    //         me.remove(me.emptyTextCmp, true);
    //         delete me.emptyTextCmp;
    //     }
    //
    //     if (newEmptyText) {
    //         me.emptyTextCmp = me.add({
    //             xtype: 'component',
    //             cls: me.getBaseCls() + '-emptytext',
    //             html: newEmptyText,
    //             hidden: true
    //         });
    //         store = me.getStore();
    //         if (store && me.hasLoadedStore && !store.getCount()) {
    //             me.showEmptyText();
    //         }
    //     }
    // }
});


