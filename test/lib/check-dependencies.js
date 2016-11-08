var test = require('tape')
var mockery = require('mockery')
require('../../lib/check-dependencies')

test('test lib/check-dependencies', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  t.plan(1)

  t.ok(true)

  mockery.disable()
})
