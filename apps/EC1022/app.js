// @require @packageOverrides
Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    models: [
        'Main'
    ],
    stores: [
        'Main'
    ],
    views: [
        'Main',
        'EditWindow',
        'ContextMenu'
    ],
    controllers: [
        'Main',
        'Window'
    ],
    name: 'EC1022',

    init: function() {
        Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider'));
    },

    launch: function() {
        //load the theme current theme
        //
        var theme = Ext.getUrlParam('theme'),
            path = '/SmegApps/css/desktop/autoCode/' + theme + '.css',
            head = document.head,
            link = document.createElement('link');

        link.id   = 'portaltheme';
        link.type = 'text/css';
        link.rel  = 'stylesheet';
        link.href = path;
        head.appendChild(link);
        
        Ext.create('EC1022.view.Main');
    },

    encodeProperties: function(obj) {
        var mapObj = {
            "#":"p",
            "$":"s",
            "@":"a"
        };
        Ext.Object.each(obj,function(prop,val) {
            text = prop;
            text = text.replace(/#|\$|@/g, function(matched) {
                return mapObj[matched];
            });
            if (text !== prop) {
                delete obj[prop];
                obj[text] = val;
            }
        });
        return obj;
    },

    decodeProperties: function(obj) {
        var mapObj = {
            "p":"#",
            "s":"$",
            "a":"@"
        };
        Ext.Object.each(obj,function(prop,val) {
            text = prop;
            text = text.replace(/p|s|a/g, function(matched) {
                return mapObj[matched];
            });
            if (text !== prop) {
                delete obj[prop];
                obj[text] = val;
            }
        });
        return obj;
    }
});