const test = require('tape')
const mockery = require('mockery')
const chalk = require('chalk')

test('test src/action - no results', function (t) {
  const logged = []

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  function logUpdate (msg) {
    logged.push(msg)
  }

  logUpdate.done = () => { }

  mockery.registerMock('log-update', logUpdate)

  mockery.registerMock('./globals', {
    console: {
      log: function (msg) {
        logged.push(msg)
      }
    },
    setInterval: () => { },
    clearInterval: () => { }
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

  require('../../src/action')({}).then(function () {
    t.deepEqual(logged, [
      chalk.bold(chalk.gray('\u2718  ') + 'test')
    ])

    mockery.disable()
  })
})

test('test src/action - zero length results', function (t) {
  const logged = []

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  function logUpdate (msg) {
    logged.push(msg)
  }

  logUpdate.done = () => { }

  mockery.registerMock('log-update', logUpdate)

  mockery.registerMock('./globals', {
    console: {
      log: function (msg) {
        logged.push(msg)
      }
    },
    setInterval: () => { },
    clearInterval: () => { }
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

  require('../../src/action')({}).then(function () {
    t.deepEqual(logged, [
      chalk.bold(chalk.green('\u2714  ') + 'test')
    ])

    mockery.disable()
  })
})

test('test src/action - non-zero length results', function (t) {
  const logged = []

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  function logUpdate (msg) {
    logged.push(msg)
  }

  logUpdate.done = () => { }

  mockery.registerMock('log-update', logUpdate)

  mockery.registerMock('./globals', {
    console: {
      log: function (msg) {
        logged.push(msg)
      }
    },
    setInterval: () => { },
    clearInterval: () => { }
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

  require('../../src/action')({}).then(function () {
    t.deepEqual(logged, [
      chalk.bold(chalk.red('\u2718  ') + 'test'),
      chalk.gray('  - test')
    ])

    mockery.disable()
  })
})
