/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('pdf.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    requires: [
        'pdf.view.main.FileListWindow'
    ],
    init: function (view) {
        console.info(view);
        var me = this,
            vm = me.getViewModel(),
            link, iframeHTML;

        // Ext.MessageBox.show({
        //     msg: 'Generating PDF files, please wait...',
        //     progressText: 'Saving...',
        //     width: 300,
        //     wait: {
        //         interval: 400
        //     },
        // });
        // setTimeout(function () {
        //     me.requestPDF().then(
        //         function (res) {
        //             console.info(res);
        //             if (res.success) {
        //                 link = res.URL;
        //             } else {
        //                 link = '/PRODUCT/testpdf.pdf';
        //             }
        //             iframeHTML = '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>';
        //             vm.set('iframeHTML', iframeHTML);
        //             Ext.MessageBox.hide();
        //         },
        //         function (res) {
        //             console.info(res);
        //         });
        // }, 300);
    },

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },

    requestPDF: function () {
        console.info('requestPDF called');
        // var queryString = window.location.search,
        //     SID = queryString.substring(queryString.indexOf("&sid=") + 5, queryString.indexOf("&env=")),
        //     APP = queryString.substring(5, 9);
        // console.info(SID);
        // console.info(APP);
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC2020',
            // sid: SID,
            // app: APP,
        }
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

    onDownload: function () {
        console.info('onDownload called');
        var me = this,
            url = '/PRODUCT/testpdf.pdf';
        //window.open(url, '_blank');

        Ext.MessageBox.show({
            msg: 'Generating PDF files, please wait...',
            progressText: 'Saving...',
            width: 300,
            wait: {
                interval: 400
            },
        });
        setTimeout(function () {
            me.requestPDF().then(
                function (res) {
                    console.info(res);
                    if (res.success) {
                        link = res.URL;
                    } else {
                        link = '/PRODUCT/testpdf.pdf';
                    }
                    // iframeHTML = '<iframe src="' + link + '" width="100%" height="100%" >This is iframe</iframe>';
                    // vm.set('iframeHTML', iframeHTML);
                    window.open(link, '_blank');
                    Ext.MessageBox.hide();
                },
                function (res) {
                    console.info(res);
                });
        }, 300);

    },
    onUploadFile: function () {
        console.info('onUploadFile called');
        var me = this,
            uploadForm = me.lookupReference('uploadForm').getForm(),
            uploadForm1 = me.lookupReference('uploadForm'),
            formValues = uploadForm.getFieldValues(),
            uploadWindow = me.lookupReference('uploadWindow'),
            fileName = uploadForm.getFieldValues('file').file.replace(/^.*\\/, "");
        console.info(uploadForm);
        var params = {
            pgm: 'EC2020',
            action: 'upload',
        }
        //Ext.apply(params, formValues);



        console.info(formValues);
        if (uploadForm.isValid()) {
            // Ext.Ajax.request({
            //     url: '/valence/vvcall.pgm',
            //     method: 'POST',
            //     //binary: true,
            //     //defaultPostHeader: 'multipart/form-data',
            //     headers: { 'Content-Type': 'multipart/form-data' },
            //     params: {
            //         pgm: 'EC2020',
            //         action: 'upload',
            //         file: uploadForm.getFieldValues('file-path')
            //     },

            //     //form: uploadForm,
            //     isUpload: true,
            //     //data: formValues,
            //     success: function (res) {
            //         var response = Ext.decode(res.responseText);
            //         //deferred.resolve(response);
            //         console.info(response);
            //         if (response.success) {
            //             //Ext.toast('Upload successfully');
            //             Ext.Msg.alert('Success', 'Your file has been uploaded successfully.');
            //         } else {
            //             Ext.Msg.alert('Error', 'Failed to upload your file');
            //             //Ext.toast('Failed to upload file.');
            //         }
            //         uploadWindow.close();
            //     },
            //     failure: function (res) {
            //         var response = Ext.decode(res.responseText);
            //         console.info(response);
            //         uploadWindow.close();
            //         //deferred.reject(response);
            //         Ext.Msg.alert('Server Error', 'Failed to upload your file');
            //         //Ext.toast('Failed to upload file.');
            //     }
            // });


            console.info(uploadForm.getFieldValues('file').file.replace(/^.*\\/, ""));
            //  submit
            uploadForm.submit({
                url: '/valence/vvupload.pgm?action=upload' + '&fileName=' + fileName + '&sid=' + localStorage.getItem('sid'),
                //url: '/valence/vvcall.pgm',
                params: {
                    pgm: 'EC2020',
                    action: 'upload',
                    sid: localStorage.getItem('sid'),
                    app: Ext.getUrlParam('app'),
                    // pgm: 'EC2020',
                    // action: 'upload',
                    //pgm: 'EXUPLOAD1',
                    fileName: fileName
                },
                form: uploadForm,

                method: 'POST',
                //headers: { 'Content-Type': 'multipart/form-data' },
                success: function (form, action) {
                    console.info(action);
                    uploadWindow.close();
                    Ext.Msg.alert('Success', action.result.msg);
                },
                failure: function (form, action) {
                    console.info(action);
                    uploadWindow.close();
                    Ext.Msg.alert('Success', action.result.msg);
                },
            });





            // uploadForm.submit({
            //     url: '/valence/vvcall.pgm',
            //     params: params,
            //     waitMsg: 'Uploading your photo...',
            //     success: function (form, action) {
            //         console.info(action);
            //         Ext.Msg.alert('Success', action.result.message);
            //     },
            //     failure: function (form, action) {
            //         console.info(action);
            //         Ext.Msg.alert('Error', action.result.message);
            //     }
            // })
        }

    },

    onUpload: function () {
        console.info('onUpload called');
        var me = this,
            view = me.getView();
        console.info(view);
        Ext.create('Ext.window.Window', {
            title: 'File Upload',
            reference: 'uploadWindow',
            // height: 200,
            width: 400,
            //layout: 'fit',
            modal: true,
            items: {  // Let's put an empty grid in just to illustrate fit layout
                // xtype: 'grid',
                // border: false,
                // columns: [{ header: 'World' }],                 // One header just for show. There's no data,
                // store: Ext.create('Ext.data.ArrayStore', {}) // A dummy empty data store


                xtype: 'form',
                //title: 'File Upload Form',
                id: 'uploadFormId',
                frame: true,
                bodyPadding: '10 10 0',
                reference: 'uploadForm',
                //closable: true,
                //modal: true,
                cls: 'upload-form',
                // height: '30%',
                // width: '30%',
                // showAnimation: {
                //     type: 'pop',
                //     // duration: 250,
                //     // easing: 'ease-out'
                // },
                width: '100%',
                // baseParams: {
                //     sid: localStorage.getItem('sid'),
                // },
                items: [
                    // {
                    //     xtype: 'textfield',
                    //     fieldLabel: 'Name',
                    //     name: 'fileName',
                    //     allowBlank: false,

                    //     flex: 1,
                    // },
                    // {
                    //     xtype: 'textfield',
                    //     fieldLabel: 'Sid',
                    //     name: 'sid',
                    //     allowBlank: false,
                    //     value: localStorage.getItem('sid'),
                    //     flex: 1,
                    // },
                    {
                        //xtype: 'textfield',
                        name: 'sid',
                        value: localStorage.getItem('sid')
                    },
                    {
                        //xtype: 'textfield',
                        name: 'action',
                        value: 'upload'
                    },
                    // {
                    //     name: 'app',
                    //     value: Ext.getUrlParam('app')
                    // },
                    // {
                    //     name: 'pgm',
                    //     value: 'EC2020'
                    // },
                    {
                        xtype: 'filefield',
                        emptyText: 'Select file',
                        fieldLabel: 'File',
                        name: 'file',
                        allowBlank: false,
                        //buttonText: 'Browser..',
                        buttonConfig: {
                            text: '',
                            iconCls: 'x-fa fa-file'
                        }
                    }],
                buttons: [{
                    text: 'Upload',
                    handler: 'onUploadFile'
                    // handler: function () {
                    //     var form = this.up('form').getForm();
                    //     console.info(form);
                    //     if (form.isValid()) {
                    //         form.submit({
                    //             url: '/valence/vvcall.pgm',
                    //             waitMsg: 'uploading...',
                    //             params: {
                    //                 pgm: 'EC2020',
                    //                 action: 'upload',
                    //                 sid: localStorage.getItem('sid'),

                    //             },
                    //             success: function (fp, o) {
                    //                 alert("OK");
                    //             }
                    //         });
                    //     }
                    // }
                }, {
                    text: 'Cancel',
                    handler: 'onCancel'
                }]
            }
        }).show();
    },
    onCancel: function () {
        console.info('onCancel called');
        var me = this,
            uploadWindow = me.lookupReference('uploadWindow');
        uploadWindow.close();
    },

    onView: function () {
        console.info('onView called');
        var me = this,
            vm = me.getViewModel(),
            view = me.getView(),
            fileListStore = vm.getStore('fileList');

        //prodStore.loadData(prodArray);

        me.requestList().then(function (res) {
            console.info(res);


            if (res.success === false) {
                Ext.Msg.alert('Note', res.msg);
                return;
            }
            var listArray = [];
            if (res.files.length > 0) {
                res.files.forEach(function (e) {
                    var obj = e;
                    Ext.apply(obj, {
                        link: res.path + e.URL
                    })
                    listArray.push(obj);
                });
            }
            console.info(listArray);
            fileListStore.loadData(listArray);
            vm.set('hideList', false);
            console.info(fileListStore);

            // Show File List Window

            view.add({
                xtype: 'fileListWin'
            }).show();


        }, function (res) {
            console.info(res);


        })
    },
    onViewFile: function (grid, rowIndex, colIndex) {
        console.info('onViewFile called');
        console.info(grid);
        console.info(rowIndex);
        console.info(colIndex);
        console.info(grid.getStore().getAt(rowIndex));
        var rec = grid.getStore().getAt(rowIndex),
            fileLink = rec.get('link');
        window.open(fileLink, '_blank');
    },

    onSelectFile: function (grid, record, index) {
        console.info('onSelectFile called');
        console.info(grid);
        console.info(record);
        console.info(index);
        var fileLink = record.get('link');
        window.open(fileLink, '_blank');
    },

    requestList: function () {
        console.info('requestList called');
        // var queryString = window.location.search,
        //     SID = queryString.substring(queryString.indexOf("&sid=") + 5, queryString.indexOf("&env=")),
        //     APP = queryString.substring(5, 9);
        // console.info(SID);
        // console.info(APP);
        var me = this,
            deferred = Ext.create('Ext.Deferred'),
            params = {};
        params = {
            pgm: 'EC2020',
            action: 'view'
            //sid: ,
            // app: APP,
        }
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


});
