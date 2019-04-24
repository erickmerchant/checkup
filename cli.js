#!/usr/bin/env node
const action = require('./main.js')
const {command, start} = require('sergeant')('checkup')

command(({parameter}) => {
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
