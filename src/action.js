const log = require('./log')
const checks = require('./checks')
const chalk = require('chalk')
const fs = require('fs')
const thenify = require('thenify')
const readdir = thenify(fs.readdir)

module.exports = (args) => {
  const dir = process.cwd()

  return readdir(dir).then((files) => {
    return Promise.all(files.filter((file) => !file.startsWith('.')).map((file) => {
      return checks(file, args)
      .then((results) => {
        return {name: file, results}
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
