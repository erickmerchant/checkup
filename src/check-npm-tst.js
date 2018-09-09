const fs = require('fs')
const path = require('path')
const execa = require('execa')

module.exports = (directory) => (results) => {
  return new Promise((resolve, reject) => {
    fs.access(path.join(directory, 'package-lock.json'), fs.constants.R_OK, async (err) => {
      if (err) {
        resolve(results)

        return
      }

      const result = await execa('npm', ['test'], { cwd: directory, reject: false })

      if (result != null && result instanceof Error) {
        results.push('tests failing')
      }

      resolve(results)
    })
  })
}
