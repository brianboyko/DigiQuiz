'use strict';
import _ from 'lodash';
import chai from 'chai';
import chaiAP from 'chai-as-promised';
chai.use(chaiAP);
const expect = chai.expect;

import knex from '../../../../server/db/config';
import modelDecks from '../../../../server/db/models/Decks';
import modelUsers from '../../../../server/db/models/Users';
const Users = modelUsers(knex);
const Decks = modelDecks(knex);

import { generateFakeUsers } from './util';

const generateFakeDecks = (num) => {
  let fakes = [];
  let fakeUsers = generateFakeUsers(num);

  return new Promise((resolve, reject) => {
    Promise.all(fakeUsers.map((fakeU) => Users.create(fakeU)))
      .then((uids) => {
        uids.forEach((uid, i) => {
          fakes.push({
            created_by: uid[0],
            is_public: true,
            title: "t" + i,
            subject: "s" + i,
          });
        });
        resolve(fakes);
      });
  });
};

const clearDB = (done) => {
  Promise.all([
      Decks.read.all()
      .then((records) => records.map((r) => r.id))
      .then((ids) => Promise.all(ids.map((id) => Decks.del.by_id(id)))),
      Users.read.all()
      .then((records) => records.map((r) => r.uid))
      .then((uids) => Promise.all(uids.map((uid) => Users.del.by_uid(uid))))
    ])
    .then(() => done());
};

let store = {};

describe('Model: Decks', function() {
  before(function(done) {
    // clear all questions and users from the test DB.
    clearDB(done);
  });

  it('should start from a clear test database', function(done) {
    expect(Decks.count()
      .then((c) => parseInt(c[0].count)))
      .to.eventually.equal(0)
      .notify(done);
  });

  describe('Decks.count()', function() {
    it('should count the questions', function(done) {
      expect(Decks.count()
          .then((c) => !isNaN(c[0].count)))
        .to.eventually.equal(true)
        .notify(done);
    });
  });

  describe('Decks.create()', function() {
    let singleDeck;
    it('should create a Deck', function(done) {
      this.timeout(10000);
      expect(generateFakeDecks(1)
        .then((decks) => {
          singleDeck = decks[0];
          return Decks.create(decks[0]);
        })
        .then((id) => id[0]))
        .to.eventually.be.a('Number')
        .notify(done);
    });
    it('should confirm we have one record', function(done) {
      expect(Decks.count()
          .then((c) => parseInt(c[0].count)))
        .to.eventually.equal(1)
        .notify(done);
    });
    it('should be the record we just entered', function(done) {
      expect(Decks.read.by_created_by(singleDeck.created_by)
          .then((r) => r[0])
          .then((r) => _.pick(r, 'created_by', 'is_public', 'title', 'subject')))
        .to.eventually.eql(singleDeck)
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });

  });

  describe('Decks.read', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeDecks(5)
          .then((fakeDs) => {
            fakes = fakeDs;
            return Promise.all(fakes.map((fake) => Decks.create(fake)));
          })
          .then(() => done());
      });
    });
    it('reads with a manually inserted by', function(done) {
      expect(Decks.read('title')(fakes[0].title)
          .then((r) => _.pick(r[0], ['created_by', 'is_public', 'title', 'subject'])))
        .to.eventually.eql(fakes[0])
        .notify(done);
    });
    it('reads .by_created_by', function(done) {
      expect(Promise.all(fakes.map((fake) => Decks.read.by_created_by(fake.created_by)))
          .then((recs) => recs.map((rec) => rec[0]))
          .then((recs) => recs.map((r) =>
            _.pick(r, ['created_by', 'is_public', 'title', 'subject']))))
        .to.eventually.eql(fakes)
        .notify(done);
    });
    it('reads .all', function(done) {
      expect(Decks.read.all())
        .to.eventually.be.an('Array')
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });
  });

  describe('Decks.update', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeDecks(5)
          .then((fakeDs) => {
            fakes = fakeDs;
            return Promise.all(fakes.map((fake) => Decks.create(fake)));
          })
          .then(() => done());
      });
    });
    it('updates by arbitrary convention', function(done) {
      expect(Decks.update('title')("t0", {
            "subject": "cornflakes"
          })
          .then(() => Decks.read('title')('t0'))
          .then((records) => records[0])
          .then((record) => record.subject))
        .to.eventually.equal("cornflakes")
        .notify(done);
    });
    it('updates .by_id', function(done) {
      let thisID;
      expect(Decks.read('subject')('s1')
          .then((records) => records[0].id)
          .then((id) => {
            thisID = id;
            return Decks.update.by_id(id, {
              title: "marshmallows"
            });
          })
          .then(() => Decks.read.by_id(thisID))
          .then((records) => records[0])
          .then((record) => record.title))
        .to.eventually.equal("marshmallows")
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });
  });

  describe('Decks.del', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeDecks(5)
          .then((fakeDs) => {
            fakes = fakeDs;
            return Promise.all(fakes.map((fake) => Decks.create(fake)));
          })
          .then(() => done());
      });
    });
    it('deletes by arbitrary convention', function(done) {
      let before;
      expect(Decks.count()
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => {
            before = numCount;
            return Decks.del('title')(fakes[3].title);
          })
          .then(() => Decks.count())
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => before - numCount))
        .to.eventually.equal(1)
        .notify(done);
    });
    it('deletes .by_id', function(done) {
      let before;
      expect(Decks.count()
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => {
            before = numCount;
            return Decks.read.all();
          })
          .then((records) => records[0].id)
          .then((id) => Decks.del.by_id(id))
          .then(() => Decks.count())
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => before - numCount))
        .to.eventually.equal(1)
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });
  });
});
