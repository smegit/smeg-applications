Ext.define('Ext.overrides.classic.window.MessageBox', {
    override    : 'Ext.window.MessageBox',
    bodyStyle   : {
        "background-color" : "#fff"
    },
    bodyPadding : '0 16',
    buttonAlign : 'right',
    makeButton  : function (btnIdx) {
        var btnId = this.buttonIds[btnIdx];
        return new Ext.button.Button({
            handler  : this.btnCallback,
            itemId   : btnId,
            scope    : this,
            text     : this.buttonText[btnId],
            minWidth : 75,
            ui       : 'transparent-action-blue',
            scale    : 'medium'
        });
    }
});