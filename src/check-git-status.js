const fs = require('fs')
const path = require('path')
const execa = require('execa')

module.exports = (directory) => {
  return (results) => {
    return new Promise((resolve, reject) => {
      fs.access(path.join(directory, '.git'), fs.constants.R_OK, (err) => {
        if (err) {
          resolve(results)

          return
        }

        execa('git', ['status', '--porcelain'], {cwd: directory, reject: false})
          .then((result) => {
            const outdated = result.stdout

            if (outdated !== '') {
              results.push('working directory unclean')
            }

            resolve(results)
          })
          .catch(reject)
      })
    })
  }
}
