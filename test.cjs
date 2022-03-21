const tape = require('tape')
const ptape = require('tape-promise').default
const test = ptape(tape)
const localStorageProxy = require('.').default

const isBrowser = typeof window !== 'undefined'

test('test basic behavior', async t => {
  if (isBrowser) window.localStorage.clear()
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
  if (isBrowser) t.equal(window.localStorage.getItem('test'), '{"foo":"bar","biz":["baz","bing"],"bing":{"pow":true},"lspReset":false}')

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

  const state4 = localStorageProxy('test', {
    lspReset: 'busted-again',
    defaults: {
      new: 'defaults',
      biz: 'bar'
    }
  })

  const secondHandler = (ev) => {
    t.fail('Should not fire on the same page')
  }

  const eventHandler = (ev) => {
    t.ok(ev, 'got the event')
    t.equal(state4.beep, 'boop', 'cought the update')
    state4.removeEventListener('update', eventHandler)
    state4.addEventListener('update', secondHandler)
    if (isBrowser) window.localStorage.setItem('foo', 'bar')
  }

  state4.addEventListener('update', eventHandler)

  state4.beep = 'boop'

  t.doesNotThrow(() => {
    console.log(state4, undefined, 'Console logging the proxy does not crash')
  })
})
