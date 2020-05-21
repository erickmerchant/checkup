const fs = require('fs')
const path = require('path')
const execa = require('execa')
const promisify = require('util').promisify
const fsAccess = promisify(fs.access)

module.exports = async (directory) => {
  const results = []

  try {
    await fsAccess(path.join(directory, 'package.json'), fs.constants.R_OK)
  } catch {
    return results
  }

  const result = await execa('npm', ['audit', '--json'], {cwd: directory, reject: false})

  const report = result.stdout ? JSON.parse(result.stdout) : {}

  if (report.metadata) {
    for (const [type, count] of Object.entries(report.metadata.vulnerabilities)) {
      if (count > 0) {
        results.push(`${count} ${type} ${count > 1 ? 'vulnerabilities' : 'vulnerability'}`)
      }
    }
  } else {
    results.push('audit not done')
  }

  return results
}
