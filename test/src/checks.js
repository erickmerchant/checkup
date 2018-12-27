const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/checks', async (t) => {
  t.plan(1)

  const results = await proxyquire('../../src/checks', {
    './check-git-status': async () => [],
    './check-npm-outdated': async () => [],
    './check-npm-audit': async () => [],
    './check-npm-tst': async () => []
  })('test')

  t.deepEqual(results, [])
})
