var test = require('tape')
var mockery = require('mockery')

test('test lib/action', function (t) {
  require('../../lib/action')

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  t.plan(1)

  t.ok(true)

  mockery.disable()
})
