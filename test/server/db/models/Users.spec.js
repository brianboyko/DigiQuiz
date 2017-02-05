'use strict';
import chai from 'chai';
import chaiAP from 'chai-as-promised';
chai.use(chaiAP);
const expect = chai.expect;

import knex from '../../../../server/db/config';
import modelUsers from '../../../../server/db/models/Users';
const Users = modelUsers(knex);

describe('Model: Users', function(){

  describe('Users.count()', function(){
    it('should count the users', function(done) {
      expect(Users.count().then((c) => !isNaN(c[0].count))).to.eventually.equal(true).notify(done);
    });
  });
  
  describe('Users.create()', function(){
    it('should create a user', function(done) {
      this.timeout(10000);
      const fakeUser = {
        login: "faker",
        password: "somehashedpass",
        email: 'fake@faker.fake',
        first_name: "Fake",
        last_name: "Faker"
      };
    expect(Users.create(fakeUser).then((idObj) => idObj[0])).to.eventually.be.a('Number').notify(done);
    });
  });
});
