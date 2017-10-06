const fs = require('fs')
const path = require('path')
const semver = require('semver')
const execa = require('execa')

module.exports = (file) => {
  const dir = process.cwd()

  return (results) => {
    return new Promise((resolve, reject) => {
      fs.access(path.join(file, 'package.json'), fs.constants.R_OK, (err) => {
        if (err) {
          resolve(results)

          return
        }

        execa('npm', ['outdated', '--json'], {cwd: path.join(dir, file), reject: false})
          .then((result) => {
            let outdated = result.stdout ? JSON.parse(result.stdout) : {}

            Object.keys(outdated).forEach((dependency) => {
              let next = semver.prerelease(outdated[dependency].latest) == null ? outdated[dependency].latest : outdated[dependency].wanted

              if (next !== outdated[dependency].current) {
                if (semver.diff(next, outdated[dependency].current) === 'major') {
                  results.push('upgrade ' + dependency)
                } else if (!semver.lt(next, outdated[dependency].current)) {
                  results.push('update ' + dependency)
                }
              }
            })

            resolve(results)
          })
          .catch(reject)
      })
    })
  }
}
