import VideoListController from 'VideoListController'

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready (() => {
  let videoListController = new VideoListController()
  videoListController.init()
})
