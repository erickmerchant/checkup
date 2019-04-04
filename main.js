const checks = require('./src/checks.js')
const globals = require('./src/globals.js')
const {red, gray, green} = require('kleur')
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
          stdout.write(`${red('✘')} ${name}\n`)

          for (const result of results) {
            stdout.write(`${gray(`  - ${result}`)}\n`)
          }
        } else {
          stdout.write(`${green('✔︎')} ${name}\n`)
        }
      } catch (err) {
        stdout.write(`${red('✘')} ${name}\n`)

        error(err)
      }
    })())
  }

  return Promise.all(all)
}
