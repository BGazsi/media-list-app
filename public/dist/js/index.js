(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["VideoListController"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("VideoListController"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.VideoListController);
    global.index = mod.exports;
  }
})(this, function (_VideoListController) {
  "use strict";

  _VideoListController = _interopRequireDefault(_VideoListController);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var videoListController = new _VideoListController.default();
    videoListController.init();
  });
});