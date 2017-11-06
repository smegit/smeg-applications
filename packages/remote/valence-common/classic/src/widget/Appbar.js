/**
 * The app bar is a "special" toolbar that’s used for branding, navigation, search, and actions.
 * The nav icon at the left side of the app bar can be:
 *
 * - A control to open a navigation drawer {@link Valence.common.widget.NavDrawer}.
 * - An up arrow for navigating upward through your app’s hierarchy.
 * - Omitted entirely if no navigation is required.
 *
 */
Ext.define('Valence.common.widget.Appbar', {
    extend   : 'Ext.toolbar.Toolbar',
    requires : [
        'Ext.menu.Menu',
        'Ext.button.Cycle',
        'Valence.common.ux.plugin.form.field.ClearValue'
    ],
    xtype    : 'widget_appbar',
    cls      : 'x-toolbar-appbar',
    icons    : null,
    noFill   : false,
    endItems : [],
    bind     : {
        hideDepth                  : '{appBarHideDepth}',
        UI                         : '{appBarUI}',
        searchActionsLength        : '{appBarSearchActionsLength}',
        // fireFilterEvtOnly is primarily for action search in order to add filter text
        fireFilterEvtOnly          : '{appBarFireFilterEvtOnly}',
        searchComponent            : '{appBarSearchCmp}',
        appBarTitleMenuShowOnClick : '{appBarTitleMenuShowOnClick}'
    },

    config        : {
        appBarTitleMenuShowOnClick : false,
        fireFilterEvtOnly          : false,
        fireFilterEnterKeyOnEmpty  : false,
        searchAction               : false,
        searchActionValue          : null,
        searchActionsLength        : 3,
        searchActionStore          : null,
        searchComponent            : null,
        searchText                 : ''
    },
    /**
     * @event navigation
     * Fires when the navigation icon is clicked.
     *
     * @param {Valence.common.widget.Appbar} this
     * @param {Ext.button.Button} button
     *
     * @event back
     * Fires when the back icon is clicked.
     *
     * @param {Valence.common.widget.Appbar} this
     * @param {Ext.button.Button} button
     */

    initComponent : function () {
        var me   = this;
        me.items = me.items || [];
        me.items.splice(0, 0, {
            ui      : 'plain',
            iconCls : 'vvicon-arrow-left8',
            itemId  : 'backbutton',
            bind    : {
                hidden : '{!appBarBackIcon}'
            },
            scope   : me,
            handler : me.onClickBack
        }, {
            ui      : 'plain',
            iconCls : 'vvicon-menu7',
            bind    : {
                hidden : '{!appBarNavIcon}'
            },
            scope   : me,
            itemId  : 'navbutton',
            handler : me.onClickNavigation
        }, {
            xtype     : 'tbtext',
            itemId    : 'title',
            cls       : 'appbar-title',
            hidden    : true,
            bind      : {
                text   : '{appBarTitle}',
                hidden : '{appBarTitleHide}'
            },
            listeners : {
                el : {
                    scope : me,
                    click : me.onClickTitle
                }
            }
        }, {
            xtype          : 'cycle',
            showText       : true,
            itemId         : 'title_menu',
            cls            : 'appbar-title',
            _focusCls      : null,
            _menuActiveCls : null,
            _pressedCls    : null,
            overCls        : null,
            depth          : false,
            scale          : 'large',
            uppercase      : false,
            bind           : {
                hidden : '{appBarTitleMenuHide}',
                menu   : '{appBarTitleMenu}'
            },
            listeners      : {
                scope  : me,
                change : me.onChangeTitleMenu,
                click  : me.onClickTitleMenu
            }
        });

        if (!me.noFill) {
            me.items.push('->');
        }

        if (me.icons) {
            for (var ii = 0; ii < me.icons.length; ii++) {
                me.items.push(me.icons[ii]);
            }
        }

        if (me.searchAction) {
            me.setSearchActionStore(Ext.create('Ext.data.Store', {
                fields : [
                    'searchname',
                    'searchevent',
                    'searchcmptitle',
                    'searchfieldname',
                    'searchcmprec'
                ],
                data   : [{
                    searchname      : 'Looking for records',
                    searchevent     : null,
                    searchcmptitle  : null,
                    searchfieldname : null,
                    searchcmprec    : null
                }]
            }));

            me.items.push({
                xtype            : 'combo',
                reference        : 'searchField',
                width            : 300,
                minChars         : 2,
                hideLabel        : true,
                hideTrigger      : true,
                clearValuePlugin : false,
                forceSelection   : false,
                store            : me.getSearchActionStore(),
                displayField     : 'name',
                tpl              : [
                    '<tpl for=".">',
                    '<tpl if="searchcmptitle">',
                    '<div class="x-boundlist-item">',
                    '<div style="width:100%;padding:8px;display:table;">',
                    '<div style="display:table-cell;vertical-align:middle;">',
                    '<div style="font-size:16px;font-weight:500;color:rgba(0,0,0,.87)">{searchname}</div>',
                    '<div style="font-size:13px;font-weight:400;color:rgba(0,0,0,.54)">Select from {searchcmptitle}</div>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '<tpl elseif="searchevent == \'filter-0\'">',
                    '<div class="x-boundlist-item" style="border-top: 1px solid #ddd">',
                    '<div style="width:100%;padding:8px;display:table;">',
                    '<div style="display:table-cell;vertical-align:middle;">',
                    '<div style="line-height:16px; font-size:14px;font-weight:500;color:rgba(0,0,0,.54); text-align:center;"><span style="position: relative; top:1px;line-height:14px; font-size:14px; padding-right:16px;" class="vvicon-filter3"></span>{searchname}</div>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '<tpl else>',
                    '<div class="x-boundlist-item" style="border-top: 1px solid #ddd">',
                    '<div style="width:100%;padding:8px;display:table;">',
                    '<div style="display:table-cell;vertical-align:middle;">',
                    '<tpl if="searchevent">',
                    '<div style="line-height:16px;font-size:14px;font-weight:500;color:rgba(0,0,0,.54);text-align:center;">',
                    '<span style="position: relative; top:1px;line-height:14px; font-size:14px; padding-right:16px;" class="vvicon-filter3"></span>',
                    '{searchname}',
                    '</div>',
                    '<tpl else>',
                    '<div style="font-size:14px;font-weight:500;color:rgba(0,0,0,.54)">',
                    '{searchname}',
                    '</div>',
                    '</tpl>',

                    '</div>',
                    '</div>',
                    '</div>',
                    '</tpl>',
                    '</tpl>'
                ],
                plugins          : [{
                    ptype      : 'formfieldclearvalue',
                    hideOnBlur : true
                }],
                listeners        : {
                    focus  : function () {
                        me.oldUI = me.ui;
                        me.setUI('background');
                    },
                    blur   : function () {
                        me.setUI(me.oldUI);
                    },
                    change : {
                        fn     : me.onChangeSearchCmp,
                        buffer : 500
                    },
                    select : me.onSelectSearchCmp,
                    scope  : me
                },
                bind             : {
                    hidden    : '{!appBarSearch}',
                    emptyText : '{appBarSearchEmptyText}'
                }
            });
        } else {
            me.items.push({
                xtype            : 'textfield',
                reference        : 'searchField',
                width            : 300,
                itemId           : 'filterfield',
                hideLabel        : true,
                clearValuePlugin : false,
                hideMode         : 'offsets',
                plugins          : [{
                    ptype      : 'formfieldclearvalue',
                    hideOnBlur : true
                }],
                listeners        : {
                    focus      : function () {
                        me.oldUI = me.ui;
                        me.setUI('background');
                        me.fireEvent('focussearch', me);
                    },
                    blur       : function () {
                        me.setUI(me.oldUI);
                        me.fireEvent('blursearch', me);
                    },
                    change     : me.onChangeFilter,
                    clear      : me.onClearFilterTrigger,
                    specialkey : me.onSpecialKeyFilter,
                    scope      : me
                },
                bind             : {
                    hidden    : '{!appBarSearch}',
                    emptyText : '{appBarSearchEmptyText}',
                    value     : '{appBarSearchValue}'
                }
            });
        }

        me.items.push({
            ui       : 'plain',
            iconCls  : 'vvicon-search2',
            hideMode : 'offsets',
            bind     : {
                hidden : '{!appBarSearchIcon}'
            }
        }, {
            ui       : 'plain',
            iconCls  : 'vvicon-more2',
            hideMode : 'offsets',
            bind     : {
                hidden : '{!appBarMoreIcon}'
            }
        });

        if (!Ext.isEmpty(me.endItems) && Ext.isArray(me.endItems)) {
            me.items = Ext.Array.merge(me.items, me.endItems);
        }

        me.callParent(arguments);
    },

    onClickTitleMenu : function (cmp) {
        var me = this;
        if (me.getAppBarTitleMenuShowOnClick()) {
            cmp.showMenu();
        }
    },

    getSearchComponent : function () {
        var me = this,
            sc = me.searchComponent;

        if (!Ext.isEmpty(sc)) {
            if (!Ext.isArray(sc)) {
                return [sc];
            }
        }
        return sc;
    },

    onChangeTitleMenu : function (cmp, item) {
        var me    = this,
            event = item.event;

        if (event) {
            me.fireEvent(event, me, item);
        }
    },

    onChangeFilter : function (fld, val) {
        var me = this;
        me.fireEvent('filterchange', fld, val);

        // if this appbar has a "searchComponent"...then automatically perform the filtering...
        //
        if (!Ext.isEmpty(me.getSearchComponent())) {
            me.performSearch(val, fld);
        }
    },

    onChangeSearchCmp : function (fld, val) {
        var me = this;
        me.performActionSearch(val);
        me.setSearchActionValue(val);
        //me.fireEvent('filterchange', fld, val);
    },

    onClearFilterTrigger : function (fld) {
        var me = this;
        me.fireEvent('cleartrigger', fld);
    },

    onClickBack : function (btn) {
        var me      = this,
            backBtn = btn || me.down('#backbutton');

        me.fireEvent('back', me, backBtn);
    },

    onClickNavigation : function (btn) {
        var me = this;
        me.fireEvent('navigation', me, btn);
    },

    onClickTitle : function (el) {
        var me = this;
        me.fireEvent('titleclick', me, el);
    },

    onSelectSearchCmp : function (combo, rec) {
        var me    = this,
            event = rec.get('searchevent');

        if (/filter/.test(event)) {
            me.performSearch(me.getSearchActionValue(), null, event.split('-')[1]);
            return;
        }
        me.fireEvent(rec.get('searchevent'), combo, rec);
    },

    onSpecialKeyFilter : function (fld, e) {
        var me    = this,
            value = fld.getValue();
        if (e.getKey() == e.ENTER) {
            if (!Ext.isEmpty(value) || me.getFireFilterEnterKeyOnEmpty()){
                me.fireEvent('filterenterkey', fld, value);
            }
        }
    },

    setAppBarTitleMenu : function (menu) {
        var me    = this,
            title = me.down('#title'),
            tMenu = me.down('#title_menu'),
            item;

        if (Ext.isEmpty(menu)) {
            title.show();
            tMenu.hide();
        } else {
            title.hide();

            // Convert all items to CheckItems
            for (i = 0; i < menu.items; i++) {
                item = menu.items[i];

                item = Ext.applyIf({
                    group     : me.id,
                    itemIndex : i,
                    checked   : item.checked || false
                }, item);

                menu.items.push(item);

            }
            tMenu.setMenu(menu);
            tMenu.show();
        }
    },

    setHideDepth : function(noDepth){
        var me = this;
        if (noDepth){
            me.el.addCls('x-toolbar-appbar-no-depth');
        } else {
            me.el.removeCls('x-toolbar-appbar-no-depth');
        }
    },

    performActionSearch : function (val) {
        var me                    = this,
            srchRegEx             = new RegExp(val, "i"),
            cmps                  = me.getSearchComponent(),
            srchActStr            = me.getSearchActionStore(),
            maxLength             = me.getSearchActionsLength() || 3,
            results = [], filters = [], length,
            cmp, str, rec, recs, cmpEvent, cmpTitle, srchFlds, primaryFld, cmpRsltCnt;

        srchActStr.removeAll();

        for (var i = 0; i < cmps.length; i++) {
            cmp        = cmps[i];
            srchFlds   = cmp.appBarSearchFields;
            cmpRsltCnt = 0;

            if (typeof srchFlds === 'undefined') {
                // todo -- add logic to handle all fields
                Ext.log({
                    msg : 'Appbar search component does not have any search fields'
                });
                continue;
            }
            primaryFld = srchFlds[0];
            str        = (typeof cmp.getStore === "function") ? cmp.getStore() : null;
            if (!str) {
                Ext.log({
                    msg : 'Appbar search component does not have a getStore method'
                });
                continue;
            }
            cmpEvent = cmp.appBarSearchEvent;
            if (Ext.isEmpty(cmpEvent)) {
                Ext.log({
                    msg : 'Appbar search component does not have a search event'
                });
                continue;
            }
            cmpTitle = cmp.getTitle === 'function' ? cmp.getTitle() : cmp.getHeader().getTitle().text;
            if (cmpTitle.indexOf('(') > 0) {
                cmpTitle = cmpTitle.split('(')[0];
            }
            // todo -- handle missing title

            recs   = str.queryBy(function (rec) {
                for (var i = 0; i < srchFlds.length; i++) {
                    if (srchRegEx.test(rec.get(srchFlds[i]))) {
                        return true;
                    }
                }
                return false;
            });
            recs   = recs.items;
            length = recs.length < maxLength ? recs.length : maxLength;

            for (var j = 0; j < recs.length; j++) {
                rec = recs[j];
                cmpRsltCnt++;
                if (str.isFiltered() && str.findExact('id', rec.get('id')) == -1) {
                    continue;
                }
                results.push({
                    searchfieldname : primaryFld,
                    searchname      : rec.get(primaryFld),
                    searchevent     : cmpEvent,
                    searchcmptitle  : cmpTitle,
                    searchcmprec    : rec
                });
                if (results.length == length) {
                    break;
                }
            }
            if (cmpRsltCnt > 0) {
                filters.push({
                    searchfieldname : null,
                    searchname      : Ext.util.Format.format('Filter <i>{0}</i> for "{1}"', cmpTitle, val),
                    searchevent     : 'filter-' + i,
                    searchcmptitle  : null,
                    searchcmprec    : null
                });
            }
        }
        results = Ext.Array.merge(results, filters);
        srchActStr.loadRawData(results);
    },

    performSearch : function (val, fld, index) {
        var me  = this,
            cmp = me.getSearchComponent(),
            str;

        if (Ext.isEmpty(index)) {
            index = 0;
        }
        cmp = cmp[index];

        str = Ext.isFunction(cmp.getStore) ? cmp.getStore() : null

        // maybe this is a store...
        //
        if (typeof cmp.filterBy === "function") {
            str = cmp;
        }

        if (!str) {
            Ext.log({
                msg : 'Appbar search component does not have a getStore method'
            });
        } else {
            var srchRegEx = new RegExp(val, "i"),
                srchFlds  = cmp.appBarSearchFields;

            if (!srchFlds) {
                srchFlds = str.getModel().getFields().map(function (fld) {
                    return fld.name;
                });
            }

            if (Ext.isFunction(cmp.showFilterBar)) { //todo add this in 5.1
                cmp.showFilterBar(val, fld);
            }

            if (!me.getFireFilterEvtOnly()) {
                Valence.util.Helper.processTypedInputFilter(str, srchFlds, val, 'appbarsearch');
            } else {
                me.fireEvent('searchcmpchange', cmp, val);
            }
        }
    },

    buildFilterTag : function () {
        return new Ext.XTemplate(
            '<div class="filter-cont">',
            '<div class="filter-label"><span data-event="clearfilter" class="vvicon-cross"></span>Filtered by: "{filter}"</div>',
            '</div>');
    },

    onClickFilterTag : function (e, el, o) {
        var me  = this,
            d   = el.getAttribute('data-event'),
            cmp = o.cmp,
            fld;
        if (!Ext.isEmpty(d) && d == 'clearfilter') {
            cmp.filterTag.hide();
            cmp.getStore().clearFilter();
            cmp.fireEvent(d, cmp);
        }
    }
});