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

        execa('npm', ['audit', '--json'], {cwd: directory, reject: false})
          .then(function (result) {
            const report = result.stdout ? JSON.parse(result.stdout) : {}

            for (let type of Object.keys(report.metadata.vulnerabilities)) {
              let count = report.metadata.vulnerabilities[type]
              if (count > 0) {
                results.push(count + ' ' + type + ' ' + (count > 1 ? 'vulnerabilities' : 'vulnerability'))
              }
            }

            resolve(results)
          })
          .catch(reject)
      })
    })
  }
}
