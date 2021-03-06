import test from 'ava'

import promiseCatchif from '../src'

promiseCatchif()

test('installed', t => {
  t.is(typeof Promise.prototype.catchif, 'function')
})

test('idempotent', t => {
  t.notThrows(promiseCatchif)
})

test('ignores non promise lib', t => {
  t.notThrows(() => promiseCatchif(17))
})

test('installs on custom promise lib', t => {
  promiseCatchif(fn)
  t.is(fn.prototype.catchif, Promise.prototype.catchif)

  function fn () {}
})

test('empty object catches', async t => {
  const e = new Error()

  await Promise.reject(e)
    .catchif({}, err => {
      t.is(err, e)
    })
    .catch(t.fail)
})

test('catches on constructor', async t => {
  class MyError extends Error {}

  const e = new MyError()

  await Promise.reject(e)
    .catchif(MyError, err => {
      t.is(err, e)
    })
    .catch(t.fail)
})

test('misses on constructor', async t => {
  class MyError extends Error {}

  const e = new Error()

  await Promise.reject(e)
    .catchif(MyError, t.fail)
    .catch(err => {
      t.is(err, e)
    })
    .catch(t.fail)
})

test('catch on property value', async t => {
  const e = new Error()
  e.foo = 'bar'

  await Promise.reject(e)
    .catchif({ foo: 'bar' }, err => {
      t.is(err, e)
    })
    .catch(t.fail)
})

test('miss on property value', async t => {
  const e = new Error()
  e.foo = 'bar'
  e.baz = 'quux'

  await Promise.reject(e)
    .catchif({ foo: 'bar', baz: 'foobar' }, t.fail)
    .catch(err => {
      t.is(err, e)
    })
})

test('catch on property function', async t => {
  const e = new Error()
  e.foo = 'bar'

  const pred = {
    foo (v) {
      t.is(v, 'bar')
      return true
    }
  }

  await Promise.reject(e)
    .catchif(pred, err => {
      t.is(err, e)
    })
    .catch(t.fail)
})

test('miss on property function', async t => {
  const e = new Error()
  e.baz = 'quux'
  e.foo = 'bar'

  const pred = {
    baz: 'quux',
    foo (v) {
      t.is(v, 'bar')
      return false
    }
  }

  await Promise.reject(e)
    .catchif(pred, t.fail)
    .catch(err => {
      t.is(err, e)
    })
})

test('unknown type of predicate', async t => {
  const e = new Error()

  await Promise.reject(e)
    .catchif('foobar', t.fail)
    .catch(err => {
      t.is(err, e)
    })
})

test('non object error', async t => {
  const e = 'foobar'

  await Promise.reject(e)
    .catchif({}, t.fail)
    .catch(err => {
      t.is(err, e)
    })
})
