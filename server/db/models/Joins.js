'use strict';

// not strictly needed but allows us to copy/paste this code to create other models.
import { addByMethods } from '../util';


export const joinModel = (knex, tablename, firstRef, secondRef) => {

  // adds a record to the db.
  const create = (creationObject) => knex(tablename)
    .insert({
      firstRef: creationObject[firstRef],
      secondRef: creationObject[secondRef]
    })
    .returning('id');

  // creates a curry to read by a particular value.
  let read = (by) => (lookup) => knex(tablename)
    .where({ [by]: lookup })
    .select();

  // another special case.
  read.all = () => knex(tablename).select();

  let update = (by) => (lookup, updateData) => knex(tablename)
    .where({ [by]: lookup })
    .update(updateData);


  let del = (by) => (lookup) => knex(tablename)
    .where({ [by]: lookup })
    .del();

  addByMethods(read, ['id', firstRef, secondRef]);
  addByMethods(update, ['id', firstRef, secondRef]);
  addByMethods(del, ['id', firstRef, secondRef]);

  const count = () => knex(tablename).count('*');

  return {
    create,
    read,
    update,
    del,
    count,
  };
};

export const Questions_Keywords = (knex) => joinModel(knex, "QUESTIONS_KEYWORDS", "question", 'keyword');
export const Users_Decks = (knex) => joinModel(knex, "USERS_DECKS", "user", "deck");
export const Decks_Questions = (knex) => joinModel(knex, "DECKS_QUESTIONS", "deck", "question");
export const Games_Players = (knex) => joinModel(knex, "GAMES_PLAYERS", "player", "game");
