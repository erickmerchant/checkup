const simpleGit = require('simple-git')
const fs = require('fs')
const path = require('path')

module.exports = function (file) {
  return function (results) {
    return new Promise(function (resolve, reject) {
      fs.access(path.join(file, '.git'), fs.constants.R_OK, function (err) {
        if (err) {
          resolve(results)

          return
        }

        const repo = simpleGit(file)

        repo.status(function (err, status) {
          if (err) {
            reject(err)
          } else {
            if (status.not_added.length) {
              results.push('not added ' + status.not_added.length)
            }

            if (status.conflicted.length) {
              results.push('conflicted ' + status.conflicted.length)
            }

            if (status.created.length) {
              results.push('created ' + status.created.length)
            }

            if (status.deleted.length) {
              results.push('deleted ' + status.deleted.length)
            }

            if (status.modified.length) {
              results.push('modified ' + status.modified.length)
            }

            if (status.renamed.length) {
              results.push('renamed ' + status.renamed.length)
            }

            if (status.ahead) {
              results.push('ahead ' + status.ahead)
            }

            if (status.behind) {
              results.push('behind ' + status.behind)
            }

            resolve(results)
          }
        })
      })
    })
  }
}
