const test = require('tape')
const mockery = require('mockery')

test('test src/check-npm-tst - no package.json', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('execa', {})

  mockery.registerMock('fs', {
    access (file, mode, callback) {
      callback(new Error('test'))
    },
    constants: { R_OK: true }
  })

  const npmTest = require('../../src/check-npm-tst')

  t.plan(1)

  npmTest('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()

    mockery.deregisterAll()
  })
})

test('test src/check-npm-tst - no results', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('execa', function () {
    return Promise.resolve({})
  })

  mockery.registerMock('fs', {
    access (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const npmTest = require('../../src/check-npm-tst')

  t.plan(1)

  npmTest('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()

    mockery.deregisterAll()
  })
})

test('test src/check-npm-tst - tests failing', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('execa', function () {
    return Promise.resolve(new Error('not ok'))
  })

  mockery.registerMock('fs', {
    access (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const npmTest = require('../../src/check-npm-tst')

  t.plan(1)

  npmTest('test')([]).then(function (results) {
    t.deepEqual(results, ['tests failing'])

    mockery.disable()

    mockery.deregisterAll()
  })
})
