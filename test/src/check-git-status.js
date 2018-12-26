const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/check-git-status - no results', async (t) => {
  const checkGitStatus = proxyquire('../../src/check-git-status', {
    async execa () {
      return {
        stdout: '## master...origin/master'
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

  const results = await checkGitStatus('test')

  t.deepEqual(results, [])
})

test('test src/check-git-status - results', async (t) => {
  const checkGitStatus = proxyquire('../../src/check-git-status', {
    async execa () {
      return {
        stdout: '## develop...origin/develop\nM  foo'
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

  const results = await checkGitStatus('test')

  t.deepEqual(results, ['not on master', 'working directory unclean'])
})

test('test src/check-git-status - no .git', async (t) => {
  const checkGitStatus = proxyquire('../../src/check-git-status', {
    async execa () {
      return {
        stdout: '## master...origin/master'
      }
    },
    fs: {
      access (file, mode, callback) {
        callback(new Error('test'))
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  const results = await checkGitStatus('test')

  t.deepEqual(results, [])
})
