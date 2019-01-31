const assert = require('assert')
// const sinon = require('sinon')

import controller from '../src/js/VideoListController'

global.window = {
  localStorage: {
    items: {},
    getItem: function (key) {
      return this.items[key] || null
    },
    setItem: function (key, value) {
      this.items[key] = value
    },
    removeItem: function (key) {
      delete this.items[key]
    }
  }
}

beforeEach(() => {
  global.document = {
    querySelector: function () {
      return {value: 5000}
    },
    querySelectorAll: function () {
      return []
    }
  }
})

describe('test', () => {
  describe('test', () => {
    it('should pass', () => {
      new controller()
      assert.equal(true, true)
    })
  })
})
