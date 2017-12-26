const test = require('tape')
const mockery = require('mockery')

test('test src/check-git-status - no results', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('execa', function () {
    return Promise.resolve({
      stdout: '## master...origin/master'
    })
  })

  mockery.registerMock('fs', {
    access (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const checkGitStatus = require('../../src/check-git-status')

  t.plan(1)

  checkGitStatus('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()

    mockery.deregisterAll()
  })
  .catch(function (err) {
    t.notOk(err)
  })
})

test('test src/check-git-status - results', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('execa', function () {
    return Promise.resolve({
      stdout: 'M  foo'
    })
  })

  mockery.registerMock('fs', {
    access (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const checkGitStatus = require('../../src/check-git-status')

  t.plan(1)

  checkGitStatus('test')([]).then(function (results) {
    t.deepEqual(results, [ 'working directory unclean' ])

    mockery.disable()

    mockery.deregisterAll()
  })
  .catch(function (err) {
    t.notOk(err)
  })
})

test('test src/check-git-status - no .git', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('execa', function () {
    return Promise.resolve({
      stdout: '## master...origin/master'
    })
  })

  mockery.registerMock('fs', {
    access (file, mode, callback) {
      callback(new Error('test'))
    },
    constants: { R_OK: true }
  })

  const checkGitStatus = require('../../src/check-git-status')

  t.plan(1)

  checkGitStatus('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()

    mockery.deregisterAll()
  })
  .catch(function (err) {
    t.notOk(err)
  })
})
