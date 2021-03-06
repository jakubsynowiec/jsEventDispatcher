(function () {
    "use strict";

    /**
     * Aggregates an instance of the EventDispatcher class.
     *
     * @param {Object=} currentTarget (default = null) - The object that the EventDispatcher belongs to.
     * @param {jsEventDispatcher.EventDispatcher=} eventTarget (default = null) - The target object for events dispatched to the EventDispatcher object.
     *
     * @constructor
     */
    jsEventDispatcher.EventDispatcher = function (currentTarget, eventTarget) {
        
        /**
         * @type {Object}
         * @private
         */
        var _currentTarget = (currentTarget) ? currentTarget : null;
        
        /**
         * @type {Object}
         * @private
         */
        var _queuedEvents = {};
        
        /**
         * @type {jsEventDispatcher.Event[]}
         * @private
         */
        var _deferedEvents = [];

        /**
         * @type {Object}
         * @private
         */
        var _listeners = {};

        /**
         * @type {jsEventDispatcher.EventDispatcher|*}
         * @private
         */
        var _target = (eventTarget) ? eventTarget : null;

        /**
         * Registers an event listener object with an EventDispatcher object
         * so that the listener receives notification of an event.
         *
         * @param {String} type - The type of event.
         * @param {Function} listener - The listener function that processes the event. This function must accept an Event object as its only parameter and must return nothing.
         */
        this.addEventListener = function (type, listener) {
            if (!_listeners.hasOwnProperty(type)) {
                _listeners[type] = [];
            }

            if (typeof(listener) == 'function') {
                _listeners[type].push(listener);
            } else {
                throw new Error("Listener is not a function.");
            }
        };
        
        /**
         * Cancels all scheduled events.
         */
        this.cancelDeferredEvents = function () {
            /**
             * @type {Number}
             */
            var deferedEvent;

            while ((deferedEvent = _deferedEvents.pop())) {
                clearTimeout(deferedEvent);
            }
        };
        
        /**
         * Cancels all queued events.
         */
        this.cancelQueuedEvents = function () {
            for (var evtName in _queuedEvents) {
                if (_queuedEvents.hasOwnProperty(evtName)) {
                    delete _queuedEvents[evtName];
                }
            }
        };
        
        /**
         * Dispatch an event after a given time.
         *
         * @param {jsEventDispatcher.Event} event - The Event object that is dispatched into the event flow.
         * @param {Number=} iMillis (default = 1000) - Time after an event will be dispatched. In milliseconds.
         */
        this.deferEventDispatch = function (event, iMillis) {
            var self = this;
            var index = _deferedEvents.length;
            
            _deferedEvents.push(setTimeout(function () {
                self.dispatchEvent(event);
                _deferedEvents.slice(index, 1);
            }, iMillis || 1000));
        };

        /**
         * Dispatches an event into the event flow.
         *
         * @param {jsEventDispatcher.Event} event - The Event object that is dispatched into the event flow.
         */
        this.dispatchEvent = function (event) {
            event.setCurrentTarget(_currentTarget);

            if (_listeners.hasOwnProperty(event.getType())) {
                var lItr,
                    lCount,
                    listeners = _listeners[event.getType()],
                    listener;

                for (lItr = 0, lCount = listeners.length; lItr < lCount; ++lItr) {                    
                    listener = listeners[lItr];
                    listener(event);
                }
            }
            
            this._dispatchQueuedEvents(event.getType());

            if (_target !== null && event.getBubbles() === true && event.canPropagate() === true) {
                _target.dispatchEvent(event);
            }
        };
        
        /**
         * Dispatches all queued events that are waiting for {@link type}.
         * 
         * @param {String} type - The Event type.
         * @private
         */
        this._dispatchQueuedEvents = function (type) {
            if (_queuedEvents.hasOwnProperty(type)) {
                if (_queuedEvents.hasOwnProperty(type)) {
                    /**
                     * @type {jsEventDispatcher.Event}
                     */
                    var event;

                    /**
                     * @type {jsEventDispatcher.Event[]}
                     */
                    var eventsToDispatch = _queuedEvents[type].slice(0);
                    delete _queuedEvents[type];

                    while ((event = eventsToDispatch.pop())) {
                        this.dispatchEvent(event);
                    }
                }
            }
        };

        /**
         * Returns registered listeners for a specific type of event.
         *
         * @param {String} type - The type of event.
         * @return {Array} - An Array of registered listeners, if any; an empty array otherwise.
         */
        this.getEventListeners = function (type) {
            if (this.hasEventListener(type)) {
                return _listeners[type];
            }

            return [];
        };

        /**
         * Checks whether the EventDispatcher object has any listeners registered for a specific type of event.
         *
         * @param {String} type - The type of event.
         * @return {Boolean}  A value of true if a listener of the specified type is registered; false otherwise.
         */
        this.hasEventListener = function (type) {
            if (_listeners.hasOwnProperty(type)) {
                if (_listeners[type].length > 0) {
                    return true;
                }
            }

            return false;
        };
        
        /**
         * Defer event dispatching until {@link trigger} event type occurs.
         *
         * @param {String} trigger - Triggering event type.
         * @param {jsEventDispatcher.Event} event - The Event object that will be dispatched into the event flow.
         */
        this.queueEventDispatch = function (trigger, event) {
            if (!_queuedEvents.hasOwnProperty(trigger)) {
                _queuedEvents[trigger] = [];
            }

            _queuedEvents[trigger].push(event);
        };        

        /**
         * Removes a listener from the EventDispatcher object. If there is no matching
         * listener registered with the EventDispatcher object, a call to this method has no effect.
         *
         * @param {String} type - The type of event.
         * @param {Function} listener - The listener function that processes the event.
         */
        this.removeEventListener = function (type, listener) {
            if (_listeners.hasOwnProperty(type)) {
                var lItr,
                    lCount,
                    listeners = _listeners[type];

                for (lItr = 0, lCount = listeners.length; lItr < lCount; ++lItr) {
                    if (listeners[lItr] === listener) {
                        _listeners[type].splice(lItr, 1);
                        break;
                    }
                }
            }
        };
    };

})();