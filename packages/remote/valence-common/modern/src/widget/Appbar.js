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
    extend : 'Ext.Toolbar',

    xtype : 'widget_appbar',

    cls : 'x-toolbar-appbar',

    config : {
        fireFilterEvtOnly : false,
        inSearchMode : false,
        searchComponent : null
    },

    bind : {
        inSearchMode : '{appBarMblSearch}',
        fireFilterEvtOnly : '{appBarFireFilterEvtOnly}',
        searchComponent : '{appBarSearchCmp}',
        ui : '{appBarUI}'
    },

    initialize : function () {
        var me = this;
        me.callParent(arguments);
        me.add({
            xtype : 'button',
            bind  : {
                text      : '{appBarTitleText}',
                iconAlign : '{appBarTitleIconAlign}',
                iconCls   : '{appBarTitleIconCls}',
                hidden    : '{appBarMblSearch}'
            },
            cls   : Ext.os.is.Phone ? 'appbar-title appbar-title-phone' : 'appbar-title',

            event     : 'titletap',
            listeners : {
                scope : me,
                tap   : me.onTapCmp
            }
        });
        me.add('->');
        me.add({
            xtype     : 'textfield',
            cls       : 'vv-appbar-filter-modern',
            reference : 'filterfield',
            listeners : {
                change : me.onChangeFilter,
                scope  : me
            },
            bind      : {
                value : '{appBarMblSearchValue}',
                cls : '{appBarMblSearchCls}'
            }
        });
        me.add({
            xtype : 'button',

            cls       : 'vv-appbar-filter-btn-modern',
            width     : 40,
            event     : 'filtertap',
            bind      : {
                iconCls : '{appBarMblSearchIconCls}',
                hidden  : '{appBarMblSearchIcon}'

            },
            listeners : {
                tap   : me.onTapCmp,
                scope : me
            }
        });
    },

    getSearchComponent : function(){
        var me = this,
            sc = me.callParent(arguments);

        if (!Ext.isEmpty(sc)){
            if (!Ext.isArray(sc)){
                return [sc];
            }
        }
        return sc;
    },


    onChangeFilter : function (fld, val) {
        var me = this;
        me.fireEvent('filterchange', fld, val);

        // if this appbar has a "searchComponent"...then automatically perform the filtering...
        //
        if (!Ext.isEmpty(me.getSearchComponent())){
            me.performSearch(val);
        }
    },

    onTapCmp : function (cmp, item) {
        var me    = this,
            event = cmp.event;
            //searchCmps = me.getSearchComponent(),
            //filterCtrl;

        if (event) {
            me.fireEvent(event, cmp);
        }
        // wait to see if the cmp sets appBarMblSearch
        //setTimeout(function(){
        //    if (me.getInSearchMode() && !Ext.isEmpty(searchCmps)){
        //        if (searchCmps.length > 0){
        //            filterCtrl = new Ext.create({
        //                xtype : 'component',
        //                data : {
        //                    cmp : searchCmps
        //                },
        //                itemId : 'filterTag',
        //                reference : 'filterTag',
        //                cls : 'filter-banner filter-banner-show',
        //                tpl : me.buildFilterCtrl(),
        //                listeners : {
        //                    el : {
        //                        scope : me,
        //                        click : 'onClickFilterCntrl'
        //                    }
        //                },
        //                width : '80%',
        //                floating : true,
        //                alignTarget : Ext.get('textfield.vv-appbar-filter-modern'),
        //                defaultAlign : 't-b',
        //                renderTo : Ext.getBody()
        //            });
        //        }
        //    }
        //},300);
    },

    buildFilterCtrl : function() {
        return new Ext.XTemplate(
            '<tpl for="cmp">',
                '<div class="filter-cont">',
                    '<div class="filter-text">{.}</div>',
                '</div>',
            '</tpl>');
    },

    performSearch : function (val,index) {
        var me  = this,
            cmp = me.getSearchComponent(),
            str,view;

        if (Ext.isEmpty(index)){
            index = 0;
        }
        cmp = cmp[index];

        if (Ext.isString(cmp)){
            view = Ext.ComponentQuery.query('app-main')[0];
            cmp = view.lookupReference(cmp);
        }

        str = Ext.isFunction(cmp.getStore) ? cmp.getStore() : null;

        // maybe this is a store...
        //
        if (Ext.isFunction(cmp.filterBy)){
            str = cmp;
        }

        if (!str) {
            Ext.log({
                msg : 'Appbar search component does not have a getStore method'
            });
            return;
        }

        var srchRegEx = new RegExp(val, "i"),
            srchFlds  = cmp.appBarSearchFields;

        if (!srchFlds){
            srchFlds = str.getModel().getFields().map(function(fld){
                return fld.name;
            });
        }

        if (!me.getFireFilterEvtOnly()) {
            str.clearFilter();

            //filter recent store all fields based on search field value
            //
            str.filterBy(function (rec) {
                for (var i = 0; i < srchFlds.length; i++) {
                    if (srchRegEx.test(rec.get(srchFlds[i]))) {
                        return true;
                    }
                }
                return false;
            });
        }
    },

    //onClickFilterCntrl : function(){
    //    console.log('click');
    //}

});