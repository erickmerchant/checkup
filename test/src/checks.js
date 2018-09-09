const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/checks', async (t) => {
  t.plan(1)

  const results = await proxyquire('../../src/checks', {
    './check-git-status': () => async (results) => {
      return results
    },
    './check-npm-outdated': () => async (results) => {
      return results
    },
    './check-npm-audit': () => async (results) => {
      return results
    },
    './check-npm-tst': () => async (results) => {
      return results
    }
  })('test', {})

  t.deepEqual(results, [])
})
