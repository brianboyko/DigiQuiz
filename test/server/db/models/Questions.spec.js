'use strict';
import _ from 'lodash';
import chai from 'chai';
import chaiAP from 'chai-as-promised';
chai.use(chaiAP);
const expect = chai.expect;

import knex from '../../../../server/db/config';
import modelQuestions from '../../../../server/db/models/Questions';
import modelUsers from '../../../../server/db/models/Users';
const Users = modelUsers(knex);
const Questions = modelQuestions(knex);

const fakeUser = {
  login: "questionMaker",
  password: "somehashedpass",
  email: 'something@fake.com',
  first_name: "Fake",
  last_name: "Faker"
};

const fakeQuestion = {
  is_public: true,
  type: 'multiple_choice',
  category: 'sports',
  prompt: 'Who run bartertown?',
  choices: JSON.stringify({
    A: 'Master Blaster',
    B: 'Tina Turner',
    C: 'Mad Max',
    D: 'Really Mad Max'
  }),
  answer: "A",
};

const generateFakeUsers = (num) => {
  let fakes = [];
  for (let i = 0; i < num; i++) {
    fakes.push({
      login: "L" + Math.random()
        .toString(),
      password: "P" + Math.random()
        .toString(),
      email: "E" + Math.random()
        .toString(),
      first_name: "F" + Math.random()
        .toString(),
      last_name: "N" + Math.random()
        .toString(),
    });
  }
  return fakes;
};

const generateFakeQuestions = (num) => {
  let fakes = [];
  let fakeUsers = generateFakeUsers(num);

  return new Promise((resolve, reject) => {
    Promise.all(fakeUsers.map((fakeU) => Users.create(fakeU)))
      .then((uids) => {
        uids.forEach((uid, i) => {
          fakes.push({
            created_by: uid[0],
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
            answer: "B",
          });
        });
        resolve(fakes);
      });
  });
};

const clearDB = (done) => {
  Promise.all([
      Questions.read.all()
      .then((records) => records.map((r) => r.id))
      .then((ids) => Promise.all(ids.map((id) => Questions.del.by_id(id)))),
      Users.read.all()
      .then((records) => records.map((r) => r.uid))
      .then((uids) => Promise.all(uids.map((uid) => Users.del.by_uid(uid))))
    ])
    .then(() => done());
};

let store = {};

describe('Model: Questions', function() {
  before(function(done) {
    // clear all questions and users from the test DB.
    clearDB(done);
  });

  it('should start from a clear test database', function(done) {
    expect(Questions.count()
        .then((c) => parseInt(c[0].count)))
      .to.eventually.equal(0)
      .notify(done);
  });

  describe('Questions.count()', function() {
    it('should count the questions', function(done) {
      expect(Questions.count()
          .then((c) => !isNaN(c[0].count)))
        .to.eventually.equal(true)
        .notify(done);
    });
  });

  describe('Questions.create()', function() {
    it('should create a Question', function(done) {
      this.timeout(10000);
      expect(Users.create(fakeUser)
          .then((uid) => {
            store.uid = uid[0];
            return Questions.create(Object.assign({
              created_by: uid[0]
            }, fakeQuestion));
          })
          .then((id) => id[0]))
        .to.eventually.be.a('Number')
        .notify(done);
    });
    it('should confirm we have one record', function(done) {
      expect(Questions.count()
          .then((c) => parseInt(c[0].count)))
        .to.eventually.equal(1)
        .notify(done);
    });
    it('should be the record we just entered', function(done) {
      expect(Questions.read.by_created_by(store.uid)
          .then((r) => r[0])
          .then((r) => _.pick(r, ["is_public", "type", "category", "prompt", "choices", 'answer'])))
        .to.eventually.eql(fakeQuestion)
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });

  });

  describe('Questions.read', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeQuestions(5)
          .then((fakeQs) => {
            fakes = fakeQs;
            return Promise.all(fakes.map((fake) => Questions.create(fake)));
          })
          .then(() => done());
      });
    });
    it('reads with a manually inserted by', function(done) {
      expect(Questions.read('prompt')(fakes[0].prompt)
          .then((r) => _.pick(r[0], ['created_by', "is_public", "type", "category", "prompt", "choices", 'answer'])))
        .to.eventually.eql(fakes[0])
        .notify(done);
    });
    it('reads .by_created_by', function(done) {
      expect(Promise.all(fakes.map((fake) => Questions.read.by_created_by(fake.created_by)))
          .then((recs) => recs.map((rec) => rec[0]))
          .then((recs) => recs.map((r) =>
            _.pick(r, ['created_by', "is_public", "type", "category", "prompt", "choices", 'answer']))))
        .to.eventually.eql(fakes)
        .notify(done);
    });
    it('reads .all', function(done) {
      expect(Questions.read.all())
        .to.eventually.be.an('Array')
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });
  });

  describe('Questions.update', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeQuestions(5)
          .then((fakeQs) => {
            fakes = fakeQs;
            return Promise.all(fakes.map((fake) => Questions.create(fake)));
          })
          .then(() => done());
      });
    });
    it('updates by arbitrary convention', function(done) {
      expect(Questions.update('category')("q0", {
            "answer": "D"
          })
          .then(() => Questions.read('category')('q0'))
          .then((records) => records[0])
          .then((record) => record.answer))
        .to.eventually.equal("D")
        .notify(done);
    });
    it('updates .by_id', function(done) {
      let thisID;
      expect(Questions.read('category')('q2')
          .then((records) => records[0].id)
          .then((id) => {
            thisID = id;
            return Questions.update.by_id(id, {
              answer: "E"
            });
          })
          .then(() => Questions.read.by_id(thisID))
          .then((records) => records[0])
          .then((record) => record.answer))
        .to.eventually.equal("E")
        .notify(done);
    });
    after(function(done) {
      clearDB(done);
    });
  });

  describe('Questions.del', function() {
    let fakes;
    before(function(done) {
      clearDB(() => {
        generateFakeQuestions(5)
          .then((fakeQs) => {
            fakes = fakeQs;
            return Promise.all(fakes.map((fake) => Questions.create(fake)));
          })
          .then(() => done());
      });
    });
    it('deletes by arbitrary convention', function(done) {
      let before;
      expect(Questions.count()
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => {
            before = numCount;
            return Questions.del('category')(fakes[0].category);
          })
          .then(() => Questions.count())
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => before - numCount))
        .to.eventually.equal(1)
        .notify(done);
    });
    it('deletes .by_id', function(done) {
      let before;
      expect(Questions.count()
          .then((counts) => parseInt(counts[0].count))
          .then((numCount) => {
            before = numCount;
            return Questions.read.all();
          })
          .then((records) => records[0].id)
          .then((id) => Questions.del.by_id(id))
          .then(() => Questions.count())
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
