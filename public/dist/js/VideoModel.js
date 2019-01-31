(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./JsonP.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./JsonP.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.JsonP);
    global.VideoModel = mod.exports;
  }
})(this, function (_exports, _JsonP) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = VideoModel;
  _JsonP = _interopRequireDefault(_JsonP);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function VideoModel() {
    this.videoList = document.querySelector('[data-ref~="video-list"]');
    this.videos = [];
    this.isOnlyMyVideos = false;
    this.jsonP = new _JsonP.default();
    window.localStorage.setItem('video-list', window.localStorage.getItem('video-list') || JSON.stringify([]));

    this.getVideos = function (query) {
      var _this = this;

      this.jsonP.send('http://146.185.158.18/fake_api.php', {
        callbackName: 'jsonp',
        successCallback: function successCallback(json) {
          _this.videos = _this.normalizeVideos(json);
          _this.videos = _this.handleRequestReady(query);

          _this.videoList.dispatchEvent(new CustomEvent('apiResponseArrived', {
            detail: _this.videos
          }));
        },
        timeoutCallback: function timeoutCallback() {
          console.error('timeout');
          setTimeout(function () {
            _this.getVideos(query);
          }, 3000);
        },
        timeout: 3000
      });
    };

    this.handleRequestReady = function (query) {
      return this.getFilteredVideos(query.filter).sort(function (video1, video2) {
        return video1[query.sort.prop] > video2[query.sort.prop] ? query.sort.dir : -query.sort.dir;
      });
    };

    this.getFilteredVideos = function (filter) {
      if (!filter) {
        return this.videos;
      }

      return this.videos.filter(function (video) {
        return video.type === filter;
      });
    };

    this.normalizeVideos = function (videos) {
      var _this2 = this;

      return videos.map(function (video) {
        return Object.assign({}, {
          title: 'No title defined',
          description: '',
          picture: 'http://placehold.it/300x300',
          viewers: 0,
          isOnList: ~_this2.getMyVideosList().indexOf('' + video.id)
        }, video);
      });
    };

    this.getMyVideosList = function () {
      var actualStore = [];

      try {
        actualStore = JSON.parse(window.localStorage.getItem('video-list'));
      } catch (ex) {
        console.warn('Video list was corrupted, added videos were forgotten.');
      }

      return actualStore;
    };

    this.toggleList = function (e) {
      var videoId = e.target.closest('[data-video-id]').getAttribute('data-video-id');
      var actualStore = this.getMyVideosList();

      if (!~actualStore.indexOf(videoId)) {
        actualStore.push(videoId);
      } else {
        actualStore.splice(actualStore.indexOf(videoId), 1);
      }

      window.localStorage.setItem('video-list', JSON.stringify(actualStore));
    };

    this.toggleMyVideos = function () {
      this.isOnlyMyVideos = !this.isOnlyMyVideos;
    };

    this.validateSettings = function () {
      var input = document.querySelector('[data-ref~="polling-interval"]');

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