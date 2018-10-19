const fs = require('fs')
const path = require('path')
const execa = require('execa')
const promisify = require('util').promisify
const fsAccess = promisify(fs.access)

module.exports = (directory) => async (results) => {
  try {
    await fsAccess(path.join(directory, 'package-lock.json'), fs.constants.R_OK)
  } catch (err) {
    return results
  }

  const result = await execa('npm', ['audit', '--json'], { cwd: directory })

  const report = result.stdout ? JSON.parse(result.stdout) : {}

  for (const type of Object.keys(report.metadata.vulnerabilities)) {
    const count = report.metadata.vulnerabilities[type]
    if (count > 0) {
      results.push(count + ' ' + type + ' ' + (count > 1 ? 'vulnerabilities' : 'vulnerability'))
    }
  }

  return results
}
