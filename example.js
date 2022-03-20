const localStorageProxy = require('.').default
window.localStorage.clear()
const state = localStorageProxy('namespace', {
  defaults: {
    some: [], // Doesn't override saved state
    defaults: null
  }
})
window.state = state

console.log(state.some) // []
state.some.push('foo')
console.log(state.some) // [ 'foo' ]

console.log(window.localStorage.getItem('namespace')) // {"some":["foo"],"defaults":null}
