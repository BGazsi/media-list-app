(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./VideoModel.js", "./VideoListView.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./VideoModel.js"), require("./VideoListView.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.VideoModel, global.VideoListView);
    global.VideoListController = mod.exports;
  }
})(this, function (_exports, _VideoModel, _VideoListView) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = VideoListController;
  _VideoModel = _interopRequireDefault(_VideoModel);
  _VideoListView = _interopRequireDefault(_VideoListView);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function VideoListController() {
    this.videoModel = new _VideoModel.default();
    this.videoListView = new _VideoListView.default();
    this.videoList = document.querySelector('[data-ref~="video-list"]');
    this.filterForm = document.querySelector('[data-ref~="filter-form"]');
    this.pollTimerId = false;
    this.pollInterval = document.querySelector('[data-ref~="polling-interval"]').value;

    this.init = function () {
      this.videoModel.getVideos(this.videoListView.getQuery());
      this.attachEventListeners(); // this.startPolling()
    };

    this.attachEventListeners = function () {
      var _this = this;

      this.videoList.addEventListener('apiResponseArrived', function (e) {
        _this.videoListView.renderList(e.detail, _this.videoModel.isOnlyMyVideos);

        document.querySelectorAll('[data-ref~="add-to-list"]').forEach(function (btn) {
          btn.addEventListener('click', function (e) {
            _this.videoModel.toggleList(e);

            _this.videoListView.toggleList(e, _this.videoModel.getMyVideosList());
          });
        });
      });
      this.filterForm.addEventListener('change', function () {
        _this.videoListView.updateQuery(_this.filterForm);

        _this.videoModel.getVideos(_this.videoListView.getQuery());
      });
      document.querySelector('[data-ref~="my-videos"]').addEventListener('click', function () {
        _this.videoListView.toggleMyVideos(_this.videoModel.getMyVideosList(), _this.videoModel.isOnlyMyVideos);

        _this.videoModel.toggleMyVideos();
      });
      document.querySelector('[data-ref~="settings-button"]').addEventListener('click', function () {
        _this.videoListView.toggleSettings();
      });
      var pollingIntervalInput = document.querySelector('[data-ref~="polling-interval"]');
      pollingIntervalInput.addEventListener('input', function () {
        _this.videoModel.validateSettings();
      });
      pollingIntervalInput.addEventListener('blur', function () {
        if (_this.videoModel.validateSettings()) {
          _this.pollInterval = pollingIntervalInput.value;

          _this.startPolling();
        }
      });
    };

    this.startPolling = function () {
      var _this2 = this;

      if (this.pollTimerId) {
        window.clearTimeout(this.pollTimerId);
      }

      this.pollTimerId = setInterval(function () {
        _this2.videoModel.getVideos(_this2.videoListView.getQuery());
      }, this.pollInterval);
    };
  }
});