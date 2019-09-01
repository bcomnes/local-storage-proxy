const tape = require('tape')
const ptape = require('tape-promise').default
const test = ptape(tape)
const localStorageProxy = require('.')

test('test basic behavior', async t => {
  window.localStorage.clear()
  const state = localStorageProxy('test', {
    defaults: {
      foo: 'bar',
      biz: ['baz'],
      bing: {
        pow: true
      }
    }
  })
  t.equal(state.foo, 'bar')
  state.biz.push('bing')
  t.equal(window.localStorage.getItem('test'), '{"foo":"bar","biz":["baz","bing"],"bing":{"pow":true}}')
})
