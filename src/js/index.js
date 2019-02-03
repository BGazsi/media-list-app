import VideoListController from 'VideoListController'
import VideoModel from 'VideoModel'
import VideoListView from 'VideoListView'
import JsonP from 'JsonP'

const apiUrl = 'http://146.185.158.18/fake_api.php'

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready (() => {
  let videoList = document.querySelector('[data-ref~="video-list"]')
  let model = new VideoModel(createJsonPClosure(), {
    storage: window.localStorage,
    placeholderPicture: 'http://placekitten.com/32/32',
    elements: {
      videoList: videoList
    }
  })
  let view = new VideoListView({
    elements: {
      videoList: videoList,
      myVideosBtnText: document.querySelector('[data-ref~="my-videos"] .header-btn-text'),
      sortSelect: document.querySelector('[data-ref~="sort-select"]'),
      filterSelect: document.querySelector('[data-ref~="filter-select"]'),
      settingsBox: document.querySelector('[data-ref~="settings-box"]')
    }
  })
  let videoListController = new VideoListController(model, view, {
    elements: {
      videoList: videoList,
      filterForm: document.querySelector('[data-ref~="filter-form"]'),
      myVideosButton: document.querySelector('[data-ref~="my-videos"]'),
      settingsButton: document.querySelector('[data-ref~="settings-button"]'),
      pollingIntervalInput: document.querySelector('[data-ref~="polling-interval"]')
    }
  })
  videoListController.init()
})

function createJsonPClosure() {
  let jsonP = new JsonP()
  return (query, success, timeout) => {
    jsonP.send(apiUrl, {
      callbackName: 'jsonp',
      successCallback: success,
      timeoutCallback: timeout,
      timeout: 3000
    })
  }
}
