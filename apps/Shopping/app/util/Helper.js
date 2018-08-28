Ext.define('Shopping.util.Helper', {
    singleton : true,
    printCart : function (o) {
        var me   = this,
            src  = o.src || 'resources/print-cart.html',
            body = Ext.getBody(),
            win;

        if (!me.cartTpl) {
            me.cartTpl = me.buildCartTpl();
        }

        if (me.printFrame) {
            Ext.get(me.printFrame).destroy();
            me.printFrame = null;
        }

        me.printFrame = Ext.DomHelper.append(body, {
            tag    : 'iframe',
            width  : '100%',
            height : '0%',
            src    : src
        });
        win           = me.printFrame.contentWindow;
        setTimeout(function () {
            console.log(me.cartTpl.apply(o.data));
            win.document.body.innerHTML = me.cartTpl.apply(o.data);
            win.focus();
            setTimeout(function(){
                win.print();
                win.close();
            },300);
        }, 500);
    },

    getApp : function(){
        var me = this,
            appId = Ext.getUrlParam('app'),
            portal = parent.Portal, app;
        if (!Ext.isEmpty(portal) && !Ext.isEmpty(appId)) {
            var activeApps = portal.util.Helper.getAllApps();
            if (!Ext.isEmpty(activeApps)) {
                for (var ii = 0; ii < activeApps.length; ii++) {
                    if (activeApps[ii].app == appId) {
                        app = activeApps[ii];
                        break;
                    }
                }
            }
        }
        return app;
    },

    getOutstanding : function(rec){
        var qty       = rec.get('quantity'),
            delivered = rec.get('delivered');
        return qty - delivered;
    },

    buildCartTpl : function () {
        return Ext.create("Ext.XTemplate",
            '<div class="container">',
                '<div class="smeg_logo_cont">',
                    '<div style="padding-left:20px;">',
                        '<img src="/resources/images/smeg_logocurrent.png">',
                        '<p style="font-size:13px; font-weight:300;">ABN 33 146 901 082<br>',
                            'Smeg Australia Pty Ltd<br>',
                            '2 Baker Street Banksmeadow NSW 2019<br>',
                            'Telephone: 02 86674888',
                        '</p>',
                    '</div>',
                '</div>',
                '<div class="agent_cont">',
                    '<div class="agent_title">Your Smeg Agent:</div>',
                        '<p>',
                            '{AgentL1}<br>',
                            '{AgentL2}<br>',
                            '{AgentL3}<br>',
                            '{AgentL4}<br>',
                            '{AgentL5}<br>',
                        '</p>',
                    '</div>',
                '<div class="order_type_number">',
                    '<div class="order_type">{Type}</div>',
                    '<div class="order_number" >Order {OAORDKEY}</div>',
                '</div>',
                '<div class="order_info">',
                    '<div class="return">',
                        "<div>",
                            "<strong>Reference</strong>",
                                "<p>{OACSTREF}</p>",
                        "</div>",
                        "<div>",
                            "<strong>Date</strong>",
                            "<p>{[Ext.util.Format.date(values.OADATE,'d/m/Y')]}</p>",
                        "</div>",
                        "<div>",
                            "<strong>Sales Person</strong>",
                            "<p>{OAREP}</p>",
                        "</div>",
                        "<div>",
                            "<strong>Preferred Delivery</strong>",
                            "<p>{[Ext.util.Format.date(values.OADELD,'d/m/Y')]}</p>",
                        "</div>",
                        "<div>",
                            "<strong>Printed</strong>",
                            "<p>{[Ext.util.Format.date(values.date,'d/m/Y')]}&nbsp;&nbsp;{time}</p>",
                        "</div>",
                    "</div>",
                "</div>",
                '<table class="cust_dtl_table">',
                    '<tr class="cust_dtl_row">',
                        '<td>',
                            '<div class="customer_details">',
                                "<h2>Customer Details</h2>",
                                '<div class="return">',
                                    "<p>{OACSTNAM}<br>",
                                        "<tpl if=\"OACSTST1 != ''\">",
                                            '{OACSTST1}',
                                            '<tpl if="OACSTST2">',
                                                "<br>{OACSTST2}",
                                            "</tpl>",
                                            "<br>{OACSTCTY} {OACSTSTA} {OACSTPST}",
                                            "<tpl if=\"OACSTCOU != ''\">",
                                                "<br>{OACSTCOU}",
                                            "</tpl>",
                                        "</tpl>",
                                    '</p>',
                                    '<tpl if="OACSTPH1">',
                                        '<p><strong>Daytime Phone</strong><br>{OACSTPH1}</p>',
                                    "</tpl>",
                                    "<tpl if=\"OACSTPH2 != ''\">",
                                        '<p><strong>After Hours Phone</strong><br>{OACSTPH2}</p>',
                                    "</tpl>",
                                    '<tpl if="OACSTEML">',
                                        '<p><strong>Email</strong><br>{OACSTEML}</p>',
                                    '</tpl>',
                                "</div>",
                            '</div>',
                        "</td>",
                        "<tpl if=\"OADELNAM != ''\">",
                            '<td>',
                                '<div class="delivery_address">',
                                    "<h2>Delivery Address</h2>",
                                    '<div class="return">',
                                        "<p>{OADELNAM}<br>",
                                        "<tpl if=\"OADELST1 != ''\">",
                                            '{OADELST1}',
                                            '<tpl if="OADELST2">',
                                                "<br>{OADELST2}",
                                            "</tpl>",
                                            "<br>{OADELCTY} {OADELSTA} {OADELPST}",
                                            "<tpl if=\"OADELCOU != ''\">",
                                                "<br>{OADELCOU}",
                                            "</tpl>",
                                        "</tpl>",
                                        '</p>',
                                        '<tpl if="OADELPH1">',
                                            '<p><strong>Daytime Phone</strong><br>{OADELPH1}</p>',
                                        "</tpl>",
                                        "<tpl if=\"OADELPH2 != ''\">",
                                            '<p><strong>After Hours Phone</strong><br>{OADELPH2}</p>',
                                        "</tpl>",
                                        '<tpl if="OADELEML">',
                                            '<p><strong>Email</strong><br>{OADELEML}</p>',
                                        '</tpl>',
                                    "</div>",
                                '</div>',
                            "</td>",
                        '<tpl else>',
                            '<td>',
                                '<div class="customer_details">',
                                    "<h2>Delivery Address</h2>",
                                    '<div class="return">',
                                        "<p>{OACSTNAM}<br>",
                                            "<tpl if=\"OACSTST1 != ''\">",
                                                '{OACSTST1}',
                                                '<tpl if="OACSTST2">',
                                                    '<br>{OACSTST2}',
                                                '</tpl>',
                                                "<br>{OACSTCTY} {OACSTSTA} {OACSTPST}",
                                                "<tpl if=\"OACSTCOU != ''\">",
                                                    "<br>{OACSTCOU}",
                                                "</tpl>",
                                            "</tpl>",
                                        '</p>',
                                        '<tpl if="OACSTPH1">',
                                            '<p><strong>Daytime Phone</strong><br>{OACSTPH1}</p>',
                                        "</tpl>",
                                        "<tpl if=\"OACSTPH2 != ''\">",
                                            '<p><strong>After Hours Phone</strong><br>{OACSTPH2}</p>',
                                        "</tpl>",
                                        '<tpl if="OACSTEML">',
                                            '<p><strong>Email</strong><br>{OACSTEML}</p>',
                                        '</tpl>',
                                    "</div>",
                                '</div>',
                            "</td>",
                        "</tpl>",
                        '<td>',
                            '<div class="delivery_options">',
                                "<h2>Delivery Options</h2>",
                                '<ul>',
                                '<tpl for="deliveryOpts">',
                                    '<tpl if="ODDELV == \'1\'">',
                                        '<li>{ODDELD}</li>',
                                    '</tpl>',
                                '</tpl>',
                                '</ul>',
                            '</div>',
                        '</td>',
                    "</tr>",
                "</table>",
                '<table class="order_items">',
                    "<thead>",
                        '<th scope="col" class="align_left">Item</th>',
                        '<th scope="col" class="align_left">Description</th>',
                        '<th scope="col" class="align_right">Quantity</th>',
                        '<th scope="col" class="align_right">Price</th>',
                        '<th scope="col" class="align_right">Total</th>',
                    "</thead>",
                    "<tbody>",
                        '<tpl for="lines">',
                            "<tpl if=\"OBITM != ''\">",
                                "<tr>",
                                    '<td class="item">{OBITM}</td>',
                                    "<td>{I1IDSC}</td>",
                                    '<td class="align_right">{OBQTYO}</td>',
                                    '<td class="align_right">{[fm.usMoney(values.OBUPRC)]}</td>',
                                    '<td class="align_right">{[fm.usMoney(values.extended_price)]}</td>',
                                "</tr>",
                            "<tpl else>",
                                "<tr>",
                                    '<td class="shopping_cart_total"></td>',
                                    '<td class="shopping_cart_total"></td>',
                                    '<td class="shopping_cart_total align_right">{OBQTYO}</td>',
                                    '<td class="shopping_cart_total"></td>',
                                    '<td class="shopping_cart_total align_right">{[fm.usMoney(values.extended_price)]}</td>',
                                "</tr>",
                            "</tpl>",
                        "</tpl>",
                    "</tbody>",
                "</table>",
                '<div class="pay_specials_container">',
                    '<div class="special_instructions">',
                        '<tpl if="OASPI">',
                            "<h2>Special Instructions</h2>",
                            '<p class="special_paragraph">{[this.replaceBreaks(values)]}</p>',
                        "</tpl>",
                    "</div>",
                    '<tpl if="PaySum">',
                        '<div class="payment-table-cnt">',
                            //'<div class="return"></div>',
                            "<h2>Payment</h2>",
                            '<table class="payment-table">',
                                '<tpl for="PaySum">',
                                    '<tr class="payment-line">',
                                        '<td style="width: 20%;" class="payment-field">{LABEL}</td>',
                                        '<td style="width: 20%; text-align:right;" class="payment-amount">{[Ext.util.Format.currency(values.AMOUNT)]}</td>',
                                        '<td style="width: 60%;" class="payment-desc">{NOTE}</td>',
                                    '</tr>',
                                '</tpl>',
                            '</table>',
                        '</div>',
                    '</tpl>',
                '</div>',
                '<div class="terms_signature">',
                    '<div class="terms_cont">',
                        '<div class="terms">',
                            '<p>Please refer to full terms and conditions.<br><br>',
                                'For assistance phone Smeg customer care on (02) 86674888 or email <span style="text-decoration: underline;">retailsales@smeg.com.au</span>.',
                            '</p>',
                        '</div>',
                    '</div>',
                    '<div class="signatures_cont">',
                        '<div class="signatures">',
                            '<div>Signed for: {AgentL1}</div>',
                            '<div class="signature_line"></div>',
                            '<div>Signed for: {OACSTNAM}</div>',
                            '<div class="signature_line"></div>',
                        '</div>',
                    '</div>',
                '</div>',
            "</div>",{
                replaceBreaks : function(values){
                    var instr = values.OASPI;
                    if (Ext.isEmpty(instr)) {
                        return '';
                    }
                    return (instr.replace(new RegExp('\\n','g'),'<br>'));
                }
            })
    }
});
