'use strict';
import _ from 'lodash';
import chai from 'chai';
import chaiAP from 'chai-as-promised';
chai.use(chaiAP);
const expect = chai.expect;

import knex from '../../../../server/db/config';

import modelDecks from '../../../../sever/db/models/Decks';
import modelQuestions from '../../../../sever/db/models/Questions';
import modelKeywords from '../../../../sever/db/models/Keywords';
import modelGames from '../../../../sever/db/models/Games';
import modelUsers from '../../../../sever/db/models/Users';

const Decks = modelDecks(knex);
const Questions = modelQuestions(knex);
const Keywords = modelKeywords(knex);
const Games = modelGames(knex);
const Users = modelUsers(knex);

import modelJoins from '../../../../sever/db/models/Joins';

const QuestionsKeywords = modelJoins(knex, "QUESTIONS_KEYWORDS", "question", "keyword");
const UsersDecks = modelJoins(knex, "USERS_DECKS", "user", "deck");
const DecksQuestions = modelJoins(knex, "DECKS_QUESTIONS", "deck", "question");
const GamesPlayers = modelJoins(knex, "GAMES_PLAYERS", "player", "game");



const LAST_NAMES = ["Hartnell", "Troughton", "Pertwee", "Baker", "Davidson", "McCoy", "McGann", "Hurt", "Ecclestone", "Tennant", "Smith", "Capaldi"];
const FIRST_NAMES = ["William", "Patrick", "Jon", "Tom", "Peter", "Colin", "Sylvester", "Paul", "John", "Christopher", "David", "Matt", "Peter"];



/*
Our database:
  users: Alice, Bob, Carol.
  Alice creates a deck "quack" with question "what is duck" an starts a game "duckgame"
     He invites Bob but not carla.
  Bob creates a deck "moo" with questions "what is cow" and "what is bull" and stats a game "cowgame"
    and invites Alice and Carol.
  Carol creates a deck "neigh" with question "what is horse" and invites Alice to "horsegame".
  Calla creates a deck "baa" with question "what is sheep"and invites Bob. to "sheepgame"
*/

const hydrateDB = () => {
  let store = {};

  const addUsersToDb = (usersNames) => new Promise((resolve, reject) => {

    Promise.all(usersNames.map((loginName) => {
      store.users[loginName] = userCreate(loginName);
      return Users.create(store.users[loginName])
        .then((uid) => {
          store.users[loginName].uid = uid[0];
          return store.users[loginName];
        })

      }))
      .then((usersAndIds) => resolve(usersAndIds))
    })
    /// use above, not below, need to go to dinner



  return new Promise ((resolve, reject) => {
    Promise.all(["Alice", "Bob", "Carol"].map((loginName) => {
    store.users[loginName] = userCreate(loginName);
    return Users.create(userCreate(loginName))
      .then((uid) => {
        store.users[loginName].uid = uid[0];
        return store.users[loginName];
      })
  }
    return Users.create(userCreate(loginName)))
  }
    .then((userIds) => userIds.map((id) => id[0]))
    .then((uIds) => {

      return  Promise.all(uIds.map((uid) => Users.read.by_uid(uid)))

    })


    .then((records) => Promise.all(records.map((record) => {
      if(record.login === "Alice"){
        return Decks.create({
          created_by: record.uid,
          is_public: true,
          title: "quack",
          subject: "farm"
        });
      } else if (record.login === "Bob"){
        return Decks.create({
          created_by: record.uid,
          is_public: true,
          title: "moo",
          subject: "farm"
        });
      } else if (record.login === "Carol") {
          return Promise.all([Decks.create({
            created_by: record.uid,
            is_public: true,
            title: "neigh",
            subject: "farm",
          }),
          Decks.create({
            created_by: record.uid,
            is_public: true,
            title: "baa",
            subject: "farm",
          })]);
      }
    })));
    .then((deckIds) => Promise.all())
    // then do qestions next.





}
// describe('Model: Keywords', function() {
//   before(function(done) {
//     // clear all items from the test DB.
//     clearDB(done);
//   });
//
//   it('should start from a clear test database', function(done) {
//     expect(Keywords.count()
//         .then((c) => parseInt(c[0].count)))
//       .to.eventually.equal(0)
//       .notify(done);
//   });
//
//   describe('Keywords.count()', function() {
//     it('should count the keywords', function(done) {
//       expect(Keywords.count()
//           .then((c) => !isNaN(c[0].count)))
//         .to.eventually.equal(true)
//         .notify(done);
//     });
//   });
//
//   describe('Keywords.create()', function() {
//     it('should create a keyword', function(done) {
//       this.timeout(10000);
//
//       expect(Keywords.create({
//             word: "Maths"
//           })
//           .then((idObj) => idObj[0]))
//         .to.eventually.be.a('Number')
//         .notify(done);
//     });
//     it('should confirm we have one record', function(done) {
//       expect(Keywords.count()
//           .then((c) => parseInt(c[0].count)))
//         .to.eventually.equal(1)
//         .notify(done);
//     });
//     it('should be the record we just entered', function(done) {
//       expect(Keywords.read.by_word("Maths")
//           .then((r) => r[0])
//           .then((r) => r.hasOwnProperty('id') && !isNaN(r.id) && r.word === "Maths"))
//         .to.eventually.equal(true)
//         .notify(done);
//     });
//   });
//
//   describe('Keywords.read', function() {
//     before(function(done) {
//       clearDB(() => {
//         Promise.all(["Science", "Technology", "Engineering", "Arts", "Mathmatics"].map((subj) => Keywords.create({
//           word: subj
//         }))).then(() => done());
//       });
//     });
//     it('reads with a manually inserted by', function(done) {
//       expect(Keywords.read('word')("Technology")
//           .then((r) => r[0])
//           .then((r) => r.hasOwnProperty('id') && !isNaN(r.id) && r.word === "Technology"))
//         .to.eventually.equal(true)
//         .notify(done);
//     });
//     it('reads .by_word', function(done) {
//       expect(Keywords.read.by_word("Arts")
//           .then((r) => r[0])
//           .then((r) => r.hasOwnProperty('id') && !isNaN(r.id) && r.word === "Arts"))
//         .to.eventually.equal(true)
//         .notify(done);
//     });
//     it('reads .all', function(done) {
//       expect(Keywords.read.all())
//         .to.eventually.be.an('Array')
//         .with.length(5)
//         .notify(done);
//     });
//   });
//
//   describe('Keywords.update', function() {
//     before(function(done) {
//       clearDB(() => {
//         Promise.all(["Science", "Technology", "Engineering", "Arts", "Mathmatics"].map((subj) => Keywords.create({
//             word: subj
//           })))
//           .then(() => done());
//       });
//     });
//     it('updates by arbitrary convention', function(done) {
//       expect(Keywords.update('word')("Mathmatics", {
//             word: "Maths"
//           })
//           .then(() => Keywords.read.by_word('Maths'))
//           .then((r) => {
//             r = r[0];
//             let a = r.hasOwnProperty('id');
//             let b = !isNaN(r.id);
//             let c = r.word === "Maths";
//             return a && b && c;
//           }))
//         .to.eventually.equal(true)
//         .notify(done);
//     });
//     it('updates .by_id', function(done) {
//       let myId;
//       expect(Keywords.read.by_word('Arts')
//           .then((records) => {
//             myId = records[0].id;
//             return myId;
//           })
//           .then((id) => Keywords.update.by_id(id, {
//             word: "Arts & Crafts"
//           })
//           .then(() => Keywords.read.by_word("Arts & Crafts")))
//           .then((records) => records[0].id === myId))
//         .to.eventually.equal(true)
//         .notify(done);
//     });
//   });
//
//   describe('Keywords.del', function() {
//     before(function(done) {
//       clearDB(() => {
//         Promise.all(["Science", "Technology", "Engineering", "Arts", "Mathmatics"].map((subj) => Keywords.create({
//             word: subj
//           })))
//           .then(() => done());
//       });
//     });
//     it('deletes by arbitrary convention', function(done) {
//       let before;
//       expect(Keywords.count()
//           .then((counts) => parseInt(counts[0].count))
//           .then((numCount) => {
//             before = numCount;
//             return Keywords.del('word')('Science');
//           })
//           .then(() => Keywords.count())
//           .then((counts) => parseInt(counts[0].count))
//           .then((numCount) => before - numCount))
//         .to.eventually.equal(1)
//         .notify(done);
//     });
//     it('deletes .by_id', function(done) {
//       let before;
//       let myId;
//       expect(Keywords.count()
//           .then((counts) => parseInt(counts[0].count))
//           .then((numCount) => {
//             before = numCount;
//             return Keywords.read.by_word("Technology");
//           })
//           .then((records) => {
//             myId = records[0].id;
//             return myId;
//           })
//           .then((id) => Keywords.del.by_id(id))
//           .then(() => Keywords.count())
//           .then((counts) => parseInt(counts[0].count))
//           .then((numCount) => before - numCount))
//         .to.eventually.equal(1)
//         .notify(done);
//     });
//   });
// });
