const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads')

if (isMainThread) {
  module.exports = (args) => {
    const all = []

    for (const directory of args.directory) {
      all.push(new Promise((resolve, reject) => {
        const worker = new Worker(__filename, {
          workerData: directory
        })
        worker.on('message', resolve)
        worker.on('error', reject)
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`))
          }
        })
      }))
    }

    return Promise.all(all)
  }
} else {
  const checks = require('./lib/checks.js')
  const {console} = require('./lib/globals.js')
  const {red, gray, green} = require('kleur')
  const path = require('path')
  const error = require('sergeant/error')
  const directory = workerData
  const name = path.relative(process.cwd(), directory) || '.'

  ;(async () => {
    try {
      const results = await checks(path.join(process.cwd(), directory))

      if (results.length) {
        console.log(`${red('✘')} ${name}`)

        for (const result of results) {
          console.log(`${gray(`  - ${result}`)}`)
        }
      } else {
        console.log(`${green('✔︎')} ${name}`)
      }
    } catch (err) {
      console.log(`${red('✘')} ${name}`)

      error(err)
    }

    parentPort.postMessage(true)
  })()
}
