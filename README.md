# local-storage-proxy

Work with window.localStorage as if it were an object

```
npm install local-storage-proxy
```

## Usage

``` js
import localStorageProxy from 'https://unpkg.com/local-storage-proxy@^2?module'

window.localStorage.clear()

const state = localStorageProxy('namespace', {
  defaults: {
    some: [], // Doesn't override saved state
    defaults: null
  },
  lspReset: false
})

console.log(state.some) // []
state.some.push('foo')
console.log(state.some) // [ 'foo' ]

state.addEventListener('update', ev => {
  console.log('state was updated, or localStorage was updated on another tab')
})

console.log(window.localStorage.getItem('namespace')) // {"some":["foo"],"defaults":null}
```

## API

### `lsp = localStorageProxy(namespace, [opts])`

Create a local storage proxy attatched to a root `namespace`.  All gets and sets will JSON.stringify to this key.  Returns nested proxies that update the key when you set the value.  Performance may be limited, but its great for small peices of data with limited writes.

`lsp` is also an instance of an [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) and will emit an event under the `update` namespace. This is triggered whenever you set a value on the local storage proxy, or when the [`storage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event) event fires (e.g. when localStorage updates in another tab). The `storage` event is only listened for in the browser since there is no concept of a separate page or tab in node.js.

`opts` include:

```js
{
  defaults: {}, // Default keys to set.  Overridden by any existing local storage state
  lspReset: false,
  storageEventListener: true
}
```

Additions to the `opts.defaults` object can be safely added without overwriting existing data, and can also be assumed to be available even after the user has instantiated default and new data to the same namepace.

Default values are stored in localStorage. New default values can be added at any time, however if you change a default, you may need to updaate `lspReset`.

An `lspReset` key, set to false by default, can be used to force clear out local storage on all clients reloading if the value is different than the time they last loaded state.  It can be any JSON serializable object.  Strings work well.  This will need to be changed whenever change an existing default.

`storageEventListener` is a boolean that determines if the [`storage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event) event is listened for, (only in the browser). Since there is no fined grained way to listen for a single namespace on this event, you might want to turn this off if localStorage is updated frequently by other routines which will cause local storage proxy to emit many `update` events.

## License

MIT
