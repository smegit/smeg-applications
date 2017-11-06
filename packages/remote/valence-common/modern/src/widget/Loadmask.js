Ext.define('Valence.common.widget.Loadmask',{
    extend    : 'Ext.Component',
    xtype     : 'widget_loadmask',
    cls       : 'w-mask-outer',
    type      : 'spinner',
    stopDestory : true,
    tpl       : new Ext.XTemplate(
        '<div class="w-mask-inner rect">',
        '<div class="rect1"></div>',
        '<div class="rect2"></div>',
        '<div class="rect3"></div>',
        '<div class="rect4"></div>',
        '<div class="rect5"></div>',
        '<p class="w-mask-title">{text}</p>',
        '</div>'
    )
});
