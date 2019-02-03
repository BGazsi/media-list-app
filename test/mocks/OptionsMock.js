import DOM from './DOMMock'

export default function getControllerMockOptions (eventStore) {

  let dom = new DOM()
  return {
    elements: {
      videoList: dom.createFakeDomElement({eventStore: eventStore}),
      filterForm: dom.createFakeDomElement({eventStore: eventStore}),
      myVideosButton: dom.createFakeDomElement({eventStore: eventStore}),
      settingsButton: dom.createFakeDomElement({eventStore: eventStore}),
      pollingIntervalInput: dom.createFakeDomElement({eventStore: eventStore, value: 4000}),
      myVideosBtnText: dom.createFakeDomElement({eventStore: eventStore}),
      sortSelect: dom.createFakeDomElement({eventStore: eventStore, value: 'title|-1'}),
      filterSelect: dom.createFakeDomElement({eventStore: eventStore, value: 'channel'}),
      settingsBox: dom.createFakeDomElement({eventStore: eventStore})
    },
    storage: {
      items: {},
      getItem: function (key) {
        return this.items[key]
      },
      setItem: function (key, value) {
        this.items[key] = value
      },
      removeItem: function (key) {
        delete this.items[key]
      }
    },
    placeholderPicture: 'placeholderImageUrl'
  }
}
