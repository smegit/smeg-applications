Ext.define('Showroom.view.cart.CartController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cart',

    requires: [
        // 'Ext.form.*',
        // 'Ext.Button.*'
        'Valence.mobile.InAppBrowser',
        //'Ext.ux.PdfViewer',
        'Ext.XTemplate',
        //'Showroom.view.pdf.panel.PDF'
    ],

    init: function (view) {
        // We provide the updater for the activeState config of our View.
        //view.updateActiveState = this.updateActiveState.bind(this);
        console.info(view);
        var me = this,
            vm = me.getViewModel();
        console.info(vm);
        vm.notify();


        var imgColumn = view.down('grid').getColumns()[0];
        // imgColumn.setRenderer(function () {
        //     return '<img src="/Product/Images/CPRA115N_200x200.jpg" />';
        // });
        console.info(imgColumn);
        //var padElement = Ext.get('touchpad');
        //console.info(padElement);
        //Ext.Msg.alert('padElement', JSON.stringify(padElement), Ext.emptyFn);

        view.on({
            click: function (e) {
                console.info('tap event');
                console.info(e);
            }
        });


        // var panel = Ext.create('Showroom.view.pdf.panel.PDF', {
        //     src: 'testpdf.pdf',
        //     pageScale: 1.25,
        // });

        // Ext.Viewport.add(panel);
    },

    onAddToCart: function (content) {
        var me = this,
            vm = me.getViewModel(),
            selectedProdsStore = vm.getStore('selectedProds'),
            rec = content.getData(),
            payload = {};
        console.info('onAddToCart called');
        console.info(content.getData());
        // Ext.toast({
        //     message: 'Product selected.'
        // });

        // Trim Record 
        delete rec.ATTRIBS;
        delete rec.id
        Ext.apply(rec, {
            SBQTYO: 1,
        });

        payload = {
            SBITM: rec.MODEL,
            SBQTYO: 1,
            SBUPRC: rec.PRICE,
            I1IDSC: rec.PRODDESC,
            SMALLPIC: rec.SMALLPIC,
            addBtnClass: rec.addBtnClass,
            addBtnText: rec.addBtnText
        };
        console.info(rec);
        console.info(payload);
        //selectedProdsStore.loadRawData(rec, true);
        selectedProdsStore.loadRawData(payload, true);
        console.info(selectedProdsStore);
        //vm.notify();




    },

    onRemoveFromCart: function (content) {
        console.info('onRemoveFromCart called');
        var me = this,
            vm = me.getViewModel(),
            selectedProdsStore = vm.getStore('selectedProds'),
            rec = content.getData(),
            findRecord = selectedProdsStore.findRecord('SBITM', rec.MODEL, 0, false, false, true);

        // looking up rec in store
        console.info(findRecord);
        if (findRecord) {
            // if (findRecord.getData().QUANTY > 1) {
            //     findRecord.set('QUANTY', findRecord.getData().QUANTY - 1)
            // } else {
            selectedProdsStore.remove(findRecord);
            //}
        }
        // Ext.toast({
        //     message: 'Product removed.'
        // });
    },

    onDeleteRecord: function (btn) {
        console.info('onDeleteRecord called');
        var me = this,
            vm = me.getViewModel(),
            selectedProdsStore = vm.getStore('selectedProds'),
            cell = btn.getParent(),
            record = cell.getRecord();
        console.info(record);


        Ext.Msg.confirm('Confirmation', 'Are you sure you want to delete ' + record.get('SBITM') + '?', function (res) {
            console.info(1)
            console.info(res);
            if (res == 'yes') {
                if (record) {
                    var findRecord = selectedProdsStore.findRecord('SBITM', record.getData().SBITM, 0, false, false, true);
                    selectedProdsStore.remove(findRecord);

                    var prodDv = Ext.ComponentQuery.query('#prodDv');

                    // Change product dataview which has been deleted
                    console.info(prodDv);

                    var catView = Ext.ComponentQuery.query('category')[0],
                        catVm = catView.getViewModel(),
                        prodStore = catVm.getStore('products'),
                        findRecordInProds = prodStore.findRecord('SBITM', record.getData().SBITM, 0, false, false, true);
                    if (findRecordInProds) {
                        findRecordInProds.set('addBtnClass', 'dv-prod-btn-deSelected');
                        findRecordInProds.set('addBtnText', 'Select');
                    }
                    console.info(catView);
                    console.info(catVm);
                    console.info(prodStore);
                    //prodDv.getViewItems();

                }
            }
        });


        //Ext.Msg.alert('Delete', info.record.get('name'));



    },

    /**
     * onAfterRenderAddressSearch - setup the google address lookup fields
     * @param cmp
     */
    onAfterRenderAddressSearch: function (cmp) {
        console.log('onAfterRenderAddress called');
        var me = this,
            input = cmp.el.down('input');

        console.info(Ext.os);
        if (Ext.os.deviceType == "Desktop") {
            //google api auto places a place holder on the element. Stop it by adding the attribute
            //
            //input.dom.placeholder = 'Street';

            cmp.googleAutoComplete = new google.maps.places.Autocomplete(
                document.getElementById(input['id']),
                { types: ['geocode', 'establishment'] });

            //limit auto complete to Australia
            //
            cmp.googleAutoComplete.setComponentRestrictions({
                country: ['au']
            });

            //console.info(cmp.googleAutoComplete);
            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            cmp.googleAutoComplete.addListener('place_changed', Ext.bind(me.autoFillAddress, me, [cmp]));
            //console.info('end');

        }

    },

    // onSearchAddressTap
    onSearchAddressTap: function (cmp) {
        console.info('onSearchAddressTap called');
        var me = this,
            vm = me.getViewModel(),
            addressSuggestionStore = vm.getStore('addressSuggestion'),
            addressSuggestionList = Ext.ComponentQuery.query('#addressSuggestionList'),
            input = cmp.el.down('input');
        console.info(addressSuggestionStore);
        console.info(Ext.Element.get('searchAddressField'));
        console.info(Ext.ComponentQuery.query('#addressSuggestionList'));


        // cmp.googleAutoComplete = new google.maps.places.Autocomplete(
        //     document.getElementById(input['id']),
        //     { types: ['geocode', 'establishment'] });

        // //limit auto complete to Australia
        // //
        // cmp.googleAutoComplete.setComponentRestrictions({
        //     country: ['au']
        // });

        // setTimeout(function () {

        //     var addressPredictions = cmp.googleAutoComplete.gm_accessors_.place.Yc.predictions;
        //     console.info(addressPredictions);
        //     addressSuggestionStore.loadRawData(addressPredictions);
        // }, 500);

        console.info(cmp.getValue().length);
        if (cmp.getValue().length > 0) {
            autocompleteService = new google.maps.places.AutocompleteService();

            autocompleteService.getPlacePredictions({
                input: cmp.getValue(),
                componentRestrictions: { country: ['au'] },
                types: ['establishment', 'geocode']
            }, function (res) {
                console.info(res);
                addressSuggestionStore.loadRawData(res);

                console.info(cmp);
                console.info(Ext.os);
                console.info(Ext.getBody().getViewSize());
                console.info(Ext.browser);
                console.info(addressSuggestionList);
                //addressSuggestionList[0].destroy();
                if (addressSuggestionList.length == 0) {
                    Ext.create('Ext.List', {
                        // fullscreen: true,
                        id: 'addressSuggestionList',
                        itemTpl: '<div class="contact">{description}</div>',
                        store: addressSuggestionStore,
                        grouped: true,
                        floated: true,
                        centered: true,
                        //relative: true,
                        //draggable: true,
                        //renderTo: Ext.Element.get('#addressSuggestionContainer'),
                        //style: 'transform: translate3d(352px, 639px, 0px)',
                        listeners: {
                            beforeshow: function (panel) {
                                console.info('beforeshow called');
                                //panel.setPosition(100, 300);
                                var w = Ext.getBody().getViewSize().height * 0.35 + 'px', h = Ext.getBody().getViewSize().width * 0.4 + 'px';
                                //panel.setStyle('transform: translate3d(521px, 645.6px, 0px)');
                                panel.setStyle('transform: translate3d(' + w + ',' + h + ',' + '0px)');
                            },
                            scope: me,
                            select: me.onSelectAddress,
                            //select: google.maps.event.trigger(cmp.googleAutoComplete, 'place_changed')
                        }
                    }).show();
                } else {
                    addressSuggestionList[0].show();
                }

            });
        }
        else {
            if (addressSuggestionList.length == 1) {
                addressSuggestionList[0].destroy();
            }
        }


        // addressSuggestionStore.removeAll();


        // Ext.define('myAjax', {
        //     extend: 'Ext.data.Connection',
        //     singleton: true,
        //     constructor: function (config) {
        //         console.info(config);
        //         this.callParent([config]);
        //         this.on("beforerequest", function () {
        //             console.info("beforerequest");
        //         });
        //         this.on("requestcomplete", function () {
        //             console.info("requestcomplete");
        //         });
        //     }
        // });
        // myAjax.request({
        //     url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Vict&types=geocode&language=fr&key=AIzaSyAP1Z_ggiJaruZq9H99emnWJyNHVud8now',
        //     //url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=123&key=AIzaSyAP1Z_ggiJaruZq9H99emnWJyNHVud8now&libraries=places',
        //     method: 'GET',
        //     params: {},
        //     success: function (res) {
        //         var response = Ext.decode(res.responseText);
        //         console.info(response)
        //         //deferred.resolve(response);
        //     },
        //     failure: function (res) {
        //         var response = Ext.decode(res.responseText);
        //         //deferred.reject(response);
        //     }
        // });



    },

    onSelectAddress: function (list, record) {
        console.info('onSelectAddress called');
        console.info(list);
        console.info(record);
        var me = this,
            view = me.getView(),
            addressField = Ext.ComponentQuery.query('#searchAddressField')[0],
            placeService = new google.maps.places.PlacesService(document.getElementById('searchAddressDisplay')),
            requestObj = { placeId: record.get('place_id') },
            street_number, route, suburb, state, postal_code;
        console.info(document.getElementsByClassName('x-input-body-el')[12]);
        console.info(record.get('place_id'));
        //document.getElementById(input['id'])

        placeService.getDetails(requestObj, function (PlaceResult, PlacesServiceStatus) {
            console.info(PlaceResult);
            console.info(PlacesServiceStatus);
            PlaceResult.address_components.forEach(function (e) {
                console.info(e);

                // get street number
                if (e.types.includes('street_number')) {
                    street_number = e.long_name;
                }
                // get street name
                if (e.types.includes('route')) {
                    route = e.long_name;
                }
                // get suburb
                if (e.types.includes('locality')) {
                    suburb = e.long_name;
                }
                // get state
                if (e.types.includes('administrative_area_level_1')) {
                    state = e.short_name;
                }
                // get postal code
                if (e.types.includes('postal_code')) {
                    postal_code = e.long_name;
                }
                // get country
                if (e.types.includes('country')) {
                    country = e.long_name;
                }
            });
            addressField.setValue(street_number + ' ' + route);

            view.down('fieldset').down('[name=SACSTST1]').setValue(street_number + ' ' + route);
            view.down('fieldset').down('[name=SACSTCTY]').setValue(suburb);
            view.down('fieldset').down('[name=SACSTSTA]').setValue(state);
            view.down('fieldset').down('[name=SACSTPST]').setValue(postal_code);
            view.down('fieldset').down('[name=SACSTCOU]').setValue(country);


        });
        list.destroy();
        //me.autoFillAddress(addressField);
    },
    onSearchAddressBlur: function () {
        var addressSuggestionList = Ext.ComponentQuery.query('#addressSuggestionList');

        if (addressSuggestionList.length == 1) {
            addressSuggestionList[0].hide(true);
        }

    },
    autoFillAddress: function (cmp) {
        console.info('autoFillAddress called');
        console.info(cmp);
        var me = this,
            view = me.getView(),
            place = cmp.googleAutoComplete.getPlace(),
            street_number, route, suburb, state, postal_code;
        console.info(place);


        place.address_components.forEach(function (e) {
            console.info(e);

            // get street number
            if (e.types.includes('street_number')) {
                street_number = e.long_name;
            }
            // get street name
            if (e.types.includes('route')) {
                route = e.long_name;
            }
            // get suburb
            if (e.types.includes('locality')) {
                suburb = e.long_name;
            }
            // get state
            if (e.types.includes('administrative_area_level_1')) {
                state = e.short_name;
            }
            // get postal code
            if (e.types.includes('postal_code')) {
                postal_code = e.long_name;
            }
            // get country
            if (e.types.includes('country')) {
                country = e.long_name;
            }
        });


        //console.info(`${street_number} ${route} ${suburb} ${state} ${postal_code} `)

        //var street = place.address_components
        console.info(view.down('fieldset').down('[name=SACSTST1]'));
        view.down('fieldset').down('[name=SACSTST1]').setValue(street_number + ' ' + route);
        view.down('fieldset').down('[name=SACSTCTY]').setValue(suburb);
        view.down('fieldset').down('[name=SACSTSTA]').setValue(state);
        view.down('fieldset').down('[name=SACSTPST]').setValue(postal_code);
        view.down('fieldset').down('[name=SACSTCOU]').setValue(country);
    },

    onClearAddr: function () {
        console.info('onClearAddr called');
        var me = this,
            view = me.getView();
        //view.down('fieldset').down('[name=address]').reset();
        view.down('fieldset').down('[name=SACSTCTY]').reset();
        view.down('fieldset').down('[name=SACSTSTA]').reset();
        view.down('fieldset').down('[name=SACSTPST]').reset();
        view.down('fieldset').down('[name=SACSTCOU]').reset();

    },


    onSelectedDataChanged: function (store) {
        console.info('onSelectedDataChanged called');
        console.info(store);
        console.info(store.getCount());
        var me = this,
            qouteListTab = Ext.ComponentQuery.query('app-main')[0].down('#QouteList');

        if (store.getCount() > 0) {
            // disable list
            console.info(Ext.ComponentQuery.query('app-main')[0].down('#QouteList'));
            qouteListTab.setDisabled(true);
            //Ext.ComponentQuery.query('app-main')[0].down('#QouteList').setDisabled(true);

        } else {
            qouteListTab.setDisabled(false);
            //Ext.ComponentQuery.query('app-main')[0].down('#QouteList').setDisabled(false)
        }
    },
    onSave: function (one, two) {
        console.info('onSave called');
        console.info(one);
        console.info(two);
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            custInfoForm = me.lookupReference('custInfoFormRef'),
            custInfoValues = custInfoForm.getValues(),
            selectedProdsStore = vm.getStore('selectedProds'),
            selectedCount = selectedProdsStore.getCount(),
            tabPanel = Ext.ComponentQuery.query('app-main')[0],
            selectedArray = [],
            inputName = custInfoValues.SACSTNAM,
            toEmail = custInfoValues.SACSTEML;

        console.info(custInfoForm.getValues());

        if (inputName.length == 0) {
            Ext.Msg.alert('Message', 'Please fill in your name.', Ext.emptyFn);
            return false;
        }




        console.info(view);
        if (selectedCount > 0) {
            console.info('starting loading mask');
            view.setMasked({
                xtype: 'loadmask',
                message: 'Saving......'
            });
            // Constract selectedArray[]
            for (var i = 0; i < selectedProdsStore.getCount(); i++) {
                var p = selectedProdsStore.getAt(i).getData();
                selectedArray.push({
                    SBITM: p.SBITM,
                    //PRICEOLD: p.PRICEOLD,
                    SBUPRC: p.SBUPRC,
                    //PRODGROUP: p.PRODGROUP,
                    SBQTYO: p.SBQTYO
                });
                console.info(selectedProdsStore.getAt(i).getData());
            }
            console.info(selectedArray);

            me.requestSave(custInfoValues, JSON.stringify(selectedArray)).then(function (res) {
                console.info(res);
                if (res.success) {
                    var link = res.printURL,
                        //htmlIframe = '<iframe src="/Product/ORD20000504.pdf" width="100%" height="100%" >This is iframe</iframe>';
                        htmlIframe = '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>';
                    //"<img draggable='true' onerror='this.src=\"/Product/Images/FAB10HLR_200x200.jpg\"' src={SMALLPIC} />"

                    // if (Ext.os.deviceType == "Desktop") {
                    // Ext.Viewport.add({
                    //     xtype: 'panel',
                    //     reference: 'pdfPanelRef',
                    //     id: 'qoutePdfPanelId',
                    //     closable: true,
                    //     hideOnMaskTap: true,
                    //     showAnimation: {
                    //         type: 'pop',
                    //         // duration: 250,
                    //         // easing: 'ease-out'
                    //     },
                    //     modal: true,
                    //     centered: true,
                    //     width: '80%',
                    //     height: 700,
                    //     layout: 'fit',
                    //     title: 'Quote ' + res.SAORDKEY,
                    //     layout: {
                    //         type: 'vbox'
                    //     },
                    //     items: [{
                    //         xtype: 'component',
                    //         cls: 'pdf-cmp',
                    //         //html: '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>',
                    //         html: htmlIframe
                    //     },

                    //     {
                    //         xtype: 'container',
                    //         //height: '10%',
                    //         cls: 'footer-container',
                    //         defaults: {
                    //             xtype: 'button',
                    //             style: 'margin: 5px',
                    //             //flex: 1
                    //         },
                    //         layout: {
                    //             type: 'hbox'
                    //         },
                    //         items: [
                    //             {
                    //                 xtype: 'spacer'
                    //             },
                    //             {
                    //                 text: 'Close',
                    //                 ui: 'forward',

                    //                 handler: function (cmp) {
                    //                     console.info('close called');
                    //                     console.info(cmp);
                    //                     cmp.up('panel').close();
                    //                 }
                    //             },
                    //             {
                    //                 text: 'Email',
                    //                 ui: 'grey',
                    //                 // //handler: 'onEmail',
                    //                 scope: me,
                    //                 handler: me.onEmail
                    //             },
                    //         ]
                    //     }
                    //     ],
                    // }).show();


                    // Ext.Viewport.add({
                    //     xtype: 'panel',
                    //     closable: true,
                    //     hideOnMaskTap: true,
                    //     showAnimation: {
                    //         type: 'pop',
                    //         // duration: 250,
                    //         // easing: 'ease-out'
                    //     },
                    //     modal: true,
                    //     centered: true,
                    //     width: '80%',
                    //     height: 700,
                    //     layout: 'fit',
                    //     title: 'Quote ' + res.SAORDKEY,
                    //     layout: {
                    //         type: 'vbox'
                    //     },
                    //     items: [
                    //         {
                    //             title: 'Viewer',
                    //             xtype: 'PdfViewerPdfPanel',
                    //             layout: 'fit',
                    //             src: '/data/sample2.pdf'
                    //             //cls: 'pdf-cmp',
                    //             //html: '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>',

                    //         },
                    //         {
                    //             xtype: 'container',
                    //             //height: '10%',
                    //             cls: 'footer-container',
                    //             defaults: {
                    //                 xtype: 'button',
                    //                 style: 'margin: 5px',
                    //                 //flex: 1
                    //             },
                    //             layout: {
                    //                 type: 'hbox'
                    //             },
                    //             items: [
                    //                 {
                    //                     xtype: 'spacer'
                    //                 },
                    //                 {
                    //                     text: 'Close',
                    //                     ui: 'forward',

                    //                     handler: function (cmp) {
                    //                         console.info('close called');
                    //                         console.info(cmp);
                    //                         cmp.up('panel').close();
                    //                     }
                    //                 },
                    //                 {
                    //                     text: 'Email',
                    //                     ui: 'grey',
                    //                     // //handler: 'onEmail',
                    //                     scope: me,
                    //                     handler: me.onEmail
                    //                 },
                    //             ]
                    //         }
                    //     ]
                    // }).show();



                    // Ext.create('Showroom.view.pdf.panel.PDF', {
                    //     title: 'PDF Panel',
                    //     width: 600,
                    //     height: 500,
                    //     pageScale: 1.25,
                    //     src: 'testpdf.pdf',
                    //     renderTo: Ext.getBody()
                    // });
                    // update Order Key
                    //custInfoForm.down('[name=SAORDKEY]').setValue(res.SAORDKEY);

                    //     vm.set('quoteKey', res.SAORDKEY);
                    //     vm.set('printURL', res.printURL);
                    //     vm.set('toEmail', toEmail);

                    //     console.info(vm.get('quoteKey'));
                    //     console.info(vm.get('printURL'));
                    //     console.info(vm.get('toEmail'));
                    // } else {

                    // var msgBox = Ext.create('Ext.Msg', {
                    //     title: 'Note',
                    //     message: 'Your qoute has been generated. You can: ',
                    //     width: 300,
                    //     modal: false,
                    //     //zIndex: 17000,
                    //     buttons: [
                    //         {
                    //             text: 'Email',
                    //             itemId: 'email',
                    //             scope: me,
                    //             handler: me.onEmail
                    //         },
                    //         { text: 'Print', itemId: 'print' },
                    //         { text: 'Close', itemId: 'close' },
                    //     ],
                    // });


                    // Ext.create('Showroom.view.pdf.panel.PDF', {
                    //     title: 'PDF Panel',
                    //     width: 600,
                    //     height: 500,
                    //     pageScale: 1.25,
                    //     src: 'testpdf.pdf',
                    //     renderTo: Ext.getBody()
                    // });

                    Ext.Viewport.add({
                        xtype: 'panel',
                        title: 'Note',
                        id: 'notePanel',
                        message: 'Your qoute has been generated. You can: ',
                        width: 300,
                        height: 200,
                        modal: true,
                        centered: true,
                        items: [
                            {
                                xtype: 'component',
                                id: 'noteMsgCmp',
                                //cls: 'pdf-cmp',
                                //html: '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>',
                                styleHtmlContent: true,
                                styleHtmlCls: 'note-component',
                                html: '<img src="resources/images/checked.png"  width="20%" ><p>You quote has been saved. </p>'
                            },

                            {
                                xtype: 'container',
                                margin: '10 10 10 10',
                                //height: '10%',
                                // cls: 'footer-container',
                                defaults: {
                                    xtype: 'button',
                                    style: 'margin: 5px',
                                    //flex: 1
                                },
                                layout: {
                                    type: 'hbox'
                                },
                                items: [
                                    {
                                        xtype: 'spacer'
                                    },
                                    {
                                        text: 'Close',
                                        ui: 'forward',

                                        handler: function (cmp) {
                                            console.info('close called');
                                            console.info(cmp);
                                            cmp.up('panel').close();
                                        }
                                    },
                                    {
                                        text: 'Email',
                                        ui: 'grey',
                                        // //handler: 'onEmail',
                                        scope: me,
                                        handler: me.onEmail
                                    },
                                    {
                                        text: 'Print',
                                        ui: 'grey',
                                        scope: me,
                                        handler: me.onPrint
                                    },
                                    {
                                        xtype: 'spacer'
                                    },
                                ]
                            }
                        ]
                    }).show();
                    vm.set('quoteKey', res.SAORDKEY);
                    vm.set('printURL', res.printURL);
                    vm.set('toEmail', toEmail);

                    // Ext.Msg.show({
                    //     title: 'Note',
                    //     message: 'Your qoute has been generated. You can: ',
                    //     width: 300,
                    //     modal: false,

                    //     //zIndex: 17000,
                    //     buttons: [
                    //         {
                    //             text: 'Email',
                    //             itemId: 'email',
                    //             scope: me,
                    //             handler: me.onEmail
                    //         },
                    //         { text: 'Print', itemId: 'print' },
                    //         { text: 'Close', itemId: 'close' },
                    //     ],

                    //     // fn: function (buttonId) {
                    //     //     alert('You pressed the "' + buttonId + '" button.');
                    //     // }
                    // });
                    // }


                    // Ext.Msg.alert('Message', 'Your cart has been saved.', function () {
                    // Go to Category Page
                    me.resetCart();
                    tabPanel.setActiveItem(0);
                    // Go To Cat Page
                    Ext.ComponentQuery.query('category')[0].fireEvent('goToCatPage');

                    // });
                } else {
                    Ext.Msg.alert('Failed to save your quote', JSON.stringify(res), Ext.emptyFn);

                }
                view.unmask();
            }, function (res) {
                console.info(res);
                view.unmask();
                Ext.Msg.alert('Server Error', JSON.stringify(res), Ext.emptyFn);
            });


            console.info(selectedArray);
            console.info(custInfoValues);
        } else {
            Ext.Msg.alert('Message', 'Your cart is empty, please select products', Ext.emptyFn);

        }


    },

    onPrint: function () {
        console.info('onPrint called');
        var me = this,
            vm = me.getViewModel(),
            orderKey = vm.get('quoteKey'),
            noteMsgCmp = Ext.ComponentQuery.query('#noteMsgCmp')[0],
            notePanel = Ext.ComponentQuery.query('#notePanel')[0];
        me.requestPrint(orderKey).then(function (res) {
            console.info(res);
            if (res.success) {
                // Ext.Msg.alert('Message', JSON.stringify(res), Ext.emptyFn);

                // const noteMsgCmp = Ext.ComponentQuery.query('#noteMsgCmp')[0];
                // const notePanel = Ext.ComponentQuery.query('#notePanel')[0];
                // console.info(noteMsgCmp);
                // console.info(notePanel);

                notePanel.setMasked(true);
                setTimeout(function () {
                    noteMsgCmp.setHtml('<img src="resources/images/print-icon.png"  width="20%" >' + '<p>' + res.msg + '</p>');
                    notePanel.unmask();
                }, 2000);

            } else {
                // Ext.Msg.alert('Message', JSON.stringify(res), Ext.emptyFn);
                notePanel.setMasked(true);
                setTimeout(function () {
                    noteMsgCmp.setHtml('<img src="resources/images/print-icon.png"  width="20%" >' + '<p>' + res.msg + '</p>');
                    notePanel.unmask();
                }, 2000);
            }
        }, function (res) {
            // console.info(res);
            // Ext.Msg.alert('Message', JSON.stringify(res), Ext.emptyFn);
            notePanel.setMasked(true);
            setTimeout(function () {
                noteMsgCmp.setHtml('<img src="resources/images/print-icon.png"  width="20%" >' + '<p>' + res.msg + '</p>');
                notePanel.unmask();
            }, 2000);
        });

    },

    // Reset cart
    resetCart: function () {
        var me = this,
            vm = me.getViewModel(),
            selectedProdsStore = vm.getStore('selectedProds'),
            custInfoForm = me.lookupReference('custInfoFormRef');
        selectedProdsStore.removeAll();
        custInfoForm.reset();



    },

    // request print 
    requestPrint: function (orderKey) {
        console.info('requestPrint called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC3050',
            action: 'printQuote',
            SAORDKEY: orderKey,
        };
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

    requestSave: function (formData, list) {
        console.info('requestSave called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC3050',
            action: 'saveCart',
            products: list
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

    requestRelease: function (cartId) {
        console.info('requestRelease called');
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC3050',
            action: 'releaseCart',
            SAORDKEY: cartId
        };
        Ext.Ajax.request({
            url: '/valence/vvcall.pgm',
            method: 'POST',
            params: params,
            success: function (res) {
                console.info(res);
                if (res.success) {
                    console.info('cart has been released');
                }
            },
            failure: function (res) {
                console.info('failed to release the cart');
            }
        });
        return deferred.promise;
    },
    onEmail: function (cmp) {
        console.info('onEmail called');
        // setTimeout(function () {
        //     Ext.Msg.alert('Sent', 'The quote has been sent to you successfully.', Ext.emptyFn);
        // }, 500);

        // Should go to first page
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            custInfoForm = me.lookupReference('custInfoFormRef'),
            custInfoValues = custInfoForm.getValues();
        console.info(view);
        // custInfoForm = me.lookupReference('custInfoFormRef'),
        // custInfoValues = custInfoForm.getValues(),
        // selectedProdsStore = vm.getStore('selectedProds'),
        // selectedCount = selectedProdsStore.getCount(),
        // selectedArray = [];


        // console.info(custInfoValues);
        // if (selectedCount > 0) {
        //     // Constract selectedArray[]
        //     for (var i = 0; i < selectedProdsStore.getCount(); i++) {
        //         var p = selectedProdsStore.getAt(i).getData();
        //         selectedArray.push({
        //             SBITM: p.SBITM,
        //             //PRICEOLD: p.PRICEOLD,
        //             SBUPRC: p.SBUPRC,
        //             //PRODGROUP: p.PRODGROUP,
        //             SBQTYO: p.SBQTYO
        //         });
        //     }
        //     me.requestSave(custInfoValues, JSON.stringify(selectedArray)).then(function (res) {
        //         console.info(res);
        //         if (res.success) {
        //             var link = res.printURL;



        //             Ext.Viewport.add({
        //                 xtype: 'sheet',
        //                 closable: true,
        //                 hideOnMaskTap: true,
        //                 showAnimation: {
        //                     type: 'pop',
        //                     // duration: 250,
        //                     // easing: 'ease-out'
        //                 },
        //                 centered: true,
        //                 width: '80%',
        //                 height: 700,
        //                 layout: 'fit',
        //                 title: 'downloadText',
        //                 items: [{
        //                     xtype: 'component',
        //                     cls: 'download-cmp',
        //                     html: '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>',
        //                 },
        //                 {
        //                     xtype: 'container',
        //                     defaults: {
        //                         xtype: 'button',
        //                         style: 'margin-left: 5px',
        //                         //flex: 1
        //                     },
        //                     layout: {
        //                         type: 'hbox'
        //                     },
        //                     items: [
        //                         {
        //                             xtype: 'spacer'
        //                         },
        //                         {
        //                             text: 'Cancel',
        //                             ui: 'forward',

        //                             handler: function (cmp) {
        //                                 console.info('close called');
        //                                 console.info(cmp);
        //                                 cmp.up('formpanel').close();
        //                             }
        //                         },
        //                         {
        //                             text: 'Send',
        //                             ui: 'action',
        //                             handler: me.onSendEmail
        //                         },
        //                     ]
        //                 }]
        //             }).show();

        console.info(Ext.Viewport);
        Ext.Viewport.add({
            xtype: 'formpanel',
            //closable: true,
            reference: 'sendFormRef',
            centered: true,
            width: 500,
            viewModel: 'cart',
            bodyPadding: '16 32 16 32',
            modal: true,
            //zIndex: 80000,
            items: [
                {
                    xtype: 'textfield',
                    name: 'SAORDKEY',
                    label: 'Order Key:',
                    value: vm.get('quoteKey'),
                    hidden: true
                }, {
                    xtype: 'emailfield',
                    name: 'to',
                    label: 'To:',
                    value: vm.get('toEmail'),
                },
                {
                    xtype: 'emailfield',
                    name: 'cc',
                    label: 'Cc:'
                },
                {
                    xtype: 'textfield',
                    name: 'subject',
                    label: 'Subject:',
                    value: 'Smeg Quote ' + vm.get('quoteKey'),
                },
                {
                    xtype: 'textareafield',
                    label: 'Message:',
                    maxRows: 8,
                    name: 'message'
                },
                // {
                //     xtype: 'button',
                //     text: 'Submit Form',
                // }
                {
                    xtype: 'container',
                    defaults: {
                        xtype: 'button',
                        style: 'margin-left: 5px',
                        //flex: 1
                    },
                    layout: {
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'spacer'
                        },
                        {
                            text: 'Cancel',
                            ui: 'forward',

                            handler: function (cmp) {
                                console.info('close called');
                                console.info(cmp);
                                cmp.up('formpanel').close();
                            }
                        },
                        {
                            text: 'Send',
                            ui: 'grey',
                            scope: me,
                            handler: me.onSend
                        },
                    ]
                }],
        }).show();

    },

    onSend: function () {
        console.info('onSendEmail called');
        var me = this,
            view = me.getView(),
            sendForm = Ext.ComponentQuery.query('formpanel')[1],
            pdfPanel = Ext.ComponentQuery.query('#qoutePdfPanelId')[0];

        sendFormValues = sendForm.getValues();
        console.info(sendForm.getValues());
        console.info(pdfPanel);
        sendForm.setMasked({
            xtype: 'loadmask',
            message: 'Sending......'
        });

        me.requestSendEmail(sendFormValues).then(function (res) {
            if (res.success) {
                //cmp.up('formpanel').close();
                Ext.Msg.alert('Sent', 'Your quote has been sent successfully', function () {
                    sendForm.close();
                    //pdfPanel.close();
                });

            } else {
                Ext.Msg.alert('Error', JSON.stringify(res), function () {
                    sendForm.close();
                    //pdfPanel.close();
                });


            }
            sendForm.unmask();
        }, function () {
            sendForm.unmask();
            Ext.Msg.alert('Server Error', JSON.stringify(res), function () {
                sendForm.close();
                //pdfPanel.close();
            });


        })
    },


    requestSendEmail: function (sendFormValues) {

        var me = this,
            vm = me.getViewModel(),
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC3050',
            action: 'emailQuote',
            attachment: vm.get('printURL')
        };
        Ext.apply(params, sendFormValues);
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

    onCancel: function () {
        console.info('onCancel called');
        var me = this,
            vm = me.getViewModel(),
            tabPanel = Ext.ComponentQuery.query('app-main')[0],
            custInfoForm = me.lookupReference('custInfoFormRef'),
            qouteGrid = Ext.ComponentQuery.query('qlist')[0].down('grid'),
            selectedProdsStore = vm.getStore('selectedProds'),
            cartId = custInfoForm.getValues().SAORDKEY || '',
            view = me.getView();

        console.info(custInfoForm.getValues().SAORDKEY);
        console.info(cartId);


        //Ext.getCmp('app-main').setActiveTab(0);
        //console.info(Ext.ComponentQuery.query('app-main')[0].setActiveTab(0));
        tabPanel.setActiveItem(0);

        // reset cart
        //selectedProdsStore.removeAll();
        me.resetCart();
        Ext.ComponentQuery.query('category')[0].fireEvent('goToCatPage');

        // Deselect grid
        qouteGrid.deselectAll();

        // reset the customer form
        //custInfoForm.reset();


        // release the cart
        if (!Ext.isEmpty(cartId)) {
            me.requestRelease(cartId).then(function (res) {
                console.info('cart released');
            }, function (res) {
                console.info('failed to release the cart');
            });
        }

        // reset the title 
        view.down('grid').setTitle("You've selected");

    }



    // onToggleKpi: function (button) {
    //     if (button.pressed) {
    //         var view = this.getView();
    //         view.setActiveState(button.filter);
    //     }
    // },

    // updateActiveState: function (activeState) {
    //     console.log('updateActiveState called');
    //     console.info(activeState);
    //     var refs = this.getReferences();
    //     var viewModel = this.getViewModel();

    //     refs[activeState].setPressed(true);
    //     viewModel.set('kpiCategory', activeState);

    //     this.fireEvent('changeroute', this, 'kpi/' + activeState);
    // }
});
