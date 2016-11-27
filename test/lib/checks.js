var test = require('tape')
var mockery = require('mockery')
require('../../lib/checks')

test('test lib/checks', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  t.plan(1)

  t.ok(true)

  mockery.disable()
})
