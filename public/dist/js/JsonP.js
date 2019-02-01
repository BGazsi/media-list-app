(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.JsonP = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = JsonP;

  function JsonP() {
    var _this = this;

    this.send = function (src, options) {
      _this.cleanUp();

      var jsonpCallbackName = options.callbackName || 'jsonp',
          successCallback = options.successCallback || function () {},
          timeoutCallback = options.timeoutCallback || function () {},
          timeout = options.timeout || 3000;

      var timeoutTrigger = window.setTimeout(function () {
        window[jsonpCallbackName] = function () {};

        _this.cleanUp();

        timeoutCallback();
      }, timeout);

      window[jsonpCallbackName] = function (data) {
        window.clearTimeout(timeoutTrigger);

        _this.cleanUp();

        successCallback(data);
      };

      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-ref', 'jsonp-script');
      script.src = src;
      document.getElementsByTagName('head')[0].appendChild(script);
    };

    this.cleanUp = function () {
      var prevScript = document.querySelector('[data-ref~="jsonp-script"]');

      if (!!prevScript) {
        prevScript.remove();
      }
    };
  }
});