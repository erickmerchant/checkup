const test = require('tape')
const mockery = require('mockery')

test('test src/checks', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./check-git-status', function () {
    return function (results) {
      return Promise.resolve(results)
    }
  })

  mockery.registerMock('./check-dependencies', function () {
    return function (results) {
      return Promise.resolve(results)
    }
  })

  t.plan(1)

  require('../../src/checks')('test', {}).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()
  })
})
