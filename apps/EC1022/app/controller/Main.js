Ext.define('EC1022.controller.Main', {
    extend: 'Ext.app.Controller',

    onFileGridBeforeItemClick: function(dataview, record, item, index, e, eOpts) {
        var me = this,
            el = Ext.get(e.getTarget()),
            moreIcon = 'vvicon-more',
            showMenu = el.hasCls(moreIcon) || el.parent().hasCls(moreIcon);

        me.rec = record;

        if (showMenu) {
            var xy = e.getXY();
            xy[1] += 10;
            Ext.ComponentQuery.query('#filegrid')[0].rec = record;
            Ext.create('EC1022.view.ContextMenu').showAt(xy);
            return false;
        }
    },

    onFileGridItemDblClick: function(dataview, record, item, index, e, eOpts) {
        Ext.create('EC1022.view.EditWindow', {
            mode: 'edit',
            renderTo: Ext.getBody(),
            rec: record,
            title: 'Salesperson Information'
        }).show();
    },

    onContextMenuEditClick: function(item, e, eOpts) {
        var record = Ext.ComponentQuery.query('#filegrid')[0].rec;

        Ext.create('EC1022.view.EditWindow', {
            mode: 'edit',
            renderTo: Ext.getBody(),
            rec: record,
            title: 'Salesperson Information'
        }).show();
    },

    onContextMenuCopyClick: function(item, e, eOpts) {
        var record = Ext.ComponentQuery.query('#filegrid')[0].rec;

        Ext.create('EC1022.view.EditWindow', {
            mode: 'copy',
            renderTo: Ext.getBody(),
            rec: record,
            title: 'Salesperson Information'
        }).show();
    },

    onContextMenuHide: function(component, eOpts) {
        Ext.destroy(component);
    },

    onAddButtonClick: function(button, e, eOpts) {
        Ext.create('EC1022.view.EditWindow', {
            mode: 'add',
            renderTo: Ext.getBody(),
            title: 'Salesperson Information'
        }).show();
    },

    onSearchKeydown: function(textfield, e, eOpts) {
        if (e.getKey()==e.ENTER) {
            Ext.getStore('Main').getProxy().extraParams.search = Valence.util.Helper.encodeUTF16(textfield.getValue());
            Ext.ComponentQuery.query('#filegrid #pagingtoolbar')[0].getStore().loadPage(1);
        }

    },

    onSearchAfterRender: function(component, eOpts) {
        component.onTriggerClick = function() {
            component.setValue('');
            Ext.getStore('Main').getProxy().extraParams.search = '';
            Ext.ComponentQuery.query('#filegrid #pagingtoolbar')[0].getStore().loadPage(1);
        };
    },

    onDownloadButtonClick: function(button, e, eOpts) {
        // create a blank object for params
        var d = {
            download: true
        };

        // get the store
        var mainstore = Ext.ComponentQuery.query('#filegrid')[0].getStore();

        // apply parms from the last call to the store
        Ext.apply(d, mainstore.lastOptions.params);

        // apply the default extraparms
        Ext.apply(d, mainstore.getProxy().extraParams);

        // apply paging toolbar parms
        d.page = mainstore.lastOptions.page;
        d.start = mainstore.lastOptions.start;
        d.limit = mainstore.lastOptions.limit;

        // apply sorters
        d.sort = [];
        if (!Ext.isEmpty(mainstore.lastOptions.sorters)){
            d.sort[0] = {
                direction: mainstore.lastOptions.sorters[0].getDirection(),
                 property: mainstore.lastOptions.sorters[0].getProperty()
            };
            d.sort = Ext.encode(d.sort);
        }

        // add the download parm
        d.download = true;

        // call the download
        Valence.util.Helper.download(d);
    },

    init: function(application) {
        this.control({
            "#filegrid": {
                beforeitemclick: this.onFileGridBeforeItemClick,
                itemdblclick: this.onFileGridItemDblClick
            },
            "#contextmenuedit": {
                click: this.onContextMenuEditClick
            },
            "#contextmenucopy": {
                click: this.onContextMenuCopyClick
            },
            "#contextmenu": {
                hide: this.onContextMenuHide
            },
            "#addbutton": {
                click: this.onAddButtonClick
            },
            "#search": {
                keydown: this.onSearchKeydown,
                afterrender: this.onSearchAfterRender
            },
            "#downloadbutton": {
                click: this.onDownloadButtonClick
            }
        });
    }

});