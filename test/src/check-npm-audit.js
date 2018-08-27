const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/check-npm-audit - no package.json', function (t) {
  const checkDependencies = proxyquire('../../src/check-npm-audit', {
    'execa': {},
    'fs': {
      access (file, mode, callback) {
        callback(new Error('test'))
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, [])
  })
})

test('test src/check-npm-audit - no results', function (t) {
  const checkDependencies = proxyquire('../../src/check-npm-audit', {
    'execa': function () {
      return Promise.resolve({
        stdout: `{
          "metadata": {
            "vulnerabilities": {
              "info": 0,
              "low": 0,
              "moderate": 0,
              "high": 0,
              "critical": 0
            }
          }
        }`
      })
    },
    'fs': {
      access (file, mode, callback) {
        callback(null)
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, [])
  })
})

test('test src/check-npm-audit - 1 result', function (t) {
  const checkDependencies = proxyquire('../../src/check-npm-audit', {
    'execa': function () {
      return Promise.resolve({
        stdout: `{
          "metadata": {
            "vulnerabilities": {
              "info": 0,
              "low": 0,
              "moderate": 0,
              "high": 0,
              "critical": 1
            }
          }
        }`
      })
    },
    'fs': {
      access (file, mode, callback) {
        callback(null)
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, ['1 critical vulnerability'])
  })
})

test('test src/check-npm-audit - 2 results', function (t) {
  const checkDependencies = proxyquire('../../src/check-npm-audit', {
    'execa': function () {
      return Promise.resolve({
        stdout: `{
          "metadata": {
            "vulnerabilities": {
              "info": 0,
              "low": 0,
              "moderate": 0,
              "high": 0,
              "critical": 2
            }
          }
        }`
      })
    },
    'fs': {
      access (file, mode, callback) {
        callback(null)
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  checkDependencies('test')([]).then(function (results) {
    t.deepEqual(results, ['2 critical vulnerabilities'])
  })
})
