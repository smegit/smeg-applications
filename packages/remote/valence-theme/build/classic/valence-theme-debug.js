Ext.define('Ext.theme.neptune.Component', {
    override: 'Ext.Component',
    initComponent: function() {
        this.callParent();
        if (this.dock && this.border === undefined) {
            this.border = false;
        }
    },
    privates: {
        initStyles: function() {
            var me = this,
                hasOwnBorder = me.hasOwnProperty('border'),
                border = me.border;
            if (me.dock) {
                // prevent the superclass method from setting the border style.  We want to
                // allow dock layout to decide which borders to suppress.
                me.border = null;
            }
            me.callParent(arguments);
            if (hasOwnBorder) {
                me.border = border;
            } else {
                delete me.border;
            }
        }
    }
}, function() {
    Ext.namespace('Ext.theme.is').Neptune = true;
    Ext.theme.name = 'Neptune';
});

Ext.define('Ext.theme.triton.Component', {
    override: 'Ext.Component'
}, function() {
    Ext.namespace('Ext.theme.is').Triton = true;
    Ext.theme.name = 'Triton';
});

Ext.define('Ext.overrides.classic.data.Store', {
    override: 'Ext.data.Store',
    constructDataCollection: function() {
        return new Ext.util.Collection({
            rootProperty: 'data',
            multiSortLimit: this.multiSortLimit || 10
        });
    }
});

Ext.define('Ext.theme.triton.list.TreeItem', {
    override: 'Ext.list.TreeItem',
    compatibility: Ext.isIE8,
    updateFloated: function(floated, wasFloated) {
        this.callParent([
            floated,
            wasFloated
        ]);
        this.toolElement.syncRepaint();
    }
});

Ext.define('Ext.overrides.classic.container.Container', {
    override: 'Ext.container.Container',
    initComponent: function() {
        var me = this;
        if (!Ext.isEmpty(me.plugins)) {
            if (Ext.Array.indexOf(me.plugins, 'viewport') !== -1 || !Ext.isEmpty(me.getPlugin('viewport'))) {
                if (Ext.isEmpty(me.minWidth)) {
                    Ext.apply(me, {
                        minWidth: 1280
                    });
                    if (!Ext.isIE && Ext.isEmpty(me.scrollable)) {
                        if (!Ext.isEmpty(me.cls)) {
                            me.cls += ' vv-overflow-x';
                        } else {
                            me.cls = ' vv-overflow-x';
                        }
                    }
                }
            }
        }
        me.callParent(arguments);
    }
});

Ext.define('Ext.overrides.classic.button.Button', {
    override: 'Ext.button.Button',
    depth: true,
    uppercase: true,
    initComponent: function() {
        var me = this,
            cls = '';
        me.cls = me.cls || '';
        if (me.uppercase && me.text) {
            me.text = Ext.util.Format.uppercase(me.text);
        }
        if (me.depth && (me.ui.search('transparent') == -1 && me.ui.search('plain') == -1)) {
            if (!Ext.isEmpty(me.cls)) {
                cls += ' depth-1';
            } else {
                cls = 'depth-1';
            }
        }
        me.cls += cls;
        me.callParent(arguments);
        me.on({
            scope: me,
            textchange: me.onButtonTextChange
        });
    },
    onButtonTextChange: function(btn, oldText, newText) {
        if (this.uppercase) {
            btn.suspendEvents(false);
            btn.setText(Ext.util.Format.uppercase(newText));
            btn.resumeEvents(true);
        }
    }
});

Ext.define('Ext.overrides.classic.button.Cycle', {
    override: 'Ext.button.Cycle',
    initComponent: function() {
        // Ext JS Cycle buttons are implemented in a way that clashes with WAI-ARIA requirements,
        // so we warn the developer about that.
        // Don't warn if we're under the slicer though.
        if (Ext.enableAriaButtons && !Ext.slicer) {
            // Hard error if full ARIA compatibility is enabled, otherwise a warning
            var logFn = Ext.enableAria ? Ext.log.error : Ext.log.warn;
            logFn("Using Cycle buttons is not recommended in WAI-ARIA " + "compliant applications, because their behavior conflicts " + "with accessibility best practices. See WAI-ARIA 1.0 " + "Authoring guide: http://www.w3.org/TR/wai-aria-practices/#menubutton");
        }
        var me = this,
            checked = 0,
            items, i, iLen, item;
        // OVERRIDE...adding this line so it may be instantiated without a menu config...
        //
        me.menu = me.menu || {
            items: []
        };
        // Allow them to specify a menu config which is a standard Button config.
        // Remove direct use of "items" in 5.0.
        items = (me.menu.items || []).concat(me.items || []);
        me.menu = Ext.applyIf({
            cls: Ext.baseCSSPrefix + 'cycle-menu',
            items: []
        }, me.menu);
        iLen = items.length;
        // Convert all items to CheckItems
        for (i = 0; i < iLen; i++) {
            item = items[i];
            item = Ext.applyIf({
                group: me.id,
                itemIndex: i,
                checkHandler: me.checkHandler,
                scope: me,
                checked: item.checked || false
            }, item);
            me.menu.items.push(item);
            if (item.checked) {
                checked = i;
            }
        }
        me.itemCount = me.menu.items.length;
        me.callParent(arguments);
        me.on('click', me.toggleSelected, me);
        me.setActiveItem(checked, true);
    },
    // overriding setMenu so we can dynamically change this as the
    // base implementation does not convert the items to checkitems...
    //
    setMenu: function(menu) {
        var me = this,
            checked = 0,
            items, i, iLen, item;
        items = menu.items || [];
        iLen = items.length;
        // Convert all items to CheckItems
        for (i = 0; i < iLen; i++) {
            item = items[i];
            item = Ext.applyIf({
                group: me.id,
                itemIndex: i,
                checkHandler: me.checkHandler,
                scope: me,
                checked: item.checked || false
            }, item);
            menu.items[i] = item;
            if (item.checked) {
                checked = i;
            }
        }
        me.itemCount = me.menu.items.length;
        me.callParent(arguments);
        me.setActiveItem(checked, true);
    },
    // overriding this to simply return out...
    //
    toggleSelected: function() {
        var me = this,
            m = me.menu,
            checkItem;
        return;
        checkItem = me.activeItem.next(':not([disabled])') || m.items.getAt(0);
        checkItem.setChecked(true);
    }
});

Ext.define('Ext.theme.neptune.resizer.Splitter', {
    override: 'Ext.resizer.Splitter',
    size: 8
});

Ext.define('Ext.theme.triton.resizer.Splitter', {
    override: 'Ext.resizer.Splitter',
    size: 10
});

Ext.define('Ext.theme.neptune.toolbar.Toolbar', {
    override: 'Ext.toolbar.Toolbar',
    usePlainButtons: false,
    border: false
});

Ext.define('Ext.theme.neptune.layout.component.Dock', {
    override: 'Ext.layout.component.Dock',
    /**
     * This table contains the border removal classes indexed by the sum of the edges to
     * remove. Each edge is assigned a value:
     * 
     *  * `left` = 1
     *  * `bottom` = 2
     *  * `right` = 4
     *  * `top` = 8
     * 
     * @private
     */
    noBorderClassTable: [
        0,
        // TRBL
        Ext.baseCSSPrefix + 'noborder-l',
        // 0001 = 1
        Ext.baseCSSPrefix + 'noborder-b',
        // 0010 = 2
        Ext.baseCSSPrefix + 'noborder-bl',
        // 0011 = 3
        Ext.baseCSSPrefix + 'noborder-r',
        // 0100 = 4
        Ext.baseCSSPrefix + 'noborder-rl',
        // 0101 = 5
        Ext.baseCSSPrefix + 'noborder-rb',
        // 0110 = 6
        Ext.baseCSSPrefix + 'noborder-rbl',
        // 0111 = 7
        Ext.baseCSSPrefix + 'noborder-t',
        // 1000 = 8
        Ext.baseCSSPrefix + 'noborder-tl',
        // 1001 = 9
        Ext.baseCSSPrefix + 'noborder-tb',
        // 1010 = 10
        Ext.baseCSSPrefix + 'noborder-tbl',
        // 1011 = 11
        Ext.baseCSSPrefix + 'noborder-tr',
        // 1100 = 12
        Ext.baseCSSPrefix + 'noborder-trl',
        // 1101 = 13
        Ext.baseCSSPrefix + 'noborder-trb',
        // 1110 = 14
        Ext.baseCSSPrefix + 'noborder-trbl'
    ],
    // 1111 = 15
    /**
     * The numeric values assigned to each edge indexed by the `dock` config value.
     * @private
     */
    edgeMasks: {
        top: 8,
        right: 4,
        bottom: 2,
        left: 1
    },
    handleItemBorders: function() {
        var me = this,
            edges = 0,
            maskT = 8,
            maskR = 4,
            maskB = 2,
            maskL = 1,
            owner = me.owner,
            bodyBorder = owner.bodyBorder,
            ownerBorder = owner.border,
            collapsed = me.collapsed,
            edgeMasks = me.edgeMasks,
            noBorderCls = me.noBorderClassTable,
            dockedItemsGen = owner.dockedItems.generation,
            b, borderCls, docked, edgesTouched, i, ln, item, dock, lastValue, mask, addCls, removeCls;
        if (me.initializedBorders === dockedItemsGen) {
            return;
        }
        addCls = [];
        removeCls = [];
        borderCls = me.getBorderCollapseTable();
        noBorderCls = me.getBorderClassTable ? me.getBorderClassTable() : noBorderCls;
        me.initializedBorders = dockedItemsGen;
        // Borders have to be calculated using expanded docked item collection.
        me.collapsed = false;
        docked = me.getDockedItems('visual');
        me.collapsed = collapsed;
        for (i = 0 , ln = docked.length; i < ln; i++) {
            item = docked[i];
            if (item.ignoreBorderManagement) {
                // headers in framed panels ignore border management, so we do not want
                // to set "satisfied" on the edge in question
                
                continue;
            }
            dock = item.dock;
            mask = edgesTouched = 0;
            addCls.length = 0;
            removeCls.length = 0;
            if (dock !== 'bottom') {
                if (edges & maskT) {
                    // if (not touching the top edge)
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskT;
                    }
                }
                if (b === false) {
                    mask += maskT;
                }
            }
            if (dock !== 'left') {
                if (edges & maskR) {
                    // if (not touching the right edge)
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskR;
                    }
                }
                if (b === false) {
                    mask += maskR;
                }
            }
            if (dock !== 'top') {
                if (edges & maskB) {
                    // if (not touching the bottom edge)
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskB;
                    }
                }
                if (b === false) {
                    mask += maskB;
                }
            }
            if (dock !== 'right') {
                if (edges & maskL) {
                    // if (not touching the left edge)
                    b = item.border;
                } else {
                    b = ownerBorder;
                    if (b !== false) {
                        edgesTouched += maskL;
                    }
                }
                if (b === false) {
                    mask += maskL;
                }
            }
            if ((lastValue = item.lastBorderMask) !== mask) {
                item.lastBorderMask = mask;
                if (lastValue) {
                    removeCls[0] = noBorderCls[lastValue];
                }
                if (mask) {
                    addCls[0] = noBorderCls[mask];
                }
            }
            if ((lastValue = item.lastBorderCollapse) !== edgesTouched) {
                item.lastBorderCollapse = edgesTouched;
                if (lastValue) {
                    removeCls[removeCls.length] = borderCls[lastValue];
                }
                if (edgesTouched) {
                    addCls[addCls.length] = borderCls[edgesTouched];
                }
            }
            if (removeCls.length) {
                item.removeCls(removeCls);
            }
            if (addCls.length) {
                item.addCls(addCls);
            }
            // mask can use += but edges must use |= because there can be multiple items
            // on an edge but the mask is reset per item
            edges |= edgeMasks[dock];
        }
        // = T, R, B or L (8, 4, 2 or 1)
        mask = edgesTouched = 0;
        addCls.length = 0;
        removeCls.length = 0;
        if (edges & maskT) {
            // if (not touching the top edge)
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskT;
            }
        }
        if (b === false) {
            mask += maskT;
        }
        if (edges & maskR) {
            // if (not touching the right edge)
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskR;
            }
        }
        if (b === false) {
            mask += maskR;
        }
        if (edges & maskB) {
            // if (not touching the bottom edge)
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskB;
            }
        }
        if (b === false) {
            mask += maskB;
        }
        if (edges & maskL) {
            // if (not touching the left edge)
            b = bodyBorder;
        } else {
            b = ownerBorder;
            if (b !== false) {
                edgesTouched += maskL;
            }
        }
        if (b === false) {
            mask += maskL;
        }
        if ((lastValue = me.lastBodyBorderMask) !== mask) {
            me.lastBodyBorderMask = mask;
            if (lastValue) {
                removeCls[0] = noBorderCls[lastValue];
            }
            if (mask) {
                addCls[0] = noBorderCls[mask];
            }
        }
        if ((lastValue = me.lastBodyBorderCollapse) !== edgesTouched) {
            me.lastBodyBorderCollapse = edgesTouched;
            if (lastValue) {
                removeCls[removeCls.length] = borderCls[lastValue];
            }
            if (edgesTouched) {
                addCls[addCls.length] = borderCls[edgesTouched];
            }
        }
        if (removeCls.length) {
            owner.removeBodyCls(removeCls);
        }
        if (addCls.length) {
            owner.addBodyCls(addCls);
        }
    },
    onRemove: function(item) {
        var me = this,
            lastBorderMask = item.lastBorderMask,
            lastBorderCollapse = item.lastBorderCollapse;
        if (!item.destroyed && !item.ignoreBorderManagement) {
            if (lastBorderMask) {
                item.lastBorderMask = 0;
                item.removeCls(me.noBorderClassTable[lastBorderMask]);
            }
            if (lastBorderCollapse) {
                item.lastBorderCollapse = 0;
                item.removeCls(me.getBorderCollapseTable()[lastBorderCollapse]);
            }
        }
        me.callParent([
            item
        ]);
    }
});

Ext.define('Ext.theme.neptune.panel.Panel', {
    override: 'Ext.panel.Panel',
    border: false,
    bodyBorder: false,
    initBorderProps: Ext.emptyFn,
    initBodyBorder: function() {
        // The superclass method converts a truthy bodyBorder into a number and sets
        // an inline border-width style on the body element.  This prevents that from
        // happening if borderBody === true so that the body will get its border-width
        // the stylesheet.
        if (this.bodyBorder !== true) {
            this.callParent();
        }
    }
});

Ext.define('Ext.overrides.classic.panel.Panel', {
    override: 'Ext.panel.Panel',
    // used to hold reference to the appBar textfield
    fltrFld: null,
    hideFilterBar: function() {
        var me = this,
            bar = me.down('#filterbar');
        if (bar) {
            bar.hide();
        }
        if (!Ext.isEmpty(me.fltrFld)) {
            me.fltrFld.setValue('');
        }
    },
    onClickClearFilter: function() {
        var me = this;
        me.fireEvent('clearfilter', me);
        me.hideFilterBar();
    },
    showFilterBar: function(filterText, fld) {
        var me = this,
            bar = me.down('#filterbar');
        if (!Ext.isEmpty(fld)) {
            me.fltrFld = fld;
        }
        if (!bar) {
            me.addDocked({
                xtype: 'toolbar',
                ui: 'background',
                itemId: 'filterbar',
                items: [
                    {
                        xtype: 'button',
                        ui: 'transparent',
                        iconCls: 'vvicon-19 vvicon-cancel-circle',
                        scope: me,
                        handler: me.onClickClearFilter
                    },
                    {
                        xtype: 'tbtext',
                        html: Valence.lang.lit.limitedBy + ': "' + filterText + '"'
                    }
                ]
            });
        } else {
            bar.down('tbtext').update(Valence.lang.lit.limitedBy + ': "' + filterText + '"');
            bar[Ext.isEmpty(filterText) ? 'hide' : 'show']();
        }
    }
});

Ext.define('Ext.theme.neptune.container.ButtonGroup', {
    override: 'Ext.container.ButtonGroup',
    usePlainButtons: false
});

Ext.define('Ext.overrides.classic.plugin.Viewport', {
    override: 'Ext.plugin.Viewport',
    pluginId: 'viewport'
});

Ext.define('Ext.overrides.classic.window.Window', {
    override: 'Ext.window.Window',
    cls: 'depth-5',
    shadow: false,
    buttonAlign: 'right',
    closable: false,
    modal: true,
    resizable: false,
    initComponent: function() {
        var me = this;
        if (me.buttons) {
            Ext.each(me.buttons, function(btn) {
                if (Ext.isEmpty(btn.ui)) {
                    btn.ui = 'transparent-action-blue';
                }
                if (Ext.isEmpty(btn.scale)) {
                    btn.scale = 'medium';
                }
                btn.ripple = false;
            });
        }
        me.callParent(arguments);
        me.on({
            scope: me,
            show: me.onShowWindown
        });
    },
    close: function() {
        var me = this;
        if (me.fireEvent('beforeclose', me) !== false) {
            if (Ext.isEmpty(me.animateTarget)) {
                me.el.fadeOut({
                    callback: function() {
                        me.doClose();
                    }
                });
            } else {
                me.doClose();
            }
        }
    },
    onShowWindown: function() {
        var me = this,
            el = me.getEl();
        if (el.getStyleValue('opacity') === '0') {
            el.fadeIn();
        }
    }
});

Ext.define('Ext.overrides.classic.form.field.Base', {
    override: 'Ext.form.field.Base',
    getSubmitData: function() {
        var me = this,
            data = null,
            val;
        if (!me.disabled && me.submitValue) {
            val = me.getSubmitValue();
            if (val !== null) {
                data = {};
                data[me.getName()] = (!me.graphic) ? val : Valence.util.Helper.encodeUTF16(val);
            }
        }
        return data;
    },
    reset: function() {
        var me = this;
        me.beforeReset();
        me.setValue(me.originalValue);
        me.clearInvalid();
        // delete here so we reset back to the original state
        delete me.wasValid;
        // adding "reset" event....
        //
        me.fireEvent('reset', me);
    }
});

Ext.define('Ext.overrides.classic.form.field.Text', {
    override: 'Ext.form.field.Text',
    forceUppercase: false,
    initComponent: function() {
        var me = this;
        if (me.forceUppercase) {
            me.fieldStyle = 'text-transform:uppercase';
        }
        me.callParent(arguments);
    },
    getRawValue: function() {
        var me = this,
            v = (me.inputEl ? me.inputEl.getValue() : Ext.valueFrom(me.rawValue, ''));
        if (me.forceUppercase) {
            v = Ext.util.Format.uppercase(v);
        }
        me.rawValue = v;
        return v;
    },
    getValue: function() {
        var me = this;
        if (me.forceUppercase) {
            var value = me.callParent(arguments);
            value = Ext.util.Format.uppercase(value);
            return value;
        } else {
            return me.callParent(arguments);
        }
    }
});

Ext.define('Ext.overrides.classic.window.MessageBox', {
    override: 'Ext.window.MessageBox',
    bodyStyle: {
        "background-color": "#fff"
    },
    bodyPadding: '0 16',
    buttonAlign: 'right',
    makeButton: function(btnIdx) {
        var btnId = this.buttonIds[btnIdx];
        return new Ext.button.Button({
            handler: this.btnCallback,
            itemId: btnId,
            scope: this,
            text: this.buttonText[btnId],
            minWidth: 75,
            ui: 'transparent-action-blue',
            scale: 'medium'
        });
    }
});

Ext.define('Ext.overrides.MessageBox', {
    override: 'Ext.MessageBox',
    wait: function(config) {
        var me = this;
        console.log('need to add progress bar');
        me.show(config);
    }
});

Ext.define('Ext.theme.triton.form.field.Checkbox', {
    override: 'Ext.form.field.Checkbox',
    compatibility: Ext.isIE8,
    initComponent: function() {
        this.callParent();
        Ext.on({
            show: 'onGlobalShow',
            scope: this
        });
    },
    onFocus: function(e) {
        var focusClsEl;
        this.callParent([
            e
        ]);
        focusClsEl = this.getFocusClsEl();
        if (focusClsEl) {
            focusClsEl.syncRepaint();
        }
    },
    onBlur: function(e) {
        var focusClsEl;
        this.callParent([
            e
        ]);
        focusClsEl = this.getFocusClsEl();
        if (focusClsEl) {
            focusClsEl.syncRepaint();
        }
    },
    onGlobalShow: function(cmp) {
        if (cmp.isAncestor(this)) {
            this.getFocusClsEl().syncRepaint();
        }
    }
});

Ext.define('Ext.overrides.view.AbstractView', {
    override: 'Ext.view.AbstractView',
    addEmptyText: function() {
        var me = this,
            store = me.getStore(),
            view = me.up('grid'),
            emptyText = me.emptyText,
            parentGrid, locked, dom;
        if (Ext.isDefined(me.emptyTextPlugin) && !me.emptyTextPlugin) {
            return;
        }
        // get the correct dom to place emptyText over grid including headers and columns
        //
        if (Ext.isEmpty(view)) {
            dom = me.getTargetEl().dom;
        } else if (/grid/.test(me.getXTypes())) {
            // check for locked grid
            //
            locked = view.hasCls('x-grid-inner-locked');
            if (locked) {
                // if exists do not create empty text because locked columns
                // technically create two grids
                //
                return;
            } else {
                // if not locked checked to be sure grid is not nested inside another grid
                parentGrid = view.up('grid');
                if (!Ext.isEmpty(parentGrid)) {
                    // if there is a parent, replace view with parent and then recreate the emptyText
                    // bc the nested grids will have the default emptytext
                    view = parentGrid;
                    emptyText = view.emptyText;
                    emptyText = Valence.common.util.Helper.buildEmptyText(Ext.isObject(emptyText) ? emptyText : {
                        heading: Valence.lang.lit.noResults
                    });
                }
            }
            dom = view.getEl().dom;
        }
        if (!Ext.isEmpty(emptyText) && dom && !store.isLoading() && (!me.deferEmptyText || me.refreshCounter > 1 || store.isLoaded())) {
            me.emptyEl = Ext.core.DomHelper.insertHtml('beforeEnd', dom, emptyText);
        }
    }
});

Ext.define('Ext.overrides.view.View', {
    override: 'Ext.view.View',
    emptyTextPlugin: true,
    initComponent: function() {
        var me = this,
            emptyText = me.emptyText;
        if (me.emptyTextPlugin) {
            if (!emptyText) {
                me.emptyText = Valence.common.util.Helper.buildEmptyText({
                    heading: Valence.lang.lit.noResults
                });
            } else {
                if (Ext.isObject(emptyText)) {
                    me.emptyText = Valence.common.util.Helper.buildEmptyText(emptyText);
                }
            }
            me.deferEmptyText = false;
            me.on({
                scope: me,
                render: me.onRenderCommonView
            });
        }
        me.callParent(arguments);
    },
    onClickCommonView: function(e, element) {
        var me = this,
            el = Ext.get(e.getTarget()),
            event = el.getAttribute('data-event');
        if (event) {
            me.fireEvent(event, me);
        }
    },
    onRenderCommonView: function() {
        var me = this;
        me.el.mon(me.el, {
            scope: me,
            delegate: 'div.vv-empty-text-wrap',
            click: me.onClickCommonView
        });
    }
});

Ext.define('Ext.overrides.classic.form.field.Number', {
    override: 'Ext.form.field.Number',
    setDecimalPrecision: function(v) {
        this.decimalPrecision = v;
    }
});

Ext.define('Ext.theme.neptune.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',
    defaultButtonUI: 'plain-toolbar',
    inputItemWidth: 40
});

Ext.define('Ext.theme.triton.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',
    inputItemWidth: 50
});

Ext.define('Ext.overrides.classic.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',
    enableDownload: true,
    getPagingItems: function() {
        var me = this,
            lit = Valence.lang.lit,
            downloadText = (!Ext.isEmpty(lit)) ? lit.download : 'Download',
            originalLoad = Ext.bind(me.onLoad, me),
            inputListeners = {
                scope: me,
                blur: me.onPagingBlur
            },
            items = [
                {
                    itemId: 'first',
                    depth: false,
                    tooltip: me.firstText,
                    overflowText: me.firstText,
                    iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
                    disabled: true,
                    handler: me.moveFirst,
                    scope: me
                },
                {
                    itemId: 'prev',
                    depth: false,
                    tooltip: me.prevText,
                    overflowText: me.prevText,
                    iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
                    disabled: true,
                    handler: me.movePrevious,
                    scope: me
                },
                '-',
                me.beforePageText,
                {
                    xtype: 'numberfield',
                    itemId: 'inputItem',
                    name: 'inputItem',
                    cls: Ext.baseCSSPrefix + 'tbar-page-number',
                    allowDecimals: false,
                    minValue: 1,
                    hideTrigger: true,
                    enableKeyEvents: true,
                    keyNavEnabled: false,
                    selectOnFocus: true,
                    submitValue: false,
                    // mark it as not a field so the form will not catch it when getting fields
                    isFormField: false,
                    width: me.inputItemWidth,
                    margin: '-1 2 3 2',
                    listeners: inputListeners
                },
                {
                    xtype: 'tbtext',
                    itemId: 'afterTextItem',
                    html: Ext.String.format(me.afterPageText, 1)
                },
                '-',
                {
                    itemId: 'next',
                    depth: false,
                    tooltip: me.nextText,
                    overflowText: me.nextText,
                    iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
                    disabled: true,
                    handler: me.moveNext,
                    scope: me
                },
                {
                    itemId: 'last',
                    depth: false,
                    tooltip: me.lastText,
                    overflowText: me.lastText,
                    iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
                    disabled: true,
                    handler: me.moveLast,
                    scope: me
                },
                '-',
                {
                    itemId: 'refresh',
                    depth: false,
                    tooltip: me.refreshText,
                    overflowText: me.refreshText,
                    iconCls: Ext.baseCSSPrefix + 'tbar-loading',
                    disabled: me.store.isLoading(),
                    handler: me.doRefresh,
                    scope: me
                }
            ];
        if (!Ext.isEmpty(me.store) && me.store.storeId !== 'ext-empty-store') {
            me.store.on({
                load: function(str) {
                    var download = me.down('#download'),
                        store = me.store;
                    if (!Ext.isEmpty(download) && !Ext.isEmpty(store)) {
                        if (store.getCount() === 0) {
                            download.disable();
                        } else {
                            download.enable();
                        }
                    }
                }
            });
        } else {
            //override onLoad method so we can enable/disable the download button
            //
            me.onLoad = Ext.bind(function() {
                var me = this;
                originalLoad();
                var download = me.down('#download'),
                    store = me.store;
                if (!Ext.isEmpty(download) && !Ext.isEmpty(store)) {
                    if (store.getCount() === 0) {
                        download.disable();
                    } else {
                        download.enable();
                    }
                }
            }, me);
        }
        inputListeners[Ext.supports.SpecialKeyDownRepeat ? 'keydown' : 'keypress'] = me.onPagingKeyDown;
        if (me.enableDownload) {
            items.push({
                xtype: 'tbseparator',
                itemId: 'downloadSeparator'
            }, {
                itemId: 'download',
                depth: false,
                tooltip: downloadText,
                overflowText: downloadText,
                iconCls: 'vv-paging vvicon-download5',
                disabled: (me.store.getCount() === 0),
                handler: function(btn) {
                    var me = this,
                        grid = me.up('grid');
                    if (!Ext.isEmpty(grid)) {
                        grid.fireEvent('download', grid, btn);
                    }
                },
                scope: me
            });
        }
        return items;
    }
});

Ext.define('Ext.theme.neptune.picker.Month', {
    override: 'Ext.picker.Month',
    // Monthpicker contains logic that reduces the margins of the month items if it detects
    // that the text has wrapped.  This can happen in the classic theme  in certain
    // locales such as zh_TW.  In order to work around this, Month picker measures
    // the month items to see if the height is greater than "measureMaxHeight".
    // In neptune the height of the items is larger, so we must increase this value.
    // While the actual height of the month items in neptune is 24px, we will only 
    // determine that the text has wrapped if the height of the item exceeds 36px.
    // this allows theme developers some leeway to increase the month item size in
    // a neptune-derived theme.
    measureMaxHeight: 36
});

Ext.define('Ext.theme.triton.picker.Month', {
    override: 'Ext.picker.Month',
    footerButtonUI: 'default-toolbar',
    calculateMonthMargin: Ext.emptyFn
});

Ext.define('Ext.theme.triton.picker.Date', {
    override: 'Ext.picker.Date',
    footerButtonUI: 'default-toolbar'
});

Ext.define('Ext.theme.neptune.form.field.HtmlEditor', {
    override: 'Ext.form.field.HtmlEditor',
    defaultButtonUI: 'plain-toolbar'
});

Ext.define('Ext.theme.neptune.panel.Table', {
    override: 'Ext.panel.Table',
    lockableBodyBorder: true,
    initComponent: function() {
        var me = this;
        me.callParent();
        if (!me.hasOwnProperty('bodyBorder') && !me.hideHeaders && (me.lockableBodyBorder || !me.lockable)) {
            me.bodyBorder = true;
        }
    }
});

Ext.define('Ext.overrides.classic.view.Table', {
    override: 'Ext.view.Table',
    stripeRows: false
});

Ext.define('Ext.overrides.classic.grid.Panel', {
    override: 'Ext.grid.Panel',
    columnLines: false,
    headerBorders: false,
    countInTitle: true,
    autoFocusFirstRow: false,
    config: {
        recCount: 0,
        orgTitle: null,
        orgHdrTitle: null
    },
    initComponent: function() {
        var me = this,
            viewConfig = me.viewConfig,
            emptyText, emptyTextPlugin;
        if (Ext.isEmpty(viewConfig)) {
            me.viewConfig = {
                emptyText: Valence.common.util.Helper.buildEmptyText(Valence.lang.lit.noResults),
                deferEmptyText: false
            };
        } else {
            emptyTextPlugin = viewConfig.emptyTextPlugin;
            if (!Ext.isDefined(emptyTextPlugin) || emptyTextPlugin) {
                emptyText = viewConfig.emptyText;
                if (Ext.isObject(emptyText)) {
                    viewConfig.emptyText = Valence.common.util.Helper.buildEmptyText(emptyText);
                    viewConfig.deferEmptyText = false;
                }
            }
        }
        me.callParent(arguments);
        me.on({
            scope: me,
            render: me.onRenderBaseGrid
        });
    },
    checkUpdateTitle: function() {
        var me = this,
            cnt = me.getStore().getCount(),
            title = me.getOrgTitle() || me.title,
            hdr;
        if (!Ext.isEmpty(title)) {
            me.setTitle(title);
            return;
        }
        // Check if original header title has been set
        //
        hdr = me.getHeader();
        title = me.getOrgHdrTitle();
        if (!Ext.isEmpty(title)) {
            hdr.setTitle(cnt > 0 ? Ext.util.Format.format('{0} ({1})', title, cnt) : title);
            return;
        }
        // If title and original header title have not been set check if there is a header and it has a title
        // set original header title if it exists
        //
        if (!Ext.isEmpty(hdr) && Ext.isFunction(hdr.getTitle)) {
            title = hdr.getTitle().text;
            // header was adding a blank space when title is left empty
            //
            if (!Ext.isEmpty(title) && Ext.String.htmlDecode(title).length > 1) {
                me.setOrgHdrTitle(title);
                hdr.setTitle(cnt > 0 ? Ext.util.Format.format('{0} ({1})', title, cnt) : title);
            }
        }
    },
    setStore: function(str) {
        var me = this;
        me.callParent(arguments);
        if (!Ext.isEmpty(str)) {
            str.on({
                scope: me,
                datachanged: me.onDatachangedGrid
            });
            me.onDatachangedGrid(str);
        }
    },
    setTitle: function(title) {
        var me = this,
            orgTitle = me.getOrgTitle();
        if (me.countInTitle && title) {
            if (title !== orgTitle) {
                me.setOrgTitle(title);
            }
            if (me.getRecCount() > 0) {
                title = title + ' (' + me.getRecCount() + ')';
            }
        }
        me.callParent(arguments);
    },
    onDatachangedGrid: function(str) {
        var me = this,
            cnt = str.getCount();
        //auto focus first row
        //
        if (me.autoFocusFirstRow) {
            var appBarFilterField = Ext.ComponentQuery.query('widget_appbar #filterfield')[0],
                filterHasFocus = (!Ext.isEmpty(appBarFilterField)) ? appBarFilterField.hasFocus : false;
            if (!filterHasFocus) {
                var view = me.getView();
                if (cnt > 0 && view.isVisible()) {
                    setTimeout(function() {
                        rec = str.getAt(0);
                        if (!Ext.isEmpty(rec)) {
                            view.focusRow(rec);
                        }
                    }, 0);
                }
            }
        }
        me.setRecCount(cnt);
        // Check if title has been set
        //
        me.checkUpdateTitle();
    },
    onClickGridPanel: function(e, element) {
        var me = this,
            el = Ext.get(e.getTarget()),
            event = el.getAttribute('data-event');
        if (event) {
            me.fireEvent(event, me);
        }
    },
    onRenderBaseGrid: function() {
        var me = this;
        me.el.mon(me.el, {
            scope: me,
            delegate: 'div.vv-empty-text-wrap',
            click: me.onClickGridPanel
        });
    }
});

Ext.define('Ext.theme.neptune.grid.RowEditor', {
    override: 'Ext.grid.RowEditor',
    buttonUI: 'default-toolbar'
});

Ext.define('Ext.theme.triton.grid.column.Column', {
    override: 'Ext.grid.column.Column',
    compatibility: Ext.isIE8,
    onTitleMouseOver: function() {
        var triggerEl = this.triggerEl;
        this.callParent(arguments);
        if (triggerEl) {
            triggerEl.syncRepaint();
        }
    }
});

Ext.define('Ext.overrides.classic.grid.column.Column', {
    override: 'Ext.grid.column.Column',
    //compatability   : '5.1.1',
    sort: function(direction) {
        var me = this,
            grid = me.up('tablepanel'),
            store = grid.store,
            sorter = me.getSorter(),
            multiSortPluginActive = (!Ext.isEmpty(grid.getPlugin('gridmultisort'))) ? true : false;
        // Maintain backward compatibility.
        // If the grid is NOT configured with multi column sorting, then specify "replace".
        // Only if we are doing multi column sorting do we insert it as one of a multi set.
        // Suspend layouts in case multiple views depend upon this grid's store (eg lockable assemblies)
        Ext.suspendLayouts();
        me.sorting = true;
        if (!multiSortPluginActive) {
            if (sorter) {
                if (direction) {
                    sorter.setDirection(direction);
                }
                store.sort(sorter, grid.multiColumnSort ? 'multi' : 'replace');
            } else {
                store.sort(me.getSortParam(), direction, grid.multiColumnSort ? 'multi' : 'replace');
            }
        } else {
            // Since Multiple Sort Plugin is active we want to maintain the sorters a bit different
            // because we are displaying them. First when a column sort is set if active sorts exist
            // add the new sort to the end not the begining of the sorts.
            //
            var multiSortLimit = store.data.getMultiSortLimit(),
                activeSorters = store.getSorters(),
                property = me.getSortParam(),
                sorter = activeSorters.get(property),
                root = 'data',
                getNewSorters = function() {
                    var newSorters = [];
                    for (var ii = 0; ii < activeSorters.items.length; ii++) {
                        newSorters.push(activeSorters.items[ii]);
                    }
                    return newSorters;
                },
                newSorters;
            if (sorter) {
                if (direction) {
                    sorter.setDirection(direction);
                } else {
                    sorter.toggle();
                }
                store.setSorters(getNewSorters());
            } else {
                if (Ext.isEmpty(activeSorters) || activeSorters.length === 0) {
                    sorter = new Ext.util.Sorter({
                        direction: direction,
                        property: property,
                        root: root
                    });
                    store.setSorters(sorter);
                } else {
                    if (activeSorters.items.length < multiSortLimit) {
                        newSorters = getNewSorters();
                        newSorters.push(new Ext.util.Sorter({
                            direction: direction,
                            property: property,
                            root: root
                        }));
                        store.setSorters(newSorters);
                    } else {
                        var lit = Valence.lang.lit;
                        try {
                            Valence.common.util.Snackbar.show({
                                text: lit.maximumnSortedColumnsLimited.replace('VAR1', multiSortLimit)
                            });
                        } catch (e) {
                            Ext.Msg.show({
                                title: lit.sort,
                                message: lit.maximumnSortedColumnsLimited.replace('VAR1', multiSortLimit),
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.WARN
                            });
                        }
                    }
                }
            }
        }
        delete me.sorting;
        Ext.resumeLayouts(true);
    },
    // this appears to be broken in 6.0.1...
    //   the call to "this.sort" passes no parameter thus causing the visual on the column
    //   not to change and the "sortchange" event is not always fired...
    //
    toggleSortState: function() {
        var sst = this.sortState;
        if (this.isSortable()) {
            this.sort((sst) ? (sst === 'ASC') ? 'DESC' : 'ASC' : '');
        }
    }
});

Ext.define('Ext.theme.neptune.grid.column.RowNumberer', {
    override: 'Ext.grid.column.RowNumberer',
    width: 25
});

Ext.define('Ext.theme.triton.grid.column.RowNumberer', {
    override: 'Ext.grid.column.RowNumberer',
    width: 32
});

Ext.define('Ext.theme.triton.menu.Item', {
    override: 'Ext.menu.Item',
    compatibility: Ext.isIE8,
    onFocus: function(e) {
        this.callParent([
            e
        ]);
        this.repaintIcons();
    },
    onFocusLeave: function(e) {
        this.callParent([
            e
        ]);
        this.repaintIcons();
    },
    privates: {
        repaintIcons: function() {
            var iconEl = this.iconEl,
                arrowEl = this.arrowEl,
                checkEl = this.checkEl;
            if (iconEl) {
                iconEl.syncRepaint();
            }
            if (arrowEl) {
                arrowEl.syncRepaint();
            }
            if (checkEl) {
                checkEl.syncRepaint();
            }
        }
    }
});

Ext.define('Ext.theme.neptune.menu.Separator', {
    override: 'Ext.menu.Separator',
    border: true
});

Ext.define('Ext.theme.neptune.menu.Menu', {
    override: 'Ext.menu.Menu',
    showSeparator: false
});

Ext.define('Ext.theme.triton.menu.Menu', {
    override: 'Ext.menu.Menu',
    compatibility: Ext.isIE8,
    afterShow: function() {
        var me = this,
            items, item, i, len;
        me.callParent(arguments);
        items = me.items.getRange();
        for (i = 0 , len = items.length; i < len; i++) {
            item = items[i];
            // Just in case if it happens to be a non-menu Item 
            if (item && item.repaintIcons) {
                item.repaintIcons();
            }
        }
    }
});

Ext.define('Ext.theme.triton.grid.plugin.RowExpander', {
    override: 'Ext.grid.plugin.RowExpander',
    headerWidth: 32
});

Ext.define('Ext.theme.triton.grid.selection.SpreadsheetModel', {
    override: 'Ext.grid.selection.SpreadsheetModel',
    checkboxHeaderWidth: 32
});

Ext.define('Ext.theme.triton.selection.CheckboxModel', {
    override: 'Ext.selection.CheckboxModel',
    headerWidth: 32
});

Ext.define('Ext.overrides.classic.tab.Tab', {
    override: 'Ext.tab.Tab',
    depth: false,
    uppercase: false
});

/**
 * @author Ed Spencer (http://sencha.com)
 * Transition plugin for DataViews
 */
Ext.define('Ext.overrides.classic.ux.DataView.Animated', {
    override: 'Ext.ux.DataView.Animated',
    /**
     * @property defaults
     * @type Object
     * Default configuration options for all DataViewTransition instances
     */
    defaults: {
        duration: 125,
        idProperty: 'id'
    },
    /**
     * Creates the plugin instance, applies defaults
     * @constructor
     * @param {Object} config Optional config object
     */
    constructor: function(config) {
        Ext.apply(this, config || {}, this.defaults);
    },
    /**
     * Initializes the transition plugin. Overrides the dataview's default refresh function
     * @param {Ext.view.View} dataview The dataview
     */
    onViewReady: function(dataview) {
        if (dataview.getStore().storeId == 'ext-empty-store') {
            return;
        }
        var me = this,
            store = dataview.getStore(),
            items = dataview.all,
            task = {
                interval: 20
            },
            duration = me.duration;
        /**
         * @property dataview
         * @type Ext.view.View
         * Reference to the DataView this instance is bound to
         */
        me.dataview = dataview;
        dataview.blockRefresh = true;
        dataview.updateIndexes = Ext.Function.createSequence(dataview.updateIndexes, function() {
            this.getTargetEl().select(this.itemSelector).each(function(element, composite, index) {
                element.dom.id = Ext.util.Format.format("{0}-{1}", dataview.id, dataview.getStore().getAt(index).internalId);
            }, this);
        }, dataview);
        /**
         * @property dataviewID
         * @type String
         * The string ID of the DataView component. This is used internally when animating child objects
         */
        me.dataviewID = dataview.id;
        /**
         * @property cachedStoreData
         * @type Object
         * A cache of existing store data, keyed by id. This is used to determine
         * whether any items were added or removed from the store on data change
         */
        me.cachedStoreData = {};
        //catch the store data with the snapshot immediately
        me.cacheStoreData(store.data || store.snapshot);
        dataview.on('resize', function() {
            var store = dataview.getStore();
            if (store.getCount() > 0) {}
        }, // reDraw.call(this, store);
        this);
        // Buffer listenher so that rapid calls, for example a filter followed by a sort
        // Only produce one redraw.
        dataview.getStore().on({
            datachanged: reDraw,
            scope: this,
            buffer: 50
        });
        function reDraw() {
            var parentEl = dataview.getTargetEl();
            if (!parentEl) {
                return;
            }
            var parentEl = dataview.getTargetEl(),
                parentElY = parentEl.getY(),
                parentElPaddingTop = parentEl.getPadding('t'),
                added = me.getAdded(store),
                removed = me.getRemoved(store),
                remaining = me.getRemaining(store),
                itemArray, i, id,
                itemFly = new Ext.dom.Fly(),
                rtl = me.dataview.getInherited().rtl,
                oldPos, newPos,
                styleSide = rtl ? 'right' : 'left',
                newStyle = {};
            // Not yet rendered
            if (!parentEl) {
                return;
            }
            // Collect nodes that will be removed in the forthcoming refresh so
            // that we can put them back in order to fade them out
            Ext.iterate(removed, function(recId, item) {
                id = me.dataviewID + '-' + recId;
                // Stop any animations for removed items and ensure th.
                Ext.fx.Manager.stopAnimation(id);
                item.dom = Ext.getDom(id);
                if (!item.dom) {
                    delete removed[recId];
                }
            });
            me.cacheStoreData(store);
            // stores the current top and left values for each element (discovered below)
            var oldPositions = {},
                newPositions = {};
            // Find current positions of elements which are to remain after the refresh.
            Ext.iterate(remaining, function(id, item) {
                if (itemFly.attach(Ext.getDom(me.dataviewID + '-' + id))) {
                    oldPos = oldPositions[id] = {
                        top: itemFly.getY() - parentElY - itemFly.getMargin('t') - parentElPaddingTop
                    };
                    oldPos[styleSide] = me.getItemX(itemFly);
                } else {
                    delete remaining[id];
                }
            });
            // The view MUST refresh, creating items in the natural flow, and collecting the items
            // so that its item collection is consistent.
            dataview.refresh();
            // Replace removed nodes so that they can be faded out, THEN removed
            Ext.iterate(removed, function(id, item) {
                parentEl.dom.appendChild(item.dom);
                itemFly.attach(item.dom).animate({
                    duration: duration,
                    opacity: 0,
                    callback: function(anim) {
                        var el = Ext.get(anim.target.id);
                        if (el) {
                            el.destroy();
                        }
                    }
                });
                delete item.dom;
            });
            // We have taken care of any removals.
            // If the store is empty, we are done.
            if (!store.getCount()) {
                return;
            }
            // Collect the correct new positions after the refresh
            itemArray = items.slice();
            // Reverse order so that moving to absolute position does not affect the position of
            // the next one we're looking at.
            for (i = itemArray.length - 1; i >= 0; i--) {
                id = store.getAt(i).internalId;
                itemFly.attach(itemArray[i]);
                newPositions[id] = {
                    dom: itemFly.dom,
                    top: itemFly.getY() - parentElY - itemFly.getMargin('t') - parentElPaddingTop
                };
                newPositions[id][styleSide] = me.getItemX(itemFly);
                // We're going to absolutely position each item.
                // If it is a "remaining" one from last refesh, shunt it back to
                // its old position from where it will be animated.
                newPos = oldPositions[id] || newPositions[id];
                // set absolute positioning on all DataView items. We need to set position, left and
                // top at the same time to avoid any flickering
                newStyle.position = 'absolute';
                newStyle.top = newPos.top + "px";
                newStyle[styleSide] = newPos.left + "px";
                itemFly.applyStyles(newStyle);
            }
            // This is the function which moves remaining items to their new position
            var doAnimate = function() {
                    var elapsed = new Date() - task.taskStartTime,
                        fraction = elapsed / duration;
                    if (fraction >= 1) {
                        // At end, return all items to natural flow.
                        newStyle.position = newStyle.top = newStyle[styleSide] = '';
                        for (id in newPositions) {
                            itemFly.attach(newPositions[id].dom).applyStyles(newStyle);
                        }
                        Ext.TaskManager.stop(task);
                    } else {
                        // In frame, move each "remaining" item according to time elapsed
                        for (id in remaining) {
                            var oldPos = oldPositions[id],
                                newPos = newPositions[id],
                                oldTop = oldPos.top,
                                newTop = newPos.top,
                                oldLeft = oldPos[styleSide],
                                newLeft = newPos[styleSide],
                                diffTop = fraction * Math.abs(oldTop - newTop),
                                diffLeft = fraction * Math.abs(oldLeft - newLeft),
                                midTop = oldTop > newTop ? oldTop - diffTop : oldTop + diffTop,
                                midLeft = oldLeft > newLeft ? oldLeft - diffLeft : oldLeft + diffLeft;
                            newStyle.top = midTop + "px";
                            newStyle[styleSide] = midLeft + "px";
                            itemFly.attach(newPos.dom).applyStyles(newStyle);
                        }
                    }
                };
            // Fade in new items
            Ext.iterate(added, function(id, item) {
                if (itemFly.attach(Ext.getDom(me.dataviewID + '-' + id))) {
                    itemFly.setOpacity(0);
                    itemFly.animate({
                        duration: duration,
                        opacity: 1
                    });
                }
            });
            // Stop any previous animations
            Ext.TaskManager.stop(task);
            task.run = doAnimate;
            Ext.TaskManager.start(task);
            me.cacheStoreData(store);
        }
        dataview.un('refresh', this.onViewReady, this);
    },
    init: function(dataview) {
        dataview.on('refresh', this.onViewReady, this);
    },
    getItemX: function(el) {
        var rtl = this.dataview.getInherited().rtl,
            parentEl = el.up('');
        if (rtl) {
            return parentEl.getViewRegion().right - el.getRegion().right + el.getMargin('r');
        } else {
            return el.getX() - parentEl.getX() - el.getMargin('l') - parentEl.getPadding('l');
        }
    },
    /**
     * Caches the records from a store locally for comparison later
     * @param {Ext.data.Store} store The store to cache data from
     */
    cacheStoreData: function(store) {
        var cachedStoreData = this.cachedStoreData = {};
        store.each(function(record) {
            cachedStoreData[record.internalId] = record;
        });
    },
    /**
     * Returns all records that were already in the DataView
     * @return {Object} All existing records
     */
    getExisting: function() {
        return this.cachedStoreData;
    },
    /**
     * Returns the total number of items that are currently visible in the DataView
     * @return {Number} The number of existing items
     */
    getExistingCount: function() {
        var count = 0,
            items = this.getExisting();
        for (var k in items) {
            count++;
        }
        return count;
    },
    /**
     * Returns all records in the given store that were not already present
     * @param {Ext.data.Store} store The updated store instance
     * @return {Object} Object of records not already present in the dataview in format {id: record}
     */
    getAdded: function(store) {
        var cachedStoreData = this.cachedStoreData,
            added = {};
        store.each(function(record) {
            if (cachedStoreData[record.internalId] == null) {
                added[record.internalId] = record;
            }
        });
        return added;
    },
    /**
     * Returns all records that are present in the DataView but not the new store
     * @param {Ext.data.Store} store The updated store instance
     * @return {Array} Array of records that used to be present
     */
    getRemoved: function(store) {
        var cachedStoreData = this.cachedStoreData,
            removed = {},
            id;
        for (id in cachedStoreData) {
            if (store.findBy(function(record) {
                return record.internalId == id;
            }) == -1) {
                removed[id] = cachedStoreData[id];
            }
        }
        return removed;
    },
    /**
     * Returns all records that are already present and are still present in the new store
     * @param {Ext.data.Store} store The updated store instance
     * @return {Object} Object of records that are still present from last time in format {id: record}
     */
    getRemaining: function(store) {
        var cachedStoreData = this.cachedStoreData,
            remaining = {};
        store.each(function(record) {
            if (cachedStoreData[record.internalId] != null) {
                remaining[record.internalId] = record;
            }
        });
        return remaining;
    }
});

Ext.namespace('Ext.theme.is')['valence-theme'] = true;
Ext.theme.name = 'valence-theme';

Ext.define('Ext.overrides.dataview.DataView', {
    override: 'Ext.dataview.DataView',
    deferEmptyText: false,
    config: {
        // could not set using valence lit
        // an empty object will trigger updateEmptyText
        //
        emptyText: {}
    },
    updateEmptyText: function(newEmptyText, oldEmptyText) {
        var me = this,
            store;
        if (Ext.isDefined(me.emptyTextPlugin) && !me.emptyTextPlugin) {
            return;
        }
        if (Ext.isEmpty(newEmptyText) || (Ext.isObject(newEmptyText) && !Ext.isEmpty(newEmptyText.heading))) {
            newEmptyText = Valence.common.util.Helper.buildEmptyText({
                heading: Valence.lang.lit.noResults
            });
        } else {
            if (Ext.isObject(newEmptyText)) {
                newEmptyText = Valence.common.util.Helper.buildEmptyText(newEmptyText);
            } else {
                newEmptyText = Valence.common.util.Helper.buildEmptyText({
                    heading: newEmptyText
                });
            }
        }
        if (oldEmptyText && me.emptyTextCmp) {
            me.remove(me.emptyTextCmp, true);
            delete me.emptyTextCmp;
        }
        if (newEmptyText) {
            me.emptyTextCmp = me.add({
                xtype: 'component',
                cls: me.getBaseCls() + '-emptytext',
                html: newEmptyText,
                hidden: true
            });
            store = me.getStore();
            if (store && me.hasLoadedStore && !store.getCount()) {
                me.showEmptyText();
            }
        }
    }
});

Ext.define('Ext.overrides.dataview.List', {
    override: 'Ext.dataview.List',
    config: {
        deferEmptyText: false
    }
});

Ext.define('Ext.overrides.field.Text', {
    override: 'Ext.field.Text',
    config: {
        invalid: false,
        invalidMsg: null,
        readOnly: false
    },
    setInvalid: function(invalid, msg) {
        var me = this,
            el = Ext.get(me.element),
            inputEl = Ext.get(el.selectNode('.x-field-input')),
            invalidMsg = me.getInvalidMsg(),
            errorText = Valence.lang.lit.ERROR;
        if (invalid) {
            if (Ext.isEmpty(invalidMsg)) {
                me.setInvalidMsg(inputEl.insertHtml('afterEnd', Ext.util.Format.format('<div class="vv-mdrn-invalid-msg">{0}</div>', msg || errorText)));
            } else {
                invalidMsg = Ext.get(invalidMsg);
                invalidMsg.setHtml(msg || errorText);
            }
        }
        me.toggleCls('vv-mdrn-invalid', invalid);
    },
    setReadOnly: function(readOnly) {
        var me = this;
        me.toggleCls('x-field-readonly', readOnly);
        me.callParent(arguments);
    }
});

Ext.define('Ext.overrides.modern.plugin.ListPaging', {
    override: 'Ext.plugin.ListPaging',
    initialize: function() {
        var me = this;
        me.setNoMoreRecordsText(Valence.lang.lit.noMoreRecords);
        me.setLoadMoreText(Valence.lang.lit.loadMore);
        me.callParent(arguments);
    }
});

Ext.define('Ext.overrides.modern.plugin.PullRefresh', {
    override: 'Ext.plugin.PullRefresh',
    initialize: function() {
        var me = this,
            lit = Valence.lang.lit;
        me.setPullText(lit.pullDownToUpdate);
        me.setReleaseText(lit.releaseToRefresh);
        me.setLoadingText(lit.loading);
        me.setLoadedText(lit.loaded);
        me.setLastUpdatedText(lit.lastUpdated + ':&nbsp;');
        // todo -- callback not firing
        //Valence.util.Helper.getDateFormat({
        //
        //    callback : function(){
        //        //me.setLastUpdatedDateFormat();
        //    }
        //});
        me.callParent(arguments);
    }
});

Ext.define('valence-theme.plugin.Ripple', {
    alias: 'plugin.ripple',
    init: function(component) {
        var me = this;
        // only proceed for chrome and firefox
        //
        if (Ext.isChrome || Ext.isGecko) {
            me.component = component;
            if (component.ripple) {
                if (component.xtype === 'button' || component.xtype === 'tab') {
                    component.on({
                        click: me.onButtonClick,
                        scope: me
                    });
                }
                //} else if (component.xtypesMap.grid || component.xtypesMap.treepanel){
                else if (component.xtype === 'widget_selector') {
                    component.on({
                        itemclick: me.onWidgetSelectorItemClick,
                        scope: me
                    });
                } else {
                    Ext.global.console.warn('Unsupported : ', component, component.config.xtype);
                }
            }
        }
    },
    onButtonClick: function(cmp, e) {
        var element = this.component.el,
            offsetLeft, offsetTop, x, y;
        offsetLeft = parseInt(element.dom.getBoundingClientRect().left);
        offsetTop = parseInt(element.dom.getBoundingClientRect().top);
        x = parseInt(e.pageX - offsetLeft);
        y = parseInt(e.pageY - offsetTop);
        Ext.DomHelper.append(element, '<div class="ripple-effect" style="position: absolute; top:' + y + 'px; left:' + x + 'px;"></div>');
        setTimeout(function() {
            var ripple = Ext.DomQuery.select('div[class=ripple-effect')[0];
            if (ripple) {
                ripple.remove();
            }
        }, 500);
    },
    onWidgetSelectorItemClick: function(cmp, rec, el, index, e) {
        var element = Ext.get(el),
            elementXY = e.getXY(),
            parentXY = cmp.getEl().getXY(),
            x, y;
        x = parseInt(elementXY[0] - parentXY[0]);
        y = parseInt(elementXY[1] - parentXY[1]);
        Ext.DomHelper.append(element, '<div class="ripple-effect" style="position: absolute!important; top:' + y + 'px; left:' + x + 'px;"></div>');
        setTimeout(function() {
            var ripple = Ext.DomQuery.select('div[class=ripple-effect')[0];
            if (ripple) {
                ripple.remove();
            }
        }, 500);
    }
});

Ext.define('valence-theme.plugin.Ripple', {
    alias: 'plugin.ripple',
    init: function(component) {
        var me = this;
        // only proceed for chrome and firefox
        //
        if (Ext.isChrome || Ext.isGecko) {
            me.component = component;
            if (component.ripple) {
                if (component.xtype === 'button' || component.xtype === 'tab') {
                    component.on({
                        click: me.onButtonClick,
                        scope: me
                    });
                }
                //} else if (component.xtypesMap.grid || component.xtypesMap.treepanel){
                else if (component.xtype === 'widget_selector') {
                    component.on({
                        itemclick: me.onWidgetSelectorItemClick,
                        scope: me
                    });
                } else {
                    Ext.global.console.warn('Unsupported : ', component, component.config.xtype);
                }
            }
        }
    },
    onButtonClick: function(cmp, e) {
        var element = this.component.el,
            offsetLeft, offsetTop, x, y;
        offsetLeft = parseInt(element.dom.getBoundingClientRect().left);
        offsetTop = parseInt(element.dom.getBoundingClientRect().top);
        x = parseInt(e.pageX - offsetLeft);
        y = parseInt(e.pageY - offsetTop);
        Ext.DomHelper.append(element, '<div class="ripple-effect" style="position: absolute; top:' + y + 'px; left:' + x + 'px;"></div>');
        setTimeout(function() {
            var ripple = Ext.DomQuery.select('div[class=ripple-effect')[0];
            if (ripple) {
                ripple.remove();
            }
        }, 500);
    },
    onWidgetSelectorItemClick: function(cmp, rec, el, index, e) {
        var element = Ext.get(el),
            elementXY = e.getXY(),
            parentXY = cmp.getEl().getXY(),
            x, y;
        x = parseInt(elementXY[0] - parentXY[0]);
        y = parseInt(elementXY[1] - parentXY[1]);
        Ext.DomHelper.append(element, '<div class="ripple-effect" style="position: absolute!important; top:' + y + 'px; left:' + x + 'px;"></div>');
        setTimeout(function() {
            var ripple = Ext.DomQuery.select('div[class=ripple-effect')[0];
            if (ripple) {
                ripple.remove();
            }
        }, 500);
    }
});

