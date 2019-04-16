Ext.define('PortalActions.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    requires: [
        'Valence.common.util.Dialog'
    ],

    app: 97,  //Hardcoded Active Sessions

    initViewModel: function (vm) {
        var me = this;

        vm.set('appBarTitleText', Valence.lang.lit.portalActions);
    },

    beep: function () {
        var me = this;
        Valence.mobile.Notification.beep();
    },

    cameraGetPicture: function () {
        var me = this;
        Ext.Viewport.mask();
        Valence.mobile.Camera.getPicture({
            scope: me,
            callback: function (response) {
                Ext.Viewport.unmask();
                if (Ext.isEmpty(response)) {
                    return;
                }
                if (response.success) {
                    Ext.Msg.alert('Picture', '<img width="250px" height="250px" alt="Embedded Image" src="data:image/jpeg;base64,' + response.data + '"/>');
                    Valence.mobile.Camera.cleanup();
                } else {
                    Valence.common.util.Dialog.show({
                        title: 'Camera cancelled',
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                }
            }
        });
    },

    close: function () {
        var me = this,
            app = me.app;
        //close a application that is running in the portal
        //
        Valence.util.App.isRunning({
            app: app,
            scope: me,
            callback: function (response) {
                if (response) {
                    Valence.util.App.close(app);
                    Valence.common.util.Dialog.show({
                        title: 'Close',
                        msg: Valence.lang.lit.activeSessions + ' Closed',
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                } else {
                    Valence.common.util.Dialog.show({
                        title: 'Close',
                        msg: Valence.lang.lit.activeSessions + ' not found',
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                }
            }
        });
    },

    emailComposer: function () {
        var me = this;
        Valence.mobile.Email.compose({
            to: ['sales@cnxcorp.com'],
            cc: ['john.doe@mycompany.com'],
            bcc: ['jane.doe@cnxcorp.com'],
            subject: 'License',
            body: 'I would like to purchase a Valence License.'
        });
    },

    getConnectionType: function () {
        var me = this;
        Ext.Viewport.mask();
        Valence.mobile.Information.connectionType({
            scope: me,
            callback: function (response) {
                Ext.Viewport.unmask();
                if (Ext.isEmpty(response)) {
                    return;
                }
                if (response) {
                    Valence.common.util.Dialog.show({
                        title: 'Connection Type',
                        msg: response,
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                }
            }
        });
    },

    geolocationGetCurrentPosition: function () {
        var me = this;
        Ext.Viewport.mask();
        Valence.mobile.Geolocation.getCurrentPosition({
            scope: me,
            callback: function (response) {
                Ext.Viewport.unmask();
                if (Ext.isEmpty(response)) {
                    return;
                } else {
                    var info = '';
                    if (response.coords) {
                        if (response.coords.latitude) {
                            info += 'Latitude : ' + response.coords.latitude + '<br>';
                        }
                        if (response.coords.longitude) {
                            info += 'Longitude : ' + response.coords.longitude;
                        }
                        Valence.common.util.Dialog.show({
                            title: 'Position Info',
                            msg: info,
                            buttons: ['->', {
                                text: Valence.lang.lit.ok
                            }]
                        });
                    } else {
                        Valence.common.util.Dialog.show({
                            title: 'Error',
                            msg: response.message,
                            buttons: ['->', {
                                text: Valence.lang.lit.ok
                            }]
                        });
                    }
                }
            }
        });
    },

    getDeviceInformation: function () {
        var me = this;
        Ext.Viewport.mask();
        Valence.mobile.Information.get({
            scope: me,
            callback: function (response) {
                Ext.Viewport.unmask();
                if (Ext.isEmpty(response)) {
                    return;
                }
                if (response) {
                    var info = '';
                    if (response.model) {
                        info += 'Model : ' + response.model + '<br>';
                    }
                    if (response.platform) {
                        info += 'Platform : ' + response.platform;
                    }
                    Valence.common.util.Dialog.show({
                        title: 'Device Information',
                        msg: info,
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                }
            }
        });
    },

    getEnvironment: function () {
        var me = this;
        //get the current environment
        //
        Valence.util.Helper.getEnvironment({
            scope: me,
            callback: function (response) {
                Valence.common.util.Dialog.show({
                    title: 'Environment',
                    msg: response,
                    buttons: ['->', {
                        text: Valence.lang.lit.ok
                    }]
                });
            }
        });
    },

    getReference: function () {
        var me = this,
            app = me.app;
        //get a reference to a specific application that is running in the portal
        //
        var appRef = Valence.app.getReference(app);
        if (appRef) {
            Valence.common.util.Dialog.show({
                title: '',
                msg: 'Application reference will be sent to the console',
                buttons: ['->', {
                    text: Valence.lang.lit.ok
                }],
                handler: function () {
                    console.log(appRef);
                }
            });
        } else {
            Ext.Msg.alert('Application not found', app);
        }
    },

    getUser: function () {
        var me = this;
        //get the current logged in user
        //
        Valence.util.Helper.getUserName({
            scope: me,
            callback: function (response) {
                Valence.common.util.Dialog.show({
                    title: 'Current User',
                    msg: response,
                    buttons: ['->', {
                        text: Valence.lang.lit.ok
                    }]
                });
            }
        });
    },

    inAppBrowser: function () {
        var me = this;

        Ext.Viewport.mask({
            xtype: 'loadmask',
            message: Valence.lang.lit.loading
        });

        Valence.mobile.InAppBrowser.show({
            url: 'https://www.google.com/',
            options: {
                closebuttoncaption: 'Close CNX Corp'
            },
            callback: function () {
                Ext.Viewport.unmask();
            }
        });
    },

    isLaunched: function () {
        var me = this,
            app = me.app;
        //determine if a specific app is already running in the touch portal
        //
        Valence.util.App.isRunning({
            app: app,
            scope: me,
            callback: function (response) {
                Valence.common.util.Dialog.show({
                    title: 'Launched?',
                    msg: Valence.lang.lit.activeSessions + (!response ? ' is not launched' : ' is launched'),
                    buttons: ['->', {
                        text: Valence.lang.lit.ok
                    }]
                });
            }
        });
    },

    launchApp: function () {
        var me = this,
            app = me.app;
        //launch an application
        //
        // call the isLaunched and on the callback determine if
        // we should launch the app
        //
        Valence.util.App.isRunning({
            app: app,
            scope: me,
            callback: function (response) {
                if (!response) {
                    Valence.util.App.launch({
                        app: app
                    });
                } else {
                    Valence.common.util.Dialog.show({
                        title: 'Launch',
                        msg: Valence.lang.lit.activeSessions + ' is already running',
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                }
            }
        });
    },

    onItemTapList: function (list, index, target, rec) {
        var me = this,
            vm = me.getViewModel(),
            action = rec.get('action'),
            appBarCfg,
            cmp;

        if (action === 'launch') {
            me.launchApp();
        } else if (!Ext.isEmpty(action) && typeof me[action] === 'function') {
            me[action]();
        }
    },

    onTapTitle: function () {
        var me = this,
            vm = me.getViewModel(),
            cardIndex = vm.get('cardIndex'),
            view = me.getView(),
            ai, appBarCfg;

        if (cardIndex == 1) {
            appBarCfg = vm.get('appBarCfg0');
            vm.set({
                activeItem: 0,
                appBarBackIcon: false
            });
            setTimeout(function () {
                me.signaturePad.clear();
                vm.set(appBarCfg);
            }, 100);
        }
    },

    onTapClearSignatureButton: function () {
        var me = this;
        me.signaturePad.clear();
    },

    onTapSaveSignatureButton: function () {
        var me = this;
        Valence.common.util.Dialog.show({
            title: 'Your Signature',
            msg: '<div style="background:white"><img width="250px" height="250px" alt="Embedded Image" src="' + me.signaturePad.toDataURL() + '"/></div>',
            buttons: ['->', {
                text: Valence.lang.lit.ok
            }]
        });
    },

    pickContact: function () {
        var me = this;
        Ext.Viewport.mask();
        Valence.mobile.Contacts.pick({
            scope: me,
            callback: function (response) {
                Ext.Viewport.unmask();
                if (Ext.isEmpty(response) || Ext.isEmpty(response.name)) {
                    return;
                }
                if (response.name.formatted) {
                    Valence.common.util.Dialog.show({
                        title: 'You Selected',
                        msg: response.name.formatted,
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                }
            }
        });
    },

    printContent: function () {
        var me = this;
        Valence.mobile.Print.content({
            scope: me,
            content: '<b>Test Print</b><br><br>Valence Mobile Print',
            callback: function (response) {
                if (Ext.isEmpty(response)) {
                    return;
                }
                if (!response.available) {
                    Valence.common.util.Dialog.show({
                        msg: 'Printer unavailable',
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                }
            }
        });
    },

    printScreen: function () {
        var me = this;

        //or just call Valence.util.App.print();
        //
        Valence.mobile.Print.content({
            scope: me,
            content: '<!DOCTYPE html>' + document.documentElement.innerHTML,
            callback: function (response) {
                if (Ext.isEmpty(response)) {
                    return;
                }
                if (!response.available) {
                    Valence.common.util.Dialog.show({
                        msg: 'Printer unavailable',
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                }
            }
        });
    },

    isPrintAvailable: function () {
        var me = this;
        Valence.mobile.Print.isAvailable({
            scope: me,
            callback: function (response) {
                if (Ext.isEmpty(response)) {
                    return;
                }
                if (response.available) {
                    Valence.common.util.Dialog.show({
                        msg: 'Printer available',
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                    // Ext.Msg.alert('Printer available');
                } else {
                    Valence.common.util.Dialog.show({
                        msg: 'Printer unavailable',
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                }
            }
        });
    },

    scanBarcode: function () {
        var me = this;
        Ext.Viewport.mask();
        Valence.mobile.Barcode.scan({
            scope: me,
            callback: function (response) {
                Ext.Viewport.unmask();
                if (Ext.isEmpty(response)) {
                    return;
                }
                if (response.success) {
                    if (!response.data.cancelled) {
                        var info = '';
                        if (response.data.format) {
                            info += 'Format : ' + response.data.format + '<br>';
                        }
                        if (response.data.text) {
                            info += 'Text : ' + response.data.text;
                        }

                        Valence.common.util.Dialog.show({
                            title: 'Barcode Scanned',
                            msg: info,
                            buttons: ['->', {
                                text: Valence.lang.lit.ok
                            }]
                        });
                    } else {
                        Valence.common.util.Dialog.show({
                            title: 'Barcode scan',
                            msg: 'Cancelled',
                            buttons: ['->', {
                                text: Valence.lang.lit.ok
                            }]
                        });
                    }
                }
            }
        });
    },

    clearBadge: function () {
        var me = this;
        Valence.mobile.Badge.clear();
    },

    getBadge: function () {
        var me = this;
        Ext.Viewport.mask();
        Valence.mobile.Badge.get({
            scope: me,
            callback: function (response) {
                Ext.Viewport.unmask();
                if (Ext.isEmpty(response)) {
                    return;
                }
                Valence.common.util.Dialog.show({
                    title: 'Badge value',
                    msg: response,
                    buttons: ['->', {
                        text: Valence.lang.lit.ok
                    }]
                });
            }
        });
    },

    setBadge: function () {
        var me = this;
        Valence.mobile.Badge.set(4);
    },

    signature: function () {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            appBarCfg0 = Ext.clone(vm.getData());

        if (!me.signaturePad) {
            var signatureContainer = me.lookupReference('signaturecontainer'),
                canvas = signatureContainer.element.down('canvas');
            me.signaturePad = new SignaturePad(canvas.dom);
        }
        vm.set({
            appBarCfg0: appBarCfg0,
            appBarTitleText: 'Signature',
            // appBarTitleIconCls   : 'x-fa fa-caret-left',
            // appBarTitleIconAlign : 'left',
            appBarBackIcon: true,
            activeItem: 1,
            cardIndex: 1
        });
    },

    show: function () {
        var me = this,
            app = me.app;

        Valence.util.App.isRunning({
            app: app,
            scope: me,
            callback: function (response) {
                if (response) {
                    Valence.util.App.setActive(app);
                } else {
                    Valence.common.util.Dialog.show({
                        title: 'App Show',
                        msg: Valence.lang.lit.activeSessions + ' is not running',
                        buttons: ['->', {
                            text: Valence.lang.lit.ok
                        }]
                    });
                }
            }
        });
    }
});
