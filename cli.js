#!/usr/bin/env node
const action = require('./main.js')
const {command, start} = require('sergeant')('checkup')

command(({parameter, description}) => {
  description('checks projects (npm or git) for various problems')

  parameter({
    name: 'directory',
    description: 'a directory to check',
    required: true,
    multiple: true,
    type(val) { return val }
  })

  return action
})

start(process.argv.slice(2))
