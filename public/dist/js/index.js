(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["VideoListController", "VideoModel", "VideoListView", "JsonP"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("VideoListController"), require("VideoModel"), require("VideoListView"), require("JsonP"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.VideoListController, global.VideoModel, global.VideoListView, global.JsonP);
    global.index = mod.exports;
  }
})(this, function (_VideoListController, _VideoModel, _VideoListView, _JsonP) {
  "use strict";

  _VideoListController = _interopRequireDefault(_VideoListController);
  _VideoModel = _interopRequireDefault(_VideoModel);
  _VideoListView = _interopRequireDefault(_VideoListView);
  _JsonP = _interopRequireDefault(_JsonP);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var apiUrl = 'http://146.185.158.18/fake_api.php';

  function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var videoList = document.querySelector('[data-ref~="video-list"]');
    var model = new _VideoModel.default(createJsonPClosure(), {
      storage: window.localStorage,
      placeholderPicture: 'http://placehold.it/300x300',
      elements: {
        videoList: videoList
      }
    });
    var view = new _VideoListView.default({
      elements: {
        videoList: videoList,
        myVideosBtnText: document.querySelector('[data-ref~="my-videos"] .header-btn-text'),
        sortSelect: document.querySelector('[data-ref~="sort-select"]'),
        filterSelect: document.querySelector('[data-ref~="filter-select"]'),
        settingsBox: document.querySelector('[data-ref~="settings-box"]')
      }
    });
    var videoListController = new _VideoListController.default(model, view, {
      elements: {
        videoList: videoList,
        filterForm: document.querySelector('[data-ref~="filter-form"]'),
        myVideosButton: document.querySelector('[data-ref~="my-videos"]'),
        settingsButton: document.querySelector('[data-ref~="settings-button"]'),
        pollingIntervalInput: document.querySelector('[data-ref~="polling-interval"]')
      }
    });
    videoListController.init();
  });

  function createJsonPClosure() {
    var jsonP = new _JsonP.default();
    return function (query, success, timeout) {
      jsonP.send(apiUrl, {
        callbackName: 'jsonp',
        successCallback: success,
        timeoutCallback: timeout,
        timeout: 3000
      });
    };
  }
});