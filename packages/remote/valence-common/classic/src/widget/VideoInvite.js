Ext.define('Valence.common.widget.VideoInvite',{
    extend          : 'Ext.toolbar.Toolbar',
    ui              : 'secondary-dark',
    xtype           : 'widget_videoinvite',
    storageItem     : null,
    url             : null,
    text            : null,
    autoHideSeconds : 30,
    cls             : 'w-video-invite',
    layout          : {
        type : 'hbox',
        pack : 'middle'
    },
    initComponent : function(){
        var me = this;
        Ext.apply(me,{
            floating : true,
            shadow   : false,
            renderTo : me.renderTo || Ext.getBody(),
            style    : {
                opacity : 0
            },
            width    : '40%'
        });
        me.callParent(arguments);

        me.on({
            scope       : me,
            delay       : 500,
            afterrender : me.onAfterRender,
            viewvideo   : me.onClickClose
        });
    },

    buildItems : function(){
        var me = this;
        return [{
            xtype : 'tbtext',
            flex  : 1,
            text  : Ext.String.format('{0}<a data-event="viewvideo" href="{1}" target="_blank">{2}</a>',me.text,me.url,Ext.util.Format.uppercase(Valence.lang.lit.viewVideo)),
            listeners : {
                el : {
                    scope : me,
                    click : me.onClickText
                }
            }
        },{
            ui      : 'plain',
            scope   : me,
            iconCls : 'close-icon vvicon-cancel-circle',
            handler : me.onClickClose
        }];
    },

    onAfterRender : function(cmp){
        var me = this;

        if (!me.storageItem || !me.url || !me.text) {
            me.destroy();
        } else if (localStorage.getItem(me.storageItem) === 'true') {
            me.destroy();
        } else if (Valence.util.Helper.getLanguage() !== 'en'){
            me.destroy();
        } else {
            me.add(me.buildItems());

            // anchorTo is supposed to handle repositioning upon scrolling but is not...
            //   set our own scroll listener...
            //
            me.el.anchorTo(me.renderTo,'bc-bc');
            me.renderTo.on({
                scope  : me,
                scroll : me.onScrollRenderTo
            });

            me.show();
            me.el.fadeIn({
                duration : 500
            });

            me.interval = setTimeout(function(){
                me.el.fadeOut({
                    callback : function(){
                        me.destroy();
                    }
                });
            },me.autoHideSeconds * 1000);
        }
    },

    onClickClose : function(){
        var me = this;

        localStorage.setItem(me.storageItem,true);
        me.el.fadeOut({
            callback : function(){
                me.destroy();
            }
        });
    },

    onClickText : function(e){
        var me    = this,
            el    = Ext.get(e.getTarget()),
            event = el.getAttribute('data-event');

        if (event){
            me.fireEvent(event);
        }
    },

    onDestroy : function(){
        var me = this;
        clearInterval(me.interval);
        me.renderTo.un('scroll',me.onScrollRenderTo,me);
        me.callParent(arguments);
    },

    onScrollRenderTo : function(){
        var me = this;
        me.el.anchorTo(me.renderTo,'bc-bc');
    }
});