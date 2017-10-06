const fs = require('fs')
const path = require('path')
const execa = require('execa')

module.exports = (file) => {
  const dir = process.cwd()

  return (results) => {
    return new Promise((resolve, reject) => {
      fs.access(path.join(file, '.git'), fs.constants.R_OK, (err) => {
        if (err) {
          resolve(results)

          return
        }

        execa('git', ['status', '--porcelain'], {cwd: path.join(dir, file), reject: false})
          .then((result) => {
            let outdated = result.stdout

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
