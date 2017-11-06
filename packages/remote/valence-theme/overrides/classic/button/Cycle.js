Ext.define('Ext.overrides.classic.button.Cycle', {
    override : 'Ext.button.Cycle',

    initComponent: function() {
        //<debug>
        // Ext JS Cycle buttons are implemented in a way that clashes with WAI-ARIA requirements,
        // so we warn the developer about that.
        // Don't warn if we're under the slicer though.
        if (Ext.enableAriaButtons && !Ext.slicer) {
            // Hard error if full ARIA compatibility is enabled, otherwise a warning
            var logFn = Ext.enableAria ? Ext.log.error : Ext.log.warn;

            logFn(
                "Using Cycle buttons is not recommended in WAI-ARIA " +
                "compliant applications, because their behavior conflicts " +
                "with accessibility best practices. See WAI-ARIA 1.0 " +
                "Authoring guide: http://www.w3.org/TR/wai-aria-practices/#menubutton"
            );
        }
        //</debug>
        var me      = this,
            checked = 0,
            items,
            i, iLen, item;

        // OVERRIDE...adding this line so it may be instantiated without a menu config...
        //
        me.menu = me.menu || {items:[]};

        // Allow them to specify a menu config which is a standard Button config.
        // Remove direct use of "items" in 5.0.
        items = (me.menu.items || []).concat(me.items || []);
        me.menu = Ext.applyIf({
            cls: Ext.baseCSSPrefix + 'cycle-menu',
            items: []
        }, me.menu);

        iLen = items.length;

        // Convert all items to CheckItems
        for (i = 0; i < iLen; i++) {
            item = items[i];

            item = Ext.applyIf({
                group        : me.id,
                itemIndex    : i,
                checkHandler : me.checkHandler,
                scope        : me,
                checked      : item.checked || false
            }, item);

            me.menu.items.push(item);

            if (item.checked) {
                checked = i;
            }
        }

        me.itemCount = me.menu.items.length;
        me.callParent(arguments);
        me.on('click', me.toggleSelected, me);
        me.setActiveItem(checked, true);
    },

    // overriding setMenu so we can dynamically change this as the
    // base implementation does not convert the items to checkitems...
    //
    setMenu : function(menu){
        var me      = this,
            checked = 0,
            items,
            i, iLen, item;

        items = menu.items || [];
        iLen = items.length;

        // Convert all items to CheckItems
        for (i = 0; i < iLen; i++) {
            item = items[i];

            item = Ext.applyIf({
                group        : me.id,
                itemIndex    : i,
                checkHandler : me.checkHandler,
                scope        : me,
                checked      : item.checked || false
            }, item);

            menu.items[i] = item;

            if (item.checked) {
                checked = i;
            }
        }

        me.itemCount = me.menu.items.length;
        me.callParent(arguments);
        me.setActiveItem(checked, true);
    },

    // overriding this to simply return out...
    //
    toggleSelected: function() {
        var me = this,
            m = me.menu,
            checkItem;
        return;
        checkItem = me.activeItem.next(':not([disabled])') || m.items.getAt(0);
        checkItem.setChecked(true);
    }
});