#!/usr/bin/env node
'use strict'

const log = require('./lib/log')
const action = require('./lib/action')
const command = require('sergeant/command')()
const chalk = require('chalk')

command.describe('')
.option('unstable', 'use unstable')
.action(action)

command.run().catch(function (err) {
  log.error(chalk.red(err.message))
})
