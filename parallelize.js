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

fs.readFileSync = function (filename) {
  if (filename === confFilename) {
    console.log('loading config file', filename)
  } else if (filename === specFilename) {
    console.log('loading spec file', specFilename)
  }
  return _readFileSync.apply(null, arguments)
}
