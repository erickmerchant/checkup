const checks = require('./src/checks.js')
const {console} = require('./src/globals.js')
const {red, gray, green} = require('kleur')
const path = require('path')
const error = require('sergeant/error')

module.exports = (args) => {
  const all = []

  for (const directory of args.directory) {
    const name = path.relative(process.cwd(), directory) || '.'

    all.push((async () => {
      try {
        const results = await checks(path.join(process.cwd(), directory))

        if (results.length) {
          console.log(`${red('✘')} ${name}`)

          for (const result of results) {
            console.log(`${gray(`  - ${result}`)}`)
          }
        } else {
          console.log(`${green('✔︎')} ${name}`)
        }
      } catch (err) {
        console.log(`${red('✘')} ${name}`)

        error(err)
      }
    })())
  }

  return Promise.all(all)
}
