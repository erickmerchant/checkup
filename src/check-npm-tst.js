const fs = require('fs')
const path = require('path')
const execa = require('execa')
const promisify = require('util').promisify
const fsAccess = promisify(fs.access)

module.exports = async (directory) => {
  const results = []

  try {
    await fsAccess(path.join(directory, 'package-lock.json'), fs.constants.R_OK)
  } catch (err) {
    return results
  }

  const result = await execa('npm', ['test'], {cwd: directory, reject: false})

  if (result != null && result.code > 0) {
    results.push('tests failing')
  }

  return results
}
