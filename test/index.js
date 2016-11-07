var test = require('tape')
var mockery = require('mockery')

test('test index', function (t) {
  require('../index')

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./lib/log', {})
  mockery.registerMock('./lib/check-git-status', {})
  mockery.registerMock('./lib/check-dependencies', {})
  mockery.registerMock('sergeant/command', {})
  mockery.registerMock('fs', {})

  t.plan(1)

  t.ok(true)

  mockery.disable()
})
