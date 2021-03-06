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

  const result = await execa('npm', ['test'], {cwd: directory, reject: false})

  if (result?.exitCode ?? 0) {
    results.push('tests failing')
  }

  return results
}
