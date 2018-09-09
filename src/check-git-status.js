const fs = require('fs')
const path = require('path')
const execa = require('execa')

module.exports = (directory) => (results) => {
  return new Promise((resolve, reject) => {
    fs.access(path.join(directory, '.git'), fs.constants.R_OK, async (err) => {
      if (err) {
        resolve(results)

        return
      }

      const result = await execa('git', ['status', '--porcelain', '-b'], { cwd: directory, reject: false })

      const outdated = result.stdout.split('\n')

      if (!outdated[0].startsWith('## master...origin/master')) {
        results.push('not on master')
      } else if (outdated[0] !== '## master...origin/master') {
        results.push('ahead of master')
      }

      if (outdated.length > 1) {
        results.push('working directory unclean')
      }

      resolve(results)
    })
  })
}
