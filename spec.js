var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

describe('Protractor Demo App', function() {
  it('should have a title', function() {
    browser.get('http://juliemr.github.io/protractor-demo/');
    expect(browser.getTitle()).to.eventually.equal('Super Calculator');
  });
});

describe('Protractor Demo App', function() {
  it('should add one and two', function() {
    this.timeout(5000);

    browser.get('http://juliemr.github.io/protractor-demo/');
    element(by.model('first')).sendKeys(1);
    element(by.model('second')).sendKeys(2);

    element(by.id('gobutton')).click();

    expect(element(by.binding('latest')).getText())
      .to.eventually.equal('3');
  });
});
