/**
 * Utility class for displaying a "snackbar".
 * Snackbars provide lightweight feedback about an operation by showing a brief message at the bottom of the screen. Snackbars can contain an action.
 */
Ext.define('Valence.common.util.Snackbar',{
    singleton : true,
    config    : {
        cmp    : null,
        queue  : [],
        active : false,
        anchor : null
    },

    buildComponent : function(){
        var me = this;
        return Ext.create('Ext.Component',{
            cls      : Ext.Classic ? 'w-snackbar-outer' : 'w-snackbar-outer w-snackbar-full',
            renderTo : Ext.getBody(),
            tpl      : [
                '<div class="w-snackbar-text">',
                    '<span>{text}</span>',
                    '<tpl if="buttonText">',
                        '<span class="w-snackbar-btn">{[fm.uppercase(values.buttonText)]}</span>',
                    '</tpl>',
                '</div>'
            ],
            listeners : {
                scope  : me,
                render : me.onRenderCmp
            }
        });
    },

    onClickButton : function(){
        var me  = this,
            obj = me.getActive();

        if (obj && typeof obj.handler === "function"){
            Ext.callback(obj.handler,obj.scope || me);
            me.processHide();
        }
    },

    onDestroyCmp : function(cmp){
        var me = this;
        cmp.el.un('click',me.onClickButton,me);
    },

    onRenderCmp : function(cmp){
        var me        = this;

        cmp.el.on({
            scope    : me,
            delegate : 'span.w-snackbar-btn',
            click    : me.onClickButton,
            destroy  : me.onDestroyCmp
        });
    },


    processHide : function(){
        var me     = this,
            cmp    = me.getCmp(),
            active = me.getActive(),
            push   = active.push || false,
            queue  = me.getQueue();

        me.setActive(false);
        cmp.el.removeCls('is-active');
        if (push || !Ext.isClassic){
            Ext.getBody().down('div').removeCls('is-active');
        }

        if (queue && queue.length > 0){
            setTimeout(function(){
                me.show(queue[0],true);
            },300);
        }
    },

    /**
     * Show the snackbar. If the snackbar is already being shown, it will queue this call and process when it is its turn.
     *
     * ## Example usage
     *      Valence.common.util.Snackbar.show('User has been deleted');
     *
     * ## Example usage - with button
     *     Valence.common.util.Snackbar.show({
     *         text       : 'User has been deleted',
     *         buttonText : 'Undo',
     *         scope      : me,
     *         handler    : me.onUndoDeleteUser
     *     });
     *
     * @param {Object} config The following config values are supported:
     * @param {String} config.text
     * @param {Number} [config.duration=4000] The amount of time (in milliseconds) before the snackbar is automatically hidden.
     * @param {String} [config.buttonText]
     * @param {Object} [config.scope=this] Specify the scope for the handler.
     * @param {Fuction} [config.handler] Function to call if the button is clicked.
     * @param {Boolean} [config.push=false] Specify true to have the snackbar push up the body (as opposed to float above it)
     */
    show      : function(o,queue){
        var me         = this,
            obj        = Ext.isObject(o) ? o : {
                text     : o,
                duration : 4000
            },
            push       = obj.push || false,
            cmp;

        if (!me.getActive()){
            if (Ext.isClassic) {
                me.setActive(obj);
            }
            // get a reference to the component, create it if it does not exist:
            //   update its contents
            //
            cmp = me.getCmp();
            if (!cmp){
                cmp = me.buildComponent();
                me.setCmp(cmp);
            }

            if (Ext.isClassic){
                cmp.update(obj);
            } else {
                cmp.setData(obj);
                me.setActive(obj);
            }

            // if pushing the body up, add the appropriate classes
            //
            if (push){
                Ext.getBody().down('div').addCls('w-snackbar-push is-active');
                cmp.el.addCls('w-snackbar-full');
                if (Ext.isClassic) {
                    if (me.getAnchor() !== 'tl-bl'){
                        cmp.el.anchorTo(Ext.getBody(),'tl-bl');
                        me.setAnchor('tl-bl');
                    }
                } else {
                    cmp.el.alignTo(Ext.getBody(),'tl-bl');
                }
            } else {
                cmp.el.removeCls('w-snackbar-full');
                if (Ext.isClassic) {
                    if (me.getAnchor() !== 't-b'){
                        cmp.el.anchorTo(Ext.getBody(),'t-b');
                        me.setAnchor('t-b');
                    }
                } else {
                    cmp.el.alignTo(Ext.getBody(),'t-b');
                }
            }

            // show the component and set a timeout to auto hide it...
            //
            cmp.show().el.addCls('is-active');
            setTimeout(function(){
                me.processHide();
            }, obj.duration || 4000);

            // if this was a queued up show then remove it from the queue...
            //
            if (queue){
                Ext.Array.removeAt(me.getQueue(),0);
            }
        } else {
            me.getQueue() ? me.getQueue().push(obj) : me.setQueue([obj]);
        }
    }

});