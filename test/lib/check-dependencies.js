var test = require('tape')
var mockery = require('mockery')
var path = require('path')

test('test lib/check-dependencies - failed require', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('david', {
    getUpdatedDependencies: function (manifest, options, callback) {
      callback(null, [])
    }
  })

  const checkDependencies = require('../../lib/check-dependencies')

  t.plan(1)

  checkDependencies('test', {})([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()
  })
})

test('test lib/check-dependencies - no results', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('david', {
    getUpdatedDependencies: function (manifest, options, callback) {
      callback(null, [])
    }
  })

  mockery.registerMock(path.join(process.cwd(), 'test', 'package.json'), {})

  const checkDependencies = require('../../lib/check-dependencies')

  t.plan(1)

  checkDependencies('test', {})([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()
  })
})

test('test lib/check-dependencies - results', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('david', {
    getUpdatedDependencies: function (manifest, options, callback) {
      callback(null, {
        test: null
      })
    }
  })

  mockery.registerMock(path.join(process.cwd(), 'test', 'package.json'), {})

  const checkDependencies = require('../../lib/check-dependencies')

  t.plan(1)

  checkDependencies('test', {})([]).then(function (results) {
    t.deepEqual(results, ['upgrade test'])

    mockery.disable()
  })
})
