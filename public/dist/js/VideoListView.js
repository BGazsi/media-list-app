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
    global.VideoListView = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = VideoListView;

  function VideoListView(options, doc) {
    var _this = this;

    this.videoList = options.elements.videoList;
    this.myVideosBtnText = options.elements.myVideosBtnText;
    this.sortSelect = options.elements.sortSelect;
    this.filterSelect = options.elements.filterSelect;
    this.settingsBox = options.elements.settingsBox;
    doc = doc || document;
    this.query = {
      sort: {
        dir: 1,
        prop: 'title'
      },
      filter: 'all',
      isOnlyMyVideos: false
    };

    this.getVideoCardTemplate = function (video) {
      var btnText = !video.isOnList ? 'Add to watch it later' : 'Remove from watch it later';
      var active = video.isOnList ? 'active' : '';
      return "<div class=\"img-container\">\n                <div class=\"live ".concat(video.type, "\">live</div>\n                <img class=\"thumb-img\" src=\"").concat(video.picture, "\" alt=\"").concat(video.title, "\" data-ref=\"picture\">\n            </div>\n            <h3 data-ref=\"title\">").concat(video.title, "</h3>\n            <article data-ref=\"description\">").concat(video.description, "</article>\n            <p class=\"viewers\">Viewers: <strong data-ref=\"viewers\">").concat(video.viewers, "</strong></p>\n            <button class=\"btn btn-default btn-block add-btn ").concat(active, "\" data-ref=\"add-to-list\">").concat(btnText, "</button>");
    };

    this.createVideoCard = function (video) {
      var newElement = doc.createElement('div');
      newElement.classList.add('col', 'video-card');
      newElement.setAttribute('data-video-id', video.id);
      newElement.setAttribute('data-ref', 'video-card');
      newElement.innerHTML = _this.getVideoCardTemplate(video);
      return newElement;
    };

    this.addVideoCard = function (card) {
      _this.videoList.appendChild(card);
    };

    this.renderList = function (videos) {
      _this.videoList.innerHTML = '';
      videos.forEach(function (video) {
        _this.addVideoCard(_this.createVideoCard(video));
      });
    };

    this.getQuery = function () {
      return _this.query;
    };

    this.updateQuery = function () {
      _this.query.sort = _this.createSortQuery(_this.sortSelect);
      _this.query.filter = _this.filterSelect.value;
    };

    this.createSortQuery = function (select) {
      return {
        dir: select.value.split('|')[1],
        prop: select.value.split('|')[0]
      };
    };

    this.toggleList = function (e, myVideos) {
      var btn = e.target;
      var videoId = btn.closest('[data-video-id]').getAttribute('data-video-id');
      btn.classList.toggle('active', ~myVideos.indexOf(videoId));
      btn.innerHTML = ~myVideos.indexOf(videoId) ? 'Remove from watch it later' : 'Add to watch it later';
    };

    this.toggleMyVideos = function () {
      _this.query.isOnlyMyVideos = !_this.query.isOnlyMyVideos;
      _this.myVideosBtnText.innerHTML = _this.query.isOnlyMyVideos ? 'Show all videos' : 'My "Watch it later" videos';
    };

    this.toggleSettings = function () {
      _this.settingsBox.classList.toggle('hidden');
    };
  }
});