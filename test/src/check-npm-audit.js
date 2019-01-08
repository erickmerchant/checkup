const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/check-npm-audit - no package.json', async (t) => {
  const checkDependencies = proxyquire('../../src/check-npm-audit', {
    execa: {},
    fs: {
      access(file, mode, callback) {
        callback(new Error('test'))
      },
      constants: {R_OK: true}
    }
  })

  t.plan(1)

  const results = await checkDependencies('test')

  t.deepEqual(results, [])
})

test('test src/check-npm-audit - no results', async (t) => {
  const checkDependencies = proxyquire('../../src/check-npm-audit', {
    async execa() {
      return {
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
      }
    },
    fs: {
      access(file, mode, callback) {
        callback(null)
      },
      constants: {R_OK: true}
    }
  })

  t.plan(1)

  const results = await checkDependencies('test')

  t.deepEqual(results, [])
})

test('test src/check-npm-audit - 1 result', async (t) => {
  const checkDependencies = proxyquire('../../src/check-npm-audit', {
    async execa() {
      return {
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
      }
    },
    fs: {
      access(file, mode, callback) {
        callback(null)
      },
      constants: {R_OK: true}
    }
  })

  t.plan(1)

  const results = await checkDependencies('test')

  t.deepEqual(results, ['1 critical vulnerability'])
})

test('test src/check-npm-audit - 2 results', async (t) => {
  const checkDependencies = proxyquire('../../src/check-npm-audit', {
    async execa() {
      return {
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
      }
    },
    fs: {
      access(file, mode, callback) {
        callback(null)
      },
      constants: {R_OK: true}
    }
  })

  t.plan(1)

  const results = await checkDependencies('test')

  t.deepEqual(results, ['2 critical vulnerabilities'])
})
