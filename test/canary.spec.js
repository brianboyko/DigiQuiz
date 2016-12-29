'use strict';
// /canary.js
import mocha from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;

import {canaryTest} from '../src/canary'

describe('CanaryTest', () => {
  it('should put the lotion on it\'s skin', () => {
    expect(canaryTest()).to.equal('or else it gets the hose again')
  })
})
