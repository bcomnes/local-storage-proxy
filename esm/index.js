/* eslint-env browser */
import assert from 'webassert'

let ls
if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
  const _nodeStorage = {}
  ls = {
    getItem (name) {
      return _nodeStorage[name] || null
    },
    setItem (name, value) {
      if (arguments.length < 2) throw new Error('Failed to execute \'setItem\' on \'Storage\': 2 arguments required, but only 1 present.')
      _nodeStorage[name] = (value).toString()
    },
    removeItem (name) {
      delete _nodeStorage[name]
    }
  }
} else {
  ls = window.localStorage
}

export default (name, opts = {}) => {
  assert(name, 'namepace required')
  const { defaults = {}, lspReset = false } = opts

  const state = new EventTarget()
  try {
    const restoredState = JSON.parse(ls.getItem(name)) || {}
    if (restoredState.lspReset !== lspReset) {
      ls.removeItem(name)
    } else {
      for (const [k, v] of Object.entries({
        ...defaults,
        ...restoredState
      })) {
        state[k] = v
      }
    }
  } catch (e) {
    console.error(e)
    ls.removeItem(name)
  }

  state.lspReset = lspReset

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
          ls.setItem(name, JSON.stringify(rootRef))
          rootRef.dispatchEvent(new Event('update'))
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
