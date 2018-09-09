const fs = require('fs')
const path = require('path')
const semver = require('semver')
const execa = require('execa')

module.exports = (directory) => (results) => {
  return new Promise((resolve, reject) => {
    fs.access(path.join(directory, 'package-lock.json'), fs.constants.R_OK, async (err) => {
      if (err) {
        resolve(results)

        return
      }

      const locked = require(path.join(directory, 'package-lock.json'))

      const result = await execa('npm', ['outdated', '--json'], { cwd: directory, reject: false })

      const outdated = result.stdout ? JSON.parse(result.stdout) : {}

      for (let dependency of Object.keys(outdated)) {
        const latest = outdated[dependency].latest
        const current = locked.dependencies[dependency].version

        let next = outdated[dependency].wanted

        try {
          if (latest != null && semver.prerelease(latest) == null) {
            next = latest
          }

          if (next != null && next !== current) {
            if (semver.diff(next, current) === 'major' || semver.major(current) < 1) {
              results.push('upgrade ' + dependency)
            } else if (!semver.lt(next, current)) {
              results.push('update ' + dependency)
            }
          }
        } catch (e) {
          results.push('linked ' + dependency)
        }
      }

      resolve(results)
    })
  })
}
