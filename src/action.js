const log = require('./log')
const checks = require('./checks')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const thenify = require('thenify')
const readdir = thenify(fs.readdir)

module.exports = (args) => {
  let directoryPromise

  if (args.directory) {
    directoryPromise = Promise.resolve(args.directory)
  } else {
    const dir = process.cwd()

    directoryPromise = readdir(dir).then((files) => {
      return files
        .filter((file) => !file.startsWith('.'))
        .map((file) => path.join(dir, file))
    })
  }

  return directoryPromise.then((directories) => {
    return Promise.all(directories.map((directory) => {
      return checks(directory, args)
      .then((results) => {
        return {name: path.relative(process.cwd(), directory) || '.', results}
      })
    }))
  })
  .then((results) => {
    results.forEach((result) => {
      if (result.results != null) {
        if (result.results.length) {
          log.log(chalk.bold(chalk.red('\u2718 ') + result.name))

          result.results.forEach((result) => {
            log.log(chalk.gray('  - ' + result))
          })
        } else {
          log.log(chalk.bold(chalk.green('\u2714 ') + result.name))
        }
      } else {
        log.log(chalk.bold(chalk.gray('\u2718 ') + result.name))
      }
    })
  })
}
