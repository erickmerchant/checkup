var test = require('tape')
var mockery = require('mockery')
var chalk = require('chalk')

test('test index - success', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./lib/log', {})
  mockery.registerMock('./lib/action', function () {
    return Promise.resolve(true)
  })
  mockery.registerMock('sergeant/command', function () {
    return {
      describe: function (description) {
        t.equal('', description)

        return {
          option: function (option, description) {
            t.equal('unstable', option)
            t.equal('use unstable', description)

            return {
              action: function () {
                t.ok(true)
              }
            }
          }
        }
      },
      run: function () {
        return Promise.resolve(true)
      }
    }
  })

  t.plan(4)

  require('../index')

  mockery.disable()
})

test('test index - failure', function (t) {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: false,
    warnOnUnregistered: false
  })

  mockery.registerMock('./lib/log', {
    error: function (message) {
      t.equal(chalk.red('fail'), message)
    }
  })
  mockery.registerMock('./lib/action', function () {
    return Promise.resolve(true)
  })
  mockery.registerMock('sergeant/command', function () {
    return {
      describe: function (description) {
        return {
          option: function (option, description) {
            return {
              action: function () {
              }
            }
          }
        }
      },
      run: function () {
        return Promise.reject(new Error('fail'))
      }
    }
  })

  t.plan(1)

  require('../index')

  mockery.disable()
})
