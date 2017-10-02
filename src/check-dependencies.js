const fs = require('fs')
const path = require('path')
const semver = require('semver')
const spawn = require('child_process').spawn

module.exports = (file) => {
  const dir = process.cwd()

  return (results) => {
    return new Promise((resolve, reject) => {
      fs.access(path.join(file, 'package.json'), fs.constants.R_OK, (err) => {
        if (err) {
          resolve(results)

          return
        }

        const view = spawn('npm', ['outdated', '--json'], {cwd: path.join(dir, file)})
        let data = ''

        view.stdout.on('data', (out) => {
          data += out
        })

        view.stderr.on('data', (err) => {
          reject(new Error(err))
        })

        view.on('close', (code) => {
          let outdated = data ? JSON.parse(data) : {}

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
      })
    })
  }
}
