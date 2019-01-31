export default function JsonP () {
  this.send = function (src, options) {
    this.cleanUp()
    const jsonpCallbackName = options.callbackName || 'jsonp',
      successCallback = options.successCallback || function () {},
      timeoutCallback = options.timeoutCallback || function () {},
      timeout = options.timeout || 3000

    const timeoutTrigger = window.setTimeout(() => {
      window[jsonpCallbackName] = () => {}
      this.cleanUp()
      timeoutCallback()
    }, timeout)

    window[jsonpCallbackName] = (data) => {
      window.clearTimeout(timeoutTrigger)
      this.cleanUp()
      successCallback(data)
    }

    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.setAttribute('data-ref', 'jsonp-script')
    script.src = src

    document.getElementsByTagName('head')[0].appendChild(script)
  }

  this.cleanUp = function () {
    if (!!document.querySelector('[data-ref~="jsonp-script"]')) {
      document.querySelector('[data-ref~="jsonp-script"]').remove()
    }
  }
}
