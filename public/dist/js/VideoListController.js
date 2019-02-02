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
    global.VideoListController = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = VideoListController;

  function VideoListController(model, view, options, doc, win) {
    var _this = this;

    this.videoModel = model;
    this.videoListView = view;
    this.videoList = options.elements.videoList;
    this.filterForm = options.elements.filterForm;
    this.myVideosButton = options.elements.myVideosButton;
    this.settingsButton = options.elements.settingsButton;
    this.pollingIntervalInput = options.elements.pollingIntervalInput;
    this.pollInterval = this.pollingIntervalInput.value;
    this.pollTimerId = options.pollTimerId || false;
    doc = doc || document;
    win = win || window;

    this.init = function () {
      _this.getVideos();

      _this.attachEventListeners();

      _this.startPolling();
    };

    this.attachEventListeners = function () {
      _this.videoList.addEventListener('apiResponseArrived', _this.handleApiResponse);

      _this.filterForm.addEventListener('change', _this.handleFilterFormChange);

      _this.myVideosButton.addEventListener('click', _this.toggleMyVideos);

      _this.settingsButton.addEventListener('click', _this.toggleSettings);

      _this.pollingIntervalInput.addEventListener('input', _this.handlePollingIntervalInput);

      _this.pollingIntervalInput.addEventListener('blur', _this.handlePollingIntervalSave);
    };

    this.handleApiResponse = function (e) {
      _this.videoListView.renderList(e.detail);

      doc.querySelectorAll('[data-ref~="add-to-list"]').forEach(function (btn) {
        btn.addEventListener('click', _this.toggleVideoOnList);
      });
    };

    this.handleFilterFormChange = function () {
      _this.videoListView.updateQuery();

      _this.videoModel.getVideos(_this.videoListView.getQuery());
    };

    this.toggleMyVideos = function () {
      _this.videoListView.toggleMyVideos();

      _this.videoModel.provideVideos(_this.videoListView.query);
    };

    this.toggleSettings = function () {
      _this.videoListView.toggleSettings();
    };

    this.handlePollingIntervalInput = function () {
      _this.videoModel.validateSettings();
    };

    this.handlePollingIntervalSave = function () {
      if (_this.videoModel.validateSettings()) {
        _this.pollInterval = _this.pollingIntervalInput.value;

        _this.startPolling();
      }
    };

    this.toggleVideoOnList = function (e) {
      _this.videoModel.toggleList(e);

      _this.videoListView.toggleList(e, _this.videoModel.getMyVideosList());
    };

    this.startPolling = function () {
      if (_this.pollTimerId) {
        win.clearTimeout(_this.pollTimerId);
      }

      _this.pollTimerId = setInterval(_this.getVideos, _this.pollInterval);
    };

    this.getVideos = function () {
      _this.videoModel.getVideos(_this.videoListView.getQuery());
    };
  }
});