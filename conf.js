exports.config = {
  framework: 'mocha',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec.js'],
  mochaOpts: {
    ui: 'bdd',
    reporter: 'spec',
    slow: 5000
  },
  capabilities: {
    browserName: 'chrome',
    maxInstances: 5,
    shardTestFiles: true,
  },
  maxSessions: 3
}
