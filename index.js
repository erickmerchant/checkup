#!/usr/bin/env node
const action = require('./src/action')
const command = require('sergeant')

command('checkup', () => {
  return action
})(process.argv.slice(2))
