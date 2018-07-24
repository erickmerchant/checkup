#!/usr/bin/env node
const action = require('./index')
const command = require('sergeant')

command('checkup', function ({parameter}) {
  parameter('directory', {
    description: 'directories to look at',
    required: true,
    multiple: true,
    type (val) { return val }
  })

  return action
})(process.argv.slice(2))
