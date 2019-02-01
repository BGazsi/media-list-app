export default function VideoListController (model, view, options) {
  this.videoModel = model
  this.videoListView = view
  this.videoList = options.elements.videoList
  this.filterForm = options.elements.filterForm
  this.myVideosButton = options.elements.myVideosButton
  this.settingsButton = options.elements.settingsButton
  this.pollingIntervalInput = options.elements.pollingIntervalInput
  this.pollInterval = this.pollingIntervalInput.value
  this.pollTimerId = false

  this.init = () => {
    this.getVideos()
    this.attachEventListeners()
    // this.startPolling()
  }

  this.attachEventListeners = () => {
    this.videoList.addEventListener('apiResponseArrived', this.handleApiResponse)
    this.filterForm.addEventListener('change', this.handleFilterFormChange)
    this.myVideosButton.addEventListener('click', this.toggleMyVideos)
    this.settingsButton.addEventListener('click', this.toggleSettings)
    this.pollingIntervalInput.addEventListener('input', this.handlePollingIntervalInput)
    this.pollingIntervalInput.addEventListener('blur', this.handlePollingIntervalSave)
  }

  this.handleApiResponse = (e) => {
    this.videoListView.renderList(e.detail)
    document.querySelectorAll('[data-ref~="add-to-list"]').forEach((btn) => {
      btn.addEventListener('click', this.toggleVideoOnList)
    })
  }

  this.handleFilterFormChange = () => {
    this.videoListView.updateQuery()
    this.videoModel.getVideos(this.videoListView.getQuery())
  }

  this.toggleMyVideos = () => {
    this.videoListView.toggleMyVideos()
    this.videoModel.provideVideos(this.videoListView.query)
  }

  this.toggleSettings = () => {
    this.videoListView.toggleSettings()
  }

  this.handlePollingIntervalInput = () => {
    this.videoModel.validateSettings()
  }

  this.handlePollingIntervalSave = () => {
    if (this.videoModel.validateSettings()) {
      this.pollInterval = this.pollingIntervalInput.value
      this.startPolling()
    }
  }

  this.toggleVideoOnList = (e) => {
    this.videoModel.toggleList(e)
    this.videoListView.toggleList(e, this.videoModel.getMyVideosList())
  }

  this.startPolling = () => {
    if (this.pollTimerId) {
      window.clearTimeout(this.pollTimerId)
    }
    this.pollTimerId = setInterval(this.getVideos, this.pollInterval)
  }

  this.getVideos = () => {
    this.videoModel.getVideos(this.videoListView.getQuery())
  }
}
