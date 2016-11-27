const checkGitStatus = require('./check-git-status')
const checkDependencies = require('./check-dependencies')

module.exports = function (file, args) {
  const stable = !args.get('unstable')

  return Promise.resolve([])
    .then(checkDependencies(file, {stable}))
    .then(checkDependencies(file, {dev: true, stable}))
    .then(checkGitStatus(file))
}
