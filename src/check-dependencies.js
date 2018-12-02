const fs = require('fs')
const path = require('path')
const globby = require('globby')
const promisify = require('util').promisify
const fsAccess = promisify(fs.access)
const fsReadFile = promisify(fs.readFile)
const detective = require('detective')
const detectiveES6 = require('detective-es6')
const detectivePostcss = require('detective-postcss')
const builtins = require('builtin-modules')

module.exports = async (directory) => {
  const results = []

  try {
    await fsAccess(path.join(directory, 'package.json'), fs.constants.R_OK)
  } catch (err) {
    return results
  }

  const pkg = require(path.join(directory, 'package.json'))

  let pkgDeps = Object.keys(pkg.dependencies || {})

  pkgDeps = pkgDeps.concat(Object.keys(pkg.devDependencies || {}))

  const files = await globby(['./**/*{js,mjs,css}'], { cwd: path.join(directory), gitignore: true })

  let deps = await Promise.all(files.map(async (file) => {
    const code = await fsReadFile(path.join(directory, file), 'utf8')

    switch (path.extname(file)) {
      case '.js':
        return detective(code)

      case '.mjs':
        return detectiveES6(code)

      case '.css':
        return detectivePostcss(code)
    }
  }))

  deps = deps.reduce((acc, deps) => acc.concat(deps), [])

  deps = deps.filter((dep) => !dep.startsWith('.') && !dep.startsWith('/') && !builtins.includes(dep))

  deps = deps.map((dep) => {
    let i = dep.startsWith('@') ? 2 : 1

    return dep.split('/').slice(0, i).join('/')
  })

  for (const dep of deps) {
    if (!pkgDeps.includes(dep)) {
      results.push(dep + ' missing')
    }
  }

  for (const pkgDep of pkgDeps) {
    const pkgDepPkg = require(path.join(directory, 'node_modules', pkgDep, 'package.json'))

    const pkgDepPkgBins = Object.keys(pkgDepPkg.bin || {})

    let found = false

    for (const pkgDepPkgBin of pkgDepPkgBins) {
      for (const script of Object.keys(pkg.scripts || {})) {
        if (pkg.scripts[script].includes(pkgDepPkgBin)) {
          found = true
        }
      }
    }

    if (!found && !deps.includes(pkgDep)) {
      results.push(pkgDep + ' unused')
    }
  }

  return results
}
