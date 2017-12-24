const checkGitStatus = require('./check-git-status')
const checkDependencies = require('./check-dependencies')

module.exports = function (directory, args) {
  return Promise.resolve([])
    .then(checkDependencies(directory))
    .then(checkGitStatus(directory))
}
