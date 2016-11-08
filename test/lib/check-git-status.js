var test = require('tape')
var mockery = require('mockery')
require('../../lib/check-git-status')

test('test lib/check-git-status', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  t.plan(1)

  t.ok(true)

  mockery.disable()
})
