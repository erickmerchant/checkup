#!/usr/bin/env node
'use strict'

const command = require('sergeant/command')()
const chalk = require('chalk')

command.describe('')
.action(function (args) {

})

command.run().catch(function (err) {
  console.error(chalk.red(err.message))
})
