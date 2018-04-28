#!/usr/bin/env node
const action = require('./index')
const command = require('sergeant')

command('checkup', function ({parameter}) {
  parameter('directory', {
    description: 'optional directories to look at',
    type: function (val) {
      if (val == null) return './'

      return val
    }
  })

  return action
})(process.argv.slice(2))
