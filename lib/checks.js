const checkGitStatus = require('./check-git-status.js')
const checkNpmOutdated = require('./check-npm-outdated.js')
const checkNpmAudit = require('./check-npm-audit.js')
const checkNpmTest = require('./check-npm-tst.js')

module.exports = async (directory) => {
  const results = await Promise.all([
    checkGitStatus(directory),
    checkNpmOutdated(directory),
    checkNpmAudit(directory),
    checkNpmTest(directory)
  ])

  return results.reduce((acc, curr) => {
    acc.push(...curr)

    return acc
  }, [])
}
