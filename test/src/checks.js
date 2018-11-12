const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/checks', async (t) => {
  t.plan(1)

  const results = await proxyquire('../../src/checks', {
    './check-git-status': async () => {
      return []
    },
    './check-npm-outdated': async () => {
      return []
    },
    './check-npm-audit': async () => {
      return []
    },
    './check-npm-tst': async () => {
      return []
    }
  })('test')

  t.deepEqual(results, [])
})
