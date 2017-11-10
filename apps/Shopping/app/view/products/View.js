Ext.define('Shopping.view.products.View', {
    extend     : 'Ext.container.Container',
    requires   : [
        'Ext.layout.container.Fit',
        'Ext.view.View'
    ],
    xtype      : 'products',
    cls        : 'products',
    autoScroll : true,
    scrollable : 'y',

    layout : {
        type  : 'vbox',
        align : 'stretch'
    },

    items : [{
        xtype     : 'container',
        cls       : 'category-text',
        bind      : {
            html   : '{bannerText}',
            hidden : '{hideBannerText}'
        },
        maxHeight : 160,
        flex      : 0
    }, {
        xtype           : 'dataview',
        flex            : 1,
        reference       : 'productsdv',
        bind            : {
            store : '{products}'
        },
        scrollable      : 'y',
        emptyText       : 'No Products',
        itemSelector    : 'div.prd-wrap',
        overItemCls     : 'prd-wrap-over',
        selectedItemCls : 'prd-wrap-sel',
        padding         : '10 0 0 10',
        selModel        : {
            enableKeyNav : false
        },
        tpl             : ['<tpl for=".">',
            '<div class="prd-wrap">',
            '<div class="inner {[this.getProductSpecialCls(values,xindex)]}">',
            '<img src="{SMALLPIC}">',
            '<div class="prd-desc">{PRODDESC}</div>',
            '<div class="prd-model">Model: {MODEL}</div>',
            '{[this.getPriceText(values,xindex)]}',
            '{[this.getExpirationText(values,xindex)]}',
            '<div class="prd-general">{STOCKTIP}</div>',
            '<div data-event="addtocart" class="add-to-cart">ADD TO CART</div>',
            '<div class="{AVAILCLASS}"></div>',
            '</div>',
            '</div>',
            '</tpl>', {
                getProductSpecialCls : function (values, index) {
                    var me           = this,
                        validSpecial = me.isValidSpecial(values, index);
                    if (validSpecial) {
                        return 'special';
                    }
                    return 'normal';
                },
                getPriceText         : function (values, index) {
                    var me           = this,
                        validSpecial = me.isValidSpecial(values, index);
                    if (validSpecial) {
                        return '<div class="prd-price-normal">' + Ext.util.Format.usMoney(values.PRICEOLD) + '</div><div class="prd-price-spc">NOW: ' + Ext.util.Format.usMoney(values.PRICE) + '</div>';
                    }
                    return '<div class="prd-price">' + Ext.util.Format.usMoney(values.PRICE) + '</div>';
                },
                getExpirationText    : function (values, index) {
                    var me             = this,
                        expirationTime = me.getExpirationTime(values, index);

                    // valid time and less than one year
                    if (expirationTime > -1 && expirationTime < 31536000) {
                        return '<div class="prd-general prd-expire"> expires: ' + Ext.util.Format.date(values.EXPIRY, 'd/m/y') + '</div>';
                    }
                    return '';
                },

                isValidSpecial    : function (values, index) {
                    var expireDate = values.EXPIRY,
                        now, diff;
                    if (values.PRICEOLD == 0 || Ext.isEmpty(expireDate)) {
                        return false;
                    }
                    // get time for date only
                    now  = Ext.Date.parse(Ext.util.Format.date(new Date(), 'Y-m-d'), 'Y-m-d');
                    diff = Math.abs((expireDate.getTime() - now.getTime()) / 1000);
                    return diff > -1;
                },
                getExpirationTime : function (values, index) {
                    var expireDate = values.EXPIRY,
                        now, diff, fakeDate;

                    if (values.PRICEOLD == 0 || Ext.isEmpty(expireDate)) {
                        return -1;
                    }
                    now  = Ext.Date.parse(Ext.util.Format.date(new Date(), 'Y-m-d'), 'Y-m-d');
                    diff = Math.abs((expireDate.getTime() - now.getTime()) / 1000);
                    return diff;
                }

            }]

    }]

});