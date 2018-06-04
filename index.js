const checks = require('./src/checks')
const globals = require('./src/globals')
const stdout = globals.stdout
const chalk = require('chalk')
const path = require('path')
const ora = require('ora')

module.exports = function (args) {
  return args.directory.reduce(function (acc, directory) {
    return acc.then(function () {
      const name = path.relative(process.cwd(), directory) || '.'
      const oraInstance = ora({stream: stdout, text: name})

      oraInstance.start()

      return checks(path.join(process.cwd(), directory), args)
        .then(function (results) {
          if (results.length) {
            oraInstance.fail()

            for (let result of results) {
              stdout.write(chalk.gray('  - ' + result) + '\n')
            }
          } else {
            oraInstance.succeed()
          }
        })
    })
  }, Promise.resolve())
}
