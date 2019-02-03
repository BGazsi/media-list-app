import VideoModel from '../src/js/VideoModel'
import DOMMock from './mocks/DOMMock'
import OptionsMock from './mocks/OptionsMock'
import VideoDataProvider from './mocks/VideoDataProvider'

const dom = new DOMMock()
const videoProvider = new VideoDataProvider()
const assert = require('assert')
const sinon = require('sinon')

describe('VideoModel', () => {
  let videoModel
  let apiCaller
  let doc
  let apiCall
  let options
  let customEvent
  let triggeredEvents
  let calledFunctions

  beforeEach(() => {
    doc = dom.createFakeDocument()
    options = OptionsMock()
    triggeredEvents = []
    calledFunctions = []

    customEvent = function (name, props) {
      triggeredEvents.push({name: name, props: props})
    }

    apiCall = []
    apiCaller = function (query, success, timeout) {
      apiCall.push({
        query: query,
        success: success,
        timeout: timeout
      })
    }
    videoModel = new VideoModel(apiCaller, options, doc, customEvent)
  })

  describe('getVideos', () => {
    it('should call the apiCaller', () => {
      videoModel.getVideos({})
      assert.notStrictEqual(apiCall.length, 0)
    })
    it('should give a success callback to the apiCaller', () => {
      videoModel.getVideos({})
      assert.equal(typeof apiCall[0]['success'], 'function')
    })
    it('should give a timeout callback to the apiCaller', () => {
      videoModel.getVideos({})
      assert.equal(typeof apiCall[0]['timeout'], 'function')
    })
  })
  describe('provideVideos', () => {
    it('should call normalizeVideos', () => {
      videoModel.normalizeVideos = function (json) {
        calledFunctions.push('normalizeVideos')
        return json
      }
      videoModel.provideVideos({}, [{}])
      assert.deepEqual(calledFunctions, ['normalizeVideos'])
    })
    it('should dispatch apiResponseArrived event', () => {
      videoModel.provideVideos({}, [])
      assert.equal(triggeredEvents[0].name, 'apiResponseArrived')
    })
    it('should dispatch apiResponseArrived event with detail', () => {
      videoModel.provideVideos({}, [])
      assert.deepEqual(triggeredEvents[0].props.detail, [])
    })
    it('should call handleRequestReady', () => {
      videoModel.handleRequestReady = function (query) {
        calledFunctions.push('handleRequestReady')
        return []
      }
      videoModel.provideVideos({}, [{}])
      assert.deepEqual(calledFunctions, ['handleRequestReady'])
    })
  })
  describe('handleRequestReady', () => {
    let query
    beforeEach(() => {
      query = {
        sort: {
          dir: 1,
          prop: 'title'
        }
      }
      videoModel.getFilteredVideos = function (filter, isOnlyMyVideos) {
        calledFunctions.push('getFilteredVideos')
        return videoProvider.getVideoList()
      }
    })
    it('should call getFilteredVideos', () => {
      videoModel.handleRequestReady(query)
      assert.deepEqual(calledFunctions, ['getFilteredVideos'])
    })
    it('should sort the filtered videos based on the given query', () => {
      let videos = videoModel.handleRequestReady(query)
      assert.equal(videos[0].title, 'title')
      assert.equal(videos[1].title, 'title 2')
    })
    it('should sort the filtered videos in desc direction, if direction is a negative number', () => {
      query.sort.dir = -1
      let videos = videoModel.handleRequestReady(query)
      assert.equal(videos[0].title, 'title 2')
      assert.equal(videos[1].title, 'title')
    })
    it('should sort the filtered videos based on a number property', () => {
      query.sort.prop = 'id'
      query.sort.dir = -1
      let videos = videoModel.handleRequestReady(query)
      assert.equal(videos[0].id, 2)
      assert.equal(videos[1].id, 1)
    })
  })
  describe('getFilteredVideos', () => {
    beforeEach(() => {
      videoModel.videos = videoProvider.getVideoList()
    })
    it('should return all videos, if "all" filter was provided', () => {
      assert.equal(videoModel.getFilteredVideos('all').length, 2)
    })
    it('should return recorded videos only, if "recorded" filter was provided', () => {
      let filteredVideos = videoModel.getFilteredVideos('recorded')
      assert.equal(filteredVideos.length, 1)
      assert.equal(filteredVideos[0].type, 'recorded')
    })
    it('should return live videos only, if "channel" filter was provided', () => {
      let filteredVideos = videoModel.getFilteredVideos('channel')
      assert.equal(filteredVideos.length, 1)
      assert.equal(filteredVideos[0].type, 'channel')
    })
    it('should return no videos, if myList filter was provided, and no video is actually on my list', () => {
      assert.equal(videoModel.getFilteredVideos('all', true).length, 0)
    })
    it('should return my videos only, if myList filter was provided', () => {
      videoModel.videos.push({
        id: 3,
        isOnList: true
      })
      let filteredVideos = videoModel.getFilteredVideos('all', true)
      assert.equal(filteredVideos.length, 1)
      assert.equal(filteredVideos[0].id, 3)
      assert.equal(filteredVideos[0].isOnList, true)
    })
    it('should not return my videos, if myList filter was provided, but none of my videos are from the filtered type', () => {
      videoModel.videos.push({
        id: 3,
        isOnList: true,
        type: 'recorded'
      })
      let filteredVideos = videoModel.getFilteredVideos('channel', true)
      assert.equal(filteredVideos.length, 0)
    })
  })
  describe('normalizeVideos', () => {
    it('should not overwrite  the videos given propertied', () => {
      let videos = [videoProvider.getVideo()]
      assert.equal(videos[0].title, videoModel.normalizeVideos(videos)[0].title)
      assert.equal(videos[0].description, videoModel.normalizeVideos(videos)[0].description)
      assert.equal(videos[0].picture, videoModel.normalizeVideos(videos)[0].picture)
      assert.equal(videos[0].id, videoModel.normalizeVideos(videos)[0].id)
      assert.equal(videos[0].viewers, videoModel.normalizeVideos(videos)[0].viewers)
      assert.deepEqual(videos[0].location, videoModel.normalizeVideos(videos)[0].location)
    })
    it('should set all the required propertied of the video', () => {
      let normalizedVideo = videoModel.normalizeVideos([{}])
      assert.notStrictEqual(normalizedVideo[0].title, undefined)
      assert.notStrictEqual(normalizedVideo[0].description, undefined)
      assert.notStrictEqual(normalizedVideo[0].viewers, undefined)
      assert.notStrictEqual(normalizedVideo[0].picture, undefined)
    })
    it('should set the isOnList property of the video', () => {
      let normalizedVideo = videoModel.normalizeVideos([{}])
      assert.notStrictEqual(normalizedVideo[0].isOnList, undefined)
    })
  })
  describe('getMyVideosList', () => {
    it('should return an empty array, if no video is on my list', () => {
      assert.deepEqual(videoModel.getMyVideosList(), [])
    })
    it('should return my videos, if there s any', () => {
      videoModel.storage.getItem = () => {
        return '["1"]'
      }
      assert.deepEqual(videoModel.getMyVideosList(), ['1'])
    })
    it('should return empty array, if the storage does not contain valid json', () => {
      videoModel.storage.getItem = () => {
        return '["1" asd]'
      }
      assert.deepEqual(videoModel.getMyVideosList(), [])
    })
    before(() => {
      sinon.stub(console, 'warn')
    })
    after(() => {
      console.warn.restore()
    })
    it('should write warning on console, if the storage does not contain valid json', () => {
      videoModel.storage.getItem = () => {
        return '["1" asd]'
      }
      assert.equal(console.warn.calledOnce, true)
    })
  })
  describe('toggleList', () => {
    it('should add the new video, if it is not on the list', () => {
      videoModel.toggleList(dom.createEvent())
      assert.notStrictEqual(videoModel.storage.getItem('video-list').indexOf('fakeAttributeValue'), -1)
    })
    it('should remove the new video, if it is already on the list', () => {
      videoModel.storage.setItem('video-list', '["fakeAttributeValue"]')
      videoModel.toggleList(dom.createEvent())
      assert.equal(videoModel.storage.getItem('video-list').indexOf('fakeAttributeValue'), -1)
    })
  })
  describe('toggleMyVideos', () => {
    it('should set isOnlyMyVideos false, if it was true', () => {
      videoModel.isOnlyMyVideos = true
      videoModel.toggleMyVideos()
      assert.equal(videoModel.isOnlyMyVideos, false)
    })
    it('should set isOnlyMyVideos true, if it was false', () => {
      videoModel.isOnlyMyVideos = false
      videoModel.toggleMyVideos()
      assert.equal(videoModel.isOnlyMyVideos, true)
    })
  })
  describe('validateSettings', () => {
    it('should return true, if the input value is valid', () => {
      doc = dom.createFakeDocument(true)
      videoModel = new VideoModel(apiCaller, options, doc, customEvent)
      assert.equal(videoModel.validateSettings(), true)
    })
    it('should return false, if the input value is not valid', () => {
      assert.equal(videoModel.validateSettings(), false)
    })
  })
})
