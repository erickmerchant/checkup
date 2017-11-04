const fs = require('fs')
const path = require('path')
const semver = require('semver')
const execa = require('execa')

module.exports = (directory) => {
  return (results) => {
    return new Promise((resolve, reject) => {
      fs.access(path.join(directory, 'package-lock.json'), fs.constants.R_OK, (err) => {
        if (err) {
          resolve(results)

          return
        }

        const locked = require(path.join(directory, 'package-lock.json'))

        execa('npm', ['outdated', '--json'], {cwd: directory, reject: false})
          .then((result) => {
            const outdated = result.stdout ? JSON.parse(result.stdout) : {}

            Object.keys(outdated).forEach((dependency) => {
              const latest = outdated[dependency].latest
              const current = locked.dependencies[dependency].version

              let next = outdated[dependency].wanted

              if (latest != null && semver.prerelease(latest) == null) {
                next = latest
              }

              if (next != null && next !== current) {
                if (semver.diff(next, current) === 'major') {
                  results.push('upgrade ' + dependency)
                } else if (!semver.lt(next, current)) {
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
