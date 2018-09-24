const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache().noCallThru()

test('test src/check-npm-outdated - no package.json', async (t) => {
  const checkDependencies = proxyquire('../../src/check-npm-outdated', {
    execa: {},
    fs: {
      access (file, mode, callback) {
        callback(new Error('test'))
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  const results = await checkDependencies('test')([])

  t.deepEqual(results, [])
})

test('test src/check-npm-outdated - no results', async (t) => {
  const checkDependencies = proxyquire('../../src/check-npm-outdated', {
    'test/package-lock.json': {
      dependencies: {
        foo: {
          version: '1.0.0'
        }
      }
    },
    async execa () {
      return {
        stdout: ''
      }
    },
    fs: {
      access (file, mode, callback) {
        callback(null)
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  const results = await checkDependencies('test')([])

  t.deepEqual(results, [])
})

test('test src/check-npm-outdated - upgrade', async (t) => {
  const checkDependencies = proxyquire('../../src/check-npm-outdated', {
    'test/package-lock.json': {
      dependencies: {
        foo: {
          version: '1.0.0'
        }
      }
    },
    async execa () {
      return {
        stdout: `{
          "foo": {
            "wanted": "2.0.0"
          }
        }`
      }
    },
    fs: {
      access (file, mode, callback) {
        callback(null)
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  const results = await checkDependencies('test')([])

  t.deepEqual(results, ['upgrade foo'])
})

test('test src/check-npm-outdated - update', async (t) => {
  const checkDependencies = proxyquire('../../src/check-npm-outdated', {
    'test/package-lock.json': {
      dependencies: {
        foo: {
          version: '1.0.0'
        }
      }
    },
    async execa () {
      return {
        stdout: `{
          "foo": {
            "wanted": "1.1.0"
          }
        }`
      }
    },
    fs: {
      access (file, mode, callback) {
        callback(null)
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  const results = await checkDependencies('test')([])

  t.deepEqual(results, ['update foo'])
})
