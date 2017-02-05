'use strict';
import chai from 'chai';
import chaiAP from 'chai-as-promised';
chai.use(chaiAP);
const expect = chai.expect;

import knex from '../../../../server/db/config';
console.log("knex", knex);
import modelUsers from '../../../../server/db/models/Users';
const Users = modelUsers(knex);
console.log(Users);
console.log(Users.getInfo());

describe('Model: Users', function(){
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
      Users.create(fakeUser).then((idObj) => {
        console.log("We created a user!\n", idObj);
        expect(idObj[0]).to.be.an.integer
        done();
      });
    });
  });
});
