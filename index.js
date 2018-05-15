const globals = require('./src/globals')
const console = globals.console
const setInterval = globals.setInterval
const clearInterval = globals.clearInterval
const checks = require('./src/checks')
const chalk = require('chalk')
const path = require('path')
const promisify = require('util').promisify
const glob = promisify(require('glob'))
const logUpdate = require('log-update')
const dots = require('cli-spinners').dots2

module.exports = function (args) {
  return glob(path.join(process.cwd(), args.directory, '*/')).then(function (directories) {
    return directories.reduce(function (acc, directory) {
      return acc.then(function () {
        const name = path.relative(process.cwd(), directory) || '.'
        const frames = dots.frames
        let i = 0

        let interval = setInterval(function () {
          const frame = frames[i = ++i % frames.length]

          logUpdate(`${chalk.bold.cyan(frame)}  ${chalk.bold(name)}`)
        }, dots.interval)

        return checks(directory, args)
          .then(function (results) {
            if (results != null) {
              clearInterval(interval)

              if (results.length) {
                logUpdate(`${chalk.bold.red('\u2718')}  ${chalk.bold(name)}`)

                logUpdate.done()

                for (let result of results) {
                  console.log(chalk.gray('  - ' + result))
                }
              } else {
                logUpdate(`${chalk.bold.green('\u2714')}  ${chalk.bold(name)}`)

                logUpdate.done()
              }
            } else {
              logUpdate(`${chalk.bold.gray('\u2718')}  ${chalk.bold(name)}`)

              logUpdate.done()
            }
          })
      })
    }, Promise.resolve())
  })
}
