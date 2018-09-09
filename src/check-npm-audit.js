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

      const result = await execa('npm', ['audit', '--json'], { cwd: directory, reject: false })

      const report = result.stdout ? JSON.parse(result.stdout) : {}

      for (let type of Object.keys(report.metadata.vulnerabilities)) {
        let count = report.metadata.vulnerabilities[type]
        if (count > 0) {
          results.push(count + ' ' + type + ' ' + (count > 1 ? 'vulnerabilities' : 'vulnerability'))
        }
      }

      resolve(results)
    })
  })
}
