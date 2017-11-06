/**
 * loadmask
 */
Ext.define('Valence.common.widget.Loadmask',{
    extend    : 'Ext.Component',
    xtype     : 'widget_loadmask',
    cls       : 'w-mask-outer',
    type      : 'spinner',
    initComponent : function(){
        var me = this;
        Ext.apply(me,{
            renderTpl   : me.buildRenderTpl(),
            stopDestroy : true
        });
        if (Ext.isEmpty(me.renderTo)){
            Ext.apply(me,{
                renderTo  : Ext.getBody()
            });
        }
        me.callParent(arguments);

        me.on({
            scope         : me,
            beforedestroy : me.onBeforeDestroy
        });
    },

    buildRenderTpl : function(){
        var me = this;
        if (me.type === 'pbar'){
            return [
                '<div class="w-mask-inner">',
                    '<div class="w-mask-title">{text}</div>',
                    '<div class="w-mask-pbar">',
                        '<span class="w-mask-pbar-full">',
                            '<span class="w-mask-pbar-fill"></span>',
                        '</span>',
                    '</div>',
                '</div>'
            ];
        } else if (me.type === 'rect'){
            return [
                '<div class="w-mask-inner rect">',
                    '<div class="ui rect1"></div>',
                    '<div class="ui rect2"></div>',
                    '<div class="ui rect3"></div>',
                    '<div class="ui rect4"></div>',
                    '<div class="ui rect5"></div>',
                    '<p class="w-mask-title">{text}</p>',
                '</div>'
            ]
        } else if (me.type === 'spinner'){
            return [
                '<div class="w-mask-inner w-spinner">',
                    '<div class="circle1 child"></div>',
                    '<div class="circle2 child"></div>',
                    '<div class="circle3 child"></div>',
                    '<div class="circle4 child"></div>',
                    '<div class="circle5 child"></div>',
                    '<div class="circle6 child"></div>',
                    '<div class="circle7 child"></div>',
                    '<div class="circle8 child"></div>',
                    '<div class="circle9 child"></div>',
                    '<div class="circle10 child"></div>',
                    '<div class="circle11 child"></div>',
                    '<div class="circle12 child"></div>',
                    '<p class="w-mask-title">{text}</p>',
                '</div>'
            ]
        }
    },

    initiateDestroy : function(){
        var me = this;
        //me.el.down('div.w-mask-bar').addCls('w-mask-bar-shrink');
        //me.el.down('div.w-mask-title').addCls('w-mask-title-fade');
        me.el.fadeOut({
            duration : 600,
            callback : function(){
                me.destroy();
            }
        });
    },

    initRenderData: function() {
        var me = this;
        return Ext.apply(me.callParent(), {
            text : me.text
        });
    },

    onBeforeDestroy : function(){
        var me = this;
        if (me.stopDestroy){
            me.stopDestroy = false;
            me.initiateDestroy();
        }
        return false;
    }
});