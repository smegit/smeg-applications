/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('OrderMaint.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',
    requires: [
        'OrderMaint.view.main.OrderView',
        'OrderMaint.view.main.PdfWindow',
        'OrderMaint.view.main.NoteForm',
        'Ext.container.Viewport'
    ],

    init: function (view) {
        var me = this,
            vm = me.getViewModel(),
            orderListStore = vm.getStore('orderList');
        console.info(vm);

        me.control({
            "#ordergrid": {
                //beforeitemclick: this.onFileGridBeforeItemClick,
                itemdblclick: me.onOrderGridItemDblClick
            },
            "#notegrid": {
                expand: me.onExpandNoteGrid,
                //headerclick: me.onHeaderClick
            }
        });
        // load order list
        // me.requestOrderList().then(function (res) {
        //     console.info(res);
        //     if (res.success) {
        //         orderListStore.loadData(res.Carts);
        //     }
        // }, function (res) {

        // });
    },

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },

    /*------------------------ Notes Event Region Start -----------------------------------*/
    onExpandNoteGrid: function (p) {
        console.info('onExpendNoteGrid');
        console.info(p);
        var me = this,
            view = me.getView(),
            activeTab = view.getActiveTab(),
            currOrderView = activeTab.down('orderView'),
            currOrderData = currOrderView.config.data,
            orderKey = currOrderData.CartHdr[0].OAORDKEY,
            noteGrid = currOrderView.down('expander-note'),
            isCollapsed = noteGrid.getCollapsed();
        console.info(isCollapsed);
        console.info(currOrderData);
        console.info(noteGrid);
        noteGrid.mask();
        me.requestNotes(orderKey).then(function (res) {
            console.info(res);

            noteGrid.unmask();
            noteGrid.setStore({
                data: res.notes
            });
            Ext.apply(noteGrid, {
                emailDefaults: res.emailDefaults,
                noteActions: res.noteActions,
                noteTypes: res.noteTypes,
                orderKey: orderKey
            });
            noteGrid.setData(res.emailDefaults);

            // noteActions: res.noteActions,
            // noteTypes: res.noteTypes
            activeTab.scrollBy(999999, 999999, true);
            //activeTab.scrollTo(100, 100, true);
        }, function (res) {
            console.info(res);
        });
    },
    onAddNote: function (btn, evt, three) {
        console.info('onAddNote called');
        var me = this,
            noteGrid = btn.up('expander-note');
        console.info(btn);
        console.info(evt);
        console.info(noteGrid);

        Ext.create('Ext.window.Window', {
            //title: 'Coming soon',
            height: '80%',
            width: '70%',
            modal: true,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'noteForm',
                noteOptions: {
                    emailDefaults: noteGrid.emailDefaults,
                    noteActions: noteGrid.noteActions,
                    noteTypes: noteGrid.noteTypes
                },
                orderKey: noteGrid.orderKey
                // noteOpton
                // border: false,
                // columns: [{ header: 'Hello World' }],                 // One header just for show. There's no data,
                // store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
            }
        }).show();

    },
    onSaveClick: function (btn, evt) {
        console.info('onSaveClick called');
        console.info(btn);
        console.info(evt);
        var me = this,
            view = me.getView(),
            activeTab = view.getActiveTab(),
            currOrderView = activeTab.down('orderView'),
            currOrderData = currOrderView.config.data,
            orderKey = currOrderData.CartHdr[0].OAORDKEY,
            noteGrid = currOrderView.down('expander-note'),
            noteGridStore = noteGrid.getStore(),
            noteForm = btn.up('noteForm'),
            noteWindow = noteForm.up('window'),
            noteFormValues = noteForm.getValues();
        console.info(noteForm);
        console.info(noteWindow);
        console.info(noteFormValues);
        console.info(noteGridStore);

        if (noteForm.isValid()) {
            console.info('good form');
            noteWindow.mask('Saving note......');
            me.postNote(noteFormValues).then(
                function (res) {
                    noteWindow.unmask();
                    noteWindow.close();
                    if (res.success) {
                        // reload note grid
                        me.onExpandNoteGrid();
                        //Ext.Msg.alert('Note', 'Note saved successfully.');
                        Ext.toast({
                            html: 'Note saved successfully',
                            closable: false,
                            align: 't',
                            slideInDuration: 400,
                            minWidth: 400
                        });

                    } else {
                        Ext.Msg.alert('Error', 'Failed to saved your note.');
                    }
                    console.info(res);

                },
                function (res) {
                    Ext.Msg.alert('Error', 'Failed to saved your note.');
                    console.info(res);
                }
            );
        }
    },

    onSearchNotes: function (btn, evt) {
        console.info('onSearchNotes called');
        console.info(btn);
        console.info(evt);
        var me = this,
            view = me.getView(),
            activeTab = view.getActiveTab(),
            currOrderView = activeTab.down('orderView'),
            currOrderData = currOrderView.config.data,
            orderKey = currOrderData.CartHdr[0].OAORDKEY,
            noteGrid = currOrderView.down('expander-note'),
            noteGridStore = noteGrid.getStore(),
            searchString = noteGrid.down('#searchFieldId').getValue();
        console.info(searchString);
        console.info(noteGrid.down('textfield'));
        noteGridStore.filter([
            {
                property: 'OFNOTE',
                value: searchString,
                anyMatch: true,
                caseSensitive: false
            },
        ])

    },

    onEnterKeyPressed: function (field, e) {
        // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
        // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
        var me = this;
        console.info('onEnterKeyPressed called');
        if (e.getKey() == e.ENTER) {
            me.onSearchNotes();
        }
    },

    onKeyup: function (field, e) {
        console.info(field);
        var me = this;
        if (field.getValue() == '') {
            me.onSearchNotes();
        }
    },

    /*------------------------ Notes Event Region End -----------------------------------*/

    onOrderGridItemDblClick: function (grid, record, item, index, e) {
        console.info('onOrderGridItemDblClick called');
        console.info(grid);
        console.info(record);
        console.info(item);
        console.info(index);
        console.info(e);

        console.info(record.get('OAORDKEY'));
        var me = this,
            orderKey = record.get('OAORDKEY'),
            tabPanel = me.getView();
        // tabPanel = me.lookupReference('tabpanel');

        grid.mask();
        console.info(tabPanel);
        me.requestCartDetail(orderKey).then(
            function (res) {
                console.info(res);

                // Add tab
                var tab = tabPanel.add({
                    title: orderKey,
                    //html: 'This is tab 123',
                    scrollable: true,
                    closable: true,
                    orderKey: orderKey,
                    items: [{
                        xtype: 'orderView',
                        data: res,
                        orderKey: orderKey,
                    }]
                });
                tabPanel.setActiveTab(tab);
                console.info(tab);
                grid.unmask();

            },
            function () {
                console.info(res);
            }
        );

    },
    getPDF: function (button, evt) {
        console.info('getPDF called');
        // console.info(button);
        // console.info(evt);
        // console.info(button.up('orderView'));
        var me = this,
            view = me.getView(),
            activeTab = view.getActiveTab(),
            currOrderView = activeTab.down('orderView'),
            currOrderData = currOrderView.config.data,
            orderKey = currOrderData.CartHdr[0].OAORDKEY;
        me.requestPDF(orderKey).then(function (res) {
            console.info(res);
            //var iframeSource = '<iframe src="' + res.printURL + '" width="100%" height="100%" >This is iframe</iframe>';
            var iframeSource = '<iframe src="' + '/Product/Temp/ORD12357684C.pdf' + '" width="100%" height="100%" >This is iframe</iframe>';

            console.info(iframeSource);
            console.info(view);
            // view.add({
            //     xtype: 'panel',
            //     //html: iframeSource,
            //     modal: true,
            //     height: 700,
            //     width: '50%',
            //     centered: true,
            //     //layout: 'fit',
            //     //orderData: orderData,
            //     //html: iframeSource
            //     items: [{
            //         xtype: 'component',
            //         cls: 'pdf-cmp',
            //         //html: '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>',
            //         html: iframeSource
            //     },]
            // }).show();
            view.add({
                xtype: 'window',
                title: 'Order ' + res.OAORDKEY,
                height: '80%',
                width: '60%',
                //layout: 'fit',
                modal: true,
                html: iframeSource,
                orderKey: res.OAORDKEY,
                bbar: [
                    '->',
                    {
                        xtype: 'button', text: 'Close', handler: function (cmp) {
                            cmp.up('window').close();
                        }
                    },
                    { xtype: 'button', text: 'Email', handler: 'onEmail' },
                    '->'
                ]
                // items: {  // Let's put an empty grid in just to illustrate fit layout
                //     xtype: 'grid',
                //     border: false,
                //     columns: [{ header: 'World' }],                 // One header just for show. There's no data,
                //     store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
                // }
            }).show();

        }, function (res) {
            console.info(res);
        });
    },

    // Event Listeners
    onEmail: function (cmp, two) {
        console.info('onEmail');
        console.info(cmp);
        console.info(two);
        var me = this,
            view = me.getView(),
            pdfWindow = cmp.up('window'),
            activeTab = view.getActiveTab(),
            currOrderView = activeTab.down('orderView'),
            currOrderData = currOrderView.config.data;
        console.info(pdfWindow);
        console.info(view);
        console.info(activeTab.down('orderView'));
        Ext.create('Ext.window.Window', {
            title: 'Send',
            //height: 200,
            width: 400,
            modal: true,
            layout: 'fit',
            // items: {  // Let's put an empty grid in just to illustrate fit layout
            //     xtype: 'grid',
            //     border: false,
            //     columns: [{ header: 'World' }],                 // One header just for show. There's no data,
            //     store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store
            // },
            items: [{
                xtype: 'form',
                //closable: true,
                reference: 'sendFormRef',
                centered: true,
                //width: 500,
                viewModel: 'cart',
                bodyPadding: '16 32 16 32',
                modal: true,
                defaultType: 'textfield',
                items: [
                    {
                        //xtype: 'textfield',
                        name: 'SAORDKEY',
                        fieldLabel: 'Order Key:',
                        value: currOrderData.CartHdr[0].OAORDKEY,
                        //hidden: true
                    },
                    {
                        fieldLabel: 'To',
                        name: 'to',
                        vtype: 'email',
                        value: currOrderData.CartHdr[0].OACSTEML
                    },
                    {
                        fieldLabel: 'Cc',
                        name: 'cc',
                        vtype: 'email'
                    },
                    {
                        //xtype: 'textfield',
                        name: 'subject',
                        fieldLabel: 'Subject:',
                        //value: 'Smeg Quote ' + vm.get('quoteKey'),
                    },
                    {
                        xtype: 'textareafield',
                        fieldLabel: 'Message:',
                        maxRows: 8,
                        name: 'message'
                    },]
            }],
            bbar: [
                '->',
                {
                    text: 'Cancel',
                    //ui: 'forward',

                    handler: function (cmp) {
                        console.info('close called');
                        console.info(cmp);
                        cmp.up('window').close();
                    }
                },
                { xtype: 'button', text: 'Send', handler: 'onSend' },
                '->'
            ]
        }).show();
    },

    onSend: function () {
        console.info('onSend called');
    },

    // services to back-end calls
    requestOrderList: function () {
        console.info('requestOrderList called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1050',
            action: 'getCarts'
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'GET',
            params: params,
            success: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.resolve(response);
            },
            failure: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.reject(response);
            }
        });
        return deferred.promise;
    },

    // get cart details
    requestCartDetail: function (orderKey) {
        console.info('requestCartDetail called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1050',
            action: 'getCartDetails',
            OAORDKEY: orderKey
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'GET',
            params: params,
            success: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.resolve(response);
            },
            failure: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.reject(response);
            }
        });
        return deferred.promise;
    },

    // get pdf
    requestPDF: function (orderKey) {
        console.info('requestCartDetail called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1050',
            action: 'getPDF',
            OAORDKEY: orderKey
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'GET',
            params: params,
            success: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.resolve(response);
            },
            failure: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.reject(response);
            }
        });
        return deferred.promise;
    },

    // get notes
    requestNotes: function (orderKey) {
        console.info('requestNote called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1050',
            action: 'getNotes',
            OAORDKEY: orderKey
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'GET',
            params: params,
            success: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.resolve(response);
            },
            failure: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.reject(response);
            }
        });
        return deferred.promise;
    },

    // Post Note
    postNote: function (formData) {
        console.info('postNote called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC1050',
            action: 'saveNote',
            // OAORDKEY: orderKey
        };
        Ext.apply(params, formData);
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'POST',
            params: params,
            success: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.resolve(response);
            },
            failure: function (res) {
                var response = Ext.decode(res.responseText);
                deferred.reject(response);
            }
        });
        return deferred.promise;
    },



});
