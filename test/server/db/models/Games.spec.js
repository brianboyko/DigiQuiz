'use strict';
import _ from 'lodash';
import chai from 'chai';
import chaiAP from 'chai-as-promised';
chai.use(chaiAP);
const expect = chai.expect;

import knex from '../../../../server/db/config';
import modelGames from '../../../../server/db/models/Games';
import modelDecks from '../../../../server/db/models/Decks';
import modelUsers from '../../../../server/db/models/Users';
const Games = modelGames(knex);
const Decks = modelDecks(knex);
const Users = modelUsers(knex);

import {
  generateFakeUsers
}
from './util';

const generateFakeGames = (num) => {
  let fakes = [];
  let fakeUsers = generateFakeUsers(num);
  let userUids = [];
  return new Promise((resolve, reject) => {
    Promise.all(fakeUsers.map((fakeU) => Users.create(fakeU)))
      .then((uids) => {
        userUids = uids;
        return Promise.all(uids.map((uid, i) => Decks.create({
            created_by: uid[0],
            is_public: true,
            title: "t" + i,
            subject: "s" + i,
          })));
      })
      .then((deckIds) => {

        deckIds.forEach((deckId, i) => {
          fakes.push({
            roomcode: "rc" + i,
            deck: deckId[0],
            created_by: userUids[i][0],
          });
        });
        resolve(fakes);
      });
  });
};

const clearDB = (done) => {
  Promise.all([
      Games.read.all()
      .then((records) => records.map((r) => r.id))
      .then((ids) => Promise.all(ids.map((id) => Games.del.by_id(id)))),
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
    expect(Games.count()
        .then((c) => parseInt(c[0].count)))
      .to.eventually.equal(0)
      .notify(done);
  });

  describe('Games.count()', function() {
    it('should count the games', function(done) {
      expect(Games.count()
          .then((c) => !isNaN(c[0].count)))
        .to.eventually.equal(true)
        .notify(done);
    });
  });

  describe('Games.create()', function() {
    let singleGame;
    it('should create a Game', function(done) {
      this.timeout(10000);
      expect(generateFakeGames(1)
          .then((games) => {
            singleGame = games[0];
            return Games.create(games[0]);
          })
          .then((id) => id[0]))
        .to.eventually.be.a('Number')
        .notify(done);
    });
    it('should confirm we have one record', function(done) {
      expect(Games.count()
          .then((c) => parseInt(c[0].count)))
        .to.eventually.equal(1)
        .notify(done);
    });
    it('should be the record we just entered', function(done) {
      expect(Games.read.by_created_by(singleGame.created_by)
          .then((r) => r[0])
          .then((r) => _.pick(r, 'roomcode', 'deck', 'created_by')))
        .to.eventually.eql(singleGame)
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });

  });

  describe('Games.read', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeGames(5)
          .then((fakeGs) => {
            fakes = fakeGs;
            return Promise.all(fakes.map((fake) => Games.create(fake)));
          })
          .then(() => done());
      });
    });
    it('reads with a manually inserted by', function(done) {
      expect(Games.read('roomcode')(fakes[0].roomcode)
          .then((r) => _.pick(r[0], ['created_by', 'deck', 'roomcode'])))
        .to.eventually.eql(fakes[0])
        .notify(done);
    });
    it('reads .by_created_by', function(done) {
      expect(Promise.all(fakes.map((fake) => Games.read.by_created_by(fake.created_by)))
          .then((recs) => recs.map((rec) => rec[0]))
          .then((recs) => recs.map((r) =>
            _.pick(r, ['created_by', 'deck', 'roomcode']))))
        .to.eventually.eql(fakes)
        .notify(done);
    });
    it('reads .all', function(done) {
      expect(Games.read.all())
        .to.eventually.be.an('Array')
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });
  });

  describe('Games.update', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeGames(5)
          .then((fakeGs) => {
            fakes = fakeGs;
            return Promise.all(fakes.map((fake) => Games.create(fake)));
          })
          .then(() => done());
      });
    });
    it('updates by arbitrary convention', function(done) {
      let g;
      expect(Games.read.by_roomcode('rc0')
        .then((results) => {
          g = results[0];
          return Games.update('roomcode')("rc0", {
            "roomcode": "cornflakes"
          });
        })
        .then(() => Games.read('roomcode')('cornflakes'))
        .then((records) => records[0])
        .then((record) => (record.deck === g.deck && record.created_by === record.created_by)))
        .to.eventually.equal(true)
        .notify(done);
    });
    it('updates .by_id', function(done) {
      let thisID;
      expect(Games.read('roomcode')('rc2')
          .then((records) => records[0].id)
          .then((id) => {
            thisID = id;
            return Games.update.by_id(id, {
              roomcode: "marshmallows"
            });
          })
          .then(() => Games.read.by_id(thisID))
          .then((records) => records[0])
          .then((record) => record.roomcode))
        .to.eventually.equal("marshmallows")
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });
  });

  describe('Games.del', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeGames(5)
          .then((fakeGs) => {
            fakes = fakeGs;
            return Promise.all(fakes.map((fake) => Games.create(fake)));
          })
          .then(() => done());
      });
    });
    it('deletes by arbitrary convention', function(done) {
      let before;
      expect(Games.count()
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => {
            before = numCount;
            return Games.del('roomcode')(fakes[3].roomcode);
          })
          .then(() => Games.count())
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => before - numCount))
        .to.eventually.equal(1)
        .notify(done);
    });
    it('deletes .by_id', function(done) {
      let before;
      expect(Games.count()
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => {
            before = numCount;
            return Games.read.all();
          })
          .then((records) => records[0].id)
          .then((id) => Games.del.by_id(id))
          .then(() => Games.count())
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
