#!/usr/bin/env node
'use strict'

const command = require('sergeant/command')()
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const david = require('david')
const simpleGit = require('simple-git')
const thenify = require('thenify')
const readdir = thenify(fs.readdir)
const getUpdatedDependencies = thenify(david.getUpdatedDependencies)

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
          console.log(chalk.bold(chalk.red('\u2718 ') + result.name))

          result.results.forEach(function (result) {
            console.log(chalk.gray('  - ' + result))
          })
        } else {
          console.log(chalk.bold(chalk.green('\u2714 ') + result.name))
        }
      } else {
        console.log(chalk.bold(chalk.gray('\u2718 ') + result.name))
      }
    })
  })
})

command.run().catch(function (err) {
  console.error(chalk.red(err.message))
})

function checkDependencies (manifest, options) {
  options = Object.assign(options, {npm: {progress: false}})

  return function (results) {
    return getUpdatedDependencies(manifest, options).then(function (current) {
      Object.keys(current).forEach(function (name) {
        results.push('upgrade ' + name)
      })

      return Promise.resolve(results)
    })
  }
}

function checkGitStatus (file) {
  const repo = simpleGit(file)

  return function (results) {
    return new Promise(function (resolve, reject) {
      repo.status(function (err, status) {
        if (err) {
          reject(err)
        } else {
          if (status.not_added.length) {
            results.push('not added ' + status.not_added.length)
          }

          if (status.conflicted.length) {
            results.push('conflicted ' + status.conflicted.length)
          }

          if (status.created.length) {
            results.push('created ' + status.created.length)
          }

          if (status.deleted.length) {
            results.push('deleted ' + status.deleted.length)
          }

          if (status.modified.length) {
            results.push('modified ' + status.modified.length)
          }

          if (status.renamed.length) {
            results.push('renamed ' + status.renamed.length)
          }

          if (status.ahead) {
            results.push('ahead ' + status.ahead)
          }

          if (status.behind) {
            results.push('behind ' + status.behind)
          }

          resolve(results)
        }
      })
    })
  }
}
