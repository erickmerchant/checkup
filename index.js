#!/usr/bin/env node
const action = require('./src/action')
const command = require('sergeant')

command('checkup', ({option}) => {
  option('unstable', {
    description: 'use unstable',
    type: Boolean
  })

  return action
})(process.argv.slice(2))
