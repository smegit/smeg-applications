Ext.define('PortalActions.store.Actions',{
    extend : 'Ext.data.Store',
    requires: [
        'PortalActions.model.Action'
    ],

    storeId : 'Actions',
    model: 'PortalActions.model.Action',
    data : [{
        action : 'getUser',
        desc   : 'Get User',
        icon   : 'vvicon-user',
        style  : 'color:#3366FF',
        actionType : 'data',
    },{
        action : 'getEnvironment',
        desc   : 'Get Environment',
        icon   : 'vvicon-sphere',
        style  : 'color:#800000',
        actionType : 'data'
    },{
        action : 'isLaunched',
        desc   : 'Is Active Sessions Launched',
        icon   : 'vvicon-footprint',
        style  : 'color:#0D92F4',
        actionType : 'dialog'
    },{
        action : 'close',
        desc   : 'Close Active Sessions',
        icon   : 'vvicon-cross',
        style  : 'color:#D14836'
    },{
        action : 'show',
        desc   : 'Show Active Sessions',
        icon   : 'vvicon-eye',
        style  : 'color:#777777'
    },{
        action : 'launch',
        desc   : 'Launch Active Sessions',
        icon   : 'vvicon-spotlight2',
        style  : 'color:#BF9D4F'
    },{
        action : 'scanBarcode',
        desc   : 'Scan Barcode',
        icon   : 'vvicon-barcode',
        style  : 'color:#0D92F4'
    },{
        action : 'inAppBrowser',
        desc   : 'Show inAppBrowser',
        icon   : 'vvicon-file-text',
        style  : 'color:#008000'
    },{
        action : 'getConnectionType',
        desc   : 'Get Connection Type',
        icon   : 'vvicon-connection',
        style  : 'color:#333300',
        actionType : 'dialog'
    },{
        action : 'getDeviceInformation',
        desc   : 'Get Device Info',
        icon   : 'vvicon-mobile',
        style  : 'color:#969696',
        actionType : 'data'
    // },{
    //     action : 'pickContact',
    //     desc   : 'Pick A Contact',
    //     icon   : 'vvicon-users4',
    //     style  : 'color:#33CCCC'
    },{
        action : 'emailComposer',
        desc   : 'Compose Email',
        icon   : 'vvicon-pencil',
        style  : 'color:#99CC00'
    },{
        action : 'setBadge',
        desc   : 'Set App Badge to 4',
        icon   : 'vvicon-lamp7',
        style  : 'color:#339966'
    },{
        action : 'getBadge',
        desc   : 'Get App Badge',
        icon   : 'vvicon-lamp6',
        style  : 'color:#339966'
    },{
        action : 'clearBadge',
        desc   : 'Clear App Badge',
        icon   : 'vvicon-lamp5',
        style  : 'color:#339966'
    },{
        action : 'cameraGetPicture',
        desc   : 'Take A Picture',
        icon   : 'vvicon-camera',
        style  : 'color:#993300'
    },{
        action : 'isPrintAvailable',
        desc   : 'Printing Available?',
        icon   : 'vvicon-printer4',
        style  : 'color:#FFFF99'
    },{
        action : 'printContent',
        desc   : 'Print HTML Content',
        icon   : 'vvicon-printer4',
        style  : 'color:#00A057'
    },{
        action : 'printScreen',
        desc   : 'Print App Screen',
        icon   : 'vvicon-printer4',
        style  : 'color:#00A057'
    },{
        action : 'beep',
        desc   : 'Beep',
        icon   : 'vvicon-bell',
        style  : 'color:#3366FF'
    },{
        action : 'geolocationGetCurrentPosition',
        desc   : 'Get Current Position',
        icon   : 'vvicon-location4',
        style  : 'color:#800000',
        actionType : 'data'
    },{
        action : 'signature',
        desc   : 'Get Signature',
        icon   : 'vvicon-quill',
        style  : 'color:#777777'
    }]
});