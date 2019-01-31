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

  function VideoListView() {
    this.videoList = document.querySelector('[data-ref~="video-list"]');
    this.query = {
      sort: {
        dir: 1,
        prop: 'title'
      }
    };

    this.getVideoCardTemplate = function (video) {
      var btnText = !video.isOnList ? 'Add to watch it later' : 'Remove from watch it later';
      var active = video.isOnList ? 'active' : '';
      return "<div class=\"img-container\">\n                <div class=\"live ".concat(video.type, "\">live</div>\n                <img class=\"thumb-img\" src=\"").concat(video.picture, "\" alt=\"").concat(video.title, "\" data-ref=\"picture\">\n            </div>\n            <h3 data-ref=\"title\">").concat(video.title, "</h3>\n            <article data-ref=\"description\">").concat(video.description, "</article>\n            <p class=\"viewers\">Viewers: <strong data-ref=\"viewers\">").concat(video.viewers, "</strong></p>\n            <button class=\"btn btn-default btn-block add-btn ").concat(active, "\" data-ref=\"add-to-list\">").concat(btnText, "</button>");
    };

    this.createVideoCard = function (video, isOnlyMyVideos) {
      var newElement = document.createElement('div');
      newElement.classList.add('col', 'video-card');
      newElement.classList.toggle('hidden', isOnlyMyVideos && !video.isOnList);
      newElement.setAttribute('data-video-id', video.id);
      newElement.setAttribute('data-ref', 'video-card');
      newElement.innerHTML = this.getVideoCardTemplate(video);
      return newElement;
    };

    this.addVideoCard = function (card) {
      this.videoList.appendChild(card);
    };

    this.renderList = function (videos, isOnlyMyVideos) {
      var _this = this;

      this.videoList.innerHTML = '';
      videos.forEach(function (video) {
        _this.addVideoCard(_this.createVideoCard(video, isOnlyMyVideos));
      });
    };

    this.getQuery = function () {
      return this.query;
    };

    this.updateQuery = function (filterForm) {
      this.query.sort = this.createSortQuery(filterForm.querySelector('[data-ref~="sort-select"]'));
      this.query.filter = this.createFilterQuery(filterForm.querySelector('[data-ref~="filter-select"]'));
    };

    this.createSortQuery = function (select) {
      return {
        dir: select.value.split('|')[1],
        prop: select.value.split('|')[0]
      };
    };

    this.createFilterQuery = function (select) {
      return select.value === 'all' ? undefined : select.value;
    };

    this.toggleList = function (e, myVideos) {
      var btn = e.target;
      var videoId = btn.closest('[data-video-id]').getAttribute('data-video-id');
      btn.classList.toggle('active', ~myVideos.indexOf(videoId));
      btn.innerHTML = ~myVideos.indexOf(videoId) ? 'Remove from watch it later' : 'Add to watch it later';
    };

    this.toggleMyVideos = function (myVideos, isOnlyMyVideos) {
      if (isOnlyMyVideos) {
        this.showAllVideos();
        document.querySelector('[data-ref~="my-videos"] .header-btn-text').innerHTML = 'My "Watch it later" videos';
      } else {
        this.showOnlyMyVideos(myVideos);
        document.querySelector('[data-ref~="my-videos"] .header-btn-text').innerHTML = 'Show all videos';
      }
    };

    this.showAllVideos = function () {
      document.querySelectorAll('[data-video-id]').forEach(function (videoCard) {
        videoCard.classList.remove('hidden');
      });
    };

    this.showOnlyMyVideos = function (myVideos) {
      document.querySelectorAll('[data-video-id]').forEach(function (videoCard) {
        videoCard.classList.add('hidden');

        if (~myVideos.indexOf(videoCard.getAttribute('data-video-id'))) {
          videoCard.classList.remove('hidden');
        }
      });
    };

    this.toggleSettings = function () {
      document.querySelector('[data-ref~="settings-box"]').classList.toggle('hidden');
    };
  }
});