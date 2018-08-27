const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()

test('test src/check-git-status - no results', function (t) {
  const checkGitStatus = proxyquire('../../src/check-git-status', {
    'execa': function () {
      return Promise.resolve({
        stdout: '## master...origin/master'
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

  checkGitStatus('test')([]).then(function (results) {
    t.deepEqual(results, [])
  })
    .catch(function (err) {
      t.notOk(err)
    })
})

test('test src/check-git-status - results', function (t) {
  const checkGitStatus = proxyquire('../../src/check-git-status', {
    'execa': function () {
      return Promise.resolve({
        stdout: '## develop...origin/develop\nM  foo'
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

  checkGitStatus('test')([]).then(function (results) {
    t.deepEqual(results, [ 'not on master', 'working directory unclean' ])
  })
    .catch(function (err) {
      t.notOk(err)
    })
})

test('test src/check-git-status - no .git', function (t) {
  const checkGitStatus = proxyquire('../../src/check-git-status', {
    'execa': function () {
      return Promise.resolve({
        stdout: '## master...origin/master'
      })
    },
    'fs': {
      access (file, mode, callback) {
        callback(new Error('test'))
      },
      constants: { R_OK: true }
    }
  })

  t.plan(1)

  checkGitStatus('test')([]).then(function (results) {
    t.deepEqual(results, [])
  })
    .catch(function (err) {
      t.notOk(err)
    })
})
