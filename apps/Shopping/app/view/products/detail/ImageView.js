Ext.define('Shopping.view.products.detail.ImageView', {
    extend          :   'Ext.Component',
    xtype           :   'dtlimageview',
    bind : {
        data : '{product}'
    },
    height          :   '100%',
    width           :   '100%',
    itemId          :   'prd-detail',
    viewModel       :  'detail',
    scrollable      : true,
    itemSelector    :   'div.prd-detail-wrap',
    listeners       : {
        render : function(cmp) {
            cmp.el.on('click', function(e, target){
                var me = this,
                    attr = target.getAttribute('data-event');
                if (attr) {
                    cmp.fireEvent(attr);
                }
            });
        }
    },
    tpl             : [
        '<div class="prd-detail-wrap">',
            '<div class="prd-detail-header">',
                '<div class="prd-price">${[values.Product[0].PRICE]}</div>',
                '<div class="prd-desc">{[values.Product[0].PRODDESC]}</div>',
            '</div>',
            '<div class="prd-detail-body">',
                '<div class="prd-lg-img-wrap">',
                    '<img src="{[values.Product[0].BIGPIC]}">',
                '</div>',
            '</div>',
        '</div>'
    ]
});

