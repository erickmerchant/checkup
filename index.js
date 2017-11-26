#!/usr/bin/env node
const action = require('./src/action')
const command = require('sergeant')

command('checkup', ({parameter}) => {
  parameter('directory', {
    description: 'optional directories to look at',
    default: ['./*/'],
    multiple: true
  })

  return action
})(process.argv.slice(2))
