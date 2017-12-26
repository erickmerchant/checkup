const test = require('tape')
const mockery = require('mockery')

test('test src/check-dependencies - no package.json', function (t) {
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

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()

    mockery.deregisterAll()
  })
})

test('test src/check-dependencies - no results', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('test/package-lock.json', {
    dependencies: {
      foo: {
        version: '1.0.0'
      }
    }
  })

  mockery.registerMock('execa', function () {
    return Promise.resolve({
      stdout: ''
    })
  })

  mockery.registerMock('fs', {
    access (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()

    mockery.deregisterAll()
  })
})

test('test src/check-dependencies - upgrade', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('test/package-lock.json', {
    dependencies: {
      foo: {
        version: '1.0.0'
      }
    }
  })

  mockery.registerMock('execa', function () {
    return Promise.resolve({
      stdout: `{
        "foo": {
          "wanted": "2.0.0"
        }
      }`
    })
  })

  mockery.registerMock('fs', {
    access (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, ['upgrade foo'])

    mockery.disable()

    mockery.deregisterAll()
  })
})

test('test src/check-dependencies - update', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('test/package-lock.json', {
    dependencies: {
      foo: {
        version: '1.0.0'
      }
    }
  })

  mockery.registerMock('execa', function () {
    return Promise.resolve({
      stdout: `{
        "foo": {
          "wanted": "1.1.0"
        }
      }`
    })
  })

  mockery.registerMock('fs', {
    access (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, ['update foo'])

    mockery.disable()

    mockery.deregisterAll()
  })
})
