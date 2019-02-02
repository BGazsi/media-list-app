export default function DOMMock () {
  this.createFakeDomElement = (options) => {
    return {
      addEventListener: (eventName) => {
        if (!options || !options.eventStore) {
          return
        }
        options.eventStore.push(eventName)
      },
      value: options ? options.value : undefined
    }
  }

  this.createFakeDocument = () => {
    return {
      querySelector: (selector) => {
        return this.createFakeDomElement()
      },
      querySelectorAll: (selector) => {
        return [this.createFakeDomElement(), this.createFakeDomElement()]
      }
    }
  }

  this.createFakeWindow = () => {
    return {
      clearTimeout: () => {
      }
    }
  }
}
