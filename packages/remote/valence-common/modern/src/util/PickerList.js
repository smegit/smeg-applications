/**
 *  Utility class for displaying a dialog this is a list of choices.
 *  Picker List contains multiple values (in the form one-dimenionsal array) that result in some kind of action. An example would be a filter based on specific values.
 */
Ext.define('Valence.common.util.PickerList', {
    singleton : true,

    requires : [
        'Ext.Sheet'
    ],
    config   : {
        cmp          : null,
        scope        : this,
        fnc          : null,
        displayField : null,
        listArray    : [],
        subMenu      : false,
        cardIndex    : 0,
        subLists     : null
    },

    /**
     * Show the picker list.
     *
     * ## Example usage
     *     Valence.common.util.PickerList.showPickerList({
                title     : 'Select an Environment:',
                handler   : me.onTapEnvironmentFilter,
                listArray : envs,
                scope     : me
            });
     *
     * @param {String} [title]
     * @param {Array|Store} listArray Specify the buttons to display. Upon clicking a button, the handler will be
     *                               called passing the lowercased button text as the parameter. If the button
     *                               has a property labeled "parmText" then that will be passed instead.
     * @param {Fuction} [handler] Function to call if an item is tapped.
     * @param {Object} [scope] Specify the scope for the function handler.
     * @param {Object} [cfg] Additional configs to apply to the dialog window.
     */
    showPickerList : function (o) {
        var me           = this,
            listStore    = o.listArray || null,
            title        = o.title || null,
            addlCfg      = o.cfg || null,
            fnc          = o.handler || null,
            minWidth     = o.minWidth || null,
            maxHeight    = o.maxHeight || null,
            displayField = o.displayField || 'field1',
            textAlign    = o.textAlign || 'center',
            scope        = o.scope,
            subLists     = o.subLists,
            cfg          = {
                layout        : {
                    type  : 'vbox',
                    align : 'stretch'
                },
                width         : '80%',
                height        : '80%',
                modal         : true,
                hideOnMaskTap : true,
                scrollable    : true,
                //  all styling is being done via the dialog ui currently
                ui            : 'dialog',
                cls           : 'vv-pickerlist',
                hideAnimation : {type : 'fadeOut', duration : 250},
                minWidth      : minWidth,
                maxWidth      : 500,
                maxHeight     : maxHeight,
                title         : title,
                showAnimation : false
            }, cancel    = {
                xtype  : 'toolbar',
                docked : 'bottom',
                itemId : 'cncltlbr',
                layout : {
                    type  : 'hbox',
                    align : 'stretch',
                    pack  : 'center'
                },
                height : 60,
                items  : [{
                    text    : 'Cancel',
                    cls     : 'vv-btn-non-primary',
                    handler : me.onTapCancel,
                    scope   : me
                }]
            }, items, list, subList, subListArray, subListItem, cmp;

        me.setDisplayField(displayField);

        if (!listStore) {
            Ext.log('An array of options or store must be passed');
        } else if (Ext.isEmpty(scope)) {
            Ext.log('Scope must be passed.');
        } else {
            if (addlCfg) {
                Ext.apply(cfg, addlCfg);
            }
            list         = {
                xtype       : 'list',
                width       : '100%',
                selectedCls : 'dummy',
                flex        : 1,
                itemTpl     : [
                    '<div style="display:inline-block;text-align:left;width:90%;overflow-x:hidden;text-overflow:ellipsis;" class="vv-picker-list-item">{' + displayField + '}</div>',
                    '<tpl if="menu">',
                    '<div style="position:absolute;right:0;display:inline-block;"><span style="font-size: 30px;" class="vvicon-arrow-right4"></span></div>',
                    '</tpl>'
                ],
                store       : listStore,
                listeners   : {
                    itemtap : me.onTapList,
                    scope   : me
                }
            };
            items        = [list];
            cfg['items'] = items;
            if (!Ext.isEmpty(subLists)) {
                subListArray = [];
                me.setSubMenu(true);
                me.setCardIndex(0);
                for (var i   = 0; i < subLists.length; i++) {
                    subList     = Ext.clone(list);
                    subListItem = subLists[i];
                    Ext.apply(subList, {
                        itemTpl : [
                            '<div style="display:inline-block;text-align:left;width:90%;overflow-x:hidden;text-overflow:ellipsis;" class="vv-picker-list-item">{' + displayField + '}</div>',
                            '<tpl if="menu">',
                            '<div style="position:absolute;right:0;display:inline-block;"><span style="font-size: 30px;" class="vvicon-arrow-right4"></span></div>',
                            '</tpl>'
                        ],
                        store   : subListItem.store
                    });
                    subListArray.push(subList);
                }
                me.setSubLists(subListArray);
                cfg['items'] = [{
                    xtype  : 'toolbar',
                    itemId : 'toptlbr',
                    cls : 'vv-sublistpicker',
                    docked : 'top',
                    height : 60,
                    hidden : true,
                    items  : [{
                        text    : 'Back',
                        cls     : 'vv-btn-non-primary',
                        handler : me.onTapBack,
                        scope   : me
                    }]
                }, {
                    xtype  : 'container',
                    flex   : 1,
                    layout : {
                        type      : 'card',
                        animation : 'slide'
                    },
                    itemId : 'pickernavcnt',
                    items  : items
                }, cancel];
            } else {
                me.setSubMenu(false);
                items.push(cancel);
            }
            if (Ext.isEmpty(cfg.maxHeight)) {
                if ((Ext.isArray(listStore) && listStore.length < 5) || (!Ext.isString(listStore) && Ext.getStore(listStore).getCount() < 5) && Ext.isEmpty(subLists)) {
                    cfg['maxHeight'] = 240;
                } else {
                    cfg['maxHeight'] = '80%';
                }
            }
        }

        me.setFnc(fnc);
        me.setScope(scope);


        cmp = Ext.Viewport.add(Ext.widget('sheet', cfg));
        me.setCmp(cmp);
        cmp.show();

        return cmp;
    },
    onTapList      : function (list, index, el, rec) {
        var me       = this,
            fnc      = me.getFnc(),
            scope    = me.getScope(),
            subLists = me.getSubLists(),
            picker   = me.getCmp(),
            cleanUp  = function(){
                if (me.getSubMenu()) {
                    picker.down('#toptlbr').destroy();
                }

                picker.down('#cncltlbr').destroy();

                picker.destroy();
            },
            cmp, animation, cardIndex, card;

        if (me.getSubMenu() && rec.get('menu')) {
            card      = picker.down('#pickernavcnt');
            animation = card.getLayout().getAnimation();
            animation.setDirection('left');
            cardIndex = me.getCardIndex() + 1;
            picker.down('#toptlbr').show();
            cmp       = card.add(subLists[cardIndex - 1]);
            me.setCardIndex(cardIndex);
            card.setActiveItem(cmp);
            return;
        }

        if (fnc) {
            Ext.callback(fnc, scope, [list, me.getDisplayField() === 'field1' ? rec.get('field1') : rec]);
            me.setFnc(null);
            me.setScope(this);

            cleanUp();
        } else {
            cleanUp();
        }
    },

    onTapBack : function () {
        var me         = this,
            cmp        = me.getCmp(),
            card       = cmp.down('#pickernavcnt'),
            animation  = card.getLayout().getAnimation(),
            cardIndex  = me.getCardIndex() - 1,
            activeItem = card.getActiveItem();

        animation.setDirection('right');

        me.setCardIndex(cardIndex);

        card.setActiveItem(cardIndex);
        if (cardIndex == 0) {
            cmp.down('#toptlbr').hide();
        }
        setTimeout(function () {
            activeItem.destroy();
        }, 300);
    },

    onTapCancel : function () {
        var me = this;
        me.getCmp().destroy();
    }
});


