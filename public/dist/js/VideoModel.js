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
    global.VideoModel = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = VideoModel;

  function VideoModel(apiCaller, options, doc, custEv) {
    var _this = this;

    this.videoList = options.elements.videoList;
    this.storage = options.storage;
    this.videos = [];
    this.isOnlyMyVideos = false;
    this.placeholderPicture = options.placeholderPicture;
    this.apiCaller = apiCaller;
    this.storage.setItem('video-list', this.storage.getItem('video-list') || JSON.stringify([]));
    doc = doc || document;
    custEv = custEv || CustomEvent;

    this.getVideos = function (query) {
      _this.apiCaller(query, function (json) {
        _this.provideVideos(query, json);
      }, function () {
        console.error('timeout');
        setTimeout(function () {
          _this.getVideos(query);
        }, 3000);
      });
    };

    this.provideVideos = function (query) {
      var json = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.videos;
      _this.videos = _this.normalizeVideos(json);

      _this.videoList.dispatchEvent(new custEv('apiResponseArrived', {
        detail: _this.handleRequestReady(query)
      }));
    };

    this.handleRequestReady = function (query) {
      return _this.getFilteredVideos(query.filter, query.isOnlyMyVideos).sort(function (video1, video2) {
        return video1[query.sort.prop] > video2[query.sort.prop] ? query.sort.dir : -query.sort.dir;
      });
    };

    this.getFilteredVideos = function (filter, isOnlyMyVideos) {
      if (filter === 'all' && !isOnlyMyVideos) {
        return _this.videos;
      }

      return _this.videos.filter(function (video) {
        return (video.type === filter || filter === 'all') && (!isOnlyMyVideos || video.isOnList);
      });
    };

    this.normalizeVideos = function (videos) {
      return videos.map(function (video) {
        return Object.assign({}, {
          title: 'No title defined',
          description: '',
          picture: _this.placeholderPicture,
          viewers: 0
        }, video, {
          isOnList: ~_this.getMyVideosList().indexOf('' + video.id)
        });
      });
    };

    this.getMyVideosList = function () {
      var actualStore = [];

      try {
        actualStore = JSON.parse(_this.storage.getItem('video-list'));
      } catch (ex) {
        console.warn('Video list was corrupted, added videos were forgotten.');
      }

      return actualStore;
    };

    this.toggleList = function (e) {
      var videoId = e.target.closest('[data-video-id]').getAttribute('data-video-id');

      var actualStore = _this.getMyVideosList();

      if (!~actualStore.indexOf(videoId)) {
        actualStore.push(videoId);
      } else {
        actualStore.splice(actualStore.indexOf(videoId), 1);
      }

      _this.storage.setItem('video-list', JSON.stringify(actualStore));
    };

    this.toggleMyVideos = function () {
      _this.isOnlyMyVideos = !_this.isOnlyMyVideos;
    };

    this.validateSettings = function () {
      var input = doc.querySelector('[data-ref~="polling-interval"]');

      if (input.checkValidity()) {
        return true;
      }

      try {
        input.reportValidity();
      } catch (ex) {
        console.warn(ex);
      }

      return false;
    };
  }
});