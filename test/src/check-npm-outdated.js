const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache().noCallThru()

test('test src/check-npm-outdated - no package.json', function (t) {
  const checkDependencies = proxyquire('../../src/check-npm-outdated', {
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

test('test src/check-npm-outdated - no results', function (t) {
  const checkDependencies = proxyquire('../../src/check-npm-outdated', {
    'test/package-lock.json': {
      dependencies: {
        foo: {
          version: '1.0.0'
        }
      }
    },
    'execa': function () {
      return Promise.resolve({
        stdout: ''
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

test('test src/check-npm-outdated - upgrade', function (t) {
  const checkDependencies = proxyquire('../../src/check-npm-outdated', {
    'test/package-lock.json': {
      dependencies: {
        foo: {
          version: '1.0.0'
        }
      }
    },
    'execa': function () {
      return Promise.resolve({
        stdout: `{
          "foo": {
            "wanted": "2.0.0"
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
    t.deepEqual(results, ['upgrade foo'])
  })
})

test('test src/check-npm-outdated - update', function (t) {
  const checkDependencies = proxyquire('../../src/check-npm-outdated', {
    'test/package-lock.json': {
      dependencies: {
        foo: {
          version: '1.0.0'
        }
      }
    },
    'execa': function () {
      return Promise.resolve({
        stdout: `{
          "foo": {
            "wanted": "1.1.0"
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
    t.deepEqual(results, ['update foo'])
  })
})
