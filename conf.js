exports.config = {
  framework: 'mocha',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec.js'],
  mochaOpts: {
    ui: 'bdd',
    reporter: 'spec',
    slow: 5000
  }
}
