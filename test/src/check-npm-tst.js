const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/check-npm-tst - no package.json', function (t) {
  const npmTest = proxyquire('../../src/check-npm-tst', {
    'execa': {},
    'fs': {
      access (file, mode, callback) {
        callback(new Error('test'))
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  npmTest('test')([]).then(function (results) {
    t.deepEqual(results, [])
  })
})

test('test src/check-npm-tst - no results', function (t) {
  const npmTest = proxyquire('../../src/check-npm-tst', {
    'execa': function () {
      return Promise.resolve({})
    },
    'fs': {
      access (file, mode, callback) {
        callback(null)
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  npmTest('test')([]).then(function (results) {
    t.deepEqual(results, [])
  })
})

test('test src/check-npm-tst - tests failing', function (t) {
  const npmTest = proxyquire('../../src/check-npm-tst', {
    'execa': function () {
      return Promise.resolve(new Error('not ok'))
    },
    'fs': {
      access (file, mode, callback) {
        callback(null)
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  npmTest('test')([]).then(function (results) {
    t.deepEqual(results, ['tests failing'])
  })
})
