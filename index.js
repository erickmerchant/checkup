#!/usr/bin/env node
'use strict'

const command = require('sergeant/command')()
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const david = require('david')
const thenify = require('thenify')
const readdir = thenify(fs.readdir)
const getUpdatedDependencies = thenify(david.getUpdatedDependencies)

command.describe('')
.option('unstable', 'use unstable')
.action(function (args) {
  const stable = !args.get('unstable')
  const dir = process.cwd()

  return readdir(dir).then(function (files) {
    return Promise.all(files.map(function (file) {
      const packagePath = path.join(dir, file, 'package.json')

      return new Promise(function (resolve, reject) {
        fs.exists(packagePath, function (exists) {
          if (exists) {
            const manifest = require(packagePath)
            const name = manifest.name

            let promise = Promise.resolve([])

            ;[{stable, npm: {progress: false}}, {dev: true, stable, npm: {progress: false}}].forEach(function (options) {
              promise = promise.then(function (results) {
                return getUpdatedDependencies(manifest, options).then(function (current) {
                  Object.keys(current).forEach(function (name) {
                    results.push(name)
                  })

                  return Promise.resolve(results)
                })
              })
            })

            promise.then(function (results) {
              resolve({name, results})
            })
            .catch(reject)
          } else {
            resolve(null)
          }
        })
      })
    }))
  })
  .then(function (results) {
    results.filter((v) => !!v).forEach(function (result) {
      if (result.results.length) {
        console.log(chalk.bold(chalk.red('\u2718 ') + result.name))

        result.results.forEach(function (dep) {
          console.log('  - ' + chalk.gray(dep))
        })
      } else {
        console.log(chalk.bold(chalk.green('\u2714 ') + result.name))
      }
    })
  })
})

command.run().catch(function (err) {
  console.error(chalk.red(err.message))
})
