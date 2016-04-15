exports.config = {
  framework: 'mocha',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  // specs: ['spec.js'],
  suites: {
    one: 'spec.js', // all tests in single file
    spread: ['spec-1.js', 'spec-2.js'] // individual tests in separate files
  },
  suite: 'one', // default suite to run
  mochaOpts: {
    ui: 'bdd',
    reporter: 'spec',
    slow: 5000
  },
  capabilities: {
    browserName: 'chrome',
    shardTestFiles: true,
    maxInstances: 2
  }
}
