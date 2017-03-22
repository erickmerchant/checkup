#!/usr/bin/env node
const action = require('./lib/action')
const command = require('sergeant')

command('checkup', function ({option}) {
  option('unstable', {
    description: 'use unstable',
    type: Boolean
  })

  return action
})(process.argv.slice(2))
