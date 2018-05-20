const test = require('tape')
const mockery = require('mockery')
const chalk = require('chalk')

test('test src/action - zero length results', function (t) {
  const logged = []

  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('ora', function ({stream, text}) {
    return {
      start () { t.ok(true) },
      fail () { stream.write(chalk.red(text) + '\n') },
      succeed () { stream.write(chalk.green(text) + '\n') }
    }
  })

  mockery.registerMock('./src/globals', {
    stdout: {
      write (msg) {
        logged.push(msg)
      }
    }
  })

  mockery.registerMock('./src/checks', function () {
    return Promise.resolve([])
  })

  mockery.registerMock('glob', function (dir, callback) {
    callback(null, ['test'])
  })

  t.plan(2)

  require('../')({
    directory: './'
  }).then(function () {
    t.deepEqual(logged, [
      chalk.green('test') + '\n'
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

  mockery.registerMock('ora', function ({stream, text}) {
    return {
      start () { t.ok(true) },
      fail () { stream.write(chalk.red(text) + '\n') },
      succeed () { stream.write(chalk.green(text) + '\n') }
    }
  })

  mockery.registerMock('./src/globals', {
    stdout: {
      write (msg) {
        logged.push(msg)
      }
    }
  })

  mockery.registerMock('./src/checks', function () {
    return Promise.resolve(['test'])
  })

  mockery.registerMock('glob', function (dir, callback) {
    callback(null, ['test'])
  })

  t.plan(2)

  require('../')({
    directory: './'
  }).then(function () {
    t.deepEqual(logged, [
      chalk.red('test') + '\n',
      chalk.gray('  - test') + '\n'
    ])

    mockery.disable()

    mockery.deregisterAll()
  })
})
