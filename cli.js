#!/usr/bin/env node
const action = require('./main.js')
const {command, start} = require('sergeant')('checkup')

command({
  description: 'checks projects (npm or git) for various problems',
  signature: ['directory'],
  options: {
    directory: {
      description: 'a directory to check',
      required: true,
      multiple: true,
      parameter: true
    }
  },
  action
})

start(process.argv.slice(2))
