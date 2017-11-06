/**
 * The Common.plugin.EmptyText plugin injects empty text on the component. It relies on the component
 * to provide emptyText either as a string or an object.  It will add a setIsEmpty method on the component
 * so the component can notify the plugin to show or hide the empty text. It looks at isEmpty on the component
 * to determine if it should show/hide the empty text.
 *
 * If you the empty text to show when the component is created just set the isEmpty to true. If isEmpty is not
 * found it assumes the component is not empty.
 *
 * ## Example emptyText as an object
 *     @example
 *     Ext.create('Common.form.Panel', {
 *         plugins : [{
 *             ptype : 'emptytext',
 *         }],
 *         isEmpty   : false,
 *         emptyText :   {
 *             heading     :   'No orders matched your search.',
 *             subText     :   'Try another search combination or run one of your previously {0}.',
 *             events      :   [{
 *                 text    :   'saved searches',
 *                 event   :   'savedsearch'
 *             }]
 *          }
 *     });
 *
 * Runtime showing or hiding the empty text
 *     @example
 *     component.setIsEmpty(true);
 *     component.setIsEmpty(false);
 *
 * ## Example emptyText as an object
 * emptyText {Object} : {
 *     heading : {String} Provides the main text for the emptyText
 *     subText : {String} (optional) Provides additional options for the users
 *     events  : {Array of "event" Objects} (requires subText to be provided as a formatted string.
 *     See Ext.util.Format.format()) Provide links for the user to perform other actions
 *     [{
 *          text    : {String}
 *          event   : {String} (lowercase) is used as the data-event property
 *     }]
 * }
 */
Ext.define('Valence.common.ux.plugin.EmptyText', {
    alias    : 'plugin.emptytext',
    extend   : 'Ext.plugin.Abstract',
    requires : [
        'Ext.dom.Helper',
        'Valence.common.util.Helper'
    ],
    pluginId : 'emptytext',
    config   : {
        parentComponent : null,
        emptyElement    : null,
        hiddenClass     : 'vv-plugin-empty-text-hidden'
    },
    init     : function (cmp) {
        var me = this;

        //store the component
        //
        me.setParentComponent(cmp);

        //start the setup of the empty text
        //
        me.setup(cmp);
    },

    /**
     * Create the empty text
     */
    createEmptyElement : function (cmp) {
        var me        = this,
            cls       = 'vv-plugin-empty-text',
            emptyText = cmp.emptyText,
            cmpEl     = cmp.getEl();

        //if empty text is just a string set it as an object with
        // the value in the heading
        //
        if (Ext.isString(emptyText)) {
            emptyText = {
                heading : emptyText
            };
        }

        //default to not empty if isEmpty is not provided
        //
        if (Ext.isEmpty(cmp.isEmpty)){
            cmp.isEmpty = false;
        }

        //check if we should default the empty text to hidden
        //
        if (!cmp.isEmpty) {
            cls += ' ' + me.getHiddenClass();
        }

        //add the empty text to the parent
        //
        me.setEmptyElement(Ext.get(Ext.dom.Helper.insertFirst(cmpEl, {
            tag : 'div',
            cls : cls,
            cn  : [Valence.common.util.Helper.buildEmptyText(emptyText)]
        })));

        //set the click listener on the component
        //
        cmpEl.mon(cmpEl, {
            scope    : me,
            delegate : 'span.vv-empty-text-event',
            click    : me.onClickParentComponent
        });
    },

    /**
     * Fire event when user clicks on empty text items if available
     */
    onClickParentComponent : function (e) {
        var me    = this,
            el    = Ext.get(e.getTarget()),
            event = el.getAttribute('data-event'),
            cmp   = me.getParentComponent();

        //fire the empty text events when passed in
        //
        if (event && !Ext.isEmpty(cmp)) {
            cmp.fireEvent(event, cmp);
        }
    },

    /**
     * Set isEmpty and show/hide the empty text
     */
    setIsEmpty : function (value) {
        var me  = this,
            cmp = me.getParentComponent(),
            el  = me.getEmptyElement();

        cmp.isEmpty = value;

        if (el){
            if (!value) {
                //hide the empty text
                //
                el.addCls(me.getHiddenClass());
            } else {
                //show the empty text
                //
                el.removeCls(me.getHiddenClass());
            }
        }
    },

    /**
     * Setup the empty text.
     */
    setup : function(cmp){
        var me = this;

        //make sure the component doesn't already have a method of `setIsEmpty` and provides
        // emptyText
        //
        if (Ext.isEmpty(cmp.setIsEmpty) && !Ext.isEmpty(cmp.emptyText)) {
            //add the setIsEmpty method on the component
            // that will show and hide empty text
            //
            cmp.setIsEmpty = Ext.bind(me.setIsEmpty, me);

            //create the empty text once we have the components element
            //
            if (!Ext.isEmpty(cmp.getEl())) {
                me.createEmptyElement(cmp);
            } else {
                cmp.on({
                    scope       : me,
                    afterrender : me.createEmptyElement
                });
            }
        } else {
            if (Ext.isEmpty(cmp.setIsEmpty)) {
                Ext.log({
                    msg : 'Valence.common.plugin.EmptyText not able to act on component because it already has a setIsEmpty method.'
                });
            } else {
                Ext.log({
                    msg : 'Valence.common.plugin.EmptyText is attached but emptyText is not set.'
                });
            }
        }
    }
});