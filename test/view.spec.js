import VideoListView from '../src/js/VideoListView'
import DOMMock from './mocks/DOMMock'
import OptionsMock from './mocks/OptionsMock'
import VideoDataProvider from './mocks/VideoDataProvider'

const dom = new DOMMock()
const videoProvider = new VideoDataProvider()
const assert = require('assert')
const sinon = require('sinon')

describe('VideoListView', () => {
  let videoListView
  let doc
  let options

  beforeEach(() => {
    doc = dom.createFakeDocument()
    options = OptionsMock()

    videoListView = new VideoListView(options, doc)
  })

  describe('getVideoCardTemplate', () => {
    it('should return a string', () => {
      assert.equal(typeof videoListView.getVideoCardTemplate(videoProvider.getVideo()), 'string')
    })
    it('should contain the given video s infofmations', () => {
      let videoHTML = videoListView.getVideoCardTemplate(videoProvider.getVideo())
      assert.notStrictEqual(videoHTML.indexOf('Example_title'), -1)
      assert.notStrictEqual(videoHTML.indexOf('Example_description'), -1)
      assert.notStrictEqual(videoHTML.indexOf('Example_picture_url'), -1)
      assert.notStrictEqual(videoHTML.indexOf('12345678'), -1)
      assert.notStrictEqual(videoHTML.indexOf('channel'), -1)
    })
  })
  describe('createVideoCard', () => {
    it('should return a DOM element from a video', () => {
      assert.equal(typeof videoListView.createVideoCard(videoProvider.getVideo()).innerHTML, 'string')
    })
    it('should set the data-video-id attribute', () => {
      assert.equal(videoListView.createVideoCard(videoProvider.getVideo()).attributes['data-video-id'], 1)
    })
    it('should set the data-ref attribute', () => {
      assert.equal(videoListView.createVideoCard(videoProvider.getVideo()).attributes['data-ref'], 'video-card')
    })
    it('should add the required classes to the element', () => {
      assert.deepEqual(videoListView.createVideoCard(videoProvider.getVideo()).classList.classes, ['col', 'video-card'])
    })
    it('should overwrite the innerHTML of the element', () => {
      assert.notStrictEqual(videoListView.createVideoCard(videoProvider.getVideo()).innerHTML, 'innerHTML')
    })
  })
  describe('addVideoCard', () => {
    it('should append a new video card element to the DOM', () => {
      videoListView.addVideoCard('asd')
      assert.equal(videoListView.videoList.children, 1)
    })
  })
  describe('renderList', () => {
    it('should overwrite the videoList element s innerHTML', () => {
      videoListView.renderList(videoProvider.getNormalizedVideoList())
      assert.notStrictEqual(videoListView.videoList.innerHTML, 'innerHTML')
    })
  })
  describe('getQuery', () => {
    it('should return videoListView s actual query', () => {
      assert.deepEqual(videoListView.getQuery(), {
        sort: {dir: 1, prop: 'title'},
        filter: 'all',
        isOnlyMyVideos: false
      })
    })
  })
  describe('updateQuery', () => {
    it('should update the query with actual data from the DOM', () => {
      videoListView.updateQuery()
      assert.deepEqual(videoListView.query, {
        sort: {dir: -1, prop: 'title'},
        filter: 'channel',
        isOnlyMyVideos: false
      })
    })
  })
  describe('createSortQuery', () => {
    it('should generate the sort query from an input value', () => {
      assert.deepEqual(videoListView.createSortQuery(dom.createFakeDomElement({value: 'description|-1'})), {
        prop: 'description',
        dir: -1
      })
    })
  })
})
