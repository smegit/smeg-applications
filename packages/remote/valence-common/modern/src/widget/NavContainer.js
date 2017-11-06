/**
 * allows for the simple sliding to new view and "back" to home view
 */

Ext.define('Valence.common.widget.NavContainer',{
    extend : 'Ext.Container',
    xtype : 'widget_navcontainer',

    layout : {
        type : 'card',
        animation : 'slide'
    },

    bind : {
        activeItem : '{activeItem}'
    },

    cls : 'vv-navcnt',

    /**
     * Animates back to the 0 index card unless specified otherwise and resets the slide direction.
     * @param {Number} [activeItem] (optional) The card to animate.
     * @param {String} [slideDirection] (optional) `right` or 'left' are acceptable parameters. Generally, you will want to use the default.
     * @param {boolean} [destroy] (optional) destroy the the component that is being hidden
     */

    animateBackToView : function(activeCard,slideDirection,destroy){
        var me = this,
            activeItem = me.getActiveItem(),
            animation = me.getLayout().getAnimation(),
            defaultDirection = animation.getDirection();

        animation.setDirection(Ext.isEmpty(slideDirection) ? 'right' : slideDirection);

        me.setActiveItem(Ext.isEmpty(activeCard) ? 0 : activeCard);

        setTimeout(function(){
            if (destroy){
                activeItem.destroy();
            }
            animation.setDirection(defaultDirection);
        },300);
    }
});
