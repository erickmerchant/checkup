const path = require('path')
const semver = require('semver')
const thenify = require('thenify')
const exec = thenify(require('child_process').exec)

module.exports = (file) => {
  const dir = process.cwd()
  const packagePath = path.join(dir, file, 'package.json')
  const packageLockPath = path.join(dir, file, 'package-lock.json')

  return (results) => {
    try {
      const packageJSON = require(packagePath)
      const packageLockJSON = require(packageLockPath)
      const dependencies = packageJSON.dependencies || {}
      const devDependencies = packageJSON.devDependencies || {}
      const allDependencies = Object.assign({}, dependencies, devDependencies)

      return Promise.all(Object.keys(allDependencies).map((dependency) => {
        return exec(`npm view ${dependency} --json`).then((out, err) => {
          if (err != null) {
            return Promise.reject(new Error(Buffer.from(...err).toString()))
          }

          out = Buffer.from(...out).toString()

          const outJSON = JSON.parse(out)

          if (outJSON['dist-tags'].latest !== packageLockJSON.dependencies[dependency].version) {
            if (semver.satisfies(outJSON['dist-tags'].latest, allDependencies[dependency])) {
              results.push('update ' + dependency)
            } else {
              results.push('upgrade ' + dependency)
            }
          }
        })
      })).then(() => Promise.resolve(results))
    } catch (e) {
      return Promise.resolve(results)
    }
  }
}
