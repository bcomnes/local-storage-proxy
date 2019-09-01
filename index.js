const assert = require('nanoassert')
module.exports = (name, opts = {}) => {
  assert(name, 'namepace required')
  const { defaults } = opts

  let state
  try {
    state = JSON.parse(window.localStorage.getItem(name)) || {}
  } catch (e) {
    console.error(e)
    state = {}
  }

  state = Object.assign(defaults, state)

  function boundHandler (rootRef) {
    return {
      get (obj, prop) {
        if (typeof obj[prop] === 'object' && obj[prop] !== null) {
          return new Proxy(obj[prop], boundHandler(rootRef))
        } else {
          return obj[prop]
        }
      },
      set (obj, prop, value) {
        obj[prop] = value
        try {
          window.localStorage.setItem(name, JSON.stringify(rootRef))
          return true
        } catch (e) {
          console.error(e)
          return false
        }
      }
    }
  }

  return new Proxy(state, boundHandler(state))
}
