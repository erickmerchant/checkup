const test = require('tape')
const mockery = require('mockery')

test('test src/check-npm-audit - no package.json', function (t) {
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

  const checkDependencies = require('../../src/check-npm-audit')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()

    mockery.deregisterAll()
  })
})

test('test src/check-npm-audit - no results', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('execa', function () {
    return Promise.resolve({
      stdout: `{
        "metadata": {
          "vulnerabilities": {
            "info": 0,
            "low": 0,
            "moderate": 0,
            "high": 0,
            "critical": 0
          }
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

  const checkDependencies = require('../../src/check-npm-audit')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()

    mockery.deregisterAll()
  })
})

test('test src/check-npm-audit - 1 result', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('execa', function () {
    return Promise.resolve({
      stdout: `{
        "metadata": {
          "vulnerabilities": {
            "info": 0,
            "low": 0,
            "moderate": 0,
            "high": 0,
            "critical": 1
          }
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

  const checkDependencies = require('../../src/check-npm-audit')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, ['1 critical vulnerability'])

    mockery.disable()

    mockery.deregisterAll()
  })
})

test('test src/check-npm-audit - 2 results', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('execa', function () {
    return Promise.resolve({
      stdout: `{
        "metadata": {
          "vulnerabilities": {
            "info": 0,
            "low": 0,
            "moderate": 0,
            "high": 0,
            "critical": 2
          }
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

  const checkDependencies = require('../../src/check-npm-audit')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, ['2 critical vulnerabilities'])

    mockery.disable()

    mockery.deregisterAll()
  })
})
