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
  Carol creates a deck "baa" with question "what is sheep"and invites Bob. to "sheepgame"
*/

const hydrateDB = () => {
    const EXAMPLE_USERS = ["Alice", "Bob", "Carol"]

    const writeAndGetBackWithId = (recordObj, model) => model.create(recordObj)
      .then((recordId) => Object.assign(recordObj, {
        id: recordId[0]
      }));

    const writeUserAndGetBackWithId = (userObj) => Users.create(userObj)
      .then((userId) => Object.assign(userObj, {
        uid: userId[0]
      }));

    const addUsersToDb = (usersNames) =>
      Promise.all(usersNames.map((loginName) => writeUserAndGetBackWithId(userCreate(loginName))));

    return addUsersToDb(EXAMPLE_USERS)
      .then((usersRecords) => usersRecords.reduce((pv, uRecord) =>
        Object.assign(pv, {
          [uRecord.login]: uRecord
        })), {})
      .then((uRecordObj) => Promise.all([
          uRecordObj,
          Promise.all([
            writeAndGetBackWithId({
              created_by: uRecordObj.Alice.uid,
              is_public: true,
              title: "quack",
              subject: "farm"
            }, Decks),
            writeAndGetBackWithId({
              created_by: uRecordObj.Bob.uid,
              is_public: true,
              title: "moo",
              subject: "farm"
            }, Decks),
            writeAndGetBackWithId({
              created_by: uRecordObj.Carol.uid,
              is_public: true,
              title: "neigh",
              subject: "farm",
            }, Decks),
            writeAndGetBackWithId({
              created_by: uRecordObj.Carol.uid,
              is_public: true,
              title: "baa",
              subject: "farm",
            }, Decks)
          ]),
          Promise.all([
            writeAndGetBackWithId({
              created_by: uRecordObj.Alice.uid,
              is_public: true,
              type: "open",
              category: "farm animals",
              prompt: "What is Duck?",
              choices: "",
              answer: "bird",
              point_value: 100,
            }, Questions),
            writeAndGetBackWithId({
              created_by: uRecordObj.Bob.uid,
              is_public: true,
              type: "open",
              category: "farm animals",
              prompt: "What is Cow?",
              choices: "",
              answer: "mammal",
              point_value: 100,
            }, Questions),
            writeAndGetBackWithId({
              created_by: uRecordObj.Bob.uid,
              is_public: true,
              type: "open",
              category: "farm animals",
              prompt: "What is Bull?",
              choices: "",
              answer: "mammal",
              point_value: 100,
            }, Questions),
            writeAndGetBackWithId({
              created_by: uRecordObj.Bob.uid,
              is_public: true,
              type: "open",
              category: "farm animals",
              prompt: "What is Bull?",
              choices: "",
              answer: "mammal",
              point_value: 100,
            }, Questions),
            writeAndGetBackWithId({
              created_by: uRecordObj.Carol.uid,
              is_public: true,
              type: "open",
              category: "farm animals",
              prompt: "What is Horse?",
              choices: "",
              answer: "mammal",
              point_value: 100,
            }, Questions),
            writeAndGetBackWithId({
              created_by: uRecordObj.Bob.uid,
              is_public: true,
              type: "open",
              category: "farm animals",
              prompt: "What is sheep?",
              choices: "",
              answer: "mammal",
              point_value: 100,
            }, Questions)
          ]),
        ])
        .then((resolutions) => ({
          users: resolutions[0],
          decks: resolutions[1].reduce((pv, dRecord) =>
            Object.assign(pv, {
              [dRecord.title]: dRecord
            }), {}),
          questions: resolutions[2].reduce((pv, qRecord) =>
            Object.assign(pv, {
              [qRecord.prompt]: qRecord
            }), {}),
        }))
        .then((res) => Promise.all([
          res,
          Promise.all([writeAndGetBackWithId({
              roomcode: "AAAA",
              created_by: res.users.Alice.uid,
              deck: res.decks.quack.id,
            }, Games),
            writeAndGetBackWithId({
              roomcode: "BBBB",
              created_by: res.users.Bob.uid,
              deck: res.decks.moo.id,
            }, Games),
            writeAndGetBackWithId({
              roomcode: "CCCC",
              created_by: res.users.Carol.uid,
              deck: res.decks.neigh.id,
            }, Games),
            writeAndGetBackWithId({
              roomcode: "DDDD",
              created_by: res.users.Carol.uid,
              deck: res.decks.baa.id,
            }, Games)
          ])
        ]))
        .then((resolutions) => Object.assign(resolutions[0], {
          games: resolutions[1].reduce((pv, gRecord) =>
            Object.assign(pv, { [gRecord.roomcode]: gRecord }), {})
          })
        ));

};

describe("foo", function(){
  it('hydrates the DB', function(done){
    hydrateDB().then((res) => {
      console.log(res);
    })
    .then(() => done());
  });
});
