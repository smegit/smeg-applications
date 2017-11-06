Ext.define('Valence.login.util.Helper', {
    singleton                 : true,
    requires                  : [
        'Valence.common.util.Dialog'
    ],
    getHookValue         : function (prop) {
        // note do NOT reference hook as "Valence.Hook"...command will then automatically pull
        // this file into the build process which we do not want...
        //
        var hook  = Valence['Hook'],
            obj   = prop.split('.'),
            theme = localStorage.getItem('valence-theme'),
            value = hook[obj[0]];

        if (value) {
            for (var ii = 1; ii < obj.length; ii++) {
                if (!Ext.isEmpty(value)) {
                    value = value[obj[ii]];
                } else {
                    Ext.log({
                        msg : 'Property ' + prop + ' not found in Valence.Hook'
                    });
                    return null;
                }
            }

            if (value) {
                // check for theme...
                //
                if (!Ext.isEmpty(value[theme])) {
                    value = value[theme];
                } else {
                    // override to default theme...
                    //
                    value = value['default'];
                }
            }
        }
        return value;
    },

    showImageDialog : function(baseMessage, imageSrc){
        var me = this,
            message = '';

        if (!Ext.isEmpty(imageSrc)){
            var style = (Valence.login.config.Runtime.getIsDesktop()) ? 'max-width: 200px;' : '';
            message = '<div style="text-align: center;"><img src="' + imageSrc + '" cls="vv-login-img" style="' + style + '"></img></div>';
        }
        message += '<div style="margin-top:16px;">' + baseMessage + '</div>';

        Valence.common.util.Dialog.show({
            msg       : message,
            minHeight : 140,
            noButtons : true
        });
    }
});