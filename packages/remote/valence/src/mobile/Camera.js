/**
 * Access the camera
 *
 *  **Only available when running in the Valence Portal on [iOS](https://itunes.apple.com/us/app/valence-portal/id911930975?mt=8) or [Android](https://play.google.com/store/apps/details?id=com.cnxcorp.portal&hl=en)
 *
 * ## Cleanup Camera Example
 *
 * You can use the {@link Valence.mobile.Camera#cleanup} method to remove intermediate photos taken by the camera from temporary storage:
 *
 *     Valence.mobile.Camera.cleanup();
 *
 * ## Get Picture Example
 *
 * You can use the {@link Valence.mobile.Camera#getPicture} method to allow the user to either take a photo or retrieve a photo from the device's image gallery:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Camera.getPicture({
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response.success) {
 *                 Ext.Msg.alert('Picture', '<img width="250px" height="250px" src="data:image/jpeg;base64,' + response.data + '"/>');
 *                 //clean up the camera
 *                 //
 *                 Valence.mobile.Camera.cleanup();
 *             } else {
 *                 Ext.Msg.alert('Picture Not Taken');
 *             }
 *         }
 *     });
 *
 *    {@img ValenceCamera.jpg}
 *
 * ## Get Picture with options Example
 *
 * Bring up the camera with the front camera active instead of the default back camera:
 *
 *     var me = this;
 *     Ext.Viewport.mask();
 *     Valence.mobile.Camera.getPicture({
 *         options  : {
 *             cameraDirection : Valence.mobile.Camera.direction.FRONT
 *         },
 *         scope    : me,
 *         callback : function (response) {
 *             Ext.Viewport.unmask();
 *             if (Ext.isEmpty(response)) {
 *                 return;
 *             }
 *             if (response.success) {
 *                 Ext.Msg.alert('Picture', '<img width="250px" height="250px" src="data:image/jpeg;base64,' + response.data + '"/>');
 *                 //clean up the camera
 *                 //
 *                 Valence.mobile.Camera.cleanup();
 *             } else {
 *                 Ext.Msg.alert('Picture Not Taken');
 *             }
 *         }
 *     });
 */
Ext.define('Valence.mobile.Camera', {
    alternateClassName : ['Valence.device.Camera'],
    singleton          : true,

    /**
     * @property {Object} return type
     *
     * @property {Number} destinationType.DATA_URL
     * Return image as base64-encoded string
     *
     * @property {Number} destinationType.FILE_URI
     * Return image file URI
     *
     * @property {Number} destinationType.NATIVE_URI
     * Return image native URI (e.g., assets-library:// on iOS or content:// on Android)
     */
    destinationType : {
        DATA_URL   : 0,   // Return image as base64-encoded string
        FILE_URI   : 1,   // Return image file URI
        NATIVE_URI : 2  // Return image native URI (e.g., assets-library:// on iOS or content:// on Android)
    },

    /**
     * @property {Object} direction Camera to use (front- or back-facing)
     *
     * @property {Number} direction.BACK
     * Use the back-facing camera DEFAULT.
     *
     * @property {Number} direction.FRONT
     * Use the front-facing camera
     */
    direction : {
        BACK  : 0,      // Use the back-facing camera
        FRONT : 1      // Use the front-facing camera
    },

    /**
     * @property {Object} encodingType Returned image file's encoding
     *
     * @property {Number} encodingType.JPEG
     * Return JPEG encoded image DEFAULT.
     *
     * @property {Number} encodingType.PNG
     * Return PNG encoded image
     */
    encodingType : {
        JPEG : 0,      // Return JPEG encoded image
        PNG  : 1        // Return PNG encoded image
    },

    /**
     * @property {Object} mediaType Type of media to select from. Only works when PictureSourceType is PHOTOLIBRARY or SAVEDPHOTOALBUM
     *
     * @property {Number} mediaType.PICTURE
     * Allow selection of still pictures only. DEFAULT.
     *
     * @property {Number} mediaType.VIDEO
     * Allow selection of video only, WILL ALWAYS RETURN FILE_URI
     *
     * @property {Number} mediaType.ALLMEDIA
     * Allow selection from all media types
     */
    mediaType : {
        PICTURE  : 0,    // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
        VIDEO    : 1,      // allow selection of video only, WILL ALWAYS RETURN FILE_URI
        ALLMEDIA : 2   // allow selection from all media types
    },

    /**
     * @property {Object} pictureSourceType The source of the picture
     *
     * @property {Number} pictureSourceType.PHOTOLIBRARY
     * Get photo from the photo library
     *
     * @property {Number} pictureSourceType.CAMERA
     * Get photo from the camera DEFAULT.
     *
     * @property {Number} pictureSourceType.SAVEDPHOTOALBUM
     * Get photo from the saved photo album
     */
    pictureSourceType : {
        PHOTOLIBRARY    : 0,
        CAMERA          : 1,
        SAVEDPHOTOALBUM : 2
    },

    /**
     * Cleanup - Removes intermediate photos taken by the camera from temporary storage.  Suggest calling this function after using the {@link Valence.mobile.Camera#getPicture} function.
     * @method
     */
    cleanup : function (config) {
        config = config || {};
        Ext.apply(config, {
            requestId         : 'camera',
            responseId        : 'cameraCleanup',
            method            : 'cleanup',
            callbackMandatory : false
        });
        Valence.mobile.Access.initiate(config);
    },

    /**
     * Get Picture - Takes a photo using the camera, or retrieves a photo from the device's image gallery. The image is passed to the success callback as a base64-encoded String.
     *
     * @param {Object} config
     * The config for getting a picture
     *
     * @param {Object} [config.options]
     * Optional parameters to customize the camera settings.
     *
     * @param {Number} [config.options.quality]
     * Quality of the saved image, expressed as a range of 0-100, where 100 is typically full resolution with no loss from file compression. The default is 10.
     *
     * @param {Number} [config.options.sourceType]
     * Set the source of the picture. The default is CAMERA. Defined in {@link Valence.mobile.Camera#sourceType}
     *
     * @param {Boolean} [config.options.allowEdit]
     * Allow simple editing of image before selection. The default is false.
     *
     * @param {Number} [config.options.encodingType]
     * Choose the returned image file's encoding. Default is JPEG. Defined in {@link Valence.mobile.Camera#encodingType}
     *
     * @param {Number} [config.options.targetWidth]
     * Width in pixels to scale image. Must be used with <b>targetHeight</b>. Aspect ratio remains constant.
     *
     * @param {Number} [config.options.targetHeight]
     * Height in pixels to scale image. Must be used with <b>targetWidth</b>. Aspect ratio remains constant.
     *
     * @param {Number} [config.options.mediaType]
     * Set the type of media to select from. Only works when PictureSourceType is PHOTOLIBRARY or SAVEDPHOTOALBUM. Defined in {@link Valence.mobile.Camera#mediaType}
     *
     * @param {Boolean} [config.options.correctOrientation]
     * Rotate the image to correct for the orientation of the device during capture.
     *
     * @param {Boolean} [config.options.saveToPhotoAlbum]
     * Save the image to the photo album on the device after capture.
     *
     * @param {Number} [config.options.cameraDirection]
     * Choose the camera to use (front- or back-facing). The default is BACK. Defined in {@link Valence.mobile.Camera#cameraDirection}
     *
     * @param {Function} config.callback
     * The callback which is called when a picture is taken or canceled.
     *
     * @param {Object} config.callback.response
     * Object that contains the response information
     *
     * @param {Boolean} config.callback.response.success
     * Successfully captured a picture
     *
     * @param {Object} config.callback.response.data
     * Picture data if success is true.  If success is false then will contain the error message.
     *
     * @param {Object} config.scope
     * The scope in which to call the `callback` function, if specified.
     */
    getPicture : function (config) {
        config = config || {};
        Ext.apply(config, {
            requestId  : 'camera',
            responseId : 'cameraPicture',
            method     : 'getPicture'
        });
        Valence.mobile.Access.initiate(config);
    }
});