const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/checks', function (t) {
  t.plan(1)

  proxyquire('../../src/checks', {
    './check-git-status': function () {
      return function (results) {
        return Promise.resolve(results)
      }
    },
    './check-npm-outdated': function () {
      return function (results) {
        return Promise.resolve(results)
      }
    },
    './check-npm-audit': function () {
      return function (results) {
        return Promise.resolve(results)
      }
    },
    './check-npm-tst': function () {
      return function (results) {
        return Promise.resolve(results)
      }
    }
  })('test', {}).then(function (results) {
    t.deepEqual(results, [])
  })
})
