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
const npm = {progress: false}

command.describe('')
.option('unstable', 'use unstable')
.action(function (args) {
  const stable = !args.get('unstable')
  const dir = process.cwd()
  const results = {}

  return readdir(dir).then(function (files) {
    return Promise.all(files.map(function (file) {
      const packagePath = path.join(dir, file, 'package.json')

      return new Promise(function (resolve, reject) {
        fs.exists(packagePath, function (exists) {
          if (exists) {
            const manifest = require(packagePath)
            const name = manifest.name || 'unnamed'

            results[name] = {}

            Promise.all(
              [{stable, npm}, {dev: true, stable, npm}].map(function (options) {
                return getUpdatedDependencies(manifest, options)
                .then(function (res) {
                  Object.assign(results[name], res)
                })
              })
            )
            .then(resolve, reject)
          } else {
            resolve()
          }
        })
      })
    }))
  })
  .then(function () {
    Object.keys(results).forEach(function (name) {
      if (Object.keys(results[name]).length) {
        console.log(chalk.bold(name))

        console.log(results[name])
      }
    })
  })
})

command.run().catch(function (err) {
  console.error(chalk.red(err.message))
})
