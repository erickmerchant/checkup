const checks = require('./src/checks')
const globals = require('./src/globals')
const stdout = globals.stdout
const chalk = require('chalk')
const path = require('path')
const ora = require('ora')

module.exports = (args) => {
  return args.directory.reduce(async (acc, directory) => {
    await acc

    const name = path.relative(process.cwd(), directory) || '.'
    const oraInstance = ora({ stream: stdout, text: name })

    oraInstance.start()

    const results = await checks(path.join(process.cwd(), directory), args)

    if (results.length) {
      oraInstance.fail()

      for (let result of results) {
        stdout.write(chalk.gray('  - ' + result) + '\n')
      }
    } else {
      oraInstance.succeed()
    }
  }, Promise.resolve(null))
}
