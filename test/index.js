const test = require('ava')
const proxyquire = require('proxyquire').noPreserveCache()
const {red, gray, green} = require('kleur')

test('test lib/action - zero length results', async (t) => {
  const logged = []

  await proxyquire('../main.js', {
    './lib/globals.js': {
      console: {
        log(msg) {
          logged.push(msg)
        }
      }
    },
    async './lib/checks'() {
      return []
    }
  })({
    directory: ['test']
  })

  t.deepEqual(logged, [
    `${green('✔︎')} test`
  ])
})

test('test lib/action - non-zero length results', async (t) => {
  const logged = []

  await proxyquire('../main.js', {
    './lib/globals.js': {
      console: {
        log(msg) {
          logged.push(msg)
        }
      }
    },
    async './lib/checks'() {
      return ['test']
    }
  })({
    directory: ['test']
  })

  t.deepEqual(logged, [
    `${red('✘')} test`,
    `${gray('  - test')}`
  ])
})
