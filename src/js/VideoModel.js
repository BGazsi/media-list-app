import JsonP from './JsonP.js'

export default function VideoModel () {
  this.videoList = document.querySelector('[data-ref~="video-list"]')
  this.videos = []
  this.isOnlyMyVideos = false
  this.jsonP = new JsonP()
  window.localStorage.setItem('video-list', window.localStorage.getItem('video-list') || JSON.stringify([]))

  this.getVideos = function (query) {
    this.jsonP.send('http://146.185.158.18/fake_api.php', {
      callbackName: 'jsonp',
      successCallback: (json) => {
        this.videos = this.normalizeVideos(json)
        this.videos = this.handleRequestReady(query)
        this.videoList.dispatchEvent(new CustomEvent('apiResponseArrived', {detail: this.videos}))
      },
      timeoutCallback: () => {
        console.error('timeout')
        setTimeout(() => {
          this.getVideos(query)
        }, 3000)
      },
      timeout: 3000
    })
  }

  this.handleRequestReady = function (query) {
    return this.getFilteredVideos(query.filter).sort((video1, video2) => {
      return video1[query.sort.prop] > video2[query.sort.prop] ? query.sort.dir : -query.sort.dir
    })
  }

  this.getFilteredVideos = function (filter) {
    if (!filter) {
      return this.videos
    }
    return this.videos.filter((video) => {
      return video.type === filter
    })
  }

  this.normalizeVideos = function (videos) {
    return videos.map((video) => {
      return Object.assign({}, {
        title: 'No title defined',
        description: '',
        picture: 'http://placehold.it/300x300',
        viewers: 0,
        isOnList: ~this.getMyVideosList().indexOf('' + video.id)
      }, video)
    })
  }

  this.getMyVideosList = function () {
    let actualStore = []
    try {
      actualStore = JSON.parse(window.localStorage.getItem('video-list'))
    } catch (ex) {
      console.warn('Video list was corrupted, added videos were forgotten.')
    }
    return actualStore
  }

  this.toggleList = function (e) {
    let videoId = e.target.closest('[data-video-id]').getAttribute('data-video-id')
    let actualStore = this.getMyVideosList()
    if (!~actualStore.indexOf(videoId)) {
      actualStore.push(videoId)
    } else {
      actualStore.splice(actualStore.indexOf(videoId), 1)
    }
    window.localStorage.setItem('video-list', JSON.stringify(actualStore))
  }

  this.toggleMyVideos = function () {
    this.isOnlyMyVideos = !this.isOnlyMyVideos
  }

  this.validateSettings = function () {
    let input = document.querySelector('[data-ref~="polling-interval"]')
    if (input.checkValidity()) {
      return true
    }
    try {
      input.reportValidity()
    } catch (ex) {
      console.warn(ex)
    }
    return false
  }
}
