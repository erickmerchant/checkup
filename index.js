#!/usr/bin/env node
'use strict'

const log = require('./lib/log')
const checkGitStatus = require('./lib/check-git-status')
const checkDependencies = require('./lib/check-dependencies')
const command = require('sergeant/command')()
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const thenify = require('thenify')
const readdir = thenify(fs.readdir)

command.describe('')
.option('unstable', 'use unstable')
.action(function (args) {
  const stable = !args.get('unstable')
  const dir = process.cwd()

  return readdir(dir).then(function (files) {
    return Promise.all(files.filter((file) => !file.startsWith('.')).map(function (file) {
      try {
        const packagePath = path.join(dir, file, 'package.json')
        const manifest = require(packagePath)

        return Promise.resolve([])
        .then(checkDependencies(manifest, {stable}))
        .then(checkDependencies(manifest, {dev: true, stable}))
        .then(checkGitStatus(file))
        .then(function (results) {
          return {name: manifest.name, results}
        })
      } catch (e) {
        return Promise.resolve({name: file})
      }
    }))
  })
  .then(function (results) {
    results.forEach(function (result) {
      if (result.results != null) {
        if (result.results.length) {
          log.log(chalk.bold(chalk.red('\u2718 ') + result.name))

          result.results.forEach(function (result) {
            log.log(chalk.gray('  - ' + result))
          })
        } else {
          log.log(chalk.bold(chalk.green('\u2714 ') + result.name))
        }
      } else {
        log.log(chalk.bold(chalk.gray('\u2718 ') + result.name))
      }
    })
  })
})

command.run().catch(function (err) {
  log.error(chalk.red(err.message))
})
