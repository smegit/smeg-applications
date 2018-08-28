/**
 * A view controller is a controller that can be attached to a specific view
 * instance so it can manage the view and its child components. Each instance of the view
 * will have a new view controller, so the instances are isolated.
 * 
 * When a view controller is specified on a view, events and other handlers that use strings as
 * values will be automatically connected with the appropriate methods in the controller's class.
 *
 * Sample usage:
 * 
 *     @example
 *     Ext.define('MyViewController', {
 *         extend : 'Ext.app.ViewController',
 *         alias: 'controller.myview',
 *       
 *         // This method is called as a "handler" for the Add button in our view
 *         onAddClick: function() {
 *             Ext.Msg.alert('Add', 'The Add button was clicked');
 *         }
 *     });
 *   
 *     Ext.define('MyView', {
 *         extend: 'Ext.Panel',
 *         controller: 'myview',
 *
 *         items: [{
 *             xtype: 'button',
 *             text: 'Add',
 *             handler: 'onAddClick',  // calls MyViewController's onAddClick method
 *         }]
 *     });
 *   
 *     Ext.onReady(function() {
 *         new MyView({
 *             renderTo: Ext.getBody(),
 *             width: 400,
 *             height: 200
 *         });
 *     }); 
 */
Ext.define('Ext.app.ViewController', {
    extend: 'Ext.app.BaseController',
    alias: 'controller.controller',
    
    requires: [
        'Ext.app.domain.View'
    ],
    
    mixins: [
        'Ext.mixin.Factoryable'
    ],
    
    isViewController: true,

    factoryConfig: { // configure Factoryable
        type: 'controller'
    },

    config: {
        closeViewAction: 'destroy'
    },

    view: null,

    constructor: function() {
        this.compDomain = new Ext.app.domain.View(this);
        this.callParent(arguments);
    },

    /**
     * @method
     *
     * Called before the view initializes. This is called before the view's
     * initComponent method has been called.
     * @param {Ext.Component} view The view
     * @protected
     */
    beforeInit: Ext.emptyFn,

    /**
     * @method
     *
     * Called when the view initializes. This is called after the view's initComponent
     * method has been called.
     * @param {Ext.Component} view The view
     * @protected
     */
    init: Ext.emptyFn,

    /**
     * @method
     *
     * Called when the view model instance for an attached view is first created.
     * @param {Ext.app.ViewModel} viewModel The ViewModel
     * @protected
     */
    initViewModel: Ext.emptyFn,

    /**
     * Destroy the view controller.
     */
    destroy: function() {
        var me = this,
            domain = me.compDomain;

        if (domain) {
            domain.unlisten(me);
            domain.destroy();
        }
        me.compDomain = me.view = null;
        me.callParent();
    },

    /**
     * This method closes the associated view. The manner in which this is done (that is,
     * the method called to close the view) is specified by `closeViewAction`.
     *
     * It is common for views to map one or more events to this method to allow the view
     * to be closed.
     */
    closeView: function () {
        var view = this.getView(),
            action;

        if (view) {
            action = this.getCloseViewAction();
            view[action]();
        }
    },

    control: function(selectors, listeners) {
        var obj = selectors;
        if (Ext.isString(selectors)) {
            obj = {};
            obj[selectors] = listeners;
        }

        this.compDomain.listen(obj, this);
    },
    
    listen: function(to, controller) {
        var component = to.component;
        if (component) {
            to = Ext.apply({}, to);
            delete to.component;
            this.control(component);
        }
        this.callParent([to, controller]);
    },

    applyId: function(id) {
        if (!id) {
            id = Ext.id(null, 'controller-');
        }
        return id;
    },

    /**
     * @inheritdoc Ext.container.Container#getReferences
     * @since 5.0.0
     */
    getReferences: function () {
        var view = this.view;
        return view && view.getReferences();
    },

    /**
     * Get the view for this controller.
     * @return {Ext.Component} The view.
     */
    getView: function() {
        return this.view;
    },

    /**
     * Gets a reference to the component with the specified {@link Ext.Component#reference}
     * value.
     *
     * The method is a short-hand for the {@link #lookupReference} method.
     *
     * @param {String} key The name of the reference to lookup.
     * @return {Ext.Component} The component, `null` if the reference doesn't exist.
     * @since 6.0.1
     */
    lookup: function (key) {
        var view = this.view;
        return view && view.lookup(key);
    },

    /**
     * Gets a reference to the component with the specified {@link Ext.Component#reference}
     * value.
     *
     * The {@link #lookup} method is a short-hand version of this method.
     *
     * @param {String} key The name of the reference to lookup.
     * @return {Ext.Component} The component, `null` if the reference doesn't exist.
     * @since 5.0.0
     */
    lookupReference: function (key) {
        return this.lookup(key);
    },

    /**
     * Get a {@link Ext.data.Session} attached to the view for this controller.
     * See {@link Ext.Component#lookupSession}.
     * 
     * @return {Ext.data.Session} The session. `null` if no session is found.
     *
     * @since 5.0.0
     */
    getSession: function () {
        var view = this.view;
        return view && view.lookupSession();
    },

    /**
     * Get a {@link Ext.app.ViewModel} attached to the view for this controller.
     * See {@link Ext.Component#lookupViewModel}.
     * 
     * @return {Ext.app.ViewModel} The ViewModel. `null` if no ViewModel is found.
     *
     * @since 5.0.0
     */
    getViewModel: function () {
        var view = this.view;
        return view && view.lookupViewModel();
    },

    /**
     * Get a {@link Ext.data.Store} attached to the {@link #getViewModel ViewModel} attached to
     * this controller. See {@link Ext.app.ViewModel#getStore}.
     * @param {String} name The name of the store.
     * @return {Ext.data.Store} The store. `null` if no store is found, or there is no 
     * {@link Ext.app.ViewModel} attached to the view for this controller.
     *
     * @since 5.0.0
     */
    getStore: function(name) {
        var viewModel = this.getViewModel();
        return viewModel ? viewModel.getStore(name) : null;
    },

    /**
     * Fires an event on the view. See {@link Ext.Component#fireEvent}.
     * @param {String} eventName The name of the event to fire.
     * @param {Object...} args Variable number of parameters are passed to handlers.
     * @return {Boolean} returns false if any of the handlers return false otherwise it returns true.
     * @protected
     */
    fireViewEvent: function (eventName, args) {
        var view = this.view,
            result = false,
            a = arguments;

        if (view) {
            if (view !== args) {
                a = Ext.Array.slice(a);

                a.splice(1, 0, view); // insert view at [1]
            }

            result = view.fireEvent.apply(view, a);
        }

        return result;
    },

    //=========================================================================
    privates: {
        view: null,

        /**
         * Set a reference to a component.
         * @param {Ext.Component} component The component to reference
         * @private
         */
        attachReference: function (component) {
            var view = this.view;
            if (view) {
                view.attachReference(component);
            }
        },
        
        /**
         * Clear a reference to a component
         * @param {Ext.Component} ref The component to reference
         * 
         * @private
         */
        clearReference: function(ref) {
            var view = this.view;
            if (view) {
                view.clearReference(ref);
            }
        },

        /**
         * Invalidates the references collection. Typically called when
         * removing a container from this container, since it's difficult
         * to know what references got removed.
         *
         * @private
         */
        clearReferences: function () {
            var view = this.view;
            if (view) {
                view.clearReferences();
            }
        },

        /**
         * Sets the view for this controller. To be called by the view
         * when it initializes.
         * @param {Object} view The view.
         *
         * @private
         */
        setView: function(view) {
            this.view = view;

            if (!this.beforeInit.$nullFn) {
                this.beforeInit(view);
            }
        }
    }
});
