'use strict'

const path = require('path')
const confFilename = path.resolve('./conf.js')
const suiteName = 'one'
console.log('parallelizing, assuming conf file\n%s\nsuite name "%s"',
  confFilename, suiteName)

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

function isMockSpecFilename (filename) {
  return Array.isArray(config.suites[suiteName]) &&
    config.suites[suiteName].indexOf(filename) !== -1
}

fs.readFileSync = function (filename) {
  if (filename === confFilename) {
    console.log('loading config file', filename)
    console.log('returning updated config file with mock spec filenames')
    const mockConfigSource = 'exports.config = ' + JSON.stringify(config, null, 2)
    console.log(mockConfigSource)
    return mockConfigSource
  } else if (filename === specFilename) {
    console.log('loading spec file', specFilename)
  }

  if (isMockSpecFilename(filename)) {
    console.log('loading mock spec file', filename)
  }

  return _readFileSync.apply(null, arguments)
}
