/**
 * Navdrawer - todo
 */
Ext.define('Valence.common.widget.NavDrawer', {
    extend              : 'Ext.Container',
    requires            : [
        'Ext.tree.Panel'
    ],
    xtype               : 'widget_navdrawer',
    width               : 300,
    config              : {
        /**
         * @cfg {String} Specify the title.
         */
        title : null
    },
    /**
     * @cfg {Boolean} [sliding=true] Navdrawer will slide in and out. This must be done via {@link #method-show} and {@link #method-hide}.
     */
    sliding             : true,
    /**
     * @cfg {Boolean} [hideOnSelection=true] Automatically hide the navdrawer when a user selects an item from the nav list.
     */
    hideOnSelection     : true,
    /**
     * @cfg {Boolean} [navIcon=false] Include a navigation drawer icon. When clicked, it will automatically hide the navdrawer.
     */
    navIcon             : true, /**
     * @cfg {Boolean} [maskBodyOnShow=true] Mask the body of the document when this navdrawer is showing.
     */
    maskBodyOnShow      : true,
    /**
     * @cfg {Array} [navItems] A list of items for navigation of the app.
     *
     * ## Example usage
     *     [{
     *         text  : 'Home',
     *         leaf  : true,    // meaning there are no sub-categories beneath this
     *         event : 'home'   // if an item has an "event", it will be fired
     *     },{
     *         text : 'Clearance',
     *         children : [{
     *             text  : 'Outdoor',
     *             event : 'outdoor',
     *             leaf  : true
     *         },{
     *             text  : 'Seasonal',
     *             event : 'seasonal',
     *             leaf  : true
     *         }]
     *     },{
     *         text  : 'New Items',
     *         event : 'newitems',
     *         leaf  : true
     *     }]
     *
     */
    navItems            : null,
    /**
     * @cfg {Object} [navStore] An Ext.data.TreeStore object. This would be used in place of navItems.
     */
    navStore            : null,
    height              : '100%',
    layout              : {
        type  : 'vbox',
        align : 'stretch'
    },
    /**
     * @cfg {Object} [renderTo=Ext.getBody()] Specify the element to render this component to.
     */
    renderTo            : null,
    /**
     * @cfg {Object} [headerCfg] Component configuration that will be inserted at the top of this component.
     */
    headerCfg           : null,
    /**
     * @cfg {Boolean} [collapseOnBodyClick=true] Automatically collapse/hide this component if the user clicks anywhere on the document body (outside of this element).
     */
    /**
     * @cfg {String} [treeListCls="w-navdrawer-tree] The class to apply to the tree.
     */
    treeCls             : 'w-navdrawer-tree',
    /**
     * @cfg {String} [treeListCls="w-navdrawer-treebody] The class to apply to the tree body.
     */
    treeBodyCls         : 'w-navdrawer-treebody',
    /**
     * @cfg {Object} [treeCfg] Configuration object that will be applied to the treepanel.
     */
    treeCfg             : {},
    collapseOnBodyClick : true,
    clickListenerActive : false,
    clickListenerSet    : false,
    initComponent       : function () {
        var me = this;
        if (me.sliding) {
            Ext.apply(me, {
                x        : 0,
                cls      : 'w-navdrawer',
                floating : true,
                renderTo : me.renderTo || Ext.getBody(),
                shadow   : false,
                height   : Ext.getBody().getHeight()
            });
        } else {
            Ext.apply(me, {
                cls : 'w-navdrawer is-active'
            });
        }
        Ext.apply(me, {
            items : me.buildItems()
        });
        me.callParent(arguments);

        Ext.getBody().on({
            scope  : me,
            buffer : 200,
            resize : 'onResizeBody'
        });
    },

    buildColumns : function(){
        var me = this;
        return me.columns || [{
            xtype     : 'treecolumn',
            dataIndex : 'text',
            flex      : 1,
            renderer  : function(v,cell,rec){
                var icon  = rec.get('icon') + ' w-navdrawer-icon',
                    style = rec.get('style'),
                    s     = '<span class="{0}" style="{1}"></span>{2}';

                return Ext.String.format(s,icon,style,v);
            }
        }];
    },

    buildItems : function () {
        var me       = this,
            i        = [],
            navStore = (me.navItems) ? me.buildStore() : me.navStore;

        if (me.navIcon || me.title) {
            i.push({
                xtype : 'toolbar',
                cls   : 'w-navdrawer-header',
                items : []
            });
            if (me.navIcon) {
                i[0].items.push({
                    iconCls : 'vvicon-menu7',
                    ui      : 'plain',
                    scope   : me,
                    handler : me.onClickNavIcon
                });
            }
            if (me.title) {
                i[0].items.push({
                    xtype : 'tbtext',
                    cls   : 'w-navdrawer-title',
                    text  : me.title
                });
            }
        }

        if (me.headerCfg) {
            i.push(me.headerCfg);
        }

        i.push(Ext.apply(me.treeCfg,{
            xtype        : 'treepanel',
            flex         : 1,
            cls          : me.treeCls,
            bodyCls      : me.treeBodyCls,
            store        : navStore,
            rootVisible  : false,
            hideHeaders  : true,
            scrollable   : 'y',
            columns      : me.buildColumns(),
            listeners    : {
                scope     : me,
                cellclick : me.onCellClickTreeList
            }
        }));
        return i;
    },

    buildStore : function () {
        var me = this;
        return Ext.create('Ext.data.TreeStore', {
            root : {
                expanded : true,
                children : me.navItems
            }
        });
    },

    applyTitle : function (title) {
        return title;
    },

    /**
     * Hide the navdrawer.
     */
    hide : function () {
        var me = this;
        me.el.removeCls('is-active');
        if (me.maskBodyOnShow) {
            Ext.getBody().unmask();
        }
        me.clickListenerActive = false;
    },

    /**
     * Mimic the click of an item on the nav tree.
     * @param p {String/Numeric} Either the index number of the store record or the name of the event attached to the record.
     */
    mimicClick : function(p){
        var me  = this,
            tp  = me.down('treepanel'),
            str = tp.getStore(),
            rec;

        if (Ext.isNumber(p)){
            rec = str.getAt(p);
        } else if (Ext.isString(p)){
            rec = str.findRecord('event',p,0,false);
        }
        if (rec){
            tp.getSelectionModel().select(rec);
            me.fireEvent(rec.get('event'),rec);
        }
    },

    onBodyClick : function(e){
        var me = this;
        if (me.clickListenerActive && !e.within(me.el)){
            me.hide();
        }
    },

    onClickNavIcon : function () {
        var me = this;
        me.hide();
    },

    onCellClickTreeList : function (view, td, cellIndex,rec, tr, rowIndex, e) {
        var me       = this,
            leaf     = rec.isLeaf(),
            el       = Ext.get(e.getTarget()),
            elTarget = el.getAttribute('data-event'),
            event    = (leaf) ? rec.get('event') : null;

        if (elTarget){
            me.fireEvent(elTarget,rec);
        } else {
            if (event) {
                if (view.getSelection() !== rec) {
                    me.fireEvent(event, rec);
                }

                if (me.hideOnSelection) {
                    me.hide();
                }
            } else {
                me.clickListenerActive = false;
                rec[ rec.isExpanded() ? 'collapse' : 'expand']();
                setTimeout(function(){
                    me.clickListenerActive = true;
                },200);
            }
        }
    },

    onResizeBody : function(body,o){
        var me = this;
        me.setHeight(o.height);
    },

    /**
     * Show the navdrawer.
     */
    show : function () {
        var me = this;
        me.callParent(arguments);
        if (me.maskBodyOnShow) {
            Ext.getBody().mask();
            me.toFront();
        }
        me.el.addCls('is-active');

        if (me.collapseOnBodyClick && !me.clickListenerSet) {
            Ext.getBody().on({
                scope  : me,
                buffer : 150,
                click  : me.onBodyClick
            });
            me.clickListenerSet = true;
        }
        setTimeout(function(){
            me.clickListenerActive = true;
        },500);

    }
});