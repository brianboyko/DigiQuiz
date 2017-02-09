'use strict';
import _ from 'lodash';
import chai from 'chai';
import chaiAP from 'chai-as-promised';
chai.use(chaiAP);
const expect = chai.expect;

import knex from '../../../../server/db/config';
import modelResponses from '../../../../server/db/models/Responses';
import modelQuestions from '../../../../server/db/models/Questions';
import modelDecks from '../../../../server/db/models/Decks';
import modelGames from '../../../../server/db/models/Games';
import modelUsers from '../../../../server/db/models/Users';
const Games = modelGames(knex);
const Users = modelUsers(knex);
const Decks = modelDecks(knex);
const Questions = modelQuestions(knex);
const Responses = modelResponses(knex);

import {
  generateFakeUsers
}
from './util';

const randoLetter = (num) => {
  switch (num) {
    case 0:
      return "A";
    case 1:
      return "B";
    case 2:
      return "C";
    case 3:
      return "D";
    default:
      return "F";
  }
};

const generateFakeResponses = (num) => {
  let fakes = [];
  let fakeUsers = generateFakeUsers(num);
  let store = [];
  return new Promise((resolve, reject) => {
    Promise.all(fakeUsers.map((fakeU) => Users.create(fakeU)))
      .then((uids) => {
        store = uids.map((uid) => ({
          uid: uid[0]
        }));
        return Promise.all(store.map((el, i) => Questions.create({
          created_by: el.uid,
          is_public: (Math.floor(Math.random() * 2)) % 2 === 0 ? true : false,
          type: (Math.floor(Math.random() * 2)) % 2 === 0 ? "multiple choice" : "fill in the blank",
          category: "q" + i,
          prompt: "P" + Math.random()
            .toString(),
          choices: JSON.stringify({
            A: "A" + Math.random()
              .toString(),
            B: "B" + Math.random()
              .toString(),
            C: "C" + Math.random()
              .toString()
          }),
          answer: randoLetter(Math.floor(Math.random() * 4)),
          point_value: Math.ceil(Math.random() * 5) * 100,
        })));
      })
      .then((questionIds) => {
        store = questionIds.map((questionId, i) => (Object.assign(store[i], {
          questionId: questionId[0]
        })));
        return Promise.all(store.map((el, i) => Decks.create({
          created_by: el.uid,
          is_public: true,
          title: "t" + i,
          subject: "s" + i,
        })));
      })
      .then((deckIds) => {
        store = deckIds.map((deckId, i) => (Object.assign(store[i], {
          deckId: deckId[0]
        })));
        return Promise.all(store.map((el, i) => Games.create({
          created_by: el.uid,
          deck: el.deckId,
          roomcode: "rc" + i,
        })));
      })
      .then((gameIds) => {
        store = gameIds.map((gameId, i) => Object.assign(store[i], {
          game: gameId[0]
        }));
        store.forEach((el, i) => {
          fakes.push({
            game: el.game,
            question: el.questionId,
            player: el.uid,
            answer_provided: 'ap' + i,
            is_correct: Math.floor(Math.random() * 2) % 2 === 0 ? true : false,
            points_awarded: Math.ceil(Math.random() * 5) * 100,
            response_time_ms: Math.floor(Math.random() * 2000),
          });
          resolve(fakes);
        });
      });
  });
};

const clearDB = (done) => {
  Promise.all([
      Responses.read.all()
      .then((records) => records.map((r) => r.id))
      .then((ids) => Promise.all(ids.map((id) => Responses.del.by_id(id)))),
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

describe('Model: Responses', function() {
  before(function(done) {
    // clear all questions and users from the test DB.
    clearDB(done);
  });

  it('should start from a clear test database', function(done) {
    expect(Responses.count()
        .then((c) => parseInt(c[0].count)))
      .to.eventually.equal(0)
      .notify(done);
  });

  describe('Responses.count()', function() {
    it('should count the responses', function(done) {
      expect(Responses.count()
          .then((c) => !isNaN(c[0].count)))
        .to.eventually.equal(true)
        .notify(done);
    });
  });

  describe('Responses.create()', function() {
    let singleResponse;
    it('should create a Game', function(done) {
      this.timeout(10000);
      expect(generateFakeResponses(1)
          .then((responses) => {
            singleResponse = responses[0];
            return Responses.create(responses[0]);
          })
          .then((id) => id[0]))
        .to.eventually.be.a('Number')
        .notify(done);
    });
    it('should confirm we have one record', function(done) {
      expect(Responses.count()
          .then((c) => parseInt(c[0].count)))
        .to.eventually.equal(1)
        .notify(done);
    });
    it('should be the record we just entered', function(done) {
      expect(Responses.read('response_time_ms')(singleResponse.response_time_ms)
          .then((r) => r[0])
          .then((r) => _.pick(r, 'game', 'question', 'player', 'answer_provided', 'is_correct', 'points_awarded', 'response_time_ms')))
        .to.eventually.eql(singleResponse)
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });

  });

  describe('Responses.read', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeResponses(5)
          .then((fakeRs) => {
            fakes = fakeRs;
            return Promise.all(fakes.map((fake) => Responses.create(fake)));
          })
          .then(() => done());
      });
    });
    it('reads with a manually inserted by', function(done) {
      expect(Responses.read('player')(fakes[0].player)
          .then((r) => _.pick(r[0], ['game', 'question', 'player', 'answer_provided', 'is_correct', 'points_awarded', 'response_time_ms'])))
        .to.eventually.eql(fakes[0])
        .notify(done);
    });
    it('reads .by_player', function(done) {
      expect(Promise.all(fakes.map((fake) => Responses.read.by_player(fake.player)))
          .then((recs) => recs.map((rec) => rec[0]))
          .then((recs) => recs.map((r) =>
            _.pick(r,  ['game', 'question', 'player', 'answer_provided', 'is_correct', 'points_awarded', 'response_time_ms']))))
        .to.eventually.eql(fakes)
        .notify(done);
    });
    it('reads .all', function(done) {
      expect(Responses.read.all())
        .to.eventually.be.an('Array')
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });
  });

  describe('Responses.update', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeResponses(5)
          .then((fakeRs) => {
            fakes = fakeRs;
            return Promise.all(fakes.map((fake) => Responses.create(fake)));
          })
          .then(() => done());
      });
    });
    it('updates by arbitrary convention', function(done) {
      let r;
      expect(Responses.read('answer_provided')('ap3')
          .then((results) => {
            r = results[0];
            return Responses.update('answer_provided')("ap3", {
              "answer_provided": "cornflakes"
            });
          })
          .then(() => Responses.read('answer_provided')('cornflakes'))
          .then((records) => records[0])
          .then((record) => (record.game === r.game && record.response_time_ms === r.response_time_ms && record.answer_provided === "cornflakes")))
        .to.eventually.equal(true)
        .notify(done);
    });
    it('updates .by_id', function(done) {
      let thisID;
      expect(Responses.read('answer_provided')('ap1')
          .then((records) => records[0].id)
          .then((id) => {
            thisID = id;
            return Responses.update.by_id(id, {
              response_time_ms: 4444
            });
          })
          .then(() => Responses.read.by_id(thisID))
          .then((records) => records[0])
          .then((record) => record.response_time_ms))
        .to.eventually.equal(4444)
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });
  });

  describe('Responses.del', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeResponses(5)
          .then((fakeGs) => {
            fakes = fakeGs;
            return Promise.all(fakes.map((fake) => Responses.create(fake)));
          })
          .then(() => done());
      });
    });
    it('deletes by arbitrary convention', function(done) {
      let before;
      expect(Responses.count()
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => {
            before = numCount;
            return Responses.del('question')(fakes[3].question);
          })
          .then(() => Responses.count())
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => before - numCount))
        .to.eventually.equal(1)
        .notify(done);
    });
    it('deletes .by_id', function(done) {
      let before;
      expect(Responses.count()
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => {
            before = numCount;
            return Responses.read.all();
          })
          .then((records) => records[0].id)
          .then((id) => Responses.del.by_id(id))
          .then(() => Responses.count())
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
