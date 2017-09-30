const test = require('tape')
const mockery = require('mockery')

test('test src/check-dependencies - failed require', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('child_process', {
    spawn () {
      return {
        stdout: {
          on: (foo, next) => { next('["2.1.0"]') }
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

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test/fixture/foo', {})([]).then(function (results) {
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
          on: (foo, next) => { next('["2.1.0"]') }
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

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test/fixture', {})([]).then(function (results) {
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
          on: (foo, next) => { next('["3.1.0"]') }
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

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test/fixture', {})([]).then(function (results) {
    t.deepEqual(results, ['upgrade chalk'])

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
          on: (foo, next) => { next('["2.2.0"]') }
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

  const checkDependencies = require('../../src/check-dependencies')

  t.plan(1)

  checkDependencies('test/fixture', {})([]).then(function (results) {
    t.deepEqual(results, ['update chalk'])

    mockery.disable()
  })
})
