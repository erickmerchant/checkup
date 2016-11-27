const thenify = require('thenify')
const path = require('path')
const david = require('david')
const getUpdatedDependencies = thenify(david.getUpdatedDependencies)

module.exports = function checkDependencies (file, options) {
  const dir = process.cwd()
  const packagePath = path.join(dir, file, 'package.json')

  options = Object.assign(options, {npm: {progress: false}})

  return function (results) {
    try {
      const manifest = require(packagePath)

      return getUpdatedDependencies(manifest, options).then(function (current) {
        Object.keys(current).forEach(function (name) {
          results.push('upgrade ' + name)
        })

        return Promise.resolve(results)
      })
    } catch (e) {
      return Promise.resolve(results)
    }
  }
}
