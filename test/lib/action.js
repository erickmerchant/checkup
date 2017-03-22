var test = require('tape')
var mockery = require('mockery')
var chalk = require('chalk')

test('test lib/action - no results', function (t) {
  const logged = []

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./log', {
    log: function (msg) {
      logged.push(msg)
    }
  })

  mockery.registerMock('./checks', function () {
    return Promise.resolve(null)
  })

  mockery.registerMock('fs', {
    readdir: function (dir, callback) {
      callback(null, ['test'])
    }
  })

  t.plan(1)

  require('../../lib/action')({}).then(function () {
    t.deepEqual(logged, [
      chalk.bold(chalk.gray('\u2718 ') + 'test')
    ])

    mockery.disable()
  })
})

test('test lib/action - zero length results', function (t) {
  const logged = []

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./log', {
    log: function (msg) {
      logged.push(msg)
    }
  })

  mockery.registerMock('./checks', function () {
    return Promise.resolve([])
  })

  mockery.registerMock('fs', {
    readdir: function (dir, callback) {
      callback(null, ['test'])
    }
  })

  t.plan(1)

  require('../../lib/action')({}).then(function () {
    t.deepEqual(logged, [
      chalk.bold(chalk.green('\u2714 ') + 'test')
    ])

    mockery.disable()
  })
})

test('test lib/action - non-zero length results', function (t) {
  const logged = []

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./log', {
    log: function (msg) {
      logged.push(msg)
    }
  })

  mockery.registerMock('./checks', function () {
    return Promise.resolve(['test'])
  })

  mockery.registerMock('fs', {
    readdir: function (dir, callback) {
      callback(null, ['test'])
    }
  })

  t.plan(1)

  require('../../lib/action')({}).then(function () {
    t.deepEqual(logged, [
      chalk.bold(chalk.red('\u2718 ') + 'test'),
      chalk.gray('  - test')
    ])

    mockery.disable()
  })
})
