const checkGitStatus = require('./check-git-status')
const checkNpmOutdated = require('./check-npm-outdated')
const checkNpmAudit = require('./check-npm-audit')
const checkNpmTest = require('./check-npm-tst')

module.exports = (directory, args) => {
  return Promise.resolve([])
    .then(checkGitStatus(directory))
    .then(checkNpmOutdated(directory))
    .then(checkNpmAudit(directory))
    .then(checkNpmTest(directory))
}
