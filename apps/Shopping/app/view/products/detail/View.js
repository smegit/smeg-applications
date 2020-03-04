Ext.define('Shopping.view.products.detail.View', {
    extend: 'Ext.Component',
    xtype: 'detailview',
    height: '100%',
    width: '100%',
    itemId: 'prd-detail',
    viewModel: 'detail',
    itemSelector: 'div.prd-detail-wrap',
    bind: {
        data: '{product}'
    },
    listeners: {
        render: function (cmp) {
            cmp.el.on('click', function (e, target) {
                var me = this,
                    attr = target.getAttribute('data-event');

                if (attr) {
                    cmp.fireEvent(attr);
                }
            });
        }
    },
    tpl: [
        '<div class="prd-detail-wrap">',
        '<div class="prd-detail-header">',
        '<div class="prd-desc">{[values.Product[0].PRODDESC]}</div>',
        '<div class="prd-model">Model: {[values.Product[0].MODEL]}</div>',
        '<div class="prd-ean">EAN: <b>{[values.Product[0].EAN]}</b></div>',
        '<div class="prd-comment">{[values.Product[0].COMMENT]}',
        '<div class="prd-price-wrpr">',
        '{[this.getPriceText(values.Product[0])]}',
        '{[this.getExpirationText(values.Product[0])]}',

        '<tpl if="values.Product[0].STOCKTIP">',
        '<div class="prd-stock">{[values.Product[0].STOCKTIP]}</div>',
        '</tpl>',



        '</div>',
        '</div>',
        '<div class="prd-detail-body">',
        '<div class="prd-img-wrap">',
        '<img data-event="showlargerimage" src="{[values.Product[0].SMALLPIC]}">',
        '</div>',

        '<div class="prd-detail-body-left">',

        '<h3>Features</h3>',
        '<ul>',
        '<tpl for="values.Features">',
        '<li>{FEATURE}</li>',
        '</tpl>',
        '</ul>',
        //'<div class="prd-detail-gen">EAN13: <b>{[values.Product[0].EAN]}</b></div>',
        // '<tpl if="values.Product[0].STOCKTIP">',
        // '<div class="prd-detail-gen">{[values.Product[0].STOCKTIP]}</b></div>',
        // '</tpl>',
        '</div>',


        '<div class="prd-detail-body-right">',
        //'<div class="prd-detail-gen">{[values.Product[0].STOCKTIP]}</b></div>',

        // '<div class="prd-img-wrap">',
        // '<img data-event="showlargerimage" src="{[values.Product[0].SMALLPIC]}">',
        // '</div>',
        '<div class="prd-files-wrap">',
        '<h3>Downloads</h3>',
        '<div class="prd-files-list">',
        '<ul>',
        '<tpl for="values.Downloads">',
        '<li>',
        '<span class="{ICONCLASS}" style="color: {ICONCOL}">&nbsp</span>',
        '<a href="{URL}" target="_blank">{DOWNLDSC}</a>' +
        '</li>',
        '</tpl>',
        '</ul>',
        '</div>',
        '</div>',
        '</div>',





        '</div>',


        '<div class="prd-stock-info">',
        '<div class="stock-info-wrap">',
        '<h3>Stock Availability</h3>',
        '<table>',
        '<tr>',
        '<th style="text-align:  left;">Location</th>',
        '<th>Stock</th>',
        '<th>In Trans </th>',
        '<th>Ship</th>',
        '<th>Date</th>',
        '</tr>',
        '<tpl for="values.Stock">',
        '<tr>',
        '<td style="text-align:  left;">{LOCATION}</td>',
        '<td style="text-align:  right;">{SOHQTY}</td>',
        '<td style="text-align:  right;">{INTQTY}</td>',
        '<td style="text-align:  right;">{SOBQTY}</td>',
        '<td>{[this.dateTransform(values)]}</td>',
        '</tr>',
        '</tpl>',
        '</table>',
        '</div>',
        '</div>',
        '</div>',
        '<br>',

        {
            getProductSpecialCls: function (values) {
                var me = this,
                    validSpecial = me.isValidSpecial(values, index);
                if (validSpecial) {
                    return 'special';
                }
                return 'normal';
            },
            getPriceText: function (values) {
                //console.info(values);
                var me = this,
                    validSpecial = me.isValidSpecial(values);

                if (validSpecial) {
                    return '<div class="prd-price-normal">was:' + Ext.util.Format.usMoney(values.PRICEOLD) + '</div><div class="prd-price-spc">now: ' + Ext.util.Format.usMoney(values.PRICE) + '</div>';
                }
                return '<div class="prd-price">' + Ext.util.Format.usMoney(values.PRICE) + '</div>';
            },
            getExpirationText: function (values) {
                var me = this,
                    expirationTime = me.getExpirationTime(values);

                // valid time and less than one year
                if (expirationTime > -1 && expirationTime < 31536000) {
                    return '<div class="prd-general prd-expire"> until: ' + Ext.util.Format.date(values.EXPIRY, 'd/m/y') + '</div>';
                }
                return '';
            },

            isValidSpecial: function (values) {
                var expireDate = values.EXPIRY,
                    now, diff;
                if (values.PRICEOLD == 0 || Ext.isEmpty(expireDate)) {
                    return false;
                }
                if (!Ext.isFunction(expireDate.getTime)) {
                    expireDate = Ext.Date.parse(expireDate, 'Y-m-d')
                }
                // get time for date only
                now = Ext.Date.parse(Ext.util.Format.date(new Date(), 'Y-m-d'), 'Y-m-d');
                diff = Math.abs((expireDate.getTime() - now.getTime()) / 1000);
                return diff > -1;
            },
            getExpirationTime: function (values) {
                var expireDate = values.EXPIRY,
                    now, diff;

                if (values.PRICEOLD == 0 || Ext.isEmpty(expireDate)) {
                    return -1;
                }
                if (!Ext.isFunction(expireDate.getTime)) {
                    expireDate = Ext.Date.parse(expireDate, 'Y-m-d')
                }
                now = Ext.Date.parse(Ext.util.Format.date(new Date(), 'Y-m-d'), 'Y-m-d');
                diff = Math.abs((expireDate.getTime() - now.getTime()) / 1000);
                return diff;
            },
            dateTransform: function (values) {
                //console.info(values);
                var originDate = values.SHPDATE;
                if (originDate == '0001-01-01') {
                    return '';
                } else {
                    return originDate.slice(8, 10) + '/' + originDate.slice(5, 7) + '/' + originDate.slice(2, 4);
                }

            }
        }
    ]
});

