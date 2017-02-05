'use strict';
import chai from 'chai';
import chaiAP from 'chai-as-promised';
chai.use(chaiAP);
const expect = chai.expect;

describe('Test Suite', function(){
  it('should run the test suite', function(){
    expect(true).to.be.true;
  });
});
