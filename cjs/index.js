'use strict';
const assert = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('webassert'))

if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
  let _nodeStorage = {}
  var localStorage = {
    getItem(name) {
      return _nodeStorage[name] || null
    },
    setItem(name, value) {
      if (arguments.length < 2) throw new Error('Failed to execute \'setItem\' on \'Storage\': 2 arguments required, but only 1 present.')
      _nodeStorage[name] = (value).toString()
    }
  }
} else {
  var localStorage = window.localStorage
}

Object.defineProperty(exports, '__esModule', {value: true}).default = (name, opts = {}) => {
  assert(name, 'namepace required')
  const { defaults = {} } = opts

  let state
  try {
    state = JSON.parse(localStorage.getItem(name)) || {}
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
          localStorage.setItem(name, JSON.stringify(rootRef))
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
