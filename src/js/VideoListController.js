import VideoModel from './VideoModel.js'
import VideoListView from './VideoListView.js'

export default function VideoListController () {
  this.videoModel = new VideoModel()
  this.videoListView = new VideoListView()
  this.videoList = document.querySelector('[data-ref~="video-list"]')
  this.filterForm = document.querySelector('[data-ref~="filter-form"]')
  this.pollTimerId = false
  this.pollInterval = document.querySelector('[data-ref~="polling-interval"]').value

  this.init = function () {
    this.videoModel.getVideos(this.videoListView.getQuery())
    this.attachEventListeners()
    // this.startPolling()
  }

  this.attachEventListeners = function () {

    this.videoList.addEventListener('apiResponseArrived', (e) => {
      this.videoListView.renderList(e.detail, this.videoModel.isOnlyMyVideos)

      document.querySelectorAll('[data-ref~="add-to-list"]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          this.videoModel.toggleList(e)
          this.videoListView.toggleList(e, this.videoModel.getMyVideosList())
        } )
      })
    })

    this.filterForm.addEventListener('change', () => {
      this.videoListView.updateQuery(this.filterForm)
      this.videoModel.getVideos(this.videoListView.getQuery())
    })

    document.querySelector('[data-ref~="my-videos"]').addEventListener('click', () => {
      this.videoListView.toggleMyVideos(this.videoModel.getMyVideosList(), this.videoModel.isOnlyMyVideos)
      this.videoModel.toggleMyVideos()
    })

    document.querySelector('[data-ref~="settings-button"]').addEventListener('click', () => {
      this.videoListView.toggleSettings()
    })

    let pollingIntervalInput = document.querySelector('[data-ref~="polling-interval"]')
    pollingIntervalInput.addEventListener('input', () => {
      this.videoModel.validateSettings()
    })
    pollingIntervalInput.addEventListener('blur', () => {
      if (this.videoModel.validateSettings()) {
        this.pollInterval = pollingIntervalInput.value
        this.startPolling()
      }
    })
  }

  this.startPolling = function () {
    if (this.pollTimerId) {
      window.clearTimeout(this.pollTimerId)
    }
    this.pollTimerId = setInterval(() => {
      this.videoModel.getVideos(this.videoListView.getQuery())
    }, this.pollInterval)
  }
}
