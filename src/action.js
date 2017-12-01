const globals = require('./globals')
const console = globals.console
const setInterval = globals.setInterval
const clearInterval = globals.clearInterval
const checks = require('./checks')
const chalk = require('chalk')
const path = require('path')
const thenify = require('thenify')
const glob = thenify(require('glob'))
const logUpdate = require('log-update')
const dots = require('cli-spinners').dots2

module.exports = (args) => {
  const dir = process.cwd()
  const directoryPromise = Promise.all(args.directory.map((directory) => glob(directory)))
    .then((directories) => {
      return directories
        .reduce((directories, current) => directories.concat(current.filter((directory) => !directories.includes(directory))), [])
        .map((directory) => {
          return path.join(dir, directory)
        })
    })

  return directoryPromise.then((directories) => {
    return directories.reduce((acc, directory) => {
      return acc.then(() => {
        const name = path.relative(process.cwd(), directory) || '.'
        const frames = dots.frames
        let i = 0

        let interval = setInterval(() => {
          const frame = frames[i = ++i % frames.length]

          logUpdate(`${chalk.bold.cyan(frame)}  ${chalk.bold(name)}`)
        }, dots.interval)

        return checks(directory, args)
        .then((results) => {
          if (results != null) {
            clearInterval(interval)

            if (results.length) {
              logUpdate(`${chalk.bold.red('\u2718 ')} ${chalk.bold(name)}`)

              logUpdate.done()

              results.forEach((result) => {
                console.log(chalk.gray('  - ' + result))
              })
            } else {
              logUpdate(`${chalk.bold.green('\u2714 ')} ${chalk.bold(name)}`)

              logUpdate.done()
            }
          } else {
            logUpdate(`${chalk.bold.gray('\u2718 ')} ${chalk.bold(name)}`)

            logUpdate.done()
          }
        })
      })
    }, Promise.resolve())
  })
}
