const test = require('tape')
const mockery = require('mockery')

test('test src/check-dependencies - no package.json', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('child_process', {})

  mockery.registerMock('fs', {
    access: function (file, mode, callback) {
      callback(new Error('test'))
    },
    constants: { R_OK: true }
  })

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()
  })
})

test('test src/check-dependencies - no results', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('child_process', {
    spawn () {
      return {
        stdout: {
          on: (foo, next) => { next('') }
        },
        stderr: {
          on: () => {}
        },
        on (foo, next) {
          next(0)
        }
      }
    }
  })

  mockery.registerMock('fs', {
    access: function (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()
  })
})

test('test src/check-dependencies - upgrade', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('child_process', {
    spawn () {
      return {
        stdout: {
          on: (foo, next) => {
            next(`{
              "foo": {
                "latest": "2.0.0",
                "current": "1.0.0"
              }
            }`)
          }
        },
        stderr: {
          on: () => {}
        },
        on (foo, next) {
          next(0)
        }
      }
    }
  })

  mockery.registerMock('fs', {
    access: function (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, ['upgrade foo'])

    mockery.disable()
  })
})

test('test src/check-dependencies - update', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('child_process', {
    spawn () {
      return {
        stdout: {
          on: (foo, next) => {
            next(`{
              "foo": {
                "latest": "1.1.0",
                "current": "1.0.0"
              }
            }`)
          }
        },
        stderr: {
          on: () => {}
        },
        on (foo, next) {
          next(0)
        }
      }
    }
  })

  mockery.registerMock('fs', {
    access: function (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, ['update foo'])

    mockery.disable()
  })
})
