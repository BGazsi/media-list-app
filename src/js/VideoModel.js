export default function VideoModel (apiCaller, options, doc, custEv) {
  this.videoList = options.elements.videoList
  this.storage = options.storage
  this.videos = []
  this.isOnlyMyVideos = false
  this.placeholderPicture = options.placeholderPicture
  this.apiCaller = apiCaller
  this.storage.setItem('video-list', this.storage.getItem('video-list') || JSON.stringify([]))
  doc = doc || document
  custEv = custEv || CustomEvent

  this.getVideos = (query) => {
    this.apiCaller(query,
      (json) => {
        this.provideVideos(query, json)
      },
      () => {
        console.error('timeout')
      }
    )
  }

  this.provideVideos = (query, json = this.videos) => {
    this.videos = this.normalizeVideos(json)
    this.videoList.dispatchEvent(new custEv('apiResponseArrived', {detail: this.handleRequestReady(query)}))
  }

  this.handleRequestReady = (query) => {
    return this.getFilteredVideos(query.filter, query.isOnlyMyVideos).sort((video1, video2) => {
      return video1[query.sort.prop] > video2[query.sort.prop] ? query.sort.dir : -query.sort.dir
    })
  }

  this.getFilteredVideos = (filter, isOnlyMyVideos) => {
    if (filter === 'all' && !isOnlyMyVideos) {
      return this.videos
    }
    return this.videos.filter((video) => {
      return (video.type === filter || filter === 'all') && (!isOnlyMyVideos || video.isOnList)
    })
  }

  this.normalizeVideos = (videos) => {
    return videos.map((video) => {
      return Object.assign({}, {
        title: 'No title defined',
        description: '',
        picture: this.placeholderPicture,
        viewers: 0
      }, video, {
        isOnList: ~this.getMyVideosList().indexOf('' + video.id)
      })
    })
  }

  this.getMyVideosList = () => {
    let actualStore = []
    try {
      actualStore = JSON.parse(this.storage.getItem('video-list'))
    } catch (ex) {
      console.warn('Video list was corrupted, added videos were forgotten.')
    }
    return actualStore
  }

  this.toggleList = (e) => {
    let videoId = e.target.closest('[data-video-id]').getAttribute('data-video-id')
    let actualStore = this.getMyVideosList()
    if (!~actualStore.indexOf(videoId)) {
      actualStore.push(videoId)
    } else {
      actualStore.splice(actualStore.indexOf(videoId), 1)
    }
    this.storage.setItem('video-list', JSON.stringify(actualStore))
  }

  this.toggleMyVideos = () => {
    this.isOnlyMyVideos = !this.isOnlyMyVideos
  }

  this.validateSettings = () => {
    let input = doc.querySelector('[data-ref~="polling-interval"]')
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
