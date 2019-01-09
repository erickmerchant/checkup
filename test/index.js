const test = require('tape')
const proxyquire = require('proxyquire').noPreserveCache()
const {red, gray, green} = require('kleur')

test('test src/action - zero length results', async (t) => {
  const logged = []

  t.plan(1)

  await proxyquire('../', {
    './src/globals': {
      stdout: {
        write(msg) {
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
    `${green('✔︎')} test\n`
  ])
})

test('test src/action - non-zero length results', async (t) => {
  const logged = []

  t.plan(1)

  await proxyquire('../', {
    './src/globals': {
      stdout: {
        write(msg) {
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
    `${red('✘')} test\n`,
    `${gray('  - test')}\n`
  ])
})
