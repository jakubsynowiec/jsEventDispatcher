(function () {
    "use strict";

    /**
     * Creates an Event object to pass as a parameter to event listeners.
     *
     * @param {String} type - The type of event.
     * @param {Object=} origin (default = null) - The object that the event originated from.
     * @param {Boolean=} bubbles (default = false) - Indicates whether an event is a bubbling event.
     * @param {Boolean=} cancelable (default = false) - Indicates whether the behavior associated with the event can be prevented.
     *
     * @constructor
     */
    jsEventDispatcher.Event = function (type, origin, bubbles, cancelable) {
        /**
         * Indicates whether an event is a bubbling event. If the event can bubble,
         * this value is true; otherwise it is false.
         *
         * @type {Boolean}
         * @private
         */
        var _bubbles = (typeof(bubbles) === 'boolean') ? bubbles : false;

        /**
         * Indicates whether the behavior associated with the event can be prevented.
         * If the behavior can be canceled, this value is true; otherwise it is false.
         *
         * @type {Boolean}
         * @private
         */
        var _cancelable = (typeof(cancelable) === 'boolean') ? cancelable : false;

        /**
         * The object that is actively processing the Event object with an event
         * listener.
         *
         * @type {Object}
         * @private
         */
        var _currentTarget;

        /**
         * @type {Number}
         * @private
         */
        var _FLAGS = 0x00;

        /**
         * The object that the event originated from.
         *
         * @type {Object}
         * @private
         */
        var _origin = (origin) ? origin : null;

        /**
         * The type of event. The type is case-sensitive.
         *
         * @type {String}
         * @private
         */
        var _type = type;

        /**
         * The time (in milliseconds since the epoch) when
         * the event was created.
         *
         * @type {Number}
         * @private
         */
        var _timestamp = new Date().getTime();

        /**
         * @param {Number} flag
         * @private
         */
        var _setFlag = function (flag) {
            _FLAGS |= flag;
        };

        /**
         * @param {Number} flag
         * @private
         */
        var _clearFlag = function (flag) {
            if (_hasFlag(flag)) {
                _FLAGS ^= flag;
            }
        };

        /**
         * @param {Number} flag
         * @return {Boolean}
         * @private
         */
        var _hasFlag = function (flag) {
            return (_FLAGS & flag) == flag;
        };

        /**
         * @private
         */
        var _resetFlags = function () {
            _FLAGS = 0x00;
        };

        /**
         * Checks whether the {@link #stopPropagation} method has been called on the event.
         * If the {@link #stopPropagation} method has been called, returns true; otherwise, returns false.
         *
         * @return {Boolean}
         * @ignore
         */
        this.canPropagate = function () {
            return !_hasFlag(STOP_PROPAGATION);
        };

        /**
         * @see _bubbles
         * @return {Boolean}
         */
        this.getBubbles = function () {
            return _bubbles;
        };

        /**
         * @see _cancelable
         * @return {Boolean}
         */
        this.getCancelable = function () {
            return _cancelable;
        };

        /**
         * @see _currentTarget
         * @return {Object}
         */
        this.getCurrentTarget = function () {
            return _currentTarget;
        };

        /**
         * @see _origin
         * @return {Object}
         */
        this.getOrigin = function () {
            return _origin;
        };

        /**
         * @see _type
         * @return {String}
         */
        this.getType = function () {
            return _type;
        };

        /**
         * @see _timestamp
         * @return {Number}
         */
        this.getTimestamp = function () {
            return _timestamp;
        };

        /**
         * Checks whether the {@link #preventDefault} method has been called on the event.
         * If the {@link #preventDefault} method has been called, returns true; otherwise, returns false.
         *
         * @return {Boolean}
         */
        this.isDefaultPrevented = function () {
            return _hasFlag(PREVENT_DEFAULTS);
        };

        /**
         * Cancels an event's default behavior if that behavior can be canceled.
         *
         * You can use the {@link _cancelable} property to check whether you can
         * prevent the default behavior associated with a particular event. If the
         * value of {@link _cancelable} is true, then {@link #preventDefault} can be used
         * to cancel the event; otherwise, {@link #preventDefault} has no effect.
         */
        this.preventDefault = function () {
            if (_cancelable) {
                _setFlag(PREVENT_DEFAULTS);
            }
        };

        /**
         * @see _currentTarget
         * @param {Object} target
         */
        this.setCurrentTarget = function (target) {
            _currentTarget = target;
        };

        /**
         * Prevents processing of any event listeners. Additional calls to this method
         * have no effect. This method does not cancel the behavior associated with
         * this event; see {@link #preventDefault} for that functionality.
         */
        this.stopPropagation = function () {
            _setFlag(STOP_PROPAGATION);
        };
    };

    /**
     * @type {Number}
     * @const
     */
    var PREVENT_DEFAULTS = 0x01;

    /**
     * @type {Number}
     * @const
     */
    var STOP_PROPAGATION = 0x02;

})();