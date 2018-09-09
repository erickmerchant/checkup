const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/check-npm-tst - no package.json', async (t) => {
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

  const results = await npmTest('test')([])

  t.deepEqual(results, [])
})

test('test src/check-npm-tst - no results', async (t) => {
  const npmTest = proxyquire('../../src/check-npm-tst', {
    'execa': async () => {
      return {}
    },
    'fs': {
      access (file, mode, callback) {
        callback(null)
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  const results = await npmTest('test')([])

  t.deepEqual(results, [])
})

test('test src/check-npm-tst - tests failing', async (t) => {
  const npmTest = proxyquire('../../src/check-npm-tst', {
    'execa': async () => {
      return new Error('not ok')
    },
    'fs': {
      access (file, mode, callback) {
        callback(null)
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  const results = await npmTest('test')([])

  t.deepEqual(results, ['tests failing'])
})
