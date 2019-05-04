const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/check-npm-tst - no package.json', async (t) => {
  const npmTest = proxyquire('../../src/check-npm-tst.js', {
    execa: {},
    fs: {
      access(file, mode, callback) {
        callback(Error('test'))
      },
      constants: {R_OK: true}
    }
  })

  t.plan(1)

  const results = await npmTest('test')

  t.deepEqual(results, [])
})

test('test src/check-npm-tst - no results', async (t) => {
  const npmTest = proxyquire('../../src/check-npm-tst.js', {
    async execa() {
      return {}
    },
    fs: {
      access(file, mode, callback) {
        callback(null)
      },
      constants: {R_OK: true}
    }
  })

  t.plan(1)

  const results = await npmTest('test')

  t.deepEqual(results, [])
})

test('test src/check-npm-tst - tests failing', async (t) => {
  const npmTest = proxyquire('../../src/check-npm-tst.js', {
    async execa() {
      return {code: 1}
    },
    fs: {
      access(file, mode, callback) {
        callback(null)
      },
      constants: {R_OK: true}
    }
  })

  t.plan(1)

  const results = await npmTest('test')

  t.deepEqual(results, ['tests failing'])
})
