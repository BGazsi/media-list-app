import VideoListController from '../src/js/VideoListController'
import VideoListViewMock from './mocks/VideoListViewMock'
import VideoModelMock from './mocks/VideoModelMock'
import getControllerOptionsMock from './mocks/OptionsMock'
import DOMMock from './mocks/DOMMock'

const dom = new DOMMock()
const assert = require('assert')
const sinon = require('sinon')

describe('VideoListController', () => {
  describe('attachEventListeners', () => {
    let subscribedEvents
    let videoListController

    beforeEach(() => {
      subscribedEvents = []
      videoListController = new VideoListController({}, {}, getControllerOptionsMock(subscribedEvents), dom.createFakeDocument(), dom.createFakeWindow())
    })

    it('should attach API response event listener', () => {
      videoListController.attachEventListeners()
      assert.notStrictEqual(-1, subscribedEvents.indexOf('apiResponseArrived'))
    })
    it('should attach filter form change event listener', () => {
      videoListController.attachEventListeners()
      assert.notStrictEqual(-1, subscribedEvents.indexOf('change'))
    })
    it('should attach my videos button click event listener', () => {
      videoListController.attachEventListeners()
      assert.notStrictEqual(-1, subscribedEvents.indexOf('click'))
    })
    it('should attach settings button click event listener', () => {
      videoListController.attachEventListeners()
      assert.notStrictEqual(-1, subscribedEvents.indexOf('click'))
    })
    it('should attach polling interval input input event listener', () => {
      videoListController.attachEventListeners()
      assert.notStrictEqual(-1, subscribedEvents.indexOf('input'))
    })
    it('should attach polling interval input blur event listener', () => {
      videoListController.attachEventListeners()
      assert.notStrictEqual(-1, subscribedEvents.indexOf('blur'))
    })
  })
  describe('handleApiResponse', () => {
    let videoListController
    let subscribedEvents
    let view

    beforeEach(() => {
      subscribedEvents = []
      view = new VideoListViewMock()
      videoListController = new VideoListController({}, view, getControllerOptionsMock(subscribedEvents), dom.createFakeDocument(), dom.createFakeWindow())
    })

    it('should call the view s renderList method', () => {
      let viewMock = sinon.mock(view)
      viewMock.expects('renderList').once()
      videoListController.handleApiResponse({})
      viewMock.verify()
    })
    // it('should attach add-to-list event listeners', () => {
    //   videoListController.handleApiResponse({})
    //   assert.equal(2, subscribedEvents.length)
    // })
  })

  describe('handleFilterFormChange', () => {
    let videoListController
    let view
    let model

    beforeEach(() => {
      view = new VideoListViewMock()
      model = new VideoModelMock()
      videoListController = new VideoListController(model, view, getControllerOptionsMock(), dom.createFakeDocument(), dom.createFakeWindow())
    })
    it('should call the view s updateQuery method', () => {
      let viewMock = sinon.mock(view)
      viewMock.expects('updateQuery').once()
      videoListController.handleFilterFormChange({})
      viewMock.verify()
    })
    it('should call the model s getVideos method', () => {
      let modelMock = sinon.mock(model)
      modelMock.expects('getVideos').once()
      videoListController.handleFilterFormChange({})
      modelMock.verify()
    })
    it('should call the view s getQuery method', () => {
      let viewMock = sinon.mock(view)
      viewMock.expects('getQuery').once()
      videoListController.handleFilterFormChange({})
      viewMock.verify()
    })
  })

  describe('toggleMyVideos', () => {
    let videoListController
    let view
    let model

    beforeEach(() => {
      view = new VideoListViewMock()
      model = new VideoModelMock()
      videoListController = new VideoListController(model, view, getControllerOptionsMock(), dom.createFakeDocument(), dom.createFakeWindow())
    })
    it('should call the view s toggleMyVideos method', () => {
      let viewMock = sinon.mock(view)
      viewMock.expects('toggleMyVideos').once()
      videoListController.toggleMyVideos({})
      viewMock.verify()
    })
    it('should call the model s provideVideos method', () => {
      let modelMock = sinon.mock(model)
      modelMock.expects('provideVideos').once()
      videoListController.toggleMyVideos({})
      modelMock.verify()
    })
  })

  describe('toggleSettings', () => {
    let videoListController
    let view

    beforeEach(() => {
      view = new VideoListViewMock()
      videoListController = new VideoListController({}, view, getControllerOptionsMock(), dom.createFakeDocument(), dom.createFakeWindow())
    })
    it('should call the view s toggleSettings method', () => {
      let viewMock = sinon.mock(view)
      viewMock.expects('toggleSettings').once()
      videoListController.toggleSettings({})
      viewMock.verify()
    })
  })

  describe('handlePollingIntervalInput', () => {
    let videoListController
    let model

    beforeEach(() => {
      model = new VideoModelMock()
      videoListController = new VideoListController(model, {}, getControllerOptionsMock(), dom.createFakeDocument(), dom.createFakeWindow())
    })
    it('should call the model s validateSettings method', () => {
      let modelMock = sinon.mock(model)
      modelMock.expects('validateSettings').once()
      videoListController.handlePollingIntervalInput({})
      modelMock.verify()
    })
  })

  describe('handlePollingIntervalSave', () => {
    let videoListController
    let model
    let view

    beforeEach(() => {
      model = new VideoModelMock()
      view = new VideoListViewMock()
      videoListController = new VideoListController(model, view, getControllerOptionsMock(), dom.createFakeDocument(), dom.createFakeWindow())
    })
    it('should call the model s validateSettings method', () => {
      let modelMock = sinon.mock(model)
      modelMock.expects('validateSettings').once()
      videoListController.handlePollingIntervalSave({})
      modelMock.verify()
    })
    it('should set the polling interval, if the given interval was valid', () => {
      model.validateSettings = () => {return true}
      videoListController.pollingIntervalInput.value = 1234
      videoListController.handlePollingIntervalSave({})
      assert(videoListController.pollingIntervalInput, 1234)
    })
    it('should start polling, if the given interval was valid', () => {
      model.validateSettings = () => {return true}
      videoListController.handlePollingIntervalSave({})
      assert.notStrictEqual(videoListController.pollTimerId, false)
      assert.equal(typeof videoListController.pollTimerId, 'object')
    })
    it('should not set the polling interval, if the given interval was invalid', () => {
      model.validateSettings = () => {return false}
      videoListController.pollingIntervalInput.value = 123
      videoListController.handlePollingIntervalSave({})
      assert(videoListController.pollingIntervalInput, 4000)
    })
    it('should not start polling, if the given interval was invalid', () => {
      model.validateSettings = () => {return false}
      videoListController.handlePollingIntervalSave({})
      assert.equal(videoListController.pollTimerId, false)
    })
  })

  describe('toggleVideoOnList', () => {
    let videoListController
    let view
    let model

    beforeEach(() => {
      view = new VideoListViewMock()
      model = new VideoModelMock()
      videoListController = new VideoListController(model, view, getControllerOptionsMock(), dom.createFakeDocument(), dom.createFakeWindow())
    })
    it('should call the view s toggleList method', () => {
      let viewMock = sinon.mock(view)
      viewMock.expects('toggleList').once()
      videoListController.toggleVideoOnList({})
      viewMock.verify()
    })
    it('should call the model s toggleList method', () => {
      let modelMock = sinon.mock(model)
      modelMock.expects('toggleList').once()
      videoListController.toggleVideoOnList({})
      modelMock.verify()
    })
    it('should call the model s getMyVideosList method', () => {
      let modelMock = sinon.mock(model)
      modelMock.expects('getMyVideosList').once()
      videoListController.toggleVideoOnList({})
      modelMock.verify()
    })
  })

  describe('startPolling', () => {
    let videoListController
    let view
    let model
    let win

    beforeEach(() => {
      view = new VideoListViewMock()
      model = new VideoModelMock()
      win = dom.createFakeWindow()
      videoListController = new VideoListController(model, view, getControllerOptionsMock(), dom.createFakeDocument(), win)
    })
    it('should clear existing timeout', () => {
      let winMock = sinon.mock(win)
      winMock.expects('clearTimeout').once()
      videoListController.pollTimerId = 1
      videoListController.startPolling()
      winMock.verify()
    })
    it('should not call clearTimeout, if no pollTimerId is set', () => {
      let winMock = sinon.mock(win)
      winMock.expects('clearTimeout').never()
      videoListController.startPolling()
      winMock.verify()
    })
    it('should set pollTimerId', () => {
      videoListController.startPolling()
      assert.equal(typeof videoListController.pollTimerId, 'object')
    })
  })

  describe('getVideos', () => {
    let videoListController
    let view
    let model

    beforeEach(() => {
      view = new VideoListViewMock()
      model = new VideoModelMock()
      videoListController = new VideoListController(model, view, getControllerOptionsMock(), dom.createFakeDocument(), dom.createFakeWindow())
    })
    it('should call the model s getVideos method', () => {
      let modelMock = sinon.mock(model)
      modelMock.expects('getVideos').once()
      videoListController.handleFilterFormChange({})
      modelMock.verify()
    })
    it('should call the view s getQuery method', () => {
      let viewMock = sinon.mock(view)
      viewMock.expects('getQuery').once()
      videoListController.handleFilterFormChange({})
      viewMock.verify()
    })
  })
})
