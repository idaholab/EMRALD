// Copyright 2021 Battelle Energy Alliance

"use strict";

var CustomEvent = (function () {

  function CustomEventInfo(name, fnc, self) {
    var _name = name;
    var _fnc = fnc;
    var _self = self;
    Object.defineProperty(this, "name", { get: function () { return _name; }, set: function (value) { _name = value; }, enumerable: true, configurable: false });
    Object.defineProperty(this, "func", { get: function () { return _fnc; }, set: function (value) { _fnc = value; }, enumerable: true, configurable: false });
    Object.defineProperty(this, "self", { get: function () { return _self; }, set: function (value) { _self = value; }, enumerable: true, configurable: false });
  }


  function CustomEventObject(name) {
    var _name = name;
    var _properties = [];
    var _consumed = false;
    Object.defineProperty(this, "name", { get: function () { return _name; }, set: function (value) { _name = value; }, enumerable: true, configurable: false });
    Object.defineProperty(this, "properties", { get: function () { return _properties; }, set: function (value) { _properties = value; }, enumerable: true, configurable: false });
    Object.defineProperty(this, "isConsumed", { get: function () { return _consumed; }, set: function (value) { _consumed = value; }, enumerable: true, configurable: false });

    for (var i = 1; i < arguments.length; i += 2) {
      if (arguments[i + 1] != null) {
        this.properties[arguments[i]] = arguments[i + 1];
      }
    }
  };

  CustomEventObject.prototype.getProperty = function (key) {
    return this.properties[key];
  };


  function CustomEvent(eventSource) {
    //private
    var _eventListeners = null;
    var _eventsEnabled = true;
    var _eventSource = eventSource;

    //public
    Object.defineProperty(this, "eventSource", { get: function () { return _eventSource; }, set: function (value) { _eventSource = value; }, enumerable: true, configurable: true });
    Object.defineProperty(this, "isEventsEnabled", { get: function () { return _eventsEnabled; }, set: function (value) { _eventsEnabled = value; }, enumerable: true, configurable: true });
    Object.defineProperty(this, "eventListeners", { get: function () { return _eventListeners; }, set: function (value) { _eventListeners = value; }, enumerable: true, configurable: true });
  
  }

  CustomEvent.prototype.addListener = function (name, funct, owner) {
    if (this.eventListeners == null) {
      this.eventListeners = [];
    }
    this.eventListeners.push(new CustomEventInfo(name, funct, owner));
  };


  CustomEvent.prototype.fireEvent = function (evt, sender) {
    if (this.eventListeners != null && this.isEventsEnabled) {
      if (evt == null) {
        evt = new CustomEventObject();
      }

      if (sender == null) {
        sender = this.getEventSource;
      }

      if (sender == null) {
        sender = this;
      }

      var args = [sender, evt];

      for (var i = 0; i < this.eventListeners.length; i++) {
        var listen = this.eventListeners[i];

        if (listen == null || listen.name == evt.name) {
          listen.func.apply(listen.self, args);
        }
      }
    }
  };

  CustomEvent.prototype.removeListener = function (owner, func) {
    var i = 0;
    while (i < this.eventListeners.length) {
      var listen = this.eventListeners[i];
      if (listen.self == owner && listen.func == func) {
        this.eventListeners.splice(i, 1);
      }
      else
        ++i;
    }
  }

  CustomEvent.prototype.removeAllListeners = function () {
    delete this.eventListeners;
    this.eventListeners = null;
  }
  CustomEvent.CustomEventObject = CustomEventObject;
  return CustomEvent;
})();
