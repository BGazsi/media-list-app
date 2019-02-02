export default function VideoListView (options, doc) {
  this.videoList = options.elements.videoList
  this.myVideosBtnText = options.elements.myVideosBtnText
  this.sortSelect = options.elements.sortSelect
  this.filterSelect = options.elements.filterSelect
  this.settingsBox = options.elements.settingsBox
  doc = doc || document
  this.query = {
    sort: {
      dir: 1,
      prop: 'title'
    },
    filter: 'all',
    isOnlyMyVideos : false
  }

  this.getVideoCardTemplate = (video) => {
    let btnText = !video.isOnList ? 'Add to watch it later' : 'Remove from watch it later'
    let active = video.isOnList ? 'active' : ''
    return `<div class="img-container">
                <div class="live ${video.type}">live</div>
                <img class="thumb-img" src="${video.picture}" alt="${video.title}" data-ref="picture">
            </div>
            <h3 data-ref="title">${video.title}</h3>
            <article data-ref="description">${video.description}</article>
            <p class="viewers">Viewers: <strong data-ref="viewers">${video.viewers}</strong></p>
            <button class="btn btn-default btn-block add-btn ${active}" data-ref="add-to-list">${btnText}</button>`
  }

  this.createVideoCard = (video) => {
    let newElement = doc.createElement('div')
    newElement.classList.add('col', 'video-card')
    newElement.setAttribute('data-video-id', video.id)
    newElement.setAttribute('data-ref', 'video-card')
    newElement.innerHTML = this.getVideoCardTemplate(video)
    return newElement
  }

  this.addVideoCard = (card) => {
    this.videoList.appendChild(card)
  }

  this.renderList = (videos) => {
    this.videoList.innerHTML = ''
    videos.forEach((video) => {
      this.addVideoCard(this.createVideoCard(video))
    })
  }

  this.getQuery = () => {
    return this.query
  }

  this.updateQuery = () => {
    this.query.sort = this.createSortQuery(this.sortSelect)
    this.query.filter = this.filterSelect.value
  }

  this.createSortQuery = (select) => {
    return {
      dir: select.value.split('|')[1],
      prop: select.value.split('|')[0]
    }
  }

  this.toggleList = (e, myVideos) => {
    let btn = e.target
    let videoId = btn.closest('[data-video-id]').getAttribute('data-video-id')
    btn.classList.toggle('active', ~myVideos.indexOf(videoId))
    btn.innerHTML = ~myVideos.indexOf(videoId) ? 'Remove from watch it later' : 'Add to watch it later'
  }

  this.toggleMyVideos = () => {
    this.query.isOnlyMyVideos = !this.query.isOnlyMyVideos
    this.myVideosBtnText.innerHTML = this.query.isOnlyMyVideos ? 'Show all videos' : 'My "Watch it later" videos'
  }

  this.toggleSettings = () => {
    this.settingsBox.classList.toggle('hidden')
  }
}
