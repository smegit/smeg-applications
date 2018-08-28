Ext.define('Valence.device.Camera', {
    singleton : true,

    destinationType : {
        DATA_URL : 0,   // Return image as base64-encoded string
        FILE_URI : 1,   // Return image file URI
        NATIVE_URI : 2  // Return image native URI (e.g., assets-library:// on iOS or content:// on Android)
    },

    direction : {
        BACK : 0,      // Use the back-facing camera
        FRONT : 1      // Use the front-facing camera
    },

    encodingType : {
        JPEG : 0,      // Return JPEG encoded image
        PNG : 1        // Return PNG encoded image
    },

    mediaType : {
        PICTURE: 0,    // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
        VIDEO: 1,      // allow selection of video only, WILL ALWAYS RETURN FILE_URI
        ALLMEDIA : 2   // allow selection from all media types
    },

    pictureSourceType : {
        PHOTOLIBRARY : 0,
        CAMERA : 1,
        SAVEDPHOTOALBUM : 2
    },

    cleanup : function (config) {
        config = config || {};
        Ext.apply(config, {
            requestId         : 'camera',
            responseId        : 'cameraCleanup',
            method            : 'cleanup',
            callbackMandatory : false
        });
        Valence.device.Access.initiate(config);
    },

    getPicture : function (config) {
        config = config || {};
        Ext.apply(config, {
            requestId  : 'camera',
            responseId : 'cameraPicture',
            method     : 'getPicture'
        });
        Valence.device.Access.initiate(config);
    }
});