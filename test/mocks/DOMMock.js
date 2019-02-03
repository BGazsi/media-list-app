export default function DOMMock () {
  this.areInputsValid = true
  this.createFakeDomElement = (options) => {
    return {
      addEventListener: (eventName) => {
        if (!options || !options.eventStore) {
          return
        }
        options.eventStore.push(eventName)
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
      checkValidity: () => {
        return this.areInputsValid
      },
      reportValidity: () => {

      }
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
