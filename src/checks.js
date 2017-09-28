const checkGitStatus = require('./check-git-status')
const checkDependencies = require('./check-dependencies')

module.exports = (file, args) => {
  return Promise.resolve([])
    .then(checkDependencies(file))
    .then(checkGitStatus(file))
}
