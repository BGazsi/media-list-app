export default function VideoListView () {
  this.videoList = document.querySelector('[data-ref~="video-list"]')
  this.query = {
    sort: {
      dir: 1,
      prop: 'title'
    }
  }

  this.getVideoCardTemplate = function (video) {
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

  this.createVideoCard = function (video, isOnlyMyVideos) {
    let newElement = document.createElement('div')
    newElement.classList.add('col', 'video-card')
    newElement.classList.toggle('hidden', isOnlyMyVideos && !video.isOnList)
    newElement.setAttribute('data-video-id', video.id)
    newElement.setAttribute('data-ref', 'video-card')
    newElement.innerHTML = this.getVideoCardTemplate(video)
    return newElement
  }

  this.addVideoCard = function (card) {
    this.videoList.appendChild(card)
  }

  this.renderList = function (videos, isOnlyMyVideos) {
    this.videoList.innerHTML = ''
    videos.forEach((video) => {
      this.addVideoCard(this.createVideoCard(video, isOnlyMyVideos))
    })
  }

  this.getQuery = function () {
    return this.query
  }

  this.updateQuery = function (filterForm) {
    this.query.sort = this.createSortQuery(filterForm.querySelector('[data-ref~="sort-select"]'))
    this.query.filter = this.createFilterQuery(filterForm.querySelector('[data-ref~="filter-select"]'))
  }

  this.createSortQuery = function (select) {
    return {
      dir: select.value.split('|')[1],
      prop: select.value.split('|')[0]
    }
  }

  this.createFilterQuery = function (select) {
    return select.value === 'all' ? undefined : select.value
  }

  this.toggleList = function (e, myVideos) {
    let btn = e.target
    let videoId = btn.closest('[data-video-id]').getAttribute('data-video-id')
    btn.classList.toggle('active', ~myVideos.indexOf(videoId))
    btn.innerHTML = ~myVideos.indexOf(videoId) ? 'Remove from watch it later' : 'Add to watch it later'
  }

  this.toggleMyVideos = function (myVideos, isOnlyMyVideos) {
    if (isOnlyMyVideos) {
      this.showAllVideos()
      document.querySelector('[data-ref~="my-videos"] .header-btn-text').innerHTML = 'My "Watch it later" videos'
    } else {
      this.showOnlyMyVideos(myVideos)
      document.querySelector('[data-ref~="my-videos"] .header-btn-text').innerHTML = 'Show all videos'
    }
  }

  this.showAllVideos = function () {
    document.querySelectorAll('[data-video-id]').forEach((videoCard) => {
      videoCard.classList.remove('hidden')
    })
  }

  this.showOnlyMyVideos = function (myVideos) {
    document.querySelectorAll('[data-video-id]').forEach((videoCard) => {
      videoCard.classList.add('hidden')
      if (~myVideos.indexOf(videoCard.getAttribute('data-video-id'))) {
        videoCard.classList.remove('hidden')
      }
    })
  }

  this.toggleSettings = function () {
    document.querySelector('[data-ref~="settings-box"]').classList.toggle('hidden')
  }
}
