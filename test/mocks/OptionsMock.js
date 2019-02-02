import DOM from './DOMMock'

export default function getControllerMockOptions (eventStore) {

  let dom = new DOM()
  return {
    elements: {
      videoList: dom.createFakeDomElement({eventStore: eventStore}),
      filterForm: dom.createFakeDomElement({eventStore: eventStore}),
      myVideosButton: dom.createFakeDomElement({eventStore: eventStore}),
      settingsButton: dom.createFakeDomElement({eventStore: eventStore}),
      pollingIntervalInput: dom.createFakeDomElement({eventStore: eventStore, value: 4000})
    },
    storage: {
      items: {},
      getItem: (key) => {
        return this.items[key]
      },
      setItem: (key, value) => {
        this.items[key] = value
      },
      removeItem: (key) => {
        delete this.items[key]
      }
    },
    placeholderPicture: 'placeholderImageUrl'
  }
}
