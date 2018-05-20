const globals = require('./src/globals')
const stdout = globals.stdout
const checks = require('./src/checks')
const chalk = require('chalk')
const path = require('path')
const promisify = require('util').promisify
const glob = promisify(require('glob'))
const ora = require('ora')

module.exports = function (args) {
  return glob(path.join(process.cwd(), args.directory, '*/')).then(function (directories) {
    return directories.reduce(function (acc, directory) {
      return acc.then(function () {
        const name = path.relative(process.cwd(), directory) || '.'
        const oraInstance = ora({stream: stdout, text: name})

        oraInstance.start()

        return checks(directory, args)
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
  })
}
