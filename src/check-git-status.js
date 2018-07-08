const fs = require('fs')
const path = require('path')
const execa = require('execa')

module.exports = function (directory) {
  return function (results) {
    return new Promise(function (resolve, reject) {
      fs.access(path.join(directory, '.git'), fs.constants.R_OK, function (err) {
        if (err) {
          resolve(results)

          return
        }

        execa('git', ['status', '--porcelain', '-b'], {cwd: directory, reject: false})
          .then(function (result) {
            const outdated = result.stdout.split('\n')

            if (outdated[0] !== '## master...origin/master') {
              results.push('not on master')
            }

            if (outdated.length > 1) {
              results.push('working directory unclean')
            }

            resolve(results)
          })
          .catch(reject)
      })
    })
  }
}
