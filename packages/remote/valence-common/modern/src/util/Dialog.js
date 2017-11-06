/**
 *  Utility class for displaying a dialog.
 *  Dialogs contain text focused on a specific task. They inform users about critical information and require users to make a decision.
 */
Ext.define('Valence.common.util.Dialog', {
    singleton     : true,
    requires : [
        'Ext.Sheet'
    ],
    config : {
        fnc : null,
        cmp : null,
        scope : null,
        waitToClose : null
    },
    /**
     * Show the dialog.
     *
     * ## Example usage
     *      Valence.common.util.Dialog.show({
     *          title   : 'Are You Sure?',
     *          msg     : 'Please confirm that you are a jock.',
     *          buttons : [{
     *              text : 'Yes'
     *          },{
     *              text : 'No'
     *          }],
     *          handler     : function(btn){
     *              if (btn === 'yes'){
     *                  // do something...
     *                  //
     *              }
     *          }
     *      });
     *
     * ## Example usage - with button parmText and additional configs
     *     Valence.common.util.Dialog.show({
     *         msg      : 'Confirm that you are a jock',
     *         buttons : [{
     *             text     : 'Yes, I Am',
     *             parmText : 'yes'
     *         },{
     *             text     : 'No, I Am Not',
     *             parmText : 'no'
     *         }],
     *         handler     : function(btn){
     *             if (btn === 'yes'){
     *             }
     *         }
     *     });
     *
     * @param {Object} config The following config values are supported:
     * @param {String} [config.title]
     * @param {String} [config.msg] The body of the dialog.
     * @param {Array} config.buttons Specify the buttons to display. Upon clicking a button, the handler will be
     *                               called passing the lowercased button text as the parameter. If the button
     *                               has a property labeled "parmText" then that will be passed instead.
     * @param {Fuction} [config.handler] Function to call if the button is clicked.
     * @param {Object} [config.scope=this] Specify the scope for the function handler.
     * @param {Object} [config.cfg] Additional configs to apply to the dialog window.
     */
    show    : function (o) {
        var me          = this,
            msg         = o.msg || null,
            buttons     = o.buttons || null,
            title       = o.title || null,
            addlCfg     = o.cfg || null,
            fnc         = o.handler || null,
            minWidth    = o.minWidth || null,
            buttonAlign = o.buttonAlign || 'center',
            cfg         = {
                ui       : 'dialog',
                minWidth : minWidth,
                maxWidth : 500,
                title    : title,
                autoDestroy : true
            }, cfgItems, toolbar,cmp;

        if (!buttons) {
            Ext.log('An array of buttons must be passed');
        } else {
            if (addlCfg) {
                Ext.apply(cfg, addlCfg);
            }

            for (var ii = 0; ii < buttons.length; ii++) {
                buttons[ii].scope   = me;
                buttons[ii].handler = me.onClickButton
            }
            if (buttons[0] != '->' && buttonAlign == 'right'){
                buttons.splice(0, 0, '->');
            }
        }

        if (!Ext.isEmpty(o.waitToClose)){
            me.setWaitToClose(o.waitToClose);
        }

        cfgItems = [{
            xtype : 'component',
            html  : msg
        }];

        if (!Ext.isEmpty(cfg.items)){
            cfgItems = Ext.Array.merge(cfgItems,cfg.items);
        }

        cfgItems.push({
            xtype  : 'toolbar',
            itemId : 'btmtlbr',
            docked : 'bottom',
            items  : buttons
        });

        cfg['items'] = cfgItems;
        me.setFnc(fnc);

        cmp = Ext.Viewport.add(Ext.widget('sheet',cfg));
        me.setCmp(cmp);

        return cmp;
    },
    onClickButton : function (btn) {
        var me    = this,
            fnc   = me.getFnc(),
            scope = me.getScope(),
            waitToClose = me.getWaitToClose(),
            cmp = me.getCmp(),
            resp;

        if (!waitToClose) {
            cmp.setHidden(true);
        }

        if (fnc) {
            resp = Ext.callback(fnc, scope, [btn.parmText || Ext.util.Format.lowercase(btn.getText()),btn]);
            if (waitToClose) {
                if (Ext.isEmpty(resp) || resp){
                    cmp.setHidden(true);
                    me.setFnc(null);
                    me.setScope(this);
                }
                return;
            }
            me.setFnc(null);
            me.setScope(this);
            cmp.destroy();

        }
    }
});

