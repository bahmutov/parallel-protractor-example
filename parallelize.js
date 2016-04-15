'use strict'

const path = require('path')
const confFilename = path.resolve('./conf.js')
const suiteName = 'one'
console.log('parallelizing, assuming conf file\n%s\nsuite name "%s"',
  confFilename, suiteName, +new Date())

const Module = require('module')
const __resolveFilename = Module._resolveFilename
Module._resolveFilename = function (name, from) {
  if (isMockSpecFilename(name)) {
    console.log('resolving mock spec filename', name)
    return name
  }
  const result = __resolveFilename(name, from)
  return result
}

const __loadModule = Module._load
Module._load = function (filename, parent) {
  if (isMockSpecFilename(filename)) {
    console.log('loading mock spec module', filename)
    const index = findMock(filename)
    console.log('mock spec index', index)
    return eval(mockSpecs[index])
  }
  return __loadModule(filename, parent)
}

// const _require = Module.prototype.require
// Module.prototype.require = function (name, options) {
//   console.log('module require', name)
//   if (name === 'fs') {
//     return _require(name, options)
//   }
//   const nameToLoad = path.resolve(process.cwd(), name)
//   return _require(nameToLoad, options)
// }

const fs = require('fs')
const _readFileSync = fs.readFileSync
const conf = fs.readFileSync(confFilename, 'utf8')
const config = eval(conf)
// console.log(config)
const specFilename = path.resolve(config.suites[suiteName])
console.log('spec "%s" filename from conf', suiteName, specFilename)

const _existsSync = fs.existsSync
fs.existsSync = function (filename) {
  console.log('file exists?', filename)
  return _existsSync(filename)
}
const _readdirSync = fs.readdirSync
fs.readdirSync = function (path) {
  console.log('loading files in', path)
  return _readdirSync(path)
}
const _lstatSync = fs.lstatSync
fs.lstatSync = function (filename) {
  if (isMockSpecFilename(filename)) {
    console.log('lstat on mock spec filename', filename)
    return {
      isSymbolicLink: () => false,
      isDirectory: () => false
    }
  }
  return _lstatSync(filename)
}

const spec = fs.readFileSync(specFilename, 'utf8')
const sep = 'describe('
const specParts = spec.split(sep)
  .map((part, k) => {
    if (k) {
      return sep + part
    }
    return part
  })

function printPart(part, k) {
  console.log('=== part', k)
  console.log(part)
}
// specParts.forEach((part, k) => {
//   console.log('=== part', k)
//   console.log(part)
// })

// assuming
// first part is common (setup)
// each other part is a separate describe block that will become its
// own separate spec "file" (except it will be a mock file without a physical file)
const preamble = specParts[0]
const mockSpecs = specParts.slice(1).map((part) => preamble + part)
console.log('found %d describe blocks in %s', mockSpecs.length, specFilename)
// mockSpecs.forEach(printPart)
function mockFilename (k) {
  return path.resolve(`./mock-spec-${k}.js`)
}
config.suites[suiteName] = mockSpecs.map((part, k) => mockFilename(k))
console.log('mock suite filenames', config.suites[suiteName])

// config.suites[suiteName].forEach((filename, k) => {
//   require.cache[filename] = {
//     id: filename,
//     filename: filename,
//     // exports: eval(mockSpecs[k]),
//     loaded: true
//   }
// })
// console.log(require.cache)

function isMockSpecFilename (filename) {
  return filename.indexOf('mock-spec') !== -1
  // return typeof config !== 'undefined' &&
  //   Array.isArray(config.suites[suiteName]) &&
  //   config.suites[suiteName].indexOf(filename) !== -1
}

function findMock (filename) {
  var foundIndex = -1
  config.suites[suiteName].some((name, k) => {
    if (filename === name) {
      foundIndex = k
      return true
    }
  })
  return foundIndex
}

fs.readFileSync = function (filename) {
  if (filename === confFilename) {
    console.log('loading config file', filename)
    console.log('returning updated config file with mock spec filenames')
    const mockConfigSource = 'exports.config = ' + JSON.stringify(config, null, 2)
    // console.log(mockConfigSource)
    return mockConfigSource
  } else if (filename === specFilename) {
    console.log('loading spec file', specFilename)
  }

  if (isMockSpecFilename(filename)) {
    console.log('loading mock spec file', filename)
  }
  if (filename.indexOf('node_modules') === -1) {
    console.log(filename)
  }

  return _readFileSync.apply(null, arguments)
}
