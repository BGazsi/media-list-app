export default function DOMMock () {
  this.areInputsValid = true
  this.createFakeDomElement = (options) => {
    return {
      attributes: {},
      children: 0,
      addEventListener: (eventName) => {
        if (!options || !options.eventStore) {
          return
        }
        options.eventStore.push(eventName)
      },
      appendChild: function () {
        this.children++
      },
      value: options ? options.value : undefined,
      dispatchEvent: (event) => {
      },
      closest: () => {
        return this.createFakeDomElement()
      },
      getAttribute: () => {
        return 'fakeAttributeValue'
      },
      setAttribute: function (key, value) {
        this.attributes[key] = value
      },
      checkValidity: () => {
        return this.areInputsValid
      },
      reportValidity: () => {
      },
      classList: {
        classes: [],
        add: function () {
          this.classes.push(...arguments)
        },
        remove: () => {
        },
        toggle:() => {
        }
      },
      innerHTML: 'innerHTML'
    }
  }

  this.createFakeDocument = (areInputsValid) => {
    this.areInputsValid = !!areInputsValid
    return {
      querySelector: (selector) => {
        return this.createFakeDomElement()
      },
      querySelectorAll: (selector) => {
        return [this.createFakeDomElement(), this.createFakeDomElement()]
      },
      createElement: () => {
        return this.createFakeDomElement()
      }
    }
  }

  this.createFakeWindow = () => {
    return {
      clearTimeout: () => {
      }
    }
  }

  this.createEvent = () => {
    return {
      target: this.createFakeDomElement()
    }
  }
}
