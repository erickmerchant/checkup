const simpleGit = require('simple-git')

module.exports = function (file) {
  const repo = simpleGit(file)

  return function (results) {
    return new Promise(function (resolve, reject) {
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
  }
}
