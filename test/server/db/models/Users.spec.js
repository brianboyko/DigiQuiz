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

const generateFake = (num) => {
  let fakes = [];
  for(let i = 0; i < num; i++){
    fakes.push({
      login: "L" + Math.random().toString(),
      password: "P" + Math.random().toString(),
      email: "E" + Math.random().toString(),
      first_name: "F" + Math.random().toString(),
      last_name: "N" + Math.random().toString(),
    });
  }
  return fakes;
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
    });
    it('should be the record we just entered', function(done) {
      expect(Users.read.by_login("faker")
        .then((r) => r[0])
        .then((r) => _.pick(r, ["login", "password", "email", "first_name", "last_name"])))
        .to.eventually.eql(fakeUser).notify(done);
    });

  });

  describe('Users.read', function(){
    let fakes;
    before(function(done){
      fakes = generateFake(5);
      Promise.all(fakes.map((fake) => Users.create(fake))).then(() => done());
    });
    it('reads with a manually inserted by', function(done){
      expect(Users.read('login')(fakes[0].login)
        .then((r) => _.pick(r[0], ["login", "password", "email", "first_name", "last_name"])))
        .to.eventually.eql(fakes[0]).notify(done);
    });
    it('reads .by_login', function(done) {
      expect(Promise.all(fakes.map((fake) => Users.read.by_login(fake.login)))
        .then((recs) => recs.map((rec) => rec[0]))
        .then((recs) => recs.map((r) => _.pick(r, ["login", "password", "email", "first_name", "last_name"]))))
        .to.eventually.eql(fakes).notify(done);
    });
  });



});
