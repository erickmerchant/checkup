#!/usr/bin/env node
const action = require('./index')
const command = require('sergeant')

command('checkup', ({parameter}) => {
  parameter('directory', {
    description: 'optional directories to look at',
    default: { value: ['./*/'] },
    multiple: true
  })

  return action
})(process.argv.slice(2))
