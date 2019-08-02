const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()
const {red, gray, green} = require('kleur')

test('test src/action - zero length results', async (t) => {
  const logged = []

  t.plan(1)

  await proxyquire('../main.js', {
    './src/globals.js': {
      console: {
        log(msg) {
          logged.push(msg)
        }
      }
    },
    async './src/checks'() {
      return []
    }
  })({
    directory: ['test']
  })

  t.deepEqual(logged, [
    `${green('✔︎')} test`
  ])
})

test('test src/action - non-zero length results', async (t) => {
  const logged = []

  t.plan(1)

  await proxyquire('../main.js', {
    './src/globals.js': {
      console: {
        log(msg) {
          logged.push(msg)
        }
      }
    },
    async './src/checks'() {
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
