Ext.define('Valence.common.widget.hsteps.HStepsController', {
    extend        : 'Ext.app.ViewController',
    alias         : 'controller.hsteps',
    onAfterrender : function () {
        var me    = this,
            view  = me.getView();

        if (!Ext.isEmpty(view.autoSelect)) {
            view.getSelectionModel().select(view.autoSelect);
        }
    },

    onBeforeselectStep : function (cmp, rec) {
        var me           = this,
            view         = me.getView(),
            event        = rec.get('event'),
            currentSel   = view.selection,
            currentEvent = (currentSel) ? currentSel.get('event') : null,
            str, cnt, index, obj;

        if (event) {
            if (currentEvent) {
                if (me.fireViewEvent('beforeleave' + currentEvent, currentSel, rec) === false) {
                    return false;
                }
            }
            if (me.fireViewEvent('before' + event) === false) {
                return false;
            }

            // determine if there is a previous and next step...
            //
            str   = view.getStore();
            cnt   = str.getCount();
            index = str.indexOf(rec);
            obj   = {
                index    : index,
                previous : (index > 0),
                next     : (index < (cnt - 1))
            };

            me.fireViewEvent(event, rec, obj);
        }
    }
});