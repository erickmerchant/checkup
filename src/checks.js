const checkGitStatus = require('./check-git-status')
const checkNpmOutdated = require('./check-npm-outdated')
const checkNpmAudit = require('./check-npm-audit')
const checkNpmTest = require('./check-npm-tst')

module.exports = async (directory) => {
  const results = await Promise.all([
    checkGitStatus(directory),
    checkNpmOutdated(directory),
    checkNpmAudit(directory),
    checkNpmTest(directory)
  ])

  return results.reduce((acc, curr) => acc.concat(curr), [])
}
