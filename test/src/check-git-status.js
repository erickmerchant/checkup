const test = require('tape')
const mockery = require('mockery')

test('test src/check-git-status - no results', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('simple-git', function () {
    return {
      status: function (callback) {
        callback(null, {
          not_added: [],
          conflicted: [],
          created: [],
          deleted: [],
          modified: [],
          renamed: [],
          ahead: null,
          behind: null
        })
      }
    }
  })

  mockery.registerMock('fs', {
    access: function (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const checkGitStatus = require('../../src/check-git-status')

  t.plan(1)

  checkGitStatus('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()
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

  mockery.registerMock('simple-git', function () {
    return {
      status: function (callback) {
        callback(null, {
          not_added: ['test'],
          conflicted: ['test'],
          created: ['test'],
          deleted: ['test'],
          modified: ['test'],
          renamed: ['test'],
          ahead: 'test',
          behind: 'test'
        })
      }
    }
  })

  mockery.registerMock('fs', {
    access: function (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const checkGitStatus = require('../../src/check-git-status')

  t.plan(1)

  checkGitStatus('test')([]).then(function (results) {
    t.deepEqual(results, [ 'not added 1', 'conflicted 1', 'created 1', 'deleted 1', 'modified 1', 'renamed 1', 'ahead test', 'behind test' ])

    mockery.disable()
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

  mockery.registerMock('simple-git', function () {
    return {}
  })

  mockery.registerMock('fs', {
    access: function (file, mode, callback) {
      callback(new Error('test'))
    },
    constants: { R_OK: true }
  })

  const checkGitStatus = require('../../src/check-git-status')

  t.plan(1)

  checkGitStatus('test')([]).then(function (results) {
    t.deepEqual(results, [])

    mockery.disable()
  })
  .catch(function (err) {
    t.notOk(err)
  })
})

test('test src/check-git-status - error', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('simple-git', function () {
    return {
      status: function (callback) {
        callback(new Error('test'))
      }
    }
  })

  mockery.registerMock('fs', {
    access: function (file, mode, callback) {
      callback(null)
    },
    constants: { R_OK: true }
  })

  const checkGitStatus = require('../../src/check-git-status')

  t.plan(1)

  checkGitStatus('test')([])
  .catch(function (err) {
    t.ok(err)
  })
})
