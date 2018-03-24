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

  logUpdate.done = () => {}

  mockery.registerMock('log-update', logUpdate)

  mockery.registerMock('./src/globals', {
    console: {
      log (msg) {
        logged.push(msg)
      }
    },
    setInterval () {},
    clearInterval () {}
  })

  mockery.registerMock('./src/checks', function () {
    return Promise.resolve(null)
  })

  mockery.registerMock('glob', function (dir, callback) {
    callback(null, ['test'])
  })

  t.plan(1)

  require('../')({
    directory: './'
  }).then(function () {
    t.deepEqual(logged, [
      chalk.bold.gray('\u2718') + '  ' + chalk.bold('test')
    ])

    mockery.disable()

    mockery.deregisterAll()
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

  logUpdate.done = () => {}

  mockery.registerMock('log-update', logUpdate)

  mockery.registerMock('./src/globals', {
    console: {
      log (msg) {
        logged.push(msg)
      }
    },
    setInterval () {},
    clearInterval () {}
  })

  mockery.registerMock('./src/checks', function () {
    return Promise.resolve([])
  })

  mockery.registerMock('glob', function (dir, callback) {
    callback(null, ['test'])
  })

  t.plan(1)

  require('../')({
    directory: './'
  }).then(function () {
    t.deepEqual(logged, [
      chalk.bold.green('\u2714') + '  ' + chalk.bold('test')
    ])

    mockery.disable()

    mockery.deregisterAll()
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

  logUpdate.done = () => {}

  mockery.registerMock('log-update', logUpdate)

  mockery.registerMock('./src/globals', {
    console: {
      log (msg) {
        logged.push(msg)
      }
    },
    setInterval () {},
    clearInterval () {}
  })

  mockery.registerMock('./src/checks', function () {
    return Promise.resolve(['test'])
  })

  mockery.registerMock('glob', function (dir, callback) {
    callback(null, ['test'])
  })

  t.plan(1)

  require('../')({
    directory: './'
  }).then(function () {
    t.deepEqual(logged, [
      chalk.bold.red('\u2718') + '  ' + chalk.bold('test'),
      chalk.gray('  - test')
    ])

    mockery.disable()

    mockery.deregisterAll()
  })
})
