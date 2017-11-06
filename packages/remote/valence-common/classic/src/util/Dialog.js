/**
 *  Utility class for displaying a dialog.
 *  Dialogs contain text focused on a specific task. They inform users about critical information and require users to make a decision.
 */
Ext.define('Valence.common.util.Dialog', {
    singleton     : true,
    config        : {
        cmp   : null,
        scope : this,
        fnc   : null
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
     * @param {Boolean} [config.noButtons] If no buttons are wanted pass `true`.
     * @param {Array} config.buttons Specify the buttons to display. Upon clicking a button, the handler will be
     *                               called passing the lowercased button text as the parameter. If the button
     *                               has a property labeled "parmText" then that will be passed instead. If the
     *                               button has a property of "focusOnShow" set to true it will be focused after
     *                               showing the dialog.
     * @param {Fuction} [config.handler] Function to call if the button is clicked.
     * @param {Number} [config.minWidth] The minimum width of the dialog.
     * @param {Object} [config.scope=this] Specify the scope for the function handler.
     * @param {Object} [config.cfg] Additional configs to apply to the dialog window.
     */
    show          : function (o) {
        var me          = this,
            title       = o.title || null,
            msg         = o.msg || null,
            buttons     = o.buttons || null,
            addlCfg     = o.cfg || null,
            scope       = o.scope || this,
            fnc         = o.handler || null,
            minWidth    = o.minWidth || null,
            minHeight   = o.minHeight || null,
            noButtons   = o.noButtons || false,
            focusButton = false,
            cfg         = {
                ui          : 'dialog',
                cls         : 'vv-common-dialog',
                scrollable  : 'y',
                autoWidth   : true,
                minHeight   : minHeight,
                maxHeight   : 450,
                minWidth    : minWidth,
                maxWidth    : 600,
                resizable   : false,
                closeAction : 'destroy',
                closable    : false,
                title       : title,
                header      : (title !== null),
                buttonAlign : 'right',
                modal       : true,
                html        : msg,
                autoShow    : true
            };

        if (!buttons && !noButtons) {
            Ext.log('An array of buttons must be passed');
        } else {
            if (addlCfg) {
                Ext.apply(cfg, addlCfg);
            }

            if (!noButtons) {
                for (var ii = 0; ii < buttons.length; ii++) {
                    buttons[ii].scope   = me;
                    buttons[ii].handler = me.onClickButton;
                    if (buttons[ii].focusOnShow) {
                        focusButton = true;
                    }
                }
                cfg.buttons = buttons;
            } else {
                cfg.buttons = null;
            }

            //if focus on a button is requested listen to after render
            //
            if (focusButton) {
                Ext.apply(cfg, {
                    listeners : {
                        scope       : me,
                        afterrender : me.onAfterRender
                    }
                });
            }

            me.setCmp(Ext.widget('window', cfg));
            me.setScope(scope);
            me.setFnc(fnc);
        }
    },
    onAfterRender : function (cmp) {
        var me          = this,
            focusButton = cmp.down('button[focusOnShow=true]');

        if (!Ext.isEmpty(focusButton)) {
            setTimeout(function () {
                focusButton.focus();
            }, 150)
        }
    },
    onClickButton : function (btn) {
        var me    = this,
            fnc   = me.getFnc(),
            scope = me.getScope();
        me.getCmp().destroy();

        if (fnc) {
            Ext.callback(fnc, scope, [btn.parmText || Ext.util.Format.lowercase(btn.getText())]);
            me.setFnc(null);
            me.setScope(this);
        }
    }
});
