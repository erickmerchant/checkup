const fs = require('fs')
const path = require('path')
const globby = require('globby')
const promisify = require('util').promisify
const fsAccess = promisify(fs.access)
const fsReadFile = promisify(fs.readFile)
const parse5 = require('parse5')
const builtins = require('builtin-modules')
const regex = /(require\(|import\(|import.*?from\s*|@import\s*|@import\s*url\()(['"])(.*?)\2/g

const detective = (code) => {
  let r
  const results = []

  while ((r = regex.exec(code)) != null) {
    results.push(r[3])
  }

  return results
}

const detectiveHTML = (code) => {
  const traverse = (nodes) => {
    const results = []

    for (const node of nodes) {
      if (node.tagName === 'link') {
        const rel = node.attrs.find((attr) => attr.name === 'rel')

        if (rel != null && rel.value === 'stylesheet') {
          const href = node.attrs.find((attr) => attr.name === 'href')

          if (href != null) results.push(href.value)
        }
      }

      if (node.tagName === 'style' && node.childNodes != null && node.childNodes[0] != null) {
        results.push(...detective(node.childNodes[0].value))
      }

      if (node.tagName === 'script') {
        const src = node.attrs.find((attr) => attr.name === 'src')
        const type = node.attrs.find((attr) => attr.name === 'type')

        if (type != null && type.value === 'module') {
          if (src != null) {
            results.push(src.value)
          } else if (node.childNodes != null && node.childNodes[0] != null) {
            results.push(...detective(node.childNodes[0].value))
          }
        }
      }

      results.push(...traverse(node.childNodes || []))
    }

    return results
  }

  const ast = parse5.parse(code)

  return traverse(ast.childNodes || [])
}

module.exports = async (directory) => {
  const results = []

  try {
    await fsAccess(path.join(directory, 'package.json'), fs.constants.R_OK)
  } catch (err) {
    return results
  }

  const pkg = require(path.join(directory, 'package.json'))

  const pkgDeps = Object.keys(pkg.dependencies || {})

  pkgDeps.push(...Object.keys(pkg.devDependencies || {}))

  const files = await globby(['./**/*{js,mjs,css,html}'], {cwd: path.join(directory), gitignore: true})

  let deps = await Promise.all(files.map(async (file) => {
    const code = await fsReadFile(path.join(directory, file), 'utf8')

    switch (path.extname(file)) {
      case '.js':
      case '.mjs':
      case '.css':
        return detective(code)

      case '.html':
        return detectiveHTML(code)
    }
  }))

  deps = deps.reduce((acc, deps) => {
    if (deps) acc.push(...deps)

    return acc
  }, [])

  deps = deps.filter((dep) => !dep.startsWith('http://') && !dep.startsWith('https://') && !dep.startsWith('.') && !dep.startsWith('/') && !builtins.includes(dep))

  deps = deps.map((dep) => {
    let indexOf = dep.indexOf('/')

    if (dep.startsWith('@')) {
      indexOf = dep.indexOf('/', indexOf + 1)
    }

    if (indexOf === -1) {
      return dep
    }

    return dep.substring(0, indexOf)
  })

  deps = deps.filter((dep, i, deps) => deps.indexOf(dep) === i)

  for (const dep of deps) {
    if (!pkgDeps.includes(dep)) {
      results.push(`${dep} missing`)
    }
  }

  for (const pkgDep of pkgDeps) {
    let found = deps.includes(pkgDep)

    if (!found) {
      for (const script of Object.keys(pkg.scripts || {})) {
        if (pkg.scripts[script].includes(pkgDep)) {
          found = true

          break
        }
      }
    }

    if (!found) {
      const pkgDepPkg = require(path.join(directory, 'node_modules', pkgDep, 'package.json'))

      const pkgDepPkgBins = []

      if (pkgDepPkg.bin != null) {
        if (typeof pkgDepPkg.bin === 'string') {
          pkgDepPkgBins.push(pkgDep)
        } else {
          pkgDepPkgBins.push(...Object.keys(pkgDepPkg.bin))
        }
      }

      for (const pkgDepPkgBin of pkgDepPkgBins) {
        for (const script of Object.keys(pkg.scripts || {})) {
          if (pkg.scripts[script].includes(pkgDepPkgBin)) {
            found = true

            break
          }
        }
      }
    }

    if (!found) {
      for (const subPkgDep of pkgDeps) {
        const pkgDepPkg = require(path.join(directory, 'node_modules', subPkgDep, 'package.json'))

        if (pkgDepPkg.peerDependencies != null) {
          if (Object.keys(pkgDepPkg.peerDependencies).includes(pkgDep)) {
            found = true

            break
          }
        }
      }
    }

    if (!found) {
      results.push(`${pkgDep} unused`)
    }
  }

  return results
}
