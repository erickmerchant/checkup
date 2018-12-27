const checks = require('./src/checks')
const globals = require('./src/globals')
const kleur = require('kleur')
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
          stdout.write(`${ kleur.red('✘') } ${ name }\n`)

          for (const result of results) {
            stdout.write(`${ kleur.gray(`  - ${ result }`) }\n`)
          }
        } else {
          stdout.write(`${ kleur.green('✔︎') } ${ name }\n`)
        }
      } catch (err) {
        error(err)

        stdout.write(`${ kleur.red('✘') } ${ name }\n`)
      }
    })())
  }

  return Promise.all(all)
}
