'use strict';
/* eslint-env browser */
const assert = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('webassert'))

let ls
if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
  // A simple localStorage interface so that lsp works in SSR contexts. Not for persistant storage in node.
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

Object.defineProperty(exports, '__esModule', {value: true}).default = (name, opts = {}) => {
  assert(name, 'namepace required')
  const {
    defaults = {},
    lspReset = false,
    storageEventListener = true
  } = opts

  const state = new EventTarget()
  try {
    const restoredState = JSON.parse(ls.getItem(name)) || {}
    if (restoredState.lspReset !== lspReset) {
      ls.removeItem(name)
      for (const [k, v] of Object.entries({
        ...defaults
      })) {
        state[k] = v
      }
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

  if (storageEventListener && typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined') {
    state.addEventListener('storage', (ev) => {
      // Replace state with whats stored on localStorage... it is newer.
      for (const k of Object.keys(state)) {
        delete state[k]
      }
      const restoredState = JSON.parse(ls.getItem(name)) || {}
      for (const [k, v] of Object.entries({
        ...defaults,
        ...restoredState
      })) {
        state[k] = v
      }
      opts.lspReset = restoredState.lspReset
      state.dispatchEvent(new Event('update'))
    })
  }

  function boundHandler (rootRef) {
    return {
      get (obj, prop) {
        if (typeof obj[prop] === 'object' && obj[prop] !== null) {
          return new Proxy(obj[prop], boundHandler(rootRef))
        } else if (typeof obj[prop] === 'function' && obj === rootRef && prop !== 'constructor') {
          // this returns bound EventTarget functions
          return obj[prop].bind(obj)
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
