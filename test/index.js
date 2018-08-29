const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()
const chalk = require('chalk')

test('test src/action - zero length results', function (t) {
  const logged = []

  t.plan(2)

  proxyquire('../', {
    'ora': function ({ stream, text }) {
      return {
        start () { t.ok(true) },
        fail () { stream.write(chalk.red(text) + '\n') },
        succeed () { stream.write(chalk.green(text) + '\n') }
      }
    },
    './src/globals': {
      stdout: {
        write (msg) {
          logged.push(msg)
        }
      }
    },
    './src/checks': function () {
      return Promise.resolve([])
    }
  })({
    directory: ['test']
  }).then(function () {
    t.deepEqual(logged, [
      chalk.green('test') + '\n'
    ])
  })
})

test('test src/action - non-zero length results', function (t) {
  const logged = []

  t.plan(2)

  proxyquire('../', {
    'ora': function ({ stream, text }) {
      return {
        start () { t.ok(true) },
        fail () { stream.write(chalk.red(text) + '\n') },
        succeed () { stream.write(chalk.green(text) + '\n') }
      }
    },
    './src/globals': {
      stdout: {
        write (msg) {
          logged.push(msg)
        }
      }
    },
    './src/checks': function () {
      return Promise.resolve(['test'])
    }
  })({
    directory: ['test']
  }).then(function () {
    t.deepEqual(logged, [
      chalk.red('test') + '\n',
      chalk.gray('  - test') + '\n'
    ])
  })
})
