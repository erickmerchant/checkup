const log = require('./log')
const checks = require('./checks')
const chalk = require('chalk')
const fs = require('fs')
const thenify = require('thenify')
const readdir = thenify(fs.readdir)

module.exports = function (args) {
  const dir = process.cwd()

  return readdir(dir).then(function (files) {
    return Promise.all(files.filter((file) => !file.startsWith('.')).map(function (file) {
      return checks(file, args)
      .then(function (results) {
        return {name: file, results}
      })
    }))
  })
  .then(function (results) {
    results.forEach(function (result) {
      if (result.results != null) {
        if (result.results.length) {
          log.log(chalk.bold(chalk.red('\u2718 ') + result.name))

          result.results.forEach(function (result) {
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
