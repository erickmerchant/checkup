#!/usr/bin/env node
const action = require('./index')
const command = require('sergeant')
const promisify = require('util').promisify
const glob = promisify(require('glob'))

command('checkup', function ({parameter}) {
  parameter('directory', {
    description: 'directories to look at',
    required: true,
    multiple: true,
    type: function directory (val) {
      if (val == null) {
        return glob('./*/')
      }

      return val
    }
  })

  return action
})(process.argv.slice(2))
