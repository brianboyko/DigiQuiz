'use strict';
import _ from 'lodash';
import chai from 'chai';
import chaiAP from 'chai-as-promised';
chai.use(chaiAP);
const expect = chai.expect;

import knex from '../../../../server/db/config';
import modelUsers from '../../../../server/db/models/Users';
const Users = modelUsers(knex);

const fakeUser = {
  login: "faker",
  password: "somehashedpass",
  email: 'fake@faker.fake',
  first_name: "Fake",
  last_name: "Faker"
};

describe('Model: Users', function() {
  before(function(done) {
    // clear all items from the test DB.
    Users.read.all()
      .then((records) => records.map((r) => r.uid))
      .then((uids) => Promise.all(uids.map((uid) => Users.del.by_uid(uid))))
      .then(() => done());
  });

  it('should start from a clear test database', function(done) {
    expect(Users.count()
      .then((c) => parseInt(c[0].count)))
      .to.eventually.equal(0)
      .notify(done);
  });

  describe('Users.count()', function() {
    it('should count the users', function(done) {
      expect(Users.count()
        .then((c) => !isNaN(c[0].count)))
        .to.eventually.equal(true)
        .notify(done);
    });
  });

  describe('Users.create()', function() {
    it('should create a user', function(done) {
      this.timeout(10000);

      expect(Users.create(fakeUser)
        .then((idObj) => idObj[0]))
        .to.eventually.be.a('Number')
        .notify(done);
    });
    it('should confirm we have one record', function(done) {
      expect(Users.count()
        .then((c) => parseInt(c[0].count)))
        .to.eventually.equal(1)
        .notify(done);
    })
    it('should be the record we just entered', function(done) {
      expect(Users.read.by_login("faker")
        .then((r) => r[0])
        .then((r) => _.pick(r, ["login", "password", "email", "first_name", "last_name"])))
        .to.eventually.eql(fakeUser).notify(done)
    })
  });


});
