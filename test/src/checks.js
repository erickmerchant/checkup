const test = require('ava')
const proxyquire = require('proxyquire').noPreserveCache()

test('test lib/checks', async (t) => {
  const results = await proxyquire('../../lib/checks.js', {
    './check-git-status.js': async () => [],
    './check-npm-outdated.js': async () => [],
    './check-npm-audit.js': async () => [],
    './check-npm-tst.js': async () => []
  })('test')

  t.deepEqual(results, [])
})
