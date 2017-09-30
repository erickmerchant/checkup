const path = require('path')
const semver = require('semver')
const spawn = require('child_process').spawn
const distPromises = {}

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
        return new Promise((resolve, reject) => {
          if (distPromises[dependency] == null) {
            distPromises[dependency] = generateDistPromise(dependency)
          }

          distPromises[dependency].then((latest) => {
            if (latest !== packageLockJSON.dependencies[dependency].version) {
              if (semver.satisfies(latest, allDependencies[dependency])) {
                results.push('update ' + dependency)
              } else {
                results.push('upgrade ' + dependency)
              }
            }

            resolve()
          }, reject)
        })
      })).then(() => Promise.resolve(results))
    } catch (e) {
      return Promise.resolve(results)
    }
  }
}

function generateDistPromise (dependency) {
  return new Promise((resolve, reject) => {
    const view = spawn('npm', ['view', dependency, 'dist-tags', '--json'])
    let data = ''

    view.stdout.on('data', (out) => {
      data += out
    })

    view.stderr.on('data', (err) => {
      reject(new Error(err))
    })

    view.on('close', (code) => {
      const parsed = JSON.parse(data)

      resolve(parsed.latest)
    })
  })
}
