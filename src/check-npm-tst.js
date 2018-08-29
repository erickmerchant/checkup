const fs = require('fs')
const path = require('path')
const execa = require('execa')

module.exports = function (directory) {
  return function (results) {
    return new Promise(function (resolve, reject) {
      fs.access(path.join(directory, 'package-lock.json'), fs.constants.R_OK, function (err) {
        if (err) {
          resolve(results)

          return
        }

        execa('npm', ['test'], { cwd: directory, reject: false })
          .then(function (result) {
            if (result != null && result instanceof Error) {
              results.push('tests failing')
            }

            resolve(results)
          })
          .catch(reject)
      })
    })
  }
}
