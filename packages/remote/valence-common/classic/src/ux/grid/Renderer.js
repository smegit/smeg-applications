Ext.define('Valence.common.ux.grid.Renderer', {
    singleton : true,
    tick      : function(v){
        if (v === 'Y' || v === true || v == 1){
            return '<div class="vvicon-in-cell vvicon-checkmark"></div>';
        }
    }
});