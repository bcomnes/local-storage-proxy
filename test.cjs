const tape = require('tape')
const ptape = require('tape-promise').default
const test = ptape(tape)
const localStorageProxy = require('.').default

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
  t.equal(window.localStorage.getItem('test'), '{"foo":"bar","biz":["baz","bing"],"bing":{"pow":true},"lspReset":false}')

  const state2 = localStorageProxy('test', {
    lspReset: false,
    defaults: {
      foo: 'bar',
      biz: ['baz'],
      bing: {
        pow: true
      }
    }
  })

  t.deepEqual(state2.biz, ['baz', 'bing'], 'state is preserved')

  const state3 = localStorageProxy('test', {
    lspReset: 'busted',
    defaults: {
      new: 'defaults',
      biz: 'bar'
    }
  })

  t.deepEqual(state3.new, 'defaults', 'state is busted')
  t.deepEqual(state3.biz, 'bar', 'state is busted')
})
