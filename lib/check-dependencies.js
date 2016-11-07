const thenify = require('thenify')
const david = require('david')
const getUpdatedDependencies = thenify(david.getUpdatedDependencies)

module.exports = function checkDependencies (manifest, options) {
  options = Object.assign(options, {npm: {progress: false}})

  return function (results) {
    return getUpdatedDependencies(manifest, options).then(function (current) {
      Object.keys(current).forEach(function (name) {
        results.push('upgrade ' + name)
      })

      return Promise.resolve(results)
    })
  }
}
