const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/checks', async (t) => {
  t.plan(1)

  const results = await proxyquire('../../src/checks.js', {
    './check-git-status.js': async () => [],
    './check-npm-outdated.js': async () => [],
    './check-npm-audit.js': async () => [],
    './check-npm-tst.js': async () => []
  })('test')

  t.deepEqual(results, [])
})
