Ext.define('Ext.overrides.classic.toolbar.Paging', {
    override       : 'Ext.toolbar.Paging',
    enableDownload : true,
    cls            : 'x-toolbar-default x-paging-toolbar',
    getPagingItems : function () {
        var me             = this,
            lit            = Valence.lang.lit,
            downloadText   = (!Ext.isEmpty(lit)) ? lit.download : 'Download',
            originalLoad   = Ext.bind(me.onLoad, me),
            inputListeners = {
                scope : me,
                blur  : me.onPagingBlur
            },
            items          = [{
                itemId       : 'first',
                depth        : false,
                tooltip      : me.firstText,
                overflowText : me.firstText,
                iconCls      : Ext.baseCSSPrefix + 'tbar-page-first',
                disabled     : true,
                handler      : me.moveFirst,
                scope        : me
            }, {
                itemId       : 'prev',
                depth        : false,
                tooltip      : me.prevText,
                overflowText : me.prevText,
                iconCls      : Ext.baseCSSPrefix + 'tbar-page-prev',
                disabled     : true,
                handler      : me.movePrevious,
                scope        : me
            },
                '-',
                me.beforePageText,
                {
                    xtype           : 'numberfield',
                    itemId          : 'inputItem',
                    name            : 'inputItem',
                    cls             : Ext.baseCSSPrefix + 'tbar-page-number',
                    allowDecimals   : false,
                    minValue        : 1,
                    hideTrigger     : true,
                    enableKeyEvents : true,
                    keyNavEnabled   : false,
                    selectOnFocus   : true,
                    submitValue     : false,
                    // mark it as not a field so the form will not catch it when getting fields
                    isFormField     : false,
                    width           : me.inputItemWidth,
                    margin          : '-1 2 3 2',
                    listeners       : inputListeners
                }, {
                    xtype  : 'tbtext',
                    itemId : 'afterTextItem',
                    html   : Ext.String.format(me.afterPageText, 1)
                },
                '-',
                {
                    itemId       : 'next',
                    depth        : false,
                    tooltip      : me.nextText,
                    overflowText : me.nextText,
                    iconCls      : Ext.baseCSSPrefix + 'tbar-page-next',
                    disabled     : true,
                    handler      : me.moveNext,
                    scope        : me
                }, {
                    itemId       : 'last',
                    depth        : false,
                    tooltip      : me.lastText,
                    overflowText : me.lastText,
                    iconCls      : Ext.baseCSSPrefix + 'tbar-page-last',
                    disabled     : true,
                    handler      : me.moveLast,
                    scope        : me
                },
                '-',
                {
                    itemId       : 'refresh',
                    depth        : false,
                    tooltip      : me.refreshText,
                    overflowText : me.refreshText,
                    iconCls      : Ext.baseCSSPrefix + 'tbar-loading',
                    disabled     : me.store.isLoading(),
                    handler      : me.doRefresh,
                    scope        : me
                }];

        if (!Ext.isEmpty(me.store) && me.store.storeId !== 'ext-empty-store'){
            me.store.on({
                load : function(str){
                    var download = me.down('#download'),
                        store    = me.store;

                    if (!Ext.isEmpty(download) && !Ext.isEmpty(store)) {
                        if (store.getCount() === 0) {
                            download.disable();
                        } else {
                            download.enable();
                        }
                    }
                }
            })
        } else {
            //override onLoad method so we can enable/disable the download button
            //
            me.onLoad = Ext.bind(function(){
                var me = this;

                originalLoad();

                var download = me.down('#download'),
                    store    = me.store;
                if (!Ext.isEmpty(download) && !Ext.isEmpty(store)) {
                    if (store.getCount() === 0) {
                        download.disable();
                    } else {
                        download.enable();
                    }
                }
            },me);
        }

        inputListeners[Ext.supports.SpecialKeyDownRepeat ? 'keydown' : 'keypress'] = me.onPagingKeyDown;

        if (me.enableDownload) {
            items.push({
                xtype  : 'tbseparator',
                itemId : 'downloadSeparator'
            }, {
                itemId       : 'download',
                depth        : false,
                tooltip      : downloadText,
                overflowText : downloadText,
                iconCls      : 'vv-paging vvicon-download5',
                disabled     : (me.store.getCount() === 0),
                handler      : function (btn) {
                    var me   = this,
                        grid = me.up('grid');
                    if (!Ext.isEmpty(grid)) {
                        grid.fireEvent('download', grid, btn);
                    }
                },
                scope        : me
            });
        }

        return items;
    }
});