const checkGitStatus = require('./check-git-status')
const checkNpmOutdated = require('./check-npm-outdated')
const checkNpmAudit = require('./check-npm-audit')

module.exports = function (directory, args) {
  return Promise.resolve([])
    .then(checkGitStatus(directory))
    .then(checkNpmOutdated(directory))
    .then(checkNpmAudit(directory))
}
