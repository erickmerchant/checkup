const checks = require('./src/checks')
const globals = require('./src/globals')
const chalk = require('chalk')
const path = require('path')
const error = require('sergeant/error')
const stdout = globals.stdout

module.exports = (args) => {
  const all = []

  for (const directory of args.directory) {
    const name = path.relative(process.cwd(), directory) || '.'

    all.push((async () => {
      try {
        const results = await checks(path.join(process.cwd(), directory))

        if (results.length) {
          stdout.write(chalk.red('✘') + ' ' + name + '\n')

          for (const result of results) {
            stdout.write(chalk.gray('  - ' + result) + '\n')
          }
        } else {
          stdout.write(chalk.green('✔︎') + ' ' + name + '\n')
        }
      } catch (err) {
        error(err)

        stdout.write(chalk.red('✘') + ' ' + name + '\n')
      }
    })())
  }

  return Promise.all(all)
}
