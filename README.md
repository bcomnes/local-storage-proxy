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

console.log(window.localStorage.getItem('namespace')) // {"some":["foo"],"defaults":null}
```

## API

### `lsp = localStorageProxy(namespace, [opts])`

Create a local storage proxy attatched to a root `namespace`.  All gets and sets will JSON.stringify to this key.  Returns nested proxies that update the key when you set the value.  Performance may be limited, but its great for small peices of data with limited writes.

`opts` include:

```js
{
  defaults: {}, // Default keys to set.  Overridden by any existing local storage state
  lspReset: false
}
```

Additions to the `opts.defaults` object can be safely added without overwriting existing data, and can also be assumed to be available even after the user has instantiated default and new data to the same namepace.

Default values are not stored to localStorage so you can safely change them, and the client will pick those up next time they load the page.

An `lspReset` key, set to false by default, can be used to force clear out local storage on all clients reloading if the value is different than the time they last loaded state.  It can be any JSON serializable object.  Strings work well.  This will need to be changed whenever change an existing default.

## License

MIT
