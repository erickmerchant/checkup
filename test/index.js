const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()
const chalk = require('chalk')

test('test src/action - zero length results', async (t) => {
  const logged = []

  t.plan(2)

  await proxyquire('../', {
    'ora' ({ stream, text }) {
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
    './src/checks': async () => {
      return []
    }
  })({
    directory: ['test']
  })

  t.deepEqual(logged, [
    chalk.green('test') + '\n'
  ])
})

test('test src/action - non-zero length results', async (t) => {
  const logged = []

  t.plan(2)

  await proxyquire('../', {
    'ora' ({ stream, text }) {
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
    './src/checks': async () => {
      return ['test']
    }
  })({
    directory: ['test']
  })

  t.deepEqual(logged, [
    chalk.red('test') + '\n',
    chalk.gray('  - test') + '\n'
  ])
})
