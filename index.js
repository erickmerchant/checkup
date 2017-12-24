const globals = require('./src/globals')
const console = globals.console
const setInterval = globals.setInterval
const clearInterval = globals.clearInterval
const checks = require('./src/checks')
const chalk = require('chalk')
const path = require('path')
const thenify = require('thenify')
const glob = thenify(require('glob'))
const logUpdate = require('log-update')
const dots = require('cli-spinners').dots2

module.exports = function (args) {
  const dir = process.cwd()
  const directoryPromise = Promise.all(args.directory.map((directory) => glob(directory)))
    .then(function (directories) {
      return directories
        .reduce((directories, current) => directories.concat(current.filter((directory) => !directories.includes(directory))), [])
        .map((directory) => path.join(dir, directory))
    })

  return directoryPromise.then(function (directories) {
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

              results.forEach(function (result) {
                console.log(chalk.gray('  - ' + result))
              })
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
