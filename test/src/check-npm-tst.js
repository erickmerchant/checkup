const test = require('ava')
const proxyquire = require('proxyquire').noPreserveCache()

test('test lib/check-npm-tst - no package.json', async (t) => {
  const npmTest = proxyquire('../../lib/check-npm-tst.js', {
    execa: {},
    fs: {
      access(file, mode, callback) {
        callback(Error('test'))
      },
      constants: {R_OK: true}
    }
  })

  const results = await npmTest('test')

  t.deepEqual(results, [])
})

test('test lib/check-npm-tst - no results', async (t) => {
  const npmTest = proxyquire('../../lib/check-npm-tst.js', {
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

  const results = await npmTest('test')

  t.deepEqual(results, [])
})

test('test lib/check-npm-tst - tests failing', async (t) => {
  const npmTest = proxyquire('../../lib/check-npm-tst.js', {
    async execa() {
      return {exitCode: 1}
    },
    fs: {
      access(file, mode, callback) {
        callback(null)
      },
      constants: {R_OK: true}
    }
  })

  const results = await npmTest('test')

  t.deepEqual(results, ['tests failing'])
})
