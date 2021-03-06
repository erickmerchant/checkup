const fs = require('fs')
const path = require('path')
const semver = require('semver')
const execa = require('execa')
const promisify = require('util').promisify
const fsAccess = promisify(fs.access)

module.exports = async (directory) => {
  const results = []

  try {
    await fsAccess(path.join(directory, 'package-lock.json'), fs.constants.R_OK)
  } catch {
    return results
  }

  const locked = require(path.join(directory, 'package-lock.json'))

  const result = await execa('npm', ['outdated', '--json'], {cwd: directory, reject: false})

  const outdated = result.stdout ? JSON.parse(result.stdout) : {}

  for (const [dependency, old] of Object.entries(outdated)) {
    const latest = old.latest
    const current = locked.dependencies[dependency].version

    let next = old.wanted

    try {
      if (latest != null && semver.prerelease(latest) == null) {
        next = latest
      }

      if (next != null && next !== current) {
        if (semver.diff(next, current) === 'major' || semver.major(current) < 1) {
          results.push(`upgrade ${dependency}`)
        } else if (!semver.lt(next, current)) {
          results.push(`update ${dependency}`)
        }
      }
    } catch {
      results.push(`linked ${dependency}`)
    }
  }

  return results
}
